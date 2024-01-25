import React from 'react'
import style from "./style.module.scss";
import { Heading, MovieThumbnail, Wrapper } from '@/shared/components'
import { imgCard21, imgCard22, imgCard23, imgCard5 } from '@/assets/images'

const Top10 = () => {
    const { top10_grid, top10 } = style;
    const data = [
        { id: 1, img: imgCard5 },
        { id: 2, img: imgCard21 },
        { id: 3, img: imgCard22 },
        { id: 4, img: imgCard23 },
        { id: 5, img: imgCard5 },
        { id: 6, img: imgCard21 },
        { id: 7, img: imgCard22 },
        { id: 8, img: imgCard23 },
        { id: 9, img: imgCard5 },
        { id: 10, img: imgCard21 }
    ]
    return (
        <Wrapper Orange>
            <section className={`banner-padding ${top10}`}>
                <Heading title='Top 10' />
                <div className={top10_grid}>
                    {
                        data?.map((item, index) => {
                            return (
                                <MovieThumbnail key={index} shape number={index + 1} img={item.img} title="30M+ Views" />
                            )
                        })
                    }
                </div>
            </section>
        </Wrapper>
    )
}

export default Top10