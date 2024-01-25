import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { TOP_TEAMS } from '@graphql/globalwidget/rankings.query'
import earthIcon from '@assets/images/icon/earth-dark-icon.svg'
import CustomLink from '@shared/components/customLink'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { getImgURL } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

function TopTeams() {
  const { t } = useTranslation()

  const { data, loading } = useQuery(TOP_TEAMS, {
    variables: { input: { eMatchType: 'Odis', eRankType: 'Teams', nLimit: 10, nSkip: 0, eGender: 'M' } }
  })
  return (
    <>
      {data?.getRankings?.aResults?.length !== 0 && <section className="widget">
        <div className="widget-title">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className="icon me-1">
              <MyImage src={earthIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            {t('common:TopTeams')}
          </h3>
        </div>
        <div className={`${styles.items} d-flex flex-wrap font-semi text-center justify-content-between`}>
          {data?.getRankings?.aResults?.map((team) => {
            return (
              <React.Fragment key={team?._id}>
                {team?.oTeams?.eTagStatus === 'a' ? <CustomLink href={`/${team?.oTeams?.oSeo?.sSlug}`} prefetch={false}>
                  <a className={`${styles.item} ${styles.itemLink} common-box px-1 mb-2 position-relative overflow-hidden br-md`}>
                    <div className={`${styles.flag} position-absolute top-50 translate-middle-y end-0 `}>
                      <MyImage src={getImgURL(team?.oTeams?.oImg?.sUrl) || noImage} alt="team" width="24" height="24" layout="responsive" />
                    </div>
                    <span className={`${styles.name} position-relative d-flex ps-2`}>{team?.sName}</span>
                  </a>
                </CustomLink> : <div key={team?._id} className={`${styles.item} common-box px-1 mb-2 position-relative`}>
                  <span className={`${styles.name} position-relative d-flex ps-2`}>{team?.sName}</span>
                </div>}
              </React.Fragment>
            )
          })}
        </div>
        {loading && [0, 1, 2].map(e => (
          <div key={e} className='d-flex my-2'>
            <div className='bg-white p-3 w-100 me-1 rounded'>
              <Skeleton height={'20px'} />
            </div>
            <div className='bg-white p-3 w-100 ms-1 rounded'>
              <Skeleton height={'20px'} />
            </div>
          </div>
        ))}
      </section>}
    </>
  )
}

export default TopTeams
