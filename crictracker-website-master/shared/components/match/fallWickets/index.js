import React from 'react'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'
import CustomLink from '@shared/components/customLink'
import CommentaryCommonBox from '../commentaryCommonBox'
import { getMatchPlayers } from '@shared/libs/match-detail'

const FallWickets = ({ data }) => {
  const players = getMatchPlayers()
  const { t } = useTranslation()

  function playerName(oBatter) {
    const sSlug = `/${oBatter?.oSeo?.sSlug}/`
    if (oBatter?.eTagStatus === 'a') {
      return (
        <CustomLink href={sSlug} prefetch={false}>
          <a>{oBatter?.sFullName || oBatter?.sShortName}</a>
        </CustomLink>
      )
    } else {
      return oBatter?.sFullName || oBatter?.sShortName
    }
  }

  if (data?.aFOWs?.length) {
    return (
      <CommentaryCommonBox title={t('common:FallOfWickets')}>
        {data?.aFOWs?.map((fow, index) => {
          return (
            <React.Fragment key={index}>
              <span className="text-dark font-semi" key={index}>
                {index ? ', ' : ''}
                {fow?.nScoreDismissal}-{fow?.nWicketNumber}
              </span>{' '}
              ({playerName(players[fow?.iBatterId] || fow?.oBatter)}, {fow?.sOverDismissal})
            </React.Fragment>
          )
        })}
      </CommentaryCommonBox>
    )
  } else return null
}

FallWickets.propTypes = {
  data: PropTypes.object
}

export default FallWickets
