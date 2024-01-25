import React, { useState } from 'react'

//component
import DoughnutChart from 'Components/Chart/DoughnutChart'
import ErrorBoundary from 'Components/ErrorBoundary'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Button from 'Components/Button'
import Select from 'Components/Select'

//query
import { updateProjectStatus } from 'Query/Project/project.mutation'
import { useMutation } from 'react-query'
import { queryClient } from 'queryClient'

//helper
import { formatDate, projectStatusColor, projectStatusColorCode, isGranted, permissionsName, toaster, handleErrors, projectStatus, projectStatusLabel } from 'helpers'
import { Controller, useForm } from 'react-hook-form'


import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_projectoverview.scss'

export default function ProjectOverviewChart({ data, gotoProjectDetails, addWorkLogModalOpen }) {

  const isViewProjectPermission = isGranted(permissionsName.VIEW_PROJECT)
  const isAddWorklogsPermission = isGranted(permissionsName.CREATE_WORKLOGS) && data?.isWorkLogAdd

  const { control, handleSubmit, setError, reset, setValue } = useForm()

  const [ProjectStatus, setProjectStatus] = useState()
  const [modal, setModal] = useState({ open: false })

  //update project status
  const updateProjectStatusMutation = useMutation(updateProjectStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('projectDashboard')
      toaster('Project Updated Successfully')
      setModal({ open: false })
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, setError),
        setModal({ open: false })
    }
  })

  function changeProjectStatus(id) {
    setModal({ open: true, id })
    const { associate } = projectStatus.find((status) => status?.value === data?.eProjectStatus)
    setProjectStatus(projectStatus.filter((s) => associate?.includes(s.index)))
    setValue('eProjectStatus', projectStatus.find((status) => status?.value === data?.eProjectStatus))
  }

  function handleModalClose() {
    setModal({ open: false })
    reset({})
  }

  function OnSubmit(e) {
    const { eProjectStatus } = e
    const data = {
      eProjectStatus: eProjectStatus?.label,
    }
    updateProjectStatusMutation.mutate({
      id: modal.id,
      data
    })
  }

  return (
    <div>
      <Wrapper className="m-0 mx-1 my-3">

        <Row>

          <Col xs={12}>
            <div
              className={'project-status-overview ' + projectStatusColor(data?.eProjectStatus)}
              style={{ background: projectStatusColorCode(data?.eProjectStatus) }}
              onClick={() => changeProjectStatus(data?._id)}
            >
              {data?.eProjectStatus}
            </div>

            <div>
              <h4 className="font-weight-bold pt-2 text-left">{data?.sName}</h4>
            </div>

            {
              isViewProjectPermission ? <span className="go-to-details" onClick={() => gotoProjectDetails(data._id)}>
                More details
              </span> : (<></>)
            }

            <Divider height="2px" backgroundColor="#00000020" className="pt-1 p-0" />
            <span className="light-blue50">{data?.eProjectType}</span>

            {
              data?.dStartDate || data?.dEndDate ? (
                <span style={{ fontSize: '12px', fontWepght: '500', lineHeight: '22px' }}>
                  {formatDate(data?.dStartDate)} TO {formatDate(data?.dEndDate)}
                </span>
              ) : (
                null
                // <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '22px' }}>-</span>
              )
            }
          </Col>

        </Row>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <ErrorBoundary>
            <div className="project-overview-chart position-relative">
              <DoughnutChart addWorkLogModalOpen={addWorkLogModalOpen} chartData={data} isAddWorklogsPermission={isAddWorklogsPermission} />
              {data.eProjectStatus === projectStatusLabel.pending && (
                <div className="position-absolute h-100 w-100 project-overview-placeholder">
                  <span> project hasn&apos;t been started yet</span>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </div>
        <div className="project-overview-details">
          <div className="button-tag">
            <span className="px-2" style={{ fontSize: '14px' }}>
              Technologies:{' '}
            </span>
            {!data?.projectTechnologies.length ? 'no data' : null}
            {data?.projectTechnologies?.map((tech, index) => (
              <span className="light-blue50 m-1" key={index}>
                {tech?.sName}
              </span>
            ))}
          </div>
        </div>
      </Wrapper>

      <CustomModal
        open={modal?.open}
        title={'Update Project Status'}
        handleClose={handleModalClose}
      >
        <h6 className='mb-4' >Project Name : <b style={{ textTransform: 'capitalize' }} >{data?.sName}</b></h6>
        <Controller
          name="eProjectStatus"
          control={control}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
            <Select
              onChange={onChange}
              value={value}
              ref={ref}
              labelText="Project status"
              placeholder="Select Project status"
              id="eProjectStatus"
              errorMessage={error?.message}
              options={ProjectStatus}
            />
          )}
        />

        <div className="mt-5 d-flex justify-content-end">
          <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button onClick={(handleSubmit(OnSubmit))} loading={false}>
            Save
          </Button>
        </div>

      </CustomModal>

    </div>
  )
}

ProjectOverviewChart.propTypes = {
  data: PropTypes.object,
  addWorkLogModalOpen: PropTypes.func,
  gotoProjectDetails: PropTypes.func,
}
