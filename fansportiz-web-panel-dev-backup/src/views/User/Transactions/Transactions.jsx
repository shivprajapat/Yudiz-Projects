/* eslint-disable no-unused-vars */
import React, { useEffect, Fragment, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Nav, NavItem, Input, NavLink, Row, Col, Button, Alert, Spinner, Modal, Form, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Collapse, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import SkeletonTransaction from '../../../component/Loading'
import Increase from '../../../assests/images/credit.svg'
import decr from '../../../assests/images/debit.svg'
import filter from '../../../assests/images/icon-settings.svg'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import goto from '../../../assests/images/goto.svg'
import Transaction from '../../../HOC/User/Transaction'
import { useNavigate, useParams } from 'react-router-dom'
const classNames = require('classnames')

function TransactionsPage (props) {
  const { token, transactionList, currencyLogo, matchDetails, onGetMatchDetails, onGetLeagueDetails, matchLeagueDetails, transactionGivenList, toggle, GetTransactionListFun, paginationLoading, Tab, modalOpen, userWithdraw, withdrawPending, loading, onCancelWithdraw, resMessage } = props
  const [QueryTab, setQueryTab] = useQueryState('Tab', 'all')
  const [skip, setSkip] = useState(0)
  const [matchData, setMatchData] = useState({})
  // const [modal, setModal] = useState(false)
  // const toggle2 = () => setModal(!modal)
  const [transactionID, setTransactionID] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const toggle3 = () => setIsOpen(!isOpen)
  const [limit] = React.useState(20)
  const scrollRef = React.createRef()
  const [FilterBy, setFilterBy] = useState('')
  const [startDate, setStartDate] = useState('')
  const [lastDate, setLastDate] = useState('')
  const [finalFilterBy, setFinalFilterBy] = useState('')
  const [finalStartDate, setFinalStartDate] = useState('')
  const [finalLastDate, setFinalLastDate] = useState('')
  const [hasMoreMatches, setHasMoreMatches] = React.useState(true)
  const [filterSlide, setFilterSlide] = useState(false)
  const [TransactionList, setTransactionList] = React.useState([])
  const [cancelWithdrawModal, setCancelWithdrawModal] = useState(false)
  const previousProps = useRef({ skip, Tab, matchDetails }).current

  const { Tab: TabUrl } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (TabUrl) {
      if (TabUrl) {
        toggle(TabUrl)
        setQueryTab(TabUrl)
      }
    }
    if (!TabUrl && token) {
      GetTransactionListFun(limit, 0, Tab, '', '')
    }
  }, [token])

  function handleScroll () { // scroll the bottom
    if (loading || !hasMoreMatches) {
      return
    }
    const wrappedElement = scrollRef.current
    if (wrappedElement.scrollHeight - wrappedElement.scrollTop - wrappedElement.clientHeight <= 0) {
      setSkip(skip => skip + limit)
    }
  }

  useEffect(() => {
    if (previousProps.skip !== skip) {
      if (skip) {
        const startDate = moment(finalStartDate).startOf('day')
        const endDate = moment(finalLastDate).endOf('day')
        GetTransactionListFun(limit, skip, Tab, finalStartDate ? parseInt((new Date(startDate).getTime()) / 1000) : '', finalLastDate ? parseInt((new Date(endDate).getTime()) / 1000) : '')
      }
    }
    return () => {
      previousProps.skip = skip
    }
  }, [skip])

  useEffect(() => { // handle the response
    if (previousProps.matchDetails !== matchDetails) {
      if (matchDetails && matchDetails._id && matchDetails.eStatus === 'U') {
        if (matchData && matchData.iMatchId && matchData.iMatchLeagueId && matchLeagueDetails && !matchLeagueDetails.bCancelled) {
          navigate(`/upcoming-match/league-details/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}/${matchData.iMatchLeagueId}`)
        } else if (matchData && matchData.iMatchId) {
          navigate(`/upcoming-match/leagues/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}`)
        }
      } else if (matchDetails && matchDetails._id && matchDetails.eStatus === 'L') {
        if (matchData && matchData.iMatchId && matchData.iMatchLeagueId && matchData.eTransactionType !== 'Play-Return' && matchLeagueDetails && !matchLeagueDetails.bCancelled) {
          navigate(`/live-completed-match/league-details/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}/${matchData.iMatchLeagueId}`)
        } else if (matchData && matchData.iMatchId) {
          navigate(`/live-match/leagues/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}`)
        }
      } else if (matchDetails && matchDetails._id && (matchDetails.eStatus === 'CMP' || matchDetails.eStatus === 'I')) {
        if (matchData && matchData.iMatchId && matchData.iMatchLeagueId && matchData.eTransactionType !== 'Play-Return' && matchLeagueDetails && !matchLeagueDetails.bCancelled) {
          navigate(`/live-completed-match/league-details/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}/${matchData.iMatchLeagueId}`)
        } else if (matchData && matchData.iMatchId) {
          navigate(`/completed-match/leagues/${(matchDetails.eCategory).toLowerCase()}/${matchData.iMatchId}`)
        }
      }
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  useEffect(() => { // handle the scroll
    if (previousProps.Tab !== Tab) {
      if (Tab) {
        const startDate = moment(finalStartDate).startOf('day')
        const endDate = moment(finalLastDate).endOf('day')
        setTransactionList([])
        setSkip(0)
        setHasMoreMatches(true)
        GetTransactionListFun(limit, 0, Tab, finalStartDate ? parseInt((new Date(startDate).getTime()) / 1000) : '', finalLastDate ? parseInt((new Date(endDate).getTime()) / 1000) : '')
      }
    }
    return () => {
      previousProps.Tab = Tab
    }
  }, [Tab])

  useEffect(() => { // handle the list
    if (transactionList && transactionList.length > 0) {
      setTransactionList((TransactionList) => [...TransactionList, ...transactionList])
      if (transactionGivenList.length < limit) {
        setHasMoreMatches(false)
      }
    }
  }, [transactionList, limit])

  function changeTab (Type) {
    setQueryTab(Type)
    toggle(Type)
  }

  async function checkMatchDetails (data) {
    setMatchData(data)
    if (data && data.iMatchId && data.iMatchLeagueId) {
      await onGetLeagueDetails(data && data.iMatchLeagueId)
      await onGetMatchDetails(data && data.iMatchId)
    } else if (data && data.iMatchId) {
      onGetMatchDetails(data && data.iMatchId)
    } else {
      if (data.id === transactionID) {
        toggle3()
      } else {
        setTransactionID(data.id)
        setIsOpen(true)
      }
    }
  }
  function ApplyNow (FBy, sDate, lDate) {
    setFinalFilterBy(FBy)
    setFinalStartDate(sDate)
    setFinalLastDate(lDate)
    setFilterSlide(false)
    setTransactionList([])
    setSkip(0)
    setHasMoreMatches(true)
    const startDate = moment(sDate).startOf('day')
    const endDate = moment(lDate).endOf('day')
    GetTransactionListFun(20, 0, Tab, sDate ? parseInt((new Date(startDate).getTime()) / 1000) : '', lDate ? parseInt((new Date(endDate).getTime()) / 1000) : '')
  }
  return (
    <div ref={scrollRef} className="user-container bg-white no-footer point-system-container-third" id="scrollBar" onScroll={handleScroll}>
      {modalOpen ? <Alert color="primary" isOpen={modalOpen}>{resMessage}</Alert> : ''}
      {
        loading
          ? <SkeletonTransaction />
          : (
            <Fragment>
              {
              withdrawPending && (
                <Fragment >
                  <p className='center15'>
                    <FormattedMessage id="You_have_a_Pending_Withdrawal_request_of" />
                    {currencyLogo}
                    {` ${userWithdraw && userWithdraw.nAmount}.`}
                    <FormattedMessage id="You_may_cancel_it_if_you_wish_to" />
                  </p>
                  <center>
                    <Button className='cancelWithdrawBtn' color="primary" onClick={() => setCancelWithdrawModal(true)} size="lg"><FormattedMessage id="Cancel_Withdrawal_Request" /></Button>
                  </center>
                </Fragment>
              )
            }

              <div className={classNames({ 'my-3': withdrawPending }, 'pending-transaction-box d-flex justify-content-between')} onClick={() => navigate('/pending-transactions')} >
                <FormattedMessage id="Pending_transactions" />
                <img alt='goto' src={goto} />
              </div>
              <p className='filter-title'>
                <FormattedMessage id='Filter_by' />
                :
              </p>
              <Nav className="d-flex flex-nowrap align-items-center live-tabs">
                <NavItem>
                  <NavLink className={classnames({ active: Tab === 'all' })}
                    onClick={() => {
                      changeTab('all')
                    }}
                  >
                    <FormattedMessage id="All" />
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: Tab === 'cash' })}
                    onClick={() => {
                      changeTab('cash')
                    }}
                  >
                    <FormattedMessage id="Cash" />
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: Tab === 'bonus' })}
                    onClick={() => {
                      changeTab('bonus')
                    }}
                  >
                    <FormattedMessage id="Bonus" />
                  </NavLink>
                </NavItem>
              </Nav>
              <div>
                {
                TransactionList && TransactionList.length !== 0 && (
                  TransactionList.map((offer, index) => {
                    return (
                      <Fragment key={index} >
                        <div className="transactions-box d-flex align-items-center justify-content-between" onClick={() => checkMatchDetails(offer)}>
                          <div className="d-flex align-items-center width80">
                            {
                              offer.eType === 'Cr'
                                ? <img src={Increase} />
                                : <img src={decr} />
                            }
                            <div className={classNames({ 'text-end': document.dir === 'rtl' })}>
                              <b className="ammount">
                                {' '}
                                {currencyLogo}
                                {
                                Tab === 'all'
                                  ? offer.nAmount
                                  : Tab === 'cash'
                                    ? offer.nCash
                                    : Tab === 'bonus' &&
                                    offer.nBonus
                              }
                              </b>
                              <span>{offer.eTransactionType ? offer.eTransactionType : '-'}</span>
                              <span>
                                {' '}
                                {offer.sRemarks ? `- ${offer.sRemarks}` : ''}
                                {' '}
                              </span>
                            </div>
                          </div>
                          <span className='width20Center' dir='ltr'>{moment(offer.dActivityDate).format('DD-MMM-YYYY')}</span>
                        </div>
                        <Collapse isOpen={isOpen && offer.id === transactionID}>
                          <div className="transactions-box d-flex align-items-center justify-content-between" onClick={() => checkMatchDetails(offer)}>
                            <div className="d-flex align-items-center">
                              <div>
                                <span><FormattedMessage id="Transaction_ID" /></span>
                              </div>
                            </div>
                            <span className='center'>{matchData && matchData.iTransactionId ? matchData.iTransactionId : '-'}</span>
                          </div>
                        </Collapse>
                      </Fragment>
                    )
                  })
                )
              }
                {
                paginationLoading && (
                  <Fragment>
                    <center>
                      <Spinner className='mt-2 mb-2' color="primary" size="70px" />
                    </center>
                  </Fragment>
                )
              }
              </div>
            </Fragment>
            )
      }
      {
        TransactionList && TransactionList.length === 0 && (
          <div className='text-center'>
            <h1><FormattedMessage id="No_Transaction_are_available" /></h1>
          </div>
        )
      }
      {/* <Modal isOpen={modal} toggle={toggle2}>
        <ModalHeader toggle={toggle2}><h1><FormattedMessage id="Transaction_Details" /></h1></ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleEmail"><FormattedMessage id="Transaction_ID" /></Label>
              <Input defaultValue={matchData.id} id="exampleEmail" name="email" placeholder="with a placeholder" type="email" />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword"><FormattedMessage id="Transaction_Date" /></Label>
              <Input defaultValue={moment(matchData.dActivityDate ? matchData.dActivityDate : matchData.dCreatedAt).format('DD-MM-YYYY')} id="examplePassword" name="password" placeholder="password placeholder" type="text" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle2}><FormattedMessage id="Cancel" /></Button>
        </ModalFooter>
      </Modal> */}
      {filterSlide
        ? (
          <>
            <div className="s-team-bg" onClick={() => setFilterSlide(false)} />
            <Card className={classNames('filter-card', { show: filterSlide }) }>
              <CardHeader className='d-flex align-items-center justify-content-between'>
                <button onClick={() => { setFilterSlide(false) }}>
                  <i className='icon-left' />
                  <FormattedMessage id="Filter_by" />
                </button>
                <button className='clear-all-class'
                  onClick={() => {
                    setStartDate('')
                    setLastDate('')
                    setFilterBy('')
                    ApplyNow()
                  }}
                >
                  <FormattedMessage id="Clear_All" />
                </button>
              </CardHeader>
              <CardBody className='filter-box noBorder'>
                <Row>
                  <Col>
                    <h3><FormattedMessage id="From" /></h3>
                    <ul className='m-0 d-flex align-item-center flex-wrap'>
                      <li style={{ width: '100%' }}>
                        <Input block
                          id='StartDate'
                          max={lastDate ? moment(lastDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')}
                          name='filter'
                          onChange={(e) => {
                            setStartDate(e.target.value)
                            setFilterBy('')
                          }}
                          type='date'
                          value={startDate}
                        />
                      </li>
                    </ul>
                  </Col>
                  <Col>
                    <h3><FormattedMessage id="To" /></h3>
                    <ul className='m-0 d-flex align-item-center flex-wrap'>
                      <li>
                        <Input block
                          id='EndDate'
                          max={moment(new Date()).format('YYYY-MM-DD')}
                          min={startDate && moment(startDate).format('YYYY-MM-DD')}
                          name='filter'
                          onChange={(e) => {
                            setLastDate(e.target.value)
                            setFilterBy('')
                          }}
                          type='date'
                          value={lastDate}
                        />
                      </li>
                    </ul>
                  </Col>
                </Row>
              </CardBody>
              <CardBody className='filter-box'>
                <h3><FormattedMessage id="Filter_by" /></h3>
                <ul className='m-0 d-flex align-item-center flex-wrap'>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <li>
                      <input checked={FilterBy === 'week'} className='d-none' id='weekFilter' name='filter' type='checkbox' />
                      <label htmlFor='weekFilter'
                        onClick={() => {
                          FilterBy === 'week' ? setFilterBy('') : setFilterBy('week')
                          setStartDate('')
                          setLastDate('')
                        }}
                      >
                        {' '}
                        <FormattedMessage id="This_Week" />
                      </label>
                    </li>
                    <li>
                      <input checked={FilterBy === 'month'} className='d-none' id='monthFilter' name='filter' type='checkbox' />
                      <label htmlFor='monthFilter'
                        onClick={() => {
                          FilterBy === 'month' ? setFilterBy('') : setFilterBy('month')
                          setStartDate('')
                          setLastDate('')
                        }}
                      >
                        <FormattedMessage id="This_Month" />
                      </label>
                    </li>
                    <li>
                      <input checked={FilterBy === 'year'} className='d-none' id='yearFilter' name='filter' type='checkbox' />
                      <label htmlFor='yearFilter'
                        onClick={() => {
                          FilterBy === 'year' ? setFilterBy('') : setFilterBy('year')
                          setStartDate('')
                          setLastDate('')
                        }}
                      >
                        <FormattedMessage id="This_Year" />
                      </label>
                    </li>
                  </ul>
                </ul>
              </CardBody>
              <CardFooter className='p-0 border-0 bg-trnsparent'>
                <Button className='w-100'
                  color='primary-two'
                  onClick={() => {
                    if (FilterBy) {
                      const curr = new Date()
                      let startedDate, endedDate
                      if (FilterBy === 'week') {
                        const first = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
                        const last = first + 6 // last day is the first day + 6
                        startedDate = new Date(curr.setDate(first)).toUTCString()
                        endedDate = new Date(curr.setDate(last)).toUTCString()
                      } else if (FilterBy === 'month') {
                        startedDate = new Date(curr.getFullYear(), curr.getMonth(), 1).toUTCString()
                        endedDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).toUTCString()
                      } else if (FilterBy === 'year') {
                        startedDate = new Date(new Date().getFullYear(), 0, 1)
                        endedDate = new Date(curr).toUTCString()
                      }
                      ApplyNow(FilterBy, startedDate, endedDate)
                    } else {
                      ApplyNow(FilterBy, startDate, lastDate)
                    }
                  }}
                >
                  <FormattedMessage id="Apply" />
                </Button>
              </CardFooter>
            </Card>
          </>
          )
        : ''
        }
      <button className='bottomRight-btn'
        onClick={() => {
          setFilterSlide(true)
          setFilterBy(finalFilterBy)
          setStartDate(finalStartDate)
          setLastDate(finalLastDate)
        }}
      >
        <img src={filter} />
        {FilterBy && <div className='active' />}

      </button>

      <Modal className='cancel-withdraw-modal' isOpen={cancelWithdrawModal}>
        <ModalBody className='cancel-withdraw-modal-body d-flex flex-column justify-content-center align-items-center'>
          <div className="first">
            <h2><FormattedMessage id='Confirmation' /></h2>
            <p>
              <FormattedMessage id='Are_you_sure_you_want_to_cancel_your_withdrawal_request_of' />
              <span>
                {currencyLogo}
                {userWithdraw?.nAmount}
              </span>
              <FormattedMessage id='This_can_not_be_undone' />
            </p>
            <div className='container'>
              <div className='row'>
                <div className='col dlt-div border-left-0 border-bottom-0'>
                  <button
                    onClick={() => {
                      onCancelWithdraw(userWithdraw.id)
                      setCancelWithdrawModal(false)
                    }}
                  >
                    <FormattedMessage id='Yes' />

                  </button>
                </div>
                <div className='col dlt-div border-right-0 border-bottom-0'>
                  <button className='cncl-btn' onClick={() => setCancelWithdrawModal(false)}><FormattedMessage id='Cancel' /></button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

TransactionsPage.propTypes = {
  transactionList: PropTypes.array,
  transactionGivenList: PropTypes.array,
  onCancelWithdraw: PropTypes.func,
  GetTransactionListFun: PropTypes.func,
  toggle: PropTypes.func,
  onGetMatchDetails: PropTypes.func,
  currencyLogo: PropTypes.string,
  onGetLeagueDetails: PropTypes.func,
  onCheckWithdrawLimit: PropTypes.func,
  userWithdraw: PropTypes.shape({
    id: PropTypes.string,
    nAmount: PropTypes.number
  }),
  matchDetails: PropTypes.shape({
    eStatus: PropTypes.string,
    eCategory: PropTypes.string,
    _id: PropTypes.string
  }),
  matchLeagueDetails: PropTypes.shape({
    bCancelled: PropTypes.bool
  }),
  navigate: PropTypes.shape({
    push: PropTypes.func
  }),
  token: PropTypes.string,
  resMessage: PropTypes.string,
  Tab: PropTypes.string,
  loading: PropTypes.bool,
  modalOpen: PropTypes.bool,
  paginationLoading: PropTypes.bool,
  withdrawPending: PropTypes.bool,
  location: PropTypes.object
}

export default Transaction(TransactionsPage)
