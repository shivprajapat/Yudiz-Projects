import React, { useState, useEffect, Fragment } from 'react'
// import PropTypes from 'prop-types'
import Contests from '../../../assests/images/Contests.svg'
import PlayerImage from '../../../assests/images/User.png'
import Bonus from '../../../assests/images/profile_bonus.svg'
import Loyalty from '../../../assests/images/ic_Loyaly_colored.svg'
import Commission from '../../../assests/images/ic_commision.svg'
import Percentage from '../../../assests/images/ic_percentage_bg.svg'
import Wins from '../../../assests/images/Wins.svg'
import gotoBlue from '../../../assests/images/goto_blue.svg'
import goto from '../../../assests/images/goto.svg'
import infoIconGray from '../../../assests/images/info-icon-gray.svg'
import commissionTwo from '../../../assests/images/commission_photo-two.svg'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Container, Row, Col, Button, UncontrolledPopover, PopoverBody, Modal, ModalBody } from 'reactstrap'
import Loading from '../../../component/SkeletonProfile'
// import share from '../../../assests/images/share.svg'
// import LoginPage from '../../../HOC/Auth/LoginPage'
import useUpdateUserProfile from '../../../api/user/mutations/useUpdateUserProfile'
import useGetUserProfile from '../../../api/user/queries/useGetUserProfile'
import useLogout from '../../../api/auth/mutations/useLogout'
import useGetUserStatistics from '../../../api/user/queries/useGetUserStatistics'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
import useGetUrl from '../../../api/url/queries/useGetUrl'
import classNames from 'classnames'

