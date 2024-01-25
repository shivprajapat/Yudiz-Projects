
const Network = require('./models_routes_service/Logs/network.model')
const { ResourceManagementDB } = require('./database/mongoose')
const CryptoJS = require('crypto-js')
const ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef'
const IV_VALUE = 'abcdef9876543210abcdef9876543210'
const loggerMiddleware = function (req, res, next) {
    const { method, url, headers } = req

    // console.log(`[Request] ${method} ${url}`)
    // console.log('[Request Headers]', headers)

    // console.log(req)

    // eTag for request)

    // Store the original response.end() function
    // const originalEnd = res.end

    // Create a new function to override response.end()
    // res.end = function (chunk, encoding) {
    //   // Log the response information
    //   console.log(`[Response] ${method} ${url}`)
    //   console.log('[Response Headers]', res.getHeaders())
    //   console.log('[Response Body]', chunk && chunk.toString())

    //   // Restore the original response.end() function
    //   res.end = originalEnd

    //   // Call the original response.end() function
    //   res.end(chunk, encoding)
    // }

    // console.log('req._startTime', req._startTime)
    // console.log('req._remoteAddress', req._remoteAddress)

    let ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',') : []

    ip = ip[0] || req.socket.remoteAddress

    const start = new Date()
    let time = 0
    res.on('finish', async () => {
        const end = new Date()
        time = end.getTime() - start.getTime()
        // let take = `Network${new Date().getFullYear()}${new Date().getMonth() + 1}`

        let take = `Network${new Date().getFullYear()}${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}`

        const uId = `${new Date().getFullYear()}${new Date().getMonth() + 1}`
        take = ResourceManagementDB.model(take, Network)
        const i = await take.create({ sUrl: url, sResponseCode: res.statusCode, uId, sResponseTime: time, sHost: req.headers.host, sUserAgent: req.headers['user-agent'], sMethod: method, sIpAddress: ip.split(':')[ip.split(':').length - 1], sResponseContentTypes: res.getHeaders()['content-type'], nResponseLength: res.getHeaders()['content-length'], sPathName: req.path, oQuery: req.query, sHostPort: req.headers.host.split(':')[1] })
        await take.updateOne({ _id: i._id }, { $set: { uId: encryptKey(`${uId}${i._id}`) } })
    })
    next()
}

function encryptKey(value) {
    const encryptedKey = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY)
    const iv = CryptoJS.enc.Hex.parse(IV_VALUE)
    if (value) {
        const message = CryptoJS.enc.Utf8.parse(value)
        const encrypted = CryptoJS.AES.encrypt(message, encryptedKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        const cipherText = encrypted.toString()
        return cipherText
    }
}

function decryptValue(key) {
    const encryptedKey = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY)
    const iv = CryptoJS.enc.Hex.parse(IV_VALUE)
    if (key) {
        const decrypted = CryptoJS.AES.decrypt(key, encryptedKey, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        const decryptedMessage = decrypted?.toString(CryptoJS.enc.Utf8)
        if (decryptedMessage.length) { return decryptedMessage }
        return key
    }
}

module.exports = {
    loggerMiddleware
}
