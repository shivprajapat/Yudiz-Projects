import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import artwork from '@assets/images/error-artwork.svg'
import Trans from 'next-translate/Trans'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function PageError({ title = 'SomethingWentWrong' }) {
  return (
    <section
      className={`${styles.pageError} common-section d-flex justify-content-center align-items-center text-center text-secondary text-center`}
    >
      <div>
        <h1 className="mb-0"><Trans i18nKey={`common:${title}`} />. </h1>
        <div className={`${styles.artwork} mx-auto my-3 my-md-4`}>
          <MyImage src={artwork} width="162" height="162" alt="post" layout="responsive" />
        </div>
        <h5><Trans i18nKey={'common:NotFoundMsg'} /></h5>
        <Link href="/">
          <a className={`${styles.btn} theme-btn mt-2`}>
            <Trans i18nKey={'common:ReadTopArticles'} />
          </a>
        </Link>
      </div>
    </section>
  )
}
PageError.propTypes = {
  title: PropTypes.string
}
export default PageError
