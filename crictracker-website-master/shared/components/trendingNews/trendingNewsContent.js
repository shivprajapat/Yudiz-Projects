import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

import CustomLink from '../customLink'

function TrendingNewsContent({ data }) {
  return (
    <>
      {data?.map((news, index) => (
        <article key={news._id} className="d-flex align-items-start mt-2 mx-3 mx-md-0">
          <b className="num">{index + 1}</b>
          <div className="desc flex-grow-1 pb-2 pe-2 pe-lg-3 pe-xl-4">
            <Badge bg="primary">
              {news?.oCategory?.sName}
            </Badge>
            <h4 className="small-head mt-1 mb-0 font-semi">
              <CustomLink href={'/' + news?.oSeo?.sSlug} prefetch={false}>
                <a className="overflow-hidden line-clamp-3">{news?.sTitle}</a>
              </CustomLink>
            </h4>
          </div>
        </article>
      ))}
    </>
  )
}
TrendingNewsContent.propTypes = {
  data: PropTypes.array
}

export default TrendingNewsContent
