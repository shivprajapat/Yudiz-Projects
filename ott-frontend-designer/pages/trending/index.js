import React from 'react'
import style from "./style.module.scss";
import { Heading, MovieThumbnail, Wrapper } from '@/shared/components'
import { imgCard12, imgCard14, imgCard16, imgCard18, imgCard2, imgCard6 } from '@/assets/images'

const Trending = () => {
  const { trending } = style;
  const data = [
    { id: 1, img: imgCard12 },
    { id: 2, img: imgCard6 },
    { id: 3, img: imgCard14 },
    { id: 4, img: imgCard2 },
    { id: 5, img: imgCard12 },
    { id: 6, img: imgCard2 },
    { id: 7, img: imgCard12 },
    { id: 8, img: imgCard2 },
    { id: 9, img: imgCard16 },
    { id: 10, img: imgCard2 },
    { id: 11, img: imgCard6 },
    { id: 11, img: imgCard12 },
  ]
  return (
    <Wrapper Orange>
      <section className={`banner-padding ${trending}`}>
        <Heading title='Trending' />
        <div className="movies_big_grid">
          {
            data?.map((item, index) => {
              return (
                <MovieThumbnail key={index} img={item.img} index={index} title="30M+ Views" />
              )
            })
          }
        </div>
      </section>
    </Wrapper>
  )
}

export default Trending