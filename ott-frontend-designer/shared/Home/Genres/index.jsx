import React from 'react'
import styles from "./style.module.scss";
import { imgComedy, imgCard27, imgCard28 } from '@/assets/images';
import { useSlider } from '@/hooks/useSlider';
import { MovieCard, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';

const Genres = () => {
   const { genres } = styles;
   const { handleClick, isMoved, listRef } = useSlider();

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
      { title: "Comedy", img: imgComedy },
      { title: "Epic", img: imgCard27 },
      { title: "Devotional", img: imgCard28 },
      { title: "Comedy", img: imgComedy },
      { title: "Epic", img: imgCard27 },
      { title: "Devotional", img: imgCard28 },
   ]
   return (
      <section className={genres}>
         <PageTitle title="Genres" path="genres" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />

            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => {
                     return (
                        <div key={index}>
                           <MovieCard img={item.img} title={item.title} />
                        </div>
                     )
                  })
               }
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Genres