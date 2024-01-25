import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import formStyles from '@assets/scss/components/form.module.scss'
import CustomSelect from '@shared/components/customSelect'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import { appendParams } from '@shared/utils'
import { useRouter } from 'next/router'

const FantasyTipsFilter = ({ fantasyTipsList, filterChange, parentClear, setParentClear, isMobile }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { eFormat, sSeries, sTeam } = router?.query
  const [filterFantasyList, setFilterFantasyList] = useState(fantasyTipsList)
  const filterFantasyListRef = useRef(fantasyTipsList)
  const [formatList, setFormatList] = useState()
  const [teamList, setTeamList] = useState()
  const [seriesList, setSeriesList] = useState()
  const [value, setValue] = useState({
    format: {
      sValue: eFormat || undefined,
      sLabel: eFormat?.toUpperCase() || undefined
    },
    series: {
      sValue: sSeries || undefined,
      sLabel: sSeries || undefined
    },
    team: {
      sValue: sTeam || undefined,
      sLabel: sTeam || undefined
    }
  })
  const selectedFormat = useRef(eFormat)
  const selectedTeam = useRef(sTeam)
  const selectedSeries = useRef(sSeries)

  useEffect(() => {
    if (filterFantasyList) {
      const formatArray = []
      const teamArray = []
      const seriesArray = []

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

  const handleFormatChange = (v) => {
    isMobile && window.scrollTo(0, 150)
    selectedFormat.current = v?.sValue
    setValue({ ...value, format: v })
    appendParams({ eFormat: v?.sValue })
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'format')
  }
  const handleTeamChange = (v) => {
    isMobile && window.scrollTo(0, 150)
    selectedTeam.current = v?.sValue
    setValue({ ...value, team: v })
    appendParams({ sTeam: v?.sValue })
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'team')
  }
  const handleSeriesChange = (v) => {
    isMobile && window.scrollTo(0, 150)
    selectedSeries.current = v?.sValue
    setValue({ ...value, series: v })
    appendParams({ sSeries: v?.sValue })
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'series')
  }

  const handleClearFilter = () => {
    selectedFormat.current = selectedTeam.current = selectedSeries.current = undefined
    setValue({})
    appendParams({ eFormat: undefined, sSeries: undefined, sTeam: undefined })
    filterChange(selectedFormat.current, selectedTeam.current, selectedSeries.current, 'all')
    setFilterFantasyList(filterFantasyListRef.current)
  }

  useEffect(() => {
    if (fantasyTipsList) {
      setFilterFantasyList(fantasyTipsList)
      filterFantasyListRef.current = fantasyTipsList
    }
  }, [fantasyTipsList])

  useEffect(() => {
    if (parentClear) {
      setValue({})
      setParentClear(false)
    }
  }, [parentClear])

  return (
    <>
      <Form className="flex-grow-1">
        <Row>
          <Col md={4}>
            <CustomFormGroup className={formStyles.formGroup} controlId="formatSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Format')}</Form.Label>
              <CustomSelect
                options={formatList}
                value={value?.format}
                placeholder="Select Format"
                labelKey="sLabel"
                valueKey="sValue"
                isNative
                onChange={(e) => {
                  handleFormatChange(e)
                }}
              />
            </CustomFormGroup>
          </Col>
          <Col md={4}>
            <CustomFormGroup className={formStyles.formGroup} controlId="venueSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Series')}</Form.Label>
              <CustomSelect
                options={seriesList}
                value={value?.series}
                labelKey="sLabel"
                valueKey="sValue"
                placeholder="Select Series"
                isNative
                onChange={(e) => {
                  handleSeriesChange(e)
                }}
              />
            </CustomFormGroup>
          </Col>
          <Col md={4}>
            <CustomFormGroup className={formStyles.formGroup} controlId="teamSelect">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Team')}</Form.Label>
              <CustomSelect
                options={teamList}
                value={value?.team}
                labelKey="sLabel"
                valueKey="sValue"
                placeholder="Team"
                isNative
                onChange={(e) => {
                  handleTeamChange(e)
                }}
              />
            </CustomFormGroup>
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
  isMobile: PropTypes.bool,
  setParentClear: PropTypes.func
}

export default FantasyTipsFilter
