import React from 'react'

import CommunitiesList from '../communities-list'

const CommunitySideBar = () => {
  const isAuthenticated = localStorage.getItem('userToken')

  return (
    <>
      {isAuthenticated && (
        <>
          <CommunitiesList type="own" title="My Communities" btnTxt="Create Community" btnCls="black-border-btn" />
          <CommunitiesList type="popular" title="Popular communities" btnTxt="View All" btnCls="view-all" />
          <CommunitiesList type="regular" title="Communities I Follow" btnTxt="View All" btnCls="view-all" />
        </>
      )}
    </>
  )
}

export default CommunitySideBar
