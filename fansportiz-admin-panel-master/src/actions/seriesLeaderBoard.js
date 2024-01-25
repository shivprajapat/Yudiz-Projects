import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { ADD_SERIES_LEADERBOARD, ADD_SERIES_LEADERBOARD_CATEGORY, ADD_SERIES_LEDAERBOARD_PRICEBREAKUP, CLEAR_SERIESLEADERBOARD_MESSAGE, DELETE_SERIES, DELETE_SERIES_CATEGORY, DELETE_SERIES_PRIZEBREAKUP, LB_SERIES_LIST, SERIES_COUNT, SERIES_LB_CATEGORIES_TEMPLATE_LIST, SERIES_LB_CATEGORY_LIST, SERIES_LB_CATEGORY_TEMP_ID, SERIES_LEADERBOARD_CATEGORY_DETAILS, SERIES_LEADERBOARD_DETAILS, SERIES_LEADER_BOARD_USER_RANK, SERIES_NAME_LIST, UPDATE_SERIES_LEADERBOARD, UPDATE_SERIES_LEADERBOARD_CATEGORY, UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP, WIN_PRIZE_SERIES_DISTRIBUTION } from './constants'
const errMsg = 'Server is unavailable.'

export const getSeriesLBCategoriesTemplateList = token => async (dispatch) => {
  await axios.get('/series-leaderboard-categories-template/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LB_CATEGORIES_TEMPLATE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_LB_CATEGORIES_TEMPLATE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeriesList = (data) => async (dispatch) => {
  const { start, limit, sort, order, search, status, SportsType, token } = data
  await axios.get(`/series-leaderboard/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&eStatus=${status}&sportsType=${SportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LB_SERIES_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LB_SERIES_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeriesNameList = (sportsType, search, start, limit, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard/v1?sportsType=${sportsType}&sSearch=${search}&nLimit=${limit}&nSkip=${start}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_NAME_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_NAME_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeriesLBCategoryList = (ID, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard-category-list/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LB_CATEGORY_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_LB_CATEGORY_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLBCategory = token => async (dispatch) => {
  await axios.get('/series-leaderboard-categories-template/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LB_CATEGORY_TEMP_ID,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_LB_CATEGORY_TEMP_ID,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getSeriesLeaderBoardDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LEADERBOARD_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SERIES_LEADERBOARD_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const UpdateSeriesLeaderBoard = (Id, sName, sInfo, eCategory, eStatus, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.put(`/series-leaderboard/${Id}/v1`, {
    sName, sInfo, eCategory, eStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_SERIES_LEADERBOARD,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SERIES_LEADERBOARD,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const addSeriesLeaderBoard = (sName, sInfo, eCategory, eStatus, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.post('/series-leaderboard/v1', {
    sName, sInfo, eCategory, eStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_SERIES_LEADERBOARD,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SERIES_LEADERBOARD,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const addSeriesLeaderBoardCategory = (addSeriesLBCategoryData) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await await axios.post(`/series-leaderboard-category/${addSeriesLBCategoryData.ID}/v1`, {
    sName: addSeriesLBCategoryData.name,
    iCategoryId: addSeriesLBCategoryData.seriesLBCategory,
    sFirstPrize: addSeriesLBCategoryData.prize,
    aPrizeBreakup: addSeriesLBCategoryData.aPriceBreakup,
    nMaxRank: addSeriesLBCategoryData.rank,
    sContent: addSeriesLBCategoryData.content,
    nTotalPayout: parseInt(addSeriesLBCategoryData.TotalPayout)
  }, { headers: { Authorization: addSeriesLBCategoryData.token } }).then((response2) => {
    dispatch({
      type: ADD_SERIES_LEADERBOARD_CATEGORY,
      payload: {
        data: response2.data.data ? response2.data.data : [],
        resStatus: true,
        resMessage: response2.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_SERIES_LEADERBOARD_CATEGORY,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const UpdateLeaderBoardCategory = (updateSeriesLBCategoryData) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.put(`/series-leaderboard-category/${updateSeriesLBCategoryData.ID}/v1`, {
    sName: updateSeriesLBCategoryData.name,
    iCategoryId: updateSeriesLBCategoryData.seriesLBCategory,
    sFirstPrize: updateSeriesLBCategoryData.prize,
    nTotalPayout: updateSeriesLBCategoryData.TotalPayout,
    nMaxRank: updateSeriesLBCategoryData.rank,
    sContent: updateSeriesLBCategoryData.content
  }, { headers: { Authorization: updateSeriesLBCategoryData.token } }).then((response) => {
    dispatch({
      type: UPDATE_SERIES_LEADERBOARD_CATEGORY,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_SERIES_LEADERBOARD_CATEGORY,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getLBCategoryDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard-category/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LEADERBOARD_CATEGORY_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: SERIES_LEADERBOARD_CATEGORY_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const deleteSeriesCategory = (seriesID, categoryID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.delete(`/series-leaderboard-category/${seriesID}/v1`, { data: { iCategoryId: categoryID }, headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_SERIES_CATEGORY, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_SERIES_CATEGORY, error))
  })
}

export const listOfSeriesLBPrizeBreakup = (seriesCategoryID, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard-category/${seriesCategoryID}/price-breakup/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'SERIES_LEADERBOARD_PRIZEBREAKUP',
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'SERIES_LEADERBOARD_PRIZEBREAKUP',
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const getSeriesLBPrizeBreakup = (seriesCategoryID, priceBreakUpID, token) => async (dispatch) => {
  await axios.get(`/series-leaderboard-category/${seriesCategoryID}/price-breakup/${priceBreakUpID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: 'SERIES_LEADERBOARD_PRIZEBREAKUP_DETAILS',
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: 'SERIES_LEADERBOARD_PRIZEBREAKUP_DETAILS',
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const addSeriesLBPriceBreakup = (addSeriesLBPriceBreakupData) => async (dispatch) => {
  const { Image, RankFrom, RankTo, RankType, Prize, Info, seriesLBCategoryID, token } = addSeriesLBPriceBreakupData
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  try {
    if (Image) {
      const response = await axios.post('/series-leaderboard-category/pre-signed-url/v1', { sFileName: Image.file.name, sContentType: Image.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, Image.file, { headers: { 'Content-Type': Image.file.type } })
      await axios.post(`/series-leaderboard-category/${seriesLBCategoryID}/price-breakup/v1`, {
        nRankFrom: RankFrom,
        nRankTo: RankTo,
        eRankType: RankType,
        nPrize: parseFloat(Prize),
        sInfo: Info,
        sImage
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch(successFunc(ADD_SERIES_LEDAERBOARD_PRICEBREAKUP, response1))
      })
    } else {
      await axios.post(`/series-leaderboard-category/${seriesLBCategoryID}/price-breakup/v1`, {
        nRankFrom: RankFrom,
        nRankTo: RankTo,
        eRankType: RankType,
        nPrize: parseFloat(Prize),
        sInfo: Info,
        sImage: ''
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch(successFunc(ADD_SERIES_LEDAERBOARD_PRICEBREAKUP, response2))
      })
    }
  } catch (error) {
    dispatch(catchFunc(ADD_SERIES_LEDAERBOARD_PRICEBREAKUP, error))
  }
}

export const updateSeriesLBPriceBreakup = (updateSeriesLBPriceBreakupData) => async (dispatch) => {
  const { Image, RankFrom, RankTo, RankType, Prize, Info, seriesLBCategoryID, PriceBreakupId, token } = updateSeriesLBPriceBreakupData
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  try {
    if (Image && Image.file) {
      const response = await axios.post('/series-leaderboard-category/pre-signed-url/v1', { sFileName: Image.file.name, sContentType: Image.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, Image.file, { headers: { 'Content-Type': Image.file.type } })
      await axios.put(`/series-leaderboard-category/${seriesLBCategoryID}/price-breakup/${PriceBreakupId}/v1`, {
        nRankFrom: RankFrom,
        nRankTo: RankTo,
        eRankType: RankType,
        nPrize: parseFloat(Prize),
        sInfo: Info,
        sImage
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch({
          type: UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP,
          payload: {
            data: response1.data.data,
            resMessage: response1.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/series-leaderboard-category/${seriesLBCategoryID}/price-breakup/${PriceBreakupId}/v1`, {
        nRankFrom: RankFrom,
        nRankTo: RankTo,
        eRankType: RankType,
        nPrize: parseFloat(Prize),
        sInfo: Info,
        sImage: ''
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP,
          payload: {
            data: response2.data.data,
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_SERIES_LEDAERBOARD_PRICEBREAKUP, error))
  }
}

export const RankCalculate = (categoryID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.get(`/series-leaderboard-calculate-ranks/${categoryID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc('RANK_CALCULATE', response))
  }).catch((error) => {
    dispatch(catchFunc('RANK_CALCULATE', error))
  })
}

export const PrizeCalculate = (categoryID, token) => async (dispatch) => {
  // dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.get(`/series-leaderboard-price-calculation/${categoryID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc('PRIZE_CALCULATE', response))
  }).catch((error) => {
    dispatch(catchFunc('PRIZE_CALCULATE', error))
  })
}

export const WinPrizeDistribution = (categoryID, token) => async (dispatch) => {
  // dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.get(`/series-leaderboard-win-price-distribution/${categoryID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(WIN_PRIZE_SERIES_DISTRIBUTION, response))
  }).catch((error) => {
    dispatch(catchFunc(WIN_PRIZE_SERIES_DISTRIBUTION, error))
  })
}

export const getSeriesLeaderBoardUserRankList = (data) => async (dispatch) => {
  const { start, limit, isFullList, categoryId, token } = data
  await axios.get(`/series-leaderboard-get-allrank/${categoryId}/v1?nOffset=${start}&nLimit=${limit}&isFullResponse=${isFullList}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_LEADER_BOARD_USER_RANK,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse: isFullList
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_LEADER_BOARD_USER_RANK,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const deleteSeries = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.delete(`/series-leaderboard/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_SERIES, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_SERIES, error))
  })
}

export const deleteSeriesPrizeBreakup = (seriesId, prizeBreakupId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_SERIESLEADERBOARD_MESSAGE })
  await axios.delete(`/series-leaderboard-category/${seriesId}/prize-breakup/${prizeBreakupId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_SERIES_PRIZEBREAKUP, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_SERIES_PRIZEBREAKUP, error))
  })
}

export const getSeriesCount = (id, token) => async (dispatch) => {
  await axios.get(`/final-counts/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SERIES_COUNT,
      payload: {
        data: response.data.data ? response?.data?.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: SERIES_COUNT,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
