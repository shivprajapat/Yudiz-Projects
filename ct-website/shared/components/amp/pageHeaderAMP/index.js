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

const PageHeaderAMP = ({ isFavorite: favItem, id, type, name, favBtn, desc }) => {
  const { isShowing, toggle } = useModal()
  const { t } = useTranslation()

  return (
    <>
      <style jsx amp-custom>{`
    .pageHeader{margin-bottom:16px;padding:24px;background:#fff;border-radius:16px}h1{margin:0 0 12px;font-size:36px;line-height:44px;font-weight:800}[class*=truncate-expanded-slot],[class*=truncate-collapsed-slot]{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.read-more-less-btn{margin-left:auto;padding:8px 16px;display:block;background:#045de9;font-size:12px;line-height:18px;color:#fff;text-align:center;font-weight:700;border:1px solid #045de9;border-radius:2em;cursor:pointer}.action-btn{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.truncate-text{white-space:break-spaces;margin-bottom:8px}@media(max-width: 1199px){h1{font-size:32px;line-height:40px}}@media(max-width: 991px){h1{font-size:30px;line-height:40px}}@media(max-width: 767px){h1{font-size:24px;line-height:30px}.pageHeader{padding:20px}.desc{font-size:14px;line-height:20px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <section className="pageHeader">
        <div className="d-flex align-items-start justify-content-between">
          <BreadcrumbNavAMP />
        </div>
        <h1 className="d-flex align-items-start align-items-md-center flex-column flex-md-row flex">
          {name}
        </h1>
        {desc && (
          <amp-truncate-text layout="fixed-height" height="6em">
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
  isFavorite: PropTypes.bool
}

export default PageHeaderAMP
