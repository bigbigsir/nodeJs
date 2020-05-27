/**
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict'

const fs = require('fs')
const jwt = require('jsonwebtoken')

// 生成token
function generateToken(userId) {
  const weeHours = new Date().setHours(0, 0, 0, 0) / 1000
  const key = fs.readFileSync('./pem/rsa_private_key.pem')// 私钥 可以自己生成
  return jwt.sign({
    data: userId,
    exp: weeHours + (60 * 60 * 24) // 过期时间（秒）（当日0点失效）
  }, key, { algorithm: 'RS256' })
}

// 校验token
function verifyToken(token) {
  const key = fs.readFileSync('./pem/rsa_public_key.pem')// 公钥 可以自己生成
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, { algorithms: ['RS256'] }, function (err, payload) {
      if (payload) {
        resolve(payload)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  generateToken,
  verifyToken
}
