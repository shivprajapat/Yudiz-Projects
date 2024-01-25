import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

// import styles from './style.module.scss'
import { useRouter } from 'next/router'
import CustomLink from '@shared/components/customLink'
import useTranslation from 'next-translate/useTranslation'

const FixturesItemsAMP = dynamic(() => import('@shared-components/amp/series/fixturesItemsAMP'))
const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'))
const FixturesAMP = ({ data, teamVenueData, id, category, seoData }) => {
  const { t } = useTranslation()
  const fixtureData = data?.fetchFixuresData
  const teams = teamVenueData?.fetchSeriesData?.aTeams
  const venues = teamVenueData?.fetchSeriesData?.aVenues
  const router = useRouter()
  return (
    <>
      <style jsx amp-custom global>{`
      .filter label,.filter select{font-weight:600}.filter select{line-height:24px}.form-select{width:100%}.form-select select{margin:4px;width:40%;background-repeat:no-repeat;background-image:url(/static/down-arrow.svg);background-position:right 8px center;background-size:auto 60%;border-radius:8px;height:100%;background-color:var(--light-mode-bg);border:1px solid var(--border-color);color:var(--font-color);padding:10px 32px 10px 12px;font-size:16px;font-weight:500;overflow:hidden;appearance:none;-webkit-appearance:none}@media(prefers-color-scheme: dark){.form-select select{background-image:url(/static/down-caret.svg)}}@media(max-width: 991px){.form-select{padding-right:12px;width:100%}.form-select select{padding:10px 32px 10px 12px;font-size:14px}}@media(max-width: 575px){.form-select{padding-right:10px;width:100%}.form-select select{padding:10px 32px 10px 12px;font-size:12px}}/*# sourceMappingURL=style.css.map */
      `}
      </style>
      <h4 className="text-uppercase">
        {category?._id === '623184adf5d229bacb00ff63' ? category?.oSeries?.sTitle : ''} <Trans i18nKey="common:Schedule" />
      </h4>
      <div className="form-select d-flex align-items-center mb-2 ">
        <select on="change:AMP.navigateTo(url=event.value)" className='flex-grow-1'>
          <optgroup key={`stats${data?.sDescription}`} label={data?.sDescription}>
            <option selected disabled>{t('common:Team')}</option>
            {teams?.map((option, index) => {
              return (
                <option
                  key={index}
                  selected={option?._id === router?.query?.iTeamId}
                  value={`/${seoData?.sSlug}/?amp=1&iTeamId=${option?._id}${router?.query?.iVenueId ? `&iVenueId=${router?.query?.iVenueId}` : ''}`}
                >
                  {option?.sTitle}
                </option>
              )
            })}
          </optgroup>
        </select>
        <select on="change:AMP.navigateTo(url=event.value)" className='flex-grow-1'>
          <optgroup key={`stats${data?.sDescription}`} label={data?.sDescription}>
            <option selected disabled>{t('common:Venue')}</option>
            {venues?.map((option, index) => {
              return (
                <option
                  key={index}
                  selected={option?._id === router?.query?.iVenueId}
                  value={`/${seoData?.sSlug}/?amp=1${router?.query?.iTeamId ? `&iTeamId=${router?.query?.iTeamId}` : ''}&iVenueId=${option?._id
                    }`}
                >
                  {option?.sName}
                </option>
              )
            })}
          </optgroup>
        </select>
        <div className='theme-btn outline-btn'>
          <CustomLink href={`/${seoData?.sSlug}/?amp=1` || ''}>
            <a>{t('common:Clear')}</a>
          </CustomLink>
        </div>
      </div>
      {data?.fetchFixuresData?.length !== 0 && (
        <div className="fixtures">
          {fixtureData?.map((fixture) => {
            return <FixturesItemsAMP key={fixture._id} fixture={fixture} />
          })}
        </div>
      )}
      {fixtureData?.length === 0 && <NoDataAMP />}
    </>
  )
}

FixturesAMP.propTypes = {
  seoData: PropTypes.object,
  data: PropTypes.object,
  teamVenueData: PropTypes.object,
  category: PropTypes.object,
  id: PropTypes.string
}

export default FixturesAMP
