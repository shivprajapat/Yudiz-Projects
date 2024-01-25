import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'react-bootstrap'
import { ReactComponent as Up } from 'Assets/Icons/upArrow.svg'
import { ReactComponent as Down } from 'Assets/Icons/downArrow.svg'
import './_datatable.scss'

export default function DataTable({ columns, align, children, disableActions, totalData, isLoading, handleSorting, actionPadding }) {
  return (
    <div className={'datatable_container' + (isLoading ? ' hide' : '')}>
      <table className="datatable">
        <thead>
          <tr>
            {columns?.map((column, i) => (
              <td
                key={column.connectionName + i}
                onClick={() => {
                  column.isSorting && handleSorting(column.connectionName)
                }}
                style={{ cursor: 'pointer', textAlign: align || 'left' }}
              >
                <div className="d-flex align-items-center">
                  {column.name}
                  {column.sort === 0 && column.isSorting && (
                    <div className="ms-2 d-flex flex-column">
                      <Up />
                      <Down style={{ marginTop: '2px' }} />
                    </div>
                  )}
                  <div className="ms-2 d-flex flex-column">
                    <Up style={{ opacity: column.sort === 1 ? 1 : 0 }} />
                    <Down style={{ marginTop: '2px', opacity: column.sort === -1 ? 1 : 0 }} />
                  </div>
                </div>
              </td>
            ))}
            {!disableActions && (
              <td align="right" style={{ paddingRight: actionPadding || '60px' }}>
                Actions
              </td>
            )}
          </tr>
        </thead>
        <tbody style={{ textAlign: align || 'left' }}>
          {children}
          {(totalData === 0 || !totalData) && (
            <tr className="w-100">
              <td colSpan={columns.length + (disableActions ? 0 : 1)}>
                <h3 className="mt-2 w-100 fs-6 d-flex justify-content-center">No Records Found</h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isLoading && (
        <div className="table-loader d-flex justify-content-center align-items-center w-100">
          <Spinner as="div" animation="border" variant="dark" />
        </div>
      )}
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  children: PropTypes.node,
  align: PropTypes.string,
  disableActions: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  totalData: PropTypes.number,
  actionPadding: PropTypes.string,
  handleSorting: PropTypes.func,
}
