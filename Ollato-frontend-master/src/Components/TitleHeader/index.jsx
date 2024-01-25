/* eslint-disable react/prop-types */
import React from 'react'
import propTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
// import { Dropdown } from 'react-bootstrap'
// import { propTypes } from 'react-bootstrap/esm/Image'
// import { Link } from 'react-router-dom'
// import dropdownicon from '../../assets/images/dropdown-icon.svg'
function TitleHeader (props) {
  const location = useLocation()

  return (
    <>
      <div className="title-header no-breadcrumbs">
          <ul className="breadcrumbs">
            <li className="breadcrumbs-item"><h3>{props.title}</h3></li>
            {props?.showAfter &&
            <li><a className='no-after' href="#">{props.name}</a></li>
            }
          </ul>
         <div className="dropdown-btnbox">

          {/* <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
               <img src={dropdownicon} alt="dropdownicon" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/counselling/session-history/all">Session History</Dropdown.Item>
                <Dropdown.Item as={Link} to="/package-history">Package History</Dropdown.Item>
                <Dropdown.Item as={Link} to="/activepackage-detail">Active Packages</Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings/my-profile">My Profile</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
         </div>
         <div className='right-box'>
                {
                  location?.pathname === '/package' && <>
                      <NavLink
                    to='/package-history'
                    className='theme-btn'
                    style={{ marginRight: '10px' }}
                >
                  Package History
                </NavLink>
                <NavLink
                    to='/activepackage-detail'
                    className='theme-btn'
                >
                  Active Packages
                </NavLink>
                  </>
                }
              </div>
      </div>
    </>
  )
}

export default TitleHeader

TitleHeader.propTypes = {
  name: propTypes.string
}
