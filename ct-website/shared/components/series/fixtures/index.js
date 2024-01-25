import React, { useState, useEffect } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import { Controller, useForm } from 'react-hook-form'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { FIXTURES_LIST } from '@graphql/series/fixtures.query'
import { fixtureLoader } from '@shared/libs/allLoader'
import CustomSelect from '@shared/components/customSelect'

const FixturesItems = dynamic(() => import('@shared-components/series/fixturesItems'), { loading: () => fixtureLoader() })
const NoData = dynamic(() => import('@noData'), { ssr: false })

const Fixtures = ({ data, teamVenueData, id }) => {
  const { control, reset } = useForm()
  const [payload, setPayload] = useState({ iTeamId: null, iVenueId: null, nOrder: 1, sSortBy: 'dStartDate' })
  const [flag, setFlag] = useState(0)
  const teams = teamVenueData?.fetchSeriesData?.aTeams
  const venues = teamVenueData?.fetchSeriesData?.aVenues

  const [updateFixture, { data: updateFixtureData, loading }] = useLazyQuery(FIXTURES_LIST, {
    variables: {
      input: {
        iSeriesId: id,
        ...payload
      }
    }
  })

  const updateData = updateFixtureData?.fetchFixuresData

  const handleFilterChange = (e, type) => {
    if (type === 'team') {
      setPayload({ ...payload, iTeamId: e === null ? null : e.sValue })
    } else {
      setPayload({ ...payload, iVenueId: e === null ? null : e.sValue })
    }
    setFlag(1)
  }

  const handleClearFilter = (e) => {
    reset({})
    setPayload({ ...payload, iTeamId: null, iVenueId: null })
  }

  const fixtureData = flag === 0 ? data?.fetchFixuresData : updateData
  const optionTeams = teams
    ?.map((team) => ({
      sValue: team._id,
      sLabel: team.sTitle
    }))

  const optionVenues = venues
    ?.map((venue) => ({
      sValue: venue._id,
      sLabel: venue.sName
    }))

  useEffect(() => {
    if (payload.iTeamId || payload.iVenueId) {
      updateFixture()
    }
  }, [payload])
  return (
    <>
      {data?.fetchFixuresData?.length !== 0 && <div className={`${styles.fixtures}`}>
        <h4 className="text-uppercase">
          <Trans i18nKey="common:Fixtures" />
        </h4>
        <Form className="d-flex align-items-center mb-3">
          <Row className={`${styles.filter} flex-grow-1`}>
            <Col>
              <Form.Group className={`${formStyles.formGroup} mb-0`} controlId="teamSelect">
                <Controller
                  name="team"
                  control={control}
                  render={({ field: { onChange, value = {} } }) => {
                    return (
                      <CustomSelect
                        options={optionTeams}
                        value={value}
                        placeholder="Select Team"
                        labelKey="sLabel"
                        valueKey="sValue"
                        isClearable
                        onChange={(e) => {
                          onChange(e)
                          handleFilterChange(e, 'team')
                        }}
                      />
                    )
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className={`${formStyles.formGroup} mb-0`} controlId="venueSelect">
                <Controller
                  name="venue"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <CustomSelect
                      options={optionVenues}
                      value={value}
                      placeholder="Select Venue"
                      labelKey="sLabel"
                      valueKey="sValue"
                      isClearable
                      onChange={(e) => {
                        onChange(e)
                        handleFilterChange(e, 'venue')
                      }}
                    />
                  )}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button className="theme-btn outline-btn small-btn ms-3" onClick={handleClearFilter}>
            <Trans i18nKey="common:Clear" />
          </Button>
        </Form>
        {fixtureData?.map((fixture) => {
          return <FixturesItems key={fixture._id} fixture={fixture} />
        })}
        {loading && fixtureLoader()}
      </div>}
      {!loading && fixtureData?.length === 0 && <NoData />}
    </>
  )
}

Fixtures.propTypes = {
  data: PropTypes.object,
  teamVenueData: PropTypes.object,
  id: PropTypes.string
}

export default Fixtures
