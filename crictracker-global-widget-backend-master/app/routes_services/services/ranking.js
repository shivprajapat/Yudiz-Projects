/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
const { iccrankings } = require('../../model')
const axios = require('axios')
const { ENTITY_SPORT_BASE_URL, ENTITY_SPORT_TOKEN } = require('../../../config')
const cachegoose = require('cachegoose')
const grpcControllers = require('../../grpc/client/')
const { redis } = require('../../utils/index')

class Ranking {
  async updateIccRanking(req, res) {
    try {
      axios.get(`${ENTITY_SPORT_BASE_URL}/iccranks`, { params: { token: ENTITY_SPORT_TOKEN } }).then(async (rankingRes) => {
        const ranking_data = rankingRes.data.response
        const { ranks } = ranking_data
        const { women_ranks } = ranking_data
        // update-mens-ranking
        // batsmen ranking data
        if (ranks.batsmen) {
          updateBastmenData(ranks.batsmen, 'M')
        }

        // Bowler ranking data
        if (ranks.bowlers) {
          updateBowlerData(ranks.bowlers, 'M')
        }

        // All Rounders ranking data
        if (ranks['all-rounders']) {
          updateAllRounderData(ranks['all-rounders'], 'M')
        }

        // teams ranking data
        if (ranks.teams) {
          updateTeamsData(ranks.teams, 'M')
        }

        // for women's ranking

        // batsmen ranking data
        if (women_ranks.batsmen) {
          updateBastmenData(women_ranks.batsmen, 'W')
        }

        // Bowler ranking data
        if (women_ranks.bowlers) {
          updateBowlerData(women_ranks.bowlers, 'W')
        }

        // All Rounders ranking data
        if (women_ranks['all-rounders']) {
          if (women_ranks['all-rounders']) updateAllRounderData(women_ranks['all-rounders'], 'W')
        }

        // teams ranking data
        if (women_ranks.teams) {
          updateTeamsData(women_ranks.teams, 'W')
        }

        return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: 'icc-ranking Done' })
      }).catch((erro) => {
        console.log(erro)
        return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.wentWrong })
      })
    } catch (error) {
      console.log(error)
      return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'icc-ranking Error' })
    }
  }
}

// const updateMensRanking = async (data) => {
//   try {

//   } catch (error) {
//     console.log(error)
//   }
// }

