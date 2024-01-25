import React, { useContext, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, Button, Input, Modal, ModalBody } from 'reactstrap'
// import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteAccountReasons, deleteAccount } from '../../../api/auth'
import { UserContext } from '../../../redux/userContext'

function DeleteAccount (props) {
  const { dispatch } = useContext(UserContext)

  const [reason, setReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')

  const { data: deleteAccountReasonsList } = useQuery({
    queryKey: ['AccDeleteReasons'],
    queryFn: deleteAccountReasons,
    select: response => response?.data?.data,
    retry: false
  })

  const { mutate: DeleteAccountMutation } = useMutation({
    mutationKey: ['DeleteAccount'],
    mutationFn: deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('Token')
      dispatch({ type: 'USER_TOKEN', payload: '' })
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message)
      setModalMessage(true)
    }
  })

  function handleSubmit (e) {
    e.preventDefault()
    const deleteReason = (reason === 'Other') ? otherReason.trim() !== '' : reason
    if (deleteReason) {
      setModalOpen(true)
    } else {
      setModalMessage(true)
      setMessage(<FormattedMessage id='Please_enter_reason' />)
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }

  return (
    <>
      {modalMessage && message ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert> : ''}
      <div className='deposit-o'>
        <ul className="delete-links hide-hover payment-o">
          <p className='title'><FormattedMessage id='Please_select_a_reason_for_deleting_account' /></p>
          {deleteAccountReasonsList?.aReason?.map((data, index) => (
            <li key={index} className="d-flex align-items-center">
              <Input
                autoComplete='off'
                checked={reason === data}
                hidden
                id={`reason-${data}`}
                name="reason"
                onChange={() => setReason(data)}
                type="radio"
                value={data}
              />
              <label htmlFor={`reason-${data}`}>{data}</label>
            </li>
          )
          )}
          <li className="d-flex align-items-center">
            <Input
              autoComplete='off'
              checked={reason === 'Other'}
              hidden
              id='reason-other'
              name="reason"
              onChange={() => setReason('Other')}
              type="radio"
              value='Other'
            />
            <label htmlFor="reason-other"><FormattedMessage id='Other' /></label>
          </li>
        </ul>
        {reason === 'Other' && (
        <Input
          className='other-reason-class'
          name='otherReason'
          onChange={(e) => setOtherReason(e.target.value)}
          placeholder='Write Reason'
          type='textarea'
          value={otherReason}
        />
        )}

        <Modal className='cancel-withdraw-modal' isOpen={modalOpen}>
          <ModalBody className='cancel-withdraw-modal-body d-flex flex-column justify-content-center align-items-center'>
            <div className="first">
              <h2><FormattedMessage id='Confirmation' /></h2>
              <p><FormattedMessage id='Once_you_delete_the_account' /></p>
              <div className='container'>
                <div className='row'>
                  <div className='col dlt-div border-left-0 border-bottom-0'>
                    <button className='dlt-btn' onClick={() => DeleteAccountMutation((reason === 'Other') ? otherReason : reason)}><FormattedMessage id='Confirm' /></button>
                  </div>
                  <div className='col dlt-div border-right-0 border-bottom-0'>
                    <button className='cncl-btn' onClick={() => setModalOpen(false)}><FormattedMessage id='Cancel' /></button>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <div className="btn-bottom p-0 text-center">
          <Button className="w-100" color="primary-two" disabled={!reason && !otherReason} onClick={handleSubmit} type="submit"><FormattedMessage id="Delete" /></Button>
        </div>
      </div>
    </>
  )
}

DeleteAccount.propTypes = {
}

export default DeleteAccount
