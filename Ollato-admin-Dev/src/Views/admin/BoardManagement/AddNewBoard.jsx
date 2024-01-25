import React, { useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
/* react packages */
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'
/* components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* action file */
import { addBoardAction } from '../../../Actions/Admin/board'
/* validation schema */
const validationSchema = yup.object().shape({
  boardName: yup
    .string()
    .required('Board Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})
function AddNewBoard () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useSelector
  const isBoardDataAdded = useSelector((state) => state.board.isBoardAdded)
  const isBoardAddedMessage = useSelector((state) => state.board.resMessage)

  // previousProps
  const previousProps = useRef({
    isBoardDataAdded,
    isBoardAddedMessage
  }).current

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
    const boardData = {
      title: data.boardName
    }
    if (boardData) {
      dispatch(addBoardAction(boardData, token))
    }
    reset()
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isBoardDataAdded !== isBoardDataAdded) {
      if (isBoardDataAdded) {
        enqueueSnackbar(`${isBoardAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/board-management')
      } else if (isBoardDataAdded === false) {
        enqueueSnackbar(`${isBoardAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isBoardDataAdded = isBoardDataAdded
    }
  }, [isBoardDataAdded])
  return (
    <>
          <Header />
          <TitleHeader name='Add New Board' title='Board Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add Board</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  onClick={handleSubmit(onSubmit)}
                  className='theme-btn text-none'
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

export default AddNewBoard
