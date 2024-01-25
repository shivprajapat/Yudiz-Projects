import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import rankIcon from '@assets/images/icon/rank-icon-dark.svg'
// import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import CustomLink from '@shared/components/customLink'
import ThemeTable from '@shared/components/themeTable'
import { useQuery } from '@apollo/client'
import { GET_STANDING_DATA } from '@graphql/series/standings.query'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { getImgURL } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

function SeriesPointTable() {
  const { t } = useTranslation()
  const labels = [t('common:No'), t('common:Team'), t('common:M'), t('common:W'), t('common:L'), t('common:PT'), t('common:NRR')]

  const { data, loading } = useQuery(GET_STANDING_DATA, { variables: { input: { iRoundId: null, iSeriesId: '63f052b9d5e097df610db62d', nLimit: 5 } } })

  return (
    <>
      <section className={`${styles.rankingWidget} common-box widget px-2 py-3`}>
        <div className="widget-title d-flex align-items-center justify-content-between">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className={`${styles.icon} icon me-1`}>
              <MyImage src={rankIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            {t('common:IPLPointsTables')}
          </h3>
          <div>
            <CustomLink href={'/ipl-points-table/?ref=hw'} prefetch={false}>
              <a className='theme-text font-semi'>{t('common:ViewAll')}</a>
            </CustomLink>
          </div>
        </div>
        <div className={`${styles.rankingTable}`}>
          <ThemeTable labels={labels}>
            <>
              {!loading &&
                data?.fetchSeriesStandings?.map((t, i) => {
                  return (
                    <tr key={t?._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {t?.oTeam?.eTagStatus === 'a' ? (
                            <CustomLink href={t?.oTeam?.oSeo?.sSlug}>
                              <a className="d-flex align-items-center">
                                <MyImage alt={t?.oTeam?.sAbbr || 'team'} src={getImgURL(t?.oTeam?.oImg?.sUrl) || noImage} width="20" height="20" layout="fixed" />
                                <span className="ms-1 theme-text">{t?.oTeam?.sAbbr}</span>
                              </a>
                            </CustomLink>
                          ) : (
                            <>
                              <MyImage alt={t?.oTeam?.sAbbr || 'team'} src={getImgURL(t?.oTeam?.oImg?.sUrl) || noImage} width="20" height="20" layout="fixed" />
                              <span className="ms-1">{t?.oTeam?.sAbbr}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>{t?.nPlayed}</td>
                      <td>{t?.nWin}</td>
                      <td>{t?.nLoss}</td>
                      <td>{t?.nPoints}</td>
                      <td>{t?.nNetrr}</td>
                    </tr>
                  )
                })}
              {loading && [0, 1, 2, 3, 4].map((_, i) => (
                <tr key={`${i}_loader`}>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                  <td><Skeleton height={'20px'} /></td>
                </tr>
              ))}
            </>
          </ThemeTable>
        </div>
      </section>
    </>
  )
}

export default SeriesPointTable
