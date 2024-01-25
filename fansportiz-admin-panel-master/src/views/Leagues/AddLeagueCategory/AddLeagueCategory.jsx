import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, UncontrolledAlert, CustomInput } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import {
  verifyLength,
  isNumber,
  isPositive,
  alertClass,
  modalMessageFunc
} from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import PropTypes from 'prop-types'
import removeImg from '../../../assets/images/remove_img.svg'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../actions/url'
// import { ifelse, onlyIf } from '../../../helpers/cognitive'
// import { ifelse } from '../../../helpers/cognitive'

function AddLeagueCategory (props) {
  const { cancelLink, AddNewLeagueCategory, UpdateLeagueCategory, LeagueCategoryDetails } = props

  const dispatch = useDispatch()
  const [Title, setTitle] = useState('')
  const [Position, setPosition] = useState(0)
  const [Remark, setRemark] = useState('')
  const [errTitle, seterrTitle] = useState('')
  const [errImage, setErrImage] = useState('')
  const [leagueCategoryImage, setLeagueCategoryImage] = useState('')
  const [errPosition, seterrPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [url, setUrl] = useState('')
  const resStatus = useSelector((state) => state.leaguecategory.resStatus)
  const resMessage = useSelector((state) => state.leaguecategory.resMessage)
  const getUrlLink = useSelector((state) => state.url.getUrl)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  // const Auth = useSelector((state) => state.auth.adminData && state.auth.adminData.eType)
  const Auth = useSelector((state) => state?.auth?.adminData?.eType)
  const previousProps = useRef({ resStatus, resMessage, LeagueCategoryDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const submitDisable =
    LeagueCategoryDetails &&
    previousProps.LeagueCategoryDetails !== LeagueCategoryDetails &&
    LeagueCategoryDetails.sTitle === Title &&
    LeagueCategoryDetails.sRemark === Remark &&
    LeagueCategoryDetails.nPosition === parseInt(Position) &&
    LeagueCategoryDetails.sImage === leagueCategoryImage

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    // ifelse({
    //   ifArg: match.params.id,
    //   ifReturn: () => {
    //     setIsCreate(false)
    //     setLoading(true)
    //   },
    //   elseReturn: () => {
    //     setIsEdit(true)
    //   }
    // })
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
    // onlyIf({
    //   ifArg: getUrlLink,
    //   ifReturn: () => {
    //     return getUrlLink
    //   }
    // })
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push(`${props.cancelLink}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    // onlyIf({
    //   ifArg: previousProps.resMessage !== resMessage,
    //   ifReturn: onlyIf({
    //     ifArg: resMessage,
    //     ifReturn: () => {
    //       setMessage(resMessage)
    //       setStatus(resStatus)
    //       ifelse({
    //         ifArg: resStatus && isCreate,
    //         ifReturn: () => {
    //           props.history.push(`${props.cancelLink}`, { message: resMessage })
    //         },
    //         elseReturn: () => {
    //           onlyIf({
    //             ifArg: resStatus,
    //             ifReturn: () => {
    //               setIsEdit(false)
    //             }
    //           })
    //           setModalMessage(true)
    //         }
    //       })
    //       setLoading(false)
    //     }
    //   })
    // })
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.LeagueCategoryDetails !== LeagueCategoryDetails) {
      if (LeagueCategoryDetails) {
        setTitle(LeagueCategoryDetails.sTitle ? LeagueCategoryDetails.sTitle : '')
        setPosition(LeagueCategoryDetails.nPosition ? LeagueCategoryDetails.nPosition : 0)
        setRemark(LeagueCategoryDetails.sRemark ? LeagueCategoryDetails.sRemark : '')
        setLeagueCategoryImage(LeagueCategoryDetails.sImage || '')
        setLoading(false)
      }
    }
    // onlyIf({
    //   ifArg: previousProps.LeagueCategoryDetails !== LeagueCategoryDetails,
    //   ifReturn: () => {
    //     onlyIf({
    //       ifArg: LeagueCategoryDetails,
    //       ifReturn: () => {
    //         setTitle(LeagueCategoryDetails.sTitle ? LeagueCategoryDetails.sTitle : '')
    //         setPosition(LeagueCategoryDetails.nPosition ? LeagueCategoryDetails.nPosition : 0)
    //         setRemark(LeagueCategoryDetails.sRemark ? LeagueCategoryDetails.sRemark : '')
    //         setLeagueCategoryImage(LeagueCategoryDetails.sImage || '')
    //         setLoading(false)
    //       }
    //     })
    //   }
    // })
    return () => {
      previousProps.LeagueCategoryDetails = LeagueCategoryDetails
    }
  }, [LeagueCategoryDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Remark':
        setRemark(event.target.value)
        break
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          seterrTitle('')
        } else {
          seterrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPosition('')
          } else {
            seterrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setLeagueCategoryImage({
            imageURL: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
          })
          setErrImage('')
        }
        break
      case 'RemoveImage':
        setLeagueCategoryImage('')
        break
      default:
        break
    }
  }

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(Title, 1) && isPositive(Position) && !errTitle && !errPosition) {
      if (isCreate) {
        AddNewLeagueCategory(Title, Position, Remark, leagueCategoryImage)
      } else {
        UpdateLeagueCategory(Title, Position, Remark, leagueCategoryImage)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
      if (!isPositive(Position)) {
        seterrPosition('Required field')
      }
    }

    // ifelse({
    //   ifArg: verifyLength(Title, 1) && isPositive(Position) && !errTitle && !errPosition,
    //   ifReturn: ifelse({
    //     ifArg: isCreate,
    //     ifReturn: () => {
    //       AddNewLeagueCategory(Title, Position, Remark, leagueCategoryImage)
    //     },
    //     elseReturn: () => {
    //       UpdateLeagueCategory(Title, Position, Remark, leagueCategoryImage)
    //     }
    //   }),
    //   elseReturn: () => {
    //     onlyIf({
    //       ifArg: !verifyLength(Title, 1),
    //       ifReturn: seterrTitle('Required field')
    //     })
    //     onlyIf({
    //       ifArg: !isPositive(Position),
    //       ifReturn: seterrPosition('Required field')
    //     })
    //   }
    // })
  }

  function heading () {
    if (isCreate) {
      return 'Create League Category'
    }
    // onlyIf({
    //   ifArg: isCreate,
    //   ifReturn: () => {
    //     return 'Create League Category'
    //   }
    // })
    return !isEdit ? 'Edit League Category' : ' League Category Details'
  }

  function button () {
    if (isCreate) {
      return 'Create League Category'
    }
    // onlyIf({
    //   ifArg: isCreate,
    //   ifReturn: () => {
    //     return 'Create League Category'
    //   }
    // })
    return !isEdit ? 'Save Changes' : 'Edit League Category'
  }

  function leagueCategoryImageTernary () {
    if (leagueCategoryImage) {
      return leagueCategoryImage.imageURL ? leagueCategoryImage.imageURL : url + leagueCategoryImage
    }
    // onlyIf({
    //   ifArg: leagueCategoryImage,
    //   ifReturn: () => {
    //     return leagueCategoryImage.imageURL
    //       ? leagueCategoryImage.imageURL
    //       : url + leagueCategoryImage
    //   }
    // })
    return documentPlaceholder
  }

  return (
    <main className="main-content">
      {modalMessage && message && (
        <UncontrolledAlert color="primary" className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      {/* {onlyIf({
        ifArg: modalMessage && message,
        ifReturn: () => (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>
            {message}
          </UncontrolledAlert>
        )
      })} */}
      {loading && <Loading />}
      {/* {onlyIf({
        ifArg: loading,
        ifReturn: () => <Loading />
      })} */}
      <section className="common-form-block">
        <h2>{heading()}</h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className="custom-img" src={leagueCategoryImageTernary()} alt="themeImage" />
                  {leagueCategoryImage &&
                    ((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE === 'W') && (
                      <div className="remove-img-label">
                        <img
                          onClick={(event) => handleChange(event, 'RemoveImage')}
                          src={removeImg}
                        />
                      </div>
                  )}
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE === 'W') && (
                <CustomInput
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                  id="exampleCustomFileBrowser"
                  name="customFile"
                  label="Add Image"
                  onChange={(event) => handleChange(event, 'Image')}
                />
              )}
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="Title">
              Title <span className="required-field">*</span>
            </Label>
            <Input
              disabled={adminPermission?.LEAGUE === 'R'}
              type="text"
              name="Title"
              placeholder="Enter Title"
              value={Title}
              onChange={(event) => handleChange(event, 'Title')}
            />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Position">
              Position <span className="required-field">*</span>
            </Label>
            <Input
              disabled={adminPermission?.LEAGUE === 'R'}
              type="text"
              name="Position"
              placeholder="Enter Position"
              value={Position}
              onChange={(event) => handleChange(event, 'Position')}
            />
            <p className="error-text">{errPosition}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Remark">Remark</Label>
            <Input
              disabled={adminPermission?.LEAGUE === 'R'}
              type="text"
              name="Remark"
              placeholder="Enter Remark"
              value={Remark}
              onChange={(event) => handleChange(event, 'Remark')}
            />
          </FormGroup>
          {((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE !== 'R') && (
            <Button
              className="theme-btn full-btn"
              onClick={onSubmit}
              // disabled={submitDisable || !Title || !Position}
              disabled={submitDisable || !Title || !Position}
            >
              {button()}
            </Button>
          )}
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${cancelLink}${page?.LeagueCategory || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddLeagueCategory.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeagueCategory: PropTypes.func,
  UpdateLeagueCategory: PropTypes.func,
  LeagueCategoryDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddLeagueCategory
