import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'
import LayoutAmp from '@shared-components/layout/layoutAmp'
import NoDataAMP from '../../noDataAMP'

const PageHeaderAMP = dynamic(() => import('@shared-components/amp/pageHeaderAMP'))
const FantasyTipsItems = dynamic(() => import('@shared-components/amp/fantasyTipsItems'))

export default function FantasyTipsListAMP({ data, seoData }) {
  const { t } = useTranslation()
  const fantasyTipsList = data

  return (
    <>
      <style jsx amp-custom>{`
        main { min-height: calc(100vh - 97px); }
        .container { margin: 0px auto; width: 966px; max-width: 100%; }
        @media (max-width: 767px) { main { padding-bottom: 60px;} }
      `}
      </style>
      <LayoutAmp data={{ oSeo: seoData }}>
        <main>
          <div className="container">
            <section className="common-section">
              {/* {width > 767 && ( // Desktop top
                <Ads
                  id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
                  adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                  dimensionDesktop={[970, 90]}
                  className={'text-center mb-2'}
                  style={{ minHeight: '90px' }}
                />
              )} */}
              <Row>
                <Col lg={9} className="left-content" >
                  <PageHeaderAMP
                    name={t('common:FantasyTips')}
                    desc=""
                  />
                  {fantasyTipsList &&
                    fantasyTipsList.map((fantasy, index) => {
                      if (index === 3) {
                        return (
                          <Fragment key={fantasy?._id}>
                            <FantasyTipsItems data={fantasy} />
                            {/* {width < 768 && (
                              <Ads
                                id="div-ad-gpt-138639789-1646637094-0"
                                adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                                adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                                dimensionDesktop={[728, 90]}
                                dimensionMobile={[300, 250]}
                                mobile
                                className="mb-2 text-center"
                              />
                            )} */}
                          </Fragment>
                        )
                      } else {
                        return <FantasyTipsItems key={fantasy._id} data={fantasy} />
                      }
                    })}
                  {/* {fantasyTipsList?.length < 4 && width < 768 && (
                    <Ads
                      id="div-ad-gpt-138639789-1646637094-0"
                      adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                      adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                      dimensionDesktop={[728, 90]}
                      dimensionMobile={[300, 250]}
                      mobile
                      className="mb-2 text-center"
                    />)
                  } */}
                  {fantasyTipsList?.length === 0 && <NoDataAMP />}
                </Col>
              </Row>
            </section>
          </div>
        </main>
      </LayoutAmp>
    </>
  )
}

FantasyTipsListAMP.propTypes = {
  data: PropTypes.array,
  seoData: PropTypes.object
}
