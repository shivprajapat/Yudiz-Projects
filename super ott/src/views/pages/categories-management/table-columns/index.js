/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Edit, Trash } from 'react-feather'
import { useHistory } from 'react-router-dom'

export const serverSideColumns = [
  {
    name: 'Category Image',
    selector: 'sImage',
    minWidth: '20px',
    cell: (row) => {
      return (
        <div>
          <img src={row?.value} width="30px" height="30px" />
        </div>
      )
    }
  },

  {
    name: 'Category Name',
    selector: 'sName',
    sortable: true,
    minWidth: '250px'
  },

  {
    name: 'Action',
    allowOverflow: true,
    cell: (row) => {
      const history = useHistory()
      const [openConfirmModal, setOpenConfirmModal] = useState(false)
      return (
        <div className="d-flex ">
          <div
            className="action mr-1 cursor-pointer"
            onClick={() => {
              history.push(`/category-management/update/${row?._id}`)
            }}
          >
            <Edit size={15} />
          </div>
          <div
            className="action"
            onClick={() => {
              setOpenConfirmModal(true)
            }}
          >
            <Trash size={15} />
          </div>
        </div>
      )
    }
  }
]
