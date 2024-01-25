import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificSchoolData, editSpecificSchool } from '../../../Actions/Admin/school'
import { getAllBoardsAction } from '../../../Actions/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import { validationSchemaSchool } from '../../../Shared/Utills/validationschema'

function EditSchool () {
  const { enqueueSnackbar } = useSnackbar()
  const { control, register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm({
    resolver: yupResolver(validationSchemaSchool)
  })
  const { onChange, name } = register()

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const id = params.id
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (id) {
      dispatch(getSpecificSchoolData(Number(id)
        , token))
    }
  }, [id])

  // custom hook
  const { setCountryid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  useEffect(() => {
    dispatch(getAllBoardsAction())
  }, [])

  const specificSchoolData = useSelector(state => state.school.specificSchoolData)
  const boardData = useSelector(state => state.auth.boardsData)
  const isSchoolDataEdited = useSelector(state => state.school.isSchoolEdited)
  const isSchoolEditedMessage = useSelector(state => state.school.resMessage)
  const previousProps = useRef({ specificSchoolData, statesArray, districtArray, isSchoolDataEdited, isSchoolEditedMessage }).current
  // const previousProps = useRef({ specificSchoolData }).current
  useEffect(() => {
    if (previousProps?.isSchoolDataEdited !== isSchoolDataEdited) {
      if (isSchoolDataEdited) {
        enqueueSnackbar(`${isSchoolEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/school-management')
        reset()
      } else if (isSchoolDataEdited === false) {
        enqueueSnackbar(`${isSchoolEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isSchoolDataEdited = isSchoolDataEdited
    }
  }, [isSchoolDataEdited])

  const handleclick = () => {
    navigate('/admin/school-management')
  }
  useEffect(() => {
    if (specificSchoolData) {
      setCountryid(specificSchoolData?.countries?.id)
      setStateid(specificSchoolData?.states?.id)
      reset({
        country: {
          id: specificSchoolData?.countries?.id,
          title: specificSchoolData?.countries?.title
        },
        district: {
          id: specificSchoolData?.city?.id,
          title: specificSchoolData?.city?.title
        },
        state: {
          id: specificSchoolData?.states?.id,
          title: specificSchoolData?.states?.title
        },
        board: boardData?.find(
          (b) => b.id === specificSchoolData?.board_id
        )
      })
    }
  }, [specificSchoolData])

  const onSubmit = data => {
    const schoolData = {
      id: Number(id),
      title: data.schoolName,
      abbreviation: data.schoolAbb,
      address_1: data.address1,
      address_2: data.address2,
      county_id: Number(data.country.id),
      state_id: Number(data.state.id),
      city_id: Number(data.district.id),
      board_id: Number(data.board.id),
      pin_code: data.pincode
    }
    if (schoolData) {
      dispatch(editSpecificSchool(schoolData, token))
    }
  }
  return (
    <>
              <Header />
              <TitleHeader name='Edit School' title="School"/>
              <div className='main-layout'>
               <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
               <div className="heading-box">
                      <h5>Edit School</h5>
                      <div className="btn-box">
                        <button className='theme-btn dark-btn text-none' onClick={handleclick}>Cancel</button>
                        <button type='submit' className='theme-btn text-none'>Save</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">

                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formschoolfullname">
                                <Form.Label>School Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Full Name"
                                  name={name}
                                  {...register('schoolName', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                  Value={ specificSchoolData?.title ? specificSchoolData?.title : ' ' }
                                />
                                {
                                  errors?.schoolName?.message && <p className="error-msg">{errors?.schoolName?.message || errors?.schoolName.message}</p>
                                }
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                            <Form.Group className="form-group" controlId="formschoolabbreviation">
                                <Form.Label>School Abbreviation</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Abbreviation"
                                  name={name}
                                  {...register('schoolAbb', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                  Value={ specificSchoolData?.abbreviation ? specificSchoolData?.abbreviation : '' }
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>Country</Form.Label>
                                <Controller
                                name='country'
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <Select
                                    {...field}
                                    placeholder={'Select Country'}
                                    className='react-dropdown'
                                    classNamePrefix='dropdown'
                                    options={countriesArray}
                                    getOptionLabel={(option) =>
                                      option?.title
                                    }
                                    getOptionValue={(option) =>
                                      option?.id
                                    }
                                    onChange={(e) => {
                                      field.onChange(e)
                                      setCountryid(e.id)
                                    }}
                                  />
                                  )
                                }}
                              />
                                <p className='error-msg'>
                        {errors.country?.message ||
                          errors.country?.label.message}
                      </p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>State</Form.Label>
                                <Controller
                                  name='state'
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                        placeholder={'Select State'}
                                        className='react-dropdown'
                                        classNamePrefix='dropdown'
                                        options={statesArray}
                                        getOptionLabel={(option) => option?.title}
                                        getOptionValue={(option) => option?.id}
                                        value={field.value || getValues().state}
                                        onChange={(e) => {
                                          field.onChange(e)
                                          setStateid(e.id)
                                          setValue('district', '')
                                        }}
                                      />
                                  )}
                                />
                              <p className='error-msg'>
                                {errors.state?.message || errors.state?.label.message}
                              </p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>District</Form.Label>
                                <Controller
                        name='district'
                        control={control}
                        render={({ field }) => {
                          return (
                            <Select
                            {...field}
                            placeholder={'Select District'}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            options={districtArray}
                            getOptionLabel={(option) =>
                              option?.title
                            }
                            getOptionValue={(option) =>
                              option?.id
                            }
                          />
                          )
                        }}
                      />
                                <p className='error-msg'>
                        {errors.district?.message ||
                          errors.district?.label.message}
                      </p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>Board</Form.Label>
                                <Controller
                        name='board'
                        control={control}
                        render={({ field }) => (
                          <Select
                          {...field}
                          isClearable
                          isSearchable={false}
                          placeholder={'Select Board'}
                          className='react-dropdown'
                          classNamePrefix='dropdown'
                          options={boardData}
                          getOptionLabel={(option) => option?.title}
                          getOptionValue={(option) => option?.id}
                        />
                        )}
                      />
                      <p className='error-msg'>
                        {errors.board?.message || errors.board?.label.message}
                      </p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                            <Form.Group className="form-group" controlId="formaddressline1">
                                <Form.Label>Address Line 1</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Address Line 1"
                                  name={name}
                                  {...register('address1', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                  Value={ specificSchoolData?.address_1 ? specificSchoolData?.address_1 : '' }
                                />
                                {
                                  errors?.address1?.message && <p className="error-msg">{errors?.address1?.message || errors?.address1.message}</p>
                                }
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                            <Form.Group className="form-group" controlId="formaddressline2">
                                <Form.Label>Address Line 2</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Address Line 2"
                                  name={name}
                                  {...register('address2', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                  Value={ specificSchoolData?.address_2 }
                                />
                                {
                                  errors?.address2?.message && <p className="error-msg">{errors?.address2?.message || errors?.address2.message}</p>
                                }
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formpincode">
                                <Form.Label>PIN Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter PIN Code"
                                  name={name}
                                  {...register('pincode', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                  Value={ specificSchoolData?.pin_code }
                                />
                                {
                                  errors?.pincode?.message && <p className="error-msg">{errors?.pincode?.message || errors?.pincode.message}</p>
                                }
                              </Form.Group>
                            </div>
                          </div>
                    </div>
               </Form>
              </div>
    </>
  )
}

export default EditSchool
