import React, { useEffect } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import { Form, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRoleSelect, getSpecificSubAdmin } from '../../../Actions/Admin/subAdmin'
import { useForm } from 'react-hook-form'

function ViewSubAdmin () {
  // Constant
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // useState

  // useEffect to get data by Id
  useEffect(() => {
    dispatch(getSpecificSubAdmin(id, token))
    dispatch(getAllRoleSelect(token))
  }, [])

  // useSelector
  const mainData = useSelector(state => state.subAdmin.resData)
  const roleListArray = useSelector(state => state.subAdmin.roleData)

  // useForm
  const { reset, register } = useForm()

  useEffect(() => {
    if (mainData && roleListArray?.length) {
      const roleV = roleListArray?.filter(r => r.id === mainData?.role_id)
      reset({
        role: roleV[0]?.title
      })
    }
  }, [mainData, roleListArray])

  return (
    <>
          <TitleHeader name="View" title="View Sub Admin" />
          {mainData?.id
            ? (
            <div className="main-layout whitebox-layout my-editprofile-page">
              <Form>
                <div className="heading-box">
                  <h5>View Sub-Admin</h5>
                  <div className="btn-box">
                    <button className="theme-btn dark-btn text-none" onClick={() => navigate('/admin/sub-admin-management')}>
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="profilebutton-box text-end"></div>
                <div className="light-bg-box">
                  <div className="row">
                    <div className="col-xxl-12 ">
                      <div className="row">
                        <div className="col-lg-12">
                          <h4>SubAdmin Details</h4>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" disabled value={mainData?.first_name} />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" value={mainData?.last_name} disabled />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group" controlId="formBasicmobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <div className="position-relative">
                              <Form.Control type="tel" value={mainData?.mobile} disabled />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group verified" controlId="formBasicEmail">
                            <Form.Label>Email ID</Form.Label>
                            <div className="position-relative">
                              <Form.Control type="text" disabled value={mainData?.email} />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="col-lg-12">
                          <Form.Group className="form-group common-select-style" controlId="role ">
                            <Form.Label> Role</Form.Label>
                            <Form.Control type="text" disabled {...register('role', { required: true })} />
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
              )
            : (
            <Spinner animation="border" />
              )}
    </>
  )
}

export default ViewSubAdmin
