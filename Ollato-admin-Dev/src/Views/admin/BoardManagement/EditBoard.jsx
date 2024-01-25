import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
/* React Packages */
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* Action File */
import {
  getSpecificBoardData,
  editSpecificBoard
} from '../../../Actions/Admin/board'

const validationSchema = yup.object().shape({
  boardName: yup
    .string()
    .required('Board is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})
function EditBoard () {
  // Constant
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const id = params.id
  const token = localStorage.getItem('token')
  const handleclick = () => {
    navigate(-1)
  }

  // useSelector
  const specificBoardData = useSelector(
    (state) => state.board.specificBoardData
  )
  const editedResMessage = useSelector((state) => state.board.resMessage)
  const isEditedData = useSelector((state) => state.board.isBoardEdited)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useEffect to get Data by id
  useEffect(() => {
    if (id) {
      dispatch(getSpecificBoardData(Number(id), token))
    }
  }, [id])

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const boarddata = {
      id: Number(id),
      title: data.boardName
    }
    if (boarddata) {
      dispatch(editSpecificBoard(boarddata, token))
    }
    reset()
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/board-management')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])
  return (
    <>
          <Header />
          <TitleHeader name='Edit Board' title='Board Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit Board</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={handleclick}
                >
                  Cancel
                </button>
                <button
                  className='theme-btn text-none'
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Group
                      className={`form-group ${
                        errors.boardName?.message ? 'error-occured' : ''
                      }`}
                      controlId='formboardfullname'
                    >
                      <Form.Label>Board Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Board Name'
                        name={name}
                        Value={
                          (specificBoardData && specificBoardData?.title) || ''
                        }
                        {...register('boardName', { required: true })}
                      />
                      {errors.boardName?.message && (
                        <Form.Text className='error-msg'>
                          {errors.boardName?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default EditBoard
