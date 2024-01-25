import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import { HelmetIcon } from '../../ctIcons'
import CustomLink from '@shared/components/customLink'
import useTranslation from 'next-translate/useTranslation'
import { getMatchPlayers } from '@shared/libs/match-detail'

const BatterDataRow = ({ batter, table, capwk }) => {
  const allPlayers = getMatchPlayers()
  const { t } = useTranslation()
  const player = allPlayers[batter?.iBatterId] || batter?.oBatter
  const playerSlug = player?.oSeo?.sSlug

  return (
    <tr className={`${batter.highlight && 'highlight'}`}>
      <td>
        <span className="d-flex flex-column flex-md-row">
          <span className={`${styles.batterName} d-flex ${batter?.eDismissal === null ? 'text-primary' : ''}`}>
            {batter?.eDismissal === null && <span className="flex-shrink-0 me-1"><HelmetIcon /></span>}
            {player?.eTagStatus === 'a' ? <><span className="d-none d-sm-block overflow-hidden t-ellipsis">
              <CustomLink href={`/${playerSlug}`} prefetch={false}>
                <a>{player?.sFullName || player?.sShortName}</a>
              </CustomLink>
            </span>
            </> : <span className="d-none d-sm-block overflow-hidden t-ellipsis">{player?.sFullName || player?.sShortName}</span>}
            {player?.eTagStatus === 'a' ? <><span className="d-block d-sm-none overflow-hidden t-ellipsis">
              <CustomLink href={`/${playerSlug}`} prefetch={false}>
                <a>{player?.sShortName || player?.sFullName}</a>
              </CustomLink>
            </span>
            </> : <span className="d-block d-sm-none">{player?.sShortName || player?.sFullName}</span>}
            {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'cap' && <span key={i} className="ps-1">{`(${t('common:c')})`}</span>)}
            {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'wk' && <span key={i} className="ps-1">{`(${t('common:Wk')})`}</span>)}
            {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'wkcap' && <span key={i} className="ps-1">{`(${t('common:WkCap')})`}</span>)}
          </span>
          <span className={`${styles.subText} overflow-hidden t-ellipsis font-medium ${!batter?.eDismissal === null ? 'text-primary' : 'text-secondary'}`}>
            {!batter?.eDismissal === null ? t('common:Notout') : batter?.sHowOut}
          </span>
        </span>
      </td>
      {Object.keys(table.current)?.map((value, index) => {
        return <td key={index}>{batter[value]}</td>
      })}
    </tr>
  )
}

BatterDataRow.propTypes = {
  batter: PropTypes.object,
  playerSlug: PropTypes.object,
  table: PropTypes.object,
  capwk: PropTypes.array
}

export default BatterDataRow
