import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetBannerImages = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  axios
    .post('/bannerimage/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_BANNER_IMAGES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_BANNER_IMAGES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
export const ChangeBannerImagesOrder = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  axios
    .put('/bannerimage/change-order', data)
    .then(({ data }) => {
      dispatch({
        type: 'CHANGE_BANNER_ORDER',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'CHANGE_BANNER_ORDER',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const BannerImageDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  axios
    .get('/bannerimage/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'BANNER_IMAGE_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'BANNER_IMAGE_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateBannerImage = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  if (val.file) {
    const req = {
      file: [
        {
          fileName: val.file.name.split('.')[0],
          type: val.file.type.split('/')[1],
          mediaType: 'banner'
        }
      ]
    }
    axios
      .post('/common/pre-signed-url', req)
      .then(({ data }) => {
        const url = data.data[0].uploadUrl
        const image = data.data[0].s3Url
        axios
          .put(url, val.file, { headers: { 'Content-Type': val.file.type, 'x-amz-acl': 'public-read' } })
          .then((response1) => {
            if (response1.status === 200) {
              axios
                .put('/bannerimage/' + id, { name: val.name, assetUrl: image, url: val.url })
                .then(({ data }) => {
                  dispatch({
                    type: 'UPDATE_BANNER_IMAGE',
                    payload: {
                      resMessage: data.message,
                      resStatus: true
                    }
                  })
                })
                .catch((error) => {
                  dispatch({
                    type: 'UPDATE_BANNER_IMAGE',
                    payload: {
                      resStatus: false,
                      resMessage: error.response ? error.response.data.message : errMsg
                    }
                  })
                })
            }
          })
          .catch((error) => {
            dispatch({
              type: 'UPDATE_BANNER_IMAGE',
              payload: {
                resStatus: false,
                resMessage: error.response ? error.response.data.message : errMsg
              }
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_BANNER_IMAGE',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  } else {
    axios
      .put('/bannerimage/' + id, { name: val.name, assetUrl: val.image, url: val.url })
      .then(({ data }) => {
        dispatch({
          type: 'UPDATE_BANNER_IMAGE',
          payload: {
            resMessage: data.message,
            resStatus: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_BANNER_IMAGE',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  }
}

export const AddBannerImage = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  const req = {
    file: [
      {
        fileName: val.file.name.split('.')[0],
        type: val.file.type.split('/')[1],
        mediaType: 'banner'
      }
    ]
  }
  axios
    .post('/common/pre-signed-url', req)
    .then(({ data }) => {
      const url = data.data[0].uploadUrl
      const image = data.data[0].s3Url
      axios
        .put(url, val.file, { headers: { 'Content-Type': val.file.type, 'x-amz-acl': 'public-read' } })
        .then((response1) => {
          if (response1.status === 200) {
            axios
              .post('/bannerimage', { name: val.name, assetUrl: image, url: val.url })
              .then(({ data }) => {
                dispatch({
                  type: 'ADD_BANNER_IMAGE',
                  payload: {
                    resMessage: data.message,
                    resStatus: true
                  }
                })
              })
              .catch((error) => {
                dispatch({
                  type: 'ADD_BANNER_IMAGE',
                  payload: {
                    resStatus: false,
                    resMessage: error.response ? error.response.data.message : errMsg
                  }
                })
              })
          }
        })
        .catch((error) => {
          dispatch({
            type: 'ADD_BANNER_IMAGE',
            payload: {
              resStatus: false,
              resMessage: error.response ? error.response.data.message : errMsg
            }
          })
        })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_BANNER_IMAGE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteBannerImage = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_BANNER_IMAGE_RESPONSE' })
  axios
    .delete('/bannerimage/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_BANNER_IMAGE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_BANNER_IMAGE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
