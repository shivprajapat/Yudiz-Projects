import DataTable from 'admin/shared/components/data-table'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import DownloadItemRow from './download-item-row'
import axios from 'shared/libs/axios'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const AdminDownloads = () => {
  const dispatch = useDispatch()

  const [columns, setColumns] = useState([{ name: 'name', internalName: 'name', type: 0 }])
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [totalRecord, setTotalRecord] = useState(0)
  const [downloadData, setDownloadData] = useState()
  const [downloadsStore, setDownloadStore] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleHeaderEvent = (name, value) => {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, fileName: value })
        break
      default:
        break
    }
  }

  const handlePageEvent = (page) => {
    setRequestParams({ ...requestParams, page: page })
  }

  const setSortType = (data, fieldName) => {
    return data.map((data) => {
      if (data.internalName === fieldName) {
        data.type = data.type === 1 ? -1 : 1
      } else {
        data.type = 0
      }
      return data
    })
  }

  const handleSort = (field) => {
    if (field.internalName === 'name') {
      setRequestParams({ ...requestParams, sortColumn: field.internalName, sortOrder: field.type === 1 ? -1 : 1 })
      const data = setSortType(columns, field.internalName)
      setColumns(data)
    }
  }

  const fetchTransactionCsvs = async (params) => {
    try {
      const response = await axios.get(`${apiPaths.transactionCsv}${setParamsForGetRequest(params)}`)
      if (response.data) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response.message,
            type: TOAST_TYPE.Success
          }
        })
        setDownloadStore(response.data?.result)
      }
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteTransactionCsv = async (fileName) => {
    try {
      const response = await axios.delete(`${apiPaths.deleteTransactionCsv}/${fileName}`)
      if (response.data) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response.message,
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setDownloadData(downloadsStore?.userTransactions?.items)
    setTotalRecord(downloadsStore?.metaData?.totalItems)
  }, [downloadsStore])

  useEffect(() => {
    fetchTransactionCsvs(requestParams)
  }, [requestParams])

  return (
    <>
      {loading && <div className="w-100 d-flex justify-content-center align-items-center">Loading...</div>}
      <div className="content-headers">
        <h2 className="admin-heading">Downloads</h2>
      </div>
      <div className="assets-section">
        <DataTable
          className="asset-list"
          columns={columns}
          sortEvent={handleSort}
          totalRecord={totalRecord}
          header={{
            left: {
              rows: true
            },
            right: {
              search: true
            }
          }}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          pageChangeEvent={handlePageEvent}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {!downloadData || downloadData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no category matches your query.</div>
          ) : (
            downloadData?.map(({ id, fileName, awsUrl }, index) => {
              return (
                <DownloadItemRow
                  key={id}
                  index={index}
                  name={fileName}
                  awsUrl={awsUrl}
                  fetchTransactionCsvs={fetchTransactionCsvs}
                  deleteTransactionCsv={deleteTransactionCsv}
                  id={id}
                  page={requestParams.page}
                  perPage={requestParams.perPage}
                />
              )
            })
          )}
        </DataTable>
      </div>
    </>
  )
}

export default AdminDownloads
