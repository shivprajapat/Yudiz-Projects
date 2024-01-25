import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'

const ThemeTable = ({ labels, children, isNumbered, isBordered }) => {
  return (
    <Table responsive className={`${isNumbered && 'numbered'} ${isBordered && 'bordered'} text-center font-semi text-nowrap`}>
      <thead>
        <tr>
          {labels.map((element, index) => {
            return <th key={index}>{element}</th>
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

ThemeTable.propTypes = {
  labels: PropTypes.array,
  children: PropTypes.any,
  isNumbered: PropTypes.bool,
  isBordered: PropTypes.bool
}

export default ThemeTable
