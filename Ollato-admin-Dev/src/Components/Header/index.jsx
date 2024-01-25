import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import notification from '../../assets/images/notification.svg'
import ls from 'localstorage-slim'
import defaultimage from '../../assets/images/default.jpeg'
import PropTypes from 'prop-types'
import { useS3Upload } from '../../Shared/Hooks/UseS3UPload'

function Header (props) {
  const profiledata = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', {
    decrypt: true,
    secret: profiledata?.id
  })
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState()
  const { getImage } = useS3Upload()
  const token = localStorage.getItem('token')

  // const location = useLocation()

  const handleChange = (e) => {
    const value = e.target.value

    // eslint-disable-next-line react/prop-types
    props?.parentCallback(value)
  }

  useState(() => {
    if (profiledata?.profile_pic || profiledata?.profile || profiledata?.profile_picture) {
      async function getImageUrl () {
        const data = [{
          path: profiledata?.profile_pic || profiledata?.profile || profiledata?.profile_picture,
          flag: 'profile'
        }]
        const result = await getImage(data, token)
        setProfileImage(result?.url?.profile)
      }
      getImageUrl()
    }
  }, [profiledata])

  return (
    <>
      <header className='header-section'>
        <div className='search-box'>
          {props?.searchbar &&
            <Form>
              <Form.Group className='form-group mb-0' controlId='formsearch'>
                <Form.Control
                  value={props?.search}
                  type='search'
                  placeholder='Search'
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>
            </Form>
              }
        </div>
        <div className='profile-info'>
          <button type='button' className='notification-box'>
            <img src={notification} alt='' />
          </button>
          <button
            className='profile-box '
            onClick={() => {
              if (adminType === 'center') {
                navigate('/center/settings/myprofile')
              } else if (adminType === 'counsellor') {
                navigate('/counsellor/profile')
              } else {
                navigate('/admin/settings/myprofile')
              }
            }}
          >
            <img
              src={
                profileImage || defaultimage
              }
              alt=''
            />
            {adminType === 'super' || adminType === 'sub'
              ? (
              <h6>
                {profiledata?.first_name} {profiledata?.last_name}{' '}
              </h6>
                )
              : adminType === 'center'
                ? (
              <h6>{profiledata?.title}</h6>
                  )
                : adminType === 'counsellor'
                  ? (
              <h6>{profiledata?.first_name} {profiledata?.last_name}{' '}</h6>
                    )
                  : null}
          </button>
        </div>
      </header>
    </>
  )
}
Header.propTypes = {
  parentCallback: PropTypes.func,
  setSearch: PropTypes.func,
  search: PropTypes.string,
  searchbar: PropTypes.bool
}
export default Header
