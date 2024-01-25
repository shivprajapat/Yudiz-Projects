import React from 'react'
import PropTypes from 'prop-types'
import CustomLink from '@shared/components/customLink'

const ActiveBowlerRow = ({ element, index }) => {
  const bowlerSlug = element?.oBowler?.oSeo?.sSlug
  return (
    <tr key={index} className={`${element.highlight && 'highlight'}`}>
      <td>
        {element?.oBowler?.eTagStatus === 'a' ? (
          <CustomLink href={`/${bowlerSlug}/`} prefetch={false}><a>{element?.oBowler?.sFullName || element?.oBatter?.sShortName}</a></CustomLink>
        ) : (
          element?.oBowler?.sFullName || element?.oBatter?.sShortName
        )}
        {index === 0 && '*'}
      </td>
      <td>{element?.sOvers}</td>
      <td>{element?.nMaidens}</td>
      <td>{element?.nRunsConceded}</td>
      <td>{element?.nWickets}</td>
      <td>{element?.sEcon}</td>
    </tr>
  )
}

ActiveBowlerRow.propTypes = {
  element: PropTypes.object,
  index: PropTypes.number
}

export default ActiveBowlerRow
