import React, { Fragment } from 'react'
import { Ads, BannerSlider } from '../components'
import Watching from './Watching'
import Movies from './Movies'
import Animated from './Animated'
import Artist from './Artist'
import CriticallyAcclaimed from './CriticallyAcclaimed'
import EverGreen from './EverGreen'
import Genres from './Genres'
import International from './International'
import MusicVideos from './MusicVideos'
import OldIsGold from './OldIsGold'
import SouthGujarati from './South-Gujarati'
import Upcoming from './Upcoming'
import Trending from './Trending'
import Originals from './Originals'
import Recommended from './Recommended'
import Shows from './Shows'
import Top10 from './Top10'

const HomePage = () => {
  return (
    <Fragment>
      <BannerSlider />
      <div className='common-margin'>
        <Watching />
        <Trending />
        <Ads />
        <Originals />
        <Recommended />
        <Top10 />
        <Movies title="Movies"/>
        <Shows />
        <Originals />
        <International />
        <Upcoming />
        <Genres />
        <MusicVideos />
        <Artist />
        <OldIsGold />
        <SouthGujarati />
        <Animated />
        <CriticallyAcclaimed />
        <EverGreen />
      </div>
    </Fragment>
  )
}

export default HomePage