/**
 * @description 登录/注册需要获取公钥加密后发送，密码字段不可逆加密保存到数据库
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict'

require('colors')
const Fs = require('fs')
const Crypto = require('crypto')
const express = require('express')
const CronJob = require('cron').CronJob
const Jwt = require('../common/token')
const languages = require('../language')
const { api } = require('./api')
const router = express.Router()

let language

const reduce = {
  // 登录
  signIn() {
    const { reqParam: query } = this.params
    const password = query.password
    delete query.password
    return verifyCaptcha(query).then(() => {
      delete query.uuid
      delete query.captcha
      api.params = this.params
      return api.findOne(true)
    }).then(({ data }) => {
      if (data && data.password === generateHmac(decrypt(password))) {
        const token = Jwt.generateToken(data.id)
        return { token }
      } else {
        return Promise.reject({ msg: language.wrongPassword })
      }
    })
  },
  // 注册
  signUp() {
    const { reqParam: doc } = this.params
    return verifyCaptcha(doc).then(() => {
      delete doc.uuid
      delete doc.captcha
      if (doc.password) {
        doc.password = generateHmac(decrypt(doc.password))
        api.params = this.params
        return api.add()
      } else {
        return Promise.reject('Passwords are a must')
      }
    })
  },
  // 登出
  signOut(req, res) {
    res.clearCookie('token')
    return Promise.resolve({})
  },
  // 修改密码
  changePassword() {
    const { reqParam: query, collection } = this.params
    const password = query.password
    const originalPassword = query.originalPassword
    delete query.password
    delete query.originalPassword
    if (password && originalPassword) {
      api.params = {
        collection,
        reqParam: {
          password: generateHmac(decrypt(originalPassword))
        }
      }
      if (query.id) {
        // 如果有id，则使用id匹配数据
        Object.assign(api.params.reqParam, { id: query.id })
      } else {
        // 如果没有id，这使用所有请求参数匹配
        Object.assign(api.params.reqParam, query)
      }
      return api.findOne().then(({ data }) => {
        if (data) {
          api.params = {
            collection,
            reqParam: {
              ...query,
              password: generateHmac(decrypt(password))
            }
          }
          return api.updateOne(null, [])
        } else {
          return Promise.reject({ msg: language.wrongPassword })
        }
      })
    } else {
      return Promise.reject('Missing Parameters')
    }
  },
  // 获取当前登录用户信息
  getUserInfo(req) {
    const { collection } = this.params
    const token = req.cookies.token || req.headers.authorization
    return Jwt.verifyToken(token).then(({ data }) => {
      api.params = {
        collection,
        reqParam: { id: data }
      }
      return api.findOne()
    }).then((data) => {
      if (data.data) return data
      else return Promise.reject()
    }).catch(() => {
      return Promise.reject({
        code: 401,
        msg: language.tokenInvalid
      })
    })
  }
}

// 验证验证码
function verifyCaptcha(param) {
  const uuid = param.uuid
  const captcha = param.captcha
  if (!uuid && !captcha) return Promise.resolve(null)
  api.params = {
    collection: '_captcha',
    reqParam: { uuid, captcha }
  }
  return api.findOne().then(({ data }) => {
    if (!data) {
      return Promise.reject({
        msg: language.wrongVerification
      })
    } else if (data.createDate + 1000 * 60 < Date.now()) {
      return Promise.reject({
        msg: language.expiredVerification
      })
    } else {
      api.remove()
    }
  })
}

// 解密密文
function decrypt(cipherText) {
  if (cipherText.length < 30) return cipherText
  const privateKey = Fs.readFileSync('./pem/rsa_private_key.pem').toString()
  const buffer = Buffer.from(cipherText, 'base64')
  const decrypted = Crypto.privateDecrypt({
    key: privateKey,
    padding: Crypto.constants.RSA_PKCS1_PADDING
  }, buffer)
  return decrypted.toString()
}

// Hmac加密
function generateHmac(str) {
  const privateKey = Fs.readFileSync('./pem/rsa_private_key.pem')
  const md5 = Crypto.createHmac('md5', privateKey)
  return md5.update(str).digest('hex')
}

router.all('/*', (req, res, next) => {
  const reqParam = req._requestParam
  const path = req.url.replace(/(^\/)|(\?[\s\S]*)/g, '').split('/')
  const handle = path.pop()
  const collection = 'user'
  const params = { reqParam, collection }
  language = languages[req._language] ? languages[req._language] : languages['zh-CN']
  if (reduce.hasOwnProperty(handle)) {
    reduce.params = params
    reduce[handle](req, res).then(data => {
      data = Object.assign({
        ok: 1,
        msg: 'success'
      }, data)
      res.send(data)
    }).catch(err => {
      if (typeof err.msg === 'string') {
        err = Object.assign({
          ok: 0,
          msg: language.errorMsg
        }, err)
      } else {
        err = { ok: 0, msg: language.errorMsg, error: err.toString() }
        console.log('User Route Error:\n'.red.bold, err, '\n')
      }
      res.send(err)
    })
  } else {
    next()
  }
})

module.exports = router

// 定时任务 每天04点0分0秒执行,清除验证码集合
new CronJob('0 0 4 * * *', function () {
  api.params = {
    collection: '_captcha',
    reqParam: {}
  }
  api.remove(true)
}, null, true)
