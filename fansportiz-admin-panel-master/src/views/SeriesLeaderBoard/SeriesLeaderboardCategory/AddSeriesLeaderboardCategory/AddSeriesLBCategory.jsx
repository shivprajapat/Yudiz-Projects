import React, { useState, useEffect, useRef } from 'react'
import {
  Button, FormGroup, Label, Input, UncontrolledAlert, InputGroupText, Form, CustomInput
} from 'reactstrap'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { alertClass, isFloat, isNumber, isPositive, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import { getSeriesLeaderBoardDetails } from '../../../../actions/seriesLeaderBoard'

function AddSeriesLBCategory (props) {
  const {
    AddNewLBCategory, cancelLink, getLBCategoryIdList, match, UpdateLBCategory
  } = props
  const [loading, setLoading] = useState(false)
  const [seriesLBCategory, setSeriesLBCategory] = useState('')
  const [name, setName] = useState('')
  const [errName, setErrName] = useState('')
  const [prize, setPrize] = useState('')
  const [rank, setRank] = useState('')
  const [TotalPayout, setTotalPayout] = useState('')
  const [content, setContent] = useState('')
  const [errContent, setErrContent] = useState('')
  const [errPrize, setErrPrize] = useState('')
  const [errRank, setErrRank] = useState('')
  const [errTotalPayout, setErrTotalPayout] = useState('')
  const [categoryList, setcategoryList] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()

  const token = useSelector(state => state.auth.token)
  const seriesLeaderBoardCategoryDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardCategoryDetails)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const categoryTemplateIDList = useSelector(state => state.seriesLeaderBoard.categoryTemplateIDList)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)
  const previousProps = useRef({
    resStatus, resMessage, categoryTemplateIDList, seriesLeaderBoardCategoryDetails, seriesLeaderBoardDetails
  }).current
  const updateDisable = seriesLeaderBoardCategoryDetails && previousProps.seriesLeaderBoardCategoryDetails !== seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sFirstPrize === prize && seriesLeaderBoardCategoryDetails.nMaxRank === parseInt(rank) && seriesLeaderBoardCategoryDetails.nTotalPayout === parseInt(TotalPayout) && seriesLeaderBoardCategoryDetails.sContent === content
  const page = JSON.parse(localStorage.getItem('queryParams'))

  useEffect(() => {
    if (match.params.id && match.params.id2) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    match.params.id && dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
    getLBCategoryIdList()
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (isCreate) {
      if (categoryList && categoryList.length !== 0) {
        setSeriesLBCategory(categoryList[0]._id)
      }
    }
    return () => {
      previousProps.categoryList = categoryList
    }
  }, [categoryList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push(`${cancelLink}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.categoryTemplateIDList !== categoryTemplateIDList) {
      if (categoryTemplateIDList && categoryTemplateIDList.length !== 0) {
        setcategoryList(categoryTemplateIDList)
        setLoading(false)
      }
    }
    return () => {
      previousProps.categoryTemplateIDList = categoryTemplateIDList
    }
  }, [categoryTemplateIDList])

  useEffect(() => {
    if (previousProps.seriesLeaderBoardCategoryDetails !== seriesLeaderBoardCategoryDetails) {
      if (seriesLeaderBoardCategoryDetails) {
        setSeriesLBCategory(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.iCategoryId)
        setName(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sName)
        setPrize(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sFirstPrize)
        setRank(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.nMaxRank)
        setTotalPayout(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.nTotalPayout)
        setContent(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sContent ? seriesLeaderBoardCategoryDetails.sContent : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.seriesLeaderBoardCategoryDetails = seriesLeaderBoardCategoryDetails
    }
  }, [seriesLeaderBoardCategoryDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'SeriesLBCategory':
        setSeriesLBCategory(event.target.value)
        break
      case 'Prize':
        if (!event.target.value) {
          setErrPrize('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrPrize('Enter number only')
          } else {
            setErrPrize('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrPrize('')
        }
        setPrize(event.target.value)
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Rank':
        if (isNumber(event.target.value)) {
          setErrRank('')
        } else {
          setErrRank('Required field')
        }
        setRank(event.target.value)
        break
      case 'TotalPayout':
        if (isPositive(event.target.value)) {
          setErrTotalPayout('')
        } else if (!event.target.value) {
          setErrTotalPayout('Required field')
        } else if (!isPositive(event.target.value)) {
          setErrTotalPayout('Must be greater then 0')
        }
        setTotalPayout(event.target.value)
        break
      default:
        break
    }
  }

  function Submit (e) {
    e.preventDefault()
    if (isCreate) {
      if (verifyLength(prize, 1) && isNumber(rank) && verifyLength(content, 1) && isNumber(TotalPayout)) {
        AddNewLBCategory(match.params.id, name, seriesLBCategory, prize, rank, TotalPayout, content)
        setLoading(true)
      } else {
        if (!verifyLength(name, 1)) {
          setErrName('Field required')
        }
        if (!verifyLength(prize, 1)) {
          setErrPrize('Field required')
        }
        if (!isNumber(rank)) {
          setErrRank('Field required')
        }
        if (!verifyLength(content, 1)) {
          setErrContent('Field required')
        }
        if (!isNumber(TotalPayout)) {
          setErrTotalPayout('Required field')
        }
      }
    } else if (!isCreate) {
      if (verifyLength(prize, 1) && isNumber(rank) && verifyLength(content, 1) && isNumber(TotalPayout)) {
        UpdateLBCategory(match.params.id2, name, seriesLBCategory, prize, rank, TotalPayout, content)
        setLoading(true)
      } else {
        if (!verifyLength(name, 1)) {
          setErrName('Field required')
        }
        if (!verifyLength(prize, 1)) {
          setErrPrize('Field required')
        }
        if (!isNumber(rank)) {
          setErrRank('Field required')
        }
        if (!verifyLength(content, 1)) {
          setErrContent('Field required')
        }
        if (!isNumber(TotalPayout)) {
          setErrTotalPayout('Required field')
        }
      }
    }
  }

  // function to handle onChange event for CKEditor
  function onEditorChange (evt, editor) {
    if (verifyLength(editor.getData(), 1)) {
      setErrContent('')
    } else {
      setErrContent('Required field')
    }
    setContent(editor.getData())
  }

  return (
    <main className="main-content">
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}

      <section className="common-form-block">
        <h2>{isCreate ? 'Create Series Leader Board Category' : 'Edit Series Leader Board Category'}</h2>
        <Form>
          <FormGroup>
            <Label for="Name">Series LeaderBoard Category <span className="required-field">*</span></Label>
            <CustomInput
              disabled={(adminPermission?.SERIES_LEADERBOARD === 'R') || !isCreate}
              type="select"
              name="select"
              id="RankType"
              value={seriesLBCategory}
              onChange={event => handleChange(event, 'SeriesLBCategory')}
            >
              {
                categoryList && categoryList.length !== 0 && categoryList.map((category) => {
                  return (
                    <option value={category._id} key={category._id}> {category.sName} </option>
                  )
                })
              }
            </CustomInput>
          </FormGroup>
          <FormGroup>
            <Label for="Name">Name <span className="required-field">*</span></Label>
            {isCreate
              ? <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Name" placeholder="Name" value={name} onChange={event => handleChange(event, 'Name')} />
              : <InputGroupText>{name}</InputGroupText>}
            <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Prize">First Prize <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Prize" placeholder="Prize" value={prize} onChange={event => handleChange(event, 'Prize')} />
            <p className="error-text">{errPrize}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Rank">Max Rank <span className="required-field">*</span></Label>
            <Input type="number" disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Rank" placeholder="Max Rank" value={rank} onChange={event => handleChange(event, 'Rank')} />
            <p className="error-text">{errRank}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Payout">Total Payout <span className="required-field">*</span></Label>
            <Input type="number" disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Payout" placeholder="Total Payout" value={TotalPayout} onChange={event => handleChange(event, 'TotalPayout')} />
            <p className="error-text">{errTotalPayout}</p>
          </FormGroup>
          <FormGroup>
            <Label>Content <span className="required-field">*</span></Label>
            <CKEditor
              onInit={(editor) => {
                editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
              }}
              config={{
                placeholder: 'Enter Content',
                toolbar: {
                  items: [
                    'heading',
                    '|',
                    'fontSize',
                    'fontFamily',
                    '|',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    '|',
                    'alignment',
                    '|',
                    'numberedList',
                    'bulletedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'todoList',
                    'imageUpload',
                    'link',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    '|',
                    'undo',
                    'redo',
                    'imageInsert',
                    '|'
                  ]
                }
              }}
              editor={DecoupledEditor}
              data={content}
              onChange={onEditorChange}
              disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
            />
            <p className="error-text">{errContent}</p>
          </FormGroup>
          {((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
          (
            <Button
              className="theme-btn full-btn"
              onClick={Submit}
              disabled={updateDisable}
            >
              {isCreate ? 'Create LeaderBoard Category' : !isEdit ? 'Save Changes' : 'Edit LeaderBoard Category'}
            </Button>
          )}
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${cancelLink}${page?.SeriesLeaderBoardCategory || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddSeriesLBCategory.defaultProps = {
  history: {},
  getLBCategoryIdList: {},
  seriesLeaderBoardCategoryDetails: {},
  cancelLink: ''
}

AddSeriesLBCategory.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  AddNewLBCategory: PropTypes.func,
  UpdateLBCategory: PropTypes.func,
  getLBCategoryIdList: PropTypes.func,
  seriesLeaderBoardCategoryDetails: PropTypes.object,
  cancelLink: PropTypes.string,
  match: PropTypes.object
}

export default AddSeriesLBCategory
