import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import seriesPlaceholder from '@assets/images/placeholder/series-placeholder.jpg'
import articlePlaceholder from '@assets/images/placeholder/article-placeholder.jpg'
import videoPlaceholder from '@assets/images/placeholder/blur-image.jpg'
import useWindowSize from '@shared/hooks/windowSize'
import SearchDarkIcon from '@assets/images/icon/search-black-icon.svg'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import { allRoutes } from '@shared/constants/allRoutes'
import { bottomReached, debounce, getImgURL } from '@shared/utils'
import { GET_SEARCH_NEWS, GET_SEARCH_PLAYER, GET_SEARCH_SERIES, GET_SEARCH_TEAM, GET_SEARCH_VIDEO } from '@graphql/search/search.query'
import Skeleton from '@shared/components/skeleton'
import styles from './style.module.scss'

const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))
const PlayerImg = dynamic(() => import('@shared/components/playerImg'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

function SearchBox({ isSearchbar, handleSearchBar, setIsSearchbar, handleSidebarMenu }) {
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const [searchSuggestion, setSearchSuggestion] = useState([])
  const search = useRef(null)
  const router = useRouter()
  const loading = useRef(false)
  const dropdownRef = useRef(null)
  const payload = useRef({
    nLimit: 4,
    nSkip: 1,
    sSearch: '',
    sSortBy: 'dCreated',
    nOrder: -1
  })
  const isReachedBottom = useRef(false)
  const searchVideoRef = useRef(4)
  const searchSeriesRef = useRef(4)
  const searchNewsRef = useRef(4)
  const searchTeamRef = useRef(4)
  const searchPlayerRef = useRef(4)

  const typeLabels = {
    p: 'Player',
    se: 'Series',
    ar: 'News',
    vi: 'Video',
    t: 'Team',
    ct: 'Series'
  }

  const [getSearchVideo, { loading: videoSearchLoading }] = useLazyQuery(GET_SEARCH_VIDEO, {
    onCompleted: (data) => {
      if (data && data?.getVideoSearch && data?.getVideoSearch?.aResults) {
        setSearchSuggestion([...searchSuggestion, ...data?.getVideoSearch?.aResults])
        loading.current = false
        isReachedBottom.current = false
        searchVideoRef.current = data?.getVideoSearch?.aResults?.length
      }
    }
  })
  const [getSearchSeries, { loading: seriesSearchLoading }] = useLazyQuery(GET_SEARCH_SERIES, {
    onCompleted: (data) => {
      if (data && data?.getSeriesSearch && data?.getSeriesSearch?.aResults) {
        setSearchSuggestion([...searchSuggestion, ...data?.getSeriesSearch?.aResults])
        loading.current = false
        isReachedBottom.current = false
        searchSeriesRef.current = data?.getSeriesSearch?.aResults?.length
      }
    }
  })
  const [getSearchNews, { loading: newsSearchLoading }] = useLazyQuery(GET_SEARCH_NEWS, {
    onCompleted: (data) => {
      if (data && data?.getArticleSearch && data?.getArticleSearch?.aResults) {
        setSearchSuggestion([...searchSuggestion, ...data?.getArticleSearch?.aResults])
        loading.current = false
        isReachedBottom.current = false
        searchNewsRef.current = data?.getArticleSearch?.aResults?.length
      }
    }
  })
  const [getSearchTeam, { loading: teamSearchLoading }] = useLazyQuery(GET_SEARCH_TEAM, {
    onCompleted: (data) => {
      if (data && data?.getSearchTeam && data?.getSearchTeam?.aResults) {
        setSearchSuggestion([...searchSuggestion, ...data?.getSearchTeam?.aResults])
        loading.current = false
        isReachedBottom.current = false
        searchTeamRef.current = data?.getSearchTeam?.aResults?.length
      }
    }
  })
  const [getSearchPlayer, { loading: playerSearchLoading }] = useLazyQuery(GET_SEARCH_PLAYER, {
    onCompleted: (data) => {
      if (data && data?.getPlayerSearch && data?.getPlayerSearch?.aResults) {
        setSearchSuggestion([...data?.getPlayerSearch?.aResults, ...searchSuggestion])
        loading.current = false
        isReachedBottom.current = false
        searchPlayerRef.current = data?.getPlayerSearch?.aResults?.length
      }
    }
  })

  function handleScroll(e) {
    if (bottomReached(e) && !loading.current && !isReachedBottom.current) {
      loading.current = true
      isReachedBottom.current = true
      payload.current = { ...payload.current, nSkip: payload.current.nSkip + 1, sSearch: search.current.value || '' }
      if (searchVideoRef.current > 0) {
        getSearchVideo({ variables: { input: { ...payload.current } } })
      }
      if (searchSeriesRef.current > 0) {
        getSearchSeries({ variables: { input: { ...payload.current } } })
      }
      if (searchNewsRef.current > 0) {
        getSearchNews({ variables: { input: { ...payload.current } } })
      }
      if (searchTeamRef.current > 0) {
        getSearchTeam({ variables: { input: { ...payload.current } } })
      }
      if (searchPlayerRef.current > 0) {
        getSearchPlayer({ variables: { input: { ...payload.current } } })
      }
    }
  }

  function handleSearch(e) {
    if (search.current.value) {
      e.preventDefault()
      router.push({
        pathname: allRoutes.search,
        query: { q: search.current.value.trim() }
      })
      handleSearchBar(false)
      search.current.value = ''
    }
  }

  const handleSearchSuggestion = debounce((searchInput) => {
    setSearchSuggestion([])
    payload.current = { ...payload.current, nSkip: 1, sSearch: searchInput?.target?.value }
    if (searchInput.target.value.trim()?.length > 0) {
      getSearchVideo({ variables: { input: { ...payload.current } } })
      getSearchSeries({ variables: { input: { ...payload.current } } })
      getSearchNews({ variables: { input: { ...payload.current } } })
      getSearchTeam({ variables: { input: { ...payload.current } } })
      getSearchPlayer({ variables: { input: { ...payload.current } } })
    }
  })

  useEffect(() => {
    isSearchbar && search.current.focus()
  }, [isSearchbar])

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      dropdownRef.current.focus()
    }
  }

  const handleClick = (suggestion) => {
    router.push(`/${suggestion?.oSeo?.sSlug || suggestion?.oCategory?.oSeo?.sSlug || ''}/`)
    setIsSearchbar(false)
    handleSidebarMenu && handleSidebarMenu()
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.querySelector('body')
      if (isSearchbar) {
        document.body.classList.add('overflow-hidden')
        return () => {
          body.classList.remove('overflow-hidden')
        }
      }
    }
  }, [isSearchbar])

  function getImageURL(suggestion) {
    if (suggestion?.oSeo?.eType === 't') {
      return getImgURL(suggestion?.oImg?.sUrl) || teamPlaceholder
    } else if (suggestion?.oSeo?.eType === 'ar') {
      return getImgURL(suggestion?.oImg?.sUrl) || articlePlaceholder
    } else if (suggestion?.oSeo?.eType === 'vi') {
      return getImgURL(suggestion?.sThumbnailUrl) || videoPlaceholder
    } else return seriesPlaceholder
  }
  return (
    <>
      <div className="s-overlay position-fixed start-0 c-transition" onClick={() => handleSearchBar(!isSearchbar)}></div>
      <div className={`${width < 767 || isSearchbar ? 's-active d-flex opacity-100' : ''} searchBox top-50 end-0 align-items-center`}>
        <Form autosuggestion="off" autoComplete="off">
          <CustomFormGroup className="hd-searchGroup position-relative" controlId="search">
            <CustomInput
              autoComplete="off"
              required
              ref={search}
              className="hs-searchControl light-bg rounded-pill font-semi"
              type="text"
              placeholder={t('common:SearchPlaceholder')}
              onChange={(e) => handleSearchSuggestion(e)}
              onKeyDown={handleKeyDown}
            />
            <div className="icon position-absolute top-50 translate-middle-y hs-searchIcon searchBtn">
              <MyImage src={SearchDarkIcon} alt="logo" layout="responsive" />
            </div>
            <Button
              type="submit"
              className="icon position-absolute top-50 translate-middle-y hs-searchBtn theme-btn small-btn"
              onClick={handleSearch}
            >
              <Trans i18nKey="common:Search" />
            </Button>
          </CustomFormGroup>
          <div
            className={`searchSuggestion ${searchSuggestion?.length > 0 ? 'active' : ''} common-box px-0 position-absolute overflow-hidden`}
          >
            <Dropdown show={searchSuggestion?.length > 0} className="itemList px-2 overflow-auto c-transition" onScroll={handleScroll}>
              <Dropdown.Menu tabIndex={0} ref={dropdownRef}>
                {searchSuggestion?.map((suggestion, index) => {
                  const label = typeLabels[suggestion?.oSeo?.eType || suggestion?.oCategory?.oSeo?.eType]
                  return (
                    <Dropdown.Item
                      key={suggestion?._id}
                      className="dropdown-item searchItem d-flex py-2 align-items-center"
                      onClick={() => handleClick(suggestion)}
                      id={suggestion?._id}
                    >
                      <div className={`${styles.icon} rounded-circle overflow-hidden me-2 flex-shrink-0`}>
                        {suggestion?.oSeo?.eType === 'p' ? (
                          <PlayerImg
                            head={suggestion?.oImg}
                            jersey={suggestion?.oPrimaryTeam?.oJersey || suggestion?.oTeam?.oJersey}
                            enableBg
                          />
                        ) : (
                          <MyImage
                            src={getImageURL(suggestion)}
                            alt={suggestion?.sTitle}
                            placeholder="blur"
                            blurDataURL={teamPlaceholder}
                            layout="responsive"
                            width="40"
                            height="40"
                          />
                        )}
                      </div>
                      <div className={`${styles.content} overflow-hidden text-nowrap t-ellipsis`}>
                        {suggestion?.sFullName || suggestion?.sTitle}
                        <div className={`${styles.text}`}>{`${suggestion?.sSeason ? `${suggestion?.sSeason} - ` : ''}`}{label}</div>
                      </div>
                    </Dropdown.Item>
                  )
                })}
                {(videoSearchLoading || seriesSearchLoading || newsSearchLoading || teamSearchLoading || playerSearchLoading) && (
                  <>
                    <div className="dropdown-item searchItem">
                      <Skeleton width={'80%'} className="my-2" />
                    </div>
                    <div className="dropdown-item searchItem">
                      <Skeleton width={'60%'} className="my-2" />
                    </div>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
            {/* <ListGroup className="itemList px-2" onScroll={handleScroll}> */}
            {/* {
              searchSuggestion?.map((suggestion, index) => {
                return (
                  <ListGroup.Item key={index} className="searchItem d-block py-2 overflow-hidden text-nowrap">
                    <CustomLink href={`/${suggestion?.oSeo?.sSlug || ''}`}>
                      <a role="button" tabIndex={0} id={suggestion?._id}>{suggestion?.sFullName || suggestion?.sTitle}</a>
                    </CustomLink>
                  </ListGroup.Item>
                )
              })
            } */}
          </div>
        </Form>
        <CtToolTip tooltip={t('common:Close')}>
          <Button variant="link" onClick={() => handleSearchBar(!isSearchbar)} className="closeBtn ms-2 d-none d-md-inline-block rounded-circle" />
        </CtToolTip>
      </div>
    </>
  )
}
SearchBox.propTypes = {
  handleSearchBar: PropTypes.func,
  setIsSearchbar: PropTypes.func,
  handleSidebarMenu: PropTypes.func,
  isSearchbar: PropTypes.bool
}
export default SearchBox
