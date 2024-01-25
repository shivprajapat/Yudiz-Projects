import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { LeftArrow, RightArrow } from '@shared/components/ctIcons'
import { addAdsInsideParagraph, checkIsGlanceView, checkPageNumberInSlug } from '@shared/utils'
import { DOMAIN } from '@shared/constants'
import Head from 'next/head'
import CustomLink from '@shared/components/customLink'
// import Link from 'next/link'
// import { removeSlot } from '@shared/libs/ads'

const InnerHTML = dynamic(() => import('@shared/components/InnerHTML'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))

function ListicleArticle({ article, outerStyle }) {
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)
  const { lastSlug, slug } = checkPageNumberInSlug(router?.asPath?.split('/').filter(e => e))
  const index = Number(lastSlug) || 1
  const prevURL = index === 1 ? `/${slug?.join('/')}` : `/${slug?.join('/')}/${index - 1}/`
  const nextURL = `/${slug?.join('/')}/${index + 1}/`
  // const [index, setIndex] = useState(Number(lastSlug) || 1)
  // const allowScroll = useRef(false)
  // const next = getNext()
  // const prev = getPrev()

  // function handleClick(i) {
  //   setIndex(i)
  // }

  // useEffect(() => {
  //   if (allowScroll.current) {
  //     const url = index === 1 ? slug?.join('/') : `${slug?.join('/')}/${index}`
  //     router.push({
  //       pathname: url,
  //       search: params
  //     }, undefined, { shallow: true })
  //     // const listicle = document.getElementById('listicle')?.offsetTop
  //     window.scrollTo({ top: 0, behavior: 'smooth' })
  //   } else allowScroll.current = true
  // }, [index])

  // function handlePrev() {
  //   // removeSlot()
  //   router.push(prevURL)
  // }

  // function handleNext() {
  //   // removeSlot()
  //   router.push(nextURL)
  // }

  return (
    <>
      <Head>
        {index > 1 && <link rel="prev" href={DOMAIN + prevURL?.substring(1)} />}
        {(index < article?.oListicleArticle?.nTotal) && <link rel="next" href={DOMAIN + nextURL?.substring(1)} />}
      </Head>
      <CommonContent>
        <InnerHTML
          id="content"
          className={`${outerStyle.content}`}
          html={addAdsInsideParagraph(
            article?.oListicleArticle?.oPageContent[index - 1],
            [isGlanceView ? 1 : index === 1 ? 1 : 0],
            isGlanceView ? 2 : index === 1 ? 1 : 0
          )}
        />
      </CommonContent>
      <div className={`${styles.pageBox} d-flex align-items-center justify-content-center`}>
        <CustomLink href={prevURL} unWrapNextLink={false}>
          <a
            className={`${styles.listArticleNav} theme-btn btn btn-primary ${index === 1 ? styles.disabled : ''}`}
          // variant="primary"
          // disabled={index === 1}
          // href={prevURL}
          // onClick={() => handlePrev()}
          >
            <LeftArrow />
            <Trans i18nKey="common:Prev" />
          </a>
        </CustomLink>
        <div className={styles.pageCount}>
          <Trans i18nKey="common:Page" />
          <span>{index}</span> / {article?.oListicleArticle?.nTotal}
        </div>
        <CustomLink href={nextURL} unWrapNextLink={false}>
          <a
            className={`${styles.listArticleNav} theme-btn btn btn-primary ${index === article?.oListicleArticle?.nTotal ? styles.disabled : ''}`}
            // variant="primary"
            // disabled={index === article?.oListicleArticle?.nTotal}
            href={nextURL}
          // onClick={() => handleNext()}
          >
            <Trans i18nKey="common:Next" />
            <RightArrow />
          </a>
        </CustomLink>
      </div>
    </>
  )
}
ListicleArticle.propTypes = {
  article: PropTypes.object,
  outerStyle: PropTypes.object
}

export default ListicleArticle
