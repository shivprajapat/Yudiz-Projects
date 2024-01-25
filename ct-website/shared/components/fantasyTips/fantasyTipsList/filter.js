import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'

import useTranslation from 'next-translate/useTranslation'
import formStyles from '@assets/scss/components/form.module.scss'
import CustomSelect from '@shared/components/customSelect'

const FantasyTipsFilter = ({ fantasyTipsList, filterChange, parentClear, setParentClear }) => {
  const { t } = useTranslation()
  const [filterFantasyList, setFilterFantasyList] = useState(fantasyTipsList)
  const filterFantasyListRef = useRef(fantasyTipsList)
  const formatArray = []
  const [formatList, setFormatList] = useState()
  const teamArray = []
  const [teamList, setTeamList] = useState()
  const seriesArray = []
  const [seriesList, setSeriesList] = useState()
  const selectedFormat = useRef()
  const selectedTeam = useRef()
  const selectedSeries = useRef()
  const { control, reset } = useForm()

  useEffect(() => {
    if (filterFantasyList) {
      filterFantasyList?.map((fantasy) => {
        if (!formatArray.includes(fantasy?.sFormatStr)) formatArray.push(fantasy?.sFormatStr)
        if (!teamArray.includes(fantasy?.oTeamA?.sTitle) && !teamArray.includes(fantasy?.oTeamB?.sTitle)) {
          teamArray.push(fantasy?.oTeamA?.sTitle) && teamArray.push(fantasy?.oTeamB?.sTitle)
        }
        if (!seriesArray.includes(fantasy?.oSeries?.sTitle)) seriesArray.push(fantasy?.oSeries?.sTitle)
        return { formatArray, teamArray, seriesArray }
      })

      // format list set
      setFormatList(
        formatArray?.map((format) => ({
          sValue: format,
          sLabel: format.toUpperCase()
        }))
      )

      // team list set
      setTeamList(
        teamArray?.map((team) => ({
          sValue: team,
          sLabel: team
        }))
      )

      // series list
      setSeriesList(
        seriesArray?.map((series) => ({
          sValue: series,
          sLabel: series
        }))
      )
    }
  }, [filterFantasyList])

  const handleFormatChange = (value) => {
    selectedFormat.current = value?.sValue
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'format')
  }
  const handleTeamChange = (value) => {
    selectedTeam.current = value?.sValue
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'team')
  }
  const handleSeriesChange = (value) => {
    selectedSeries.current = value?.sValue
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'series')
  }

  const handleClearFilter = () => {
    reset({})
    setFilterFantasyList(filterFantasyListRef.current)
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'all')
  }

  useEffect(() => {
    if (fantasyTipsList) {
      setFilterFantasyList(fantasyTipsList)
      filterFantasyListRef.current = fantasyTipsList
    }
  }, [fantasyTipsList])

  useEffect(() => {
    if (parentClear) {
      reset({})
      setParentClear(false)
    }
  }, [parentClear])

  return (
    <>
      <Form className="flex-grow-1">
        <Row>
          <Col md={4}>
            <Form.Group className={formStyles.formGroup} controlId="formatSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Format')}</Form.Label>
              <Controller
                name="format"
                control={control}
                render={({ field: { onChange, value = [] } }) => (
                  <CustomSelect
                    options={formatList}
                    value={value}
                    placeholder="Select Format"
                    labelKey="sLabel"
                    valueKey="sValue"
                    onChange={(e) => {
                      onChange(e)
                      handleFormatChange(e)
                    }}
                  />
                )}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className={formStyles.formGroup} controlId="venueSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Series')}</Form.Label>
              <Controller
                name="series"
                control={control}
                render={({ field: { onChange, value = [] } }) => (
                  <CustomSelect
                    options={seriesList}
                    value={value}
                    labelKey="sLabel"
                    valueKey="sValue"
                    placeholder="Select Series"
                    onChange={(e) => {
                      onChange(e)
                      handleSeriesChange(e)
                    }}
                  />
                )}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className={formStyles.formGroup} controlId="teamSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Team')}</Form.Label>
              <Controller
                name="team"
                control={control}
                render={({ field: { onChange, value = [] } }) => (
                  <CustomSelect
                    options={teamList}
                    value={value}
                    labelKey="sLabel"
                    valueKey="sValue"
                    placeholder="Select Team"
                    onChange={(e) => {
                      onChange(e)
                      handleTeamChange(e)
                    }}
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Button className="theme-btn small-btn ms-2 mt-1" onClick={handleClearFilter}>
        {t('common:Clear')}
      </Button>
    </>
  )
}

FantasyTipsFilter.propTypes = {
  fantasyTipsList: PropTypes.array,
  filterChange: PropTypes.any,
  parentClear: PropTypes.bool,
  setParentClear: PropTypes.func
}

export default FantasyTipsFilter
