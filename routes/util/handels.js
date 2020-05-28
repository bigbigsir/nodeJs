const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')

function githubWebHooks(req, res) {
  const sign = req.get('X-Hub-Signature')
  const event = req.get('X-GitHub-Event')
  const ref = req.body.ref
  const modified = req.body.head_commit.modified
  const nginxConf = modified.includes('nginx.conf')
  const packageJson = modified.includes('package.json')
  const shellPath = path.resolve('./github_push.sh')
  if (ref === 'refs/heads/master' && event === 'push' && verifySecret(req.body, sign)) {
    runCmd('sh', [shellPath, nginxConf, packageJson], (result) => {
      res.send(result)
      crateVersionHtml(req.body)
    })
  } else {
    res.send({ success: false })
  }

  function runCmd(cmd, args, cb) {
    let result = ''
    const spawn = require('child_process').spawn
    const child = spawn(cmd, args)

    child.stdout.on('data', (data) => {
      result += data.toString()
      console.log('stdout data:\n', result)
    })

    child.stderr.on('data', (data) => {
      result += data.toString()
      console.log(`stderr data:\n ${data}`)
    })

    child.stdout.on('end', (end) => {
      console.log('stdout end', end, '\n')
    })

    child.stderr.on('end', (end) => {
      console.log('stderr end', end, '\n')
    })

    child.on('error', function (data) {
      console.log('child error', data.toString())
    })

    child.on('close', (code) => {
      cb(result)
      console.log(`child close 进程退出，退出码 ${code}`)
    })
  }

  function verifySecret(payload, sign) {
    payload = JSON.stringify(payload)
    const secret = 'e6f2511e790e05e769416bb4d4603d602943d314'
    const localSign = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex')
    return localSign === sign
  }

  function crateVersionHtml(body) {
    const version = {
      project: body.repository.name,
      commit: body.head_commit.id,
      committer: body.head_commit.committer.name,
      committerEmail: body.head_commit.committer.email,
      commitDate: moment(new Date(body.head_commit.timestamp)).format('YYYY-MM-DD hh:mm:ss')
    }
    ejs.renderFile(path.resolve('./views/version.ejs'), { version }, (err, str) => {
      const html = err ? `<pre>${err}</pre>` : str
      fs.writeFile(path.resolve('./public/version.html'), html, (err) => {
        if (err) console.log(err)
      })
    })
  }
}

module.exports = {
  githubWebHooks
}
