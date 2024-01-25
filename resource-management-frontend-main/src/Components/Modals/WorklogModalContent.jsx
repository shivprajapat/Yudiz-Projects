import React, { memo, useEffect, useState } from 'react'
// component
import Input from 'Components/Input'
import Select from 'Components/Select'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'

// query
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addWorklog, updateWorklog } from 'Query/Worklog/worklog.mutation'
import { getWorklog } from 'Query/Worklog/worklog.query'

// helper
import { calculateMinutesBetweenTwoDates, convertMinutesToTime, onlyInt, toaster } from 'helpers'

// hook
import useResourceDetails from 'Hooks/useResourceDetails'
import { Controller, useForm } from 'react-hook-form'

import { BsPlus, BsCheck2 } from 'react-icons/bs'
import { Col, Form, Row } from 'react-bootstrap'
import '../../Pages/Worklog/_worklog.scss'
import PropTypes from 'prop-types'
import TextArea from 'Components/TextArea'
import DateTimePicker from 'Components/DateTimePicker'
import dayjs from 'dayjs'
import { Box } from '@mui/material'

function WorklogModalContent({ modal, handleAddModalClose }) {
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, watch, setValue, clearErrors } = useForm()

  const currentNMinutes = watch('nMinutes')

  const [selectedWorkLog, setSelectedWorkLog] = useState([])
  // const [crs, setCrs] = useState([])

  const {
    resourceDetail,
    handleScroll,
    handleSearch: handleSearchDetail,
    data: d,
  } = useResourceDetails(['projectOfUserLoggedIn', 'worklogTags'])

  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  useEffect(() => {
    setValue('nMinutes', calculateMinutesBetweenTwoDates(watch('dTaskStartTime'), watch('dTaskEndTime')) || 0)
  }, [watch('dTaskStartTime'), watch('dTaskEndTime')])

  useEffect(() => {
    if (typeof currentNMinutes === 'number' && currentNMinutes > 0) {
      clearErrors('nMinutes')
    }
  }, [currentNMinutes])

  var tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
  var defaultValue = new Date(Date.now() - tzoffset).toISOString().substring(0, 16)

  useEffect(() => {
    if (!modal?.viewOnly) {
      setValue('dTaskStartTime', defaultValue)
    }
  }, [])

  useEffect(() => setValue('iProjectId', modal.defaultProject), [modal.defaultProject])

  // post workLog
  const addMutation = useMutation(addWorklog, {
    onSuccess: () => {
      queryClient.invalidateQueries('worklogs')
      queryClient.invalidateQueries('projectDashboard')
      handleAddModalClose()
      reset({
        dTaskStartTime: defaultValue,
        dTaskEndTime: '',
        nMinutes: '',
        sTaskDetails: '',
        iProjectId: null,
        iCrId: null,
        bIsNonBillable: false,
      })
      setSelectedWorkLog([])
      toaster('Work Log added successfully')
    },
  })

  const updateMutation = useMutation(updateWorklog, {
    onSuccess: () => {
      queryClient.invalidateQueries('worklogs')
      queryClient.invalidateQueries('projectDashboard')
      handleAddModalClose()
      reset({
        dTaskStartTime: defaultValue,
        dTaskEndTime: '',
        nMinutes: '',
        sTaskDetails: '',
        iProjectId: null,
        iCrId: null,
        bIsNonBillable: false,
      })
      setSelectedWorkLog([])
      toaster('Work Log updated successfully')
    },
    onError: () => {
      handleAddModalClose()
      reset({
        dTaskStartTime: defaultValue,
        dTaskEndTime: '',
        nMinutes: '',
        sTaskDetails: '',
        iProjectId: null,
        iCrId: null,
        bIsNonBillable: false,
      })
      setSelectedWorkLog([])
    }
  })

  function onSubmit(e) {
    const { iProjectId, iCrId, dTaskStartTime, dTaskEndTime, nMinutes, sTaskDetails, bIsNonBillable } = e
    const data = {
      nMinutes,
      dTaskStartTime,
      dTaskEndTime,
      aTaskTag: selectedWorkLog.map((tag) => ({ sName: tag.sName, iTaskTag: tag._id })),
      iProjectId: iProjectId._id,
      iCrId: iCrId?._id || null,
      sTaskDetails,
      bIsNonBillable: bIsNonBillable || false,
    }
    if (selectedWorkLog.length > 0) {
      if (modal?.editOpen) {
        updateMutation.mutate({ ...data, id: modal.id })
      } else {
        addMutation.mutate(data)
      }
    } else {
      toaster('Please Select at least one Work Tag ', 'error')
    }
  }

  // get workLog by ID
  const { isLoading } = useQuery(['getWorklogDetail', watch('iProjectId')?._id], () => getWorklog(modal.id), {
    enabled: !!modal.id && !modal.deleteOpen,
    onSuccess: (data) => {
      const log = data.data.data.worklog
      reset({
        dTaskStartTime: log?.dTaskStartTime.substring(0, 16),
        dTaskEndTime: log?.dTaskEndTime.substring(0, 16),
        nMinutes: log?.nMinutes,
        sTaskDetails: log.sTaskDetails,
        iProjectId: log?.iProjectId ? { _id: log.iProjectId, sName: log.sProjectName } : null,
        iCrId: log?.cr ? { _id: log.cr._id, sName: log.cr.sName } : null,
        bIsNonBillable: log.bIsNonBillable || false,
      })
      setSelectedWorkLog(log?.aTaskTag.map((tag) => ({ _id: tag.iTaskTag, sName: tag.sName })))
    },
  })

  // get CR  (temporary Comment )

  // const { isLoading: isLoadingCrs } = useQuery(
  //   ['crsByProject', watch('iProjectId')?._id],
  //   () => getWorklogCr(watch('iProjectId')?._id, { limit: 50 }),
  //   {
  //     enabled: !!watch('iProjectId')?._id && !modal.viewOnly,
  //     onSuccess: (data) => {
  //       const { project } = data.data.data
  //       project.length && setCrs(project)
  //     },
  //   }
  // )

  function selectWorkList(data) {
    const isSelected = selectedWorkLog.some((selectedItem) => selectedItem.sName === data.sName)

    if (isSelected) {
      setSelectedWorkLog(selectedWorkLog.filter((selectedItem) => selectedItem.sName !== data.sName))
    } else {
      setSelectedWorkLog([...selectedWorkLog, data])
    }
  }

  return (
    <CustomModal
      isLoading={isLoading}
      open={modal.addOpen || modal.editOpen}
      handleClose={() => {
        handleAddModalClose()
        reset({
          dTaskStartTime: defaultValue,
          dTaskEndTime: '',
          nMinutes: '',
          sTaskDetails: '',
          iProjectId: null,
          iCrId: null,
          bIsNonBillable: false,
        })
        setSelectedWorkLog([])
      }}
      size="xl"
      //   handleClose={() => setModal({ addOpen: false, mode: modal.id && !modal.viewOnly ? 'edit' : '' })}
      title={modal.id ? (modal.viewOnly ? 'View work Log' : 'Edit Work Log') : 'Add Work Log'}
    >
      <Row>
        <Col>
          <Controller
            name="iProjectId"
            control={control}
            rules={{ required: 'Project field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                isDisabled={modal.viewOnly || modal?.defaultProject?._id || modal?.editOpen}
                onChange={(e) => {
                  setValue('iCrId', null)
                  onChange(e)
                }}
                value={value}
                ref={ref}
                labelText="Project"
                placeholder="Select Project"
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                errorMessage={error?.message}
                isLoading={getDetail('projectOfUserLoggedIn')?.isLoading}
                options={getDetail('projectOfUserLoggedIn')?.data || []}
                fetchMoreData={() => handleScroll('projectOfUserLoggedIn')}
                onInputChange={(s) => handleSearchDetail('projectOfUserLoggedIn', s)}
              />
            )}
          />
        </Col>
        <Col>
          <Controller
            name="dTaskStartTime"
            control={control}
            rules={{ required: 'Start Date is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <Box
                sx={{
                  '& .MuiStack-root': {
                    padding: '0',
                    overflow: 'hidden',
                  },
                  '& .MuiOutlinedInput-root': {
                    outline: 'none',
                    borderRadius: '8px',
                    paddingLeft: '19px',
                    height: '40px',
                    color: '#151516 !important',
                    border: `1px solid ${error?.message ? '#e64c3b' : '#dfe4ec'}`,
                    '& input': {
                      padding: '0',
                    },
                    '& fieldset': {
                      display: 'none',
                    },
                  },
                }}
              >
                <DateTimePicker
                  disabled={modal.viewOnly}
                  format="YYYY-MM-DD, hh:mm A"
                  onChange={(v) => {
                    onChange(v?.valueOf() ? new Date(v?.valueOf() - tzoffset).toISOString().substring(0, 16) : undefined)
                  }}
                  value={value ? dayjs(value) : undefined}
                  ref={ref}
                  errorMessage={error?.message}
                  title="Start Date"
                />
              </Box>
            )}
          />
        </Col>

        <Col>
          <Controller
            name="dTaskEndTime"
            control={control}
            rules={{ required: 'End Date is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Box
                sx={{
                  '& .MuiStack-root': {
                    padding: '0',
                    overflow: 'hidden',
                  },
                  '& .MuiOutlinedInput-root': {
                    outline: 'none',
                    borderRadius: '8px',
                    paddingLeft: '19px',
                    height: '40px',
                    color: '#151516 !important',
                    border: `1px solid ${error?.message ? '#e64c3b' : '#dfe4ec'}`,
                    '& input': {
                      padding: '0',
                    },
                    '& fieldset': {
                      display: 'none',
                    },
                  },
                }}
              >
                <DateTimePicker
                  disabled={modal.viewOnly}
                  format="YYYY-MM-DD, hh:mm A"
                  onChange={(v) => {
                    onChange(v?.valueOf() ? new Date(v?.valueOf() - tzoffset).toISOString().substring(0, 16) : undefined)
                  }}
                  value={value ? dayjs(value) : undefined}
                  ref={ref}
                  errorMessage={error?.message}
                  title="End Date"
                />
              </Box>
            )}
          />
        </Col>

        {/* <Col>
          <Controller
            name="iCrId"
            control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                isDisabled={modal.viewOnly}
                onChange={onChange}
                value={value}
                ref={ref}
                labelText="CR"
                placeholder="Select CR"
                options={crs}
                isLoading={isLoadingCrs}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                errorMessage={error?.message}
              />
            )}
          />
        </Col> */}
      </Row>

      <Row className="mt-4">
        <Col>
          <Form>
            <Form.Group>
              <Controller
                name="sTaskDetails"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <TextArea
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    placeholder="Enter Description"
                    className="p-2 text-dark"
                    disabled={modal.viewOnly}
                    style={{ height: '92px' }}
                    label="Add Description"
                  />
                )}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <Row>
            <Controller
              name="nMinutes"
              control={control}
              rules={{ required: 'Work Time is required', min: { value: 1, message: 'must be greater than 0' } }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  labelText="Work time (in minute)"
                  ref={ref}
                  placeholder="Add work time"
                  onChange={(e) => onChange(+e.target.value.replace(onlyInt, ''))}
                  endIcon={<div>{convertMinutesToTime(value)}</div>}
                  value={value}
                  errorMessage={error?.message}
                  disabled
                />
              )}
            />
          </Row>
          <Row>
            <div className="d-flex justify-content-start align-items-center h-100">
              <Controller
                name="bIsNonBillable"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Check
                    type="checkbox"
                    id="bIsNonBillable"
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value}
                    ref={ref}
                    disabled={modal.viewOnly}
                    label="Exclude From Billing"
                  />
                )}
              />
            </div>
          </Row>
        </Col>
      </Row>

      <div className="mt-4" style={{ display: 'flex' }}>
        <div>
          <p className="worklog_p">Tag : </p>
        </div>

        <div>
          <ul className="worklogTag">
            {modal?.viewOnly
              ? selectedWorkLog?.map((item, index) => {
                return (
                  <li className="workList-Check" key={index}>
                    {item.sName} <BsCheck2 />
                  </li>
                )
              })
              : getDetail('worklogTags')?.data?.map((item, index) => {
                return (
                  <li
                    className={selectedWorkLog.some((selectedItem) => selectedItem.sName === item.sName) ? 'workList-Check' : 'workList'}
                    key={index}
                    onClick={() => {
                      !modal.viewOnly && selectWorkList(item)
                    }}
                  >
                    {item.sName} {selectedWorkLog.some((selectedItem) => selectedItem.sName === item.sName) ? <BsCheck2 /> : <BsPlus />}
                  </li>
                )
              })}
          </ul>
        </div>
      </div>

      {!modal?.viewOnly && (
        <div className="d-flex align-items-center justify-content-between mt-1">
          <div></div>
          <Button onClick={handleSubmit(onSubmit)}>{modal?.editOpen ? 'Update' : 'Add'}</Button>
        </div>
      )}
    </CustomModal>
  )
}
WorklogModalContent.propTypes = {
  modal: PropTypes.object,
  handleAddModalClose: PropTypes.func,
}

export default memo(WorklogModalContent)
