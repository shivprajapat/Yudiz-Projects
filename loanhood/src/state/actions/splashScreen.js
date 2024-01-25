import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetSplashScreen = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SPLASH_SCREEN_RESPONSE' })
  axios
    .post('/splashimages/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_SPLASH_SCREEN',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SPLASH_SCREEN',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const SplashScreenDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SPLASH_SCREEN_RESPONSE' })
  axios
    .get('/splashimages/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'SPLASH_SCREEN_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'SPLASH_SCREEN_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateSplashScreen = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_SPLASH_SCREEN_RESPONSE' })
  if (val.file) {
    const req = {
      file: [
        {
          fileName: val.file.name.split('.')[0],
          type: val.file.type.split('/')[1],
          mediaType: 'splash'
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
                .put('/splashimages/' + id, { name: val.name, assetUrl: image, textColor: val.textColor })
                .then(({ data }) => {
                  dispatch({
                    type: 'UPDATE_SPLASH_SCREEN',
                    payload: {
                      resMessage: data.message,
                      resStatus: true
                    }
                  })
                })
                .catch((error) => {
                  dispatch({
                    type: 'UPDATE_SPLASH_SCREEN',
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
              type: 'UPDATE_SPLASH_SCREEN',
              payload: {
                resStatus: false,
                resMessage: error.response ? error.response.data.message : errMsg
              }
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_SPLASH_SCREEN',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  } else {
    axios
      .put('/splashimages/' + id, { name: val.name, assetUrl: val.image, textColor: val.textColor })
      .then(({ data }) => {
        dispatch({
          type: 'UPDATE_SPLASH_SCREEN',
          payload: {
            resMessage: data.message,
            resStatus: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_SPLASH_SCREEN',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  }
}

export const AddSplashScreen = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_SPLASH_SCREEN_RESPONSE' })
  const req = {
    file: [
      {
        fileName: val.file.name.split('.')[0],
        type: val.file.type.split('/')[1],
        mediaType: 'splash'
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
              .post('/splashimages', { name: val.name, assetUrl: image, textColor: val.textColor })
              .then(({ data }) => {
                dispatch({
                  type: 'ADD_SPLASH_SCREEN',
                  payload: {
                    resMessage: data.message,
                    resStatus: true
                  }
                })
              })
              .catch((error) => {
                dispatch({
                  type: 'ADD_SPLASH_SCREEN',
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
            type: 'ADD_SPLASH_SCREEN',
            payload: {
              resStatus: false,
              resMessage: error.response ? error.response.data.message : errMsg
            }
          })
        })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_SPLASH_SCREEN',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteSplashScreen = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_SPLASH_SCREEN_RESPONSE' })
  axios
    .delete('/splashimages/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_SPLASH_SCREEN',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_SPLASH_SCREEN',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
