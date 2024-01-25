import React from 'react'
import style from "./style.module.scss";
import Recommended from '@/shared/Home/Recommended'
import { ArtistCard, InnerBanner } from '@/shared/components'
import { imgCard11, imgCard24, imgCard25, imgCard26, imgCard29, imgSlider3 } from '@/assets/images';
const MoviesDetail = () => {
    const { movies_details, movies_details_inner, movies_details_grid } = style;
    const data = [
        { id: 1, img: imgCard11 },
        { id: 2, img: imgCard24 },
        { id: 3, img: imgCard25 },
        { id: 4, img: imgCard26 },
        { id: 5, img: imgCard29 },
        { id: 6, img: imgCard11 },
        { id: 7, img: imgCard24 },
        { id: 8, img: imgCard25 },
        { id: 9, img: imgCard26 },
        { id: 10, img: imgCard29 },
        { id: 11, img: imgCard11 },
        { id: 12, img: imgCard24 },
        { id: 13, img: imgCard25 },
    ]
    return (
        <section className={movies_details}>
            <InnerBanner bgImage={imgSlider3} />
            <div className='common-margin'>
                <div className={'common-padding' + ' ' + movies_details_inner}>
                    <h6>Cast</h6>
                    <div className={movies_details_grid}>
                        {
                            data?.map((item, index) => {
                                return (
                                    <ArtistCard key={index} img={item.img} title="Udit Narayan" />
                                )
                            })
                        }
                    </div>
                </div>
                <Recommended />
            </div>
        </section>
    )
}

export default MoviesDetail