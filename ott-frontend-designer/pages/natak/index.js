import React from 'react'
import style from "./style.module.scss";
import Originals from '@/shared/Home/Originals';
import Recommended from '@/shared/Home/Recommended';
import { Ads, BannerSlider } from '@/shared/components';
import SouthGujarati from '@/shared/Home/South-Gujarati';

const Natak = () => {
    const { movies } = style;

    return (
        <section className={`${movies}`}>
            <BannerSlider />
            <div className='common-margin'>
                <Originals />
                <Recommended />
                <Ads />
                <SouthGujarati />
            </div>
        </section>
    )
}

export default Natak