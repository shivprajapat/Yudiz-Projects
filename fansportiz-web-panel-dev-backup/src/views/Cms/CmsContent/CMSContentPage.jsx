import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

// Components
import Loading from '../../../component/Loading'

// APIs
import useContestSlug from '../../../api/more/queries/useContestSlug'

function CMSContentPage (props) {
  const { setTitle } = props

  const { slug } = useParams()

  const { data: contentSlugDetails, isLoading: isContestSlugDetailsLoading } = useContestSlug(slug)

  useEffect(() => {
    if (contentSlugDetails) {
      setTitle(contentSlugDetails.sTitle)
    }
  }, [contentSlugDetails])

  if (isContestSlugDetailsLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container no-footer bg-white">
        <div className="cms">
          {
            contentSlugDetails && contentSlugDetails.sContent && (
              <div dangerouslySetInnerHTML={{ __html: contentSlugDetails && contentSlugDetails.sContent && contentSlugDetails.sContent }} className="offer-d-txt" />
            )
          }
        </div>
      </div>
    </>
  )
}

CMSContentPage.propTypes = {
  setTitle: PropTypes.func.isRequired
}

export default CMSContentPage
