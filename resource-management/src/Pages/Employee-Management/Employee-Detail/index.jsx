import React, { useState } from 'react'
import Wrapper from 'Components/wrapper'
import './_employeeDetails.scss'
import { ReactComponent as GradeIcon } from '../../../Assets/Icons/grade.svg'
import { ReactComponent as EmailIcon } from '../../../Assets/Icons/email.svg'
import { ReactComponent as MobileIcon } from '../../../Assets/Icons/mobile.svg'
import Resume from '../../../Assets/Icons/Resume'
import Delete from '../../../Assets/Icons/Delete'
import Edit from '../../../Assets/Icons/Edit'
import { ReactComponent as Share } from '../../../Assets/Icons/Share.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { getSpecificEmployee } from 'Query/Employee/employee.query'
import PageTitle from 'Components/Page-Title'
import Divider from 'Components/Divider'
import ActionButton from '../../../Components/ActionButton/index'
import { Loading } from 'Components'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { deleteEmployee } from 'Query/Employee/employee.mutation'
import { handleAlterImage, toaster } from 'helpers/helper'

export default function EmployeeDetail() {
  const { id } = useParams()

  const navigate = useNavigate()
  const [modal, setModal] = useState({ open: false })
  const [skills, setSkills] = useState([])

  const { data, isLoading } = useQuery(['specificEmp', id], () => getSpecificEmployee(id), {
    select: (data) => data?.data,
    staleTime: Infinity,
    onSuccess: (data) => {
      setSkills(data?.EmployeeDetail?.aSkills)
    },
    refetchInterval: (data) => {
      if (data?.EmployeeDetail) {
        setSkills(data?.EmployeeDetail?.aSkills)
      }
    },
  })

  const mutation = useMutation(deleteEmployee, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ open: false })
      navigate('/employee-management')
    },
  })

  if (isLoading) return <Loading />

  return (
    <>
      <Wrapper>
        <section className="emp_details_container">
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
            <div className="emp-grade">
              <div className="grade_icon">
                <GradeIcon />
              </div>
              <div className="grade_text">{data?.EmployeeDetail?.eGrade}</div>
            </div>
          </div>
          <div className="empDetails p-4 h-100 d-flex flex-column justify-content-between">
            <h4 className="employeeName fs-3 font-weight-bold">{data?.EmployeeDetail?.sName}</h4>
            <div className="fs-3 d-flex align-items-center">
              <div className="email d-flex align-items-center me-3 h-100">
                <EmailIcon className="me-2" />
                <a href={'mailto:' + data?.EmployeeDetail?.sEmail} className="fs-6 text-decoration-none ">
                  {data?.EmployeeDetail?.sEmail}
                </a>
              </div>
              <div className="number d-flex align-items-center me-3">
                <MobileIcon className="me-2" />
                <span className="fs-6">{data?.EmployeeDetail?.sMobNum}</span>
              </div>
              <div className="resume  d-flex align-items-center me-3">
                <Resume fill="#7189AC" />
                <a href="#" className="fs-6 ms-2 text-decoration-none">
                  Resume
                </a>
              </div>
            </div>
            <div>
              <Divider />
            </div>
            <div className="employeeTable fs-3">
              <table className="w-100">
                <thead>
                  <tr className="fs-6 tableHead">
                    <td>Job profile</td>
                    <td>Department</td>
                    <td>EMP ID</td>
                    <td>Currently working</td>
                    <td>Experience</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="fs-6">
                    <td>{data?.EmployeeDetail?.iJobProfileId?.sName}</td>
                    <td>{data?.EmployeeDetail?.iDepartmentId?.sName}</td>
                    <td>{data?.EmployeeDetail?.sEmpId}</td>
                    <td>{data?.EmployeeDetail?.eDevType === 'D' ? 'Dedicated' : 'Fixed'}</td>
                    <td>{data?.EmployeeDetail?.nExperience} Years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="employeeName fs-3 d-flex gap-4 mt-3">
              <ActionButton actionButtonText="Share" className="share" setIcon={<Share />} />
              <ActionButton
                actionButtonText="Edit"
                className="edit"
                onClick={() => navigate(`/employee-management/edit/${data?.EmployeeDetail?._id}`)}
                setIcon={<Edit fill="#27B98D" />}
              />
              <ActionButton
                actionButtonText="Delete"
                className="delete"
                onClick={() => setModal({ open: true })}
                setIcon={<Delete fill="#FF5658" />}
              />
            </div>
          </div>
        </section>
      </Wrapper>
      <Wrapper>
        <PageTitle title="Skills" />
        <section className="mt-5 emp_skill_container">
          {skills?.map((t, i) => {
            return (
              <div className="card skillCardContainer" key={i}>
                <div className="card-body d-flex flex-column justify-content-around" style={{ width: '237px', height: '126px' }}>
                  <h6 className="card-title" style={{}}>
                    {t.sName}
                  </h6>
                  <h6 className="card-text" style={{ textAlign: 'right' }}>
                    {t.eScore}/10
                  </h6>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar-${i + 1}`}
                      role="progressbar"
                      style={{ width: `${t.eScore * 10}%` }}
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      </Wrapper>
      <CustomModal open={modal.open} handleClose={() => setModal({ open: false })} title="are you sure?">
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-5">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}
