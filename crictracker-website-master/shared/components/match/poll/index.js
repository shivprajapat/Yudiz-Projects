import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import { useLazyQuery, useMutation } from '@apollo/client'

import styles from './style.module.scss'
import { ADD_POLL_ANSWER } from '@graphql/article/article.mutation'
import { countDownCalculations, dateCheck, getCookie, pollExpirationMessage, setCookie } from '@shared/utils'
import useApp from '@shared/hooks/useApp'
import { GET_POLL_BY_ID_FRONT } from '@graphql/globalwidget/rankings.query'

const PollOptions = dynamic(() => import('@shared/components/match/poll/pollOptions'))

const Poll = ({ details, pollId, isWidgetPoll, authorName, updateDate }) => {
  const { isPreview } = useApp()
  const [pollData, setPollData] = useState(details)
  const [selectedOption, setSelectedOption] = useState('')
  const date = new Date()
  // Add 1 days to the current date
  date.setDate(date.getDate() + 1)

  const data = countDownCalculations(dateCheck(pollData?.dEndDate || date))
  const { message, isExpired } = pollExpirationMessage(data)

  const [answerPoll] = useMutation(ADD_POLL_ANSWER)
  const [getPollById] = useLazyQuery(GET_POLL_BY_ID_FRONT, {
    variables: { input: { _id: pollId } },
    onCompleted: (data) => {
      if (data && data?.getPollByIdFront) {
        setPollData(data.getPollByIdFront)
      }
    }
  })

  useEffect(() => {
    if (pollData?._id) {
      setSelectedOption(isAlreadyAnswered(pollData?._id))
    }
  }, [pollData?._id])

  useEffect(() => { // For subscription when admin changes the poll options
    if (updateDate && details?._id) {
      setSelectedOption(isAlreadyAnswered(details?._id))
      setPollData(details)
    }
  }, [updateDate])

  useEffect(() => {
    if (pollId) getPollById()
  }, [pollId])

  function isAlreadyAnswered(id) {
    if (typeof window === 'undefined') return
    const pollAnswered = getCookie(id)
    return pollAnswered || undefined
  }

  const handleVote = ({ iOptionId }) => {
    if (!isAlreadyAnswered(pollData?._id) && !isExpired) {
      setSelectedOption(iOptionId)
      answerPoll({ variables: { input: { _id: pollData?._id, iOptionId } } }).then(() => {
        setCookie({
          cName: pollData?._id,
          cValue: iOptionId,
          exDays: data?.days
        })
        const poll = { ...pollData }
        poll.nTotalVote = poll?.nTotalVote + 1
        poll.aField = poll.aField.map((field) => (field._id === iOptionId && iOptionId ? { ...field, nVote: field.nVote + 1 } : field))
        setPollData(poll)
      })
    }
  }

  return (
    <div className={`${isWidgetPoll ? 'widget' : ''}`}>
      <div className={`${styles.title} ${isWidgetPoll ? styles.widgetTitle : ''} ${isWidgetPoll ? 'light-bg p-2 mb-1' : 'mb-2 mb-md-3'} d-flex justify-content-between align-items-center w-100`}>
        <h3 className={`text-capitalize mb-0 ${isWidgetPoll ? 'small-head' : ''}`}>{pollData?.sTitle}</h3>
        {
          !isWidgetPoll && (
            <span className="text-primary xsmall-text ps-1">{message}</span>
          )
        }
      </div>
      <div className={`${isWidgetPoll ? 'p-2' : ''} ${isWidgetPoll ? styles.widgetVote : ''} light-bg text-uppercase p-0 mb-0`}>
        {pollData?.aField?.map((poll, key) => {
          return (
            <PollOptions
              isPreview={isPreview}
              selectedOption={selectedOption}
              handleVote={handleVote}
              key={poll?._id || key}
              oPollOption={poll}
              totalPollCount={pollData?.nTotalVote}
              isWidgetPoll={isWidgetPoll}
            />
          )
        })}
        <div className="d-flex justify-content-between align-items-center px-1">
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
          {
            isWidgetPoll && (
              <span className="text-primary xsmall-text ps-1">{message}</span>
            )
          }
        </div>
      </div>
    </div>
  )
}

Poll.propTypes = {
  details: PropTypes.object,
  authorName: PropTypes.string,
  pollId: PropTypes.string,
  isWidgetPoll: PropTypes.bool,
  updateDate: PropTypes.number
}

export default Poll
