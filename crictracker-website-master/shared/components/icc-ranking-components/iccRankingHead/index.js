import React from 'react'
import { Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import pageHeaderStyles from '@assets/scss/components/page-header.module.scss'
import navstyles from '@shared-components/commonNav/style.module.scss'
import menIcon from '@assets/images/icon/men-icon.svg'
import womenIcon from '@assets/images/icon/women-icon.svg'
import { allRoutes } from '@shared/constants/allRoutes'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))

const IccRankingHead = ({ type }) => {
  // const { t } = useTranslation()

  return (
    <section className={`${pageHeaderStyles.pageHeader} ${styles.pageHeader} light-bg  p-3 p-sm-4 br-lg position-relative`}>
      <BreadcrumbNav />
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="mb-0"><Trans i18nKey='common:ICCRankings' /></h1>
        <Nav
          variant="pills"
          className={`${navstyles.commonNav} ${styles.nav} ${navstyles.themeLightNav} equal-width-nav text-uppercase scroll-list flex-nowrap text-nowrap mb-0 overflow-hidden rounded-pill flex-shrink-0`}
        >
          <Nav.Item className={`${navstyles.item}`} >
            <CustomLink href={allRoutes.iccRankings}>
              <a className={`nav-link d-flex align-items-center ${type === 'M' ? `${navstyles.active} ${styles.active}` : ''}`}>
                <span className={`${styles.icon} me-md-1`}>
                  <MyImage src={menIcon} alt="Calender" layout="responsive" />
                </span>
                <span className="d-none d-md-block"><Trans i18nKey='common:Mens' /></span>
              </a>
            </CustomLink>
          </Nav.Item>
          <Nav.Item className={`${navstyles.item}`} >
            <CustomLink href={allRoutes.iccRankingsWomen}>
              <a className={`nav-link d-flex align-items-center ${type === 'F' ? `${navstyles.active} ${styles.active}` : ''}`}>
                <span className={`${styles.icon} me-md-1`}>
                  <MyImage src={womenIcon} alt="Calender" layout="responsive" />
                </span>
                <span className="d-none d-md-block"><Trans i18nKey='common:Womens' /></span>
              </a>
            </CustomLink>
          </Nav.Item>
        </Nav>
      </div>
    </section>
  )
}
IccRankingHead.propTypes = {
  type: PropTypes.oneOf(['M', 'F'])
}
export default IccRankingHead
