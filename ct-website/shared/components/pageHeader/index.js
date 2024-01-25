import React, { useState, useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useMutation } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from '@assets/scss/components/page-header.module.scss'
import { TOAST_TYPE } from '@shared/constants'
import { ToastrContext } from '@shared-components/toastr'
import { ADD_FAVOURITE, DELETE_FAVOURITE } from '@graphql/category/category.mutation'
import { GlobalEventsContext } from '../global-events'
import useModal from '@shared/hooks/useModal'

import Skeleton from '@shared/components/skeleton'
import { getCurrentUser } from '@shared/libs/menu'
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

const PageHeader = ({ isFavorite: favItem, id, type, name, favBtn, desc }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const { stateGlobalEvents } = useContext(GlobalEventsContext)
  const [isFavorite, setIsFavorite] = useState(favItem)
  const [showMore, setShowMore] = useState(false)
  const { isShowing, toggle } = useModal()
  const currentUser = getCurrentUser()

  const handleDesc = () => {
    setShowMore(!showMore)
  }

  const handleFavorite = (isFavorite) => {
    if (currentUser) {
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
  }, [favItem])

  function setText(text) {
    if (text.length <= 150) return text
    if (text.length > 150 && showMore) {
      return text
    }
    if (text.length > 150 && !showMore) {
      return text.slice(0, 150) + '...'
    }
  }

  return (
    <>
      <section className={styles.pageHeader}>
        <div className="d-flex align-items-start justify-content-between">
          <BreadcrumbNav />
          <SocialShare />
        </div>
        <div className={`${styles.title} d-flex align-items-start align-items-md-center flex-column flex-md-row flex`}>
          <h1 className="mb-0">{name}</h1>
          {favBtn && (
            <Button
              onClick={() => handleFavorite(isFavorite)}
              className={`${!isFavorite && 'outline-btn'} theme-btn small-btn  mt-2 mt-md-0 ms-0 ms-md-2 ms-xl-3 flex-shrink-0`}
            >
              {t(isFavorite ? 'common:AddedToFavorite' : 'common:AddToFavorite')}
            </Button>
          )}
        </div>
        {/* {props.desc && <p className="big-text">{props.desc}</p>} */}
        {desc && (
          <div className={`${styles.desc} ${showMore && styles.active} big-text`} dangerouslySetInnerHTML={{ __html: setText(desc) }}></div>
        )}

        {desc && desc.length > 150 && (
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
  isFavorite: PropTypes.bool
}

export default PageHeader
