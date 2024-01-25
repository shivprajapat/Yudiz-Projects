import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTransactionList, CancelWithdraw, pendingDeposits } from '../../redux/actions/transaction'
import { CheckWithdrawLimit } from '../../redux/actions/profile'
import { getMatchDetails } from '../../redux/actions/match'
import { getMatchLeagueDetails } from '../../redux/actions/league'

export const Transaction = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [Tab, setTab] = useState('all')
    const [limit] = useState(20)
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [paginationLoading, setPaginationLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.transaction.resStatus)
    const resMessage = useSelector(state => state.transaction.resMessage)
    const cancelWithdraw = useSelector(state => state.transaction.cancelWithdraw)
    const withdrawPending = useSelector(state => state.profile.withdrawPending)
    const userWithdraw = useSelector(state => state.profile.userWithdraw)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const matchLeagueDetails = useSelector(state => state.league.matchLeagueDetails)
    const transactionList = useSelector(state => state.transaction.transactionList)
    const pendingDepositList = useSelector(state => state.transaction.pendingDeposits)
    const previousProps = useRef({ transactionList, Tab, cancelWithdraw, matchLeagueDetails, matchDetails }).current

    function toggle (Type) {
      setTab(Type)
    }
    function getTransactionListFun (limit, offset, Type, startDate, lastDate) {
      dispatch(getTransactionList(limit, offset, Type, startDate, lastDate, token))
      setPaginationLoading(true)
    }

    function getPendingDepositsList (token) {
      dispatch(pendingDeposits(token))
    }

    function onCheckWithdrawLimit () {
      if (token) {
        dispatch(CheckWithdrawLimit(token))
        setLoading(true)
      }
    }

    function onCancelWithdraw (ID) {
      if (token) {
        dispatch(CancelWithdraw(ID, token))
        setLoading(true)
      }
    }

    useEffect(() => {
      if (modalOpen) {
        setTimeout(() => {
          setModalOpen(false)
        }, 2000)
      }
    }, [modalOpen])

    useEffect(() => {
      if (token) {
        onCheckWithdrawLimit()
      }
    }, [token])

    useEffect(() => {
      if (previousProps.cancelWithdraw !== cancelWithdraw) {
        if (cancelWithdraw === true) {
          dispatch(getTransactionList(limit, 0, 'all', '', '', token))
          dispatch(CheckWithdrawLimit(token))
          setModalOpen(true)
          setLoading(true)
        }
      }
      return () => {
        previousProps.cancelWithdraw = cancelWithdraw
      }
    }, [cancelWithdraw])

    useEffect(() => {
      if (previousProps.matchDetails !== matchDetails) {
        if (matchDetails && matchDetails._id) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.matchDetails = matchDetails
      }
    }, [matchDetails])

    useEffect(() => {
      if (previousProps.transactionList !== transactionList) {
        if (transactionList) {
          const data = transactionList && transactionList.length > 0 && transactionList.filter(data => data.nBonus !== 0)
          const cashData = transactionList && transactionList.length > 0 && transactionList.filter(data => !(data.nCash === 0 && (data.eTransactionType === 'Deposit' || data.eTransactionType === 'Cashback-Contest')))
          setLoading(false)
          Tab === 'bonus' ? setList(data) : Tab === 'cash' ? setList(cashData) : setList(transactionList)
          setPaginationLoading(false)
        }
      }
      return () => {
        previousProps.transactionList = transactionList
      }
    }, [transactionList])

    function onGetMatchDetails (ID) {
      if (ID && token) {
        dispatch(getMatchDetails(ID, '', token))
        setLoading(true)
      }
    }

    function onGetLeagueDetails (ID) {
      if (ID && token) {
        dispatch(getMatchLeagueDetails(ID, token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        GetTransactionListFun={getTransactionListFun}
        Tab={Tab}
        cancelWithdraw={cancelWithdraw}
        currencyLogo={currencyLogo}
        getPendingDepositsList={getPendingDepositsList}
        loading={loading}
        matchDetails={matchDetails}
        matchLeagueDetails={matchLeagueDetails}
        modalOpen={modalOpen}
        onCancelWithdraw={onCancelWithdraw}
        onCheckWithdrawLimit={onCheckWithdrawLimit}
        onGetLeagueDetails={onGetLeagueDetails}
        onGetMatchDetails={onGetMatchDetails}
        paginationLoading={paginationLoading}
        pendingDeposits={pendingDepositList}
        resMessage={resMessage}
        resStatus={resStatus}
        toggle={toggle}
        token={token}
        transactionGivenList={transactionList}
        transactionList={list}
        userWithdraw={userWithdraw}
        withdrawPending={withdrawPending}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default Transaction
