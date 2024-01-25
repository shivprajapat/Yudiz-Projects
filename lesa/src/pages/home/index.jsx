import React from 'react'

import Hero from './components/Hero'
import TrendingNft from 'shared/components/trending-nft'
import ConnectWallet from 'pages/home/components/connect-wallet-section'
import SignupNow from 'pages/home/components/signup-now'

const Home = () => {
  return (
    <>
      <Hero />
      <TrendingNft />
      <ConnectWallet />
      <SignupNow />
    </>
  )
}

export default Home
