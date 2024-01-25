import React from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'

function TableWrapper({ title, children }) {
  return (
    <Box
      component='div'
      className='mt-4 bg-lightBlue rounded w-full h-full box-border flex flex-col items-center  content-center duration-500 '
    >
      <nav className='flex bg-[#363E58] h-[38px] w-[100%] align-middle px-1 items-center box-border'>
        <h3 className='text-lg text-white font-semibold'>{title}</h3>
      </nav>

      <div className='flex justify-center item-center p-10'>{children}</div>
    </Box>
  )
}
TableWrapper.propTypes = {
  children: PropTypes.node
}

export default TableWrapper
