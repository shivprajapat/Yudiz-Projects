import React from 'react'
import { Paper, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

function Table({ columns, children, minWidth }) {
  return (
    <div className='overflow-x-auto max-w-[100%]'>
      <TableContainer component={Paper}>
        <MuiTable className={`w-auto h-auto   ${minWidth}`} aria-label='simple table'>
          <TableHead className='bg-darkGrey'>
            <TableRow>
              {columns &&
                columns.map((column, index) => {
                  return (
                    <TableCell style={{ textAlign: 'center' }} key={index}>
                      <span className='text-white '>
                        {column.name}
                        <ArrowDropDownIcon />
                        {/* {column?.isSort && column.type === 1 && <i className='icon-arrow-drop-up' />}
                          {column?.isSort && column.type === -1 && <i className='icon-arrow-drop-down' />} */}
                      </span>
                    </TableCell>
                  )
                })}
            </TableRow>
          </TableHead>
          <TableBody className='bg-lightBlue '>{children}</TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  )
}

export default Table
