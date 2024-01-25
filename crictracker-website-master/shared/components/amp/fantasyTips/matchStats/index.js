import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import StatPlayerAMP from '@shared-components/amp/fantasyTips/statPlayer'
import { groupBy } from '@shared/utils'
import { fantasyMatchPlayerStats } from '@shared/libs/fantasyMatchPlayerStats'
import TitleBlock from '@shared-components/amp/fantasyTips/titleBlock'

const MatchStatsAMP = ({ matchStats, playerTeam }) => {
  const categoriesData = groupBy(matchStats?.fetchFantasyPlayerStats, (data) => data?.eSeriesStatsType)
  if (categoriesData?.stBmr?.aData?.length || categoriesData?.stBhs?.aData?.length || categoriesData?.stBtwt?.aData?.length || categoriesData?.stBber?.aData?.length) {
    return (
      <>
        <div className='mt-4'>
          <TitleBlock title={<Trans i18nKey="common:PlayersStatsInSeries" />} />
          <div className="commonNav stickyNav d-flex isSticky themeLightNav text-nowrap text-uppercase equal-width-nav scroll-list flex-nowrap t-center">
            <amp-selector role="tablist" on="select:matchStats.toggle(index=event.targetOption, value=true)">
              {fantasyMatchPlayerStats?.map((item, index) => (
                <div role="tab" option={String(index)} key={String(index)} selected={!index} className='item nav-link'>
                  {item?.navItem}
                </div>
              ))}
            </amp-selector>
          </div>
          <div className="ampSelectorContent">
            <amp-selector id="matchStats" role="listbox">
              <div className='viewOptions' role="tabpanel" option='' selected={true}>
                {categoriesData?.stBmr?.aData?.map((player, index) => (<StatPlayerAMP key={index} index={index + 1} playerTeam={playerTeam} data={player} activeTab='stBmr' />))}
              </div>
              <div className='viewOptions' role="tabpanel" option='' >
                {categoriesData?.stBhs?.aData?.map((player, index) => (<StatPlayerAMP key={index} index={index + 1} playerTeam={playerTeam} data={player} activeTab='stBhs' />))}
              </div>
              <div className='viewOptions' role="tabpanel" option='' >
                {categoriesData?.stBtwt?.aData?.map((player, index) => (<StatPlayerAMP key={index} index={index + 1} playerTeam={playerTeam} data={player} activeTab='stBtwt' />))}
              </div>
              <div className='viewOptions' role="tabpanel" option='' >
                {categoriesData?.stBber?.aData?.map((player, index) => (<StatPlayerAMP key={index} index={index + 1} playerTeam={playerTeam} data={player} activeTab='stBber' />))}
              </div>
            </amp-selector>
          </div>
        </div>
      </>
    )
  } else {
    return null
  }
}
MatchStatsAMP.propTypes = {
  fantasyArticleData: PropTypes.object,
  playerTeam: PropTypes.object,
  matchStats: PropTypes.object
}

export default MatchStatsAMP
