import { useEffect, useRef, useState } from 'react'
import { useAmp } from 'next/amp'
import dynamic from 'next/dynamic'

import { categorySlug } from '@shared/libs/category'
import { articleLoader, fixtureLoader, pageLoading, statsLoader, tableLoader, teamLoader } from '@shared/libs/allLoader'

const CategoryContent = dynamic(() => import('@shared/components/categoryContent'), { loading: () => pageLoading() })
const TagPlayerTeamDetail = dynamic(() => import('@shared/components/tagPlayerTeamDetail'))
const SeriesHome = dynamic(() => import('@shared/components/series/seriesHome'), { loading: () => articleLoader(['g', 's']) })
const SeriesNews = dynamic(() => import('@shared/components/series/seriesNews'), { loading: () => articleLoader(['g', 's']) })
const SeriesVideos = dynamic(() => import('@shared/components/series/seriesVideos'), { loading: () => articleLoader(['g', 's']) })
const Fixtures = dynamic(() => import('@shared/components/series/fixtures'), { loading: () => fixtureLoader() })
const Standings = dynamic(() => import('@shared/components/series/standings'), { loading: () => tableLoader() })
const Stats = dynamic(() => import('@shared/components/series/stats'), { loading: () => statsLoader() })
const SeriesTeam = dynamic(() => import('@shared/components/series/seriesTeam'), { loading: () => teamLoader() })
const SeriesSquads = dynamic(() => import('@shared/components/series/seriesSquads'))
const SeriesArchiveList = dynamic(() => import('@shared/components/series/seriesArchiveList'))
const SeriesFantasyTipsList = dynamic(() => import('@shared/components/series/seriesFantasyTipsList'))

// For AMP
const CategoryContentAMP = dynamic(() => import('@shared/components/amp/categoryContentAMP'), { loading: () => pageLoading() })
const TagPlayerTeamDetailAMP = dynamic(() => import('@shared/components/amp/tagPlayerTeamDetailAMP'))
const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => pageLoading() })
const SeriesNewsAMP = dynamic(() => import('@shared/components/amp/series/seriesNewsAMP'), { loading: () => articleLoader(['g', 's']) })
const SeriesVideosAMP = dynamic(() => import('@shared/components/amp/series/seriesVideosAMP'))
const FixturesAMP = dynamic(() => import('@shared/components/amp/series/fixturesAMP'), { loading: () => fixtureLoader() })
const StandingsAMP = dynamic(() => import('@shared/components/amp/series/standingsAMP'))
const StatsAMP = dynamic(() => import('@shared/components/amp/series/statsAMP'), { loading: () => statsLoader() })
const SeriesTeamAMP = dynamic(() => import('@shared/components/amp/series/seriesTeam'))
const SeriesSquadsAMP = dynamic(() => import('@shared/components/amp/series/seriesSquadsAMP'))
const SeriesArchiveListAMP = dynamic(() => import('@shared/components/amp/series/seriesArchiveListAMP'))
const SeriesFantasyTipsListAMP = dynamic(() => import('@shared/components/amp/series/seriesFantasyTipsListAMP'))

