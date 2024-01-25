import React from 'react'

import Communities from '../Communities'
const CommunitySideBar = () => {
  return (
    <div className='CommunitySideBar-item'>
      {/* side bar  */}
      <Communities title='My Communities' btnTxt='Create Community' btnCls='black-border-btn'/>
      <Communities title='Communities' btnTxt='View All' btnCls='view-all'/>
      <Communities title='Popular communities' btnTxt='View All' btnCls='view-all' />
    </div>
  )
}
export default CommunitySideBar
