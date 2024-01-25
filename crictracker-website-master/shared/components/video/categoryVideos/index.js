import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { payload } from '../../../libs/category'
import { isBottomReached } from '@utils'
import { articleLoader } from '@shared/libs/allLoader'
import { LIST_CATEGORY_WISE_VIDEO } from '@graphql/videos/videos.query'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'
const ArticleGrid = dynamic(() => import('@shared/components/article/articleGrid'), { loading: () => articleLoader(['g']) })

const CategoryVideos = ({ data }) => {
  const { t } = useTranslation()
  const [videosData, setVideosData] = useState(data)
  const loading = useRef(false)
  const payloadVideos = useRef({ ...payload(4) })
  const isMoreData = useRef(true)

  const [getCategoryVideo, { data: categoryVideo }] = useLazyQuery(LIST_CATEGORY_WISE_VIDEO)

  useEffect(() => {
    loading.current = false
    isBottomReached(videosData[videosData?.length - 1]?._id, isReached)
  }, [videosData])

  useEffect(() => {
    const value = categoryVideo?.listCategoryWiseVideo
    if (value) {
      isMoreData.current = value?.aResults?.length === 4
      setVideosData([...videosData, ...value?.aResults])
    }
  }, [categoryVideo])

  async function isReached(reach) {
    if (reach && !loading.current && isMoreData.current) {
      loading.current = true
      setPayload()
      getMoreData()
    }
  }

  async function getMoreData() {
    const { data } = await getCategoryVideo({ variables: { input: { ...payloadVideos.current } } })
    return data?.listCategoryWiseVideo?.aResults
  }

  function setPayload() {
    payloadVideos.current = { ...payloadVideos.current, nSkip: payloadVideos.current.nSkip + 1 }
  }

  return (
    <>
      {
        videosData?.map((category) => {
          return (
            <section key={category?._id} className="common-section pt-3" id={category?._id}>
              <div className={'mb-3 d-flex justify-content-between align-items-center'}>
                <h4 className="text-uppercase mb-0">{category?.sName}</h4>
                <CustomLink href={`${category?.oSeo?.sSlug}/${category?.oCategory?.eType === 's' ? '?tab=videos' : category?.oSeo?.eType !== 'pl' ? `${allRoutes.cricketVideo}` : ''}`} prefetch={false}>
                  <a className={`${styles.link} text-primary fw-bold text-uppercase`}>{t('common:ViewAll')}</a>
                </CustomLink>
              </div>
              <Row className={`${styles.articleGridList} scroll-list article-grid-list flex-nowrap`}>
                {
                  category?.aVideos?.map((video) => {
                    return (
                      <Col key={video?._id} lg={3} md={4} sm={5} xs="auto">
                        <ArticleGrid isVideo={true} data={video} />
                      </Col>
                    )
                  })
                }
                {/* For ADs
                    <Col lg={3} md={4} sm={5} xs="auto" className="align-self-center">
                      <MyImage src={ads1} alt="post" placeholder="blur" layout="responsive" />
                    </Col> */}
              </Row>
            </section>
          )
        })
      }
    </>
  )
}

CategoryVideos.propTypes = {
  data: PropTypes.array,
  nTotal: PropTypes.number
}

export default CategoryVideos
