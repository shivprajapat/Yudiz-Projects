import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { allRoutes } from 'shared/constants/AllRoutes'
import { useHistory } from 'react-router'
import PermissionProvider from '../permission-provider'

const Poll = ({ content, isPermitted, handleDelete }) => {
  const history = useHistory()

  const [vote, setVote] = useState(true)
  const handleVote = () => {
    setVote(!vote)
  }
  const getTotalPercentageVote = (vote) => {
    const totalVote = content?.oPoll?.nTotalVote
    const totalPercentage = totalVote > 0 ? (vote * 100) / totalVote : 0
    return `${parseFloat(totalPercentage).toFixed(2)}%`
  }

  return (
    <div className="matchProbability d-flex flex-column gap-3 w-100">
      <div className="w-100 d-flex align-items-start justify-content-between">
        <div className="d-flex flex-column align-items-start">
          {content?.eStatus !== 'pb' && (
            <Badge bg="secondary" className="text-uppercase mb-2">
              {content?.eStatus === 'dr' ? <FormattedMessage id="draft" /> : <FormattedMessage id="scheduled" />}
            </Badge>
          )}
          <h5 className="text-uppercase mb-0">{content?.oPoll?.sTitle}</h5>
          <p className="text-muted text-uppercase">
            <FormattedMessage id="by" /> {content?.oAuthor?.sFName}
          </p>
        </div>
        <div className="d-flex align-items-center text-nowrap">
          <PermissionProvider isAllowedTo="EDIT_POLL">
            <Button
              disabled={isPermitted}
              variant="link"
              className="square icon-btn"
              onClick={() => history.push(allRoutes.editPoll(content?.oPoll?._id))}
            >
              <i className="icon-create d-block" />
            </Button>
          </PermissionProvider>
          {content?.eType === 'poll' && (
          <PermissionProvider isAllowedTo="DELETE_POLL">
            <Button
              variant="link"
              disabled={isPermitted}
              className="square text-danger icon-btn"
              onClick={() => handleDelete(content?._id)}
            >
              <i className="icon-delete d-block" />
            </Button>
          </PermissionProvider>
          )}
        </div>
      </div>
      <section>
        {vote ? (
          <div className="votes common-box text-uppercase">
            {content?.oPoll?.aField?.map((option, index) => {
              return (
                <div key={index} className="item d-flex align-items-center">
                  <div className="flex-grow-1 position-relative">
                    <div
                      className="probability active"
                      style={{ width: option?.nVote === 0 ? '0' : getTotalPercentageVote(option?.nVote) }}
                    ></div>
                    <div className="probability-background"></div>
                  </div>
                  <div className="value big-text text-end">{parseFloat(getTotalPercentageVote(option?.nVote)).toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="votesOption common-box text-uppercase">
            {content?.oPoll?.aField?.map((option, index) => {
              return (
                <Button
                  key={index}
                  onClick={handleVote}
                  variant="outline-secondary"
                  className="d-flex align-items-center justify-content-center"
                >
                  <span>{option?.sTitle}</span>
                </Button>
              )
            })}
          </div>
        )}
      </section>
      <div className="d-flex align-items-center justify-content-between gap-2">
        {content?.oPoll?.nTotalVote || 0} <FormattedMessage id="Votes" />
        <Button variant="secondary" size="sm" onClick={handleVote}>
          {vote ? <FormattedMessage id="seeOptions" /> : <FormattedMessage id="seeVotes" />}
        </Button>
      </div>
    </div>
  )
}

Poll.propTypes = {
  content: PropTypes.object,
  handleDelete: PropTypes.func,
  isPermitted: PropTypes.bool,
  handleUpdatePoll: PropTypes.func
}

export default Poll
