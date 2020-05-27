const path = require('path')
const crypto = require('crypto')

function githubWebHooks(req, res) {
  const sign = req.get('X-Hub-Signature')
  const event = req.get('X-GitHub-Event')
  const ref = req.body.ref
  const shellPath = path.resolve('./github_push.sh')
  console.log(ref === 'refs/heads/master')
  console.log(event === 'push')
  console.log(verifySecret(req.body, sign))
  if (ref === 'refs/heads/master' && event === 'push' && verifySecret(req.body, sign)) {
    runCmd('sh', [shellPath], (result) => {
      res.send(result)
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
}

module.exports = {
  githubWebHooks
}
