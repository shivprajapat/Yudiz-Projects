const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ResourceManagementDB } = require('../../database/mongoose')
const EmployeeModel = require('../Employee/model')
const { action, path, empType, status } = require('../../data')

const Network = Schema({
    uId: { type: String },
    sUrl: { type: String },
    sResponseCode: { type: String },
    sResponseTime: { type: String },
    sHost: { type: String },
    sUserAgent: { type: String },
    sMethod: { type: String },
    sIpAddress: { type: String },
    sResponseContentTypes: { type: String },
    nResponseLength: { type: Number },
    eStatus: { type: String, default: 'Y', enum: status },
    sPathName: { type: String },
    oQuery: { type: Object },
    sHostPort: { type: String }

}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Network.index({ sUrl: 1 })

// Network.pre('save', async function (next) {
//     const network = this
//     console.log('network123333333333', network)
//     next()
// })

module.exports = Network
