import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetColors = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_COLORS_RESPONSE' })
  axios
    .post('/colors/admin', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_COLORS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_COLORS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const ColorDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_COLORS_RESPONSE' })
  axios
    .get('/colors/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'COLOR_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'COLOR_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateColor = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_COLORS_RESPONSE' })
  if (val.file) {
    const req = {
      file: [
        {
          fileName: val.file.name.split('.')[0],
          type: val.file.type.split('/')[1],
          mediaType: 'color'
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
                .put('/colors/' + id, { name: val.name, colorCode: val.colorCode, uri: image })
                .then(({ data }) => {
                  dispatch({
                    type: 'UPDATE_COLORS',
                    payload: {
                      resMessage: data.message,
                      resStatus: true
                    }
                  })
                })
                .catch((error) => {
                  dispatch({
                    type: 'UPDATE_COLORS',
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
              type: 'UPDATE_COLORS',
              payload: {
                resStatus: false,
                resMessage: error.response ? error.response.data.message : errMsg
              }
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_COLORS',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  } else {
    axios
      .put('/colors/' + id, { name: val.name, colorCode: val.colorCode, uri: val.image })
      .then(({ data }) => {
        dispatch({
          type: 'UPDATE_COLORS',
          payload: {
            resMessage: data.message,
            resStatus: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_COLORS',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  }
}

export const AddColors = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_COLORS_RESPONSE' })
  const req = {
    file: [
      {
        fileName: val.file.name.split('.')[0],
        type: val.file.type.split('/')[1],
        mediaType: 'color'
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
              .post('/colors', { name: val.name, colorCode: val.colorCode, uri: image })
              .then(({ data }) => {
                dispatch({
                  type: 'ADD_COLORS',
                  payload: {
                    resMessage: data.message,
                    resStatus: true
                  }
                })
              })
              .catch((error) => {
                dispatch({
                  type: 'ADD_COLORS',
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
            type: 'ADD_COLORS',
            payload: {
              resStatus: false,
              resMessage: error.response ? error.response.data.message : errMsg
            }
          })
        })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_COLORS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const DeleteColors = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_COLORS_RESPONSE' })
  axios
    .delete('/colors/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'DELETE_COLORS',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_COLORS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
