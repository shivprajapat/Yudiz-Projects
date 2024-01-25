import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

const SearchCardAMP = dynamic(() => import('@shared/components/amp/searchComponents/searchCardAMP'))
const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'), { ssr: false })

function SeriesSquadsAMP({ team = [], players, id }) {
  const { t } = useTranslation()
  const player = players
  const teamNameRef = useRef(team[0]?.sTitle)

  return (
    <>
      <style jsx amp-custom>{`
       *{box-sizing:border-box;-webkit-box-sizing:border-box}.row{margin:0 -12px;display:flex;-webkit-display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}.row>div{width:50%;padding:0 12px}h3{margin:0px 0px 16px;font-size:18px;line-height:24px}h4{margin:0 0 16px;font-size:21px;line-height:32px;font-weight:700}@media(max-width: 1199px){h3{font-size:17px;line-height:23px}h4{margin:0 0 14px;font-size:20px;line-height:30px}}@media(max-width: 767px){h3{font-size:16px;line-height:22px}h4{font-size:18px;line-height:28px}.row{-webkit-flex-direction:column;flex-direction:column}.row>div{width:100%}}/*# sourceMappingURL=style.css.map */

      `}
      </style>

      {team?.length !== 0 && player?.length !== 0 && (
        <>
          <div className="filterTitle d-flex justify-content-between align-items-center mb-2">
            <h4 className="text-uppercase mb-0">
              <span className="text-capitalize">{teamNameRef.current} <Trans i18nKey="common:Squad" /></span>
            </h4>
          </div>

          <h3 className="small-head">{t('common:Batsmen')}</h3>
          <div className="row mb-2 mb-sm-1">
            {player?.map((p) => {
              if (p?.oPlayer?.sPlayingRole === 'bat') {
                return (
                  <div key={p?.oPlayer._id} className="col-sm-6">
                    <SearchCardAMP data={p?.oPlayer} />
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
          <h3 className="small-head">{t('common:AllRounder')}</h3>
          <div className="row mb-2 mb-sm-1">
            {player?.map((p) => {
              if (p?.oPlayer?.sPlayingRole === 'all') {
                return (
                  <div key={p?.oPlayer._id} className="col-sm-6">
                    <SearchCardAMP data={p?.oPlayer} />
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
          <h3 className="small-head">{t('common:WicketKeeper')}</h3>
          <div className="row mb-2 mb-sm-1">
            {player?.map((p) => {
              if (p?.oPlayer?.sPlayingRole === 'wk') {
                return (
                  <div key={p?.oPlayer._id} className="col-sm-6">
                    <SearchCardAMP data={p?.oPlayer} />
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
          <h3 className="small-head">{t('common:Bowler')}</h3>
          <div className="row mb-2 mb-sm-1">
            {player?.map((p) => {
              if (p?.oPlayer?.sPlayingRole === 'bowl') {
                return (
                  <div key={p?.oPlayer._id} className="col-sm-6">
                    <SearchCardAMP data={p?.oPlayer} />
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
        </>
      )}
      {team?.length === 0 && player?.length === 0 && <NoDataAMP />}
    </>
  )
}
SeriesSquadsAMP.propTypes = {
  team: PropTypes.array,
  players: PropTypes.array,
  id: PropTypes.string
}
export default SeriesSquadsAMP