function Profile () {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [profileImg, setProfileImg] = useState({ img: '', file: '' })
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)
  const [deleteModal, setDeleteModal] = useState()

  const { sMediaUrl } = useGetUrl()
  const { data: currencyLogo } = useGetCurrency()
  const { data: userData, refetch: refetchUserProfile } = useGetUserProfile()
  const { data: statisticsData } = useGetUserStatistics()
  const { mutate: logoutMutation } = useLogout({ setMessage, setAlert })
  const { mutate: updateProfilePic, isLoading } = useUpdateUserProfile({ setMessage, setAlert, refetchUserProfile })

  const handleChangeProfile = (e) => {
    if ((e.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
      setMessage(<FormattedMessage id='Please_select_a_file_less_than_5MB' />)
      setAlert(true)
      setTimeout(() => setAlert(false), 3000)
    } else if (e.target.files[0] && e.target.files[0].type.includes('image') && (e.target.files[0]?.size / 1024 / 1024).toFixed(2) < 5) {
      setProfileImg({ ...profileImg, img: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
      updateProfilePic({ type: 'img', userData: e.target.files[0] })
    }
  }

  useEffect(() => {
    if (state?.message) {
      setMessage(state.message)
      setAlert(true)
    }
  }, [state])

  useEffect(() => {
    if (userData) {
      setProfileImg({ ...profileImg, img: userData?.sProPic || '' })
    }
  }, [userData])

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 2000)
  }, [alert])

  return (
    <>
      { isLoading
        ? <Loading />
        : (
          <>
            <div className="user-container">
              {alert && message ? <Alert color="primary" isOpen={alert}>{message}</Alert> : ''}
              <div className="userprofile">
                <div className="userprofile_container">
                  <div className='d-flex justify-content-start align-items-center'>
                    <div className="u-img">
                      <img alt={<FormattedMessage id='Player_Image' />} src={profileImg?.img && sMediaUrl ? `${sMediaUrl}${profileImg.img}` : PlayerImage} />
                      <input accept="image/png, image/jpg, image/jpeg" className="d-none" id="profile" onChange={handleChangeProfile} type="file"/>
                      <label className="icon-camera" htmlFor="profile" />
                    </div>
                    <div className='class-user-name'>
                      <h2 className="u-name">{userData?.sUsername || userData?.sName || '--'}</h2>
                      <h2 className="u-name">
                        <Button className='outline btn-lineups2'>
                          <img className='me-1' src={Loyalty}/>
                          <FormattedMessage id="Points" />
                          :
                          <span className='ms-1'>{userData?.nLoyaltyPoints || 0}</span>
                        </Button>
                      </h2>
                    </div>
                  </div>
                  <div className="balance d-flex align-items-center justify-content-around">
                    <Container>
                      <Row className="justify-content-md-center">
                        <Col className='center'>
                          <div className="b-box">
                            <p>
                              {' '}
                              <FormattedMessage id="Available_Balance" />
                              {' '}
                            </p>
                            <b>
                              {currencyLogo}
                              {userData?.nCurrentTotalBalance || 0}
                            </b>
                          </div>
                        </Col>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Col className='center'>
                          <div className="b-box">
                            <div className='box'>
                              <div className='d-flex justify-content-center align-items-center'>
                                <p>
                                  {' '}
                                  <FormattedMessage id="Deposit_Balance" />
                                  {' '}
                                </p>
                                <Fragment>
                                  <button className={classNames('bg-transparent i-button match-i', { 'ms-2': document.dir !== 'rtl', 'me-2': document.dir === 'rtl' })} id='deposite-info' type="button"><img src={infoIconGray} width={16} /></button>
                                  <UncontrolledPopover placement="bottom" target='deposite-info' trigger="legacy">
                                    <PopoverBody><FormattedMessage id="Money_you_added_will_be_shown_here" /></PopoverBody>
                                  </UncontrolledPopover>
                                </Fragment>
                              </div>
                              <b>
                                {currencyLogo}
                                {userData?.nCurrentDepositBalance || 0}
                              </b>
                            </div>
                            <Link className="btn" to="/deposit" >
                              <FormattedMessage id="Deposit" />
                              <img alt='Goto Icon' src={gotoBlue} />
                            </Link>
                          </div>
                        </Col>
                        <Col className='center'>
                          <div className="b-box">
                            <div className='box'>
                              <div className='d-flex justify-content-center align-items-center'>
                                <p>
                                  {' '}
                                  <FormattedMessage id="Win_Balance" />
                                  {' '}
                                </p>
                                <Fragment>
                                  <button className={classNames('bg-transparent i-button match-i', { 'ms-2': document.dir !== 'rtl', 'me-2': document.dir === 'rtl' })} id='balance-info' type="button"><img src={infoIconGray} width={16} /></button>
                                  <UncontrolledPopover placement="bottom" target='balance-info' trigger="legacy">
                                    <PopoverBody><FormattedMessage id="Money_that_you_can_withdraw_or_reuse" /></PopoverBody>
                                  </UncontrolledPopover>
                                </Fragment>
                              </div>
                              <b>
                                {currencyLogo}
                                {userData?.nCurrentWinningBalance || 0}
                              </b>
                            </div>
                            <Link className="btn" state={userData} to={{ pathname: '/withdraw' }} >
                              <FormattedMessage id="Withdrawal" />
                              <img alt='Goto Icon' src={gotoBlue} />
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className="transaction-box d-flex justify-content-between" onClick={() => navigate('/transactions')} >
                    <FormattedMessage id="Transactions" />
                    <img alt='goto' src={goto} />
                  </div>
                </div>

                <div className="userprofile_second_container">
                  <div className="kyc-btn w-100 mb-0 btn btn-blue d-flex justify-content-between align-items-center" >
                    <span>
                      <img className="percentage" src={Percentage} />
                      <img src={Commission} />
                      <FormattedMessage id="Commission_of_private_contest" />
                    </span>
                    <span dir='ltr'>
                      <img className="commissionTwo" src={commissionTwo} />
                      {userData?.nLeagueCreatorCom || 0}
                      {' '}
                      %
                    </span>
                  </div>
                  <div className="u-matchinfo d-flex align-items-center justify-content-center">
                    <div className="um-box">
                      <img alt="Contests" src={Contests} width="40px" />
                      <p>{statisticsData && statisticsData.nTotalJoinLeague ? statisticsData.nTotalJoinLeague : 0}</p>
                      <span><FormattedMessage id="Contest" /></span>
                    </div>
                    <div className="um-box">
                      <img alt="Wins" src={Wins} width="40px" />
                      <p>{statisticsData && statisticsData.nTotalWinnings ? parseFloat(statisticsData.nTotalWinnings).toFixed(2) : 0}</p>
                      <span><FormattedMessage id="Wins" /></span>
                    </div>
                    <div className="um-box">
                      <img alt="Matches" src={Bonus} width="30px" />
                      <p>
                        {currencyLogo}
                        {userData?.nCurrentBonus || 0}
                      </p>
                      <span><FormattedMessage id="Bonus_Balance" /></span>
                    </div>
                  </div>
                  <ul className="p-links hide-hover my-4">
                    <li>
                      <Link to="/kyc-verification" >
                        <FormattedMessage id="KYC_Verification" />
                        <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/user-info" >
                        <FormattedMessage id="Edit_Profile" />
                        <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/refer-a-friend" >
                        <FormattedMessage id="Refer_a_friend" />
                        <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                      </Link>
                    </li>
                    {/* <li><Link to="/preference" ><FormattedMessage id="Preferences" /><i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'}></i></Link></li> */}
                    <li>
                      <Link to="/change-password">
                        <FormattedMessage id="Change_Password" />
                        <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/leader-board" >
                        <FormattedMessage id="Leaderboard" />
                        <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                      </Link>
                    </li>
                    <li onClick={() => logoutMutation({})}><Button><FormattedMessage id="Logout" /></Button></li>
                    <li onClick={() => setDeleteModal(true)}><Button className='delete-btn' color='link'><FormattedMessage id="Delete_Account" /></Button></li>
                  </ul>
                </div>
              </div>
              <Modal className='cancel-withdraw-modal' isOpen={deleteModal}>
                <ModalBody className='cancel-withdraw-modal-body d-flex flex-column justify-content-center align-items-center'>
                  <div className="first">
                    <h2><FormattedMessage id='Confirmation' /></h2>
                    <p><FormattedMessage id='Are_you_sure_you_want_to_delete_your_account' /></p>
                    <div className='container'>
                      <div className='row'>
                        <div className='col dlt-div border-left-0 border-bottom-0'>
                          <button className='dlt-btn' onClick={() => navigate('/delete-account')}><FormattedMessage id='Delete' /></button>
                        </div>
                        <div className='col dlt-div border-right-0 border-bottom-0'>
                          <button className='cncl-btn' onClick={() => setDeleteModal(false)}><FormattedMessage id='Cancel' /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </>
          )
    }
    </>
  )
}

Profile.propTypes = {
}

export default Profile
