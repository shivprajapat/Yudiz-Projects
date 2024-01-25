import React from 'react'
import style from "./style.module.scss";
import { Heading, ArtistCard, Wrapper } from '@/shared/components'
import {  imgCard11, imgCard24, imgCard25, imgCard26, imgCard29  } from '@/assets/images';

const Artist = () => {
    const { artist, artist_grid } = style;
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
        <Wrapper Orange>
            <section className={`banner-padding ${artist}`}>
                <Heading title='Artist' />
                <div className={artist_grid}>
                    {
                        data?.map((item, index) => {
                            return (
                                <ArtistCard key={index} img={item.img} title="Udit Narayan" />
                            )
                        })
                    }
                </div>
            </section>
        </Wrapper>
    )
}

export default Artist