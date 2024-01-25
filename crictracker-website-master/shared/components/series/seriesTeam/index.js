import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import TeamImage from '@assets/images/placeholder/team-placeholder.jpg'
import { S3_PREFIX } from '@shared/constants'
import CustomLink from '@shared/components/customLink'

const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))

function SeriesTeam({ data }) {
  const { t } = useTranslation()
  const teams = data?.listSeriesTeams?.aTeams?.filter((data) => data?._id !== '622d96830961155e958ac6cf')

  return (
    <section>
      {data?.listSeriesTeams && (
        <>
          <h4 className="text-uppercase text-center text-sm-start">{t('common:Teams')}</h4>
          <Row className={`${styles.teamList} text-sm-center`}>
            {teams?.map((team) => {
              return (
                <Col key={team?._id} xl={3} md={4} sm={6}>
                  <CustomLink href={'/' + team?.oSeo?.sSlug || ''} prefetch={false}>
                    <a className={`${styles.team} ${team?.eTagStatus === 'p' ? 'disabled' : ''} py-2 px-3 p-md-3 light-bg d-flex flex-sm-column align-items-center opacity-100 mb-2 mb-md-4 br-sm c-transition`}>
                      <div className={`${styles.teamLogo} mx-auto rounded-circle overflow-hidden mb-sm-n1`}>
                        <MyImage
                          src={team?.oImg?.sUrl ? `${S3_PREFIX}${team?.oImg?.sUrl}` : TeamImage}
                          alt={team?.sTitle}
                          width={112}
                          height={112}
                          layout="responsive"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className={`${styles.name} mt-sm-3 mb-0 ps-2 pd-sm-0 fw-bold`}>{team?.sTitle}</p>
                      </div>
                    </a>
                  </CustomLink>
                </Col>
              )
            })}
          </Row>
        </>
      )}
      {!data?.listSeriesTeams && <NoData />}
    </section>
  )
}
SeriesTeam.propTypes = {
  data: PropTypes.object
}

export default SeriesTeam
