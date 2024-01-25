import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { articleLoader } from '@shared/libs/allLoader'
const ArticleBig = dynamic(() => import('@shared/components/article/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleGrid = dynamic(() => import('@shared/components/article/articleGrid'), { loading: () => articleLoader(['g']) })
const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })

const TrendingVideos = ({ data }) => {
  const { t } = useTranslation()
  return (
    <>
      <h4 className="text-uppercase">{t('common:TrendingVideo')}</h4>
      <Row>
        <Col lg={6}>
          {
            data?.slice(0, 1).map((video) => {
              return (
                <ArticleBig key={1} isVideo={true} data={video} />
              )
            })
          }
        </Col>
        <Col lg={6}>
          <Row className={styles.articleSideList}>
            {
              data?.slice(1, 5).map((video) => {
                return (
                  <Col key={video?._id} sm={6}>
                    <ArticleGrid isVideo={true} data={video} />
                  </Col>
                )
              })
            }
            {/* For ADs
                <Col sm={6} className="align-self-center">
                  <MyImage src={ads1} alt="post" placeholder="blur" layout="responsive" />
                </Col> */}
          </Row>
        </Col>
      </Row>
      {data?.length === 0 && <NoData />}
    </>
  )
}

TrendingVideos.propTypes = {
  data: PropTypes.array
}

export default TrendingVideos
