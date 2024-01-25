import React, {
  Fragment, useEffect, useState, useRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, CustomInput, FormGroup, Input, PopoverBody, UncontrolledAlert, UncontrolledPopover, Modal, ModalBody, Row, Col, Label
} from 'reactstrap'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import { alertClass, isFloat, isNumber, isPositive, modalMessageFunc, verifyLength } from '../../../helpers/helper'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'
import { addLeaguePrice, updateLeaguePrice, deletePrizeBreaup } from '../../../actions/league'
import infoIcon from '../../../assets/images/info2.svg'
import Loading from '../../../components/Loading'

function LeaguePrizeList (props) {
  const {
    List, getList, match, showInputFields
  } = props
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const [addPrize, setAddPrize] = useState('')
  const [addRankFrom, setAddRankFrom] = useState('')
  const [addRankTo, setAddRankTo] = useState('')
  const [addRankType, setAddRankType] = useState('R')
  const [addPrizeBreakUpImage, setAddPrizeBreakUpImage] = useState('')
  const [addExtra, setAddExtra] = useState('')
  const [addPrizeErr, setAddPrizeErr] = useState('')
  const [addRankFromErr, setAddRankFromErr] = useState('')
  const [addRankToErr, setAddRankToErr] = useState('')
  const [addExtraErr, setAddExtraErr] = useState('')

  const [prize, setPrize] = useState('')
  const [rankFrom, setRankFrom] = useState('')
  const [rankTo, setRankTo] = useState('')
  const [rankType, setRankType] = useState('R')
  const [prizeBreakUpImage, setPrizeBreakUpImage] = useState('')
  const [extra, setExtra] = useState('')
  const [prizeErr, setPrizeErr] = useState('')
  const [prizeBreakUpImageErr, setPrizeBreakUpImageErr] = useState('')
  const [rankFromErr, setRankFromErr] = useState('')
  const [rankToErr, setRankToErr] = useState('')
  const [extraErr, setExtraErr] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [prizeBreakUpData, setPrizeBreakUpData] = useState({})
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch('')
  const isDeletedPrizeBreakup = useSelector(state => state.league.isDeletedPrizeBreakup)
  const token = useSelector((state) => state.auth.token)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const LeagueDetails = useSelector(state => state.league.LeagueDetails)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ List, resMessage, resStatus, isDeletedPrizeBreakup }).current

  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    setLoading(true)
    getList(match.params.id)
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    List && setLoading(false)
  }, [List])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList(match.params.id)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoader(false)
          setIsEdit(false)
          setPrizeBreakUpData({})
        } else {
          getList(match.params.id)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
          setLoader(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.isDeletedPrizeBreakup !== isDeletedPrizeBreakup) {
      if (isDeletedPrizeBreakup) {
        getList(match.params.id)
      }
    }
    return () => {
      previousProps.isDeletedPrizeBreakup = isDeletedPrizeBreakup
    }
  }, [resStatus, isDeletedPrizeBreakup])

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deletePrizeBreaup(match.params?.id, deleteId, token))
    toggleWarning()
    setLoading(true)
  }

  function addHandleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPrizeBreakUpImageErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAddPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPrizeBreakUpImageErr('')
        }
        if (addRankType !== 'E' && !event.target.files[0]) {
          setPrizeBreakUpImageErr('Required Field')
        }
        break
      case 'Prize':
        if (!event.target.value) {
          setAddPrizeErr('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setAddPrizeErr('Enter number only')
          } else {
            setAddPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            setAddPrizeErr('Value must be less than 100')
          } else {
            setAddPrizeErr('')
          }
        }
        setAddPrize(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setAddRankFromErr('')
          } else {
            setAddRankFromErr('Required field')
          }
          setAddRankFrom(event.target.value)
          if (parseInt(addRankTo) && parseInt(event.target.value) > parseInt(addRankTo)) {
            setAddRankFromErr('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setAddRankFromErr('Value must be less than WinnersCount')
          } else {
            setAddRankFromErr('')
            setAddRankToErr('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setAddRankToErr('')
          } else {
            setAddRankToErr('Required field')
          }
          setAddRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setAddRankToErr('Value must be less than WinnersCount')
          } else if (parseInt(addRankFrom) > parseInt(event.target.value)) {
            setAddRankToErr('Rank To value should be greater than Rank From value')
          } else {
            setAddRankToErr('')
            setAddRankFromErr('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          setAddExtraErr('')
        } else {
          setAddExtraErr('Required field')
        }
        setAddExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setAddExtra('')
          setAddPrizeBreakUpImage('')
          setAddPrize(0)
          setAddPrizeErr('')
        } else {
          setAddExtraErr('')
        }
        setAddRankType(event.target.value)
        break
      default:
        break
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPrizeBreakUpImageErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPrizeBreakUpImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPrizeBreakUpImageErr('')
        }
        break
      case 'Prize':
        if (!event.target.value) {
          setPrizeErr('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setPrizeErr('Enter number only')
          } else {
            setPrizeErr('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            setPrizeErr('Value must be less than 100')
          } else {
            setPrizeErr('')
          }
        }
        setPrize(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setRankFromErr('')
          } else {
            setRankFromErr('Required field')
          }
          setRankFrom(event.target.value)
          if (parseInt(rankTo) && parseInt(event.target.value) > parseInt(rankTo)) {
            setRankFromErr('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setRankFromErr('Value must be less than WinnersCount')
          } else {
            setRankFromErr('')
            setRankToErr('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setRankToErr('')
          } else {
            setRankToErr('Required field')
          }
          setRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            setRankToErr('Value must be less than WinnersCount')
          } else if (parseInt(rankFrom) > parseInt(event.target.value)) {
            setRankToErr('Rank To value should be greater than Rank From value')
          } else {
            setRankToErr('')
            setRankFromErr('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          setExtraErr('')
        } else {
          setExtraErr('Required field')
        }
        setExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setExtra('')
          setPrizeBreakUpImage('')
          setPrize(0)
          setPrizeErr('')
        } else if ((event.target.value === 'R') || (event.target.value === 'B')) {
          setExtra('')
          setPrizeBreakUpImage('')
          if (prize === 0) {
            setPrizeErr('Required field')
          }
        }
        setRankType(event.target.value)
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function handleClick (e) {
    e.preventDefault()
    const addValidation = isFloat(addPrize) && isNumber(addRankFrom) && isNumber(addRankTo) && (parseInt(addRankFrom) <= parseInt(addRankTo)) && addRankType && !addPrizeErr && !addRankFromErr && !addRankToErr
    const validate = addRankType === 'E' ? (addValidation && verifyLength(addExtra, 1)) : (addValidation && (addPrize > 0))
    if (validate) {
      const addLeaguePriceData = {
        price: addPrize, rFrom: addRankFrom, rTo: addRankTo, rType: addRankType, extra: addExtra, PrizeBreakupImage: addPrizeBreakUpImage, ID: match.params.id, token
      }
      dispatch(addLeaguePrice(addLeaguePriceData))
      setLoader(true)
      setAddPrize(0)
      setAddRankFrom(0)
      setAddRankTo(0)
      setAddRankType('R')
      setAddExtra('')
      setAddPrizeBreakUpImage('')
    } else {
      if (addRankType !== 'E' && isNaN(addPrize)) {
        setAddPrizeErr('Enter number only')
      } else if (addRankType !== 'E' && (!isFloat(addPrize) || addPrize <= 1)) {
        setAddPrizeErr('Required field')
      }
      if (parseInt(addRankTo) < parseInt(addRankFrom)) {
        setAddRankToErr('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(addRankFrom)) {
        setAddRankFromErr('Required field')
      }
      if (!isPositive(addRankTo)) {
        setAddRankToErr('Required field')
      }
      if (addRankType === 'E' && !verifyLength(addExtraErr, 1)) {
        setAddExtraErr('Required field')
      }
      if (addRankType === 'E' && !prizeBreakUpImage) {
        setPrizeBreakUpImageErr('Required field')
      } else {
        setPrizeBreakUpImageErr('')
      }
    }
  }

  function setEdit (data) {
    setIsEdit(true)
    setPrizeBreakUpData(data)
    setPrize(data.nPrize || 0)
    setRankFrom(data.nRankFrom)
    setRankTo(data.nRankTo)
    setRankType(data.eRankType)
    setExtra(data.sInfo || '')
    setPrizeBreakUpImage(data.sImage || '')
  }

  useEffect(() => {
    if (!showInputFields) {
      setAddPrizeErr('')
      setAddRankFromErr('')
      setAddRankToErr('')
      setAddExtraErr('')
    }
  }, [showInputFields])

  function updatePrizeBreakup () {
    const updateValidation = isFloat(prize) && isNumber(rankFrom) && isNumber(rankTo) && (parseInt(rankFrom) <= parseInt(rankTo)) && rankType && !prizeErr && !rankFromErr && !rankToErr
    const validate = rankType === 'E' ? (updateValidation && verifyLength(extra, 1)) : (updateValidation && (prize > ''))
    if (validate) {
      const updatePrizeBreakupData = {
        PrizeBreakupImage: prizeBreakUpImage,
        rFrom: parseInt(rankFrom),
        rTo: parseInt(rankTo),
        price: prize,
        rType: rankType,
        extra: extra,
        ID1: match.params.id,
        ID2: prizeBreakUpData._id,
        token
      }
      dispatch(updateLeaguePrice(updatePrizeBreakupData))
      setEdit(false)
      setLoader(true)
      setPrize('')
      setRankFrom('')
      setRankTo('')
      setRankType('')
      setExtra('')
      setPrizeBreakUpImage('')
    } else {
      if (rankType !== 'E' && isNaN(prize)) {
        setPrizeErr('Enter number only')
      } else if (rankType !== 'E' && (!isFloat(prize) || prize <= 1)) {
        setPrizeErr('Required field')
      }
      if (parseInt(rankTo) < parseInt(rankFrom)) {
        setRankToErr('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(rankFrom)) {
        setRankFromErr('Required field')
      }
      if (!isPositive(rankTo)) {
        setRankToErr('Required field')
      }
      if (!verifyLength(extra, 1)) {
        setExtraErr('Required field')
      }
    }
  }

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loader && <Loading />}
      {showInputFields &&
      <Fragment>
        <Row>
          <Col lg='2' md='4'>
            <FormGroup>
              <Label>Prize</Label>
              <Input placeholder='Prize' value={addPrize} onChange={(e) => addHandleChange(e, 'Prize')}></Input>
              <p className="error-text">{addPrizeErr}</p>
            </FormGroup>
          </Col>
          <Col lg='2' md='4'>
            <FormGroup>
              <Label>Rank From</Label>
              <Input placeholder='Rank From' value={addRankFrom} onChange={(e) => addHandleChange(e, 'RankFrom')}></Input>
              <p className="error-text">{addRankFromErr}</p>
            </FormGroup>
          </Col>
          <Col lg='2' md='4'>
            <FormGroup>
              <Label>Rank To</Label>
              <Input placeholder='Rank To' value={addRankTo} onChange={(e) => addHandleChange(e, 'RankTo')}></Input>
              <p className="error-text">{addRankToErr}</p>
            </FormGroup>
          </Col>
          <Col lg='2' md='4'>
            <FormGroup>
              <Label>Rank Type</Label>
              <CustomInput
                type='select'
                name='RankType'
                id='RankType'
                value={addRankType}
                className='editable-select'
                onChange={(e) => addHandleChange(e, 'RankType')}
              >
                <option value="R"> RealMoney </option>
                <option value="B"> Bonus </option>
                {(!LeagueDetails?.bPoolPrize) && <option value="E">Extra </option>}
              </CustomInput>
            </FormGroup>
          </Col>
          <Col lg='2' md='4'>
            <FormGroup>
              <Label>Info</Label>
              <Input type='text' placeholder='Info' value={addExtra} onChange={(e) => addHandleChange(e, 'Extra')} disabled={addRankType !== 'E'}></Input>
              <p className="error-text">{addExtraErr}</p>
            </FormGroup>
            </Col>
            <Col lg='2' md='4'>
            <FormGroup>
              <div className="theme-image text-center">
                <div className="d-flex theme-photo">
                <img src={addPrizeBreakUpImage ? addPrizeBreakUpImage.imageURL ? addPrizeBreakUpImage.imageURL : url + addPrizeBreakUpImage : documentPlaceholder} onError={onImageError} alt="Extra Image" height={50} width={50} />
                </div>
                {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) && addRankType === 'E' &&
                  <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" onChange={event => addHandleChange(event, 'ImagePrizeBreakup')} />}
              </div>
                <p className="error-text">{prizeBreakUpImageErr}</p>
            </FormGroup>
            </Col>
        </Row>
        <FormGroup className='text-center'>
          <Button className="theme-btn" onClick={handleClick}>Add</Button>
        </FormGroup>
      </Fragment>}
      <div className="table-responsive">
        <table className="prize-breakup-table">
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> Prize  <img className='custom-info' src={infoIcon} id='prize'></img>
              <UncontrolledPopover trigger="legacy" placement="bottom" target='prize'>
                <PopoverBody style={{ width: '520px' }}>
                  <p>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                  <p>Formula -</p>
                  <p>Winning amount = ((Total payout * Prize ) / 100) / (Rank To - Rank From + 1)</p>
                  <p>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                </PopoverBody>
              </UncontrolledPopover></th>
              <th> Rank From </th>
              <th> Rank To </th>
              <th> Rank Type </th>
              <th> Info </th>
              <th> Image </th>
              <th> Actions  </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {
                    List && List.length !== 0 && List.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td className='editable-text'>
                        {isEdit && data._id === prizeBreakUpData._id
                          ? <FormGroup>
                              <Input className='editable-text-field' type='text' onChange={(e) => handleChange(e, 'Prize')} value={prize}></Input>
                              <p className='error-text'>{prizeErr}</p>
                              </FormGroup>
                          : data.nPrize || 0}
                        </td>
                        <td className='editable-text'>
                        {isEdit && data._id === prizeBreakUpData._id
                          ? <FormGroup>
                              <Input className='editable-text-field' type='text' onChange={(e) => handleChange(e, 'RankFrom')} value={rankFrom}></Input>
                              <p className='error-text'>{rankFromErr}</p>
                              </FormGroup>
                          : <div>{data.nRankFrom}</div>}
                        </td>
                        <td className='editable-text'>
                        {isEdit && data._id === prizeBreakUpData._id
                          ? <FormGroup>
                              <Input className='editable-text-field' type='text' onChange={(e) => handleChange(e, 'RankTo')} value={rankTo}></Input>
                              <p className='error-text'>{rankToErr}</p>
                              </FormGroup>
                          : <div>{data.nRankTo}</div>}
                        </td>
                        <td className='editable-select'>
                        {isEdit && data._id === prizeBreakUpData._id
                          ? <CustomInput
                            type='select'
                            name='RankType'
                            id='RankType'
                            value={rankType}
                            className='editable-select-field'
                            onChange={(e) => handleChange(e, 'RankType')}
                          >
                            <option value="R"> RealMoney </option>
                            <option value="B"> Bonus </option>
                            {(!LeagueDetails?.bPoolPrize) && <option value="E"> Extra </option>}
                          </CustomInput>
                          : <Fragment>
                              <Fragment>
                              {data.eRankType === 'R' ? ' Real Money ' : ''}
                            </Fragment>
                            <Fragment>
                              {data.eRankType === 'B' ? 'Bonus' : ''}
                            </Fragment>
                            <Fragment>
                              {data.eRankType === 'E' ? 'Extra' : ''}
                            </Fragment>
                          </Fragment>}
                        </td>
                        <td className='editable-text'>
                        {isEdit && data._id === prizeBreakUpData._id && rankType === 'E'
                          ? <FormGroup>
                              <Input className='editable-text-field' type='text' onChange={(e) => handleChange(e, 'Extra')} value={extra}></Input>
                              <p className='error-text'>{extraErr}</p>
                          </FormGroup>
                          : <div>{data.sInfo || ' - '}</div>
                        }
                        </td>
                        <td className='editable-text'>
                        {isEdit && data._id === prizeBreakUpData._id && rankType === 'E'
                          ? <FormGroup>
                            <div className="theme-image text-center">
                              <div className="d-flex theme-photo">
                              {prizeBreakUpImage && <img src={prizeBreakUpImage ? prizeBreakUpImage.imageURL ? prizeBreakUpImage.imageURL : url + prizeBreakUpImage : documentPlaceholder} onError={onImageError} alt="Extra Image" height={50} width={70} />}
                              </div>
                              {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) &&
                                <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" onChange={event => handleChange(event, 'ImagePrizeBreakup')} />}
                              </div>
                            </FormGroup>
                          : data.sImage ? <img src={url + data.sImage} alt="Extra Image" height={50} width={70} /> : ' No Image'}
                          </td>
                        <td className='editable-field'>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              {isEdit && data._id === prizeBreakUpData._id
                                ? <div>
                                <Button className="view" color='link' onClick={updatePrizeBreakup}>
                                  Save Changes
                                </Button>
                                <Button className="view" color='link' onClick={() => setIsEdit(false)}>
                                  Cancel
                                </Button>
                                </div>
                                : <Button color="link" className="view" onClick={() => setEdit(data)} disabled={adminPermission?.LEAGUE === 'R'}>
                                <img src={viewIcon} alt="View" />
                                Edit
                              </Button>}
                            </li>
                              {((Auth && Auth === 'SUPER') ||
                                (adminPermission?.LEAGUE !== 'R')) && (
                                <li>
                                  <Button
                                    color='link'
                                    className='delete'
                                    onClick={() =>
                                      warningWithDeleteMessage(data._id, 'delete')
                                    }
                                  >
                                    <img src={deleteIcon} alt='Delete' />
                                    Delete
                                  </Button>
                                </li>
                              )}
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && List && List.length === 0 &&
        (
          <div className="text-center">
            <h3>No League Prize available</h3>
          </div>
        )
      }
      <Modal
        isOpen={modalWarning}
        toggle={toggleWarning}
        className='modal-confirm'
      >
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>Are you sure you want to delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button
                type='submit'
                className='theme-btn outline-btn full-btn'
                onClick={deleteId ? onCancel : toggleWarning}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type='submit'
                className='theme-btn danger-btn full-btn'
                onClick={deleteId && onDelete}
              >Yes, Delete It
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

LeaguePrizeList.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  showInputFields: PropTypes.bool
}

export default LeaguePrizeList
