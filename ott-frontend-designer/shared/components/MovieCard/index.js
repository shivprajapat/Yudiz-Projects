import React from 'react'
import PropTypes from 'prop-types'
import style from "./style.module.scss";
import MyImage from '../myImage';

const MovieCard = ({ img, title }) => {
  const { movie_card, movie_card_btn } = style;

  return (
    <div className={movie_card}>
      <div className={movie_card_btn}>
        {title}
      </div>
      <figure><MyImage src={img} alt={title} /></figure>
    </div>
  )
}
MovieCard.propTypes = {
  title: PropTypes.string,
  image: PropTypes.object,
}
export default MovieCard