import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image';
import Slider from 'react-slick';
import Link from 'next/link';

import Button from '../Button';
import MyImage from '../myImage';
import StarButton from '../StarButton';
import style from "./style.module.scss";
import { BannerSliderData } from './data';
import SocialDropdown from '../SocialDropdown';
import WatchListButton from '../WatchListButton';
import IconPlay from '@/assets/images/jsIcon/iconPlay';
import { iconArrowLeft, iconArrowRight, iconShare } from '@/assets/images';

const BannerSlider = () => {
    const { banner, banner_img, banner_slide, arrows, banner_item, banner_btns, banner_btns_list, banner_btn } = style;
    const customSlider = useRef();
    const [sliderSettings] = useState({
        fade: true,
        speed: 500,
        arrows: false,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    })
    const arrowNext = () => {
        customSlider.current.slickNext()
    }
    const arrowPrev = () => {
        customSlider.current.slickPrev()
    }

    return (
        <div className={banner}>
            <Slider ref={customSlider} {...sliderSettings}>
                {BannerSliderData?.map((item, index) => {
                    const { title, image, message1, hour, language } = item;
                    return (
                        <div className={banner_img} key={index}>
                            <MyImage src={image} className={banner_slide} alt='banner' />
                            <div className={banner_item}>
                                <div className={banner_btns}>
                                    <StarButton />
                                    <button className={banner_btn}>{message1}</button>
                                    <h6 className='text-orange'>{hour}</h6>
                                    <h6 className='text-orange'>{language}</h6>
                                </div>
                                <h2>{title}</h2>
                                <div className={`${banner_btns}  ${banner_btns_list}`}>
                                    <Link href='/videoplayer'>
                                        <Button bgOrange BtnIcon={<IconPlay />}>Play Trailer</Button>
                                    </Link>
                                    <WatchListButton />
                                    <SocialDropdown className="m-0" icon={<Image src={iconShare} alt="" />} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Slider>
            <div className={arrows}>
                <button onClick={() => arrowPrev()}>
                    <Image src={iconArrowLeft} alt="iconArrowLeft" />
                </button>
                <button onClick={() => arrowNext()}>
                    <Image src={iconArrowRight} alt="iconArrowRight" />
                </button>
            </div>
        </div>
    )
}
BannerSlider.propTypes = {
    title: PropTypes.string,
    hour: PropTypes.string,
    language: PropTypes.string,
    message1: PropTypes.string
}
export default BannerSlider