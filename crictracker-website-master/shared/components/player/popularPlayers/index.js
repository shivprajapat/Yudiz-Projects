import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import winnerIcon from '@assets/images/icon/cup-dark-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const PlayerImg = dynamic(() => import('@shared/components/playerImg'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))

function PopularPlayers({ popularPlayers, className }) {
  const { t } = useTranslation()
  const playerPicStyle = { width: '32px' }
  const nameStyle = { textOverflow: 'ellipsis', width: 'calc(100% - 48px)' }

  if (popularPlayers?.length > 0) {
    return (
      <div className={`widget ${className || ''}`}>
        <div className="widget-title">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className="icon me-1">
              <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            <span>{t('common:PopularPlayers')}</span>
          </h3>
        </div>
        <div className="common-box font-semi py-1">
          {popularPlayers?.map((ele, index) => (
            <React.Fragment key={index}>
              {ele?.eTagStatus === 'a' ? (
                <CustomLink href={`/${ele?.oSeo?.sSlug}/`} prefetch={false}>
                  <a className="text-nowrap d-flex align-items-center my-2">
                    <span style={playerPicStyle} className="rounded-circle overflow-hidden me-2">
                      <PlayerImg
                        head={ele?.oImg}
                        jersey={ele?.oPrimaryTeam?.oJersey}
                      />
                    </span>
                    <span style={nameStyle} className="text-nowrap overflow-hidden mb-0">{ele?.sFirstName || ele?.sFullName}</span>
                  </a>
                </CustomLink>
              ) : (
                <div className="text-nowrap d-flex align-items-center my-2">
                  <span style={playerPicStyle} className="rounded-circle overflow-hidden me-2">
                    <PlayerImg
                      head={ele?.oImg}
                      jersey={ele?.oPrimaryTeam?.oJersey}
                    />
                  </span>
                  <span style={nameStyle} className="text-nowrap overflow-hidden mb-0">{ele?.sFirstName || ele?.sFullName}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  } else return null
}
PopularPlayers.propTypes = {
  popularPlayers: PropTypes.array,
  className: PropTypes.string
}
export default PopularPlayers
