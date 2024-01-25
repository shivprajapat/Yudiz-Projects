import React from 'react'
import PropTypes from 'prop-types'

// component
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import DataTable from 'Components/DataTable'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'

import AddInquiryFollowUp from './Add-InquiryFollowUp'

// helper
import { cell, formatDate, isGranted } from 'helpers'

function InquiryFollowUpList({ requestParams, data, onPageChange, onLimitChange, permissions, gotoAdd, gotoEdit, onDelete, columns, isLoading, id, addEditModal, ...props }) {
  return (
    <>
      <Wrapper transparent>

        <PageTitle
          BtnText={isGranted(permissions?.CREATE) ? 'Add FollowUp' : null}
          handleButtonEvent={gotoAdd}
        />

        <Divider className={'mt-3 mb-3'} />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aInquiryFollowupList?.length}
          isLoading={isLoading}
        >
          {data?.aInquiryFollowupList?.map((item, i) => {
            if (id === item?.iInquiryID) {
              return (
                <tr key={i}>
                  <td>{cell(requestParams.page + (i + 1))}</td>
                  <td className='display'>
                    {item?.oFollowupBy ? cell(item?.oFollowupBy?.sName) : <span className='deleted-data'>Employee Not Found</span>}
                  </td>
                  <td className="d-inline-block text-truncate" style={{ maxWidth: 450 }}>{cell(item?.sResponse)}</td>                  
                  <td>{cell(formatDate(item?.dFollowupAt))}</td>
                  <td>{cell(formatDate(item?.nextFollowupAt))}</td>
                  <ActionColumn
                    permissions={permissions}
                    handleEdit={() => gotoEdit(item._id)}
                    handleDelete={() => onDelete(item._id)}
                  />
                </tr>
              )
            }
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

      {addEditModal.type === 'followUp' &&
        <AddInquiryFollowUp
          addEditModal={addEditModal}
          handleAddEditClose={props.handleAddEditClose}
          control={props.followUpControl}
          options={props.employeeList}
          handleSubmit={props.handleFollowUpSubmit}
          onSubmit={props.onFollowUpSubmit}
        />
      }
    </>
  )
}

export default InquiryFollowUpList

InquiryFollowUpList.propTypes = {
  requestParams: PropTypes.object,
  data: PropTypes.object,
  permissions: PropTypes.object,
  onPageChange: PropTypes.func,
  onLimitChange: PropTypes.func,
  gotoAdd: PropTypes.func,
  gotoEdit: PropTypes.func,
  onDelete: PropTypes.func,
  handleFollowUpSubmit: PropTypes.func,
  onFollowUpSubmit: PropTypes.func,
  handleAddEditClose: PropTypes.func,
  columns: PropTypes.any,
  isLoading: PropTypes.any,
  id: PropTypes.string,
  addEditModal: PropTypes.object,
  followUpControl: PropTypes.object,
  employeeList: PropTypes.array,
} 
