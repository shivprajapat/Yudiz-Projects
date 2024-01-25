import { dateCheck } from '@shared/utils'
import { categorySlug } from '../category'

const getCategoryMeta = ({ oSeo, oCategory, tab, t, reWriteURLS }) => {
  const isT20 = oCategory?._id === '623184baf5d229bacb01030e'
  if (oCategory?.eType === 'as') {
    return {
      ...oSeo,
      sTitle: isT20 ? makeT20Title(oSeo, oCategory, tab, t) : makeTitle(oSeo, oCategory, tab, t),
      sDescription: isT20 ? makeT20Description(oSeo, oCategory, tab, t) : makeDescription(oSeo, oCategory, tab, t),
      sRobots: getRobots(oSeo, oCategory, tab),
      sCUrl: makeCanonicalURL(oSeo, tab, reWriteURLS)
    }
  }
  return oSeo
}
export default getCategoryMeta

const makeCanonicalURL = (oSeo, tab, reWriteURLS) => {
  let customURL
  if (reWriteURLS?.length > 0) {
    reWriteURLS.forEach((data) => {
      if (tab === data.eTabType) {
        customURL = `${oSeo?.sCUrl}`
      }
    })
  } else if (categorySlug.includes(tab)) {
    customURL = `${oSeo?.sCUrl || oSeo?.sSlug}/${tab}`
  }
  return customURL
}

const makeTitle = (oSeo, oCategory, tab, t) => {
  const name = oCategory?.oSeries?.sSrtTitle || oCategory?.oSeries?.sTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('SeriesTitle.News', { name, year })
  if (tab === 'videos') return t('SeriesTitle.Videos', { name, year })
  if (tab === 'fixtures') return t('SeriesTitle.Fixtures', { name, year })
  if (tab === 'standings') return t('SeriesTitle.Standings', { name, year })
  if (tab === 'stats') return t('SeriesTitle.Stats', { name, year })
  if (tab === 'teams') return t('SeriesTitle.Teams', { name, year })
  if (tab === 'squads') return t('SeriesTitle.Squads', { name, year })
  if (tab === 'archives') return t('SeriesTitle.Archives', { name, year })
  if (tab === 'fantasy-tips') return t('SeriesTitle.FantasyTips', { name, year })
  else return oSeo?.sTitle || t('SeriesTitle.Home', { name, year })
}

const makeT20Title = (oSeo, oCategory, tab, t) => {
  const name = oCategory?.oSeries?.sSrtTitle || oCategory?.oSeries?.sTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('T20Title.News', { name, year })
  if (tab === 'videos') return t('T20Title.Videos', { name, year })
  if (tab === 'fixtures') return t('T20Title.Fixtures', { name, year })
  if (tab === 'standings') return t('T20Title.Standings', { name, year })
  if (tab === 'stats') return t('T20Title.Stats', { name, year })
  if (tab === 'teams') return t('T20Title.Teams', { name, year })
  if (tab === 'squads') return t('T20Title.Squads', { name, year })
  if (tab === 'archives') return t('T20Title.Archives', { name, year })
  if (tab === 'fantasy-tips') return t('T20Title.FantasyTips', { name, year })
  else return oSeo?.sTitle || t('T20Title.Home', { name, year })
}

const makeDescription = (oSeo, oCategory, tab, t) => {
  const fullName = oCategory?.oSeries?.sTitle
  const name = oCategory?.oSeries?.sSrtTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('SeriesDescription.News', { name, year, fullName })
  if (tab === 'videos') return t('SeriesDescription.Videos', { name, year })
  if (tab === 'fixtures') return t('SeriesDescription.Fixtures', { name, year })
  if (tab === 'standings') return t('SeriesDescription.Standings', { name, year })
  if (tab === 'stats') return t('SeriesDescription.Stats', { name, year })
  if (tab === 'teams') return t('SeriesDescription.Teams', { name, year })
  if (tab === 'squads') return t('SeriesDescription.Squads', { name, year })
  if (tab === 'archives') return t('SeriesDescription.Archives', { name, year, fullName })
  if (tab === 'fantasy-tips') return t('SeriesDescription.FantasyTips', { name, year })
  else return oSeo?.SeriesDescription || t('SeriesDescription.Home', { name, year })
}

const makeT20Description = (oSeo, oCategory, tab, t) => {
  const fullName = oCategory?.oSeries?.sTitle
  const name = oCategory?.oSeries?.sSrtTitle
  const year = dateCheck(oCategory?.oSeries?.dStartDate)?.getFullYear()
  if (tab === 'news') return t('T20Description.News', { name, year, fullName })
  if (tab === 'videos') return t('T20Description.Videos', { name, year })
  if (tab === 'fixtures') return t('T20Description.Fixtures', { name, year })
  if (tab === 'standings') return t('T20Description.Standings', { name, year })
  if (tab === 'stats') return t('T20Description.Stats', { name, year })
  if (tab === 'teams') return t('T20Description.Teams', { name, year })
  if (tab === 'squads') return t('T20Description.Squads', { name, year })
  if (tab === 'archives') return t('T20Description.Archives', { name, year, fullName })
  if (tab === 'fantasy-tips') return t('T20Description.FantasyTips', { name, year })
  else return oSeo?.SeriesDescription || t('T20Description.Home', { name, year })
}

const getRobots = (oSeo, oCategory, tab) => {
  if (tab === 'news') return 'Noindex, Follow'
  else return oSeo?.sRobots
}
