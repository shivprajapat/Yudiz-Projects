import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'
import { Helmet } from 'react-helmet'

// Components
import TitleHeader from '../../Components/TitleHeader'

// Action Files
import { getActivePackagesDataAction, getAllAddOnPackagesDataAction, getOtherPackagesAction } from '../../Actions/packages'

const ActivePackageDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  console.log(location)
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [search] = useState('')
  const [activePackagesArray, setActivePackagesArray] = useState([])

  // useSelector
  const activePackagesArrayData = useSelector(state => state.packages.activePackagesArray)
  const otherPackagesArrayData = useSelector(state => state.packages.otherPackagesData)
  const responseStatus = useSelector(state => state.packages.resStatus)
  const responseMessage = useSelector(state => state.packages.resMessage)
  const previousProps = useRef({ activePackagesArrayData, responseStatus, responseMessage, otherPackagesArrayData }).current

  useEffect(() => {
    if (responseStatus === 401) {
      localStorage.removeItem('token')
      enqueueSnackbar(`${responseMessage}`, {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
      navigate('/')
    }
  }, [responseStatus])

  useEffect(() => {
    if (previousProps?.activePackagesArrayData !== activePackagesArrayData) {
      if (activePackagesArrayData) {
        setActivePackagesArray(activePackagesArrayData)
      }
    }
    return () => {
      previousProps.activePackagesArrayData = activePackagesArrayData
    }
  }, [activePackagesArrayData])

  useEffect(() => {
    if (token) {
      dispatch(getActivePackagesDataAction('', token))
      dispatch(getAllAddOnPackagesDataAction(token))
      dispatch(getOtherPackagesAction('', token))
    }
  }, [token])

  useEffect(() => {
    dispatch(getActivePackagesDataAction(search, token))
  }, [search])

  // const handleCallback = (childData) => {
  //   setSearch(childData)
  // }
  return (
    <>
    <Helmet>
        <meta charSet='utf-8' />
        <title>Active Package - Ollato</title>
      </Helmet>
          <div className=''>
            {/* <Header parentCallback={handleCallback} /> */}
            <TitleHeader title='Your Active Package' />
            {
                activePackagesArray && activePackagesArray.length >= 0
                  ? activePackagesArray.map((data, index) => {
                    return (
                             <div className='main-layout whitebox-layout mb-3' key={index}>
                                <div className='common-white-box'>
                                    <div className="left-box">
                                        <h5>{data?.package_name}</h5>
                                        <h4>{data?.f2f_call === true ? ' Face-2-Face meeting' : ''}</h4>
                                        <h4>{data?.online_test === true ? ' Online Testing' : ''}</h4>
                                        <h4>{data?.video_call === true ? 'Video Call' : ''}</h4>
                                    </div>
                                    <div className="right-box">
                                        <div className="price-box">
                                            <p>Expired on</p>
                                            <h5>{data?.expireDate ? moment(data?.expireDate).local().format('YYYY-MM-DD HH:mm:ss') : '-'}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="package-description mb-0">
                                <div className="bullet-point">
                               <h4 className='text-align-left' dangerouslySetInnerHTML={{ __html: data?.description }} ></h4>
                               </div>
                                </div>
                            </div>
                    )
                  })
                  : 'No Data Found'
            }

          </div>
  </>
  )
}

export default ActivePackageDetail
