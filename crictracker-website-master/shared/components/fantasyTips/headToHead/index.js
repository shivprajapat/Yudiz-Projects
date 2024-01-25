import React from 'react'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
const MyImage = dynamic(() => import('@shared/components/myImage'))

const HeadToHead = () => {
  return (
    <div className={`${styles.headToHead} pb-1 overflow-hidden mt-3 mt-md-4 br-lg`}>
      <div className={`${styles.item} ${styles.head} d-flex justify-content-between align-items-center fw-bold`}>
        <p className="mb-0  p-1 text-uppercase theme-text">Head to Head (Last 10 matches)</p>
      </div>
      <div className={`${styles.item} d-flex justify-content-between align-items-center fw-bold`}>
        <div className="d-flex flex-1 align-items-center">
          <div className={`${styles.flag} me-1 rounded-circle overflow-hidden`}>
            <MyImage src={teamPlaceholder} alt="team" layout="responsive" />
          </div>
          <p className="mb-0 d-none d-md-block">Sunrisers Hyderabad</p>
          <p className="mb-0 d-md-none">SRH</p>
        </div>
        <h3 className={`${styles.score} br-md mb-0`}>
          4 - 6
        </h3>
        <div className="d-flex flex-1 align-items-center">
          <p className="mb-0 d-none d-md-block">Kolkata Knight Riders</p>
          <p className="mb-0 d-md-none">KKR</p>
          <div className={`${styles.flag} ms-1 rounded-circle overflow-hidden`}>
            <MyImage src={teamPlaceholder} alt="team" layout="responsive" />
          </div>
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <div className={`${styles.item} d-flex justify-content-center align-items-center font-semi`}>
            <div className="flex-1 position-relative">
              <h5 className="big-text mb-0 text-end font-semi">48</h5>
            </div>
            <div className={`${styles.compare} mx-2 mx-md-3 text-center`}>
              <p className="mb-1">Matches Won</p>
              <div className="d-flex">
                <div className="w-50 flex-shrink-0">
                  <div style={{ width: '40%' }} className={`${styles.team} ${styles.team1} overflow-hidden ms-auto`}></div>
                </div>
                <div className="w-50 flex-shrink-0">
                  <div style={{ width: '60%' }} className={`${styles.team} ${styles.team2} ${styles.winner} overflow-hidden`}></div>
                </div>
              </div>
            </div>
            <div className="flex-1 position-relative">
              <h5 className="big-text mb-0 font-semi">30</h5>
            </div>
          </div>
          <div className={`${styles.item} d-flex justify-content-center align-items-center font-semi`}>
            <div className="flex-1 position-relative">
              <h5 className="big-text mb-0 text-end font-semi">24</h5>
            </div>
            <div className={`${styles.compare} mx-2 mx-md-3 text-center`}>
              <p className="mb-1">Highest Score</p>
              <div className="d-flex">
                <div className="w-50 flex-shrink-0">
                  <div style={{ width: '75%' }} className={`${styles.team} ${styles.team1} ${styles.winner} overflow-hidden ms-auto`}></div>
                </div>
                <div className="w-50 flex-shrink-0">
                  <div style={{ width: '20%' }} className={`${styles.team} ${styles.team2} overflow-hidden`}></div>
                </div>
              </div>
            </div>
            <div className="flex-1 position-relative">
              <h5 className="big-text mb-0 font-semi">17</h5>
            </div>
          </div>
        </React.Fragment>
      ))}

    </div>
  )
}

export default HeadToHead
