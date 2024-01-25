import React from 'react'
import PropTypes from 'prop-types'
import CustomModal from 'Components/Modal'
import { Row, Col } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import Input from 'Components/Input'
import CalendarInput from 'Components/Calendar-Input'
import DescriptionInput from 'Components/DescriptionInput'
import Button from 'Components/Button'

function AddInquiryVisit({ addEditModal, handleAddEditClose, control, handleSubmit, onSubmit }) {
  return (
    <>
      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={addEditModal.open}
        handleClose={() => handleAddEditClose(addEditModal)}
        size='lg'
        title={addEditModal.action === 'add' ? 'Add Inquiry Visit' : addEditModal.action === 'edit' && 'Edit Inquiry Visit'}
      >
        <div className="d-flex flex-column">
          <div>
            <Row>
              <Col lg={6} md={6} sm={6} xs={12}>
                <Controller
                  name='sPurpose'
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        labelText={'Purpose'}
                        placeholder="Enter Purpose"
                        isImportant
                        id="sPurpose"
                        errorMessage={error?.message}
                        // disabled={addEditModal.action === 'view'}
                        type='text'
                      />
                    </>
                  )}
                />
              </Col>
              <Col lg={6} md={6} sm={6} xs={12}>
                <Controller
                  name="dVisitedAt"
                  control={control}
                  rules={{ required: 'Visit Date is required' }}
                  render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                    <CalendarInput
                      id="dVisitedAt"
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      errorMessage={error?.message}
                      // disabled={addEditModal.action === 'view'}
                      title={'Visited Date'}
                      isImportant
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} xs={12}>
                <Controller
                  name="sDescription"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <DescriptionInput
                        className="p-2 text-dark"
                        label={'Description'}
                        isImportant
                        errorMessage={error?.message}
                        // disabled={action === 'view'}
                        placeholder="Enter Description"
                        {...field}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => handleAddEditClose(addEditModal)}>
              Cancel
            </Button>
            <Button type='submit' onClick={handleSubmit(onSubmit)} className={addEditModal.action === 'edit' && 'bg-warning'}>
              {addEditModal.action === 'edit' ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default AddInquiryVisit

AddInquiryVisit.propTypes = {
  addEditModal: PropTypes.object,
  handleAddEditClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  control: PropTypes.object
}
