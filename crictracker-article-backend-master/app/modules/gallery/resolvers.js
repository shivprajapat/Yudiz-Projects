const { getImages, getImage, deleteImage, editImage, insertImage } = require('./controllers')

const Mutation = {
  deleteImage,
  editImage,
  insertImage
}

const Query = {
  getImages,
  getImage
}

const oImageData = {
  oAuthor: (image) => {
    return { __typename: 'subAdmin', _id: image.iAuthorId }
  }
}

const resolvers = { Mutation, Query, oImageData }

module.exports = resolvers
