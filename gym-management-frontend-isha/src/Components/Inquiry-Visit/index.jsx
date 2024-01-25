import React from 'react'
import PropTypes from 'prop-types'

// component
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'

import AddInquiryVisit from './Add-InquiryVisit'

// helper 
import { cell, formatDate, isGranted } from 'helpers'

function InquiryVisitList({ requestParams, data, onPageChange, onLimitChange, permissions, gotoAdd, gotoEdit, onDelete, columns, ...props }) {
  return (
    <>
      <Wrapper transparent>

        <PageTitle
          BtnText={isGranted(permissions.CREATE) ? 'Add Visit' : null}
          handleButtonEvent={gotoAdd}        
        />

        <Divider className={'mt-3 mb-3'}/>

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aInquiryVisitList?.length}
          isLoading={props.isLoading}
        >
          {data?.aInquiryVisitList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.oCreator.sUserName)}</td>
                <td>{cell(item?.sPurpose)}</td>
                <td>{cell(item?.sDescription)}</td>
                <td>{cell(formatDate(item?.dVisitedAt))}</td>
                <ActionColumn
                  permissions={permissions}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => onPageChange(page)}
          onLimitChange={(limit) => onLimitChange(limit)}
        />
      </Wrapper>

      {props.addEditModal.type === 'visit' &&
        <AddInquiryVisit
          addEditModal={props.addEditModal}
          handleAddEditClose={props.handleAddEditClose}
          control={props.visitControl}
          handleSubmit={props.handleVisitSubmit}
          onSubmit={props.onVisitSubmit}
        />
      }
    </>
  )
}

export default InquiryVisitList

InquiryVisitList.propTypes = {
  requestParams: PropTypes.object,
  addEditModal: PropTypes.object,
  visitControl: PropTypes.object,
  data: PropTypes.object,
  permissions: PropTypes.object,
  onPageChange: PropTypes.func,
  handleVisitSubmit: PropTypes.func,
  handleAddEditClose: PropTypes.func,
  onVisitSubmit: PropTypes.func,
  onLimitChange: PropTypes.func,
  gotoAdd: PropTypes.func,
  gotoEdit: PropTypes.func,
  onDelete: PropTypes.func,
  columns: PropTypes.any,
  isLoading: PropTypes.any
} 
