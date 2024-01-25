import { TableCell, TableRow } from '@mui/material'
import React from 'react'

function CommonRow({ data }) {
  return (
    <TableRow>
      {data.map((item, index) => {
        return (
          <TableCell key={index} className={item?.className} style={{ color: 'white', textAlign: 'center' }}>
            {item.children}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default CommonRow
