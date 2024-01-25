import React from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import homeIcon from '../../../assests/images/homeIconWhite.svg'
import editIcon from '../../../assests/images/edit.svg'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import classNames from 'classnames'

function UserHeader (props) {
  const {
    backURL, setActiveTab, activeTab,
    createContest, editable, title, setEditable
  } = props
  const { state, pathname } = useLocation()
  const navigate = useNavigate()

  const { activeSport } = useActiveSports()

  function backClick () {
    if (activeTab === false) {
      setActiveTab(true)
    } else if (backURL) {
      navigate(backURL, {
        state: createContest
          ? {
              ContestName: state?.ContestName, ContestPrize: state?.ContestPrize, ContestSize: state?.ContestSize, multipleTeam: state?.multipleTeam, poolPrice: state?.poolPrice, entryFee: state?.entryFee
            }
          : state
      })
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="league-header u-header">
      <div className="header-i d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center w-100">
          <button className={classNames('btn-link', { 'icon-right-arrow': document.dir === 'rtl', 'icon-left-arrow': document.dir !== 'rtl' })} onClick={backClick} />
          {pathname !== '/notifications' && <Link className='btn-link bg-transparent' to={pathname.includes('/v1') ? `/home/${activeSport}/v1` : `/home/${activeSport}`}><img src={homeIcon} /></Link>}
          <div>
            <h1>{props.title}</h1>
          </div>
          {editable && title === 'Bank Details' && (
          <ul className="d-flex ht-link">
            <li onClick={() => setEditable(false)} role="button">
              {/* <button onClick={() => setEditable(false)}> */}
              <img src={editIcon} />
              {/* </button> */}
            </li>
          </ul>
          )}
        </div>
      </div>
    </div>
  )
}

UserHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  backURL: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  activeTab: PropTypes.bool,
  setActiveTab: PropTypes.func,
  createContest: PropTypes.bool,
  editable: PropTypes.bool,
  setEditable: PropTypes.func
}

export default UserHeader
