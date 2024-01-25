import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Button from '../Button';
import MyImage from '../myImage';
import PropTypes from 'prop-types'
import StarButton from '../StarButton';
import style from "./style.module.scss";
import { iconShare } from '@/assets/images';
import SocialDropdown from '../SocialDropdown';
import WatchListButton from '../WatchListButton';
import IconPlay from '@/assets/images/jsIcon/iconPlay';

const InnerBanner = ({ bgImage }) => {
    const { banner, banner_img, banner_inner_img, banner_slide, banner_item, banner_btns, banner_btns_list, banner_btn } = style;

    return (
        <div className={banner}>
            <div className={banner_img + ' ' + banner_inner_img}>
                <MyImage src={bgImage} className={banner_slide} alt='banner' />
                <div className={banner_item}>
                    <div className={banner_btns}>
                        <StarButton />
                        <button className={banner_btn}>U/A 16+</button>
                        <h6 className='text-orange'>2h 20m</h6>
                        <h6 className='text-orange'>Gujarati</h6>
                    </div>
                    <h2>Hu Tane Malish</h2>
                    <p>Karan, a 25 year old man, who was raised in the U.S. and has been there since, visits Gujarat, India to claim the wealth that belongs to him. After his grandfather passed away,</p>
                    <div className={`${banner_btns}  ${banner_btns_list}`}>
                        <Link href='/videoplayer'>
                            <Button bgOrange BtnIcon={<IconPlay />}>Play Trailer</Button>
                        </Link>
                        <WatchListButton />
                        <SocialDropdown className="m-0" icon={<Image src={iconShare} alt="" />} />
                    </div>
                </div>
            </div>
        </div>
    )
}
InnerBanner.propTypes = {
    bgImage: PropTypes.object
}
export default InnerBanner