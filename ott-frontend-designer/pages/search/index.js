import React from 'react'
import style from "./style.module.scss";
import { Wrapper, Heading, MovieThumbnail, Chip, MovieCard } from "@/shared/components"
import { imgCard11, imgCard12, imgCard14, imgCard16, imgCard2, imgCard6, imgComedy, imgGenres } from '@/assets/images';
const Search = () => {
  const { search } = style;


  const movieData = [
    { id: 1, img: imgCard11 },
    { id: 2, img: imgComedy },
    { id: 3, img: imgGenres },
    { id: 4, img: imgComedy },
    { id: 5, img: imgCard11 },
    { id: 6, img: imgGenres },
    { id: 7, img: imgComedy },
    { id: 8, img: imgCard11 },
    { id: 9, img: imgComedy },
    { id: 10, img: imgCard11 }
  ]
  const genresData = [
    { id: 1, title: "30M + View", img: imgCard12 },
    { id: 2, title: "30M + View", img: imgCard2 },
    { id: 3, title: "30M + View", img: imgCard14 },
    { id: 4, title: "30M + View", img: imgCard2 },
    { id: 5, title: "30M + View", img: imgCard2 },
    { id: 6, title: "30M + View", img: imgCard16 },
    { id: 7, title: "30M + View", img: imgCard2 },
    { id: 8, title: "30M + View", img: imgCard6 }
  ]
  return (
    <Wrapper Orange>
      <section className={`banner-padding ${search}`}>
        <Heading title="Recent Searches" />
        <div className='flex-center'>
          <Chip title="the" />
          <Chip title="War" />
          <Chip title="akas" />
          <Chip title="eve" />
          <Chip clear />
        </div>
        <div className="small-padding">
          <div className="genres_grid">
            {
              movieData?.map((item, index) => {
                return (
                  <MovieCard img={item.img} key={index} title="Comedy" />
                )
              })
            }
          </div>
        </div>
        <div className="small-padding">
          <Heading title="Trending Searches" />
          <div className="movies_big_grid">
            {
              genresData?.map((item, index) => {
                return (
                  <MovieThumbnail LSize img={item.img} key={index} title={item.title} />
                )
              })
            }
          </div>
        </div>
      </section>
    </Wrapper>
  )
}
export default Search