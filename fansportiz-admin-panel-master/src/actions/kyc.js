import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import {
  ADD_AADHAAR_DETAILS,
  ADD_PAN_DETAILS,
  CLEAR_KYC_MESSAGE,
  GET_KYC_INFO,
  KYC_DETAILS,
  KYC_LIST,
  PENDING_KYC_COUNT,
  UPDATE_AADHAAR_DETAILS,
  UPDATE_KYC_STATUS,
  UPDATE_PAN_DETAILS
} from './constants'
const errMsg = 'Server is unavailable.'

export const getKYCList = (KYCList) => async (dispatch) => {
  dispatch({ type: CLEAR_KYC_MESSAGE })
  const {
    start,
    limit,
    search,
    startDate,
    endDate,
    PanStatus,
    AadhaarStatus,
    isFullResponse,
    token
  } = KYCList
  await axios
    .get(
      `/kyc-list/v2?start=${start}&limit=${limit}&search=${search}&iUserId=${search}&panFilter=${PanStatus}&aadhaarFilter=${AadhaarStatus}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: KYC_LIST,
        payload: {
          data: response.data.data ? response.data.data : [],
          resStatus: true,
          isFullResponse
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: KYC_LIST,
        payload: {
          data: [],
          resMessage: error.response ? error.response.data.message : errMsg,
          resStatus: false
        }
      })
    })
}

export const getKycDetails = (Id, token, tds) => async (dispatch) => {
  dispatch({ type: CLEAR_KYC_MESSAGE })
  await axios
    .get(`/kyc-info/${Id}/v1`, { headers: { Authorization: token } })
    .then((response) => {
      const data = response.data.data || {}
      const oPath = {}

      // if (data && data.oPan && data.oPan.sImage) {
      Object.assign(oPath, { sImage: data?.oPan?.sImage })
      // }

      // if (data && data.oAadhaar && data.oAadhaar.sBackImage) {
      Object.assign(oPath, { sBackImage: data?.oAadhaar?.sBackImage })
      // }

      // if (data && data.oAadhaar && data.oAadhaar.sFrontImage) {
      Object.assign(oPath, { sFrontImage: data?.oAadhaar?.sFrontImage })
      // }

      if (oPath && Object.keys(oPath).length) {
        axios
          .post('/pre-signed-url-kyc/v1', { oPath }, { headers: { Authorization: token } })
          .then((res) => {
            // if (res.data.data && res.data.data.sImage && data && data.oPan && data.oPan.sImage) {
            data.oPan.sImage = res?.data?.data?.sImage
            // }

            // if (res.data.data && res.data.data.sBackImage && data && data.oAadhaar && data.oAadhaar.sBackImage) {
            data.oAadhaar.sBackImage = res?.data?.data?.sBackImage
            // }

            // if (res.data.data && res.data.data.sFrontImage && data && data.oAadhaar && data.oAadhaar.sFrontImage) {
            data.oAadhaar.sFrontImage = res?.data?.data?.sFrontImage
            // }

            dispatch({
              type: KYC_DETAILS,
              payload: {
                data,
                resStatus: true
              }
            })
          })
          .catch((error) => {
            dispatch({
              type: KYC_DETAILS,
              payload: {
                data: {},
                resMessage: tds && (error.response ? error.response.data.message : errMsg),
                resStatus: true
              }
            })
          })
      } else {
        dispatch({
          type: KYC_DETAILS,
          payload: {
            data,
            resStatus: true
          }
        })
      }
    })
    .catch((error) => {
      dispatch({
        type: KYC_DETAILS,
        payload: {
          data: {},
          resMessage: tds && (error.response ? error.response.data.message : errMsg),
          // resMessage: error?.response ? error?.response?.data?.message : errMsg,
          resStatus: false
        }
      })
    })
}

export const getKycInfo = (Id, token) => async (dispatch) => {
  await axios
    .get(`/kyc-info/${Id}/v1`, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_KYC_INFO,
        payload: {
          data: response.data.data ? response.data.data : {},
          resMessage: response.data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_KYC_INFO,
        payload: {
          data: {},
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updatePanDetails = (id, sImage, sNo, sName, token) => async (dispatch) => {
  dispatch({ type: CLEAR_KYC_MESSAGE })
  try {
    if (sImage && sImage.file) {
      const type = 'PAN'
      const response = await axios.post(
        `/pre-signed-url/${type}/${id}/v1`,
        { sFileName: sImage.file.name, sContentType: sImage.file.type },
        { headers: { Authorization: token } }
      )
      const url = response.data.data.sUrl
      const path = response.data.data.sPath
      await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
      await axios
        .put(
          `/kyc/${id}/v1`,
          { sImage: path, sNo, sName, eType: 'PAN' },
          { headers: { Authorization: token } }
        )
        .then((resp) => {
          dispatch(successFunc(UPDATE_PAN_DETAILS, resp))
        })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_PAN_DETAILS, error))
  }
}

export const addPanDetails = (id, sImage, sNo, sName, token) => async (dispatch) => {
  dispatch({ type: CLEAR_KYC_MESSAGE })
  try {
    if (sImage && sImage.file) {
      const type = 'PAN'
      const response = await axios.post(
        `/pre-signed-url/${type}/${id}/v1`,
        { sFileName: sImage.file.name, sContentType: sImage.file.type },
        { headers: { Authorization: token } }
      )
      const url = response.data.data.sUrl
      const path = response.data.data.sPath
      await axios.put(url, sImage.file, { headers: { 'Content-Type': sImage.file.type } })
      await axios
        .post(
          `/kyc/add/${id}/v1`,
          { sImage: path, sNo, sName, eType: 'PAN' },
          { headers: { Authorization: token } }
        )
        .then((resp) => {
          dispatch(successFunc(ADD_PAN_DETAILS, resp))
        })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_PAN_DETAILS, error))
  }
}

export const updateAadhaarDetails =
  (id, sFrontImage, sBackImage, nNo, token) => async (dispatch) => {
    dispatch({ type: CLEAR_KYC_MESSAGE })
    const type = 'AADHAAR'
    try {
      if (sFrontImage && sFrontImage.file && sBackImage && sBackImage.file) {
        const response = await axios.post(
          `/pre-signed-url/${type}/${id}/v1`,
          { sFileName: sFrontImage.file.name, sContentType: sFrontImage.file.type },
          { headers: { Authorization: token } }
        )
        const url = response.data.data.sUrl
        const Path = response.data.data.sPath
        await axios.put(url, sFrontImage.file, {
          headers: { 'Content-Type': sFrontImage.file.type }
        })
        const response1 = await axios.post(
          `/pre-signed-url/${type}/${id}/v1`,
          { sFileName: sBackImage.file.name, sContentType: sFrontImage.file.type },
          { headers: { Authorization: token } }
        )
        const backurl = response1.data.data.sUrl
        const BackPath = response1.data.data.sPath
        await axios.put(backurl, sBackImage.file, {
          headers: { 'Content-Type': sBackImage.file.type }
        })
        await axios
          .put(
            `/kyc/${id}/v1`,
            {
              nNo,
              sFrontImage: Path,
              sBackImage: BackPath,
              eType: 'AADHAAR'
            },
            { headers: { Authorization: token } }
          )
          .then((response3) => {
            dispatch(successFunc(UPDATE_AADHAAR_DETAILS, response3))
          })
      }
    } catch (error) {
      dispatch(catchFunc(UPDATE_AADHAAR_DETAILS, error))
    }
  }

export const addAadhaarDetails = (id, sFrontImage, sBackImage, nNo, token) => async (dispatch) => {
  dispatch({ type: CLEAR_KYC_MESSAGE })
  const type = 'AADHAAR'
  try {
    if (sFrontImage && sFrontImage.file && sBackImage && sBackImage.file) {
      const response = await axios.post(
        `/pre-signed-url/${type}/${id}/v1`,
        { sFileName: sFrontImage.file.name, sContentType: sFrontImage.file.type },
        { headers: { Authorization: token } }
      )
      const url = response.data.data.sUrl
      const Path = response.data.data.sPath
      await axios.put(url, sFrontImage.file, { headers: { 'Content-Type': sFrontImage.file.type } })
      const response1 = await axios.post(
        `/pre-signed-url/${type}/${id}/v1`,
        { sFileName: sBackImage.file.name, sContentType: sFrontImage.file.type },
        { headers: { Authorization: token } }
      )
      const backurl = response1.data.data.sUrl
      const BackPath = response1.data.data.sPath
      await axios.put(backurl, sBackImage.file, {
        headers: { 'Content-Type': sBackImage.file.type }
      })
      await axios
        .post(
          `/kyc/add/${id}/v1`,
          {
            nNo,
            sFrontImage: Path,
            sBackImage: BackPath,
            eType: 'AADHAAR'
          },
          { headers: { Authorization: token } }
        )
        .then((response3) => {
          dispatch(successFunc(ADD_AADHAAR_DETAILS, response3))
        })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_AADHAAR_DETAILS, error))
  }
}

export const updateKYCStatus = (id, eStatus, statusType, sReason, token) => async (dispatch) => {
  await axios
    .put(
      `/kyc-status/${id}/v1`,
      { eStatus, eType: statusType, sRejectReason: sReason },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: UPDATE_KYC_STATUS,
        payload: {
          data: response.data.data ? response.data.data : {},
          resMessage: response.data.message,
          resStatus: true,
          updatedKyc: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_KYC_STATUS,
        payload: {
          data: {},
          resStatus: false,
          updatedKyc: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getPendingKycCount = (panStatus, aadharStatus, token) => async (dispatch) => {
  await axios
    .get(`/kyc-list/counts/v2?ePanStatus=${panStatus}&eAadharStatus=${aadharStatus}`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: PENDING_KYC_COUNT,
        payload: {
          data: response.data.data ? response.data.data : {},
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: PENDING_KYC_COUNT,
        payload: {
          data: {},
          resStatus: false
        }
      })
    })
}
