import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'

import styles from './style.module.scss'
import { CRIC_SPECIAL } from '@graphql/home/home.query'
// import Slider from '@shared/components/slider'
import starIcon from '@assets/images/icon/star-fill-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Slider = dynamic(() => import('@shared/components/slider'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const CricSpecialContent = dynamic(() => import('./cricSpecialContent'), {
  loading: () => (
    <div>
      <Skeleton height={'200px'} radius={'10px'} />
      <Skeleton className={'my-2'} width={'50px'} />
    </div>
  )
})

function CricSpecial() {
  const { t } = useTranslation()

  const { data, loading } = useQuery(CRIC_SPECIAL, {
    variables: { input: { nSkip: 0, nLimit: 5 } }
  })

  return (
    <>
      {data?.getCricSpecial?.aResults.length !== 0 && <div className={`${styles.cricSpecial} cric-special widget p-3 br-lg`}>
        <h3 className="small-head d-flex align-items-center text-uppercase justify-content-center justify-content-md-start">
          <span className={`${styles.icon} me-2`}>
            <MyImage src={starIcon} alt="winner" width="24" height="24" layout="responsive" />
          </span>
          <span>{t('common:CricSpecial')}</span>
        </h3>
        {!loading && <Slider destroyBelow={1199} autoplay single dots className="process-arrow">
          {data?.getCricSpecial?.aResults.map((cricSpecial) => (
            <CricSpecialContent
              key={cricSpecial._id}
              title={cricSpecial.sTitle}
              category={cricSpecial?.oCategory?.sName}
              imgURL={cricSpecial}
              redirectURL={cricSpecial?.oSeo?.sSlug}
            />
          ))}
        </Slider>}
        {loading && (
          <>
            <Skeleton className={'mb-3'} height={'24px'} width={'46%'} />
            <Skeleton height={'150px'} radius={'10px'} />
            <Skeleton className={'my-2'} width={'50px'} />
            <Skeleton height={'38px'} width={'100%'} />
            <div className="d-flex justify-content-between mt-3">
              <Skeleton height={'4px'} width={'19.4%'} />
              <Skeleton height={'4px'} width={'19.4%'} />
              <Skeleton height={'4px'} width={'19.4%'} />
              <Skeleton height={'4px'} width={'19.4%'} />
              <Skeleton height={'4px'} width={'19.4%'} />
            </div>
          </>
        )}
      </div>}
    </>
  )
}

export default CricSpecial
