import React, { useEffect, useState } from 'react'
/* Components */
import { Link } from 'react-router-dom'
import defaultimage from '../../../assets/images/default.jpeg'
import mail from '../../../assets/images/mail.svg'
import phone from '../../../assets/images/phone.svg'
import studenticon from '../../../assets/images/student-icon.svg'
import lightlogomark from '../../../assets/images/lightlogomark.svg'
import { viewProfileAdmin } from '../../../Actions/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'

function AdminProfile () {
  // const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const profileData = useSelector((state) => state.auth.profileDataAdmin)
  const [profileImage, setProfileImage] = useState()
  const { getImage } = useS3Upload()

  useEffect(() => {
    dispatch(viewProfileAdmin(token))
  }, [])
  useEffect(() => {
    async function getImageUrl () {
      if (profileData?.profile_pic) {
        const data = [{
          path: profileData?.profile_pic,
          flag: 'profile'
        }]
        const result = await getImage(data, token)
        setProfileImage(result?.url?.profile)
      }
    }
    getImageUrl()
  }, [profileData?.profile_pic])

  return (
    <>
      {/* <TitleHeader name='My Profile' /> */}
      <div className="main-layout whitebox-layout my-profile-page">
        <h3 className="text-start">My Profile</h3>
        <div className="profilebutton-box text-end">
          <Link
            to="/admin/settings/myprofile/change-password"
            className="theme-btn text-none d-inline-block"
          >
            Change Password
          </Link>
          <Link
            to="/admin/settings/my-profile/editmyprofile"
            className="theme-btn text-none d-inline-block ms-2"
          >
            Edit My Profile
          </Link>
        </div>
        <div className="my-profile-box">
          <div className="row ">
            <div className="col-xl-9">
              <div className="profile-item">
                <div className="row align-items-center">
                  <div className="col-xl-8">
                    <div className="profileinfo profile-updated">
                      <div className="profile-img">
                        <img
                          src={profileImage || defaultimage}
                          alt="ollato-img"
                        />
                      </div>
                      <div className="profiledesc">
                        <h4>
                          {profileData?.first_name} {profileData?.last_name}
                        </h4>
                        <ul className="iconbox">
                          <li>
                            <img src={mail} alt="ollato-img" />
                            <p>{profileData?.email} </p>
                          </li>
                          <li>
                            <img src={phone} alt="ollato-img" />
                            <p>{profileData?.mobile} </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-4 bio-info">
                        <ul>
                          <li>
                            <label>Father&apos;s Name</label>
                            <h4>Himashu Roy</h4>
                          </li>
                          <li>
                            <label>Mother&apos;s Name</label>
                            <h4>Dipti Roy</h4>
                          </li>
                        </ul>
                      </div> */}
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="profile-item h-100 text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
                <div className="student-code">
                  <img src={studenticon} alt="studenticon" />
                  <p>Ollato Expert Code </p>
                  <h4>{profileData?.ollato_code}</h4>
                </div>
                <img
                  src={lightlogomark}
                  className="lightlogomark"
                  alt="ollato-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminProfile
