import { magicLinkIcon, metamaskIcon, walletConnect } from 'assets/images'
import { MAGIC_LINK } from 'modules/magicLink'
import { METAMASK } from 'modules/metaMask'
import { getUser } from 'modules/user/redux/service'
import { getMyWallets } from 'modules/wallet/redux/service'
import { WALLET_CONNECT } from 'modules/walletConnect'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import './index.scss'
import { Link } from 'react-router-dom'
import { allRoutes } from 'shared/constants/allRoutes'

const ProfileMyWallets = () => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')
  const [myWallets, setMyWallets] = useState({})
  const [connectWallet, setConnectWallet] = useState({
    active: false,
    wallet: null
  })

  const currentUser = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(getUser(userId))
    getMyWalletsData()
  }, [])

  const getMyWalletsData = async () => {
    const response = await getMyWallets({ userId })
    if (response) {
      setMyWallets(groupWallets(response?.data?.result?.wallet?.items || []))
    }
  }

  const groupWallets = (wallets = []) => {
    const formatted = wallets.reduce((r, a) => {
      r[a.walletName] = r[a.walletName] || []
      r[a.walletName].push(a)
      return r
    }, {})

    return formatted || {}
  }

  const getWalletIcon = (wallet = '') => {
    switch (wallet) {
      case METAMASK:
        return <img src={metamaskIcon} alt="metamask-img" className="img-fluid" />
      case WALLET_CONNECT:
        return <img src={walletConnect} alt="wallet-connect-img" className="img-fluid traced-img connect-wallet-connect-icon" />
      case MAGIC_LINK:
        return <img src={magicLinkIcon} alt="magic-link-img" className="img-fluid traced-img connect-magic-link-icon" />

      default:
        return ''
    }
  }

  const handleWalletClick = (wallet) => {
    setConnectWallet({
      active: true,
      wallet
    })
  }

  return <div className='wallet-page-cover'>
    {
      connectWallet?.active && <SelectWalletModal
        networkGeneric={true}
        show={connectWallet?.active}
        selectedWallet={connectWallet.wallet}
        onCloseSelectWallet={() => setConnectWallet({
          active: false,
          wallet: null
        })}
      />
    }
    <h3>My Wallets</h3>
    <div className='coin-data'>
      <div className="coin">
        <label>Nuucoin Balance</label>
        <span>{currentUser?.coinCount}</span>
      </div>
      <div className="profile-banner-btn">
        <Button className="white-btn" as={Link} to={allRoutes.nuuCoins}>
          Purchase Nuucoin
        </Button>
      </div>
    </div>
    <div className="wallet-list">
      {
        Object.keys(myWallets).length ? Object.keys(myWallets).map(wallet => {
          return (
            <div key={myWallets[wallet].id} className='wallet rounded'>
              <div className="wallet-data w-100">
                {getWalletIcon(wallet)}
                <div className="title">
                  <span>{wallet}</span>
                </div>
                <div className="data">
                  {
                    myWallets[wallet]?.map(data => {
                      return <>
                        <div className="field" key={data.id}>
                          <span>{data.walletAddress}</span>
                        </div><div className="field" key={data.id}>
                          <span>{data.walletAddress}</span>
                        </div>
                      </>
                    })
                  }
                </div>
              </div>
              <div className="footer">
                <Button className="white-btn" type="submit" onClick={() => handleWalletClick(wallet)}>
                  Connect
                </Button>
              </div>
            </div>
          )
        }) : <div className='w-100 p-5 d-flex justify-content-center align-items-center'> No wallets available</div>
      }
    </div>
  </div>
}

export default ProfileMyWallets
