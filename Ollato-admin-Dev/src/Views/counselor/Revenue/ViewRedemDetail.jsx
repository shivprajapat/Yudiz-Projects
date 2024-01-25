import React, { useCallback, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificRedeemReqDetails } from '../../../Actions/Center/purchaseLicense'
import TitleHeader from '../../../Components/TitleHeader'
import ImageViewer from 'react-simple-image-viewer'

function ViewRedeemDetail () {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [image, setImage] = useState()

  // useSelector
  const specificRedeReqData = useSelector(
    (state) => state.centerPackages.specificRedeReqData
  )

  useEffect(() => {
    dispatch(getSpecificRedeemReqDetails(+id, token, 'counsellor'))
  }, [params.id])

  useEffect(() => {
    if (specificRedeReqData) {
      const array = []
      array.push(
        `${process.env.REACT_APP_AXIOS_BASE_URL}${specificRedeReqData?.receipt}`
      )
      setImage(array)
    }
  }, [specificRedeReqData])

  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setIsViewerOpen(false)
  }
  return (
    <>
      <TitleHeader name='View' title='View Request' />
      <div className='main-layout whitebox-layout my-editprofile-page'>
        <Form>
          <div className='heading-box'>
            <h5>View Revenue</h5>
            <div className='btn-box'>
              <button
                className='theme-btn dark-btn text-none'
                onClick={() => navigate('/counsellor/revenue')}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className='light-bg-box redeem-screen'>
            <div className='row'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <h4>Student Details</h4>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='firstname'>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        placeholder='Enter Full Name'
                        type='text'
                        value={specificRedeReqData?.amount || ''}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='lasyname'>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        placeholder='Enter Full Name'
                        type='text'
                        value={specificRedeReqData?.date || ''}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='middlename'>
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        placeholder='Enter Full Name'
                        type='text'
                        value={specificRedeReqData?.status || ''}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  {specificRedeReqData?.receipt &&
                  <div className='col-lg-6'>
                   <div className=" text-left">
                   <Form.Label>Receipt</Form.Label>
                    <div className='redeem-imd'>
                    <img
                      src={`${process.env.REACT_APP_AXIOS_BASE_URL}${specificRedeReqData?.receipt}`}
                      onClick={() => openImageViewer(0)}
                      width='300'
                      style={{ margin: '2px' }}
                      alt=''
                    />
                    {isViewerOpen && (
                      <ImageViewer
                        src={image}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                      />
                    )}
                    </div>
                   </div>
                  </div>}
                </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ViewRedeemDetail
