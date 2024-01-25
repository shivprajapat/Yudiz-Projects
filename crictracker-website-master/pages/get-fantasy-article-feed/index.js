import PropTypes from 'prop-types'

import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { GET_FANTASY_DETAILS } from '@graphql/fantasy-tips/fantasy-tips.query'
import { arraySortByOrder, handleApiError } from '@shared/utils'
import { allRoutes } from '@shared/constants/allRoutes'
import { convertDate, dateCheck } from '@utils'
import { S3_PREFIX } from '@shared/constants'
function getFantasyArticleFeed({ fantasyArticleData }) {
  const order = ['bat', 'all', 'wk', 'wkbat', 'bowl']
  const teamOnePlayer = arraySortByOrder({ data: fantasyArticleData?.oOverview?.oTeam1?.aPlayers, order, key: 'sPlayingRole' })
  const teamTwoPlayer = arraySortByOrder({ data: fantasyArticleData?.oOverview?.oTeam2?.aPlayers, order, key: 'sPlayingRole' })
  const platFormType = fantasyArticleData?.ePlatformType

  const titleStyle = {
    color: '#045de9',
    textTransform: 'uppercase',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e4e6eb',
    fontWeight: 'bold'
  }
  const pillStyle = {
    borderRadius: '50rem',
    color: '#fff',
    background: '#23272e'
  }
  const playerListStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '0.5rem',
    textAlign: 'center',
    flexWrap: 'wrap'
  }
  const playerStyle = {
    marginRight: '1rem',
    marginLeft: '1rem',
    flexShrink: 0
  }
  return (
    <article className="common-section" id='getFantasyArticleFeed' style={{ background: '#fff' }}>
      <div className="container">
        <h1>{fantasyArticleData?.sTitle}</h1>
        <h2>{fantasyArticleData?.sSubtitle}</h2>
        <section style={{ marginBottom: '16px' }}>
          {fantasyArticleData?.sMatchPreview !== null && <>
            <p style={titleStyle}>Preview</p>
            <div dangerouslySetInnerHTML={{ __html: fantasyArticleData?.sMatchPreview }}></div>
          </>
          }
        </section>
        <section style={{ marginBottom: '16px' }}>
          <p style={titleStyle}>Match Information</p>
          <div className="align-items-center">
            <div>
              <h3 className="small-head mb-2">
                <a href={allRoutes.matchDetail(fantasyArticleData?.oMatch?.oSeo?.sSlug)}>
                  {fantasyArticleData?.oMatch?.sTitle}, {fantasyArticleData?.oMatch?.sSubtitle}
                </a>
              </h3>
              <p className="text-muted">
                {fantasyArticleData?.oMatch?.oSeries?.sTitle && fantasyArticleData?.oMatch?.oSeries?.sTitle + ','} {convertDate(dateCheck(fantasyArticleData?.oMatch?.dStartDate))}{' '}
                {fantasyArticleData?.oMatch?.oVenue?.sLocation && ',' + fantasyArticleData?.oMatch?.oVenue?.sLocation}{' '}
              </p>
            </div>
          </div>
        </section>
        {fantasyArticleData?.oOverview !== null && (
          <>
            <section style={{ marginBottom: '16px' }}>
              <p style={titleStyle}>
                Probable PlayingXI
              </p>
              <p className="big-text fw-bold mb-1">{fantasyArticleData?.oOverview?.oTeam1?.oTeam?.sTitle}</p>
              <p className="big-text mb-2">
                {teamOnePlayer?.map((player, index) => {
                  if (player?._id === fantasyArticleData?.oOverview?.oTeam1?.iC) {
                    return `${index ? ', ' : ''}${player?.sShortName}(${'C'})`
                  }
                  return (index ? ', ' : '') + player?.sShortName
                })}
              </p>
              {fantasyArticleData?.oOverview?.oTeam1?.aBenchedPlayers && (
                <p style={{ padding: '8px', background: '#f2f4f7', borderRadius: '8px' }}>
                  <span className="font-semi text-uppercase">
                    Bench:{' '}
                  </span>
                  {fantasyArticleData?.oOverview?.oTeam1?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
                </p>
              )}
              <p className="big-text fw-bold mb-1">{fantasyArticleData?.oOverview?.oTeam2?.oTeam?.sTitle}</p>
              <p className="big-text mb-2">
                {teamTwoPlayer?.map((player, index) => {
                  if (player?._id === fantasyArticleData?.oOverview?.oTeam2?.iC) {
                    return `${index ? ', ' : ''}${player?.sShortName}(${'C'})`
                  }
                  return (index ? ', ' : '') + player?.sShortName
                })}
              </p>
              {fantasyArticleData?.oOverview?.oTeam2?.aBenchedPlayers && (
                <p style={{ padding: '8px', background: '#f2f4f7', borderRadius: '8px' }}>
                  <span className="font-semi text-uppercase">
                    Bench:{' '}
                  </span>
                  {fantasyArticleData?.oOverview?.oTeam2?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
                </p>
              )}
            </section>
            <section style={{ marginBottom: '16px' }}>
              <p style={titleStyle}>Injury News</p>
              <div dangerouslySetInnerHTML={{ __html: fantasyArticleData?.oOverview?.sNews }}></div>
            </section>
          </>
        )}
        <section style={{ marginBottom: '16px' }}>
          <div className="list">
            {fantasyArticleData?.oOverview?.sWeatherReport && (
              <div>
                <section style={{ marginBottom: '16px' }}>
                  <p style={titleStyle}>
                    Weather Report
                  </p>
                  <div className="big-text font-semi">{fantasyArticleData?.oOverview?.sWeatherReport}</div>
                </section>
              </div>
            )}
            {fantasyArticleData?.oOverview?.oWinnerTeam?.sTitle && (
              <div>
                <section style={{ marginBottom: '16px' }}>
                  <p style={titleStyle}>
                    Win Prediction
                  </p>
                  <div className="big-text font-semi">{fantasyArticleData?.oOverview?.oWinnerTeam?.sTitle}</div>
                </section>
              </div>
            )}
            {fantasyArticleData?.oOverview?.sPitchCondition && (
              <div>
                <section id="pitch" style={{ marginBottom: '16px' }}>
                  <p style={titleStyle}>
                    Pitch Condition
                  </p>
                  <div className="big-text font-semi">{fantasyArticleData?.oOverview?.sPitchCondition}</div>
                </section>
              </div>
            )}
            {fantasyArticleData?.oOverview?.sAvgScore && (
              <div>
                <section style={{ marginBottom: '16px' }}>
                  <p style={titleStyle}>
                    Avg 1st Inning Score
                  </p>
                  <div className="big-text font-semi">{fantasyArticleData?.oOverview?.sAvgScore}</div>
                </section>
              </div>
            )}
          </div>
        </section>
        <section style={{ marginBottom: '16px' }}>
          {fantasyArticleData?.oOverview?.sPitchReport !== null && <>
            <p style={titleStyle}>Pitch Report</p>
            <div dangerouslySetInnerHTML={{ __html: fantasyArticleData?.oOverview?.sPitchReport }}></div>
          </>
          }
        </section>
        {fantasyArticleData?.sMustPick &&
          <section style={{ marginBottom: '16px' }}>
            {fantasyArticleData?.oOverview?.sPitchReport !== null && <>
              <p style={titleStyle}>Must Pick For Fantasy</p>
              <div dangerouslySetInnerHTML={{ __html: fantasyArticleData?.sMustPick }}></div>
            </>
            }
          </section>
        }
        {fantasyArticleData?.oOtherInfo?.sExpertAdvice.length !== 0 && (
          <section style={{ marginBottom: '16px' }}>
            {fantasyArticleData?.oOverview?.sPitchReport !== null && <>
              <p style={titleStyle}>Expert Advice</p>
              <div dangerouslySetInnerHTML={{ __html: fantasyArticleData?.oOtherInfo?.sExpertAdvice }}></div>
            </>
            }
          </section>
        )}
        <section style={{ marginBottom: '16px' }}>
          <p style={titleStyle}>Captains</p>
          <div style={{ marginBottom: '16px' }}>
            {
              fantasyArticleData?.aCVCFan?.map((captainData, index) => (
                <div key={index}>
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ marginRight: '16px', textAlign: 'center', flexShrink: '0' }}>
                      <img src={captainData.playerImg || `${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="64" height="64" />
                      <div style={pillStyle}>
                        {captainData?.oPlayerFan?.nRating}
                      </div>
                      {platFormType === 'captains' && (
                        <div style={{ color: '#fff' }}>
                          {captainData?.eType === 'v' ? 'VC' : 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ margin: '4px 0' }}>
                        <span className={`fw-bold me-2 ${!captainData?.sDescription && 'd-block'}`}>{captainData?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
                        <span style={{ color: '#50555D' }}>
                          {captainData?.oPlayerFan?.oTeam?.sAbbr && captainData?.oPlayerFan?.oTeam?.sAbbr + ' | '} {captainData?.oPlayerFan?.oPlayer?.sPlayingRole}
                        </span>
                      </p>
                      {captainData?.sDescription && <p style={{ color: '#50555D', marginBottom: '0' }}>{captainData?.sDescription}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <p style={titleStyle}>Top</p>
          <div style={{ marginBottom: '16px' }}>
            {
              fantasyArticleData?.aTopicPicksFan?.map((topPickData, index) => (
                <div key={index}>
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ marginRight: '16px', textAlign: 'center', flexShrink: '0' }}>
                      <img src={topPickData.playerImg || `${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="64" height="64" />
                      <div style={pillStyle}>
                        {topPickData?.oPlayerFan?.nRating}
                      </div>
                      {platFormType === 'captains' && (
                        <div style={{ color: '#fff' }}>
                          {topPickData?.eType === 'v' ? 'VC' : 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ margin: '4px 0' }}>
                        <span className={`fw-bold me-2 ${!topPickData?.sDescription && 'd-block'}`}>{topPickData?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
                        <span style={{ color: '#50555D' }}>
                          {topPickData?.oPlayerFan?.oTeam?.sAbbr && topPickData?.oPlayerFan?.oTeam?.sAbbr + ' | '} {topPickData?.oPlayerFan?.oPlayer?.sPlayingRole.toUpperCase()}
                        </span>
                      </p>
                      {topPickData?.sDescription && <p style={{ color: '#50555D', marginBottom: '0' }}>{topPickData?.sDescription}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <p style={titleStyle}>Budget</p>
          <div style={{ marginBottom: '16px' }}>
            {
              fantasyArticleData?.aBudgetPicksFan?.map((budgetData, index) => (
                <div key={index}>
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ marginRight: '16px', textAlign: 'center', flexShrink: '0' }}>
                      <img src={budgetData.playerImg || `${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="64" height="64" />
                      <div style={pillStyle}>
                        {budgetData?.oPlayerFan?.nRating}
                      </div>
                      {platFormType === 'captains' && (
                        <div style={{ color: '#fff' }}>
                          {budgetData?.eType === 'v' ? 'VC' : 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ margin: '4px 0' }}>
                        <span className={`fw-bold me-2 ${!budgetData?.sDescription && 'd-block'}`}>{budgetData?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
                        <span style={{ color: '#50555D' }}>
                          {budgetData?.oPlayerFan?.oTeam?.sAbbr && budgetData?.oPlayerFan?.oTeam?.sAbbr + ' | '} {budgetData?.oPlayerFan?.oPlayer?.sPlayingRole}
                        </span>
                      </p>
                      {budgetData?.sDescription && <p style={{ color: '#50555D', marginBottom: '0' }}>{budgetData?.sDescription}</p>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        {fantasyArticleData?.aAvoidPlayer?.length !== 0 && (
          <section className="common-section pb-0">
            <p style={titleStyle}>
              Avoid Player Message
            </p>
            <div>
              {fantasyArticleData?.aAvoidPlayerFan &&
                fantasyArticleData?.aAvoidPlayerFan.map((player, index) => (
                  <div key={index}>
                    <div className="item d-flex align-items-center mb-2">
                      <div style={{ marginRight: '16px', textAlign: 'center', flexShrink: '0' }}>
                        <img src={`${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" placeholder="blur" width="64" height="64" />
                        <div style={pillStyle}>
                          {player?.oPlayerFan?.nRating}
                        </div>
                      </div>
                      <div>
                        <p style={{ marginBottom: '4px', fontWeight: '600' }}>{player?.oPlayerFan?.oPlayer?.sFirstName}</p>
                        <p style={{ color: '#50555D' }}>
                          {player?.oPlayerFan?.oTeam?.sAbbr && player?.oPlayerFan?.oTeam?.sAbbr + ' | '} {player?.oPlayerFan?.oPlayer?.sPlayingRole?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
        {/* <FantasyTeam fantasystyles={fantasyStyles} type={fantasyArticleData?.ePlatformType} teamData={fantasyArticleData?.aLeague} matchData={fantasyArticleData?.oMatch} updatedTime={dateCheck(data?.dUpdated)} /> */}
        {/* <SingleFantasyLeague styles={styles} key={indexI + indexJ} indexJ={indexJ} data={fantasyTeam} type={type} teamAID={matchData?.oTeamA?._id} /> */}
        {/* <PlayerRoles styles={styles} key={index} data={player} capData={data} teamA={teamAID}/> */}
        <div className="teamSlider fantasy-team-slider simple-arrow pb-3">
          {fantasyArticleData?.aLeague?.map((team, indexI) => {
            return (
              team?.aTeam?.map((fantasyTeam, indexJ) => {
                // console.log('fantasyTeam', fantasyTeam)

                const totalCredits = 100
                const credits = fantasyTeam?.aSelectedPlayerFan?.reduce((acc, credit) => (fantasyTeam?.oTPFan?._id !== credit._id) && acc + credit.nRating, 0)
                return (
                  <div key={indexJ} style={{ marginTop: '16px' }}>
                    <p style={titleStyle}>{team?.eLeagueFull}</p>
                    <div className="teamBlock" style={{ background: '#e4e6eb', borderRadius: '24px' }}>
                      <div className="info" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 12px 10px' }}>
                        <p style={{ margin: '0' }}>
                          <span>Players</span> <br />
                          {fantasyTeam?.aSelectedPlayerFan?.length}/{fantasyArticleData?.ePlatformType === 'ew' ? 12 : 11}
                        </p>
                        <div className="mb-0">
                          <p style={{ textAlign: 'center', margin: '0' }}>
                            Team {indexJ + 1}
                          </p>
                          <div className="d-flex align-items-center">
                            <div className="point text-dark bg-light ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3">{fantasyTeam?.oTeamA?.sTitle}</div>
                            <p className="flex-shrink-0 ms-2 me-2 ms-sm-3 me-sm-3 mb-0">
                              {fantasyTeam?.oTeamA?.nCount} : {fantasyTeam?.oTeamB?.nCount}
                            </p>
                            <div className="point text-light bg-dark ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3">{fantasyTeam?.oTeamB?.sTitle}</div>
                          </div>
                        </div>
                        <p style={{ textAlign: 'right', margin: '0' }}>
                          <span>CreditsLeft</span> <br />
                          {totalCredits - credits}/100
                        </p>
                      </div>
                      <div className="team" style={{ padding: '16px 8px', background: `url(${S3_PREFIX}static/cricket-ground.svg) no-repeat center center / cover`, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px' }}>
                        <label style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>WicketKeeper</label>
                        <div style={playerListStyle}>
                          {fantasyTeam?.aSelectedPlayerFan?.map((player, index) => {
                            return (player?.oPlayer?.sPlayingRole === 'wk' || player?.oPlayer?.sPlayingRole === 'wkbat') &&
                              <div style={playerStyle}>
                                <img src={`${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="40" height="40" />
                                <div style={{ padding: '2px 4px', borderRadius: '4px', background: player.teamAID === player?.oTeam?._id ? '#fff' : '#23272e', color: player.teamAID === player?.oTeam?._id ? '#000' : '#fff' }}
                                >
                                  {player?.oPlayer?.sShortName || player?.oPlayer?.sFirstName}
                                </div>
                                {player?._id === player?.oCapFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    C
                                  </div>
                                )}
                                {player?._id === player?.oVCFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    VC
                                  </div>
                                )}
                                {player?._id === player?.oTPFan?._id && (
                                  <div style={{ color: '#fff' }}>12</div>
                                )}
                                <p className="xsmall-text text-light mt-1">{player?.nRating}</p>
                              </div>
                          })}
                        </div>
                        <label style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>Batter</label>
                        <div style={playerListStyle}>
                          {fantasyTeam?.aSelectedPlayerFan?.map((player, index) => {
                            return player?.oPlayer?.sPlayingRole === 'bat' &&
                              <div style={playerStyle}>
                                <img src={`${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="40" height="40" />
                                <div style={{ padding: '2px 4px', borderRadius: '4px', background: player.teamAID === player?.oTeam?._id ? '#fff' : '#23272e', color: player.teamAID === player?.oTeam?._id ? '#000' : '#fff' }}>
                                  {player?.oPlayer?.sShortName || player?.oPlayer?.sFirstName}
                                </div>
                                {player?._id === player?.oCapFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    C
                                  </div>
                                )}
                                {player?._id === player?.oVCFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    VC
                                  </div>
                                )}
                                {player?._id === player?.oTPFan?._id && (
                                  <div style={{ color: '#fff' }}>12</div>
                                )}
                                <p className="xsmall-text text-light mt-1">{player?.nRating}</p>
                              </div>
                          })}
                        </div>
                        <label style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>AllRounder</label>
                        <div style={playerListStyle}>
                          {fantasyTeam?.aSelectedPlayerFan?.map((player, index) => {
                            return player?.oPlayer?.sPlayingRole === 'all' &&
                              <div style={playerStyle}>
                                <img src={`${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="40" height="40" />
                                <div style={{ padding: '2px 4px', borderRadius: '4px', background: player.teamAID === player?.oTeam?._id ? '#fff' : '#23272e', color: player.teamAID === player?.oTeam?._id ? '#000' : '#fff' }}>
                                  {player?.oPlayer?.sShortName || player?.oPlayer?.sFirstName}
                                </div>
                                {player?._id === player?.oCapFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    C
                                  </div>
                                )}
                                {player?._id === player?.oVCFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    VC
                                  </div>
                                )}
                                {player?._id === player?.oTPFan?._id && (
                                  <div style={{ color: '#fff' }}>12</div>
                                )}
                                <p className="xsmall-text text-light mt-1">{player?.nRating}</p>
                              </div>
                          })}
                        </div>
                        <label style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}>Bowler</label>
                        <div style={playerListStyle}>
                          {fantasyTeam?.aSelectedPlayerFan?.map((player, index) => {
                            return player?.oPlayer?.sPlayingRole === 'bowl' &&
                              <div style={playerStyle}>
                                <img src={`${S3_PREFIX}static/player-placeholder-min.jpeg`} alt="user" width="40" height="40" />
                                <div style={{ padding: '2px 4px', borderRadius: '4px', background: player.teamAID === player?.oTeam?._id ? '#fff' : '#23272e', color: player.teamAID === player?.oTeam?._id ? '#000' : '#fff' }}>
                                  {player?.oPlayer?.sShortName || player?.oPlayer?.sFirstName}
                                </div>
                                {player?._id === player?.oCapFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    C
                                  </div>
                                )}
                                {player?._id === player?.oVCFan?._id && (
                                  <div style={{ color: '#fff' }}>
                                    VC
                                  </div>
                                )}
                                {player?._id === player?.oTPFan?._id && (
                                  <div style={{ color: '#fff' }}>12</div>
                                )}
                                <p className="xsmall-text text-light mt-1">{player?.nRating}</p>
                              </div>
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )
          })}
        </div>
        <section style={{ marginBottom: '16px' }}>
          {fantasyArticleData?.oOverview?.sPitchReport !== null && <>
            <p style={titleStyle}>DISCLAIMER</p>
            <div>This team is based on the understanding, analysis, and instinct of the author. While selecting your team, consider the points mentioned and make your own decision.</div>
          </>
          }
        </section>
      </div>
    </article >
  )
}
getFantasyArticleFeed.propTypes = {
  error: PropTypes.any
}

export default getFantasyArticleFeed
export async function getServerSideProps({ query, res, resolvedUrl }) {
  try {
    if (query?.slug) {
      const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: query?.slug } })
      const { data: fantasyArticleData } = await queryGraphql(GET_FANTASY_DETAILS, { input: { _id: idData?.getSeoData?.iId } })
      return {
        props: {
          fantasyArticleData: fantasyArticleData?.getFrontFantasyArticle
        }
      }
    } else {
      return { notFound: true }
    }
  } catch (e) {
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
