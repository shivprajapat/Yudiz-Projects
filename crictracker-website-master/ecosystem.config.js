module.exports = {
  apps: [{
    name: 'app1',
    script: './node_modules/.bin/next',
    autorestart: true,
    args: 'start --keepAliveTimeout 60000 -p 3000',
    env: {
      NEXT_SHARP_PATH: '/home/node/.npm-global/lib/node_modules/sharp'
    }
  }]
}
