import React from 'react'
import style from "./style.module.scss";
import Top10 from '@/shared/Home/Top10';
import Trending from '@/shared/Home/Trending';
import EverGreen from '@/shared/Home/EverGreen';
import OldIsGold from '@/shared/Home/OldIsGold';
import Originals from '@/shared/Home/Originals';
import Recommended from '@/shared/Home/Recommended';
import { Ads, BannerSlider } from '@/shared/components';
import SouthGujarati from '@/shared/Home/South-Gujarati';
import CriticallyAcclaimed from '@/shared/Home/CriticallyAcclaimed';
import Link from 'next/link';

// TODO: Remove Link Tag
const Movies = () => {
    const { movies } = style;

    return (
        <section className={movies}>
            <BannerSlider />
            <div className='common-margin'>
                <Link href="/movies/abc" className='position-relative text-danger'>movies Details</Link>
                <Recommended />
                <Trending />
                <Ads />
                <Originals />
                <Top10 />
                <OldIsGold />
                <SouthGujarati />
                <CriticallyAcclaimed />
                <EverGreen />
            </div>
        </section>
    )
}

export default Movies