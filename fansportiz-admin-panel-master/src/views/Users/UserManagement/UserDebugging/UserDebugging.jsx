import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getPassbookDetails, getStatisticDetails, getSystemUserPassbookDetails, getSystemUserStatisticDetails } from '../../../../actions/passbook'
import { useHistory } from 'react-router-dom'
import Loading from '../../../../components/Loading'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'

function UserDebugging (props) {
  const { usersDetails, match, systemUser, user } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const [userName, setUserName] = useState('')
  const [mobNum, setMobNum] = useState('')
  const [Email, setEmail] = useState('')
  const [RegistrationDate, setRegistrationDate] = useState('')
  const [isInternalAccount, setIsInternalAccount] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [TotalPlayedWithCash, setTotalPlayedWithCash] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [TotalPlayedWithBonus, setTotalPlayedWithBonus] = useState(0)
  const [loading, setLoading] = useState(false)
  const [PassbookData, setPassbookData] = useState([])
  const [StatisticData, setStatisticData] = useState([])

  const token = useSelector(state => state.auth.token)
  const passbookDetails = useSelector(state => state.passbook.passbookDetails)
  const statisticDetails = useSelector(state => state.passbook.statisticDetails)
  const systemUserPassbookDetails = useSelector(state => state.passbook.systemUserPassbookDetails)
  const systemUserStatisticDetails = useSelector(state => state.passbook.systemUserStatisticDetails)
  const resMessage = useSelector(state => state.passbook.resMessage)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({ PassbookData, StatisticData, resMessage }).current

  useEffect(() => {
    if (match && match.params && match.params.id) {
      if (systemUser) {
        dispatch(getSystemUserPassbookDetails(match.params.id, token))
        dispatch(getSystemUserStatisticDetails(match.params.id, token))
      } else {
        dispatch(getPassbookDetails(match.params.id, token))
        dispatch(getStatisticDetails(match.params.id, token))
      }
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    if (usersDetails) {
      setUserName(usersDetails.sUsername)
      setMobNum(usersDetails.sMobNum)
      setEmail(usersDetails.sEmail)
      setRegistrationDate(usersDetails.dCreatedAt)
      setIsInternalAccount(usersDetails.bIsInternalAccount)
    }
  }, [usersDetails])

  useEffect(() => {
    if (passbookDetails && statisticDetails) {
      setPassbookData(passbookDetails)
      setStatisticData(statisticDetails)
    } else if (systemUserPassbookDetails && systemUserStatisticDetails) {
      setPassbookData(systemUserPassbookDetails)
      setStatisticData(systemUserStatisticDetails)
    }
  }, [passbookDetails, statisticDetails, systemUserPassbookDetails, systemUserStatisticDetails])

  useEffect(() => {
    if (previousProps.PassbookData !== PassbookData && previousProps.StatisticData !== StatisticData) {
      if (PassbookData && StatisticData && resMessage) {
        setTotalPlayedWithCash(((StatisticData.oCricket && StatisticData.oCricket.nSpendingCash ? StatisticData.oCricket.nSpendingCash : 0) +
          (StatisticData.oFootball && StatisticData.oFootball.nSpendingCash ? StatisticData.oFootball.nSpendingCash : 0) +
          (StatisticData.oBasketball && StatisticData.oBasketball.nSpendingCash ? StatisticData.oBasketball.nSpendingCash : 0) +
          (StatisticData.oKabaddi && StatisticData.oKabaddi.nSpendingCash ? StatisticData.oKabaddi.nSpendingCash : 0)) + (StatisticData.nTotalPlayReturnCash ? StatisticData.nTotalPlayReturnCash : 0))
        setTotalPlayedWithBonus(((StatisticData.oCricket && StatisticData.oCricket.nSpendingBonus ? StatisticData.oCricket.nSpendingBonus : 0) +
          (StatisticData.oFootball && StatisticData.oFootball.nSpendingBonus ? StatisticData.oFootball.nSpendingBonus : 0) +
          (StatisticData.oBasketball && StatisticData.oBasketball.nSpendingBonus ? StatisticData.oBasketball.nSpendingBonus : 0) +
          (StatisticData.oKabaddi && StatisticData.oKabaddi.nSpendingBonus ? StatisticData.oKabaddi.nSpendingBonus : 0)) + (StatisticData.nTotalPlayReturnBonus ? StatisticData.nTotalPlayReturnBonus : 0))
        setLoading(false)
      }
    }
    return () => {
      previousProps.PassbookData = PassbookData
      previousProps.StatisticData = StatisticData
      previousProps.resMessage = resMessage
    }
  }, [PassbookData, StatisticData, resMessage])

  return (
      <main className="main-content d-flex">
        {loading && <Loading />}
        <section className="user-section">
          <Row>
            <Col lg='2' md='1'></Col>
            <Col lg="8" md='10'>
              <Row className="common-box text-start mb-4">
                <Col md="12 mb-4">
                  <div className='d-inline-flex'>
                  <img src={backIcon} className='custom-go-back' onClick={() => props?.location?.state?.goBack === 'yes' ? history.goBack() : systemUser ? history.push(`/users/system-users${page?.SystemUser || ''}`) : user ? history.push(`/users/user-management${page?.UserManagement || ''}`) : history.goBack()}></img>
                    <h2>User Debugger</h2>
                  </div>
                </Col>

                <Col>
                  <div>Email</div>
                  <h5><b>{Email || 'No data available'}</b></h5>
                </Col>
                <Col>
                  <div>Username</div>
                  <h5><b>{userName || 'No data available'}</b></h5>
                </Col>
                <Col>
                  <div>Mobile Number</div>
                  <h5><b>{mobNum || 'No data available'}</b></h5>
                </Col>
                <Col>
                  <div>Registration Date</div>
                  <h5><b>{RegistrationDate ? moment(RegistrationDate).format('DD-MM-YYYY') : 'No data available'}</b></h5>
                </Col>
                {isInternalAccount && <Col>
                  <h5 className='account-text'><b>Internal Account</b></h5>
                </Col>}
              </Row>

              <Row>
                <Col md='6' className="mb-4">
                  <div className="table-responsive common-box">
                    <h3 className="text-center">Cash Details(Passbook)</h3>
                    {PassbookData
                      ? <table className="table">
                      <tbody>
                        <tr>
                          <td>Opening Cash</td>
                          <td><b>0</b></td>
                        </tr>
                        <tr>
                          <td>Total Deposit</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalDepositAmount) ? Number(PassbookData.nTotalDepositAmount) : Number(PassbookData.nTotalDepositAmount).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Total Withdrawal</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalWithdrawAmount) ? Number(PassbookData.nTotalWithdrawAmount) : Number(PassbookData.nTotalWithdrawAmount).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Total Winnings</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalWinningAmount) ? Number(PassbookData.nTotalWinningAmount) : Number(PassbookData.nTotalWinningAmount).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Total Bonus Earned</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalBonusEarned) ? Number(PassbookData.nTotalBonusEarned) : Number(PassbookData.nTotalBonusEarned).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="text-center"><b>Total Played</b></td>
                        </tr>
                        <tr>
                          <td>Total Played Cash</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalPlayedCash) ? Number(PassbookData.nTotalPlayedCash) : Number(PassbookData.nTotalPlayedCash).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Total Played Bonus</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalPlayedBonus) ? Number(PassbookData.nTotalPlayedBonus) : Number(PassbookData.nTotalPlayedBonus).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="text-center"><b>Play Return</b></td>
                        </tr>
                        <tr>
                          <td>Total Play Return Cash</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalPlayReturnCash) ? Number(PassbookData.nTotalPlayReturnCash) : Number(PassbookData.nTotalPlayReturnCash).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Total Play Return Bonus</td>
                          <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalPlayReturnBonus) ? Number(PassbookData.nTotalPlayReturnBonus) : Number(PassbookData.nTotalPlayReturnBonus).toFixed(2)))}</b></td>
                        </tr>
                      </tbody>
                    </table>
                      : 'No Data Available'}
                  </div>
                </Col>
                <Col md='6' className="mb-4">
                  <Fragment>
                    <div className="table-responsive common-box">
                      <h3 className="text-center">Cash Details(Statistics)</h3>
                      {StatisticData
                        ? <table className="table">
                        <tbody>
                          <tr>
                            <td>Opening Cash</td>
                            <td><b>0</b></td>
                          </tr>
                          <tr>
                            <td>Total Deposit</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nDeposits) ? Number(StatisticData.nDeposits) : Number(StatisticData.nDeposits).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                            <td>Total Withdrawal</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nWithdraw) ? Number(StatisticData.nWithdraw) : Number(StatisticData.nWithdraw).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                            <td>Total Winnings</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nTotalWinnings) ? Number(StatisticData.nTotalWinnings) : Number(StatisticData.nTotalWinnings).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                            <td>Total Bonus Earned</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nBonus) ? Number(StatisticData.nBonus) : Number(StatisticData.nBonus).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                            <td colSpan="2" className="text-center"><b>Total Played</b></td>
                          </tr>
                          <tr>
                            <td>Total Played Cash</td>
                            <td><b>{StatisticData?.nTotalPlayedCash ? StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nTotalPlayedCash) ? Number(StatisticData.nTotalPlayedCash) : Number(StatisticData.nTotalPlayedCash).toFixed(2))) : 0}</b></td>
                          </tr>
                          <tr>
                            <td>Total Played Bonus</td>
                            <td><b>{StatisticData?.nTotalPlayedBonus ? StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nTotalPlayedBonus) ? Number(StatisticData.nTotalPlayedBonus) : Number(StatisticData.nTotalPlayedBonus).toFixed(2))) : 0}</b></td>
                          </tr>
                          <tr>
                            <td colSpan="2" className="text-center"><b>Play Return</b></td>
                          </tr>
                          <tr>
                            <td>Total Play Return Cash</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nTotalPlayReturnCash) ? Number(StatisticData.nTotalPlayReturnCash) : Number(StatisticData.nTotalPlayReturnCash).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                            <td>Total Play Return Bonus</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nTotalPlayReturnBonus) ? Number(StatisticData.nTotalPlayReturnBonus) : Number(StatisticData.nTotalPlayReturnBonus).toFixed(2)))}</b></td>
                          </tr>
                        </tbody>
                      </table>
                        : 'No Data Available'}
                    </div>
                  </Fragment>
                </Col>

              <Col md='6' className="mb-4">
                <Fragment>
                  <div className="table-responsive common-box">
                    <h3 className="text-center">Difference(Passbook - Statistics)</h3>
                    {PassbookData
                      ? <table className="table">
                      <tbody>
                        <tr>
                          <td>Current Deposit Balance</td>
                            <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nCurrentDepositBalance) ? Number(PassbookData.nCurrentDepositBalance) : Number(PassbookData.nCurrentDepositBalance).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Actual Deposit Balance</td>
                          <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nActualDepositBalance) ? Number(StatisticData.nActualDepositBalance) : Number(StatisticData.nActualDepositBalance).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td><b>Deposit Balance(Current - Actual)</b></td>
                          <td><b>{(PassbookData?.length === 0)
                            ? 0
                            : ((Number.isInteger(PassbookData.nCurrentDepositBalance) ? Number(PassbookData.nCurrentDepositBalance) : Number(PassbookData.nCurrentDepositBalance).toFixed(2)) -
                            (Number.isInteger(StatisticData.nActualDepositBalance) ? Number(StatisticData.nActualDepositBalance) : Number(StatisticData.nActualDepositBalance).toFixed(2))).toFixed(2)}</b></td>
                        </tr>
                        <tr>
                          <td>Current Winning Balance</td>
                            <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nCurrentWinningBalance) ? Number(PassbookData.nCurrentWinningBalance) : Number(PassbookData.nCurrentWinningBalance).toFixed(2)))}</b></td>
                        </tr>
                          <tr>
                            <td>Actual Winning Balance</td>
                            <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nActualWinningBalance) ? Number(StatisticData.nActualWinningBalance) : Number(StatisticData.nActualWinningBalance).toFixed(2)))}</b></td>
                          </tr>
                          <tr>
                          <td><b>Winning Balance(Current - Actual)</b></td>
                            <td><b>{(PassbookData?.length === 0) ? 0 : ((Number.isInteger(PassbookData.nCurrentWinningBalance) ? Number(PassbookData.nCurrentWinningBalance) : Number(PassbookData.nCurrentWinningBalance).toFixed(2)) - (Number.isInteger(StatisticData.nActualWinningBalance) ? Number(StatisticData.nActualWinningBalance) : Number(StatisticData.nActualWinningBalance).toFixed(2))).toFixed(2)}</b></td>
                        </tr>
                        <tr>
                          <td>Current Bonus</td>
                            <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nCurrentBonus) ? Number(PassbookData.nCurrentBonus) : Number(PassbookData.nCurrentBonus).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td>Actual Bonus</td>
                          <td><b>{StatisticData?.length === 0 ? 0 : ((Number.isInteger(StatisticData.nActualBonus) ? Number(StatisticData.nActualBonus) : Number(StatisticData.nActualBonus).toFixed(2)))}</b></td>
                        </tr>
                        <tr>
                          <td><b>Bonus(Current - Actual)</b></td>
                            <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nCurrentBonus) ? Number(PassbookData.nCurrentBonus) : Number(PassbookData.nCurrentBonus).toFixed(2)) - (Number.isInteger(StatisticData.nActualBonus) ? Number(StatisticData.nActualBonus) : Number(StatisticData.nActualBonus).toFixed(2))).toFixed(2)}</b></td>
                        </tr>
                      </tbody>
                    </table>
                      : 'No Data Available'}
                  </div>
                </Fragment>
              </Col>
              <Col md='6' className="mb-4">
                <Fragment>
                  <div className="table-responsive common-box">
                    <h3 className="text-center">User Balance Details</h3>
                    {StatisticData
                      ? <table className="table">
                      <tbody>
                      <tr>
                        <td>Total Creator Bonus</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalCreatorBonus) ? Number(PassbookData.nTotalCreatorBonus) : Number(PassbookData.nTotalCreatorBonus).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Total Refer Bonus</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalReferBonus) ? Number(PassbookData.nTotalReferBonus) : Number(PassbookData.nTotalReferBonus).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Register Bonus</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalRegisterBonus) ? Number(PassbookData.nTotalRegisterBonus) : Number(PassbookData.nTotalRegisterBonus).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Last Pending Withdrawal</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nLastPendingWithdraw) ? Number(PassbookData.nLastPendingWithdraw) : Number(PassbookData.nLastPendingWithdraw).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Win Balance At Last Pending Withdrawal</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nWinBalanceAtLastPendingWithdraw) ? Number(PassbookData.nWinBalanceAtLastPendingWithdraw) : Number(PassbookData.nWinBalanceAtLastPendingWithdraw).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Total Cashback Cash</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalCashbackCash) ? Number(PassbookData.nTotalCashbackCash) : Number(PassbookData.nTotalCashbackCash).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Total Cashback Bonus</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalCashbackBonus) ? Number(PassbookData.nTotalCashbackBonus) : Number(PassbookData.nTotalCashbackBonus).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Bonus Expired</td>
                        <td><b>{PassbookData?.length === 0 ? 0 : ((Number.isInteger(PassbookData.nTotalBonusExpired) ? Number(PassbookData.nTotalBonusExpired) : Number(PassbookData.nTotalBonusExpired).toFixed(2)))}</b></td>
                      </tr>
                      <tr>
                        <td>Promo Code Discount</td>
                        <td>
                          <b>
                            {StatisticData?.length === 0
                              ? 0
                              : StatisticData.nDiscountAmount && !StatisticData.nDepositDiscount
                                ? ((Number.isInteger(StatisticData.nDiscountAmount)
                                    ? Number(StatisticData.nDiscountAmount) + 0
                                    : Number(StatisticData.nDiscountAmount).toFixed(2) + 0))
                                : !StatisticData.nDiscountAmount && StatisticData.nDepositDiscount
                                    ? ((Number.isInteger(StatisticData.nDepositDiscount)
                                        ? Number(StatisticData.nDepositDiscount) + 0
                                        : Number(StatisticData.nDepositDiscount).toFixed(2) + 0))
                                    : StatisticData.nDiscountAmount && StatisticData.nDepositDiscount
                                      ? ((Number.isInteger(StatisticData.nDiscountAmount) && Number.isInteger(StatisticData.nDepositDiscount)
                                          ? Number(StatisticData.nDiscountAmount) + Number(StatisticData.nDepositDiscount)
                                          : Number(StatisticData.nDepositDiscount).toFixed(2) + Number(StatisticData.nDepositDiscount).toFixed(2)))
                                      : 0}
                          </b>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                      : 'No Data Available'}
                  </div>
                </Fragment>
              </Col>
              {StatisticData && !StatisticData.oCricket && !StatisticData.oFootball && !StatisticData.oBasketball && !StatisticData.oKabaddi
                ? <Col md="12" className="text-center common-box my-5">
                  <h1 className="h1">User Statistics</h1>
                  <h2>No Data Available</h2>
                </Col>
                : <Col md="12">
                <Row>
                <Col md="12" className="h1 text-center common-box">User Statistics</Col>
                {StatisticData && StatisticData.oCricket &&
              <Col md="6">
                <Fragment>
                  <div className="table-responsive common-box">
                    <h3 className="text-center">Cricket</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                        <td><b>{StatisticData.oCricket.nCreatePLeague ? (Number.isInteger(StatisticData.oCricket.nCreatePLeague) ? Number(StatisticData.oCricket.nCreatePLeague) : Number(StatisticData.oCricket.nCreatePLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td><b>{StatisticData.oCricket.nJoinLeague ? (Number.isInteger(StatisticData.oCricket.nJoinLeague) ? Number(StatisticData.oCricket.nJoinLeague) : Number(StatisticData.oCricket.nJoinLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td><b>{StatisticData.oCricket.nJoinPLeague ? (Number.isInteger(StatisticData.oCricket.nJoinPLeague) ? Number(StatisticData.oCricket.nJoinPLeague) : Number(StatisticData.oCricket.nJoinPLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td><b>{StatisticData.oCricket.nCreatePLeagueSpend ? (Number.isInteger(StatisticData.oCricket.nCreatePLeagueSpend) ? Number(StatisticData.oCricket.nCreatePLeagueSpend) : Number(StatisticData.oCricket.nCreatePLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td><b>{StatisticData.oCricket.nJoinPLeagueSpend ? (Number.isInteger(StatisticData.oCricket.nJoinPLeagueSpend) ? Number(StatisticData.oCricket.nJoinPLeagueSpend) : Number(StatisticData.oCricket.nJoinPLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td><b>{StatisticData.oCricket.nSpending ? (Number.isInteger(StatisticData.oCricket.nSpending) ? Number(StatisticData.oCricket.nSpending) : Number(StatisticData.oCricket.nSpending).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td><b>{StatisticData.oCricket.nCashbackAmount ? (Number.isInteger(StatisticData.oCricket.nCashbackAmount) ? Number(StatisticData.oCricket.nCashbackAmount) : Number(StatisticData.oCricket.nJoinLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td><b>{StatisticData.oCricket.nWinAmount ? (Number.isInteger(StatisticData.oCricket.nWinAmount) ? Number(StatisticData.oCricket.nWinAmount) : Number(StatisticData.oCricket.nWinAmount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td><b>{StatisticData.oCricket.nWinCount ? (Number.isInteger(StatisticData.oCricket.nWinCount) ? Number(StatisticData.oCricket.nWinCount) : Number(StatisticData.oCricket.nWinCount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td><b>{StatisticData.oCricket.nPlayReturn ? (Number.isInteger(StatisticData.oCricket.nPlayReturn) ? Number(StatisticData.oCricket.nPlayReturn) : Number(StatisticData.oCricket.nPlayReturn).toFixed(2)) : 0}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>}

              {StatisticData && StatisticData.oFootball &&
              <Col md="6" className="mb-3">
                <Fragment>
                  <div className="table-responsive common-box">
                    <h3 className="text-center">Football</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td><b>{StatisticData?.oFootball?.nCreatePLeague ? (Number.isInteger(StatisticData.oFootball.nCreatePLeague) ? Number(StatisticData.oFootball.nCreatePLeague) : Number(StatisticData.oFootball.nCreatePLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td><b>{StatisticData?.oFootball?.nJoinLeague ? (Number.isInteger(StatisticData.oFootball.nJoinLeague) ? Number(StatisticData.oFootball.nJoinLeague) : Number(StatisticData.oFootball.nJoinLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td><b>{StatisticData?.oFootball?.nJoinPLeague ? (Number.isInteger(StatisticData.oFootball.nJoinPLeague) ? Number(StatisticData.oFootball.nJoinPLeague) : Number(StatisticData.oFootball.nJoinPLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td><b>{StatisticData?.oFootball?.nCreatePLeagueSpend ? (Number.isInteger(StatisticData.oFootball.nCreatePLeagueSpend) ? Number(StatisticData.oFootball.nCreatePLeagueSpend) : Number(StatisticData.oFootball.nCreatePLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td><b>{StatisticData?.oFootball?.nJoinPLeagueSpend ? (Number.isInteger(StatisticData.oFootball.nJoinPLeagueSpend) ? Number(StatisticData.oFootball.nJoinPLeagueSpend) : Number(StatisticData.oFootball.nJoinPLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td><b>{StatisticData?.oFootball?.nSpending ? (Number.isInteger(StatisticData.oFootball.nSpending) ? Number(StatisticData.oFootball.nSpending) : Number(StatisticData.oFootball.nSpending).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td><b>{StatisticData?.oFootball?.nCashbackAmount ? (Number.isInteger(StatisticData.oFootball.nCashbackAmount) ? Number(StatisticData.oFootball.nCashbackAmount) : Number(StatisticData.oFootball.nCashbackAmount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td><b>{StatisticData?.oFootball?.nWinAmount ? (Number.isInteger(StatisticData.oFootball.nWinAmount) ? Number(StatisticData.oFootball.nWinAmount) : Number(StatisticData.oFootball.nWinAmount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td><b>{StatisticData?.oFootball?.nWinCount ? (Number.isInteger(StatisticData.oFootball.nWinCount) ? Number(StatisticData.oFootball.nWinCount) : Number(StatisticData.oFootball.nWinCount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td><b>{StatisticData?.oFootball?.nPlayReturn ? (Number.isInteger(StatisticData.oFootball.nPlayReturn) ? Number(StatisticData.oFootball.nPlayReturn) : Number(StatisticData.oFootball.nPlayReturn).toFixed(2)) : 0}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>}

              {StatisticData && StatisticData.oBasketball &&
                <Col md="6">
                <Fragment>
                  <div className="table-responsive common-box">
                    <h3 className="text-center">Basketball</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Create Private League</td>
                          <td><b>{StatisticData?.oBasketball?.nCreatePLeague ? (Number.isInteger(StatisticData.oBasketball.nCreatePLeague) ? Number(StatisticData.oBasketball.nCreatePLeague) : Number(StatisticData.oBasketball.nCreatePLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join League</td>
                          <td><b>{StatisticData?.oBasketball?.nJoinLeague ? (Number.isInteger(StatisticData.oBasketball.nJoinLeague) ? Number(StatisticData.oBasketball.nJoinLeague) : Number(StatisticData.oBasketball.nJoinLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Join Private League</td>
                          <td><b>{StatisticData?.oBasketball?.nJoinPLeague ? (Number.isInteger(StatisticData.oBasketball.nJoinPLeague) ? Number(StatisticData.oBasketball.nJoinPLeague) : Number(StatisticData.oBasketball.nJoinPLeague).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Total Private League Creator Bonus</td>
                          <td><b>{StatisticData?.oBasketball?.nCreatePLeagueSpend ? (Number.isInteger(StatisticData.oBasketball.nCreatePLeagueSpend) ? Number(StatisticData.oBasketball.nCreatePLeagueSpend) : Number(StatisticData.oBasketball.nCreatePLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Join Private League Spend</td>
                          <td><b>{StatisticData?.oBasketball?.nJoinPLeagueSpend ? (Number.isInteger(StatisticData.oBasketball.nJoinPLeagueSpend) ? Number(StatisticData.oBasketball.nJoinPLeagueSpend) : Number(StatisticData.oBasketball.nJoinPLeagueSpend).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Spending</td>
                          <td><b>{StatisticData?.oBasketball?.nSpending ? (Number.isInteger(StatisticData.oBasketball.nSpending) ? Number(StatisticData.oBasketball.nSpending) : Number(StatisticData.oBasketball.nSpending).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Cashback Amount</td>
                          <td><b>{StatisticData?.oBasketball?.nCashbackAmount ? (Number.isInteger(StatisticData.oBasketball.nCashbackAmount) ? Number(StatisticData.oBasketball.nCashbackAmount) : Number(StatisticData.oBasketball.nCashbackAmount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Amount</td>
                          <td><b>{StatisticData?.oBasketball?.nWinAmount ? (Number.isInteger(StatisticData.oBasketball.nWinAmount) ? Number(StatisticData.oBasketball.nWinAmount) : Number(StatisticData.oBasketball.nWinAmount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Win Count</td>
                          <td><b>{StatisticData?.oBasketball?.nWinCount ? (Number.isInteger(StatisticData.oBasketball.nWinCount) ? Number(StatisticData.oBasketball.nWinCount) : Number(StatisticData.oBasketball.nWinCount).toFixed(2)) : 0}</b></td>
                        </tr>
                        <tr>
                          <td>Play Return</td>
                          <td><b>{StatisticData?.oBasketball?.nPlayReturn ? (Number.isInteger(StatisticData.oBasketball.nPlayReturn) ? Number(StatisticData.oBasketball.nPlayReturn) : Number(StatisticData.oBasketball.nPlayReturn).toFixed(2)) : 0}</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              </Col>}

              {StatisticData && StatisticData.oKabaddi &&
                <Col md="6">
            <Fragment>
              <div className="table-responsive common-box">
                <h3 className="text-center">Kabaddi</h3>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Create Private League</td>
                      <td><b>{StatisticData?.oKabaddi?.nCreatePLeague ? (Number.isInteger(StatisticData.oKabaddi.nCreatePLeague) ? Number(StatisticData.oKabaddi.nCreatePLeague) : Number(StatisticData.oKabaddi.nCreatePLeague).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Total Join League</td>
                          <td><b>{StatisticData?.oKabaddi?.nJoinLeague ? (Number.isInteger(StatisticData.oKabaddi.nJoinLeague) ? Number(StatisticData.oKabaddi.nJoinLeague) : Number(StatisticData.oKabaddi.nJoinLeague).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Total Join Private League</td>
                      <td><b>{StatisticData?.oKabaddi?.nJoinPLeague ? (Number.isInteger(StatisticData.oKabaddi.nJoinPLeague) ? Number(StatisticData.oKabaddi.nJoinPLeague) : Number(StatisticData.oKabaddi.nJoinPLeague).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Total Private League Creator Bonus</td>
                      <td><b>{StatisticData?.oKabaddi?.nCreatePLeagueSpend ? (Number.isInteger(StatisticData.oKabaddi.nCreatePLeagueSpend) ? Number(StatisticData.oKabaddi.nCreatePLeagueSpend) : Number(StatisticData.oKabaddi.nCreatePLeagueSpend).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Join Private League Spend</td>
                      <td><b>{StatisticData?.oKabaddi?.nJoinPLeagueSpend ? (Number.isInteger(StatisticData.oKabaddi.nJoinPLeagueSpend) ? Number(StatisticData.oKabaddi.nJoinPLeagueSpend) : Number(StatisticData.oKabaddi.nJoinPLeagueSpend).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Spending</td>
                      <td><b>{StatisticData?.oKabaddi?.nSpending ? (Number.isInteger(StatisticData.oKabaddi.nSpending) ? Number(StatisticData.oKabaddi.nSpending) : Number(StatisticData.oKabaddi.nSpending).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Cashback Amount</td>
                      <td><b>{StatisticData?.oKabaddi?.nCashbackAmount ? (Number.isInteger(StatisticData.oKabaddi.nCashbackAmount) ? Number(StatisticData.oKabaddi.nCashbackAmount) : Number(StatisticData.oKabaddi.nCashbackAmount).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Win Amount</td>
                      <td><b>{StatisticData?.oKabaddi?.nWinAmount ? (Number.isInteger(StatisticData.oKabaddi.nWinAmount) ? Number(StatisticData.oKabaddi.nWinAmount) : Number(StatisticData.oKabaddi.nWinAmount).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Win Count</td>
                      <td><b>{StatisticData?.oKabaddi?.nWinCount ? (Number.isInteger(StatisticData.oKabaddi.nWinCount) ? Number(StatisticData.oKabaddi.nWinCount) : Number(StatisticData.oKabaddi.nWinCount).toFixed(2)) : 0}</b></td>
                    </tr>
                    <tr>
                      <td>Play Return</td>
                      <td><b>{StatisticData?.oKabaddi?.nPlayReturn ? (Number.isInteger(StatisticData.oKabaddi.nPlayReturn) ? Number(StatisticData.oKabaddi.nPlayReturn) : Number(StatisticData.oKabaddi.nPlayReturn).toFixed(2)) : 0}</b></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Fragment>
          </Col>}
              </Row>
              </Col>}
              </Row>
            </Col>
            <Col lg="2" md='1'></Col>
          </Row>
        </section>
      </main>
  )
}

UserDebugging.propTypes = {
  usersDetails: PropTypes.object,
  match: PropTypes.object,
  systemUser: PropTypes.bool,
  user: PropTypes.bool,
  location: PropTypes.object
}

export default UserDebugging
