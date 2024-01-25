import React, { useEffect } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import ollatoicon from '../../../assets/images/ollatoicon.svg'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getallcredits } from '../../../Actions/Center/purchaseLicense'

function PurchaseLicense () {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // useSelector
  const creditData = useSelector((state) => state.centerPackages.allcredits)

  useEffect(() => {
    dispatch(getallcredits(token))
  }, [])
  return (
    <>
      <TitleHeader title='Purchased License' name='Credit' navigate={navigate}/>
            <div className="row">
                  <h3 className='text-start m-2'>Basic Package</h3>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Total Purchased Credit </h5>
                    <h2>{creditData?.basicPackageTitle?.basicPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Available Credit</h5>
                    <h2>{creditData?.basicPackageTitle?.remainingBasicPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Used Credit</h5>
                    <h2>{creditData?.basicPackageTitle?.assignedBasicPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
                  <h3 className='text-start m-2'>Advance Package</h3>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Total Purchased Credit </h5>
                    <h2>{creditData?.advancedPackageTitle?.advacedPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Available Credit</h5>
                    <h2>{creditData?.advancedPackageTitle?.remainingAdvPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo'>
                  <div className="left-box text-start">
                    <h5>Used Credit</h5>
                    <h2>{creditData?.advancedPackageTitle?.assignedAdvPackages}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
            </div>

    </>
  )
}

export default PurchaseLicense
