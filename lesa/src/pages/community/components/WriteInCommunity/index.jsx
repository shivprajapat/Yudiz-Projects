import { galleryIcon, videoPlayIcon, gifIcon, userImg } from 'assets/images'
import React from 'react'
import './style.scss'
const WriteInCommunity = () => {
  return (
    <div className="community">
      <div className="community_box">
        <div className="community_user_img">
          <img src={userImg} alt="" className="img-fluid" />
        </div>
        <div className="content">
          <h6>Write blog somthing what’s your mind</h6>
          <ul>
            <li>
              <img src={galleryIcon} alt="" className="icon" />
              <span>Photo</span>
            </li>
            <li>
              <img src={videoPlayIcon} alt="" className="icon" />
              <span>Videos</span>
            </li>
            <li>
              <img src={gifIcon} alt="" className="icon" />
              <span>GIF</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WriteInCommunity
