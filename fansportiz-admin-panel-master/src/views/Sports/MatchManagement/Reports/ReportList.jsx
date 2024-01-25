import React, {
  useRef, useState, useEffect, Fragment
} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Button, UncontrolledAlert, Row, Col, UncontrolledPopover, PopoverBody
} from 'reactstrap'
import Loading from '../../../../components/Loading'
import { generateReportList, getReportList, updateMatchReport } from '../../../../actions/matchreport'
import refreshIcon from '../../../../assets/images/refresh.svg'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export'
import excelIcon from '../../../../assets/images/excel-icon.svg'
import infoIcon from '../../../../assets/images/info2.svg'

function ReportList (props) {
  const { match, MatchPageLink } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const reportExporter = useRef(null)
  const topEarnedExporter = useRef(null)
  const topLostExporter = useRef(null)
  const topSpendExporter = useRef(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.matchreport.resStatus)
  const resMessage = useSelector(state => state.matchreport.resMessage)
  const reportList = useSelector(state => state.matchreport.reportList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resStatus, resMessage
  }).current

  // dispatch action to generate match report
  useEffect(() => {
    dispatch(generateReportList(match.params.id, token))
    setLoading(true)
  }, [])

  // dispatch action to get match report
  function getReportListFun () {
    if (match && match.params && match.params.id) {
      dispatch(getReportList(match.params.id, token))
      setLoading(true)
    }
  }

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setModalMessage(true)
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // dispatch action to update match report
  function updateReportFunc () {
    if (match && match.params && match.params.id) {
      dispatch(updateMatchReport(match.params.id, token))
      setLoading(true)
    }
  }

  const processExcelExportData = (data, type) => {
    if (type === 'Report') {
      const finalData = data.map((reportDetails) => {
        return reportDetails
      })
      return finalData
    } else if (type === 'TopEarned' || type === 'TopLost' || type === 'TopSpend') {
      const finalData = data.map((user, index) => {
        const sUsername = (user.sUsername || '--') + (user.eType === 'B' ? '(B)' : '')
        const sEmail = user.sEmail || '--'
        const nBonusUtil = user.nBonusUtil ? (user.nBonusUtil).toFixed(2) : '0'
        const nLeagueJoin = user.nLeagueJoin ? user.nLeagueJoin : '0'
        const nLeagueJoinAmount = user.nLeagueJoinAmount ? (user.nLeagueJoinAmount).toFixed(2) : '0'
        const nTotalEarned = user.nTotalEarned ? Number(user.nTotalEarned).toFixed(2) : 0
        const nTotalLoss = user.nTotalLoss ? Number(user.nTotalLoss).toFixed(2) : 0
        const nTeams = user.nTeams ? user.nTeams : '0'
        return {
          ...user,
          no: index + 1,
          sUsername,
          sEmail,
          nBonusUtil,
          nLeagueJoin,
          nLeagueJoinAmount,
          nTotalEarned,
          nTotalLoss,
          nTeams
        }
      })
      return finalData
    }
  }

  function onExport (type) {
    if (type === 'Report') {
      const fieldsArr = [
        { detailsField: 'Amount', detailsData: Number(reportList?.nAmount).toFixed(2), privateField: 'Amount', privateData: Number(reportList?.oPrivate?.nAmount).toFixed(2), publicField: 'Amount', publicData: Number(reportList?.oPublic?.nAmount).toFixed(2) },
        { detailsField: 'Distributed Amount', detailsData: Number(reportList?.nDistAmount).toFixed(2), privateField: 'Distributed Amount', privateData: Number(reportList?.oPrivate?.nDistAmount).toFixed(2), publicField: 'Bot User Amount', publicData: Number(reportList?.oPublic?.nBotAmount).toFixed(2) },
        { detailsField: 'Cash', detailsData: Number(reportList?.nCash).toFixed(2), privateField: 'Cash', privateData: Number(reportList?.oPrivate?.nCash).toFixed(2), publicField: 'Bonus', publicData: Number(reportList?.oPublic?.nBonus).toFixed(2) },
        { detailsField: 'Bonus', detailsData: Number(reportList?.nBonus).toFixed(2), privateField: 'Bonus', privateData: Number(reportList?.oPrivate?.nBonus).toFixed(2), publicField: 'Bot User Bonus', publicData: Number(reportList?.oPublic?.nBotBonus).toFixed(2) },
        { detailsField: 'Team Join', detailsData: Number(reportList?.nTeamJoin).toFixed(2), privateField: 'Team Join', privateData: Number(reportList?.oPrivate?.nTeamJoin).toFixed(2), publicField: 'Cash', publicData: Number(reportList?.oPublic?.nCash).toFixed(2) },
        { detailsField: 'Total Team', detailsData: Number(reportList?.nTotalTeam).toFixed(2), privateField: 'League', privateData: Number(reportList?.oPrivate?.nLeague).toFixed(2), publicField: 'Bot User Cash', publicData: Number(reportList?.oPublic?.nBotCash).toFixed(2) },
        { detailsField: 'Total User Count', detailsData: Number(reportList?.nTotalUserCount).toFixed(2), privateField: 'Live League', privateData: Number(reportList?.oPrivate?.nRunLeague).toFixed(2), publicField: 'Cashback Cash', publicData: Number(reportList?.oPublic?.nCashbackCash).toFixed(2) },
        { detailsField: 'League', detailsData: Number(reportList?.nLeague).toFixed(2), privateField: 'Cancel League', privateData: Number(reportList?.oPrivate?.nCancelLeague).toFixed(2), publicField: 'Bot User Cashback Cash', publicData: Number(reportList?.oPublic?.nBotCashbackCash).toFixed(2) },
        { detailsField: 'Live League', detailsData: Number(reportList?.nRunLeague).toFixed(2), privateField: 'Admin Commission', privateData: Number(reportList?.oPrivate?.nAdminCommission).toFixed(2), publicField: 'Cashback Bonus', publicData: Number(reportList?.oPublic?.nCashbackBonus).toFixed(2) },
        { detailsField: 'Cancel League', detailsData: Number(reportList?.nCancelLeague).toFixed(2), privateField: 'Creator Commission', privateData: Number(reportList?.oPrivate?.nCreatorCommission).toFixed(2), publicField: 'Bot User Cashback Bonus', publicData: Number(reportList?.oPublic?.nBotCashbackBonus).toFixed(2) },
        { detailsField: 'Promo Discount', detailsData: Number(reportList?.nPromoDiscount).toFixed(2), publicField: 'Cashback Return Cash', publicData: Number(reportList?.oPublic?.nCashbackReturnCash).toFixed(2) },
        { detailsField: 'Cashback Cash', detailsData: Number(reportList?.nCashbackCash).toFixed(2), publicField: 'Bot User Cashback Return Cash', publicData: Number(reportList?.oPublic?.nBotCashbackReturnCash).toFixed(2) },
        { detailsField: 'Bot Cashback Cash', detailsData: Number(reportList?.nBotCashbackCash).toFixed(2), publicField: 'Cashback Return Bonus', publicData: Number(reportList?.oPublic?.nCashbackReturnBonus).toFixed(2) },
        { detailsField: 'Cashback Bonus', detailsData: Number(reportList?.nCashbackBonus).toFixed(2), publicField: 'Bot User Cashback Return Bonus', publicData: Number(reportList?.oPublic?.nBotCashbackReturnBonus).toFixed(2) },
        { detailsField: 'Bot Cashback Bonus', detailsData: Number(reportList?.nBotCashbackBonus).toFixed(2), publicField: 'Promo Discount', publicData: Number(reportList?.oPublic?.nPromoDiscount).toFixed(2) },
        { detailsField: 'Cashback Return Cash', detailsData: Number(reportList?.nCashbackReturnCash).toFixed(2), publicField: 'Bot Promo Discount', publicData: Number(reportList?.oPublic?.nBotPromoDiscount).toFixed(2) },
        { detailsField: 'Bot Cashback Return Cash', detailsData: Number(reportList?.nBotCashbackReturnCash).toFixed(2), publicField: 'Distributed Amount', publicData: Number(reportList?.oPublic?.nDistAmount).toFixed(2) },
        { detailsField: 'Cashback Return Bonus', detailsData: Number(reportList?.nCashbackReturnBonus).toFixed(2), publicField: 'Bot Distributed Amount', publicData: Number(reportList?.oPublic?.nBotDistAmount).toFixed(2) },
        { detailsField: 'Bot Cashback Return Bonus', detailsData: Number(reportList?.nBotCashbackReturnBonus).toFixed(2), publicField: 'League', publicData: Number(reportList?.oPublic?.nLeague).toFixed(2) },
        { detailsField: 'Play Return Cash', detailsData: Number(reportList?.nPlayReturnCash).toFixed(2), publicField: 'Live League', publicData: Number(reportList?.oPublic?.nRunLeague).toFixed(2) },
        { detailsField: 'Bot Play Return Cash', detailsData: Number(reportList?.nBotPlayReturnCash).toFixed(2), publicField: 'Cancel League', publicData: Number(reportList?.oPublic?.nCancelLeague).toFixed(2) },
        { detailsField: 'Play Return Bonus', detailsData: Number(reportList?.nPlayReturnBonus).toFixed(2), publicField: 'Team Join', publicData: Number(reportList?.oPublic?.nTeamJoin).toFixed(2) },
        { detailsField: 'Bot Play Return Bonus', detailsData: Number(reportList?.nBotPlayReturnBonus).toFixed(2) }
      ]
      reportExporter.current.props = { ...reportExporter.current.props, data: processExcelExportData(fieldsArr, 'Report'), fileName: 'MatchReport.xlsx' }
      reportExporter.current.save()
    } else if (type === 'TopEarned') {
      const topEarned = reportList?.aTopEarnedUser
      topEarnedExporter.current.props = { ...topEarnedExporter.current.props, data: processExcelExportData(topEarned, 'TopEarned'), fileName: 'Top Earned Users.xlsx' }
      topEarnedExporter.current.save()
    } else if (type === 'TopLost') {
      const topLoosed = reportList?.aTopLoosedUser
      topLostExporter.current.props = { ...topLostExporter.current.props, data: processExcelExportData(topLoosed, 'TopLost'), fileName: 'Top Loss Users.xlsx' }
      topLostExporter.current.save()
    } else if (type === 'TopSpend') {
      const topSpend = reportList?.aTopSpendUser
      topSpendExporter.current.props = { ...topSpendExporter.current.props, data: processExcelExportData(topSpend, 'TopSpend'), fileName: 'Top Spend Users.xlsx' }
      topSpendExporter.current.save()
    }
  }

  return (
    <>
      {loading && <Loading />}
      {
        modalMessage && message && (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <ExcelExport data={reportList} fileName='MatchReport.xlsx' ref={reportExporter}>
        <ExcelExportColumnGroup
          title="Details"
          headerCellOptions={{
            textAlign: 'center'
          }}
        >
          <ExcelExportColumn field='detailsField' title='Field' />
          <ExcelExportColumn field='detailsData' title='Data' />
        </ExcelExportColumnGroup>
        <ExcelExportColumnGroup
          title="Private"
          headerCellOptions={{
            textAlign: 'center'
          }}
        >
          <ExcelExportColumn field='privateField' title='Field' />
          <ExcelExportColumn field='privateData' title='Data' />
        </ExcelExportColumnGroup>
        <ExcelExportColumnGroup
          title="Public"
          headerCellOptions={{
            textAlign: 'center'
          }}
        >
          <ExcelExportColumn field='publicField' title='Field' />
          <ExcelExportColumn field='publicData' title='Data' />
        </ExcelExportColumnGroup>
      </ExcelExport>
      <ExcelExport
        data={reportList?.aTopEarnedUser}
        fileName='Top Earned User.xlsx'
        ref={topEarnedExporter}
      >
        <ExcelExportColumn field="no" title="No" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile Number" />
        <ExcelExportColumn field="nBonusUtil" title="Bonus Util" />
        <ExcelExportColumn field="nLeagueJoin" title="League Join" />
        <ExcelExportColumn field="nLeagueJoinAmount" title="League Join Amount" />
        <ExcelExportColumn field="nTotalEarned" title='Total Earned'/>
        <ExcelExportColumn field="nTeams" title="Teams" />
      </ExcelExport>
      <ExcelExport
        data={reportList?.aTopLoosedUser}
        fileName='Top Loss Users.xlsx'
        ref={topLostExporter}
      >
        <ExcelExportColumn field="no" title="No" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile Number" />
        <ExcelExportColumn field="nBonusUtil" title="Bonus Util" />
        <ExcelExportColumn field="nLeagueJoin" title="League Join" />
        <ExcelExportColumn field="nLeagueJoinAmount" title="League Join Amount" />
        <ExcelExportColumn field="nTotalLoss" title='Total Loss'/>
        <ExcelExportColumn field="nTeams" title="Teams" />
      </ExcelExport>
      <ExcelExport
        data={reportList?.aTopSpendUser}
        fileName='Top Spend Users.xlsx'
        ref={topSpendExporter}
      >
        <ExcelExportColumn field="no" title="No" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile Number" />
        <ExcelExportColumn field="nBonusUtil" title="Bonus Util" />
        <ExcelExportColumn field="nLeagueJoin" title="League Join" />
        <ExcelExportColumn field="nLeagueJoinAmount" title="League Join Amount" />
        <ExcelExportColumn field="nTeams" title="Teams" />
      </ExcelExport>
      <section className="add-contest-section">
        <div className="title">
          <div className='d-flex justify-content-between w-100'>
            <div className='d-flex inline-input'>
              <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${MatchPageLink}`)}></img>
              <h2 className='ml-2'>Report List</h2>
            </div>
            <div className="d-flex inline-input">
                <div className="btn-list">
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.REPORT === 'W')) && (
                      <Button color="link" onClick={getReportListFun}>
                        <img src={refreshIcon} alt="Users" height="20px" width="20px" />
                        {/* Generate Report */}
                      </Button>
                    )
                  }
                  <img src={excelIcon} alt="excel" onClick={() => onExport('Report')} title="Export" className="header-button" style={{ cursor: 'pointer' }}/>
                </div>
            </div>
          </div>
            <div className="text-right text-align-left-480">
              <div className="btn-list">
                <Button className="theme-btn mr-3" onClick={updateReportFunc}>
                  Update Report
                </Button>
              </div>
            </div>
        </div>

        <div className="table-responsive">
          {
            modalMessage && message && (
              <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
            )
          }
          {reportList && reportList._id &&
          <div>
            <Row className='mb-5'>
              <Col lg='4' className='responsive-common-box'>
                <div className="table-responsive reports-common-box">
                  <h3 className="text-center">Details</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>{reportList && reportList.nAmount && Number.isInteger(reportList.nAmount) ? Number(reportList.nAmount) : Number(reportList.nAmount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Distributed Amount <img className='custom-info' src={infoIcon} id='distributedAmount'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='distributedAmount'>
                          <PopoverBody>
                            <p>Total of amount which all the participated user has won</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nDistAmount && Number.isInteger(reportList.nDistAmount) ? Number(reportList.nDistAmount) : Number(reportList.nDistAmount).toFixed(2)}</td>
                      </tr>
                      <tr>
                          <td>Distributed Bonus</td>
                          <td>{reportList.nDistBonus && Number.isInteger(reportList.nDistBonus) ? Number(reportList.nDistBonus) : Number(reportList.nDistBonus).toFixed(2)}</td>
                        </tr>
                      <tr>
                        <td>Cash</td>
                        <td>{reportList && reportList.nCash && Number.isInteger(reportList.nCash) ? Number(reportList.nCash) : Number(reportList.nCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bonus</td>
                        <td>{reportList && reportList.nBonus && Number.isInteger(reportList.nBonus) ? Number(reportList.nBonus) : Number(reportList.nBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Team Join</td>
                        <td>{reportList && reportList.nTeamJoin ? reportList.nTeamJoin : 0}</td>
                      </tr>
                      <tr>
                        <td>Total Team</td>
                        <td>{reportList && reportList.nTotalTeam ? reportList.nTotalTeam : '0'}</td>
                      </tr>
                      <tr>
                        <td>Total User Count</td>
                        <td>{reportList && reportList.nTotalUserCount ? reportList.nTotalUserCount : '0'}</td>
                      </tr>
                      <tr>
                        <td>League</td>
                        <td>{reportList && reportList.nLeague ? reportList.nLeague : 0}</td>
                      </tr>
                      <tr>
                        <td>Live League</td>
                        <td>{reportList && reportList.nRunLeague ? reportList.nRunLeague : 0}</td>
                      </tr>
                      <tr>
                        <td>Cancel League</td>
                        <td>{reportList && reportList.nCancelLeague && Number.isInteger(reportList.nCancelLeague) ? Number(reportList.nCancelLeague) : Number(reportList.nCancelLeague).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Promo Discount <img className='custom-info' src={infoIcon} id='promoDiscount'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='promoDiscount'>
                          <PopoverBody>
                            <p>The discount that the user gets using a promo code(to join the league)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nPromoDiscount && Number.isInteger(reportList.nPromoDiscount) ? Number(reportList.nPromoDiscount) : Number(reportList.nPromoDiscount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Cashback Cash <img className='custom-info' src={infoIcon} id='cashbackUser'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackUser'>
                          <PopoverBody>
                            <p>If a League have Cashback(Cash) enabled then the User will get Cashback as a Cash</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nCashbackCash && Number.isInteger(reportList.nCashbackCash) ? Number(reportList.nCashbackCash) : Number(reportList.nCashbackCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Cashback Cash<img className='custom-info' src={infoIcon} id='cashbackBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackBot'>
                          <PopoverBody>
                            <p>If a League have Cashback(Cash) enabled then the User(Bot/System) will get Cashback as a Cash</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotCashbackCash && Number.isInteger(reportList.nBotCashbackCash) ? Number(reportList.nBotCashbackCash) : Number(reportList.nBotCashbackCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Cashback Bonus<img className='custom-info' src={infoIcon} id='cashbackBonusUser'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackBonusUser'>
                          <PopoverBody>
                            <p>If a League have Cashback(Bonus) enabled then the User will get Cashback as a Bonus</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nCashbackBonus && Number.isInteger(reportList.nCashbackBonus) ? Number(reportList.nCashbackBonus) : Number(reportList.nCashbackBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Cashback Bonus<img className='custom-info' src={infoIcon} id='cashbackBonusBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackBonusBot'>
                          <PopoverBody>
                            <p>If a League have Cashback(Bonus) enabled then the User(Bot/System) will get Cashback as a Bonus</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotCashbackBonus && Number.isInteger(reportList.nBotCashbackBonus) ? Number(reportList.nBotCashbackBonus) : Number(reportList.nBotCashbackBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Cashback Return Cash <img className='custom-info' src={infoIcon} id='cashbackReturnCash'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackReturnCash'>
                          <PopoverBody>
                            <p>If a League have Cashback(Cash) enabled, the User has participated in the league and the User get the Cashback(Cash), but If the league gets canceled that Cashback Cash will be taken back from the User</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nCashbackReturnCash && Number.isInteger(reportList.nCashbackReturnCash) ? Number(reportList.nCashbackReturnCash) : Number(reportList.nCashbackReturnCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Cashback Return Cash <img className='custom-info' src={infoIcon} id='cashbackReturnCashBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackReturnCashBot'>
                          <PopoverBody>
                            <p>If a League have Cashback(Cash) enabled, the User(Bot/System) has participated in the league and the User(Bot/System) get the Cashback(Cash), but If the league gets canceled that Cashback Cash will be taken back from the User(Bot/System)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotCashbackReturnCash && Number.isInteger(reportList.nBotCashbackReturnCash) ? Number(reportList.nBotCashbackReturnCash) : Number(reportList.nBotCashbackReturnCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Cashback Return Bonus <img className='custom-info' src={infoIcon} id='cashbackReturnBonus'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackReturnBonus'>
                          <PopoverBody>
                            <p>If a League have Cashback(Bonus) enabled, the User has participated in the league and the User get the Cashback(Bonus), but If the league gets canceled that Cashback Bonus will be taken back from the User</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nCashbackReturnBonus && Number.isInteger(reportList.nCashbackReturnBonus) ? Number(reportList.nCashbackReturnBonus) : Number(reportList.nCashbackReturnBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Cashback Return Bonus  <img className='custom-info' src={infoIcon} id='cashbackReturnBonusBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='cashbackReturnBonusBot'>
                          <PopoverBody>
                            <p>If a League have Cashback(Bonus) enabled, the User(Bot/System) has participated in the league and the User(Bot/System) get the Cashback(Bonus), but If the league gets canceled that Cashback Bonus will be taken back from the User(Bot/System)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotCashbackReturnBonus && Number.isInteger(reportList.nBotCashbackReturnBonus) ? Number(reportList.nBotCashbackReturnBonus) : Number(reportList.nBotCashbackReturnBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Play Return Cash <img className='custom-info' src={infoIcon} id='playReturnCashUser'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='playReturnCashUser'>
                          <PopoverBody>
                            <p>If the user has participated in a League and that league get canceled in that case User will get Play Return(Entry Fees)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nPlayReturnCash && Number.isInteger(reportList.nPlayReturnCash) ? Number(reportList.nPlayReturnCash) : Number(reportList.nPlayReturnCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Play Return Cash <img className='custom-info' src={infoIcon} id='playReturnCashBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='playReturnCashBot'>
                          <PopoverBody>
                            <p>If the user has participated in a League and that league get canceled in that case User(Bot/System) will get Play Return(Entry Fees)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotPlayReturnCash && Number.isInteger(reportList.nBotPlayReturnCash) ? Number(reportList.nBotPlayReturnCash) : Number(reportList.nBotPlayReturnCash).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Play Return Bonus <img className='custom-info' src={infoIcon} id='playReturnBonusUser'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='playReturnBonusUser'>
                          <PopoverBody>
                            <p>If the user has participated in a League and that league get canceled in that case User will get Play Return(Entry Fees) as Bonus(If he/she has used)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nPlayReturnBonus && Number.isInteger(reportList.nPlayReturnBonus) ? Number(reportList.nPlayReturnBonus) : Number(reportList.nPlayReturnBonus).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Bot Play Return Bonus <img className='custom-info' src={infoIcon} id='playReturnBonusBot'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='playReturnBonusBot'>
                          <PopoverBody>
                            <p>If the user has participated in a League and that league get canceled in that case User(Bot/System) will get Play Return(Entry Fees) as Bonus(If he/she has used)</p>
                          </PopoverBody>
                        </UncontrolledPopover></td>
                        <td>{reportList && reportList.nBotPlayReturnBonus && Number.isInteger(reportList.nBotPlayReturnBonus) ? Number(reportList.nBotPlayReturnBonus) : Number(reportList.nBotPlayReturnBonus).toFixed(2)}</td>
                      </tr>
                  </tbody>
                </table>
                </div>
              </Col>

            <Col lg='4' className='responsive-common-box'>
                  <div className="table-responsive reports-common-box">
                    <h3 className="text-center">Private</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Amount</td>
                          <td>{reportList.oPrivate.nAmount && Number.isInteger(reportList.oPrivate.nAmount) ? Number(reportList.oPrivate.nAmount) : Number(reportList.oPrivate.nAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Distributed Amount</td>
                          <td>{reportList.oPrivate.nDistAmount && Number.isInteger(reportList.oPrivate.nDistAmount) ? Number(reportList.oPrivate.nDistAmount) : Number(reportList.oPrivate.nDistAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cash</td>
                          <td>{reportList.oPrivate.nCash && Number.isInteger(reportList.oPrivate.nCash) ? Number(reportList.oPrivate.nCash) : Number(reportList.oPrivate.nCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bonus</td>
                          <td>{reportList.oPrivate.nBonus && Number.isInteger(reportList.oPrivate.nBonus) ? Number(reportList.oPrivate.nBonus) : Number(reportList.oPrivate.nBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>League</td>
                          <td>{reportList.oPrivate.nLeague ? reportList.oPrivate.nLeague : 0}</td>
                        </tr>
                        <tr>
                          <td>Live League</td>
                          <td>{reportList.oPrivate.nRunLeague ? reportList.oPrivate.nRunLeague : '0'}</td>
                        </tr>
                        <tr>
                          <td>Cancel League</td>
                          <td>{reportList.oPrivate.nCancelLeague ? reportList.oPrivate.nCancelLeague : '0'}</td>
                        </tr>
                        <tr>
                          <td>Team Join</td>
                          <td>{reportList.oPrivate.nTeamJoin ? reportList.oPrivate.nTeamJoin : '0'}</td>
                        </tr>
                        <tr>
                          <td>Admin Commission</td>
                          <td>{reportList.oPrivate.nAdminCommission && Number.isInteger(reportList.oPrivate.nAdminCommission) ? Number(reportList.oPrivate.nAdminCommission) : Number(reportList.oPrivate.nAdminCommission).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Creator Commission</td>
                          <td>{reportList.oPrivate.nCreatorCommission && Number.isInteger(reportList.oPrivate.nCreatorCommission) ? Number(reportList.oPrivate.nCreatorCommission) : Number(reportList.oPrivate.nCreatorCommission).toFixed(2)}</td>
                        </tr>
                      </tbody>
                      </table>
                    </div>
                  </Col>

                  <Col lg='4' className='responsive-common-box'>
                  <div className="table-responsive reports-common-box">
                    <h3 className="text-center">Public</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Amount</td>
                          <td>{reportList.oPublic.nAmount && Number.isInteger(reportList.oPublic.nAmount) ? Number(reportList.oPublic.nAmount) : Number(reportList.oPublic.nAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Amount</td>
                          <td>{reportList.oPublic.nBotAmount && Number.isInteger(reportList.oPublic.nBotAmount) ? Number(reportList.oPublic.nBotAmount) : Number(reportList.oPublic.nBotAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bonus</td>
                          <td>{reportList.oPublic.nBonus && Number.isInteger(reportList.oPublic.nBonus) ? Number(reportList.oPublic.nBonus) : Number(reportList.oPublic.nBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Bonus</td>
                          <td>{reportList.oPublic.nBotBonus && Number.isInteger(reportList.oPublic.nBotBonus) ? Number(reportList.oPublic.nBotBonus) : Number(reportList.oPublic.nBotBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cash</td>
                          <td>{reportList.oPublic.nCash && Number.isInteger(reportList.oPublic.nCash) ? Number(reportList.oPublic.nCash) : Number(reportList.oPublic.nCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Cash</td>
                          <td>{reportList.oPublic.nBotCash && Number.isInteger(reportList.oPublic.nBotCash) ? Number(reportList.oPublic.nBotCash) : Number(reportList.oPublic.nBotCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cashback Cash</td>
                          <td>{reportList && reportList.oPublic.nCashbackCash && Number.isInteger(reportList.oPublic.nCashbackCash) ? Number(reportList.oPublic.nCashbackCash) : Number(reportList.oPublic.nCashbackCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Cashback Cash</td>
                          <td>{reportList && reportList.oPublic.nBotCashbackCash && Number.isInteger(reportList.oPublic.nBotCashbackCash) ? Number(reportList.oPublic.nBotCashbackCash) : Number(reportList.oPublic.nBotCashbackCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cashback Bonus</td>
                          <td>{reportList && reportList.oPublic.nCashbackBonus && Number.isInteger(reportList.oPublic.nCashbackBonus) ? Number(reportList.oPublic.nCashbackBonus) : Number(reportList.oPublic.nCashbackBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Cashback Bonus</td>
                          <td>{reportList && reportList.oPublic.nBotCashbackBonus && Number.isInteger(reportList.oPublic.nBotCashbackBonus) ? Number(reportList.oPublic.nBotCashbackBonus) : Number(reportList.oPublic.nBotCashbackBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cashback Return Cash</td>
                          <td>{reportList && reportList.oPublic.nCashbackReturnCash && Number.isInteger(reportList.oPublic.nCashbackReturnCash) ? Number(reportList.oPublic.nCashbackReturnCash) : Number(reportList.oPublic.nCashbackReturnCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Cashback Return Cash</td>
                          <td>{reportList && reportList.oPublic.nBotCashbackReturnCash && Number.isInteger(reportList.oPublic.nBotCashbackReturnCash) ? Number(reportList.oPublic.nBotCashbackReturnCash) : Number(reportList.oPublic.nBotCashbackReturnCash).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cashback Return Bonus</td>
                          <td>{reportList && reportList.oPublic.nCashbackReturnBonus && Number.isInteger(reportList.oPublic.nCashbackReturnBonus) ? Number(reportList.oPublic.nCashbackReturnBonus) : Number(reportList.oPublic.nCashbackReturnBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot User Cashback Return Bonus</td>
                          <td>{reportList && reportList.oPublic.nBotCashbackReturnBonus && Number.isInteger(reportList.oPublic.nBotCashbackReturnBonus) ? Number(reportList.oPublic.nBotCashbackReturnBonus) : Number(reportList.oPublic.nBotCashbackReturnBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Promo Discount</td>
                          <td>{reportList && reportList.oPublic.nPromoDiscount && Number.isInteger(reportList.oPublic.nPromoDiscount) ? Number(reportList.oPublic.nPromoDiscount) : Number(reportList.oPublic.nPromoDiscount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot Promo Discount</td>
                          <td>{reportList && reportList.oPublic.nBotPromoDiscount && Number.isInteger(reportList.oPublic.nBotPromoDiscount) ? Number(reportList.oPublic.nBotPromoDiscount) : Number(reportList.oPublic.nBotPromoDiscount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Distributed Amount</td>
                          <td>{reportList.oPublic.nDistAmount && Number.isInteger(reportList.oPublic.nDistAmount) ? Number(reportList.oPublic.nDistAmount) : Number(reportList.oPublic.nDistAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot Distributed Amount</td>
                          <td>{reportList && reportList.oPublic.nBotDistAmount && Number.isInteger(reportList.oPublic.nBotDistAmount) ? Number(reportList.oPublic.nBotDistAmount) : Number(reportList.oPublic.nBotDistAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Distributed Bonus</td>
                          <td>{reportList.oPublic.nDistBonus && Number.isInteger(reportList.oPublic.nDistBonus) ? Number(reportList.oPublic.nDistBonus) : Number(reportList.oPublic.nDistBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Bot Distributed Bonus</td>
                          <td>{reportList && reportList.oPublic.nBotDistBonus && Number.isInteger(reportList.oPublic.nBotDistBonus) ? Number(reportList.oPublic.nBotDistBonus) : Number(reportList.oPublic.nBotDistBonus).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>League</td>
                          <td>{reportList.oPublic.nLeague ? reportList.oPublic.nLeague : '0'}</td>
                        </tr>
                        <tr>
                          <td>Live League</td>
                          <td>{reportList.oPublic.nRunLeague ? reportList.oPublic.nRunLeague : '0'}</td>
                        </tr>
                        <tr>
                          <td>Cancel League</td>
                          <td>{reportList.oPublic.nCancelLeague ? reportList.oPublic.nCancelLeague : '0'}</td>
                        </tr>
                        <tr>
                          <td>Team Join</td>
                          <td>{reportList.oPublic.nTeamJoin ? reportList.oPublic.nTeamJoin : '0'}</td>
                        </tr>
                        </tbody>
                    </table>
                  </div>
                </Col>
              </Row>

            <div>
                <Row className="mt-5">
                  <Col className="table-responsive">
                    <div className='d-flex justify-content-between'>
                      <h3 className='text-center'>Top Earned User</h3>
                      <img src={excelIcon} alt="excel" onClick={() => onExport('TopEarned')} title="Export" className="header-button" />
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Username</th>
                          <th>User Mobile No.</th>
                          <th>Bonus Util</th>
                          <th>League Join </th>
                          <th>League Join Amount</th>
                          <th>Total Earned</th>
                          <th>Teams</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          reportList && reportList.aTopEarnedUser && reportList.aTopEarnedUser.length !== 0 && reportList.aTopEarnedUser.map((User, index) => {
                            return (
                              <Fragment key={User._id}>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td><Button color="link" className="view" tag={Link} to={User.eType === 'U' ? `/users/user-management/user-details/${User.iUserId}` : `/users/system-user/system-user-details/${User.iUserId}`}>{User && User.sUsername ? User.sUsername : '--'} {User.eType === 'B' ? '(B)' : ''}</Button></td>
                                  <td>{User && User.sMobNum ? User.sMobNum : '--'}</td>
                                  <td>{User && User.nBonusUtil ? (User.nBonusUtil).toFixed(2) : '0'}</td>
                                  <td>{User && User.nLeagueJoin ? User.nLeagueJoin : '0'}</td>
                                  <td>{User && User.nLeagueJoinAmount ? (User.nLeagueJoinAmount).toFixed(2) : '0'}</td>
                                  <td>{User && User.nTotalEarned ? Number(User.nTotalEarned).toFixed(2) : 0}</td>
                                  <td>{User && User.nTeams ? User.nTeams : '0'}</td>
                                </tr>
                              </Fragment>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
                {reportList?.aTopEarnedUser?.length === 0 &&
                  <div className="text-center">
                  <h3>Top Earned User List not available</h3>
                </div>
                }
                <Row className="mt-5">
                  <Col className="table-responsive">
                    <div className='d-flex justify-content-between'>
                      <h3 className='text-center'>Top Loss User</h3>
                      <img src={excelIcon} alt="excel" onClick={() => onExport('TopLost')} title="Export" className="header-button" />
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Username</th>
                          <th>User Mobile No.</th>
                          <th>Bonus Util</th>
                          <th>League Join </th>
                          <th>League Join Amount</th>
                          <th>Total Loss</th>
                          <th>Teams</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          reportList && reportList.aTopLoosedUser && reportList.aTopLoosedUser.length !== 0 && reportList.aTopLoosedUser.map((User, index) => (
                            <Fragment key={User._id}>
                              <tr>
                                <td>{index + 1}</td>
                                <td><Button color="link" className="view" tag={Link} to={User.eType === 'U' ? `/users/user-management/user-details/${User.iUserId}` : `/users/system-user/system-user-details/${User.iUserId}`}>{User && User.sUsername ? User.sUsername : '--'} {User.eType === 'B' ? '(B)' : ''}</Button></td>
                                <td>{User && User.sMobNum ? User.sMobNum : '--'}</td>
                                <td>{User && User.nBonusUtil ? (User.nBonusUtil).toFixed(2) : '0'}</td>
                                <td>{User && User.nLeagueJoin ? User.nLeagueJoin : '0'}</td>
                                <td>{User && User.nLeagueJoinAmount ? (User.nLeagueJoinAmount).toFixed(2) : '0'}</td>
                                <td>{User && User.nTotalLoss ? (User.nTotalLoss).toFixed(2) : '0'}</td>
                                <td>{User && User.nTeams ? User.nTeams : '0'}</td>
                              </tr>
                            </Fragment>
                          ))
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
                {reportList?.aTopLoosedUser?.length === 0 &&
                  <div className="text-center">
                  <h3>Top Loosed User List not available</h3>
                </div>
                }
                <Row className="mt-5">
                  <Col className="table-responsive">
                    <div className='d-flex justify-content-between'>
                      <h3 className='text-center'>Top Spend User</h3>
                      <img src={excelIcon} alt="excel" onClick={() => onExport('TopSpend')} title="Export" className="header-button" />
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Username</th>
                          <th>User Mobile No.</th>
                          <th>Bonus Util</th>
                          <th>League Join </th>
                          <th>League Join Amount</th>
                          <th>Teams</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          reportList && reportList.aTopSpendUser && reportList.aTopSpendUser.length !== 0 && reportList.aTopSpendUser.map((User, index) => (
                            <Fragment key={User._id}>
                              <tr>
                                <td>{index + 1}</td>
                                <td><Button color="link" className="view" tag={Link} to={User.eType === 'U' ? `/users/user-management/user-details/${User.iUserId}` : `/users/system-user/system-user-details/${User.iUserId}`}>{User && User.sUsername ? User.sUsername : '--'} {User.eType === 'B' ? '(B)' : ''}</Button></td>
                                <td>{User && User.sMobNum ? User.sMobNum : '--'}</td>
                                <td>{User && User.nBonusUtil ? (User.nBonusUtil).toFixed(2) : '0'}</td>
                                <td>{User && User.nLeagueJoin ? User.nLeagueJoin : '0'}</td>
                                <td>{User && User.nLeagueJoinAmount ? (User.nLeagueJoinAmount).toFixed(2) : '0'}</td>
                                <td>{User && User.nTeams ? User.nTeams : '0'}</td>
                              </tr>
                            </Fragment>
                          ))
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
                {reportList?.aTopSpendUser?.length === 0 &&
                  <div className="text-center">
                  <h3>Top Spend User List not available</h3>
                </div>
                }
            </div>
          </div>}
        </div>
      </section>
    </>
  )
}

ReportList.propTypes = {
  MatchPageLink: PropTypes.string,
  match: PropTypes.object
}

export default ReportList
