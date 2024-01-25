import React from 'react'
import PropTypes from 'prop-types'
import CustomLink from '@shared/components/customLink'

const ActiveBatterRow = ({ element, index }) => {
  const batterSlug = element?.oBatter?.oSeo?.sSlug
  return (
    <tr className={`${element.highlight && 'highlight'}`}>
      <td>
        {element?.oBatter?.eTagStatus === 'a' ? (
          <CustomLink href={`/${batterSlug}/`} prefetch={false}>
            <a>{element?.oBatter?.sFullName || element?.oBatter?.sShortName}</a>
          </CustomLink>
        ) : (
          element?.oBatter?.sFullName || element?.oBatter?.sShortName
        )}
        {index === 0 && '*'}
      </td>
      <td>{element?.nRuns}</td>
      <td>{element?.nBallFaced}</td>
      <td>{element?.sStrikeRate}</td>
      <td>{element?.nFours}</td>
      <td>{element?.nSixes}</td>
    </tr>
  )
}

ActiveBatterRow.propTypes = {
  element: PropTypes.object,
  index: PropTypes.number
}

export default ActiveBatterRow
