import React, { useState, useEffect, useRef } from 'react'
import {
  FormGroup, Label, Button, Form, UncontrolledAlert
} from 'reactstrap'
import { useSelector } from 'react-redux'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import { NavLink } from 'react-router-dom'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'

const animatedComponents = makeAnimated()

function AddMatchLeague (props) {
  const {
    FuncAddMatchLeague, cancelLink
  } = props
  const [LeagueName, setLeagueName] = useState([])
  const [Selectedoption, setSelectedoption] = useState([])
  const [errLeagueName, seterrLeagueName] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const LeagueNameList = useSelector(state => state.league.LeagueNameList)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, LeagueNameList }).current
  const [modalMessage, setModalMessage] = useState(false)
  const [matchId, setmatchId] = useState('')

  useEffect(() => {
    const { match } = props
    if (match.params.id1) {
      setmatchId(match.params.id1)
    }
    if (match.params.id1 && match.params.id2) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.LeagueNameList !== LeagueNameList) {
      if (LeagueNameList) {
        const arr = []
        if (LeagueNameList.length !== 0) {
          LeagueNameList.map((data) => {
            const obj = {
              value: data._id,
              label: data.sName
            }
            arr.push(obj)
            return arr
          })
          setOptions(arr)
        }
      }
    }
    return () => {
      previousProps.LeagueNameList = LeagueNameList
    }
  }, [LeagueNameList])

  useEffect(() => {
    setLoading(false)
  }, [options])

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

  function handleChange (selectedOption, type) {
    switch (type) {
      case 'LeagueName':
        if (selectedOption) {
          setSelectedoption(selectedOption)
          if (selectedOption.length >= 1) {
            seterrLeagueName('')
          } else {
            seterrLeagueName('Required field')
          }
          setLeagueName(selectedOption)
        } else {
          setLeagueName([])
        }
        break
      default:
        break
    }
  }

  function Submit (e) {
    e.preventDefault()
    if ((Selectedoption && Selectedoption.length >= 1) && !errLeagueName) {
      if (isCreate) {
        const selected = []
        Selectedoption.map((data) => {
          const obj = {
            _id: data.value,
            sName: data.label
          }
          selected.push(obj)
          return selected
        })
        FuncAddMatchLeague(matchId, selected)
      }
      setLoading(true)
    } else if (!Selectedoption.length >= 1) {
      seterrLeagueName('Required field')
    }
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
        <h2>{isCreate ? 'Add Match League' : 'Match League Details'}</h2>
        <Form>
          <FormGroup>
            <Label for="LeagueName">League</Label>
            <Select
              menuPlacement="auto"
              menuPosition="fixed"
              captureMenuScroll={true}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              options={options}
              id="LeagueName"
              name="LeagueName"
              placeholder="Select League"
              value={LeagueName}
              onChange={selectedOption => handleChange(selectedOption, 'LeagueName')}
            />
            <p className="error-text">{errLeagueName}</p>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={Submit} disabled={LeagueName.length === 0}>
                {isCreate ? 'Add Match League' : !isEdit ? 'Save Changes' : 'Edit Match League'}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={cancelLink}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddMatchLeague.propTypes = {
  FuncAddMatchLeague: PropTypes.func,
  cancelLink: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddMatchLeague
