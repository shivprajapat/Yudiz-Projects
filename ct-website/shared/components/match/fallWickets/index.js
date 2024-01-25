import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

const FallWickets = ({ data }) => {
  const { t } = useTranslation()
  return (
    <section className={`${styles.fallWickets} common-box p-0 mb-3`}>
      <div className={`${styles.head}`}>
        <p className="text-uppercase text-primary font-bold mb-0">{t('common:FallOfWickets')}</p>
      </div>
      <div className={`${styles.content}`}>
        <p className="mb-0 text-secondary">
          {data?.aFOWs?.map((fow, index) => {
            return (
              <React.Fragment key={index}>
                <span className="text-dark font-semi" key={index}>
                  {index ? ', ' : ''}
                  {fow?.nScoreDismissal}-{fow?.nWicketNumber}
                </span>{' '}
                ({fow?.oBatter?.eTagStatus === 'a' ? <Link href={`/${fow?.oBatter?.oSeo?.sSlug}`} prefetch={false}><a>{fow?.oBatter?.sFullName || fow?.oBatter?.sShortName}</a></Link> : (fow?.oBatter?.sFullName || fow?.oBatter?.sShortName)}, {fow?.sOverDismissal})
              </React.Fragment>
            )
          })}
        </p>
      </div>
    </section>
  )
}

FallWickets.propTypes = {
  data: PropTypes.object
}

export default FallWickets
