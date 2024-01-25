import React, { useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import axios from '../axios'
import PropTypes from 'prop-types'
import { formateDateTime } from 'utils/helper'
import { Button } from '@material-ui/core'

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

const headers = [
  { label: 'Number of transactions as borrower', key: 'borrowerTransactions' },
  { label: 'Number of transactions as loaner', key: 'loanerTransactions' },
  { label: 'Number of rentals', key: 'numberOfrentals' },
  { label: 'Email', key: 'emailId' },
  { label: 'Username', key: 'username' },
  { label: 'Create at', key: 'createdAt' }
]

function AsyncCSV({ id }) {
  const [userData, setUserData] = useState([])
  const csvLinkEl = useRef()

  const getUserList = () => {
    axios
      .get('/admin/rentals/all-data/' + id)
      .then(({ data }) => {
        setUserData(data.data.rentals.rows)
        setUserData([
          {
            borrowerTransactions: data?.data?.borrowerTransactions || 0,
            loanerTransactions: data?.data?.loanerTransactions || 0,
            numberOfrentals: data?.data?.rentals?.count || 0,
            emailId: data?.data?.user?.emailId || '-',
            username: data?.data?.user?.userName || '-',
            createdAt: data?.data?.user?.createdAt ? formateDateTime(data?.data?.user?.createdAt) : '-'
          }
        ])
      })
      .catch((error) => {
        console.error('error', error)
      })
  }
  useEffect(() => {
    if (userData && userData[0] && userData[0].username) {
      csvLinkEl.current.link.click()
    }
  }, [JSON.stringify(userData)])

  return (
    <>
      <Button color="primary" variant="contained" onClick={getUserList} startIcon={<ArrowDownwardIcon />} style={{ marginLeft: '20px' }}>
        Download
      </Button>
      <CSVLink headers={headers} filename="user.csv" data={userData} ref={csvLinkEl} />
    </>
  )
}
AsyncCSV.propTypes = {
  id: PropTypes.string
}
export default AsyncCSV
