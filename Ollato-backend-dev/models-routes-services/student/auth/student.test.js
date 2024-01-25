const request = require('supertest')
const { describe, it, before } = require('mocha')
const server = require('../../index')
const expect = require('expect')
const { status } = require('../../helper/api.responses')

let routes = {}
const store = {}

describe('student Auth management routes', () => {
  before(() => {
    routes = {
    //   register: '/api/user/auth/register/v1',
      login_with_password: '/api/v1/student/login-with-password',
      login_with_otp: '/api/v1/student/login-with-otp',
      login_with_verify_otp: '/api/v1/student/login-with-verify-otp',
      resetPassword: '/api/v1/student/reset-password',
      forgotPassword: '/api/v1/student/forgot-password',
      forgot_verification: '/api/v1/student/otp-verification',
      change_password: '/api/v1/student/change-password'
    //   logout: '/api/user/auth/logout/v1', // put
    }
    store.token = undefined
  })

  //     describe('/POST create user', () => {
  //     it('should not be create user', (done) => {
  //       const data = {
  //         sEmail: 'tuvijatvarma892@mail.com',
  //         sMobNum: '9169055341',
  //         sName: 'wic801',
  //         sPassword: 'wick20400',
  //         sUsername: 'tuvijatvarma892',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.NotFound)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.user_blocked)
  //           done()
  //         })
  //     })
  //     })

  //   describe('/POST create user', () => {
  //     it('should be create user', (done) => {
  //       const data = {
  //         sEmail: 'wi850@giil.com',
  //         sMobNum: '8040706305',
  //         sName: 'wic801',
  //         sPassword: 'wick20400',
  //         sUsername: 'wick807403',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz',
  //         sReferCode: '03rogj'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.reg_success)
  //           done()
  //         })
  //     })
  //     it('should not be create user', (done) => {
  //       const data = {
  //         sEmail: 'manan.m@yudiz.in',
  //         sMobNum: '9879855555',
  //         sName: 'manan',
  //         sPassword: '123456',
  //         sUsername: 'jay12',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.ResourceExist)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.already_exist.replace('##', 'Username'))
  //           done()
  //         })
  //     })
  //     it('should not be create user', (done) => {
  //       const data = {
  //         sEmail: 'manan.m@yudiz.in',
  //         sMobNum: '9898999551',
  //         sName: 'manan',
  //         sPassword: '123456',
  //         sUsername: 'ravi11',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.ResourceExist)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.already_exist.replace('##', 'Mobile number'))
  //           done()
  //         })
  //     })

  //     it('should not be create user', (done) => {
  //       const data = {
  //         sEmail: 'jaydeep.c@yudiz.in',
  //         sMobNum: '9879871234',
  //         sName: 'manan',
  //         sPassword: '123456',
  //         sUsername: 'ravi11',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.ResourceExist)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.already_exist.replace('##', 'Email'))
  //           done()
  //         })
  //     })
  //   })
  //   describe('/POST reset password', () => {
  //     it('should not be reset password for BOT user', (done) => {
  //       const data = {
  //         sCode: '1234',
  //         sNewPassword: 'test123',
  //         sLogin: '9169055341',
  //         sType: 'M',
  //         sAuth: 'F'
  //       }
  //       request(server)
  //         .post(routes.resetPassword)
  //         .send(data)
  //         .expect(status.NotFound)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.user_blocked)
  //           done()
  //         })
  //     })
  //   })

  //   describe('/POST Send otp', () => {
  //     it('should send otp for register to phone no ', (done) => {
  //       const data = {
  //         sLogin: '9879879879',
  //         sType: 'M',
  //         sAuth: 'L',
  //         sDeviceToken: 'test'
  //       }
  //       request(server)
  //         .post(routes.sendOtp)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.OTP_sent_succ)
  //           done()
  //         })
  //     })
  //     it('should not be send otp for forgot password to phone no  ', (done) => {
  //       const data = {
  //         sLogin: '9147526212',
  //         sType: 'M',
  //         sAuth: 'F'
  //       }
  //       request(server)
  //         .post(routes.sendOtp)
  //         .send(data)
  //         .expect(status.BadRequest)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.user_forgot_err)
  //           done()
  //         })
  //     })
  //   })

  //   describe('/POST Verify otp', () => {
  //     it('should Verify otp for register to phone no', (done) => {
  //       const data = {
  //         sLogin: 'ravi@gmail.com',
  //         sCode: 1234,
  //         sType: 'M',
  //         sAuth: 'L',
  //         sDeviceToken: 'f18sdwhn4bfg784xbc5d'
  //       }
  //       request(server)
  //         .post(routes.verifyOtp)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.verification_success)
  //           done()
  //         })
  //     })
  //     it('should not be Verify otp for register to phone no ', (done) => {
  //       const data = {
  //         sLogin: '9879879879',
  //         sType: 'M',
  //         sAuth: 'R',
  //         sCode: 'd22r22e'
  //       }
  //       request(server)
  //         .post(routes.verifyOtp)
  //         .send(data)
  //         .expect(status.BadRequest)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.verify_otp_err)
  //           done()
  //         })
  //     })
  //   })

  //   describe('/POST create user', () => {
  //     it('should not be create user', (done) => {
  //       const data = {
  //         sEmail: 'sahithgarg4@mail.com',
  //         sMobNum: '9147526212',
  //         sName: 'wic801',
  //         sPassword: 'wick20400',
  //         sUsername: 'sahithgarg4',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.BadRequest)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.went_wrong_with.replace('##', messages.English.cotpVerification))
  //           done()
  //         })
  //     })

  //     it('should be create user', (done) => {
  //       const data = {
  //         sEmail: 'sahithgarg4@mail.com',
  //         sMobNum: '9147526212',
  //         sName: 'wic801',
  //         sPassword: 'wick20400',
  //         sUsername: 'sahithgarg4',
  //         sCode: '1234',
  //         sDeviceToken: 'd7dwf51sw4ds8sd848sxhsftlsz'
  //       }
  //       request(server)
  //         .post(routes.register)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.reg_success)
  //           done()
  //         })
  //     })
  //   })

  //   describe('/POST check email, username and phoneNo is exist for BOT user', () => {
  //     it('should check email is not exist ', (done) => {
  //       const data = {
  //         sType: 'E',
  //         sValue: 'sahithgarg4@mail.com'
  //       }
  //       request(server)
  //         .post(routes.checkExist)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.email))
  //           done()
  //         })
  //     })

  //     it('should check username is exist', (done) => {
  //       const data = {
  //         sType: 'U',
  //         sValue: 'sahithgarg4'
  //       }
  //       request(server)
  //         .post(routes.checkExist)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.username))
  //           done()
  //         })
  //     })

  //     it('should check mobile no. is exist', (done) => {
  //       const data = {
  //         sType: 'M',
  //         sValue: '9147526212'
  //       }
  //       request(server)
  //         .post(routes.checkExist)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.mobileNumber))
  //           done()
  //         })
  //     })
  //   })

  //   describe('/Post Check email, username and phoneNo is exist', () => {
  //     it('should check email is not exist ', (done) => {
  //       const data = {
  //         sType: 'E',
  //         sValue: 'kk@gmail.com'
  //       }
  //       request(server)
  //         .post(routes.checkExist)
  //         .send(data)
  //         .expect(status.OK)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.not_exist.replace('##', messages.English.email))
  //           done()
  //         })
  //     })

  //     it('should check username is exist', (done) => {
  //       const data = {
  //         sType: 'U',
  //         sValue: 'jay12'
  //       }
  //       request(server)
  //         .post(routes.checkExist)
  //         .send(data)
  //         .expect(status.ResourceExist)
  //         .end(function(err, res) {
  //           if (err) return done(err)
  //           expect(res.body.message).toMatch(messages.English.already_exist.replace('##', messages.English.username))
  //           done()
  //         })
  //     })
  //   })
  // --------------------------------------------------------------------
  // login
  // login with password-------(done)
  describe('/POST login with password through number student', () => {
    it('should not be login with number', (done) => {
      const data = {
        login: '8980422680',
        password: 'Zarna@123'
      }
      request(server)
        .post(routes.login_with_password)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('Please enter a valid credentials.')
          done()
        })
    })
    it('should be login with number', (done) => {
      const data = {
        login: '8980422681',
        password: 'Zarna@123'
      }
      request(server)
        .post(routes.login_with_password)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch('Welcome Back! You have logged in successfully.')
          if (res.body.Authorization) {
            store.token = res.body.Authorization
          }
          done()
        })
    })
  })
  describe('/POST login with password through email  student', () => {
    it('should not be login with email', (done) => {
      const data = {
        login: 'seracedu@gmail.com',
        password: 'Zarna@123'
      }
      request(server)
        .post(routes.login_with_password)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          expect(res.body.message).toMatch('Please enter a valid credentials.')
          done()
        })
    })
    it('should be login with email', (done) => {
      const data = {
        login: 'parth.panchal@yudiz.com',
        password: 'Zarna@123'
      }
      request(server)
        .post(routes.login_with_password)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch('Welcome Back! You have logged in successfully.')
          if (res.body.Authorization) {
            store.token = res.body.Authorization
          }
          done()
        })
    })
  })
  // ----------------------------------mobile----------------------------------
  // // send  OTP for login
  // describe('/POST login with send otp to mobile number student', () => {
  //   it('should not be send otp to mobile number for login student', (done) => {
  //     const data = {
  //       login: '8980422684'
  //     }
  //     request(server)
  //       .post(routes.login_with_otp)
  //       .send(data)
  //       .expect(status.BadRequest)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch('Please enter a valid credentials.')
  //         done()
  //       })
  //   })
  //   it('should be send otp to mobile number for login student', (done) => {
  //     const data = {
  //       login: '8980422681'
  //     }
  //     request(server)
  //       .post(routes.login)
  //       .send(data)
  //       .expect(status.OK)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch('OTP sent successfully.')
  //         done()
  //       })
  //   })
  // })
  describe('/POST login with send otp with email student', () => {
    it('should not be send otp to email for login student', (done) => {
      const data = {
        login: 'parth.panchal@gmail.com'
      }
      request(server)
        .post(routes.login_with_otp)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          expect(res.body.message).toMatch('Please enter a valid credentials.')
          done()
        })
    })
    it('should be send otp to email for login student', (done) => {
      const data = {
        login: 'parth.panchal@yudiz.com'
      }
      request(server)
        .post(routes.login_with_otp)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          expect(res.body.message).toMatch('OTP sent successfully.')
          done()
        })
    })
  })

  // login with verified OTP
  describe('/POST login with otp through number  student', () => {
    it('should not be login with number', (done) => {
      const data = {
        login: '8980422680',
        otp: 1233
      }
      request(server)
        .post(routes.login_with_verify_otp)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('Entered OTP is invalid or expired.')
          done()
        })
    })
    it('should be login with number', (done) => {
      const data = {
        login: '8980422681',
        otp: 1234
      }
      request(server)
        .post(routes.login_with_verify_otp)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch('Welcome Back! You have logged in successfully.')
          if (res.body.Authorization) {
            store.token = res.body.Authorization
          }
          done()
        })
    })
  })
  describe('/POST login with otp through Email  student', () => {
    it('should not be login with number', (done) => {
      const data = {
        login: 'parth.panchal123@yudiz.com',
        otp: 1233
      }
      request(server)
        .post(routes.login_with_verify_otp)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('Entered OTP is invalid or expired.')
          done()
        })
    })
    it('should be login with number', (done) => {
      const data = {
        login: 'parth.panchal@yudiz.com',
        otp: 1234
      }
      request(server)
        .post(routes.login_with_verify_otp)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.data).toBeA('object')
          expect(res.body.message).toMatch('Welcome Back! You have logged in successfully.')
          if (res.body.Authorization) {
            store.token = res.body.Authorization
          }
          done()
        })
    })
  })
  // forgot password send mail
  describe('/POST forgot password with otp through Email student', () => {
    it('should not be send mail', (done) => {
      const data = {
        emailMobile: 'parth.panchal123@yudiz.com'
      }
      request(server)
        .post(routes.forgotPassword)
        .send(data)
        .expect(status.NotFound)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('User does not exist.')
          done()
        })
    })
    it('should be send mail', (done) => {
      const data = {
        emailMobile: 'parth.panchal@yudiz.com'
      }
      request(server)
        .post(routes.forgotPassword)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('OTP sent successfully.')
          if (res.body.Authorization) {
            store.token = res.body.Authorization
          }
          done()
        })
    })
  })
  // forgot password otp verification
  describe('/POST forgot password otp verification through Email  student', () => {
    it('should not be verify otp', (done) => {
      const data = {
        otp: '123456',
        token: store.token
      }
      request(server)
        .post(routes.forgot_verification)
        .send(data)
        .expect(status.BadRequest)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('Entered OTP is invalid or expired.')
          done()
        })
    })
    it('should be verify otp', (done) => {
      const data = {
        token: store.token,
        otp: 1234
      }
      request(server)
        .post(routes.forgot_verification)
        .send(data)
        .expect(status.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.message).toMatch('Verification done successfully.')
          done()
        })
    })
  })
  // reset password
  // describe('/POST reset password student', () => {
  //   it('should not be match password and confirm password', (done) => {
  //     const data = {
  //       password: 'Zarna@123',
  //       confirm_password: 'arna@123',
  //       token: store.token
  //     }
  //     request(server)
  //       .post(routes.resetPassword)
  //       .send(data)
  //       .expect(status.BadRequest)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch('New password and confirm password should be same.')
  //         done()
  //       })
  //   })
  //   it('should not be reset password', (done) => {
  //     const data = {
  //       password: 'Zarna@123',
  //       confirm_password: 'Zarna@123',
  //       token: store.token
  //     }
  //     request(server)
  //       .post(routes.resetPassword)
  //       .send(data)
  //       .expect(status.OK)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch('Verification done successfully.')
  //         done()
  //       })
  //   })
  //   it('should be reset password', (done) => {
  //     const data = {
  //       password: 'Zarna@123',
  //       confirm_password: 'Zarna@123',
  //       token: store.token
  //     }
  //     request(server)
  //       .post(routes.resetPassword)
  //       .send(data)
  //       .expect(status.OK)
  //       .end(function(err, res) {
  //         if (err) return done(err)
  //         expect(res.body.message).toMatch('Verification done successfully.')
  //         done()
  //       })
  //   })
  // })
})
