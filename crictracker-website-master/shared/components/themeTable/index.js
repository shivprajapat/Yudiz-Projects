import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'

const ThemeTable = ({ labels, children, isNumbered, isBordered, headClass, isDark }) => {
  return (
    <Table key={Math.random() * 100} responsive className={`${isNumbered && 'numbered'} ${isBordered && 'bordered br-sm overflow-hidden'} ${isDark && 'dark'} text-center font-semi text-nowrap`}>
      <thead>
        <tr>
          {labels.map((element, index) => {
            return <th className={headClass?.index === index ? headClass?.className : ''} key={index}>{element}</th>
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
  isBordered: PropTypes.bool,
  headClass: PropTypes.shape({
    className: PropTypes.string,
    index: PropTypes.number
  }),
  isDark: PropTypes.bool
}

export default ThemeTable
