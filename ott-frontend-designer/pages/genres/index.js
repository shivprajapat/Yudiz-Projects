import React from 'react'
import style from "./style.module.scss";
import { Heading, MovieCard, Wrapper } from '@/shared/components'
import { imgCard27, imgCard28, imgComedy } from '@/assets/images';

const Genres = () => {
  const { genres } = style;
  const data = [
    { title: "Comedy", img: imgComedy },
    { title: "Epic", img: imgCard27 },
    { title: "Devotional", img: imgCard28 },
    { title: "Comedy", img: imgComedy },
    { title: "Epic", img: imgCard27 },
    { title: "Devotional", img: imgCard28 },
    { title: "Comedy", img: imgComedy },
    { title: "Epic", img: imgCard27 },
    { title: "Devotional", img: imgCard28 },
    { title: "Comedy", img: imgComedy }

  ]
  return (
    <Wrapper Orange>
      <section className={`banner-padding ${genres}`}>
        <Heading title='Genres' />
        <div className='genres_grid'>
          {
            data?.map((item, index) => {
              return (
                <MovieCard key={index} img={item.img} title={item.title} />
              )
            })
          }
        </div>
      </section>
    </Wrapper>
  )
}

export default Genres