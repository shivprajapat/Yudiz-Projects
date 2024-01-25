import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'

/* React Packages */
import { useSelector, useDispatch } from 'react-redux'

/* Images */
import notification from '../../assets/images/notification.svg'
import defaultImage from '../../assets/default_profile copy.jpg'

// Action files
import { viewProfileAction } from '../../Actions/auth'
import { useNavigate } from 'react-router-dom'

function Header (props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem(['token'])

  // useState
  const [searchValue, setsearchValue] = useState('')

  // useSelector
  const profileData = useSelector((state) => state.auth.profileData)

  useEffect(() => {
    if (token) {
      dispatch(viewProfileAction(token))
    }
  }, [])

  // Function for handleChnage
  const handleChange = (e) => {
    const value = e.target.value
    setsearchValue(value)
  }

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (props?.parentCallback) {
      // eslint-disable-next-line react/prop-types
      props?.parentCallback(searchValue)
    }
  }, [searchValue])

  console.log('profileData', profileData)

  return (
    <>
        <header className="header-section">
            <div className="search-box">
                <Form>
                    <Form.Group className="form-group mb-0" controlId="formsearch">
                        <Form.Control type="search" placeholder="Search"
                          onChange={(e) => handleChange(e)}
                        />
                    </Form.Group>
                </Form>
            </div>
            <div className="profile-info">
                <button type='button' className="notification-box"><img src={notification} alt="" /></button>
                <button className="profile-box" onClick={() => navigate('/settings/my-profile')}>
                    <img src={ profileData?.profile !== null ? `${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.profile}` : defaultImage} alt="" />
                    <h6>{profileData?.user_name}</h6>
                </button>
            </div>
        </header>
    </>
  )
}

export default Header
