import React from 'react'
import PropTypes from 'prop-types'
import style from "./style.module.scss";
import Button from '../Button';
import MyImage from '../myImage';
import ViewButton from '../ViewButton';
import { iconClose } from '@/assets/images';

const MovieWatching = ({ img, title }) => {
  const { movie_watching, movie_watching_inner, movie_watching_inner_btn } = style;

  return (
    <div className={`${movie_watching}`}>
      <div className={movie_watching_inner}>
        <div className={movie_watching_inner_btn}>
          <ViewButton title="Recommended" />
          <Button bgDark Icon={iconClose} />
        </div>
        <figure>
          <MyImage src={img} layout="responsive" alt={title} />
        </figure>
      </div>
    </div>
  )
}
MovieWatching.propTypes = {
  title: PropTypes.string,
  img: PropTypes.object,
}
export default MovieWatching