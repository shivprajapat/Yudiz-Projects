/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteUniversity } from '../../Actions/Admin/university'

/* Action File */
import { deleteBoard } from '../../Actions/Admin/board'
import { deleteGrade } from '../../Actions/Admin/grade'
import { deleteSchool } from '../../Actions/Admin/school'
import { deleteCity } from '../../Actions/Admin/cities'
import { deleteState } from '../../Actions/Admin/states'
import { deletePackage } from '../../Actions/Admin/package'
import { deleteNorms } from '../../Actions/Admin/Norms/norms'
import {
  deleteTestCategoryAction,
  deleteTestSubCategoryAction
} from '../../Actions/Admin/test'
import { deleteTestTimeNorms } from '../../Actions/Admin/Norms/TestTimeNorms/TestTimeNorms'
import { deleteGradeNorms } from '../../Actions/Admin/Norms/GradeNorms/GradeNorms'
import { deleteTestNormsDescription } from '../../Actions/Admin/Norms/TestNormsDescription/TestNormsDescription'
import { deleteQuestion } from '../../Actions/Admin/Test/Question'
import { deleteQualification } from '../../Actions/Admin/qualification'
import { deleteSubAdmin } from '../../Actions/Admin/subAdmin'
import { deleteRole } from '../../Actions/Admin/role'
import { deleteStudent } from '../../Actions/Admin/student'
import { deleteStudentCen } from '../../Actions/Center/student'
import { deleteCenter } from '../../Actions/Admin/center'
import { deleteCouncellor } from '../../Actions/Admin/counsellor'
import ls from 'localstorage-slim'
import DropDown from './DropDown'
import { deleteSoftwareMetrics } from '../../Actions/Admin/softwareMetrix'
import { deleteCoupon } from '../../Actions/Admin/coupenCode'
// import localStorage from 'react-secure-storage'

function TitleHeader (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const roles = JSON.parse(localStorage.getItem('roles'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => {
    setShow(true)
  }
  const handleDelete = () => {
    setShow(false)
    props.setRowArray([])

    if (props.allRowSelect === true) {
      props.setPageNo(1)
    }

    if (props?.rowArray) {
      if (props?.location?.pathname === '/admin/grade-management') {
        dispatch(deleteGrade({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/university-management') {
        dispatch(deleteUniversity({ id: props.rowArray }, token))
      } else if (
        props?.location?.pathname === '/admin/qualification-management'
      ) {
        dispatch(deleteQualification({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/school-management') {
        dispatch(deleteSchool({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/software-matrix') {
        dispatch(deleteSoftwareMetrics({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/city-management') {
        dispatch(deleteCity({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/state-management') {
        dispatch(deleteState({ id: props.rowArray }, token))
      } else if (
        props?.location?.pathname === '/admin/test-management/main-category'
      ) {
        dispatch(deleteTestCategoryAction({ id: props.rowArray }, token))
      } else if (
        props?.location?.pathname === '/admin/test-management/sub-category'
      ) {
        dispatch(deleteTestSubCategoryAction({ id: props.rowArray }, token))
      } else if (props?.location?.pathname === '/admin/package-management') {
        dispatch(deletePackage({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/norms-management') {
        dispatch(deleteNorms({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/norms/test-time-norms') {
        dispatch(deleteTestTimeNorms({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/norms/gradenorms') {
        dispatch(deleteGradeNorms({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/norms/test-description-norms') {
        dispatch(deleteTestNormsDescription({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/board-management') {
        dispatch(deleteBoard({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/test-management/questions') {
        dispatch(deleteQuestion({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/sub-admin-management') {
        dispatch(deleteSubAdmin({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/role-management') {
        dispatch(deleteRole({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/students-management') {
        dispatch(deleteStudent({ id: props.rowArray }, token))
      } else if (location?.pathname === '/center/students-management') {
        dispatch(deleteStudentCen({ id: props.rowArray }, token))
      } else if (location?.pathname === '/admin/center-management') {
        dispatch(deleteCenter({ id: props.rowArray }, token))
      } else if (
        location?.pathname === `/${props?.adminType}/counsellor-management`
      ) {
        dispatch(
          deleteCouncellor({ id: props.rowArray }, token, props?.adminType)
        )
      } else if (location?.pathname === '/admin/coupon-codes') {
        dispatch(deleteCoupon({ id: props.rowArray }, token))
      }
    }
  }

  return (
    <>
      <div className='title-header'>
        <ul className='breadcrumbs'>
          <li className='breadcumbs-item'>
            <h3>{props?.title} </h3>
          </li>
          {/* <li><a href="#">{props?.name}</a></li> */}
        </ul>
        {props?.showbuttons && (
          <div className='button-box'>
            {adminType === 'super' ||
            adminType === 'center' ||
            roles?.find((i) => i.module_permissions.slug === props?.slug)
              ?.delete === '1'
              ? (
              <button
                className='theme-btn red-btn'
                onClick={handleShow}
                type='button'
                disabled={props?.rowArray?.length > 0 ? 0 : 1}
              >
                Delete Selected
              </button>
                )
              : null}
            {adminType === 'super' ||
            adminType === 'center' ||
            roles?.find((i) => i.module_permissions.slug === props?.slug)
              ?.create === '1'
              ? (
              <Link
                to={props?.location?.pathname + '/' + props?.url}
                className='theme-btn blue-btn'
              >
                Add New {props.name}
              </Link>
                )
              : null}
          </div>
        )}
        {location.pathname === '/center/purchase-license' && (
          <div>
          <button
              className='theme-btn me-3'
              onClick={() =>
                props?.navigate('/center/purchase-license/purchase-credit')
              }
            >
              Purchase Credit
            </button>
            <button
              className='theme-btn'
              onClick={() =>
                props?.navigate('/center/purchase-license/purchase-history')
              }
            >
              Purchase History
            </button>
          </div>

        )}
        {props?.dropdown && <DropDown />}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className='title-box has-subtitle'>
            <h2>Delete </h2>
            <h4>Are you sure to delete this?</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            onClick={handleDelete}
            className='theme-btn w-100 red-btn'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={handleClose}
            className='theme-btn w-100 gray-btn'
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

TitleHeader.propTypes = {
  name: PropTypes.string
}

export default TitleHeader
