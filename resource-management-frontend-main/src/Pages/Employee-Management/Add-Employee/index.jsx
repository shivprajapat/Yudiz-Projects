import React, { Fragment, useEffect, useState } from 'react'

//component 
import PermissionList from 'Components/Offcanvas/PermissionList'
import CustomToolTip from 'Components/TooltipInfo'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Rating from 'Components/Rating'
import Button from 'Components/Button'
import Input from 'Components/Input'

//query
import { addEmployee, updateCurrencyEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { updateEmployeePermission } from 'Query/Project/project.mutation'
import { addDepartment } from 'Query/Department/department.mutation'
import { getSpecificEmployee } from 'Query/Employee/employee.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getAllCurrencies } from 'Query/Currency/currency.query'
import { permissionList } from 'Query/Employee/employee.query'
import { addJobProfile } from 'Query/Common/common.query'
import { addSkill } from 'Query/Skill/skill.mutation'

//icons
import userIcon from 'Assets/Icons/altImage.svg'
import cameraIcon from 'Assets/Icons/camara.svg'

//helper
import { addNewOption, floatingNumber, onlyInt, showAllProjectByDefault, toaster } from 'helpers'
import useResourceDetails from 'Hooks/useResourceDetails'
import { useForm, Controller } from 'react-hook-form'

import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import './_addEmployee.scss'


export default function AddEmployee() {
  const queryClient = useQueryClient()
  const { type, id } = useParams()
  const navigate = useNavigate()

  const { watch, control, handleSubmit, reset, setValue } = useForm()

  const currencyWiseCosting = watch('currencyWiseCosting')


  const [showOffcanvas, setShowOffcanvas] = useState({ client: false })
  const [roleWisePermissions, setRoleWisePermissions] = useState()
  const [totalPermissions, setTotalPermissions] = useState([])
  const [savedPermission, setSavedPermission] = useState({
    roles: [],
    permissions: [],
    roleWiseCheckedPermissions: [],
    checkedPermissions: [],
  })
  const [sLogo, setLogo] = useState()
  const [projectImage, setProjectImage] = useState(null)

  // get employee by ID
  const { isLoading } = useQuery(['editEmployee_' + id], () => getSpecificEmployee(id), {
    enabled: type === 'edit',
    select: (data) => data?.data?.EmployeeDetail,
    onSuccess: (data) => {
      const aTotalPermissions = data?.aTotalPermissions || []
      setTotalPermissions(aTotalPermissions)

      setSkillRatingArray(data?.aSkills?.map((item) => ({ sName: item?.sName, iSkillId: item?.iSkillId, eScore: item?.eScore })))
      reset({
        nPaid: data?.nPaid,
        currencyWiseCosting: data?.EmployeeCurrency?.map((c) => ({ ...c, _id: c.iCurrencyId, value: +c?.nCost.toFixed(2) })),
        sName: data?.sName,
        sEmpId: data?.sEmpId,
        sEmail: data?.sEmail,
        sMobNum: data?.sMobNum,
        nExperience: data?.nExperience,
        employeeDepartment: data?.iDepartmentId,
        employeeJobProfile: data?.iJobProfileId,
        employeeOrganizationBranch: data?.iBranchId,
        employeeGrade: data?.eGrade && { value: data?.eGrade, label: data?.eGrade },
        employeeAvailability: data?.eAvailabilityStatus && { value: data?.eAvailabilityStatus, label: data?.eAvailabilityStatus },
        nAvailabilityHours: data?.nAvailabilityHours,
        empSkill: data?.aSkills?.map((item) => ({ sName: item?.sName, _id: item?.iSkillId, eScore: item?.eScore })),
        eShowAllProjects: data?.eShowAllProjects && { value: data?.eShowAllProjects, label: data?.eShowAllProjects }
      })
      setProjectImage(data?.sProfilePic ? 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.sProfilePic : '')
    },
  })

  // get all currencies
  useQuery(['currencies', type], getAllCurrencies, {
    enabled: type !== 'edit',
    select: (data) => data?.data?.data?.currency,
    onSuccess: (data) => {
      setValue('currencyWiseCosting', data)
    },
  })

  // permission
  const { data: permissionData = [] } = useQuery(['permission'], () => permissionList({ limit: 500 }), {
    select: (data) => data.data.data.permissions,
  })

  const addDepartmentMutation = useMutation(addDepartment, {
    onSuccess: () => toaster('Department added successfully'),
  })
  const addJobprofileMutation = useMutation(addJobProfile, {
    onSuccess: () => toaster('Job profile added successfully'),
  })
  const addSkillMutation = useMutation(addSkill, {
    onSuccess: () => toaster('Job profile added successfully'),
  })



  //post employee 
  const mutation = useMutation((data) => addEmployee(data), {
    onSuccess: (data) => {
      const currencyData = {
        iEmployeeId: data.data.data._id,
        nPaid: +watch('nPaid') || 0,
        aCurrency: currencyWiseCosting?.map((c) => ({
          iCurrencyId: c._id,
          nCost:
            c?.value || Number(c?.nUSDCompare * watch('nPaid'))
              ? Number(c?.nUSDCompare * watch('nPaid')).toFixed(2)
              : c?.nUSDCompare * watch('nPaid'),
        })),
      }
      updateCurrencyMutation.mutate(currencyData, {
        onSuccess: () => {
          toaster('Employee Added Successfully')
          queryClient.invalidateQueries('employee')
          navigate('/employee-management')
        },
      })
    },
  })

  // update employee
  const updateMutation = useMutation(updateEmployee, {
    onSuccess: () => {
      toaster('Employee Updated Successfully')
      queryClient.invalidateQueries('employee')
      navigate('/employee-management')
    },
    onError: () => { },
  })

  // update permission 
  const updatePermissionMutation = useMutation((data) => updateEmployeePermission(data), {
    onSuccess: () => {
      toaster('Employee Permission Updated Successfully')
      handleCloseOffcanvas('client')
    },
  })

  // update currency 
  const updateCurrencyMutation = useMutation(updateCurrencyEmployee, {
    onSuccess: () => toaster('currency wise cost updated Successfully'),
  })



  function handleCloseOffcanvas(name) {
    setShowOffcanvas({ [name]: false })
  }

  function handleShowOffcanvas({ name, data }) {
    setShowOffcanvas({ [name]: true, data })
  }

  function handleImageChange(e) {
    setLogo(e.target.files[0])
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProjectImage(reader.result)
      }
    }
    reader?.readAsDataURL(e.target.files[0])
  }



  // useForm

  // Default Grade Data
  const Grade = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ]

  const AvailabilityStatus = [
    { label: 'Available', value: 'Available' },
    { label: 'Not Available', value: 'Not Available' },
    { label: 'Partially Available', value: 'Partially Available' },
  ]
  const ShowAllProjects = [
    { label: 'ALL', value: 'ALL' },
    { label: 'OWN', value: 'OWN' }
  ]

  // Skill Table Heading Row
  const [columns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Skill', connectionName: 'name', isSorting: false, sort: 0 },
    { name: 'Rating', connectionName: 'rating', isSorting: false, sort: 0 },
  ])
  const [currencyColumns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Name', connectionName: 'name', isSorting: false, sort: 0 },
    { name: 'Symbol', connectionName: 'sSymbol', isSorting: false, sort: 0 },
    { name: 'Price', connectionName: 'price', isSorting: false, sort: 0 },
  ])

  const {
    resourceDetail,
    handleScroll,
    handleSearch: handleSearchDetail,
    data: d,
    createNewOption,
  } = useResourceDetails(['department', 'jobprofile', 'skill', 'role', 'orgbranch'])

  const roleDetail = getDetail('role')
  const roleData = roleDetail?.data?.length ? roleDetail.data : []

  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  // Set Rating of perticular Skill
  const [skillRatingArray, setSkillRatingArray] = useState([])

  const setRatingCount = (data) => {
    const currentData = skillRatingArray?.filter((item) => item?.iSkillId === data.iSkillId)
    const otherData = skillRatingArray?.filter((item) => item?.iSkillId !== data.iSkillId)
    if (currentData?.length !== 0) {
      currentData[0] = data
      setSkillRatingArray([...otherData, ...currentData])
    } else {
      setSkillRatingArray([...skillRatingArray, data])
    }
  }

  function handleRemoveSkill(e, opt) {
    if (opt.action == 'remove-value') {
      const otherData = skillRatingArray?.filter((item) => item?.iSkillId !== opt.removedValue._id)
      setSkillRatingArray(otherData)
    } else if (opt.action == 'clear') {
      setSkillRatingArray([])
    }
  }

  // Form OnSubmit data
  const onSubmit = (data) => {
    const aPermissions =
      savedPermission?.permissions?.map((item) => {
        const permissionDetail = permissionData.find((i) => i._id === item)
        const selectedRoleIds = savedPermission?.roles?.map((i) => i._id) || []
        const filterRoles = roleData.filter((i) => i.aPermissions.includes(item) && selectedRoleIds.includes(i._id))
        return {
          sKey: permissionDetail?.sKey || '',
          aRoleId: filterRoles.map((i) => i._id),
        }
      }) || []

    const empData = {
      sName: data?.sName,
      sEmpId: data?.sEmpId,
      sEmail: data?.sEmail,
      sMobNum: data?.sMobNum,
      iDepartmentId: data?.employeeDepartment._id,
      iJobProfileId: data?.employeeJobProfile._id,
      iBranchId: data?.employeeOrganizationBranch._id,
      nExperience: data?.nExperience,
      nAvailabilityHours: data?.nAvailabilityHours,
      eGrade: data?.employeeGrade?.label,
      eAvailabilityStatus: data?.employeeAvailability?.label,
      aSkills: skillRatingArray,
      aRole: savedPermission?.roles?.map((i) => i._id) || [],
      imageData: sLogo || projectImage?.replace('https://jr-web-developer.s3.ap-south-1.amazonaws.com/', ''),
      sResumeLink: '',
      aPermissions: !id ? aPermissions : undefined,
      eShowAllProjects: data?.eShowAllProjects?.value

    }
    if (type === 'edit') {
      updateMutation.mutate({ id, empData })
    } else {
      mutation.mutate(empData)
    }
  }
  function setCurrenciesDataAuto(nPaid, currencyWiseCosting, auto = false) {
    const newData = currencyWiseCosting.map((c) => {
      if (!c.value || auto) {
        c.value = Number(c?.nUSDCompare * nPaid) ? Number(c?.nUSDCompare * nPaid).toFixed(2) : c?.nUSDCompare * nPaid
      }
      return c
    })
    setValue('currencyWiseCosting', newData)
  }

  const rules = {
    global: (value = 'This field is Required') => ({ required: value }),
    max: (value, message) => ({ ...rules.global(), max: { value, message } }),
    min: (value, message) => ({ ...rules.global(), min: { value, message } }),
  }

  function handleCurrencyValues(id, value) {
    setValue(
      'currencyWiseCosting',
      currencyWiseCosting.map((c) => (c._id === id ? { ...c, value: Number(value).toFixed(2) } : c))
    )
  }

  function handleCostingSave() {
    const currencyData = {
      iEmployeeId: id,
      nPaid: +watch('nPaid') || 0,
      aCurrency: currencyWiseCosting?.map((c) => ({ iCurrencyId: c._id, nCost: c.value })),
    }
    updateCurrencyMutation.mutate(currencyData)
  }

  useEffect(() => {
    if (roleData?.length && permissionData?.length && totalPermissions?.length) {
      const permissionIds = totalPermissions.map((i) => {
        const resultPermissionDetail = permissionData.find((p) => p.sKey === i.sKey)
        return resultPermissionDetail?._id || i
      })
      const resultExtraPermissionIdsArray = totalPermissions.filter((i) => !i?.aRoleId?.length)
      const resultExtraPermissionIds = resultExtraPermissionIdsArray.map((i) => {
        const resultPermissionDetail = permissionData.find((p) => p.sKey === i.sKey)
        return resultPermissionDetail?._id || i
      })
      const resultOtherThanExtraPermissionIds = permissionIds?.filter((i) => !resultExtraPermissionIds.includes(i))
      setSavedPermission({
        roles: [],
        permissions: permissionIds,
        roleWiseCheckedPermissions: resultOtherThanExtraPermissionIds,
        checkedPermissions: resultExtraPermissionIds,
      })

      const resultRoleIdsArray = totalPermissions.filter((i) => i?.aRoleId?.length).map((i) => i.aRoleId)
      const resultRoleIds = [].concat.apply([], resultRoleIdsArray)
      const resultUniqueRoleIds = resultRoleIds.filter((item, index) => resultRoleIds.indexOf(item) === index)
      const resultRoleDetail = roleData.filter((i) => resultUniqueRoleIds.includes(i._id))
      const resultUniqueRoleDetail = resultRoleDetail.filter((item, index) => resultRoleDetail.indexOf(item) === index)

      setSavedPermission((prev) => ({
        ...prev,
        roles: resultUniqueRoleDetail,
      }))

      const rolesObject = resultUniqueRoleDetail.reduce(
        (accumulator, value) => {
          return {
            ...accumulator,
            [value.sName]:
              value?.aPermissions?.length && permissionIds?.length ? value.aPermissions.filter((i) => permissionIds.includes(i)) : [],
          }
        },
        { 'Extra Permission': [] }
      )
      const rolesObjectValues = Object.values(rolesObject).map((i) => i)
      const flattenedArray = [].concat.apply([], rolesObjectValues)
      const extraPermissions = permissionIds.filter((i) => !flattenedArray.includes(i)) || []
      rolesObject['Extra Permission'] = extraPermissions
      Object.keys(rolesObject).forEach((key) => {
        if (!rolesObject[key]?.length) {
          delete rolesObject[key]
        }
      })
      setRoleWisePermissions(rolesObject)
    }
  }, [roleData, permissionData, totalPermissions])

  useEffect(() => {
    if (roleData?.length && permissionData?.length && !id) {
      const defaultRoles = roleData.filter((i) => i.bIsDefault)
      const aDefaultPermissionsArray = defaultRoles.map((i) => i.aPermissions)
      const resultPermissionIds = [].concat.apply([], aDefaultPermissionsArray)
      const resultPermissionUniqueIds = resultPermissionIds.filter((item, index) => resultPermissionIds.indexOf(item) === index)
      setSavedPermission({
        roles: defaultRoles,
        permissions: resultPermissionUniqueIds,
        roleWiseCheckedPermissions: resultPermissionUniqueIds,
        checkedPermissions: [],
      })

      const rolesObject = defaultRoles.reduce(
        (accumulator, value) => {
          return {
            ...accumulator,
            [value.sName]:
              value?.aPermissions?.length && resultPermissionUniqueIds?.length
                ? value.aPermissions.filter((i) => resultPermissionUniqueIds.includes(i))
                : [],
          }
        },
        { 'Extra Permission': [] }
      )
      const rolesObjectValues = Object.values(rolesObject).map((i) => i)
      const flattenedArray = [].concat.apply([], rolesObjectValues)
      const extraPermissions = resultPermissionUniqueIds.filter((i) => !flattenedArray.includes(i)) || []
      rolesObject['Extra Permission'] = extraPermissions
      Object.keys(rolesObject).forEach((key) => {
        if (!rolesObject[key]?.length) {
          delete rolesObject[key]
        }
      })
      setRoleWisePermissions(rolesObject)
    }
  }, [roleData, permissionData])

  return (
    <>
      <Wrapper isLoading={mutation?.isLoading || updateMutation?.isLoading || isLoading}>
        <section>
          <PageTitle
            title="Employee Details"
            cancelText="Cancel"
            BtnText="Save"
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/employee-management')}
          />
          <div>
            <form className="align-left">
              <div className="row mt-2">
                <div className="col-md-12 ">
                  <div className="user-profile">
                    <div className="profile">
                      <div className="profile-img">
                        <img src={projectImage || userIcon} alt="user" className="img-fluid" />
                      </div>
                    </div>
                    <div className="icon" style={{ cursor: 'pointer !important' }}>
                      <img style={{ cursor: 'pointer !important' }} src={cameraIcon} alt="camara" className="camera-icon" />
                      <input type="file" id="file" value={[]} onChange={handleImageChange} accept=".png, .jpg, .jpeg" />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="sName"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => {
                          var regex = new RegExp('^[a-zA-Z0-9 ]+$')
                          if (e.target.value && !regex.test(e.target.value)) {
                            e.preventDefault()
                            return false
                          } else {
                            onChange(e.target.value)
                          }
                        }}
                        value={value}
                        ref={ref}
                        labelText={'Employee Name*'}
                        placeholder={'Enter Employee Name'}
                        id={'sName'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="sEmpId"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        labelText={'Employee ID*'}
                        placeholder={'Enter Employee ID'}
                        id={'sEmpId'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2 ">
                  <Controller
                    name="sEmail"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        disabled={type}
                        labelText={'Email ID*'}
                        placeholder={'Enter Email ID'}
                        id={'sEmail'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="sMobNum"
                    control={control}
                    rules={rules.max('9999999999', 'Maximum length of number is 10')}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value}
                        ref={ref}
                        labelText={'Contact Number*'}
                        placeholder={'Enter Contact Number'}
                        id={'sMobNum'}
                        maxLength={10}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="employeeJobProfile"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        ref={ref}
                        placeholder="Select Job Profile"
                        labelText="Job Profile*"
                        id="employeeJobProfile"
                        value={value}
                        onChange={(target) => {
                          onChange(target)
                          const level = showAllProjectByDefault(target?.nLevel)
                          setValue('eShowAllProjects', { value: level, label: level })
                        }}
                        getOptionLabel={(option) => (option?.sPrefix ? option.sPrefix + ' ' + option.sName : option.sName)}
                        getOptionValue={(option) => option._id}
                        errorMessage={error?.message}
                        options={getDetail('jobprofile')?.data}
                        isLoading={getDetail('jobprofile')?.isLoading || addJobprofileMutation.isLoading}
                        fetchMoreData={() => handleScroll('jobprofile')}
                        onInputChange={(s) => handleSearchDetail('jobprofile', s)}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="employeeDepartment"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Department*"
                        placeholder={'Select Department'}
                        id="employeeDepartment"
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        errorMessage={error?.message}
                        options={getDetail('department')?.data}
                        isLoading={getDetail('department')?.isLoading || addDepartmentMutation.isLoading}
                        fetchMoreData={() => handleScroll('department')}
                        onInputChange={(s) => handleSearchDetail('department', s)}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="employeeOrganizationBranch"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        ref={ref}
                        placeholder="Select Organization Branch"
                        labelText="Organization Branch*"
                        id="employeeOrganizationBranch"
                        value={value}
                        onChange={onChange}
                        getOptionLabel={(option) => (option?.sPrefix ? option.sPrefix + ' ' + option.sName : option.sName)}
                        getOptionValue={(option) => option._id}
                        CreateOptionLabel="sName"
                        CreateOptionValue="_id"
                        errorMessage={error?.message}
                        options={getDetail('orgbranch')?.data}
                        isLoading={getDetail('orgbranch')?.isLoading || addJobprofileMutation.isLoading}
                        fetchMoreData={() => handleScroll('orgbranch')}
                        onInputChange={(s) => handleSearchDetail('orgbranch', s)}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="nExperience"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value}
                        ref={ref}
                        labelText={'Experience in Years*'}
                        placeholder={'Enter Years of Experience'}
                        id={'nExperience'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="nAvailabilityHours"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value}
                        ref={ref}
                        labelText={'Availability hours'}
                        placeholder={'Enter Availability hours'}
                        id={'nAvailabilityHours'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="employeeAvailability"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        ref={ref}
                        placeholder="Select Availability"
                        labelText="Availability"
                        id="employeeAvailability"
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        options={AvailabilityStatus}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="employeeGrade"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        placeholder="Select Skill Grade"
                        ref={ref}
                        labelText="Skill Grade"
                        id="employeeGrade"
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        options={Grade}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="eShowAllProjects"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        ref={ref}
                        placeholder="Select Option"
                        labelText="Show All Projects*"
                        id="eShowAllProjects"
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        options={ShowAllProjects}
                        defaultValue={ShowAllProjects[1]}
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </Wrapper>
      <Wrapper isLoading={mutation.isLoading || updateMutation.isLoading || isLoading}>
        <Row>
          <Col xs={9}>
            <PageTitle title="Roles and Permissions" />
          </Col>
          <Col xs={3} className="d-flex justify-content-end">
            <Button onClick={() => handleShowOffcanvas({ name: 'client', data: {} })}>Add Permission</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="permissions-wrap">
              <Row>
                {roleWisePermissions && Object.keys(roleWisePermissions)?.length ? (
                  Object.keys(roleWisePermissions).map((item, index) => {
                    return (
                      <Fragment key={index}>
                        <Col xs={12} className="mt-2 mt-lg-0">
                          <h5 className="page-title">{item} :</h5>
                          <ul className="list-items">
                            {roleWisePermissions[item].map((itemDetail, indexDetail) => {
                              const permissionDetail = permissionData.find((i) => i._id === itemDetail)
                              return <li key={indexDetail}>{permissionDetail?.sName || itemDetail}</li>
                            })}
                          </ul>
                        </Col>
                      </Fragment>
                    )
                  })
                ) : (
                  <div>Currently Not Assigned Any Permission</div>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Wrapper>
      <Wrapper isLoading={mutation.isLoading || updateMutation.isLoading || isLoading}>
        <PageTitle title="Skill Score" />
        <Row className="mt-5 ms-5">
          <Col xs={10}>
            <Controller
              name="empSkill"
              control={control}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  ref={ref}
                  closeMenuOnSelect={false}
                  isMulti
                  labelText="Skills"
                  placeholder="Select Skills"
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  value={value}
                  onCreateOption={(input) =>
                    addNewOption({ value: input, module: 'skill', createNewOption }, addSkillMutation, (opt) =>
                      onChange([...(value?.length ? value : []), opt])
                    )
                  }
                  CreateOptionLabel="sName"
                  CreateOptionValue="_id"
                  onChange={(e, opt) => {
                    handleRemoveSkill(e, opt)
                    onChange(e)
                  }}
                  errorMessage={error?.message}
                  options={getDetail('skill')?.data}
                  isLoading={getDetail('skill')?.isLoading || addSkillMutation.isLoading}
                  fetchMoreData={() => handleScroll('skill')}
                  onInputChange={(s) => handleSearchDetail('skill', s)}
                />
              )}
            />
            <div className="mt-3">
              <DataTable disableActions align="left" columns={columns} totalData={watch('empSkill')?.length} isLoading={false}>
                {watch('empSkill')?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.sName}</td>
                      <td>
                        <Rating sTitle={item?.sName} sId={item?._id} ratingCount={item?.eScore} setFunction={setRatingCount} />
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            </div>
          </Col>
        </Row>
      </Wrapper>
      <Wrapper isLoading={mutation.isLoading || updateMutation.isLoading || isLoading}>
        <PageTitle title="Currency Wise Costing" BtnText={type === 'edit' ? 'save costing' : ''} handleButtonEvent={handleCostingSave} />
        <Row className="mt-5 ms-5">
          <Col xs={4}>
            <Controller
              name="nPaid"
              control={control}
              rules={rules.global()}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={(e) => {
                    onChange(e.target.value.replace(floatingNumber, ''))
                    // setCurrenciesDataAuto(e.target.value.replace(floatingNumber, ''), currencyWiseCosting)
                  }}
                  value={value}
                  ref={ref}
                  labelText="Base cost Per hour (in USD)*"
                  placeholder="Enter cost"
                  id={'nPaid'}
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col xs={2}>
            <div style={{ marginTop: '27px' }}>
              <CustomToolTip tooltipContent="By clicking Auto all the currency cost will be set according to base cost">
                <Button onClick={() => setCurrenciesDataAuto(watch('nPaid'), currencyWiseCosting, true)}>Convert</Button>
              </CustomToolTip>
            </div>
          </Col>
        </Row>
        <Row className="mt-1 ms-5">
          <Col xs={10}>
            <div className="mt-3">
              <DataTable disableActions align="left" columns={currencyColumns} totalData={currencyWiseCosting?.length} isLoading={isLoading}>
                {currencyWiseCosting?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.sName}</td>
                      <td>{item?.sSymbol}</td>
                      <td className="d-flex align-items-center justify-content-between">
                        <Input
                          inputContainerClass="mb-0"
                          value={item?.value || 0}
                          onChange={(e) => handleCurrencyValues(item._id, e.target.value.replace(floatingNumber, ''))}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            </div>
            <PermissionList
              show={showOffcanvas.client}
              isLoading={updatePermissionMutation.isLoading}
              handleClose={(data) => {
                if (data?.isSavedData) {
                  if (id) {
                    const aPermissions = data?.permissions?.map((item) => {
                      const permissionDetail = permissionData.find((i) => i._id === item)
                      const selectedRoleIds = data?.roles?.map((i) => i._id) || []
                      const filterRoles = roleData.filter((i) => i.aPermissions.includes(item) && selectedRoleIds.includes(i._id))
                      return {
                        sKey: permissionDetail?.sKey || '',
                        aRoleId: filterRoles.map((i) => i._id),
                      }
                    })
                    updatePermissionMutation.mutate({
                      iEmployeeId: id,
                      aPermissions,
                    })
                  }

                  {
                    !id ?
                      toaster('Employee Permission added Successfully')
                      : null
                  }
                  {
                    !id ?
                      handleCloseOffcanvas('client')
                      : null
                  }

                  setSavedPermission({
                    roles: data?.roles || [],
                    permissions: data?.permissions || [],
                    roleWiseCheckedPermissions: data?.roleWiseCheckedPermissions || [],
                    checkedPermissions: data?.checkedPermissions || [],
                  })
                  if (data?.roles?.length || data?.permissions?.length) {
                    const rolesObject = data?.roles.reduce(
                      (accumulator, value) => {
                        return {
                          ...accumulator,
                          [value.sName]:
                            value?.aPermissions?.length && data?.permissions?.length
                              ? value.aPermissions.filter((i) => data.permissions.includes(i))
                              : [],
                        }
                      },
                      { 'Extra Permission': [] }
                    )
                    const rolesObjectValues = Object.values(rolesObject).map((i) => i)
                    const flattenedArray = [].concat.apply([], rolesObjectValues)
                    const extraPermissions = data?.permissions.filter((i) => !flattenedArray.includes(i)) || []
                    rolesObject['Extra Permission'] = extraPermissions
                    Object.keys(rolesObject).forEach((key) => {
                      if (!rolesObject[key]?.length) {
                        delete rolesObject[key]
                      }
                    })
                    setRoleWisePermissions(rolesObject)
                  } else {
                    setRoleWisePermissions()
                  }
                }
                else {
                  handleCloseOffcanvas('client')
                }
              }}
              rules={rules}
              roleData={roleData}
              roleDetail={roleDetail}
              permissionData={permissionData}
              savedPermission={savedPermission}
            />
          </Col>
        </Row>
      </Wrapper>
    </>
  )
}
