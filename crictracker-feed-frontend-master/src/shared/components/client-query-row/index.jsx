import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import PopUpModal from '../pop-up-modal'

import ToolTip from 'shared/components/tooltip'
import { convertDate } from 'shared/utils'
// import { firstLetterCapital } from 'shared/utils'

function ClientQueryRow({ tag, onStatusChange }) {
  const [view, setView] = useState(false)
  return (
    <>
      <tr key={tag?._id}>
        <td className='title'>{tag?.oClientData?.sName}</td>
        <td>{tag?.oClientData?.sEmail || '-'}</td>
        <td>{tag?.oClientData?.sPhone || '-'}</td>
        <td>{convertDate(tag?.dCreated) || '-'}</td>
        <td className='d-flex justify-content-end'>
          <ToolTip toolTipMessage={'View'}>
            <Button variant='link' className='square icon-btn' onClick={() => setView(true)}>
              <i className='icon-visibility d-block' />
            </Button>
          </ToolTip>
        </td>
      </tr>
      { view && <PopUpModal title='Message' isOpen={view} onClose={() => setView(false)} isCentered='true'><h5>{tag?.sDetails}</h5></PopUpModal> }
    </>
  )
}
ClientQueryRow.propTypes = {
  tag: PropTypes.object,
  onStatusChange: PropTypes.func
}
export default ClientQueryRow
