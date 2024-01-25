import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'
import { getSeriesCategory } from '../../redux/actions/leaderBoard'

function LeaderBoard (Component) {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const { data: activeSports } = useActiveSports()
    const seriesList = useSelector(state => state.leaderBoard.seriesList)
    const getCategoryList = useSelector(state => state.leaderBoard.getCategoryList)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const [loading, setLoading] = useState(false)
    const [loadingCategoryList, setLoadingCategoryList] = useState(false)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const [CategoryList, setCategoryList] = useState([])
    const previousProps = useRef({ seriesList, getCategoryList }).current

    useEffect(() => {
      // (!activeSports || activeSports.length === 0) &&
      // onGetActiveSports()
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [token])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.seriesList !== seriesList) {
        if (seriesList) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.seriesList = seriesList
      }
    }, [seriesList])

    useEffect(() => {
      if (previousProps.getCategoryList !== getCategoryList) {
        if (getCategoryList) {
          setCategoryList(getCategoryList)
          setLoadingCategoryList(false)
        }
      }
      return () => {
        previousProps.getCategoryList = getCategoryList
      }
    }, [getCategoryList])

    function getSeriesCategories (id) {
      if (id) {
        dispatch(getSeriesCategory(id))
        setLoadingCategoryList(true)
      }
    }

    // function onGetActiveSports () {
    //   dispatch(GetActiveSports())
    // }

    return (
      <Component
        {...props}
        CategoryList={CategoryList}
        activeSports={activeSports}
        currencyLogo={currencyLogo}
        getCategoryList={getCategoryList}
        getSeriesCategory={getSeriesCategories}
        loading={loading}
        loadingCategoryList={loadingCategoryList}
        url={url}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default LeaderBoard
