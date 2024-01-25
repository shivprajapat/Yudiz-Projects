/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { isPositive, isNumber, verifyLength, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { getRewardsList, getRuleDetails, updateRule } from '../../../../actions/rule'
import PropTypes from 'prop-types'

function Addrule (props) {
  const [selectRule, setselectRule] = useState('')
  const [ruleShortName, setRuleShortName] = useState('RB')
  const [description, setDescription] = useState('')
  const [amount, setamount] = useState(0)
  const [Type, setType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [reward, setReward] = useState('')
  const [rewardErr, setRewardErr] = useState('')
  const [expiryDays, setExpiryDays] = useState(0)
  const [minValue, setminValue] = useState(0)
  const [maxValue, setmaxValue] = useState(0)
  const [ReferActive, setReferActive] = useState('N')
  const [erramount, seterramount] = useState('')
  const [errminValue, seterrminValue] = useState('')
  const [errmaxValue, seterrmaxValue] = useState('')
  const [errDate, seterrDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [RuleId, setRuleId] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const RuleDetails = useSelector(state => state.rule.ruleDetails)
  const rewardsList = useSelector(state => state.rule.rewardsList)
  const resStatus = useSelector(state => state.rule.resStatus)
  const resMessage = useSelector(state => state.rule.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ RuleDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = RuleDetails && previousProps.RuleDetails !== RuleDetails && RuleDetails.eRule === ruleShortName && RuleDetails.sRuleName === selectRule && RuleDetails.eType === Type && RuleDetails.nAmount === amount && RuleDetails.eStatus === ReferActive && RuleDetails.nExpireDays === parseInt(expiryDays) && RuleDetails.sRewardOn === reward

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getRuleDetails(match.params.id, token))
      dispatch(getRewardsList(token))
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          props.history.push('/settings/common-rules', { message: resMessage })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.RuleDetails !== RuleDetails) {
      if (RuleDetails) {
        setRuleId(RuleDetails._id)
        setselectRule(RuleDetails.sRuleName)
        setRuleShortName(RuleDetails.eRule)
        setamount(RuleDetails.nAmount)
        setType(RuleDetails.eType)
        setminValue(RuleDetails.nMin)
        setmaxValue(RuleDetails.nMax)
        setExpiryDays(RuleDetails.nExpireDays)
        setReward(RuleDetails.sRewardOn ? RuleDetails.sRewardOn : '')
        setReferActive(RuleDetails.eStatus)
        setDescription(RuleDetails.sDescription || '')
      }
      setLoading(false)
    }
    return () => {
      previousProps.RuleDetails = RuleDetails
    }
  }, [RuleDetails])

  function onSubmit (e) {
    e.preventDefault()
    const rrValidation = selectRule && ruleShortName && isPositive(amount) && reward && ReferActive && verifyLength(Type, 1)
    const rCBValidation = selectRule && ruleShortName && isPositive(amount) && Type && ReferActive
    const validation = ruleShortName === 'RR' ? rrValidation : rCBValidation
    if (validation) {
      const updateRuleData = {
        Id: RuleId, selectRule, ruleShortName, amount, Type, expiryDays, ReferActive, reward, token
      }
      dispatch(updateRule(updateRuleData))
      setLoading(true)
    } else {
      if (!verifyLength(Type, 1)) {
        setTypeErr('Required field')
      }
      if (!amount) {
        seterramount('Required field')
      }
      if (!verifyLength(reward, 1)) {
        setRewardErr('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'maxValue':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrmaxValue('')
          } else {
            seterrmaxValue('Required field')
          }
          setmaxValue(event.target.value)
        }
        break
      case 'minValue':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrminValue('')
          } else {
            seterrminValue('Required field')
          }
          setminValue(event.target.value)
        }
        break
      case 'amount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterramount('')
          } else {
            seterramount('Required field')
          }
          setamount(event.target.value)
        }
        break
      case 'selectRule':
        setselectRule(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event.target.value)
        break
      case 'ReferActive':
        setReferActive(event.target.value)
        break
      case 'expiryDays':
        if (isNumber(event.target.value)) {
          if (event.target.value < 0) {
            seterrDate('Must be positive')
          } else {
            seterrDate('')
          }
        }
        setExpiryDays(event.target.value)
        break
      case 'Reward':
        if (verifyLength(event.target.value, 1)) {
          setRewardErr('')
        } else {
          setRewardErr('Required field')
        }
        setReward(event.target.value)
        break
      default:
        break
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
        <h2>Edit Common Rule</h2>
        <Form>
          <FormGroup>
            <Label for="selectRule">Rule</Label>
            <InputGroupText>{selectRule}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="ruleShortName">Key</Label>
            <InputGroupText>{ruleShortName}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="amount">
              {
                (ruleShortName === 'PLC' || ruleShortName === 'LCC')
                  ? <span> Amount (%)  <span className="required-field">*</span></span>
                  : <span>Amount  <span className="required-field">*</span></span>
              }
            </Label>
            <Input
              disabled={adminPermission?.RULE === 'R'}
              type="text"
              name="amount"
              placeholder="amount"
              value={amount}
              onChange={event => handleChange(event, 'amount')}
            />
            <p className="error-text">{erramount}</p>
          </FormGroup>
          {ruleShortName === 'RR' &&
          <FormGroup>
            <Label for="Reward">Reward <span className="required-field">*</span></Label>
            <CustomInput
              disabled={adminPermission?.RULE === 'R'}
              type="select"
              name="Reward"
              className="form-control"
              value={reward}
              onChange={event => handleChange(event, 'Reward')}
            >
              <option value="">Select Reward</option>
              {
                rewardsList && rewardsList.length !== 0 && rewardsList.map((data, i) => {
                  return (
                    <option key={data} value={data}>{data}</option>
                  )
                })
              }
            </CustomInput>
            <p className="error-text">{rewardErr}</p>
          </FormGroup>}
          {ruleShortName !== 'LCG' && <FormGroup>
            <Label for="Type">Type <span className="required-field">*</span></Label>
            <CustomInput
              disabled={adminPermission?.RULE === 'R'}
              type="select"
              name="Type"
              className="form-control"
              value={Type}
              onChange={event => handleChange(event, 'Type')}
            >
              {
                (ruleShortName === 'PLC')
                  ? <option value="C">Cash</option>
                  : ruleShortName === 'LCC'
                    ? <Fragment>
                        <option value=''>Select type</option>
                        <option value="C">Cash(Win)</option>
                        <option value="B">Bonus</option>
                        <option value="D">Deposit</option>
                      </Fragment>
                    : (ruleShortName === 'RCB' || ruleShortName === 'RR' || ruleShortName === 'RB')
                        ? <Fragment>
                        <option value=''>Select type</option>
                        <option value="C">Cash</option>
                        <option value="B">Bonus</option>
                      </Fragment>
                        : ''
              }
            </CustomInput>
            <p className="error-text">{typeErr}</p>
          </FormGroup>}
          {
            (ruleShortName === 'DB')
              ? (
                <Fragment>
                  <FormGroup>
                    <Label for="minValue">Min Value</Label>
                    <Input
                      disabled={adminPermission?.RULE === 'R'}
                      type="text"
                      name="minValue"
                      placeholder="minValue"
                      value={minValue}
                      onChange={event => handleChange(event, 'minValue')}
                    />
                    <p className="error-text">{errminValue}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label for="maxValue">Max Value</Label>
                    <Input type='text' name="maxValue" placeholder="maxValue"
                      value={maxValue}
                      disabled={adminPermission?.RULE === 'R'}
                      onChange={event => handleChange(event, 'maxValue')}
                    />
                    <p className="error-text">{errmaxValue}</p>
                  </FormGroup>
                </Fragment>
                )
              : null
          }
          {
            (ruleShortName === 'PLC' || ruleShortName === 'LCC' || ruleShortName === 'LCG')
              ? null
              : (
                <Fragment>
                  {
                    Type === 'B' && (
                    <FormGroup>
                      <Label for="expiredDATE">Expiry Days</Label>
                      <Input
                        type="number"
                        disabled={adminPermission?.RULE === 'R'}
                        name="expiredDATE"
                        placeholder="Expiry Days"
                        value={expiryDays}
                        onChange={event => handleChange(event, 'expiryDays')}
                      />
                      <p className="error-text">{errDate}</p>
                    </FormGroup>
                    )
                  }
                </Fragment>)
          }
          {description && <FormGroup>
            <Label for="Description">Description</Label>
            <Input type='textarea' value={description} readOnly className='read-only-class'></Input>
          </FormGroup>}
          <FormGroup>
            <Label for="Active">Status</Label>
            <div className="d-flex inline-input">
              <CustomInput type="radio" id="ReferActive1" name="contentRadio" label="Active"
                onClick={event => handleChange(event, 'ReferActive')}
                disabled={adminPermission?.RULE === 'R'}
                value="Y" checked={ReferActive === 'Y'} />
              <CustomInput type="radio" id="ReferActive2" name="contentRadio" label="InActive"
                onClick={event => handleChange(event, 'ReferActive')}
                disabled={adminPermission?.RULE === 'R'}
                value="N" checked={ReferActive !== 'Y'} />
            </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn"
                  onClick={onSubmit}
                  disabled={submitDisable}
                >Save Changes</Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to="/settings/common-rules">Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

Addrule.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default connect()(Addrule)
