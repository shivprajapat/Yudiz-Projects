import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { HelmetIcon } from '../../ctIcons'
import { tableLoader } from '@shared/libs/allLoader'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })

const ScorecardTable = ({ data, fullSquad }) => {
  const { t } = useTranslation()
  const labels = [`${t('common:Batter')}`, <><span className="d-none d-sm-inline" key={'runs'}>{t('common:Runs')}</span><span className="d-sm-none" key={'r'}>{t('common:R')}</span></>, <><span className="d-none d-sm-inline" key={'balls'}>{t('common:Balls')}</span><span className="d-sm-none" key={'b'}>{t('common:B')}</span></>, `${t('common:4s')}`, `${t('common:6s')}`, `${t('common:SR')}`]
  const table = useRef({ nRuns: 'Runs', nBallFaced: 'Balls', nFours: '4s', nSixes: '6s', sStrikeRate: 'SR' })
  const playingXIMember = useRef()
  let res = []
  const [result, setResult] = useState()
  const [capwk, setCapWk] = useState()
  playingXIMember.current = fullSquad.filter((data) => data.bPlaying11 === true)
  const team1PlayingPlayerData = playingXIMember.current.filter((item) => item.oTeam._id === data?.iBattingTeamId)
  const team2PlayingPlayerData = playingXIMember.current.filter((item) => item.oTeam._id !== data?.iBattingTeamId)
  const filterForYetToBat = (arr1, arr2) => {
    res = arr1.filter(el => {
      return !arr2.aBatters.find(element => {
        return element?.iBatterId === el.iPlayerId
      })
    })
    setResult(res)
  }

  const filterForCapWk = (arr1, arr2) => {
    res = arr1.filter(el => {
      return arr2.aBatters.find(element => {
        if (el.iPlayerId === element?.iBatterId && (el.sRoleStr === 'cap' || el.sRoleStr === 'wk' || el.sRoleStr === 'wkcap')) {
          return el
        } else {
          return null
        }
      })
    })
    setCapWk(res)
  }

  useEffect(() => {
    if (data?.iBattingTeamId === team1PlayingPlayerData[0]?.oTeam?._id) {
      filterForYetToBat(team1PlayingPlayerData, data)
    } else {
      filterForYetToBat(team2PlayingPlayerData, data)
    }
  }, [])

  useEffect(() => {
    if (data?.iBattingTeamId === team1PlayingPlayerData[0]?.oTeam?._id) {
      filterForCapWk(team1PlayingPlayerData, data)
    } else {
      filterForCapWk(team2PlayingPlayerData, data)
    }
  }, [])

  return (
    <div className={`${styles.scorecardTable}`}>
      <ThemeTable labels={labels} isBordered={true}>
        {data?.aBatters?.map((batter, index) => {
          return (
            <tr key={index} className={`${batter.highlight && 'highlight'}`}>
              <td>
                <span className="d-flex flex-column flex-md-row">
                  <span className={`${styles.batterName} d-flex ${batter?.eDismissal === null ? 'text-primary' : ''}`}>
                    {batter?.eDismissal === null && <HelmetIcon />}
                    {batter?.oBatter?.eTagStatus === 'a' ? <><span className="d-none d-sm-block">
                      <Link href={`/${batter?.oBatter?.oSeo?.sSlug}`} prefetch={false}>
                        <a>{batter?.oBatter?.sFullName || batter?.oBatter?.sShortName}</a>
                      </Link>
                    </span>
                    </> : <span className="d-none d-sm-block">{batter?.oBatter?.sFullName || batter?.oBatter?.sShortName}</span>}
                    {batter?.oBatter?.eTagStatus === 'a' ? <><span className="d-block d-sm-none">
                      <Link href={`/${batter?.oBatter?.oSeo?.sSlug}`} prefetch={false}>
                        <a>{batter?.oBatter?.sShortName || batter?.oBatter?.sFullName}</a>
                      </Link>
                    </span>
                    </> : <span className="d-block d-sm-none">{batter?.oBatter?.sShortName || batter?.oBatter?.sFullName}</span>}
                    {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'cap' && <span key={i} className="ps-1">{`(${t('common:c')})`}</span>)}
                    {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'wk' && <span key={i} className="ps-1">{`(${t('common:Wk')})`}</span>)}
                    {capwk?.map((p, i) => p?.iPlayerId === batter?.iBatterId && p?.sRoleStr === 'wkcap' && <span key={i} className="ps-1">{`(${t('common:WkCap')})`}</span>)}
                  </span>
                  <span className={`${styles.subText} ${!batter?.eDismissal === null ? 'text-primary' : 'text-secondary'}`}>
                    {!batter?.eDismissal === null ? t('common:Notout') : batter?.sHowOut}
                  </span>
                </span>
              </td>
              {Object.keys(table.current)?.map((value, index) => {
                return <td key={index}>{batter[value]}</td>
              })}
            </tr>
          )
        })}
        <tr>
          <td colSpan="6" className={`${styles.YetToBat}`}>
            <span className="text-uppercase font-bold">{t('common:YetToBat')}: </span>
            <span className={`${styles.subText} text-wrap ms-1`}>{result?.length > 0 ? result?.map((ytb, index) => <span key={index}>{index ? ', ' : ''}{ytb?.sName}{ytb?.sRoleStr === 'wk' && ` (${t('common:Wk')})`}{ytb?.sRoleStr === 'cap' && ` (${t('common:c')})`}
            {ytb?.sRoleStr === 'wkcap' && ` (${t('common:WkCap')})`}</span>) : ' - '}</span>
          </td>
        </tr>
        <tr>
          <td className="text-uppercase font-bold">
            <span className="d-flex flex-column flex-md-row">
              <span>{t('common:Extra')}</span>
              <span className={`${styles.subText}`}>
                ( {t('common:b')} - {data?.oExtraRuns?.nByes}, {t('common:w')} - {data?.oExtraRuns?.nWides}, {t('common:no')} -{' '}
                {data?.oExtraRuns?.nNoBalls}, {t('common:lb')} - {data?.oExtraRuns?.nLegByes}, {t('common:p')} -{' '}
                {data?.oExtraRuns?.nPenalty === null ? '0' : data?.oExtraRuns?.nPenalty} )
              </span>
            </span>
          </td>
          <td>{data?.oExtraRuns?.nTotal}</td>
          <td colSpan="4"> </td>
        </tr>
        <tr className="highlight">
          <td className="text-uppercase font-bold">
            <span className="d-flex flex-column flex-md-row">
              <span>{t('common:Total')}</span>
              <span className={`${styles.subText}`}>
                ( {data?.oEquations?.sRunRate} {t('common:RunsPerOver')} )
              </span>
            </span>
          </td>
          <td>{data?.oEquations?.nRuns}{(data?.oEquations?.sOvers && data?.oEquations?.nWickets >= 0) && ` (${data?.oEquations?.nWickets} ${t('common:Wkts')}, ${data?.oEquations?.sOvers} ${t('common:Ov')})`}</td>
          <td colSpan="4"> </td>
        </tr>
      </ThemeTable>
    </div>
  )
}

ScorecardTable.propTypes = {
  data: PropTypes.object,
  fullSquad: PropTypes.array
}

export default ScorecardTable
