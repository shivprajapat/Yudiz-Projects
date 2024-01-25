import React from 'react'
import { Breadcrumbs, Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux'
import { clearBreadCrumb, updateBreadCrumb } from 'Redux/Actions/BreadCrumbAction'

function ChartDetailsNavbar({ breadCrumbItem, setIsSelected }) {
  const dispatch = useDispatch()

  function handelClick() {
    setIsSelected(null)
    dispatch(clearBreadCrumb())
  }

  function handleBreadcrumb(clickedPath, index) {
    dispatch(updateBreadCrumb(clickedPath, index))
  }

  return (
    <nav className='flex bg-lightBlue h-[38px] w-[100%] align-middle px-1 items-center box-border'>
      <h3 className='text-lg text-white font-semibold'>
        <Breadcrumbs style={{ color: ' white', fontSize: '18px' }} separator='>>' aria-label='breadcrumb'>
          {breadCrumbItem?.map((data, index) => (
            <Link key={index} style={{ color: ' white', fontSize: '18px' }} onClick={() => handleBreadcrumb(data?.path, index)}>
              <div className='cursor-pointer hover:text-pink-500'>{data?.path}</div>
            </Link>
          ))}
        </Breadcrumbs>
      </h3>
      <div className='cursor-pointer flex absolute right-6 bg-red-500 border-1 border-white rounded-md m-2' onClick={handelClick}>
        <CloseIcon />
      </div>
    </nav>
  )
}

export default ChartDetailsNavbar
