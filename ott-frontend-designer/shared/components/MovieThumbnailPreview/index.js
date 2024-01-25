import React from 'react'
import Link from 'next/link';
import Image from 'next/image'
import Button from '../Button';
import PropTypes from 'prop-types'
import StarButton from '../StarButton'
import ViewButton from '../ViewButton';
import style from "./style.module.scss";
import { iconShare } from '@/assets/images';
import SocialDropdown from '../SocialDropdown';
import WatchListButton from '../WatchListButton';
import IconPlay from '@/assets/images/jsIcon/iconPlay';

const MovieThumbnailPreview = ({ isHovered }) => {
  const { movie_preview, movie_preview_inner, movie_preview_inner_btn, movie_btn, movie_preview_content, movie_preview_show } = style;
  return (
    <div className={`${movie_preview} ${isHovered ? movie_preview_show : ""}`}>
      <div className={movie_preview_inner}>
        <div className={movie_preview_inner_btn}>
          <ViewButton title="New Episode" />
          <StarButton />
        </div>
        <Link href='/videoplayer'>
          <figure>
            <video
              src={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              autoPlay={true}
              loop
              muted
            />
          </figure>
        </Link>
      </div>
      <div className={movie_preview_content}>
        <div className="d-flex justify-content-between">
          <button className={movie_btn}>U/A 16+</button>
          <span className='text-orange'>2h 20m</span>
        </div>
        <h6>Jivan Ni Zankhana</h6>
        <div className='d-flex'>
          <Link href='/videoplayer'>
            <Button bgOrange BtnIcon={<IconPlay />}>Play S1 E1</Button>
          </Link>
          <WatchListButton />
          <SocialDropdown className="m-0" icon={<Image src={iconShare} alt="" />} />
        </div>
      </div>
    </div>
  )
}
MovieThumbnailPreview.propTypes = {
  title: PropTypes.string,
  image: PropTypes.object,
  shape: PropTypes.bool,
  image: PropTypes.object,
  number: PropTypes.string,
}
export default MovieThumbnailPreview