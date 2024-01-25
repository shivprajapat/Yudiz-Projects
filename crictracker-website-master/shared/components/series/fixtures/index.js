import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { FIXTURES_LIST } from '@graphql/series/fixtures.query'
import { fixtureLoader } from '@shared/libs/allLoader'
import CustomSelect from '@shared/components/customSelect'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import FixturesItems from '@shared-components/series/fixturesItems'
import { appendParams } from '@shared/utils'

// const FixturesItems = dynamic(() => import('@shared-components/series/fixturesItems'), { loading: () => fixtureLoader() })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const Fixtures = ({ data, teamVenueData, id, category }) => {
  const router = useRouter()
  const teamOptions = teamVenueData?.fetchSeriesData?.aTeams
  const venueOptions = teamVenueData?.fetchSeriesData?.aVenues
  const payloadRef = useRef({ iTeamId: router?.query?.iTeamId || null, iVenueId: router?.query?.iVenueId || null, nOrder: 1, sSortBy: 'dStartDate', iSeriesId: id })
  const selectedValue = useRef(getSelectedValue())
  const [fixtureData, setFixtureData] = useState(data?.fetchFixuresData)

  const [updateFixture, { data: updateFixtureData, loading }] = useLazyQuery(FIXTURES_LIST)

  const handleFilterChange = (e, type) => {
    appendParams({ [type]: e?._id || null })
    payloadRef.current[type] = e?._id || null
    selectedValue.current[type] = e
    getUpdatedData()
  }

  const handleClearFilter = (e) => {
    appendParams({ iTeamId: null, iVenueId: null })
    payloadRef.current = { ...payloadRef.current, iTeamId: null, iVenueId: null }
    selectedValue.current = { iTeamId: undefined, iVenueId: undefined }
    getUpdatedData()
  }

  const getUpdatedData = () => {
    updateFixture({ variables: { input: payloadRef.current } })
  }

  function getSelectedValue() {
    const iTeamId = router?.query?.iTeamId ? teamOptions.find(item => item?._id === router?.query?.iTeamId) : null
    const iVenueId = router?.query?.iVenueId ? venueOptions.find(item => item?._id === router?.query?.iVenueId) : null
    return { iTeamId, iVenueId }
  }

  useEffect(() => {
    if (updateFixtureData?.fetchFixuresData) {
      setFixtureData(updateFixtureData?.fetchFixuresData)
    }
  }, [updateFixtureData])

  useEffect(() => {
    setFixtureData(data?.fetchFixuresData)
    const upcoming = data?.fetchFixuresData?.filter(m => m?.sStatusStr === 'scheduled')
    if (upcoming?.length) {
      const element = document.getElementById(upcoming[0]?._id)
      element?.scrollIntoView({ block: 'center', inline: 'center' })
    }
  }, [data?.fetchFixuresData])

  return (
    <>
      <h4 className="text-uppercase">
        {category?._id === '623184adf5d229bacb00ff63' ? category?.oSeries?.sTitle : ''} <Trans i18nKey="common:Schedule" />
      </h4>
      <Form className="d-flex align-items-center mb-3">
        <Row className={`${styles.filter} flex-grow-1`}>
          <Col>
            <CustomFormGroup className={`${formStyles.formGroup} mb-0`} controlId="teamSelect">
              <CustomSelect
                options={teamOptions}
                value={selectedValue.current?.iTeamId}
                placeholder="Team"
                labelKey="sTitle"
                valueKey="_id"
                isClearable
                isNative
                onChange={(e) => {
                  handleFilterChange(e, 'iTeamId')
                }}
              />
            </CustomFormGroup>
          </Col>
          <Col>
            <CustomFormGroup className={`${formStyles.formGroup} mb-0`} controlId="venueSelect">
              <CustomSelect
                options={venueOptions}
                value={selectedValue.current?.iVenueId}
                placeholder="Venue"
                labelKey="sName"
                valueKey="_id"
                isClearable
                isNative
                onChange={(e) => {
                  handleFilterChange(e, 'iVenueId')
                }}
              />
            </CustomFormGroup>
          </Col>
        </Row>
        <Button className="theme-btn outline-btn small-btn ms-2 ms-md-3" onClick={handleClearFilter}>
          <Trans i18nKey="common:Clear" />
        </Button>
      </Form>
      {loading && fixtureLoader()}
      <div className={`${styles.fixtures}`}>
        {!loading && fixtureData?.map((fixture) => {
          return <FixturesItems id={fixture._id} key={fixture._id} fixture={fixture} />
        })}
      </div>
      {!loading && fixtureData?.length === 0 && <NoData />}
    </>
  )
}

Fixtures.propTypes = {
  data: PropTypes.object,
  teamVenueData: PropTypes.object,
  category: PropTypes.object,
  id: PropTypes.string
}

export default Fixtures
