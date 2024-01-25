import axios from '../axios'
import { DELETE_PRIZE_BREAKUP, CLEAR_DELETE_PRIZE_BREAKUP, ADD_LEAGUE, ADD_LEAGUE_PRIZE, ALL_LEAGUES, CLEAR_LEAGUE_MESSAGE, DELETE_LEAGUE, GAME_CATEGORY_LIST, LEAGUE_DETAILS, LEAGUE_LIST, LEAGUE_NAME_LIST, LEAGUE_PRIZE_DETAILS, LEAGUE_PRIZE_LIST, UPDATE_LEAGUE, UPDATE_LEAGUE_PRIZE, USER_LEAGUE_LIST, COPY_LEAGUE } from './constants'
const errMsg = 'Server is unavailable.'

export const getLeagueList = (leagueListData) => async (dispatch) => {
  const { start, limit, sort, order, search, searchField, leagueCategory, sportsType, token } = leagueListData
  await axios.get(`/league/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&searchField=${searchField}&search=${search}&searchCategory=${leagueCategory}&sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeaguePrizeList = (ID, token) => async (dispatch) => {
  await axios.get(`/league/${ID}/prize-breakup/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_PRIZE_LIST,
      payload: {
        data: response.data.data.aLeaguePrize ? response.data.data.aLeaguePrize : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_PRIZE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getLeagueName = (sportsType, token) => async (dispatch) => {
  await axios.get(`/league/v1?sportsType=${sportsType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_NAME_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_NAME_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getGameCategory = (token) => async (dispatch) => {
  await axios.get('/match/active-sports/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GAME_CATEGORY_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GAME_CATEGORY_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addNewLeague = (addNewLeagueData, token) => async (dispatch) => {
  const { LeagueName, maxEntry, minEntry, Price, TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam } = addNewLeagueData
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.post('/league/v1', {
    sName: LeagueName,
    nMax: maxEntry,
    nMin: minEntry,
    nPrice: Price,
    nTotalPayout: TotalPayout,
    nDeductPercent: DeductPercent,
    nBonusUtil: BonusUtil,
    nLoyaltyPoint: parseInt(LoyaltyPoint),
    bConfirmLeague: ConfirmLeague === 'Y',
    bMultipleEntry: multipleEntry === 'Y',
    bAutoCreate: autoCreate === 'Y',
    bPoolPrize: poolPrize === 'Y',
    nPosition: Position,
    eStatus: active,
    eCategory: GameCategory.toLowerCase(),
    iLeagueCatId: LeagueCategory,
    iFilterCatId: FilterCategory,
    nTeamJoinLimit: TeamJoinLimit,
    nWinnersCount: winnersCount,
    bUnlimitedJoin: (unlimitedJoin === 'Y'),
    nMinCashbackTeam: minCashbackTeam,
    nCashbackAmount: cashBackAmount,
    eCashbackType: cashbackType,
    nMinTeamCount: minTeamCount,
    bBotCreate: botCreate === 'Y',
    bCashbackEnabled: cashbackEnabled === 'Y',
    nCopyBotsPerTeam: copyBotPerTeam
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_LEAGUE,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_LEAGUE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : 'Server is unavailable.'
      }
    })
  })
}

export const addLeaguePrice = (addLeaguePriceData) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  const { PrizeBreakupImage, rFrom, rTo, price, rType, extra, ID, token } = addLeaguePriceData
  try {
    if (PrizeBreakupImage) {
      const response = await axios.post('/league/pre-signed-url/v1', { sFileName: PrizeBreakupImage.file.name, sContentType: PrizeBreakupImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      const response1 = await axios.put(url, PrizeBreakupImage.file, { headers: { 'Content-Type': PrizeBreakupImage.file.type } })
      if (response1.status === 200) {
        await axios.post(`/league/${ID}/prize-breakup/v1`, {
          nRankFrom: rFrom,
          nRankTo: rTo,
          nPrize: parseFloat(price),
          eRankType: rType,
          sInfo: rType === 'E' ? extra : '',
          sImage
        }, { headers: { Authorization: token } }).then((response2) => {
          dispatch({
            type: ADD_LEAGUE_PRIZE,
            payload: {
              data: response2.data.data,
              resStatus: true,
              resMessage: response2.data.message
            }
          })
        })
      }
    } else {
      await axios.post(`/league/${ID}/prize-breakup/v1`, {
        nRankFrom: rFrom,
        nRankTo: rTo,
        nPrize: parseFloat(price),
        eRankType: rType,
        sInfo: rType === 'E' ? extra : ''
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: ADD_LEAGUE_PRIZE,
          payload: {
            data: response.data.data,
            resStatus: true,
            resMessage: response.data.message
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: ADD_LEAGUE_PRIZE,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  }
}

export const updateLeaguePrice = (updateLeaguePriceData) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  const { PrizeBreakupImage, rFrom, rTo, price, rType, extra, ID1, ID2, token } = updateLeaguePriceData
  try {
    if (PrizeBreakupImage && PrizeBreakupImage.file) {
      const response = await axios.post('/league/pre-signed-url/v1', { sFileName: PrizeBreakupImage.file.name, sContentType: PrizeBreakupImage.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, PrizeBreakupImage.file, { headers: { 'Content-Type': PrizeBreakupImage.file.type } })
      await axios.put(`/league/${ID1}/prize-breakup/${ID2}/v1`, {
        nRankFrom: rFrom,
        nRankTo: rTo,
        nPrize: parseFloat(price),
        eRankType: rType,
        sInfo: rType === 'E' ? extra : '',
        sImage
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_LEAGUE_PRIZE,
          payload: {
            resMessage: response2.data.message,
            resStatus: true
          }
        })
      })
    } else {
      await axios.put(`/league/${ID1}/prize-breakup/${ID2}/v1`, {
        nRankFrom: rFrom,
        nRankTo: rTo,
        nPrize: parseFloat(price),
        eRankType: rType,
        sInfo: rType === 'E' ? extra : '',
        sImage: PrizeBreakupImage
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_LEAGUE_PRIZE,
          payload: {
            resMessage: response.data.message,
            resStatus: true
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_LEAGUE_PRIZE,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false
      }
    })
  }
}

export const updateNewLeague = (updateLeagueData, token, ID) => async (dispatch) => {
  const { LeagueName, maxEntry, minEntry, Price, TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam } = updateLeagueData
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.put(`/league/${ID}/v1`, {
    sName: LeagueName,
    nMax: maxEntry,
    nMin: minEntry,
    nPrice: Price,
    nLoyaltyPoint: parseInt(LoyaltyPoint),
    nTotalPayout: TotalPayout,
    nDeductPercent: DeductPercent,
    nBonusUtil: BonusUtil,
    bConfirmLeague: ConfirmLeague === 'Y',
    bMultipleEntry: multipleEntry === 'Y',
    bAutoCreate: autoCreate === 'Y',
    bPoolPrize: poolPrize === 'Y',
    nPosition: Position,
    eStatus: active,
    eCategory: GameCategory,
    iLeagueCatId: LeagueCategory,
    iFilterCatId: FilterCategory,
    nTeamJoinLimit: TeamJoinLimit,
    nWinnersCount: winnersCount,
    bUnlimitedJoin: unlimitedJoin === 'Y',
    nMinCashbackTeam: minCashbackTeam,
    nCashbackAmount: cashBackAmount,
    eCashbackType: cashbackType,
    nMinTeamCount: minTeamCount,
    bBotCreate: botCreate === 'Y',
    bCashbackEnabled: cashbackEnabled === 'Y',
    nCopyBotsPerTeam: copyBotPerTeam
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_LEAGUE,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_LEAGUE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : 'Server is unavailable.'
      }
    })
  })
}

export const getLeagueDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/league/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getLeaguePriceDetails = (Id1, ID2, token) => async (dispatch) => {
  await axios.get(`/league/${Id1}/prize-breakup/${ID2}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: LEAGUE_PRIZE_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: LEAGUE_PRIZE_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getUserLeaguesList = (iMatchId, iUserId, token) => async (dispatch) => {
  await axios.post('/user-league/v1', { iMatchId, iUserId }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_LEAGUE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_LEAGUE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const deleteleague = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.delete(`/league/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_LEAGUE,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_LEAGUE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const deletePrizeBreaup = (leagueId, PrizeId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_DELETE_PRIZE_BREAKUP })
  await axios.delete(`/league/${leagueId}/prize-breakup/${PrizeId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_PRIZE_BREAKUP,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_PRIZE_BREAKUP,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        isDeleted: false
      }
    })
  })
}

export const getAllLeagues = (start, search, token) => async (dispatch) => {
  await axios.get(`/league/full-list/v2?nStart=${start}&nLimit=10&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ALL_LEAGUES,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ALL_LEAGUES,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const copyLeague = (leagueId, sportsType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
  await axios.post(`/league/copy/${leagueId}/v1`, { eCategory: sportsType }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: COPY_LEAGUE,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: COPY_LEAGUE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const BlankMessage = () => async (dispatch) => {
  dispatch({ type: CLEAR_LEAGUE_MESSAGE })
}
