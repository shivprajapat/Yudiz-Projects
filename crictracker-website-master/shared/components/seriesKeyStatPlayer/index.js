import React from 'react'
import dynamic from 'next/dynamic'
import styles from './style.module.scss'
import PropTypes from 'prop-types'

import OrangeCap from '@assets/images/placeholder/ipl-caps/orange.png'
import PurpleCap from '@assets/images/placeholder/ipl-caps/purple.png'
import playerPlaceholder from '@assets/images/placeholder/player-placeholder.jpg'
import Skeleton from '../skeleton'
import { useRouter } from 'next/router'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function SeriesKeyStatsPlayer({ data, section, index }) {
  const router = useRouter()
  const isOrangeCap = index === 0
  const statsData = getValue()

  function getValue() {
    if (section === 'CapHolders') {
      if (isOrangeCap) {
        return { value: data?.nRuns, label: 'Runs', link: '/ipl-orange-cap/' }
      } else {
        return { value: data?.nWickets, label: 'Wickets', link: '/ipl-purple-cap/' }
      }
    } else if (section === 'MostFifties') {
      return { value: data?.nRun50, label: 'Fifties', link: '/t20/ipl-indian-premier-league/stats/batting-most-run50/' }
    } else if (section === 'MostSixes') {
      return { value: data?.nRun6, label: 'Sixes', link: '/t20/ipl-indian-premier-league/stats/batting-most-sixes/' }
    }
  }

  function redirectTo(url) {
    router.push(statsData.link)
  }

  return (
    <>
      {data ? <div onClick={redirectTo} className={`${styles.statPlayer} py-2 d-flex align-items-center justify-content-between`}>
        <div className="d-flex align-items-center">
          <div className={`${styles.playerImage} d-flex`}>
            {section === 'CapHolders' && (
              <div className={`${styles.icon} rounded-circle overflow-hidden me-2 flex-shrink-0`}>
                <MyImage
                  src={isOrangeCap ? OrangeCap : PurpleCap}
                  // blurDataURL={isOrangeCap ? OrangeCap : PurpleCap}
                  alt={data?.oPlayer?.sFullName}
                  placeholder="blur"
                  layout="responsive"
                  width="20"
                  height="20"
                />
              </div>
            )}
            <div className={`${styles.icon} rounded-circle overflow-hidden me-2 flex-shrink-0`}>
              <MyImage
                src={playerPlaceholder}
                // blurDataURL={playerPlaceholder}
                alt={data?.oPlayer?.sFullName}
                placeholder="blur"
                layout="responsive"
                width="20"
                height="20"
              />
            </div>
          </div>
          <div>
            <h5 className="small-head font-semi mb-0">
              {data?.oPlayer?.sFullName || data?.oPlayer?.sTitle || data?.oPlayer?.sFirstName}
            </h5>
            <p className="light-text small-text secondary-text text-uppercase mb-0 mt-1">
              {data?.oTeam?.sAbbr}
            </p>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end justify-content-center">
          <h4 className="theme-text font-semi">{statsData.value}</h4>
          <p className="light-text m-0">{statsData.label}</p>
        </div>
      </div> : <div className={`${styles.statPlayer} d-flex justify-content-between`}>
        <div className="d-flex align-item-center justify-content-start mt-1 mb-1">
          {section === 'CapHolders' && <Skeleton width={'44px'} height={'44px'} className="me-2" radius={'50%'} />}
          <Skeleton width={'44px'} height={'44px'} className="me-2" radius={'50%'} />
          <div className="d-flex flex-column align-item-center justify-content-center">
            <Skeleton width={'60px'} height={'13px'} className="mb-1" />
            <Skeleton width={'36px'} height={'13px'} />
          </div>
        </div>
        <div className="d-flex flex-column align-items-end justify-content-center">
          <Skeleton width={'36px'} height={'13px'} className="mb-1" />
          <Skeleton width={'60px'} height={'13px'} />
        </div>
      </div>
      }
    </>
  )
}

SeriesKeyStatsPlayer.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}
export default SeriesKeyStatsPlayer