const useCategory = ({ category: cat, seoData }) => {
  const [category, setCategory] = useState({
    ...cat,
    data: { ...cat?.data, oSeo: seoData }
  })
  const isAmp = useAmp()
  const subPagesURLS = useRef(getPagesURL())

  useEffect(() => {
    subPagesURLS.current = getPagesURL()
    setCategory({
      ...cat,
      data: { ...cat?.data, oSeo: seoData }
    })
  }, [cat])

  function getPagesURL() {
    const obj = {}
    cat?.subPages?.forEach((e) => {
      obj[e?.eSubType || 'h'] = e
    })
    return obj
  }

  function getAmpCategoryPages() {
    if (category?.data?.eType === 's' || category?.data?.eType === 'fac' || category?.data?.eType === 'pct') {
      return <TagPlayerTeamDetailAMP seoData={seoData} tag={category} />
    } else if (category?.data?.eType === 'as') {
      if (categorySlug.includes(category?.type)) {
        if (category.type === 'news') {
          return <SeriesNewsAMP data={category?.newsData} category={category?.data} />
        } else if (category.type === 'videos') {
          return <SeriesVideosAMP data={category?.videosData} category={category?.data} />
        } else if (category.type === 'fixtures') {
          return <FixturesAMP category={category?.data} data={category?.fixturesData} teamVenueData={category?.teamData} id={category?.data?.iSeriesId} seoData={seoData}/>
        } else if (category.type === 'standings') {
          return <StandingsAMP
            category={category?.data}
            round={category?.roundData?.fetchSeriesRounds}
            id={category?.data?.iSeriesId}
            standing={category?.standingData?.fetchSeriesStandings}
          />
        } else if (category.type === 'stats') {
          return <StatsAMP
            data={category?.statsData}
            matchTypeData={category?.matchTypeData?.listSeriesStatsFormat}
            typeData={category?.seriesData}
            id={category?.data?.iSeriesId}
            category={category}
            seoData={seoData}
          />
        } else if (category.type === 'teams') {
          return <SeriesTeamAMP data={category?.seriesTeamData} id={category?.data?.iSeriesId} />
        } else if (category.type === 'squads') {
          return <SeriesSquadsAMP team={category?.seriesTeamData?.listSeriesTeams?.aTeams} players={category?.teamPlayer} id={category?.data?.iSeriesId} seoData={seoData} />
        } else if (category.type === 'archives') {
          return <SeriesArchiveListAMP id={category?.data?.iSeriesId} data={category?.seriesArchivesData?.listSeriesCTArchive} />
        } else if (category.type === 'fantasy-tips') {
          return <SeriesFantasyTipsListAMP data={category?.seriesFantasyTips} />
        } else return null
      } else {
        return (
          <SeriesHomeAMP
            subPagesURLS={subPagesURLS.current}
            data={category?.home}
            playerData={category?.playerData?.listSeriesTopPlayers}
            category={category?.data}
            showMoreBtn
          />
        )
      }
    } else return null
  }

  function getCategoryPages() {
    if (isAmp) {
      return (
        <CategoryContentAMP
          tab={category?.type}
          scoreCard={category?.seriesScoreCard}
          bannerSeriesScoreCard={category?.bannerSeriesScoreCard}
          seoData={seoData}
          category={category?.data}
          reWriteURLS={category?.reWriteURLS}
          ssrNav={category?.subPages}
          showNav
        >
          {getAmpCategoryPages()}
        </CategoryContentAMP>
      )
    } else {
      return (
        <CategoryContent
          tab={category?.type}
          seoData={seoData}
          reWriteURLS={category?.reWriteURLS}
          category={category?.data}
          tabSeo={category?.tabSeo}
          scoreCard={category?.seriesScoreCard}
          ssrNav={category?.subPages}
          showNav
        >
          {({ activeTab, changeTab }) => {
            if (category?.data?.eType === 's' || category?.data?.eType === 'fac' || category?.data?.eType === 'pct') {
              return <TagPlayerTeamDetail onTabChanges={changeTab} seoData={seoData} tag={category} activeTab={activeTab} />
            } else if (category?.data?.eType === 'as') {
              if (categorySlug.includes(category?.type)) {
                if (category.type === 'news') {
                  return <SeriesNews data={category?.newsData} category={category?.data} />
                } else if (category.type === 'videos') {
                  return <SeriesVideos data={category?.videosData} category={category?.data} />
                } else if (category.type === 'fixtures') {
                  return <Fixtures category={category?.data} data={category?.fixturesData} teamVenueData={category?.teamData} id={category?.data?.iSeriesId} />
                } else if (category.type === 'standings') {
                  return <Standings
                    round={category?.roundData?.fetchSeriesRounds}
                    category={category?.data}
                    // id={category?.data?.iSeriesId}
                    standing={category?.standingData?.fetchSeriesStandings}
                  />
                } else if (category.type === 'stats') {
                  return <Stats
                    data={category?.statsData}
                    matchTypeData={category?.matchTypeData?.listSeriesStatsFormat}
                    typeData={category?.seriesData}
                    id={category?.data?.iSeriesId}
                    category={category}
                    seoData={seoData}
                  />
                } else if (category.type === 'teams') {
                  return <SeriesTeam data={category?.seriesTeamData} id={category?.data?.iSeriesId} />
                } else if (category.type === 'squads') {
                  return <SeriesSquads team={category?.seriesTeamData?.listSeriesTeams?.aTeams} players={category?.teamPlayer} id={category?.data?.iSeriesId} />
                } else if (category.type === 'archives') {
                  return <SeriesArchiveList id={category?.data?.iSeriesId} data={category?.seriesArchivesData?.listSeriesCTArchive} />
                } else if (category.type === 'fantasy-tips') {
                  return <SeriesFantasyTipsList data={category?.seriesFantasyTips} />
                } else return null
                // else if (category.type === 'fantasy-articles') {
                //   return <SeriesFantasyArticle data={category?.fantasyArticle} category={category?.data} />
                // }
              } else {
                return <SeriesHome
                  subPagesURLS={subPagesURLS.current}
                  data={category?.home}
                  playerData={category?.playerData?.listSeriesTopPlayers}
                  category={category?.data}
                />
              }
            } else return null
          }}
        </CategoryContent>
      )
    }
  }

  return {
    getCategoryPages
  }
}

export default useCategory
