import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import useModal from '@shared/hooks/useModal'

import Skeleton from '@shared/components/skeleton'
import useTranslation from 'next-translate/useTranslation'

const BreadcrumbNavAMP = dynamic(() => import('@shared-components/amp/breadcrumbNavAMP'), {
  loading: () => (
    <div className="d-flex">
      <Skeleton width={'20px'} />
      <Skeleton width={'40px'} className={'ms-2 me-2'} />
      <Skeleton width={'20px'} />
    </div>
  )
})
const LoginModal = dynamic(() => import('@shared/components/loginModal'))

const PageHeaderAMP = ({ isFavorite: favItem, id, type, name, favBtn, desc, seoData }) => {
  const { isShowing, toggle } = useModal()
  const { t } = useTranslation()

  function showDescription() {
    if (desc && (seoData?._id !== '6396dd2588e3e61623afa20a' && seoData?._id !== '630ca60ff22e6651888369d3' && seoData?._id !== '6396dd2988e3e61623afa355')) {
      return true
    } else return false
  }

  return (
    <>
      <style jsx amp-custom global>{`
   .pageHeader{margin-bottom:16px;padding:16px 16px 12px 16px;background:var(--light-mode-bg);border-radius:16px}.pageHeader table tr:first-child td{background:#045de9;color:#fff}.pageHeader table td{background-color:var(--theme-bg)}[class*=truncate-expanded-slot],[class*=truncate-collapsed-slot]{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.read-more-less-btn{margin-left:auto;padding:5px 12px;display:block;background:#045de9;font-size:12px;line-height:18px;color:#fff;text-align:center;font-weight:700;border:1px solid #045de9;border-radius:2em;cursor:pointer}.action-btn{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.truncate-text{margin-bottom:8px}.desc p{margin-bottom:12px}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <section className="pageHeader">
        <div className="d-flex align-items-start justify-content-between">
          <BreadcrumbNavAMP />
        </div>
        <h1 className="d-flex align-items-start align-items-md-center flex-column flex-md-row flex">
          {name}
        </h1>
        {showDescription() && (
          <amp-truncate-text layout="fixed-height" height="7em">
            <div className="desc active truncate-text big-text" dangerouslySetInnerHTML={{ __html: desc }}></div>
            <div slot="collapsed" className="action-btn">
              <button className="read-more-less-btn">{t('common:ReadMore')}</button>
            </div>
            <div slot="expanded" className="demo">
              <button className="read-more-less-btn">{t('common:ReadLess')}</button>
            </div>
          </amp-truncate-text>
        )}
      </section>
      {isShowing && <LoginModal isConfirm={isShowing} closeConfirm={toggle} />}
    </>
  )
}

PageHeaderAMP.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  desc: PropTypes.string,
  favBtn: PropTypes.bool,
  link: PropTypes.string,
  type: PropTypes.string,
  isFavorite: PropTypes.bool,
  seoData: PropTypes.object
}

export default PageHeaderAMP
