import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

import { convertDate } from 'shared/utils'
import { URL_PREFIX } from 'shared/constants'
import ToolTip from 'shared/components/tooltip'

function TagItemRowActive({ tag, selectedTab }) {
  return (
    <>
      {selectedTab === 'API' && (
        <tr key={tag?._id} className='api-table-row'>
          <td className='row-title'>
            <p className='title'>{tag?.sSlugName}</p>
          </td>
           {tag?.nCounts?.map((count, i) => {
             return (
              <td key={i} className='row-counts'>
                <p className='title'>{count || '--'}</p>
              </td>
             )
           })}
        </tr>
      )}
      {(selectedTab === 'Articles' || selectedTab === 'Exclusive Articles') && (
        <tr key={tag?._id}>
          <td>
            <p className='title'>{tag?.oArticle?.sTitle}</p>
          </td>
          <td>{tag?.oSeo?.sSlug || '/feed'}</td>
          <td>{convertDate(tag?.dFetchedOn)}</td>
          <td>
            <ToolTip toolTipMessage='Open in new tab'>
              <a className='link' href={`${URL_PREFIX}/${tag?.oSeo?.sSlug}`} target='_blank' rel='noreferrer'>
                <Button variant='link' className='square icon-btn'>
                  <i className='icon-language d-block' />
                </Button>
              </a>
            </ToolTip>
          </td>
        </tr>
      )}
      {selectedTab === 'Categories' && (
        <tr key={tag?._id}>
          <td>
            <p className='title'>{tag?.oArticle?.sTitle}</p>
          </td>
          <td>{tag?.oSeo?.sSlug || '-'}</td>
          <td>
            <ToolTip toolTipMessage='Open in new tab'>
              <a className='link' href={`${URL_PREFIX}/${tag?.oSeo?.sSlug}`} target='_blank' rel='noreferrer'>
                <Button variant='link' className='square icon-btn'>
                  <i className='icon-language d-block' />
                </Button>
              </a>
            </ToolTip>
          </td>
        </tr>
      )}
    </>
  )
}
TagItemRowActive.propTypes = {
  tag: PropTypes.object,
  index: PropTypes.number,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func,
  selectedTab: PropTypes.string.isRequired
}
export default TagItemRowActive
