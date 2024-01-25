import React from 'react'
import PropTypes from 'prop-types'

function PermissionRow({ permissions }) {
  const CheckBox = (data) => {
    return (
      <div className='checkbox-wrap'>
        <input
          className='ml-1'
          // checked={
          //   permissions?.find((i) => i.eModuleName === cellData?.eModuleName)?.aOperations?.length &&
          //   permissions?.find((i) => i.eModuleName === cellData?.eModuleName)?.aOperations?.includes(flag)
          // }
          type='checkbox'
          inline
          id='checkbox'
          // onChange={(e) => {
          //   handleClickdData(e, cellData, flag)
          // }}
        />
        <label htmlFor='checkbox'></label>
      </div>
    )
  }
  return (
    <tr key={permissions.eModuleName}>
      <td></td>
      <td>{permissions.eModuleName}</td>
      <td>
        <CheckBox cellData={permissions} flag={'C'} />
      </td>
      <td>
        <CheckBox cellData={permissions} flag={'R'} />
      </td>
      <td>
        <CheckBox cellData={permissions} flag={'U'} />
      </td>
      <td>
        <CheckBox cellData={permissions} flag={'D'} />
      </td>
    </tr>
  )
}
PermissionRow.propTypes = {
  permissions: PropTypes.array
}
export default PermissionRow
