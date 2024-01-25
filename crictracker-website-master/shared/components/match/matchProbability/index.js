import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { ADD_POLL_ANSWER } from '@graphql/article/article.mutation'
import { countDownCalculations, dateCheck, getCookie, pollExpirationMessage, setCookie } from '@shared/utils'
import useApp from '@shared/hooks/useApp'
import { GET_POLL_BY_ID_FRONT } from '@graphql/globalwidget/rankings.query'
import { PollIcon } from '@shared-components/ctIcons'

const PollOptions = dynamic(() => import('@shared/components/match/matchProbability/pollOptions'))

const MatchProbability = ({ oPoll, updateDate, authorName, pollDetails }) => {
  const { t } = useTranslation()

  const [pollData, setPollData] = useState()
  const { isPreview } = useApp()

  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    if (pollDetails?.mValue?._id) {
      setSelectedOption(isAlreadyAnswered(pollDetails?.mValue?._id)?.iOptionId)
    } else {
      setSelectedOption(isAlreadyAnswered(oPoll?._id)?.iOptionId)
      setPollData(oPoll)
    }
  }, [pollDetails?.mValue?._id, oPoll?._id, updateDate])

  const [getPollById] = useLazyQuery(GET_POLL_BY_ID_FRONT, {
    variables: { input: { _id: pollDetails?.mValue?._id } },
    onCompleted: (data) => {
      if (data && data?.getPollByIdFront) {
        setPollData(data.getPollByIdFront)
      }
    }
  })

  const data = countDownCalculations(dateCheck(pollData ? pollData?.dEndDate : oPoll?.dEndDate)) || {
    days: '00',
    hours: '00',
    min: '00',
    sec: '00'
  }

  const { message, isExpired } = pollExpirationMessage(data)

  useEffect(() => {
    if (pollDetails) {
      getPollById()
    } else {
      setPollData(oPoll)
    }
  }, [pollDetails])

  const [answerPoll] = useMutation(ADD_POLL_ANSWER)

  function isAlreadyAnswered(id) {
    if (typeof window === 'undefined') return
    const pollAnswered = !!getCookie('poll-answered')
    const alreadyAnsweredPolls = pollAnswered ? JSON.parse(getCookie('poll-answered')) : getCookie('poll-answered')
    return alreadyAnsweredPolls?.length && alreadyAnsweredPolls?.find((ans) => ans.id === id)
  }

  const handleVote = ({ iOptionId }) => {
    if (!isAlreadyAnswered(pollDetails ? pollDetails?.mValue?._id : oPoll?._id) && !isExpired) {
      setSelectedOption(iOptionId)
      const alreadyAnsweredPolls = typeof window !== 'undefined' ? getCookie('poll-answered') || getCookie('poll-answered') : null
      answerPoll({ variables: { input: { _id: pollDetails ? pollDetails?.mValue?._id : oPoll?._id, iOptionId } } }).then(() => {
        setCookie({
          cName: 'poll-answered',
          cValue: JSON.stringify([
            ...(alreadyAnsweredPolls?.length ? JSON.parse(alreadyAnsweredPolls) : []),
            { id: pollDetails ? pollDetails?.mValue?._id : oPoll?._id, iOptionId }
          ]),
          exDays: 2
        })
        const poll = { ...pollData }
        poll.nTotalVote = poll?.nTotalVote + 1
        poll.aField = poll.aField.map((field) => (field._id === iOptionId && iOptionId ? { ...field, nVote: field.nVote + 1 } : field))
        setPollData(poll)
      })
    }
  }

  return (
    <>
      {pollDetails ? (
        <div className="widget">
        <div className="widget-title">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className="icon me-1">
              <PollIcon/>
            </span>
            {t('common:Poll')}
          </h3>
        </div>
        <section>
          <div>
            <div className={`${styles.widgetPollTitle} d-flex align-items-center justify-content-between p-1 px-2 mb-1 w-100`}>
              <h3 className="mb-0 small-head">{pollData?.sTitle}</h3>
              <span className="text-primary xsmall-text p-2">{message}</span>
            </div>
            <div className={`${styles.widgetPollVote} d-flex justify-between flex-column p-3`}>
              {pollData?.aField?.map((poll, key) => {
                return (
                  <PollOptions
                    isPreview={isPreview}
                    selectedOption={selectedOption}
                    handleVote={handleVote}
                    key={key}
                    oPollOption={poll}
                    totalPollCount={pollData?.nTotalVote}
                    isExpired={isExpired}
                    isWidgetPoll={!!pollDetails}
                  />
                )
              })}
              <div className="text-end xsmall-text text-capitalize">
                <Trans i18nKey="common:TotalVotes" />: {pollData?.nTotalVote || 0}
              </div>
            </div>
          </div>
        </section>
      </div>
      ) : (
        <section className={`${styles.matchProbability}`}>
          <div className={`${styles.title} d-flex align-items-center mb-2 mb-md-3 w-100`}>
            <h4 className="text-uppercase mb-0">{pollData?.sTitle}</h4>
            <span className="text-primary xsmall-text p-2">{message}</span>
          </div>
          <div className="common-box text-uppercase p-0 mb-0">
            {pollData?.aField?.map((poll, key) => {
              return (
                <PollOptions
                  isPreview={isPreview}
                  selectedOption={selectedOption}
                  handleVote={handleVote}
                  key={key}
                  oPollOption={poll}
                  totalPollCount={pollData?.nTotalVote}
                  isExpired={isExpired}
                />
              )
            })}
            <div className="d-flex justify-content-between align-items-center ">
              {authorName ? (
                <div className="text-capitalize">
                  <span className="small-text">
                    <Trans i18nKey="common:By" />{' '}
                  </span>
                  <span className="text-primary small-text fw-bold ">{authorName}</span>
                </div>
              ) : null}
              <div className="xsmall-text text-capitalize">
                {pollData?.nTotalVote || 0} <Trans i18nKey="common:Votes" />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

MatchProbability.propTypes = {
  oPoll: PropTypes.object,
  authorName: PropTypes.string,
  updateDate: PropTypes.number,
  pollDetails: PropTypes.object
}

export default MatchProbability
