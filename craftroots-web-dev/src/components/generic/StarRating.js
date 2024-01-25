import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { iconStarBorder, iconStarFill } from '@/assets/images'

const StarRating = ({ totalStars, initialRating, onChange }) => {
  const selectedIcon = <Image src={iconStarFill} alt="icons" />
  const deselectedIcon = <Image src={iconStarBorder} alt="icons" />
  const [rating, setRating] = useState(initialRating)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleStarClick = (selectedRating) => {
    if (typeof initialRating === 'number') {
      return
    }
    setRating(selectedRating)
    onChange(selectedRating)
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <span
            key={index}
            onClick={() => handleStarClick(starValue)}
            className="cursor-pointer w-5 h-5"
          >
            {starValue <= rating ? selectedIcon : deselectedIcon}
          </span>
        )
      })}
    </div>
  )
}

export default StarRating

StarRating.propTypes = {
  totalStars: PropTypes.number,
  onChange: PropTypes.bool,
  initialRating: PropTypes.number,
}

StarRating.defaultProps = {
  totalStars: 5,
  onChange: true,
  initialRating: 0,
}
