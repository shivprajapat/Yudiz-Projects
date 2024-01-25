import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { useParams } from 'react-router'
import AddIcon from '@material-ui/icons/Add'
import UpdateDialog from './UpdateDialog'
import { AddUserAddress, GetSingleAddress, UpdateAddressOfUser } from 'state/actions/address'
const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 35,
    left: 0
  },
  box: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    textTransform: 'capitalize'
  }
}))

function AddressListing({ id, api, storeName, selectorName, isFromUser }) {
  // const history = useHistory()
  const style = useStyles()
  const { type } = useParams()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [address, setAddress] = useState([])
  const [addressState, setAddressState] = useState({})
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [addressId, setAddressId] = useState(null)
  const [err, setErr] = useState(false)
  const records = useSelector((state) => state[storeName][selectorName])
  const resMessage = useSelector((state) => state[storeName].resMessage)
  const singleAddress = useSelector((state) => state[storeName].singleAddress)
  const newAddress = useSelector((state) => state[storeName].newAddress)
  useEffect(() => {
    if (singleAddress) {
      setAddressState(singleAddress)
    }
  }, [singleAddress])

  useEffect(() => {
    if (isFromUser) {
      dispatch(api(id))
    }
  }, [])

  useEffect(() => {
    if (resMessage) {
      if (addressId) {
        setAddress(
          address.map((e) => {
            if (e.id === addressId) {
              return {
                ...e,
                ...addressState
              }
            } else {
              return e
            }
          })
        )
        setAddressId('')
      } else if (newAddress) {
        setAddress([...address, { ...addressState, id: newAddress.id }])
      }
      setIsConfirmOpen(false)
      setAddressState({})
      setIsLoading(false)
    }
  }, [resMessage])

  // useEffect(() => {
  //   setIsConfirmOpen(false)
  //   setAddressState({})
  //   setIsLoading(false)
  //   // eslint-disable-next-line no-debugger
  //   debugger
  // }, [address])

  useEffect(() => {
    if (records) {
      setAddress(records)
      setIsLoading(false)
    }
  }, [records])

  useEffect(() => {
    if (singleAddress) {
      setIsConfirmOpen(true)
      setIsLoading(false)
    }
  }, [singleAddress])

  function handleEdit(id) {
    setAddressId(id)
    dispatch(GetSingleAddress(id))
    setIsConfirmOpen(false)
    setIsLoading(true)
  }
  function handleAdd() {
    setErr(false)
    setAddressState({})
    setIsConfirmOpen(true)
  }
  function handleAddEditAddress(e) {
    if (e) {
      if ((addressState && addressState?.address1 && addressState?.postCode && addressState?.city) || singleAddress?.address1) {
        setErr(false)
        if (addressId) {
          dispatch(UpdateAddressOfUser(addressId, addressState))
        } else {
          dispatch(AddUserAddress(id, addressState))
        }
      } else {
        setErr(true)
      }
    } else {
      setIsConfirmOpen(false)
      setAddressId('')
    }
  }
  function handleChange(e, name) {
    setAddressState({ ...addressState, [name]: e.target.value })
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <UpdateDialog
          open={isConfirmOpen}
          add={!addressId}
          addressMessage
          // disabled={err}
          handleResponse={(e) => handleAddEditAddress(e)}
          component={
            <>
              <TextField
                error={err && addressState && !addressState.address1}
                helperText={err && 'required'}
                size="small"
                margin="normal"
                variant="outlined"
                required
                fullWidth
                label="Address 1"
                type="text"
                name="address1"
                disabled={type === 'detail'}
                value={addressState?.address1}
                onChange={(e) => handleChange(e, 'address1')}
              />
              <TextField
                size="small"
                margin="normal"
                variant="outlined"
                fullWidth
                label="Address 2"
                type="text"
                name="address2"
                disabled={type === 'detail'}
                value={addressState?.address2}
                onChange={(e) => handleChange(e, 'address2')}
              />
              <TextField
                error={err && addressState && !addressState.city}
                helperText={err && 'required'}
                margin="normal"
                size="small"
                variant="outlined"
                required
                fullWidth
                label="City"
                type="text"
                name="city"
                disabled={type === 'detail'}
                value={addressState?.city}
                onChange={(e) => handleChange(e, 'city')}
              />
              <TextField
                error={err && addressState && !addressState.postCode}
                helperText={err && 'required'}
                size="small"
                margin="normal"
                variant="outlined"
                required
                fullWidth
                label="Postal code"
                type="text"
                name="postalCode"
                disabled={type === 'detail'}
                value={addressState?.postCode}
                onChange={(e) => handleChange(e, 'postCode')}
              />
            </>
          }
        />
      )}
      {type === 'edit' && (
        <Box align="right" p={2}>
          <Button onClick={() => handleAdd()} variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Address
          </Button>
        </Box>
      )}
      {isLoading && (
        <Box className={style.loader} component="div">
          <CircularProgress color="primary" size={30} />
        </Box>
      )}
      {address && address.length === 0 && (
        <Typography variant="subtitle2" noWrap align="center">
          No address found.
        </Typography>
      )}

      <Grid container spacing={3}>
        {address &&
          address.map((record) => (
            <Grid container item xs={12} md={6} spacing={1} key={record.id}>
              <Grid item xs={12}>
                <Card className={style.root} variant="outlined">
                  <CardContent>
                    <Box>
                      <Typography>{record.address1}</Typography>
                      <Typography>{record.address2}</Typography>
                      <Typography>{record.city}</Typography>
                      <Typography>{record.postCode}</Typography>
                    </Box>
                  </CardContent>
                  {type === 'edit' && (
                    <CardActions>
                      <Button onClick={() => handleEdit(record.id)} color="primary" startIcon={<EditIcon />}>
                        Edit
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </>
  )
}
AddressListing.propTypes = {
  id: PropTypes.string,
  api: PropTypes.func,
  storeName: PropTypes.string,
  selectorName: PropTypes.string,
  isFromUser: PropTypes.bool
}

export default AddressListing
