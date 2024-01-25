import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import clapIcon from '@assets/images/icon/clap-theme-icon.svg'
import commentIcon from '@assets/images/icon/comment-theme-icon.svg'
import { Button } from 'react-bootstrap'
const MyImage = dynamic(() => import('@shared/components/myImage'))

function LikeComment({ article, totalClaps, commentCount, setShowComments, handleAddClap }) {
  const { t } = useTranslation()
  return (
    <div className={`${styles.likeComment} py-2 px-2 d-flex flex-1 align-items-center font-semi mt-3 mt-md-3 br-md`}>
      {((article?.oSeo?.eType === 'ar' && article?.oAdvanceFeature?.bAllowLike) || (article?.oSeo?.eType === 'fa')) && (
        <Button
          variant="link"
          onClick={() => handleAddClap()}
          className={`${styles.item} text-dark py-md-1 d-flex align-items-center justify-content-center`}
        >
          <span className={`${styles.icon} me-2 me-xl-3`}>
            <MyImage src={clapIcon} alt="Likes" layout="responsive" height="32" width="32" />
          </span>
          <span>{totalClaps} {t('common:Likes')}</span>
        </Button>
      )}
      {article?.oAdvanceFeature?.bAllowComments && (
        <Button onClick={() => setShowComments(true)} variant="link" className={`${styles.item} text-dark py-md-1 d-flex align-items-center justify-content-center`}>
          <span className={`${styles.icon} me-2 me-xl-3`}>
            <MyImage src={commentIcon} alt="Comments" layout="responsive" height="32" width="32" />
          </span>
          <span>{commentCount} {t('common:Comments')}</span>
        </Button>
      )}
    </div>
  )
}

LikeComment.propTypes = {
  article: PropTypes.object,
  totalClaps: PropTypes.number,
  commentCount: PropTypes.number,
  handleAddClap: PropTypes.func,
  setShowComments: PropTypes.func
}

export default LikeComment
