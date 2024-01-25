import React, { useState, useEffect, useContext, useRef } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'

import DataTable from 'shared/components/data-table'
import { ToastrContext } from 'shared/components/toastr'
import { parseParams, appendParams } from 'shared/utils'
import ClientRow from 'shared/components/client-row'
import { getClientList, updateClientStatus } from 'shared/apis/clients'
import Loading from '../../shared/components/loading'
import { TOAST_TYPE } from 'shared/constants'

function Clients() {
  const history = useHistory()
  const params = useRef(parseParams(location.search))
  const { dispatch } = useContext(ToastrContext)
  const [isLoading, setIsLoading] = useState(true)
  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [clientList, setClientList] = useState()
  const totalRecord = useRef(0)
  const [isResponseStatus, setIsResponseStatus] = useState(false)
  const [selectedTab, setSelectedTab] = useState('clients')
  const [columns, setColumns] = useState(getActionColumns(selectedTab))
  const [tabs, setTabs] = useState([
    { name: <FormattedMessage id='clients' />, internalName: 'clients', active: true }
  ])

  async function getAPIData(requestParams) {
    const response = await getClientList(requestParams)
    if (response.status === 200 && response?.data) {
      setClientList(response?.data?.clients || [])
      totalRecord.current = response.data.nTotalCount || 0
      setIsLoading(false)
      setIsResponseStatus(true)
    }
  }

  useEffect(() => {
    getAPIData(requestParams)
  }, [requestParams])

  function checkPermission() {
    checkPermissionAndGetParam().activeTabName !== 'clients' && changeTab(checkPermissionAndGetParam().activeTabName)
  }

  function handleTabChange(name) {
    if (name === 'clients') {
      setRequestParams({ ...requestParams, aStatusFiltersInput: ['a', 'i'], nSkip: 1 })
      appendParams({ aStatusFiltersInput: ['a', 'i'], nSkip: 1 })
      getAPIData()
    }
    changeTab(name)
  }

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      aStatusFiltersInput: data.aStatusFiltersInput || checkPermissionAndGetParam().params,
      nSkip: Number(data.nSkip) || 1,
      nLimit: Number(data.nLimit) || 10,
      sSortBy: data.sSortBy || 'dCreated',
      nOrder: Number(data.nOrder) || -1,
      sSearch: data.sSearch || ''
    }
  }

  function changeTab(name) {
    setSelectedTab(name)
    setColumns(getActionColumns(name))
    setTabs(
      tabs.map((e) => {
        return { ...e, active: e.internalName === name }
      })
    )
  }

  function getActionColumns(name) {
    const data = params.current
    if (name === 'clients') {
      const clm = [
        { name: <FormattedMessage id='clientName' />, internalName: 'sClientName', type: 0 },
        { name: <FormattedMessage id='subscriptionType' />, internalName: 'sSubscriptionType', type: 0 },
        { name: <FormattedMessage id='email' />, internalName: 'sEmail', type: 0 }
      ]
      return clm.map((e) => {
        if (data?.sSortBy === e?.internalName) return { ...e, type: data.nOrder === 1 ? -1 : 1 }
        return e
      })
    }
  }

  function checkPermissionAndGetParam() {
    return {
      params: ['a', 'i'],
      activeTabName: 'clients'
    }
  }

  function getActiveTabName(e) {
    const data = e ? parseParams(e) : params.current
    if (data?.aStatusFiltersInput?.length) {
      if (data.aStatusFiltersInput.toString() === 'a,i') {
        return 'clients'
      }
    } else {
      return checkPermissionAndGetParam().activeTabName
    }
  }

  useEffect(() => {
    params.current?.aStatusFiltersInput?.length && changeTab(getActiveTabName())
    checkPermission()
  }, [])

  useEffect(() => {
    return history.listen((e) => {
      params.current = parseParams(e.search)
      setRequestParams(getRequestParams(e.search))
      changeTab(getActiveTabName(e.search))
    })
  }, [history])

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, nLimit: Number(value) })
        appendParams({ nLimit: value, nSkip: 1 })
        break
      case 'search':
        setRequestParams({ ...requestParams, sSearch: value, nSkip: 1 })
        appendParams({ sSearch: value, nSkip: 1 })
        break
      default:
        break
    }
  }

  async function handleStatusChange({ target }) {
    const response = await updateClientStatus({ eStatus: (target.checked) ? 'i' : 'a' }, target.name)
    if (response.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      setRequestParams({ ...requestParams, nSkip: requestParams.nSkip })
      appendParams({ nSkip: requestParams.nSkip })
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, nSkip: page })
    appendParams({ nSkip: page })
  }

  return (
    <>
      <DataTable
        isResponseStatus={isResponseStatus}
        className={selectedTab === 'clients'}
        columns={columns}
        totalRecord={totalRecord.current}
        selectedTab={selectedTab}
        isLoading={false}
        header={{
          left: {
            rows: true
          },
          right: {
            search: true,
            add: true
          }
        }}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        pageChangeEvent={handlePageEvent}
        pagination={{ currentPage: requestParams.nSkip, pageSize: requestParams.nLimit }}
        tabs={tabs}
        tabEvent={handleTabChange}
        actionColumn={selectedTab === 'clients'}
      >
      { !isLoading ? (
        clientList?.map((tag) => {
          return (
            <ClientRow
              key={tag?._id}
              tag={tag}
              onStatusChange={handleStatusChange}
            />
          )
        })
      ) : (
        <Loading/>
      )}
      </DataTable>
    </>
  )
}

export default Clients
