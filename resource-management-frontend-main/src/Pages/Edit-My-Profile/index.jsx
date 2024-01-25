import React, { useState } from 'react'
import { useMutation, useQueries, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { departmentList, jobProfileList } from 'Query/Employee/employee.query'
import { updateMyProfile } from 'Query/My-Profile/myprofile.mutation'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Input from 'Components/Input'
import Select from 'Components/Select'
import { ReactComponent as Close } from 'Assets/Icons/Close.svg'
import Edit from 'Assets/Icons/Edit'
import { toaster } from 'helpers'
import './_myProfile.scss'

export default function EditMyProfile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [userData, setUserData] = useState([])
  const [jobprofile, setJobProfile] = useState([])
  const [department, setDepartment] = useState([])
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  useQueries([
    {
      queryKey: 'myProfile',
      queryFn: () => queryClient.getQueryData('myProfile'),
      onSuccess: (data) => {
        setUserData(data?.data?.data[0])
        reset({
          employeeName: data?.data?.data[0]?.sName,
          employeeEmailId: data?.data?.data[0]?.sEmail,
          employeeContactNumber: data?.data?.data[0]?.sMobNum,
          employeeDepartment: { sName: data?.data?.data[0]?.sDepartment?.sName, _id: data?.data?.data[0]?.sDepartment?._id },
          employeeJobProfile: { sName: data?.data?.data[0]?.sJobProfile?.sName, _id: data?.data?.data[0]?.sJobProfile?._id },
        })
      },
      refetchOnMount: false,
    },
    {
      queryKey: 'jobprofile',
      queryFn: jobProfileList,
      onSuccess: (data) => {
        setJobProfile(data?.data?.data?.jobProfiles)
      },
      refetchOnMount: false,
    },
    { queryKey: 'empDepartment', queryFn: departmentList, onSuccess: (data) => setDepartment(data?.data?.data?.departments) },
  ])

  const updateMutation = useMutation((data) => updateMyProfile(data), {
    onSuccess: () => {
      toaster('Employee Updated Successfully')
      navigate('/my-profile')
    },
  })

  const onSubmit = (data) => {
    const myData = {
      sMobNum: data.employeeContactNumber,
      sName: data.employeeName,
      // sProfilePic : ,
      sEmail: data.employeeEmailId,
      sEmpId: userData?.sEmpId,
      iJobProfileId: data.employeeJobProfile._id,
      iDepartmentId: data.employeeDepartment._id,
    }

    if (myData) {
      updateMutation.mutate(myData)
    }
  }
  return (
    <Wrapper>
      <PageTitle
        title="Employee Details"
        cancelText="Cancel"
        BtnText="Save"
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate('/my-profile')}
      />
      <Divider className="mt-4 mb-4" />
      <section>
        <div className="row ms-3">
          <div className="mb-5">
            <div className="myProfile_pic d-flex justify-content-even">
              <img src={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + userData?.sProfilePic} />
            </div>
            <div className="edit-employee-prifile-image-action">
              <div className="d-flex justify-content-center align-items-center edit_profile_close">
                <Close />
              </div>
              <div className="d-flex justify-content-center align-items-center edit_profile_edit">
                <Edit fill="#B2BFD2" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Controller
              name="employeeName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Employee Name'}
                  placeholder={'Enter Employee Name'}
                  id={'employeeName'}
                  errorMessage={errors.employeeName?.message}
                />
              )}
            />
          </div>
          <div className="col-md-4 offset-md-1">
            <Controller
              name="employeeContactNumber"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Contact Number'}
                  placeholder={'Enter Contact Number'}
                  id={'employeeContactNumber'}
                  errorMessage={errors.employeeContactNumber?.message}
                />
              )}
            />
          </div>
          <div className="col-md-4">
            <Controller
              name="employeeEmailId"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Email ID'}
                  placeholder={'Enter Email ID'}
                  id={'employeeEmailId'}
                  errorMessage={errors.employeeEmailId?.message}
                />
              )}
            />
          </div>
          <div className="col-md-4 offset-md-1">
            <Controller
              name="employeeJobProfile"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelText="Job Profile"
                  placeholder={'Select department'}
                  id="employeeJobProfile"
                  value={!!field?.value === false ? null : { sName: field?.value?.sName || '', _id: field?.value?._id || '' }}
                  onChange={(e) => {
                    field.onChange({ sName: e?.sName, _id: e?._id })
                  }}
                  getOptionLabel={(option) => option.sName}
                  getOptionValue={(option) => option._id}
                  errorMessage={errors.employeeJobProfile?.sName?.message}
                  options={department}
                />
              )}
            />
          </div>
          <div className="col-md-4">
            <Controller
              name="employeeDepartment"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelText="Department"
                  placeholder={'Select department'}
                  id="employeeDepartment"
                  value={!!field?.value === false ? null : { sName: field?.value?.sName || '', _id: field?.value?._id || '' }}
                  onChange={(e) => {
                    field.onChange({ sName: e?.sName, _id: e?._id })
                  }}
                  getOptionLabel={(option) => option.sName}
                  getOptionValue={(option) => option._id}
                  errorMessage={errors.employeeDepartment?.sName?.message}
                  options={jobprofile}
                />
              )}
            />
          </div>
        </div>
      </section>
    </Wrapper>
  )
}
