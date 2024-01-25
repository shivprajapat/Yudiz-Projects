/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import Select from 'react-select'
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi'

import './style.scss'
import { parseParams } from 'shared/utils'
import Search from 'admin/shared/components/search'

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
  ...rest
}) {
  const params = parseParams(location.search)

  const handleBulkAction = (e) => {
    // if (e.value === 'd') {
    //   confirmAlert({
    //     title: labels.confirmationTitle,
    //     message: labels.confirmationMessage,
    //     customUI: CustomAlert,
    //     buttons: [
    //       {
    //         label: labels.yes,
    //         onClick: async () => {
    //           headerEvent('bulkAction', e.value)
    //         }
    //       },
    //       {
    //         label: labels.no
    //       }
    //     ]
    //   })
    // } else {
    //   headerEvent('bulkAction', e.value)
    // }
  }
  return (
    <div className="data-table-section">
      <div className={`data-table ${rest.className}`}>
        {header && (
          <div className="data-table-header">
            <div className="d-flex left">
              {/* {header.left.bulkAction && (
              <Form.Group className="bulk-action only-border mb-0 form-group">
                <Select
                  options={bulkAction.filter((e) => {
                    if (e.isAllowedTo && getUserPermissions.includes(e.isAllowedTo)) return e
                    else if (!e.isAllowedTo) return e
                    else return null
                  })}
                  className="react-select only-border sm"
                  classNamePrefix="select"
                  isSearchable={false}
                  placeholder="Bulk Action"
                  isDisabled={!selectAllValue.filter((e) => e.value).length}
                  onChange={(e) => {
                    handleBulkAction(e)
                  }}
                />
              </Form.Group>
            )} */}
              {header.left.rows && (
                <Form.Group className="bulk-action only-border form-group mb-0 d-flex align-items-center">
                  <span>rows</span>
                  <Select
                    options={[10, 20, 30, 40, 50].map((e) => ({ label: e, value: e }))}
                    value={[{ label: Number(pagination.pageSize) || 10, value: Number(pagination.pageSize) || 10 }]}
                    className="react-select only-border sm"
                    classNamePrefix="select"
                    isSearchable={false}
                    onChange={(e) => {
                      headerEvent && headerEvent('rows', e.value)
                    }}
                  />
                </Form.Group>
              )}
            </div>
            <div className="right d-flex align-items-center">
              {header.right.search && <Search className="search-box only-border m-0" searchEvent={(e) => headerEvent && headerEvent('search', e)} />}
              {header.right.latestFirst && (
                <Button variant="outline-secondary" className="square" size="sm" onClick={() => headerEvent && headerEvent('latestFirst', 1)}>
                  latestFirst
                </Button>
              )}
              {header.right.filter && (
                <Button className="admin-filter-btn" onClick={() => headerEvent && headerEvent('filter', true)}>
                  filter
                </Button>
              )}
              {header.right.component && component}
            </div>
          </div>
        )}
        <ul className="data-table-tabs">
          {tabs &&
            tabs.map((item) => {
              if (item.isAllowedTo) {
                return (
                  <li key={item.internalName} className={item.active ? 'active' : ''} onClick={() => tabEvent && tabEvent(item.internalName)}>
                    {item.name} {item.count >= 0 && `(${item.count})`}
                  </li>
                )
              } else {
                return (
                  <li key={item.internalName} className={item.active ? 'active' : ''} onClick={() => tabEvent && tabEvent(item.internalName)}>
                    {item.name} {item.count >= 0 && `(${item.count})`}
                  </li>
                )
              }
            })}
        </ul>
        <Table className="table-borderless" responsive="xl">
          <thead>
            <tr>
              {checkbox && (
                <th className="checkbox">
                  <Form.Check
                    type="checkbox"
                    id="All"
                    name="selectAll"
                    className="form-check m-0"
                    onChange={selectAllEvent}
                    checked={selectAllValue.length ? selectAllValue.every((item) => item.value) : false}
                    label="&nbsp;"
                  />
                </th>
              )}
              {columns.map((column) => {
                return (
                  <th key={column.internalName}>
                    <span onClick={() => sortEvent && sortEvent(column)} className="sort-header">
                      {column.name}
                      {column.type === 1 && <BiUpArrowAlt />}
                      {column.type === -1 && <BiDownArrowAlt />}
                    </span>
                  </th>
                )
              })}
              {actionColumn && <th className="text-end">actions</th>}
            </tr>
          </thead>
          <tbody>
            {children}
            {totalRecord === 0 && (
              <tr>
                <td colSpan={columns.length + (checkbox ? 2 : 1)} className="text-center">
                  No record found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {pagination && (
        <Suspense fallback={<div />}>
          <CustomPagination
            currentPage={pagination.currentPage}
            totalCount={totalRecord}
            pageSize={pagination.pageSize}
            onPageChange={pageChangeEvent}
            className="admin-pagination"
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
  component: PropTypes.object
  // tabCount: PropTypes.number
}
export default DataTable
