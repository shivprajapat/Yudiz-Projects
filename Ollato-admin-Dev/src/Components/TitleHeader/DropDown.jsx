import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { getRevenue } from '../../Actions/Center/purchaseLicense'
import ls from 'localstorage-slim'
function DropDown () {
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('current_month')
  const handlechange = (event) => {
    setSelected(event.target.value)
  }
  useEffect(() => {
    if (adminType === 'center') {
      dispatch(getRevenue(selected, token, 'center'))
    } else {
      dispatch(getRevenue(selected, token, 'counsellor'))
    }
  }, [selected])
  return (
    <div>
      <div className="options-items">
          <DropdownButton
            variant="outline-secondary"
            title={selected === 'current_month' ? 'Current Month' : selected === 'last_month' ? 'Last Month' : selected === 'last_three_months' ? ' Last 3 Months' : 'Last year' }
            id="input-group-dropdown-1"
          >
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadioDisabled"
                  value="current_month"
                  onChange={handlechange}
                  checked={selected === 'current_month'}></input>
                <label
                  className="form-check-label"
                  htmlFor="flexRadioDisabled"
                >
                  Current Month
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio"
                  value="last_month"
                  onChange={handlechange}
                  checked={selected === 'last_month'}
                />
                <label className="form-check-label" htmlFor="flexRadio">
                  Last Month
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio1"
                  value="last_three_months"
                  onChange={handlechange}
                  checked={selected === 'last_three_months'}
                />
                <label className="form-check-label" htmlFor="flexRadio1">
                  Last 3 Months
                </label>
              </div>
            </Dropdown.Item>
            <Dropdown.Item href="#/">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexDisabled"
                  id="flexRadio12h"
                  value="last_year"
                  onChange={handlechange}
                  checked={selected === 'last_year'}
                />
                <label className="form-check-label" htmlFor="flexRadio12h">
                  Last year
                </label>
              </div>
            </Dropdown.Item>

          </DropdownButton>
          </div>
    </div>
  )
}

export default DropDown
