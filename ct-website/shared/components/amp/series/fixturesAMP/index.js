import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

// import styles from './style.module.scss'
import { fixtureLoader } from '@shared/libs/allLoader'

const FixturesItemsAMP = dynamic(() => import('@shared-components/amp/series/fixturesItemsAMP'), { loading: () => fixtureLoader() })
const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'), { ssr: false })

const FixturesAMP = ({ data, teamVenueData, id }) => {
  const fixtureData = data?.fetchFixuresData

  return (
    <>
      {data?.fetchFixuresData?.length !== 0 && <div className="fixtures">
        <h4 className="text-uppercase">
          <Trans i18nKey="common:Fixtures" />
        </h4>
        {fixtureData?.map((fixture) => {
          return <FixturesItemsAMP key={fixture._id} fixture={fixture} />
        })}
        {fixtureLoader()}
      </div>}
      {fixtureData?.length === 0 && <NoDataAMP />}
    </>
  )
}

FixturesAMP.propTypes = {
  data: PropTypes.object,
  teamVenueData: PropTypes.object,
  id: PropTypes.string
}

export default FixturesAMP
