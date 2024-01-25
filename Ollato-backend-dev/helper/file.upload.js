/* eslint-disable standard/no-callback-literal  */
const path = require('path')
const multer = require('multer')

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'adharcard_front') {
      cb(null, path.join(__dirname, '../public/uploads/adharcard_front'))
    } else if (file.fieldname === 'adharcard_back') {
      cb(null, path.join(__dirname, '../public/uploads/adharcard_back'))
    } else if (file.fieldname === 'pancard') {
      cb(null, path.join(__dirname, '../public/uploads/pancard'))
    } else if (file.fieldname === 'profile_picture') {
      cb(null, path.join(__dirname, '../public/uploads/profile_picture'))
    } else if (file.fieldname === 'signature') {
      cb(null, path.join(__dirname, '../public/uploads/signature'))
    } else if (file.fieldname === 'resume') {
      cb(null, path.join(__dirname, '../public/uploads/resume'))
    } else if (file.fieldname === 'question') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'options[0][option-1]') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'options[1][option-2]') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'options[2][option-3]') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'options[3][option-4]') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'options[4][option-5]') {
      cb(null, path.join(__dirname, '../public/uploads/question'))
    } else if (file.fieldname === 'profile') {
      cb(null, path.join(__dirname, '../public/uploads/profile'))
    } else if (file.fieldname === 'career_profile') {
      cb(null, path.join(__dirname, '../public/uploads/career_profile'))
    } else if (file.fieldname === 'student_import_file') {
      cb(null, path.join(__dirname, '../public/uploads/student_import_file'))
    } else if (file.fieldname === 'receipt') {
      cb(null, path.join(__dirname, '../public/uploads/receipt'))
    } else {
      cb({ error: 'Mime type not supported' })
    }
  },

  filename: (req, file, cb) => {
    const dateTS = Date.now()
    const fileExt = file.originalname.split('.')[file.originalname.split('.').length - 1]

    if (file.fieldname === 'options[0][option-1]') {
      cb(null, `/option-1-${dateTS}.${fileExt}`)
    } else if (file.fieldname === 'options[1][option-2]') {
      cb(null, `/option-2-${dateTS}.${fileExt}`)
    } else if (file.fieldname === 'options[2][option-3]') {
      cb(null, `/option-3-${dateTS}.${fileExt}`)
    } else if (file.fieldname === 'options[3][option-4]') {
      cb(null, `/option-4-${dateTS}.${fileExt}`)
    } else if (file.fieldname === 'options[4][option-5]') {
      cb(null, `/option-5-${dateTS}.${fileExt}`)
    } else {
      cb(null, `/${file.fieldname}-${dateTS}.${fileExt}`)
    }
  }
})

const multerUpload = multer({
  storage: imageStorage
})

module.exports = {
  multerUpload
}
