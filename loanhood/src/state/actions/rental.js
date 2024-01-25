import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetAllRentals = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .post('/admin/rentals', val)
    .then(({ data }) => {
      dispatch({
        type: 'GET_ALL_RENTALS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_ALL_RENTALS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetRentalDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .get('/admin/rentals/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'RENTAL_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'RENTAL_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetRentalTransactions = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .post('/admin/rental-transactions/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'RENTAL_TRANSACTIONS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'RENTAL_TRANSACTIONS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const RentalTransactionsUpdate = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .put('/rental-transactions/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_RENTAL_TRANSITION',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_RENTAL_TRANSITION',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const RentalTransactionsUpdateState = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .post('/rental-transactions-states', data)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_RENTAL_TRANSITION_STATE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_RENTAL_TRANSITION_STATE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetTransactionDetail = (id) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .get('/admin/rental-transactions/' + id)
    .then(({ data }) => {
      dispatch({
        type: 'TRANSACTION_DETAIL',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'TRANSACTION_DETAIL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateRental = (id, val) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  val.images = []
  const images = {
    files: [],
    createObj: []
  }
  val?.rentalImages?.forEach((item, index) => {
    if (item.file) {
      images.createObj.push({
        fileName: item.file.name.split('.')[0],
        type: item.file.type.split('/')[1],
        mediaType: 'product'
      })
      images.files.push(item.file)
      val.rentalImages = val.rentalImages.filter((data) => data.imageUrl !== item.imageUrl)
    } else {
      val.images.push(item.imageUrl)
    }
  })
  if (images.files.length === 0) {
    axios
      .put('/admin/rentals/' + id, val)
      .then(({ data }) => {
        dispatch({
          type: 'UPDATE_RENTAL',
          payload: {
            data: data.data.user,
            resMessage: data.message,
            resStatus: true
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_RENTAL',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  } else {
    axios
      .post('/common/pre-signed-url', { file: images.createObj })
      .then((res) => {
        res.data.data.forEach((item, i) => {
          val.images.push(item.s3Url)
          axios
            .put(item.uploadUrl, images.files[i], { headers: { 'Content-Type': images.files[i].type, 'x-amz-acl': 'public-read' } })
            .then((response1) => {
              if (response1.status === 200) {
                if (images.files.length - 1 === i) {
                  axios
                    .put('/admin/rentals/' + id, val)
                    .then(({ data }) => {
                      dispatch({
                        type: 'UPDATE_RENTAL',
                        payload: {
                          resMessage: data.message,
                          resStatus: true
                        }
                      })
                    })
                    .catch((error) => {
                      dispatch({
                        type: 'UPDATE_RENTAL',
                        payload: {
                          resStatus: false,
                          resMessage: error.response ? error.response.data.message : errMsg
                        }
                      })
                    })
                }
              }
            })
            .catch((error) => {
              dispatch({
                type: 'UPDATE_RENTAL',
                payload: {
                  resStatus: false,
                  resMessage: error.response ? error.response.data.message : errMsg
                }
              })
            })
        })
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_RENTAL',
          payload: {
            resStatus: false,
            resMessage: error.response ? error.response.data.message : errMsg
          }
        })
      })
  }
}

export const AddRental = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  val.images = []
  const images = {
    files: [],
    createObj: []
  }
  val.rentalImages.forEach((item, index) => {
    images.createObj.push({
      fileName: item.file.name.split('.')[0],
      type: item.file.type.split('/')[1],
      mediaType: 'product'
    })
    images.files.push(item.file)
    val.rentalImages = val.rentalImages.filter((data) => data.imageUrl !== item.imageUrl)
  })
  axios
    .post('/common/pre-signed-url', { file: images.createObj })
    .then((res) => {
      res.data.data.forEach((item, i) => {
        val.images.push(item.s3Url)
        axios
          .put(item.uploadUrl, images.files[i], { headers: { 'Content-Type': images.files[i].type, 'x-amz-acl': 'public-read' } })
          .then((response1) => {
            if (response1.status === 200) {
              if (images.files.length - 1 === i) {
                axios
                  .post('/rentals', val)
                  .then(({ data }) => {
                    dispatch({
                      type: 'ADD_RENTAL',
                      payload: {
                        resMessage: data.message,
                        resStatus: true
                      }
                    })
                  })
                  .catch((error) => {
                    dispatch({
                      type: 'ADD_RENTAL',
                      payload: {
                        resStatus: false,
                        resMessage: error.response ? error.response.data.message : errMsg
                      }
                    })
                  })
              }
            }
          })
          .catch((error) => {
            dispatch({
              type: 'ADD_RENTAL',
              payload: {
                resStatus: false,
                resMessage: error.response ? error.response.data.message : errMsg
              }
            })
          })
      })
    })
    .catch((error) => {
      dispatch({
        type: 'ADD_RENTAL',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const ChangeRentalState = (id, data) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTAL_RESPONSE' })
  axios
    .put('/admin/rentals/state/' + id, data)
    .then(({ data }) => {
      dispatch({
        type: 'CHANGE_RENTAL_STATE',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'CHANGE_RENTAL_STATE',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
