import React, { useState, useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery, useMutation } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from '@assets/scss/components/page-header.module.scss'
import { TOAST_TYPE } from '@shared/constants'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { ADD_FAVOURITE, DELETE_FAVOURITE } from '@graphql/category/category.mutation'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import useModal from '@shared/hooks/useModal'

import Skeleton from '@shared/components/skeleton'
import { IS_FAVORITE_CATEGORY } from '@graphql/category/category.query'
import { IS_TAG_FAVORITE } from '@graphql/tag/tag.query'
import { getToken } from '@shared/libs/token'
import { HeartIcon } from '@shared-components/ctIcons'

const BreadcrumbNav = dynamic(() => import('@shared-components/breadcrumbNav'), {
  loading: () => (
    <div className="d-flex">
      <Skeleton width={'20px'} />
      <Skeleton width={'40px'} className={'ms-2 me-2'} />
      <Skeleton width={'20px'} />
    </div>
  )
})
const SocialShare = dynamic(() => import('@shared-components/socialShare'))
const LoginModal = dynamic(() => import('@shared/components/loginModal'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))

const PageHeader = ({ isFavorite: favItem, id, type, name, favBtn, desc, seoData }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const { stateGlobalEvents } = useContext(GlobalEventsContext)
  const [isFavorite, setIsFavorite] = useState(favItem)
  const [showMore, setShowMore] = useState(false)
  const { isShowing, toggle } = useModal()
  const token = getToken()

  const [checkCategoryIsFav] = useLazyQuery(IS_FAVORITE_CATEGORY, {
    fetchPolicy: 'network-only',
    variables: { input: { _id: id } },
    onCompleted: (data) => {
      setIsFavorite(data?.getCategoryByIdFront?.bIsFav)
    }
  })
  const [checkTagIsFav] = useLazyQuery(IS_TAG_FAVORITE, {
    fetchPolicy: 'network-only',
    variables: { input: { _id: id, eType: type } },
    onCompleted: (data) => {
      setIsFavorite(data?.getTagByIdFront?.bIsFav)
    }
  })

  const handleDesc = () => {
    setShowMore(!showMore)
  }

  const handleFavorite = (isFavorite) => {
    if (token) {
      if (isFavorite) {
        deleteFavorite({ variables: { input: { iPageId: id } } })
      } else {
        addFavorite({ variables: { input: { eType: type, iId: id } } })
      }
    } else {
      toggle()
    }
  }

  const [addFavorite] = useMutation(ADD_FAVOURITE, {
    onCompleted: (data) => {
      if (data && data.addFavourite !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addFavourite.sMessage, type: TOAST_TYPE.Success }
        })
        setIsFavorite(true)
      }
    }
  })

  const [deleteFavorite] = useMutation(DELETE_FAVOURITE, {
    onCompleted: (data) => {
      if (data && data.deleteFavourite !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFavourite.sMessage, type: TOAST_TYPE.Success }
        })
        setIsFavorite(false)
      }
    }
  })

  useEffect(() => {
    if (stateGlobalEvents && stateGlobalEvents.favouriteData === id) {
      setIsFavorite(false)
    }
  }, [stateGlobalEvents])

  useEffect(() => {
    setIsFavorite(favItem)
    const t = getToken()
    if (t && t !== 'undefined' && t !== 'null' && type) {
      if (type === 's' || type === 'as' || type === 'fac') checkCategoryIsFav()
      else checkTagIsFav()
    }
  }, [id])

  // function setText(text) {
  //   if (text.length <= 150) return text
  //   if (text.length > 150 && showMore) {
  //     return text
  //   }
  //   if (text.length > 150 && !showMore) {
  //     return text.slice(0, 150) + '...'
  //   }
  // }

  function showDescription() {
    if (desc && (seoData?._id !== '6396dd2588e3e61623afa20a' && seoData?._id !== '630ca60ff22e6651888369d3' && seoData?._id !== '6396dd2988e3e61623afa355')) {
      return true
    } else return false
  }

  return (
    <>
      <section className={`${styles.pageHeader} light-bg p-3 p-sm-4 br-lg position-relative`}>
        <div className={`${styles.breadcrumbNav} d-flex align-items-start justify-content-between`}>
          <BreadcrumbNav />
          {type !== 'gt' && (
            <SocialShare seoData={seoData} />
          )}
        </div>
        <div className={`${styles.title} d-flex align-items-center`}>
          <h1 className="mb-0">{name}</h1>
          {favBtn && (
            <CtToolTip tooltip={t(isFavorite ? 'common:RemoveFromFavorite' : 'common:AddToFavorite')}>
              <Button
                onClick={() => handleFavorite(isFavorite)}
                variant="link"
                className={`${isFavorite && styles.favorite} ${styles.favBtn} rounded-circle ms-2 ms-xl-3 d-inline-flex align-items-center justify-content-center flex-shrink-0`}
              >
                {/* {t(isFavorite ? 'common:AddedToFavorite' : 'common:AddToFavorite')} */}
                <HeartIcon />
              </Button>
            </CtToolTip>
          )}
        </div>
        {/* {props.desc && <p className="big-text">{props.desc}</p>} */}
        {showDescription() && (
          <div className={`${styles.desc} ${showMore && styles.active} ${!showMore && styles.clamp} ${!showMore && 't-ellipsis line-clamp-3 overflow-hidden position-relative c-transition'} big-text`}>
            <CommonContent isDark isSmall>
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </CommonContent>
          </div>
        )}
        {showDescription() && desc.length > 150 && (
          <div className="text-end">
            <Button className={`${styles.readMore} theme-btn small-btn d-inline-flex align-item-center mt-2 mt-md-3`} onClick={handleDesc}>
              {t(showMore ? 'common:ReadLess' : 'common:ReadMore')}
            </Button>
          </div>
        )}
      </section>
      {isShowing && <LoginModal isConfirm={isShowing} closeConfirm={toggle} />}
    </>
  )
}

PageHeader.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  desc: PropTypes.string,
  favBtn: PropTypes.bool,
  link: PropTypes.string,
  type: PropTypes.string,
  isFavorite: PropTypes.bool,
  seoData: PropTypes.object
}

export default PageHeader
