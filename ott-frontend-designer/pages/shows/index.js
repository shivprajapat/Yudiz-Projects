import React from 'react'
import style from "./style.module.scss";
import Trending from '@/shared/Home/Trending';
import Originals from '@/shared/Home/Originals';
import Recommended from '@/shared/Home/Recommended';
import { Ads, BannerSlider } from '@/shared/components';
import SouthGujarati from '@/shared/Home/South-Gujarati';
import CriticallyAcclaimed from '@/shared/Home/CriticallyAcclaimed';
import International from '@/shared/Home/International';
import Link from 'next/link';

const Shows = () => {
    const { shows } = style;

    return (
        <section className={`${shows}`}>
            <BannerSlider />
            <div className='common-margin'>
            <Link href="/shows/abc" className='position-relative text-danger'>shows Details</Link>
             <Originals />
                <Recommended />
                <Ads />
                <Trending />
                <SouthGujarati />
                <CriticallyAcclaimed />
                <International/>
            </div>
        </section>
    )
}

export default Shows