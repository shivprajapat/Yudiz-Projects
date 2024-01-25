import React from 'react'

//component
import ActionButton from 'Components/ActionButton'
import Wrapper from 'Components/wrapper'

//icons
import { ReactComponent as MobileIcon } from 'Assets/Icons/mobile.svg'
import { ReactComponent as GradeIcon } from 'Assets/Icons/grade.svg'
import { ReactComponent as EmailIcon } from 'Assets/Icons/email.svg'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'

//helper
import { handleAlterImage, isGranted } from 'helpers'

import { useNavigate } from 'react-router-dom'
import './_employeeDetailResponsive.scss'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

function EmployeeDetailsResponsive({ data, permissionsName, setModal }) {
    const navigate = useNavigate()

    return (
        <>
            <Wrapper className="emp-details-responsive">

                <div className="emp_image_container">
                    <div className="">
                        <img
                            className="emp-avatar"
                            src={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.EmployeeDetail?.sProfilePic}
                            onError={handleAlterImage}
                        />
                    </div>
                    <div className="spiral spiral_1" />
                    <div className="spiral spiral_2" />
                    <div className="spiral spiral_3" />

                    {
                        data?.EmployeeDetail?.eGrade ?
                            <div className="emp-grade">
                                <div className="grade_icon">
                                    <GradeIcon />
                                </div>
                                <div className="grade_text">{data?.EmployeeDetail?.eGrade}</div>
                            </div>
                            : null
                    }

                </div>

                <div className='emp_person_details'>

                    <h4 className="employeeName fs-4 font-weight-bold">{data?.EmployeeDetail?.sName}</h4>

                    <div className="email d-flex align-items-center mt-3">
                        <EmailIcon className="me-1" width={13} height={13} />
                        <a href={'mailto:' + data?.EmployeeDetail?.sEmail} className="empEmail">
                            {data?.EmployeeDetail?.sEmail}
                        </a>
                    </div>

                    <div className="number d-flex align-items-center mt-3">
                        <MobileIcon className="me-1" width={12} height={12} />
                        <span className="empMobile">{data?.EmployeeDetail?.sMobNum}</span>
                    </div>

                    <div className='d-flex justify-content-between mt-3'>
                        {
                            isGranted(permissionsName.UPDATE_EMPLOYEE) &&
                            <ActionButton
                                actionButtonText="Edit"
                                className="edit"
                                onClick={() => navigate(`/employee-management/edit/${data?.EmployeeDetail?._id}`)}
                                setIcon={<Edit fill="#27B98D" />}
                            />
                        }
                        {
                            isGranted(permissionsName.DELETE_EMPLOYEE) &&
                            <ActionButton
                                actionButtonText="Delete"
                                className="delete"
                                onClick={() => setModal({ open: true })}
                                setIcon={<Delete fill="#FF5658" />}
                            />
                        }
                    </div>

                </div>

            </Wrapper>

            <Wrapper>

                <Row className='d-flex flex-wrap'>

                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Job profile</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.iJobProfileId?.sName}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Department</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.iDepartmentId?.sName}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Experience</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.nExperience}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>employee ID</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.sEmpId}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Currently working</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.eDevType}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Organization Branch</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.iBranchId?.sName}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Availability Status</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.eAvailabilityStatus || '—'}</Col>
                    </Col>
                    <Col className='d-flex flex-column mt-4' xs={6} sm={4} md={3} lg={3}>
                        <Col className='emp_person_details_thead'>Availability Hours</Col>
                        <Col className='emp_person_details_tbody'>{data?.EmployeeDetail?.nAvailabilityHours || '—'}</Col>
                    </Col>

                </Row>

            </Wrapper>
        </>
    )
}



EmployeeDetailsResponsive.propTypes = {
    data: PropTypes.object,
    permissionsName: PropTypes.any,
    setModal: PropTypes.func
}


export default EmployeeDetailsResponsive