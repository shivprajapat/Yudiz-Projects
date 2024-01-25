import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'

// Actions
import { getAllIssueCatgoriesAction, supportAction } from '../../../Actions/Counsellor/dashboard'

const validationSchema = yup.object().shape({
  issues: yup
    .object()
    .shape({
      label: yup.string().required('Category is required'),
      value: yup.string().required('Category is required')
    })
    .nullable()
    .required('Category is required'),
  query: yup.string().required('Query Description is required')

})

const Support = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [issuesArray, setIssuesArray] = useState([])

  // useSelector
  const isQueryReportedFlag = useSelector(state => state.dashboard.isQueryReported)
  const resMessageFlag = useSelector(state => state.dashboard.resMessage)

  // useForm
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { name, onChange } = register()
  const token = localStorage.getItem('token')

  // useSelector
  const issueCategoryArray = useSelector(
    (state) => state.dashboard.getIssueCategory
  )

  const previousProps = useRef({
    issueCategoryArray,
    isQueryReportedFlag
  }).current

  useEffect(() => {
    if (token) {
      dispatch(getAllIssueCatgoriesAction(token))
    }
  }, [token])

  /* for country */
  useEffect(() => {
    if (previousProps?.issueCategoryArray !== issueCategoryArray) {
      const array = []
      if (issueCategoryArray) {
        // eslint-disable-next-line array-callback-return
        issueCategoryArray.map((data) => {
          array.push({
            value: data.id,
            label: data.title
          })
        })
        setIssuesArray(array)
      }
    }
    return () => {
      previousProps.issueCategoryArray = issueCategoryArray
    }
  }, [issueCategoryArray])

  // onSubmit
  const onSubmit = (data) => {
    const dataObject = {
      issue_category_id: Number(data?.issues?.value),
      query_desc: data?.query
    }
    if (dataObject) {
      dispatch(supportAction(dataObject, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isQueryReportedFlag !== isQueryReportedFlag) {
      if (isQueryReportedFlag === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        reset()
      } else if (isQueryReportedFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isQueryReportedFlag = isQueryReportedFlag
    }
  }, [isQueryReportedFlag])
  return (
    <>
      <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
        <div className="change-pass-btn">
        <button className='theme-btn text-none' type='submit'>
          Save
        </button>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-xl-6 col-lg-8 col-md-10'>
                <Form.Group
                  className='form-group common-select-style'
                  controlId='formfullname'
                >
                  <Form.Label>Sub Category</Form.Label>
                  {/* <Select
                        isSearchable={false}
                        Value={selectedSubTest}
                        onChange={setSelectedSubTest}
                        options={subtest}
                        placeholder={'Select the issue category'}
                        /> */}
                  <Controller
                    name='issues'
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          isClearable
                          isSearchable={true}
                          placeholder={'Select Category'}
                          className='react-dropdown'
                          classNamePrefix='dropdown'
                          options={issuesArray}
                        />
                      )
                    }}
                  />
                  <p className='error-msg'>
                    {errors.issues?.message || errors.issues?.label.message}
                  </p>
                </Form.Group>
              </div>
            </div>
            {/* inner row ends here */}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Form.Group className='form-group ' controlId='reason'>
              <Form.Label>Query Description</Form.Label>
              <Form.Control
                as='textarea'
                className='big-textarea'
                placeholder='Enter Query Description'
                name={name}
                onChange={(e) => {
                  onChange(e)
                }}
                {...register('query', { required: true })}
              />
               {errors.query?.message && (
                    <Form.Text className='error-msg'>
                      {errors.query?.message}{' '}
                    </Form.Text>
               )}
            </Form.Group>
          </div>
        </div>
      </Form>
    </>
  )
}

export default Support
