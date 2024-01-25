import React, { useState } from 'react'
// import Image from 'next/image';
// import Button from '../Button';
import MyImage from '../myImage';
import PropTypes from 'prop-types'
import style from "./style.module.scss";
// import StarButton from '../StarButton'
// import ViewButton from '../ViewButton';
// import { iconAngleRightArrow } from '@/assets/images';
import MovieThumbnailPreview from '../MovieThumbnailPreview';

const MovieThumbnail = ({ img, title, MSize, LSize, HSize, shape, number, AD,SeasonTitle }) => {
  const { movie_item, movie_item_inner, movie_item_inner_btn, movie_item_m, movie_item_l, movie_item_h, movie_item_inner_shape, add, add_btn, movie_item_shape_l ,movie_item_title} = style;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`${movie_item} ${MSize ? movie_item_m : ""} ${LSize ? movie_item_l : ""} ${shape ? movie_item_shape_l : ""} ${HSize ? movie_item_h : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    // onClick={()=> setIsHovered(!isHovered)}
    >
      <div className={movie_item_inner}>
        <div className={movie_item_inner_btn}>
          {/* // ! TODO: ADS Component Show AD Button */}
          {/* {AD && AD ? <button className={add_btn}>ad</button> : <><ViewButton title={title} />
            <StarButton /></>} */}

        </div>
        <figure>
          {shape && <div className={movie_item_inner_shape}>
            <p>{number}</p>
          </div>}
          <MyImage src={img} layout="responsive" alt={title} />
          {
            SeasonTitle && <div className={movie_item_title}><p>{SeasonTitle}</p></div>
          }
          {/* // ! TODO: ADS Component Show AD Content */}

          {/* {AD && <div className={add}><h4>If you can dream it, we can make it.</h4> <Button RadiusBtn bgDark BtnIcon={<Image src={iconAngleRightArrow} alt="iconAngleRightArrow" />}>
            <span>Book Now</span>
          </Button>
          </div>} */}
        </figure>
      </div>
      {/* // ! TODO: Hover Effects not Showing */}

      {/* {isHovered && <MovieThumbnailPreview isHovered={isHovered} />} */}
      <MovieThumbnailPreview isHovered={isHovered} />
    </div>
  )
}
MovieThumbnail.propTypes = {
  AD: PropTypes.bool,
  LSize: PropTypes.bool,
  MSize: PropTypes.bool,
  HSize: PropTypes.bool,
  shape: PropTypes.bool,
  title: PropTypes.string,
  image: PropTypes.object,
  image: PropTypes.object,
  SeasonTitle: PropTypes.bool,
  number: PropTypes.number || PropTypes.string,
  
}
export default MovieThumbnail