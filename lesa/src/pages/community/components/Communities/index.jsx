import { userImg } from 'assets/images'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './style.scss'
const Communities = ({ title, btnTxt, btnCls }) => {
  return (
    <div className="item">
      <div className="item_head">
        <h6>{title}</h6>
        <Link to="/" className={`${btnCls} btn`}>
          {btnTxt}
        </Link>
      </div>
      {/* scroll class name create-community */}
      <div className="items-box create-community">
      <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
      </div>
      <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
        {/* <Link to="/" className="light-btn btn">
        Unfollow
        </Link> */}
      </div> <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
      </div>
      <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
        {/* <Link to="/" className="light-btn btn">
        Unfollow
        </Link> */}
      </div> <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
      </div>
      <div className="item_box">
        <Link to="/" className="item-user-img">
          <img src={userImg} alt="user-img" className="img-fluid" />
          <span className="user-id">Artworks</span>
        </Link>
        <Link to="/" className="black-btn btn">
          Edit
        </Link>
        {/* <Link to="/" className="light-btn btn">
        Unfollow
        </Link> */}
      </div>
      </div>
    </div>
  )
}

Communities.propTypes = {
  title: PropTypes.string,
  btnTxt: PropTypes.string,
  btnCls: PropTypes.string
}
export default Communities
