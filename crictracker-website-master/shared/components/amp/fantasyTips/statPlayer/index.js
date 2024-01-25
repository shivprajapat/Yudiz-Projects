import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import CustomLink from '@shared/components/customLink'
import { activeTabWiseData } from '@shared/libs/fantasyMatchPlayerStats'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

const StatPlayerAMP = ({ data, index, activeTab, playerTeam }) => {
  const value = activeTabWiseData(activeTab, data)

  return (
    <>
      <style jsx amp-custom>{`
      .searchCard{border:1px solid;border-color:var(--theme-light);color:var(--font-color);margin-bottom:8px}.icon{border-radius:50%;overflow:hidden}.text-uppercase{text-transform:uppercase}.playerImage{position:relative}.playerImage .serialNo{position:absolute;top:0;left:0;width:22px;height:22px;text-align:center;border-radius:50%;background-color:var(--theme-color-medium);color:var(--light-mode-bg)}/*# sourceMappingURL=style.css.map */

    `}</style>
      <div className="searchCard common-box d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="playerImage">
            <div className="icon rounded-circle overflow-hidden me-2 flex-shrink-0">
              <PlayerImgAMP
                head={data?.oPlayer?.oImg}
                jersey={playerTeam[data?.oTeam?._id]?.oJersey}
                width="60px"
                enableBg
              />
              {/* <amp-img
                src={getImgURL(data?.oPlayer?.oImg?.sUrl) || '/static/player-placeholder.jpg'}
                alt={data?.oPlayer?.sFullName}
                layout="fixed"
                width="60"
                height="60"
                className="icon"
              /> */}
            </div>
            <div className="serialNo text-white">
              {index}
            </div>
          </div>
          <div>
            <h3 className="small-head small-head font-semi mb-0">
              {data?.oPlayer?.eTagStatus === 'a' ? (
                <CustomLink href={`/${data?.oPlayer?.oSeo?.sSlug}/?amp=1`} prefetch={false}>
                  <a>{data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</a>
                </CustomLink>
              ) : (
                data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName
              )}
            </h3>
            {data?.sSeason && <p className="small-text secondary-text mb-0 mt-1">{data?.sSeason}</p>}
            <p className="small-text secondary-text text-uppercase mb-0 mt-1">
              <span>{data?.oTeam?.sAbbr}</span> - <span>{data?.oPlayer?.sPlayingRole}</span>
            </p>
          </div>
        </div>
        <div className="t-center">
          <h4 className="mb-0 theme-text">{value}</h4>
          <p className="mb-0">
            {data?.nMatches}&nbsp;
            {data?.nMatches > 1 ? <Trans i18nKey="common:Matches" /> : <Trans i18nKey="common:Match" />}
          </p>
        </div>
      </div>
    </>
  )
}
StatPlayerAMP.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  activeTab: PropTypes.string,
  playerTeam: PropTypes.object
}

export default StatPlayerAMP
