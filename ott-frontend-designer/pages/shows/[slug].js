import React from 'react'

import style from "./style.module.scss";
import Artist from '@/shared/Home/Artist';
import { useSlider } from '@/hooks/useSlider';
import Recommended from '@/shared/Home/Recommended'
import Originals from '@/shared/Home/Originals';
import { imgCard31, imgCard30, imgSlider4, imgCard32, imgCard33, imgCard34 } from '@/assets/images';
import { InnerBanner, MovieThumbnail, PageTitle, SliderNextArrow, SliderPrevArrow } from '@/shared/components'
const MoviesDetail = () => {
    const { shows_details } = style;
    const { handleClick, isMoved, listRef } = useSlider();

    const data = [
        { id: 1, title: "S3 E1 • 15 Dec", img: imgCard30 },
        { id: 2, title: "S3 E1 • 16 Dec", img: imgCard31 },
        { id: 3, title: "S3 E1 • 17 Dec", img: imgCard32 },
        { id: 4, title: "S3 E1 • 18 Dec", img: imgCard33 },
        { id: 5, title: "S3 E1 • 19 Dec", img: imgCard34 },
        { id: 6, title: "S3 E1 • 20 Dec", img: imgCard31 },
        { id: 7, title: "S3 E1 • 21 Dec", img: imgCard32 },
        { id: 8, title: "S3 E1 • 22 Dec", img: imgCard33 },
    ]

    return (
        <section className={shows_details}>
            <InnerBanner bgImage={imgSlider4} />
            <div className='common-margin'>
                <section>
                    <PageTitle title="Season 1" />
                    <div className="custom-slider">
                        <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
                        <div className="slider-container" ref={listRef}>
                            {
                                data?.map((item, index) => {
                                    const { title, img } = item;
                                    return (
                                        <div key={index}> <MovieThumbnail MSize img={img} SeasonTitle={title} /></div>
                                    )
                                })
                            }
                        </div>
                        <SliderNextArrow handleClick={handleClick} />
                    </div>
                </section>
                <section>
                    <PageTitle title="Season 2" />
                    <div className="custom-slider">
                        <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
                        <div className="slider-container" ref={listRef}>
                            {
                                data?.map((item, index) => {
                                    const { title, img } = item;
                                    return (
                                        <div key={index}> <MovieThumbnail MSize img={img} SeasonTitle={title} /></div>
                                    )
                                })
                            }
                        </div>
                        <SliderNextArrow handleClick={handleClick} />
                    </div>
                </section>
                <section>
                    <PageTitle title="Season 3" />
                    <div className="custom-slider">
                        <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
                        <div className="slider-container" ref={listRef}>
                            {
                                data?.map((item, index) => {
                                    const { title, img } = item;
                                    return (
                                        <div key={index}> <MovieThumbnail MSize img={img} SeasonTitle={title} /></div>
                                    )
                                })
                            }
                        </div>
                        <SliderNextArrow handleClick={handleClick} />
                    </div>
                </section>
                <Artist />
                <Recommended />
                <Recommended />
                <Originals />
            </div>
        </section>
    )
}

export default MoviesDetail