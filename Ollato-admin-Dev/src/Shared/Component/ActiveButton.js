import React from 'react'
import { Link } from 'react-router-dom'
import view from '../../assets/images/view-eye.svg'
import edit from '../../assets/images/pencil-line.svg'
import deletes from '../../assets/images/delete-bin-line.svg'
// import localStorage from 'react-secure-storage'
import PropTypes from 'prop-types'
import ls from 'localstorage-slim'

function ActiveButton ({ id, handleShow, slug, viewlink, editlink }) {
  const roles = JSON.parse(localStorage.getItem('roles'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  return <div className="button-box">
  {adminType === 'super' || adminType === 'center' || roles?.find(i => i.module_permissions.slug === slug)?.view === '1'
    ? (
    <Link to={`${viewlink}/${id}`}>
      <button className="action-btns green-bg" type="button">
        <img src={view} alt="" /> View
      </button>
    </Link>
      )
    : null}
  {adminType === 'super' || adminType === 'center' || roles?.find(i => i.module_permissions.slug === slug)?.update === '1'
    ? (
    <Link to={`${editlink}/${id}`}>
      <button className="action-btns light-blue-bg" type="button">
        <img src={edit} alt="" /> Edit
      </button>
    </Link>
      )
    : null}
  {adminType === 'super' || adminType === 'center' || roles?.find(i => i.module_permissions.slug === slug)?.delete === '1'
    ? (
    <button className="action-btns light-red-bg" onClick={() => handleShow(id)} type="button">
      <img src={deletes} alt="" /> Delete
    </button>
      )
    : null}
</div>
}
ActiveButton.propTypes = {
  id: PropTypes.any,
  handleShow: PropTypes.func,
  slug: PropTypes.string,
  viewlink: PropTypes.string,
  editlink: PropTypes.string
}
export default ActiveButton
