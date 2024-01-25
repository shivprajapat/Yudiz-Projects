import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import Select from 'react-select'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'

import Search from '../search'
import { parseParams } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'
import ToolTip from 'shared/components/tooltip'
import Loading from '../loading'
import GetSubScription from '../get-subscription'
import { getFromLocalStorage } from 'shared/helper/localStorage'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))
function DataTable({
  children,
  bulkAction,
  component,
  columns,
  sortEvent,
  isLoading,
  totalRecord,
  pagination,
  header,
  headerEvent,
  checkbox,
  selectAllEvent,
  pageChangeEvent,
  selectAllValue,
  actionColumn,
  tabs,
  tabEvent,
  isFilter,
  selectedTab,
  status,
  isResponseStatus,
  setIsFilterOpen,
  ...rest
}) {
  const history = useHistory()
  const params = parseParams(location.search)

  return (
    <div className={`data-table ${rest.className}`}>
      {header && (
        <div className='data-table-header d-md-flex align-items-center justify-content-between'>
          <div className='d-flex left'>
            {header.left.rows && (
              <Form.Group className='bulk-action only-border form-group mb-0 d-flex align-items-center'>
                <span>
                  <FormattedMessage id='rows' />
                </span>
                <Select
                  options={[10, 20, 30, 40, 50].map((e) => ({ label: e, value: e }))}
                  value={[{ label: Number(params.nLimit) || 10, value: Number(params.nLimit) || 10 }]}
                  className='react-select only-border sm'
                  classNamePrefix='select'
                  isSearchable={false}
                  onChange={(e) => {
                    headerEvent('rows', e.value)
                  }}
                />
              </Form.Group>
            )}
          </div>
          <div className='right d-flex align-items-center'>
            {header.right.search && <Search className='search-box only-border m-0' searchEvent={(e) => headerEvent('search', e)} />}
            {header.right.filter && (
              <ToolTip toolTipMessage='Filter'>
                <Button
                  variant='info'
                  className={isFilter ? 'square btn-filter' : 'square'}
                  size='sm'
                  onClick={() => setIsFilterOpen(true)}
                >
                  <FormattedMessage id='filter' />
                  <i className='icon-filter-list' />
                  <div className='is-filtered-label'>
                    <span></span>
                  </div>
                </Button>
              </ToolTip>
            )}
            {header.right.component && component}
            {header.right.add && (
              <ToolTip toolTipMessage='Add Client'>
                <Button
                  variant='info'
                  className={isFilter ? 'square btn-filter' : 'square'}
                  size='sm'
                  onClick={() => {
                    return history.push(allRoutes.addClient, { type: 'add' })
                  }}
                >
                  <i className='icon-add'></i>
                  <FormattedMessage id='addClient' />
                </Button>
              </ToolTip>
            )}
          </div>
        </div>
      )}
      <ul className='data-table-tabs d-flex'>
        {tabs &&
          tabs.map((item) => {
            if (item.isAllowedTo) {
              return (
                <li key={item.internalName} className={item.active ? 'active' : ''} onClick={() => tabEvent(item.internalName)}>
                  {item.name} {item.count >= 0 && `(${item.count})`}
                </li>
              )
            } else {
              return (
                <li key={item.internalName} className={item.active ? 'active' : ''} onClick={() => tabEvent(item.internalName)}>
                  {item.name} {item.count >= 0 && `(${item.count})`}
                </li>
              )
            }
          })}
      </ul>
      <Table className='table-borderless' responsive='sm'>
        <thead>
          <tr>
            {totalRecord !== 0 &&
              columns?.map((column) => {
                return (
                  <th key={column.internalName} className={selectedTab === 'API' ? 'api-table-head' : null}>
                    <span onClick={() => sortEvent(column)}>
                      {column.name}
                    </span>
                  </th>
                )
              })}
            {totalRecord !== 0 && actionColumn && <th>{useIntl().formatMessage({ id: 'actions' })}</th>}
          </tr>
        </thead>
        <tbody>
          {children}
          {((isResponseStatus && totalRecord === 0 && status && status[selectedTab?.toLowerCase()]) || (isResponseStatus && totalRecord === 0 && selectedTab === 'clients')) && (
            <tr>
              <td colSpan={columns?.length + (checkbox ? 2 : 1)} className='text-center'>
                <FormattedMessage id='noRecordFound' />
              </td>
            </tr>
          )}
          {(getFromLocalStorage('role') === 'admin' && isResponseStatus && totalRecord === 0 && status && !status[selectedTab?.toLowerCase()]) && (
              <tr>
                <td colSpan={columns?.length + (checkbox ? 2 : 1)} className='text-center'>
                  <FormattedMessage id='notSubscribedByUser' />
                </td>
              </tr>
          )}
        </tbody>
        {(getFromLocalStorage('role') === 'client' && isResponseStatus && totalRecord === 0 && status && !status[selectedTab?.toLowerCase()]) && (
          <GetSubScription header= {selectedTab}/>
        )}
      </Table>
      {isLoading && <Loading />}
      {pagination && (
        <Suspense fallback={<div />}>
          <CustomPagination
            currentPage={pagination.currentPage}
            totalCount={totalRecord}
            pageSize={pagination.pageSize}
            onPageChange={pageChangeEvent}
          />
        </Suspense>
      )}
    </div>
  )
}
DataTable.propTypes = {
  children: PropTypes.node,
  bulkAction: PropTypes.array,
  columns: PropTypes.array,
  sortEvent: PropTypes.func,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object,
  totalRecord: PropTypes.number,
  header: PropTypes.object,
  headerEvent: PropTypes.func,
  selectAllEvent: PropTypes.func,
  pageChangeEvent: PropTypes.func,
  checkbox: PropTypes.bool,
  selectAllValue: PropTypes.array,
  actionColumn: PropTypes.bool,
  tabs: PropTypes.array,
  tabEvent: PropTypes.func,
  component: PropTypes.object,
  isFilter: PropTypes.bool,
  setIsFilterOpen: PropTypes.func,
  selectedTab: PropTypes.string,
  status: PropTypes.number,
  isResponseStatus: PropTypes.bool
}
export default DataTable
