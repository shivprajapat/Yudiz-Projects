const test = {
  PORT: process.env.PORT || 7001,
  ENV: 'test',
  EMPLOYEE_DB_URL: 'mongodb://localhost:27017/resource_managementtest',
  EMPLOYEE_DB_URL_BACK_UP: 'mongodb://localhost:27017/resource_managementtest',
  JWT_SECRET: 'resources_management#yudiz',
  JWT_VALIDITY: '365d',
  MAIL_TRANSPORTER: {
    service: process.env.SMTP_SERVICES || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USERNAME || 'test321240@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'jrtgxhnpdkegbxhp'
    },
    secure: false,
    requireTLS: false
  },
  PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzftQUP2TnEYhQDNXbPTO
ycxgROnuIPL8ZnGuinn+ibSdLrMlfe07brSCpfMS508fpaySYGfKGRB4Y/NU+2Ac
xwbbwLvgO8qf/+X1sSjElCRQkch/qPmbVRKuqlTejoB7Fvt7rDlVsDmoE6C9My31
ou+gQyisCQvi99+iyE3mDEESu5qv7YnuEIS3KqE6LJ/c2tHX+8fXVy7LFNv7RCvw
EctCMC6Enm426wnc6QHi0HDrprmkWM0ecS4Ls30F8yjO327/NMnDD/7ZY/4kT1Fl
1cpmLnmHP7WmJ3uDkbFlcyjoSv8Qc5Xwua7PWj8KXHNJZ65uMTslNs9mb+nbg/cF
gQIDAQAB
-----END PUBLIC KEY-----`,
  PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDN+1BQ/ZOcRiFA
M1ds9M7JzGBE6e4g8vxmca6Kef6JtJ0usyV97TtutIKl8xLnTx+lrJJgZ8oZEHhj
81T7YBzHBtvAu+A7yp//5fWxKMSUJFCRyH+o+ZtVEq6qVN6OgHsW+3usOVWwOagT
oL0zLfWi76BDKKwJC+L336LITeYMQRK7mq/tie4QhLcqoTosn9za0df7x9dXLssU
2/tEK/ARy0IwLoSebjbrCdzpAeLQcOumuaRYzR5xLguzfQXzKM7fbv80ycMP/tlj
/iRPUWXVymYueYc/taYne4ORsWVzKOhK/xBzlfC5rs9aPwpcc0lnrm4xOyU2z2Zv
6duD9wWBAgMBAAECggEAT307inXBIB6kOE1X4LE8l/2p7Q5FmiuLIdGfJMtdYjD0
M5Bo2IbTV66LeJUsZ11OfjXxqwiColeLzi6aTgPSNzA7X85hA1H3mt5YiUyNSAoX
mZrBQSlKO3NhOlRUKrQETGMyX80kd0RYy3JNcVG8KGvG8gPhGAChTzzbaec97t4A
pda/xjPNpjQAjPyhmJ67F2diW0hdOhbp9NR6j/nmZxY66KdE88D6v60jN8Rl85i+
nmyY9lTQaU0lC3TFeDM19BUVW3YchKT3gNj5xYBIzPlRl5+lLH4Uk4l/M0YpROi/
WTt1SLRg6OzLF4dTWok0+T3z+uSj76PkFDt1jLv5nQKBgQDpQzLprih8P9Eb/dzG
iEwD3TLv6G6aKnLgTJ58Zqt9Y3A/bTz/sz4GykFaTE45Ob1LBFXE/8DX+9ouLbEu
p4XfZu7QWm/vl0Ba0WI29B99Z6NL8e8W3vAhxbdMGZrG5UCwf/TPioIpVtXgtEoS
bIdwIlTBb/+2zyAR9jchpHVZowKBgQDiD1p3uGAUYJocYnQdwK/CidF1iVC1/6Np
Li+3HqS2PyrHVdrcEgcY1I3kzFc1lqykGCtqyqvx79xuJGmi6dlugt2OP7rY63v1
uQSVj885SJu+ps+ld6pUCDmWAzbK0WGhf83J3ztXGQTsS/I/MEhUdAjWPK+itq4b
qInDiazeiwKBgQDKdQrRi9mTzgf/FZ3zqwTfLbQySjkFEebXC2lba/lYQWCBjJyv
CrHBTvbeGvCh9p13aPHQpHKKhAvgnMP2TGyDdGG+8V/KQisXKDjonYZfX/55wijU
XvdpOKRZJrgR/ZTiHI0tPXivzLCh8ZmA2DXNe964bi8ySh/5twwu5QD9pQKBgQDG
C1tffSi3UXZSHbLKig+w59qYFSefeoln0S2+SNtWSnqozb+Cg0yyZSy2YIqaiRlQ
XVhUI6CFwXSlDcN6FVMGrSF6yLxh49PijyfD+4w5DDJd0Xgi53ZSTi5dDQ3Im6zj
trrL+4TaJjIY7eQZlawYSNuhDON2MoLP+lRO+WN4RwKBgQC4BOJ62XrKxwHLOK4m
e1+7PJnnM+lARSdYJr/A/t8Uy3zDspyzWV0Rzz2S4FWXLqnxmaNO2Q6MNNlEgbqP
U8k8oAsZfs1cAXHTN9uye4BqSevtZh8y17VCNBtFoF72XaWHRaPcxXNJrMgy3gNv
ESMyHbOMdL5kjfsL6kx+SDnu7Q==
-----END PRIVATE KEY-----`,
  TOKEN_LIMIT: 5,
  SALT: 10,
  REDIS_HOST: 'redis-18950.c11.us-east-1-3.ec2.cloud.redislabs.com',
  REDIS_PORT: 18950,
  REDIS_PASSWORD: 'tnqUd4TtSmw4MUnLN7oaWybFwviDpJfN',
  threshold: 10,
  downloadThreshold: 1,
  local: '127.0.0.1',
  Region: 'ap-south-1',
  S3_BUCKET_NAME: 'jr-web-developer',
  AWS_ACCESS_KEY_ID: 'AKIAVEG4UMFNLMWKO2NW',
  AWS_SECRET_ACCESS_KEY: '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',
  s3UserProfile: 'Users/profile',
  s3EmployeeProfile: 'Employee/profile',
  s3AdminProfile: 'Admin/profile',
  s3SubAdminProfile: 'SubAdmin/profile',
  s3Project: 'Project',
  s3Excel: 'Excel',
  s3Organization: 'Organization',
  s3Employee: 'Employee',
  s3Technology: 'Technology',
  frontUrl: 'localhost:3000/',
  fireBasePushNotification: {
    databaseURL: 'https://resource-management-1c3f5-default-rtdb.firebaseio.com'
  },
  resetLink: 'localhost:3000/reset-password?token=add_token&type=reset-link',
  environment: 'test',
  auth: {
    type: 'OAuth2',
    user: 'pranav.kakadiya@yudiz.com',
    clientId: '203916001251-umcaatlm3clsp1qdba0vl3op19akmgfp.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04vQA9yuXqjKoCgYIARAAGAQSNwF-L9IrexqN80-4xFW1d9jJsv_JJ1WBirmbKjjAXbKTXUwd0LCRe80sW6O4DqJ5Rn0uV6mV60c',
    redirect_uri: 'https://developers.google.com/oauthplayground'
  },
  mailoptions: {
    from: 'Pranav <pranav.kakadiya@yudiz.com>',
    to: 'zarna.p@yudiz.com',
    subject: 'Gmail API NodeJS'
  },
  sendGrid: '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',
  urlPrefix: 'localhost:3000/',
  setLink: '',
  USERS_DB_URL: ''

}

module.exports = test
