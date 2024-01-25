import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import { CURRENT_SERIES_LIST } from '@graphql/globalwidget/rankings.query'
import winnerIcon from '@assets/images/icon/cup-dark-icon.svg'
import CustomLink from '@shared/components/customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

function CurrentSeries({ data }) {
  const { t } = useTranslation()

  const [getRankData, { data: series, loading }] = useLazyQuery(CURRENT_SERIES_LIST)

  useEffect(() => {
    if (!data?.aResults) getRankData()
  }, [])

  const list = data?.aResults || series?.getCurrentPopularSeries?.aResults

  return (
    <>
      {list?.length !== 0 &&
        <section className="widget">
          <div className="widget-title">
            <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
              <span className="icon me-1">
                <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
              </span>
              <span>{t('common:CurrentSeries')}</span>
            </h3>
          </div>
          <div className="font-semi">
            {list?.map((series) => {
              return (
                <CustomLink key={series?._id} href={`/${series?.oSeries?.oCategory?.oSeo?.sSlug || series?.oSeries?.oSeo?.sSlug}`} prefetch={false}>
                  <a className="common-box d-block overflow-hidden text-nowrap t-ellipsis br-sm mb-2">{series?.oSeries?.sTitle}</a>
                </CustomLink>
              )
            })}
            {loading && (
              [0, 1, 2, 3, 4].map(i => <div key={i} className='bg-white p-3 rounded mb-2'> <Skeleton height={'20px'} /> </div>)
            )}
          </div>
        </section>
      }
    </>
  )
}

CurrentSeries.propTypes = {
  data: PropTypes.object
}
export default CurrentSeries