const updateBastmenData = async (data, eGender) => {
  try {
    // For Odis
    const batsmen_rank = []
    const batsmen_odis = data.odis
    if (batsmen_odis.length) {
      for (const rank of batsmen_odis) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const batsmen = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Batsmen',
              eMatchType: 'Odis',
              eGender,
              sPlayerKey: rank.pid
            }

            batsmen_rank.push(batsmen)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (batsmen_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For Tests
    const batsmen_tests = data.tests
    if (batsmen_tests?.length) {
      for (const rank of batsmen_tests) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const batsmen = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Batsmen',
              eMatchType: 'Tests',
              eGender,
              sPlayerKey: rank.pid
            }

            batsmen_rank.push(batsmen)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (batsmen_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For T20s
    const batsmen_t20s = data.t20s
    if (batsmen_t20s.length) {
      for (const rank of batsmen_t20s) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const batsmen = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Batsmen',
              eMatchType: 'T20s',
              eGender,
              sPlayerKey: rank.pid
            }

            batsmen_rank.push(batsmen)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    const query = { eRankType: 'Batsmen', eGender }
    if (batsmen_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    for (const batsmen of batsmen_rank) {
      let grpcRes = await grpcControllers.getPlayerByKey({ sPlayerKey: batsmen?.sPlayerKey })
      if (!grpcRes?.iPlayerId) grpcRes = { sCountry: batsmen.sTeam }
      Object.assign(batsmen, { oJersey: grpcRes?.oJersey })
      batsmen.oPlayer = grpcRes
    }
    await iccrankings.deleteMany(query)
    await iccrankings.insertMany(batsmen_rank)
    return true
  } catch (error) {
    console.log(error)
  }
}

const updateBowlerData = async (data, eGender) => {
  try {
    // For Odis
    const bowler_rank = []
    const bowler_odis = data.odis
    // console.log({ bowler_odis })
    if (bowler_odis?.length) {
      for (const rank of bowler_odis) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const bowler = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Bowlers',
              eMatchType: 'Odis',
              eGender,
              sPlayerKey: rank.pid
            }

            bowler_rank.push(bowler)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (bowler_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For Tests
    const bowler_tests = data.tests
    if (bowler_tests?.length) {
      for (const rank of bowler_tests) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const bowler = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Bowlers',
              eMatchType: 'Tests',
              eGender,
              sPlayerKey: rank.pid
            }

            bowler_rank.push(bowler)
          }
        } catch (error) {
          console.log(error)
        }
      }
      if (bowler_rank?.length) {
        clearCachedQuery(`getRankings:*:*:${eGender}:*`)
        const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
        for (const sCachedData of aCachedData) {
          await redis.redisclient.del(sCachedData)
        }
      }
    }
    // For T20s
    const bowler_t20s = data.t20s
    if (bowler_t20s?.length) {
      for (const rank of bowler_t20s) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const bowler = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'Bowlers',
              eMatchType: 'T20s',
              eGender,
              sPlayerKey: rank.pid
            }

            bowler_rank.push(bowler)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    const query = { eRankType: 'Bowlers', eGender }
    if (bowler_rank?.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    for (const bowler of bowler_rank) {
      let grpcRes = await grpcControllers.getPlayerByKey({ sPlayerKey: bowler?.sPlayerKey })
      if (!grpcRes?.iPlayerId) grpcRes = { sCountry: bowler.sTeam }
      Object.assign(bowler, { oJersey: grpcRes?.oJersey })
      bowler.oPlayer = grpcRes
    }

    await iccrankings.deleteMany(query)
    await iccrankings.insertMany(bowler_rank)

    return true
  } catch (error) {
    console.log(error)
  }
}

const updateAllRounderData = async (data, eGender) => {
  try {
    // For Odis
    const all_rounder_rank = []
    const all_rounder_odis = data.odis
    if (all_rounder_odis?.length) {
      for (const rank of all_rounder_odis) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const all_rounder = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'AllRounders',
              eMatchType: 'Odis',
              eGender,
              sPlayerKey: rank.pid
            }

            all_rounder_rank.push(all_rounder)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (all_rounder_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For Tests
    const all_rounder_tests = data.tests
    if (all_rounder_tests?.length) {
      for (const rank of all_rounder_tests) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const all_rounder = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'AllRounders',
              eMatchType: 'Tests',
              eGender,
              sPlayerKey: rank.pid
            }

            all_rounder_rank.push(all_rounder)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    if (all_rounder_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For T20s
    const all_rounder_t20s = data.t20s
    if (all_rounder_t20s?.length) {
      for (const rank of all_rounder_t20s) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const all_rounder = {
              nRank: parseInt(rankIndex),
              sName: rank.player,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              eRankType: 'AllRounders',
              eMatchType: 'T20s',
              eGender,
              sPlayerKey: rank.pid
            }

            all_rounder_rank.push(all_rounder)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    const query = { eRankType: 'AllRounders', eGender }
    if (all_rounder_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    for (const allRounder of all_rounder_rank) {
      let grpcRes = await grpcControllers.getPlayerByKey({ sPlayerKey: allRounder?.sPlayerKey })
      if (!grpcRes?.iPlayerId) grpcRes = { sCountry: allRounder.sTeam }
      Object.assign(allRounder, { oJersey: grpcRes?.oJersey })
      allRounder.oPlayer = grpcRes
    }

    await iccrankings.deleteMany(query)
    await iccrankings.insertMany(all_rounder_rank)

    return true
  } catch (error) {
    console.log(error)
  }
}

const updateTeamsData = async (data, eGender) => {
  try {
    // For Odis
    const teams_rank = []
    const team_odis = data.odis
    if (team_odis?.length) {
      for (const rank of team_odis) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const team = {
              nRank: parseInt(rankIndex),
              sName: rank.team,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              nPoints: parseInt(rank.points),
              eRankType: 'Teams',
              eMatchType: 'Odis',
              eGender,
              sTeamKey: rank.tid
            }

            teams_rank.push(team)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (teams_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For Tests
    const team_tests = data.tests
    if (team_tests?.length) {
      for (const rank of team_tests) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const team = {
              nRank: parseInt(rankIndex),
              sName: rank.team,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              nPoints: parseInt(rank.points),
              eRankType: 'Teams',
              eMatchType: 'Tests',
              eGender,
              sTeamKey: rank.tid
            }

            teams_rank.push(team)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (teams_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    // For T20s
    const team_t20s = data.t20s
    if (team_t20s?.length) {
      for (const rank of team_t20s) {
        try {
          const rankIndex = parseInt(rank?.rank)
          if (rankIndex) {
            const team = {
              nRank: parseInt(rankIndex),
              sName: rank.team,
              sTeam: rank.team,
              nRating: parseInt(rank.rating),
              nPoints: parseInt(rank.points),
              eRankType: 'Teams',
              eMatchType: 'T20s',
              eGender,
              sTeamKey: rank.tid
            }

            teams_rank.push(team)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    const query = { eRankType: 'Teams', eGender }
    if (teams_rank.length) {
      clearCachedQuery(`getRankings:*:*:${eGender}:*`)
      const aCachedData = await redis.redisclient.keys(`getRankingsOverview:*:*:${eGender}:*`)
      for (const sCachedData of aCachedData) {
        await redis.redisclient.del(sCachedData)
      }
    }

    for (const team of teams_rank) {
      let grpcRes = await grpcControllers.getTeamByKey({ sTeamKey: team?.sTeamKey })
      if (!grpcRes?.iTeamId) grpcRes = { sCountry: team.sTeam }
      team.oTeams = grpcRes
    }

    await iccrankings.deleteMany(query)
    await iccrankings.insertMany(teams_rank)

    return true
  } catch (error) {
    console.log(error)
  }
}

const clearCachedQuery = (sKey) => {
  try {
    cachegoose.clearCache(sKey)
  } catch (error) {
    console.log(error)
  }
}
module.exports = new Ranking()
