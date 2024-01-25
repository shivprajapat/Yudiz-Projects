import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

import { setSortType, parseParams, appendParams, lastSevenDays } from 'shared/utils'
import {
  getAPIStats,
  getAPIStatsOfClient,
  getArticlesData,
  getArticlesDetailsOfClient,
  getCategoriesData,
  getCategoriesDetailsOfClient
} from 'shared/apis/analytics'
import { getSubscriptionDetail } from 'shared/apis/dashboard'
import TagItemRowActive from 'shared/components/tag-item-row-activeTags'
import DataTable from 'shared/components/data-table'
import Loading from 'shared/components/loading'
import { getClientDetails } from 'shared/apis/clients'
import DateFilter from 'shared/components/date-filter'
import { getFromLocalStorage } from 'shared/helper/localStorage'

function Analytics() {
  const { iClientId } = useParams()
  const history = useHistory()
  const params = useRef(parseParams(location.search))
  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [isLoading, setIsLoading] = useState(true)
  const [tagList, setTagList] = useState()
  const [totalRecord, setTotalRecord] = useState(0)
  const [isResponseStatus, setIsResponseStatus] = useState(false)
  const [isSubscribedStatus, setIsSubscribedStatus] = useState({ api: false, articles: false, exclusive: false, categories: false })
  const [tabs, setTabs] = useState([
    { name: <FormattedMessage id='apis' />, internalName: 'API', active: true },
    { name: <FormattedMessage id='articles' />, internalName: 'Articles', active: false },
    { name: <FormattedMessage id='exclusiveArticles' />, internalName: 'Exclusive', active: false },
    { name: <FormattedMessage id='categories' />, internalName: 'Categories', active: false }
  ])
  const [selectedTab, setSelectedTab] = useState('API')
  const [columns, setColumns] = useState(getActionColumns(selectedTab))

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isFilter, setIsFilter] = useState(false)

  useEffect(() => {
    if (iClientId) {
      getAPIDataOfClient(requestParams, iClientId)
    } else if (getFromLocalStorage('role') === 'client') {
      getAPIData(requestParams)
    }
  }, [selectedTab, requestParams])

  async function getAPIDataOfClient(requestParams, id) {
    const subscriptionDetails = await getClientDetails(id)
    const subscribed = subscriptionDetails?.data?.oSubscription?.aSubscriptionType
    if (subscriptionDetails.status === 200) {
      setIsSubscribedStatus({
        api: subscribed.includes('api'),
        articles: subscribed.includes('article'),
        exclusive: subscribed.includes('exclusive'),
        categories: subscribed.includes('category')
      })
    }
    if (selectedTab === 'API') {
      const response = await getAPIStatsOfClient(id)
      const data = formatResponse(response)
      setAllDataOnResponse(response?.status, data, data.length, false)
    } else if (selectedTab === 'Articles') {
      const response = await getArticlesDetailsOfClient(requestParams, id)
      setAllDataOnResponse(response?.status, response?.data, response?.nTotalCount, false)
    } else if (selectedTab === 'Exclusive') {
      setAllDataOnResponse(200, [], 0, false)
    } else if (selectedTab === 'Categories') {
      const response = await getCategoriesDetailsOfClient(requestParams, id)
      setAllDataOnResponse(response?.status, response?.data, response?.nTotalCount, false)
    }
  }

  async function getAPIData(requestParams) {
    const subscriptionDetails = await getSubscriptionDetail()
    const subscribed = subscriptionDetails?.data?.aSubscriptionType
    if (subscriptionDetails.status === 200) {
      setIsSubscribedStatus({
        isSubscribedStatus,
        api: subscribed.includes('api'),
        articles: subscribed.includes('article'),
        exclusive: subscribed.includes('exclusive'),
        categories: subscribed.includes('category')
      })
    }

    if (selectedTab === 'API') {
      const response = await getAPIStats()
      const data = formatResponse(response)
      setAllDataOnResponse(response?.status, data, data.length, false)
    } else if (selectedTab === 'Articles') {
      const response = await getArticlesData(requestParams)
      setAllDataOnResponse(response?.status, response?.data, response?.nTotalCount, false)
    } else if (selectedTab === 'Exclusive') {
      setAllDataOnResponse(200, [], 0, false)
    } else if (selectedTab === 'Categories') {
      const response = await getCategoriesData(requestParams)
      setAllDataOnResponse(response?.status, response?.data, response?.nTotalCount, false)
    }
  }

  function formatResponse(response) {
    const objData = new Set()
    response?.data?.forEach((item) => {
      for (const property in item.aCount) {
        objData.add(property)
      }
    })
    const seven = lastSevenDays()
    const data = Array.from(objData).map((item) => {
      const formatCounts = []
      let flag = false
      for (const date of seven) {
        for (const element of response.data) {
          if (date === element.dDate) {
            formatCounts.push(element.aCount[item])
            flag = true
            break
          }
        }
        if (!flag) {
          formatCounts.push(undefined)
        }
        flag = false
      }
      return {
        sSlugName: item === '' ? '/feed' : item,
        nCounts: formatCounts
      }
    })
    return data
  }

  function setAllDataOnResponse(status, data, totalRecord, loadingStatus) {
    if (status === 200) {
      setTagList(data || [])
      setTotalRecord(totalRecord || 0)
      setIsLoading(loadingStatus)
    }
    setIsResponseStatus(true)
  }

  function checkPermission() {
    changeTab(checkPermissionAndGetParam().activeTabName)
  }

  function handleTabChange(name) {
    if (name === 'Articles') {
      setRequestParams({ ...requestParams, aStatusFiltersInput: ['r'], nSkip: 1 })
      appendParams({ aStatusFiltersInput: ['r'], nSkip: 1 })
    } else if (name === 'API') {
      setRequestParams({ ...requestParams, aStatusFiltersInput: ['a', 'i'], nSkip: 1 })
      appendParams({ aStatusFiltersInput: ['a', 'i'], nSkip: 1 })
    } else if (name === 'Exclusive') {
      setRequestParams({ ...requestParams, aStatusFiltersInput: ['r', 'dec'], nSkip: 1 })
      appendParams({ aStatusFiltersInput: ['r', 'dec'], nSkip: 1 })
    } else if (name === 'Categories') {
      setRequestParams({ ...requestParams, aStatusFiltersInput: ['r', 'dec', 'a'], nSkip: 1 })
      appendParams({ aStatusFiltersInput: ['r', 'dec', 'a'], nSkip: 1 })
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
      sSearch: data.sSearch || '',
      isLiveUpdate: data.isLiveUpdate || true,
      dFetchStart: data.dFetchStart || '',
      dFetchEnd: data.dFetchEnd || ''
    }
  }

  function changeTab(name) {
    setSelectedTab(name)
    setTagList([])
    setTotalRecord(0)
    setIsResponseStatus(false)
    isSubscribedStatus[name.toLowerCase()] ? setIsLoading(true) : setIsLoading(false)
    setColumns(getActionColumns(name))
    setTabs(
      tabs.map((e) => {
        return { ...e, active: e.internalName === name }
      })
    )
  }

  function getActionColumns(name) {
    const data = params.current
    if (name === 'Articles' || name === 'Exclusive') {
      const clm = [
        { name: <FormattedMessage id='article' />, internalName: 'sName', type: 0 },
        { name: <FormattedMessage id='slug' />, internalName: 'sSlug', type: 0 },
        { name: <FormattedMessage id='fetchDate' />, internalName: 'sFetchDate', type: 0 }
      ]
      return clm.map((e) => {
        if (data?.sSortBy === e.internalName) return { ...e, type: data.nOrder === 1 ? -1 : 1 }
        return e
      })
    } else if (name === 'API') {
      const clm = [{ name: <FormattedMessage id='name' />, internalName: 'sName', type: 0 }]
      const dates = lastSevenDays()
      clm.push(
        ...dates?.map((date) => {
          return { name: date }
        })
      )

      return clm.map((e) => {
        if (data?.sSortBy === e?.internalName) return { ...e, type: data.nOrder === 1 ? -1 : 1 }
        return e
      })
    } else if (name === 'Categories') {
      const clm = [
        { name: <FormattedMessage id='article' />, internalName: 'sName', type: 0 },
        { name: <FormattedMessage id='slug' />, internalName: 'sSlug', type: 0 }
      ]
      return clm.map((e) => {
        if (data?.sSortBy === e.internalName) return { ...e, type: data.nOrder === 1 ? -1 : 1 }
        return e
      })
    }
  }

  function checkPermissionAndGetParam() {
    return {
      params: ['a', 'i'],
      activeTabName: 'API'
    }
  }

  function getActiveTabName(e) {
    const data = e ? parseParams(e) : params.current
    if (data?.aStatusFiltersInput?.length) {
      if (data.aStatusFiltersInput.toString() === 'r') {
        return 'Articles'
      } else if (data.aStatusFiltersInput.toString() === 'a,i') {
        return 'API'
      } else if (data.aStatusFiltersInput.toString() === 'r,dec') {
        return 'Exclusive'
      } else if (data.aStatusFiltersInput.toString() === 'r,dec,a') {
        return 'Categories'
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
      case 'filter':
        setRequestParams({ ...requestParams, dFetchStart: value.dFetchStart, dFetchEnd: value.dFetchEnd })
        appendParams({ dFetchStart: value.dFetchStart, dFetchEnd: value.dFetchEnd })
        break
      default:
        break
    }
  }

  function handleSort(field) {
    if (field.internalName !== 'sSlug') {
      setRequestParams({ ...requestParams, sSortBy: field.internalName, nOrder: field.type === 0 ? -1 : field.type })
      appendParams({ sSortBy: field.internalName, nOrder: field.type === 0 ? -1 : field.type })
      const data = setSortType(columns, field.internalName)
      setColumns(data)
    }
  }
  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, nSkip: page })
    appendParams({ nSkip: page })
  }

  return (
    <>
      <DataTable
        status={isSubscribedStatus}
        isResponseStatus={isResponseStatus}
        className={selectedTab === 'API'}
        columns={columns}
        sortEvent={handleSort}
        totalRecord={totalRecord}
        isLoading={false}
        header={{
          left: {
            rows: true
          },
          right: {
            search: selectedTab !== 'API',
            filter: selectedTab !== 'API'
          }
        }}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        pageChangeEvent={handlePageEvent}
        selectedTab={selectedTab}
        pagination={{ currentPage: requestParams.nSkip, pageSize: requestParams.nLimit }}
        tabs={tabs}
        tabEvent={handleTabChange}
        actionColumn={selectedTab === 'Exclusive' || selectedTab === 'Articles' || selectedTab === 'Categories'}
        isFilter={isFilter}
        setIsFilterOpen={setIsFilterOpen}
      >
        {!isLoading ? (
          tagList?.map((tag, index) => {
            return (
              <TagItemRowActive
                key={tag?._id}
                index={index}
                tag={tag}
                selectedTab={selectedTab}
              />
            )
          })
        ) : (
          <Loading />
        )}
       <DateFilter setIsFilter={setIsFilter} setIsFilterOpen={setIsFilterOpen} isFilterOpen={isFilterOpen} headerEvent={(name, value) => handleHeaderEvent(name, value)} />
      </DataTable>
    </>
  )
}

export default Analytics
