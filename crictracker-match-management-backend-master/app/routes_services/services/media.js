const { getS3ImageURL } = require('../../utils')

class MediaServices {
  async uploadImage(req, res) {
    try {
      const imageURL = 'https://i.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI' // image URL which you want to upload
      const imagePath = 'test/upload' // S3 bucket path where you want to upload file
      const response = await getS3ImageURL(imageURL, imagePath) // service function for upload image in S3

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'Image'), data: response })
    } catch (error) {
      return error
    }
  }
}

module.exports = new MediaServices()
