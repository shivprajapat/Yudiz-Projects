import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import profileStyles from '../profile-style.module.scss'
import { EditIcon, VerifiedIcon } from '@shared/components/ctIcons'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'

function ProfileContentHelper(data) {
  const userGender = (name) => {
    switch (name) {
      case 'm':
        return <Trans i18nKey="common:Male" />
      case 'f':
        return <Trans i18nKey="common:Female" />
      case 'o':
        return <Trans i18nKey="common:Other" />
      default:
        return '-'
    }
  }
  return (
    <div className={`${profileStyles.profileInner} flex-grow-1`}>
      <div className={`${styles.title} d-flex align-items-center justify-content-between`}>
        <h4 className="font-semi">
          <Trans i18nKey="common:Profile" />
        </h4>
        <CustomLink href={allRoutes.profileEdit} prefetch={false}>
          <a className={`${styles.edit} theme-btn outline-btn small-btn d-inline-flex align-items-center`}>
            <EditIcon /> <Trans i18nKey="common:Edit" />
          </a>
        </CustomLink>
      </div>
      <div className={`${styles.fullname} d-flex align-items-baseline`}>
        <h3 className="me-2 mb-0">{data?.sFullName}</h3>
        <p className="mb-0 text-secondary">{data?.sUsername}</p>
      </div>
      <Row>
        <Col lg={4} md={6}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:EmailAddress" />
            </p>
            <p className="d-flex align-items-center">
              <span className="me-1">{data?.sEmail}</span>
              {data?.bIsEmailVerified && <VerifiedIcon />}
            </p>
          </div>
        </Col>
        <Col lg={4} xs={6}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:Gender" />
            </p>
            <p>{userGender(data?.eGender)}</p>
          </div>
        </Col>
        <Col lg={4} xs={6}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:DateOfBirth" />
            </p>
            <p>{data?.dDOB ? new Date(Number(data?.dDOB)).toLocaleDateString() : '-'}</p>
          </div>
        </Col>
        <Col lg={4} xs={6}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:City" />
            </p>
            <p>{data?.sCity || '-'}</p>
          </div>
        </Col>
        <Col lg={4} xs={6}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:Country" />
            </p>
            <p>{data?.oCountry?.sName || '-'}</p>
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={12}>
          <div className={`${styles.field} mb-3 mb-md-4`}>
            <p className={`${styles.label} text-secondary xsmall-text`}>
              <Trans i18nKey="common:Bio" />
            </p>
            <p className="text-break">{data?.sBio || '-'}</p>
          </div>
        </Col>
      </Row>
      {data?.aSLinks?.eSocialNetworkType && <hr />}
      {data?.aSLinks?.eSocialNetworkType && (
        <Row>
          <Col lg={4} xs={6}>
            <div className={`${styles.field} mb-3 mb-md-4`}>
              <p className={`${styles.label} text-secondary xsmall-text`}>
                <Trans i18nKey="common:SocialNetwork" />
              </p>
              <p>{data?.aSLinks?.eSocialNetworkType}</p>
            </div>
          </Col>
          <Col lg={4} xs={6}>
            <div className={`${styles.field} mb-3 mb-md-4`}>
              <p className={`${styles.label} text-secondary xsmall-text`}>
                <Trans i18nKey="common:DisplayName" />
              </p>
              <p>{data?.aSLinks?.sDisplayName}</p>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className={`${styles.field} mb-3 mb-md-4`}>
              <p className={`${styles.label} text-secondary xsmall-text`}>
                <Trans i18nKey="common:Link" />
              </p>
              <p>{data?.aSLinks?.sLink}</p>
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}
ProfileContentHelper.propTypes = {
  data: PropTypes.object
}
export default ProfileContentHelper
