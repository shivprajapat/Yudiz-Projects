import React, { useEffect, useState, Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import HomeTeam from '../../../assests/images/Team1.png'
import AwayTeam from '../../../assests/images/Team2.png'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import useGetUrl from '../../../api/url/queries/useGetUrl'
function Scorecard (props) {
  const { matchDetails, loadingScorecard, matchSport } = props
  const [teamsArr, setTeamsArr] = useState([])
  const { sMediaUrl } = useGetUrl()

  const previousProps = useRef({
    matchDetails
  }).current

  useEffect(() => {
    if (matchDetails) {
      const teams = matchDetails && matchDetails.sName && matchDetails.sName.split(' ')
      setTeamsArr(teams)
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  return (
    <>
      {loadingScorecard
        ? <SkeletonUpcoming scoredData/>
        : (
          <Fragment>
            {(matchSport && matchSport === 'CRICKET')
              ? (
                <div className="scorecard-cricket">
                  {/* <h4><FormattedMessage id="Scorecard" /></h4> */}
                  <div className="scorecard-item">
                    <div className="t-img"><img alt={<FormattedMessage id="Home" />} src={matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.sImage ? `${sMediaUrl}${matchDetails.oHomeTeam.sImage}` : HomeTeam} /></div>
                    <p>
                      <span className="t-name">
                        <b>
                          {' '}
                          {teamsArr && teamsArr.length && teamsArr[0]}
                          {' '}
                        </b>
                        {' '}
                      </span>
                      <span>
                        {' '}
                        {matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.nScore ? matchDetails.oHomeTeam.nScore : <FormattedMessage id="Yet_to_bat" />}
                        {' '}
                      </span>
                    </p>
                  </div>
                  <div className="scorecard-item">
                    <div className="t-img"><img alt={<FormattedMessage id="Away" />} src={matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.sImage ? `${sMediaUrl}${matchDetails.oAwayTeam.sImage}` : AwayTeam} /></div>
                    <p>
                      <span className="t-name">
                        <b>
                          {' '}
                          {teamsArr && teamsArr.length && teamsArr[2]}
                          {' '}
                        </b>
                        {' '}
                      </span>
                      <span>
                        {' '}
                        {matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.nScore ? matchDetails.oAwayTeam.nScore : <FormattedMessage id="Yet_to_bat" />}
                        {' '}
                      </span>
                    </p>
                  </div>
                  <div className="w-txt">
                    {matchDetails && matchDetails.sWinning}
                    {' '}
                  </div>
                </div>
                )
              : (
                <div className="scorecard">
                  {/* <h4><FormattedMessage id="Scorecard" /></h4> */}
                  <div className="scorecard-item">
                    <div className="first">
                      <img alt={<FormattedMessage id="Home" />} src={matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.sImage ? `${sMediaUrl}${matchDetails.oHomeTeam.sImage}` : HomeTeam} />
                      <p>
                        <b>
                          {' '}
                          {teamsArr && teamsArr.length && teamsArr[0]}
                          {' '}
                        </b>
                        {' '}
                      </p>
                    </div>
                    <div className="second">
                      <p>
                        {' '}
                        {matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.nScore ? matchDetails.oHomeTeam.nScore : <FormattedMessage id="Yet_to_bat" />}
                        {' '}
                      </p>
                      <p className='dash'>-</p>
                      <p>
                        {' '}
                        {matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.nScore ? matchDetails.oAwayTeam.nScore : <FormattedMessage id="Yet_to_bat" />}
                        {' '}
                      </p>
                    </div>
                    <div className="third">
                      <img alt={<FormattedMessage id="Away" />} src={matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.sImage ? `${sMediaUrl}${matchDetails.oAwayTeam.sImage}` : AwayTeam} />
                      <p>
                        <b>
                          {' '}
                          {teamsArr && teamsArr.length && teamsArr[2]}
                          {' '}
                        </b>
                        {' '}
                      </p>
                    </div>
                  </div>
                  <div className="w-txt">
                    {matchDetails && matchDetails.sWinning}
                    {' '}
                  </div>
                </div>
                )
          }
          </Fragment>
          )
      }
    </>
  )
}

Scorecard.propTypes = {
  matchDetails: PropTypes.shape({
    oHomeTeam: PropTypes.shape({
      nScore: PropTypes.Number,
      sImage: PropTypes.string
    }),
    oAwayTeam: PropTypes.shape({
      nScore: PropTypes.Number,
      sImage: PropTypes.string
    }),
    sWinning: PropTypes.string,
    sName: PropTypes.string
  }),
  loadingScorecard: PropTypes.bool,
  matchSport: PropTypes.string
}

export default Scorecard
