import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Controller } from 'react-hook-form'

// query
import { addDesignation, updateDesignation } from 'Query/Designation/designation.mutation'
import { useMutation } from 'react-query'

// component
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import Input from 'Components/Input'

// helper
import { handleErrors, rules, toaster } from 'helpers'
import { queryClient } from 'queryClient'

function AddDesignation({ modal, handleClose, control, handleSubmit, setError, designationByIdData }) {

    // post designation
    const addMutateDesignation = useMutation(addDesignation, {
        onSuccess: (data) => {
            handleClose()
            toaster(data?.data?.message)
            queryClient.invalidateQueries('designation')
        },
        onError: (error) => {
            handleErrors(error.response.data.errors, setError)
        }
    })

    // update designation
    const updateMutateDesignation = useMutation(updateDesignation, {
        onSuccess: (data) => {
            handleClose()
            toaster(data?.data?.message)
            queryClient.invalidateQueries('designation')
        },
        onError: (error) => {
            handleErrors(error.response.data.errors, setError)
        }
    })

    function onSubmit(data) {
        if (modal?.id) {
            updateMutateDesignation.mutate({
                id: modal?.id,
                data
            })
        }
        else {
            addMutateDesignation.mutate(data)
        }
    }
    
    return (
        <>
            <CustomModal
                open={modal?.addOpen}
                title={'Add Designation'}
                handleClose={handleClose}
                modalBodyClassName="p-0 py-2"
                isLoading={addMutateDesignation?.isLoading || updateMutateDesignation?.isLoading || designationByIdData}
            >
                <Row>
                    <Col>
                        <Controller
                            name='sTitle'
                            control={control}
                            rules={rules?.global('Title')}
                            render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                <Input
                                    labelText={'Title'}
                                    ref={ref}
                                    isImportant
                                    value={value}
                                    onChange={onChange}
                                    placeholder={'Enter designation'}
                                    errorMessage={error?.message}
                                />
                            )}
                        />
                    </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        onClick={handleClose}
                        className="bg-secondary bg-lighten-xl me-2 text-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </Button>
                </div>

            </CustomModal>
        </>
    )
}

export default AddDesignation

AddDesignation.propTypes = {
    modal: PropTypes.object,
    control: PropTypes.object,
    setError: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    designationByIdData: PropTypes.object
}