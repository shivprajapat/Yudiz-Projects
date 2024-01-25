import React from 'react'
import style from "./style.module.scss";
import InputSelect from '@/shared/components/InputSelect'
import { Heading, MovieThumbnail, Wrapper } from '@/shared/components'
import { imgCard31, imgCard30, imgCard32, imgCard33, imgCard34 } from '@/assets/images';

const SeasonListing = () => {
  const {season_listing} = style;
  const data = [
    { id: 1, title: "S3 E1 • 15 Dec", img: imgCard30 },
    { id: 2, title: "S3 E1 • 16 Dec", img: imgCard31 },
    { id: 3, title: "S3 E1 • 17 Dec", img: imgCard32 },
    { id: 4, title: "S3 E1 • 18 Dec", img: imgCard33 },
    { id: 5, title: "S3 E1 • 19 Dec", img: imgCard34 },
    { id: 6, title: "S3 E1 • 20 Dec", img: imgCard33 },
    { id: 7, title: "S3 E1 • 21 Dec", img: imgCard30 },
    { id: 8, title: "S3 E1 • 22 Dec", img: imgCard34 },
  ]
  return (
    <Wrapper Orange>
      <section className={`banner-padding ${season_listing}`}>
        <Heading title="Ashram • Season 3" backBtn/>
        <InputSelect
          items={[
            { value: "Season 3", id: 1 },
            { value: "Season 2", id: 2 },
            { value: "Season 1", id: 3 }
          ]}
        />
        <div className="movies_big_grid">
          {
          data?.map((item, index) => <MovieThumbnail key={index} LSize img={item.img} SeasonTitle={item.title} />)
        }
        </div>
      </section>
    </Wrapper>
  )
}

export default SeasonListing