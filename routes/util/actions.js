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
  const pullCode = path.resolve('./shell/pull_code.sh')
  const pm2Reload = path.resolve('./shell/pm2_reload.sh')
  if (ref === 'refs/heads/master' && event === 'push' && verifySecret(req.body, sign)) {
    runCmd('sh', [pullCode, nginxConf, packageJson], (message) => {
      res.send({
        success: true,
        message
      })
      crateVersionHtml(req.body)
      runCmd('sh', [pm2Reload], () => null)
    })
  } else {
    res.send({
      success: false,
      message: ''
    })
  }

  function runCmd(cmd, args, cb) {
    let stdout = ''
    let stderr = ''
    const spawn = require('child_process').spawn
    const child = spawn(cmd, args)

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.stdout.on('end', () => {
      console.log('stdout end=>\n', stdout)
    })

    child.stderr.on('end', () => {
      console.log('stderr end=>\n', stderr)
    })

    child.on('error', function (data) {
      console.log('child_process error', data.toString())
    })

    child.on('close', (code) => {
      cb(stdout)
      console.log(`child_process close 进程退出，退出码 ${code}`)
    })
  }

  function verifySecret(payload, sign) {
    payload = JSON.stringify(payload)
    const secret = 'e6f2511e790e05e769416bb4d4603d602943d314'
    const localSign = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex')
    return localSign === sign
  }

  function crateVersionHtml(body) {
    const format = 'YYYY-MM-DD hh:mm:ss'
    const version = {
      project: body.repository.name,
      commit: body.head_commit.id,
      committer: body.head_commit.committer.name,
      committerEmail: body.head_commit.committer.email,
      commitDate: moment(new Date(body.head_commit.timestamp)).format(format),
      pullDate: moment().format(format)
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
