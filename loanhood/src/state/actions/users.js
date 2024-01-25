import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetUsers = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .post('/user/admin', val)
    .then(({ data }) => {
      dispatch({
        type: 'GET_USERS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_USERS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetUserDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .get('/admin/user/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'USER_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'USER_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
export const getPresignedUrl = (val) => (dispatch) => {
  const req = {
    file: [
      {
        fileName: val.file.name.split('.')[0],
        type: val.file.type.split('/')[1],
        mediaType: 'avatar'
      }
    ]
  }
  axios.post('/common/pre-signed-url', req).then(({ data }) => {
    const url = data.data[0].uploadUrl
    axios.put(url, val.file, { headers: { 'Content-Type': val.file.type, 'x-amz-acl': 'public-read' } }).then((response1) => {
      dispatch({
        type: 'GET_PRE_SIGNED_URL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
  })
}
export const UpdateUser = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  if (val.file) {
    const req = {
      file: [
        {
          fileName: val.file.name.split('.')[0],
          type: val.file.type.split('/')[1],
          mediaType: 'avatar'
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
            val.avatarUrl = image
            if (response1.status === 200) {
              axios
                .put('/user/' + id, val)
                .then(({ data }) => {
                  dispatch({
                    type: 'UPDATE_USER',
                    payload: {
                      resMessage: data.message,
                      resStatus: true
                    }
                  })
                })
                .catch((error) => {
                  dispatch({
                    type: 'UPDATE_USER',
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
              type: 'UPDATE_USER',
              payload: {
                resStatus: false,
                resMessage: error.response ? error.response.data.message : errMsg
              }
            })
          })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  } else {
    axios
      .put('/user/' + id, val)
      .then(({ data }) => {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            resMessage: data.message,
            resStatus: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  }
}
export const DeleteUser = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .delete('/admin/user/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'USER_DELETE',
        payload: {
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'USER_DELETE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
export const CreateUser = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .post('/admin/user', data)
    .then(({ data }) => {
      dispatch({
        type: 'CREATE_USER',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'CREATE_USER',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetUserRentals = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .post('/admin/rentals/user/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'USER_RENTALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'USER_RENTALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetUserLoanRentals = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .post('/admin/rentals/loaner/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'USER_LOAN_RENTALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'USER_LOAN_RENTALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetUserBorrowerRentals = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_USERS_RESPONSE' })
  axios
    .post('/admin/rentals/borrower/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'USER_BORROWER_RENTALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'USER_BORROWER_RENTALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
