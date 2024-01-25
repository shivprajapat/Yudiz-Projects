import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import ToolTip from 'shared/components/tooltip'
import { allRoutes } from 'shared/constants/AllRoutes'
import { firstLetterCapital } from 'shared/utils'
import Confirmation from '../confirmation'

function ClientRow({ tag, onStatusChange }) {
  const history = useHistory()
  const [isConfirmation, setIsConfirmation] = useState(false)
  const [checkedValue, setCheckedValue] = useState()
  function handleChange(e) {
    setIsConfirmation(true)
    setCheckedValue(e)
  }
  function changeStatus() {
    onStatusChange(checkedValue)
    setIsConfirmation(false)
  }

  return (
    <>
      <tr key={tag?._id}>
        <td className='title'>{tag?.sName}</td>
        <td>{tag?.oSubscription?.aSubscriptionType?.map(item => firstLetterCapital(item)).sort().join(', ')}</td>
        <td>{tag?.sEmail || '-'}</td>
        <td className='d-flex justify-content-end'>
          <ToolTip toolTipMessage="Toggle">
              <Form.Check
                type="switch"
                name={tag?._id}
                className="d-inline-block me-1"
                checked={tag?.eStatus === 'a'}
                onChange={handleChange}
              />
            </ToolTip>
          <ToolTip toolTipMessage={'Stats'}>
            <Button variant='link' className='square icon-btn' onClick={() => history.push(allRoutes.clientAnalytics(tag?._id))}>
              <i className='icon-analytics_bar-chart_metrics_statistics_icon' />
            </Button>
          </ToolTip>
          <ToolTip toolTipMessage={'Edit'}>
            <Button variant='link' className='square icon-btn' onClick={() => history.push(allRoutes.editClient(tag?._id))}>
              <i className='icon-create d-block' />
            </Button>
          </ToolTip>
        </td>
      </tr>
      { isConfirmation && <Confirmation isOpen={isConfirmation} isTitle={checkedValue?.target?.checked} onClose={setIsConfirmation} onSubmit={changeStatus}/>}
    </>
  )
}
ClientRow.propTypes = {
  tag: PropTypes.object,
  onStatusChange: PropTypes.func
}
export default ClientRow
