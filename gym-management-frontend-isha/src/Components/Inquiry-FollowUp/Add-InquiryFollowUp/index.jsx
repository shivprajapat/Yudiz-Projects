import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Controller } from 'react-hook-form'

// component
import CalendarInput from 'Components/Calendar-Input'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import Select from 'Components/Select'
import Input from 'Components/Input'

// Icons
import Information from 'Assets/Icons/infoIcon'

import './_inquiryFollowUp.scss'


function AddInquiryFollowUp({ addEditModal, handleAddEditClose, control, options, handleSubmit, onSubmit }) {
  return (
    <>
      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={addEditModal.open}
        handleClose={() => handleAddEditClose(addEditModal)}
        size='lg'
        title={addEditModal.action === 'add' ? 'Add Inquiry FollowUp' : addEditModal.action === 'edit' && 'Edit Inquiry FollowUp'}
      >
        <div className="d-flex flex-column">

          <div>

            <Row>
              <Col lg={12} md={12} xs={12}>
                <Controller
                  name={`sResponse`}
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText={'Response'}
                      isImportant
                      placeholder="Enter Response"
                      id="sResponse"
                      errorMessage={error?.message}
                      // disabled={action === 'view'}
                      type='text'
                    />
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={6} md={6} xs={12}>
                <Controller
                  name="iFollowupBy"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <>
                      <Select
                        labelText={'FollowUp By'}
                        isImportant
                        id="iFollowupBy"
                        placeholder="Select FollowUp By"
                        onChange={onChange}
                        value={value}
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        // isDisabled={action === 'view'}
                        errorMessage={error?.message}
                        options={options}
                      />
                    </>
                  )}
                />
              </Col>
              <Col lg={6} md={6} xs={12} className="mt-md-0 mt-2">
                <Controller
                  name="dFollowupAt"
                  control={control}
                  rules={{ required: 'FollowUp At Date is required' }}
                  render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                    <CalendarInput
                      id="dFollowupAt"
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      errorMessage={error?.message}
                      // disabled={action === 'view'}
                      title={'FollowedUp At'}
                      isImportant
                    />
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={6} md={6} xs={12}>
                <Controller
                  name="nFollowupInDay"
                  control={control}
                  rules={{
                    max: {
                      value: 90,
                      message: 'Followup Day(s) must be within 3 months.'
                    }
                  }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <>
                      <Input
                        ref={ref}
                        onChange={onChange}
                        value={value}
                        labelText="FollowUp Day(s)"
                        placeholder="eg.: 5"
                        id="nFollowupInDay"
                        errorMessage={error?.message}
                        // disabled={action === 'view'}
                        type='number'
                        info={<Information />}
                        tooltipContent={'Number of days after which you would like to schedule a follow-up.'}
                      />
                    </>
                  )}
                />
              </Col>
              <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
              </Col>
            </Row>

          </div>

          <div className="d-flex justify-content-end mt-4">

            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => handleAddEditClose(addEditModal)}>
              Cancel
            </Button>

            <Button type='submit' onClick={handleSubmit(onSubmit)} className={addEditModal?.action === 'edit' && 'bg-warning'}>
              {addEditModal?.action === 'edit' ? 'Update' : 'Save'}
            </Button>

          </div>

        </div>

      </CustomModal>
    </>
  )
}

export default AddInquiryFollowUp

AddInquiryFollowUp.propTypes = {
  addEditModal: PropTypes.object,
  handleAddEditClose: PropTypes.func,
  control: PropTypes.object,
  options: PropTypes.array,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
}
