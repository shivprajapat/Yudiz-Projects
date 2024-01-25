import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
// import Select from 'react-select'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'
import { Col, Row } from 'react-bootstrap'

// import styles from '@shared-components/fixtureContent/style.module.scss'
import { GET_FANTASY_PLATFORM } from '@graphql/match/match.query'
// import { GET_FANTASY_PLAYER_DATA } from '@graphql/fantasy-tips/fantasy-tips.query'
import { optionsPlatFormType, dateCheck } from '@utils'
import Link from 'next/link'
import CustomSelect from '@shared/components/customSelect'
import useTranslation from 'next-translate/useTranslation'

const FantasyTeam = dynamic(() => import('@shared-components/fantasyTips/fantasyTeam'))
const NoData = dynamic(() => import('@noData'), { ssr: false })

const MatchDetailFantasyPlatForm = ({ data, matchId, overview }) => {
  const { t } = useTranslation()
  const [platFormData, setPlatFormData] = useState()
  const typeRef = useRef()

  const [getPlatFormData, { data: updatedPlatFormData }] = useLazyQuery(GET_FANTASY_PLATFORM)
  // const [getPlayerData, { data: playerData }] = useLazyQuery(GET_FANTASY_PLAYER_DATA)

  const handleEvent = (e) => {
    typeRef.current = e.value
    getPlatFormData({ variables: { input: { iMatchId: matchId, ePlatformType: e.value } } })
  }

  const checkInitialLeague = () => {
    if (typeRef.current === 'ew') {
      return { value: 'ew', label: `${t('common:11Wickets')}` }
    } else {
      return { value: 'de', label: `${t('common:Dream11')}` }
    }
  }
  useEffect(() => {
    data && setPlatFormData(data?.aLeague)
  }, [data])

  useEffect(() => {
    updatedPlatFormData && setPlatFormData(updatedPlatFormData?.getFantasyTipsFront?.aLeague)
  }, [updatedPlatFormData])

  // useEffect(() => {
  //   getPlayerData({ variables: { input: { iMatchId: matchId, ePlatformType: overview?.aCricPrediction[0]?.ePlatformType === 'ew' ? 'ew' : 'de' } } })
  // }, [])
  return (
    <Row className="justify-content-center">
      <Col xl={11} xxl={10}>
        {overview?.aCricPrediction?.length !== 0 && (
          <Row className="justify-content-end">
            <Col lg={4} sm={5} xs={7} >
              <CustomSelect
                value={checkInitialLeague()}
                options={optionsPlatFormType}
                placeholder="Select Platform"
                classNamePrefix="custom-select"
                onChange={(e) => handleEvent(e)}
                // isDark={true}
              />
            </Col>
          </Row>
        )}
        {updatedPlatFormData?.getFantasyTipsFront?.aLeague !== null && data?.aLeague !== null ? (
          <>
            <FantasyTeam teamData={platFormData} matchData={data} isBtn updatedTime={dateCheck(data?.dUpdated)} type={typeRef.current}/>
            <div className="text-center mt-4">
              <Link href={`/${data?.oSeo?.sSlug}` || ''} prefetch={false}>
                <a className="theme-btn">
                  <Trans i18nKey="common:ReadFullArticle" />
                </a>
              </Link>
            </div>
          </>
        ) : (
          <NoData />
        )}
      </Col>
    </Row>
  )
}

MatchDetailFantasyPlatForm.propTypes = {
  data: PropTypes.object,
  matchId: PropTypes.string,
  overview: PropTypes.object
}

export default MatchDetailFantasyPlatForm
