import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import FlagIndia from '@assets/images/placeholder/team-placeholder.jpg'
import DrawIcon from '@assets/images/icon/draw-icon.png'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const MatchProbability = () => {
  const [vote, setVote] = useState(true)
  const handleVote = () => {
    setVote(!vote)
  }

  return (
    <>
      {vote && (
        <section className={`${styles.matchProbability}`}>
          <div className={`${styles.title} d-flex justify-content-between align-items-center`}>
            <h4 className="text-uppercase mb-0">
              <Trans i18nKey="common:WinProbability" />
            </h4>
            <Button variant="link" className="text-primary" onClick={handleVote}>
              <Trans i18nKey="common:YourVote" />
            </Button>
          </div>
          <div className={`${styles.votes} common-box text-uppercase`}>
            <div className={`${styles.item} d-flex align-items-center`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.flag}`}>
                  <MyImage src={FlagIndia} alt="England" layout="responsive" />
                </div>
                <span className="font-semi">Ind</span>
              </div>
              <div className="flex-grow-1">
                <div className={`${styles.probability} ${styles.active}`} style={{ width: '70%' }}></div>
              </div>
              <div className={`${styles.value} big-text text-end`}>70%</div>
            </div>
            <div className={`${styles.item} d-flex align-items-center`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.flag}`}>
                  <MyImage src={DrawIcon} alt="Draw" layout="responsive" />
                </div>
                <span className="font-semi">Draw</span>
              </div>
              <div className="flex-grow-1">
                <div className={`${styles.probability}`} style={{ width: '20%' }}></div>
              </div>
              <div className={`${styles.value} big-text text-end`}>20%</div>
            </div>
            <div className={`${styles.item} d-flex align-items-center`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.flag}`}>
                  <MyImage src={FlagIndia} alt="England" layout="responsive" />
                </div>
                <span className="font-semi">Eng</span>
              </div>
              <div className="flex-grow-1">
                <div className={`${styles.probability}`} style={{ width: '10%' }}></div>
              </div>
              <div className={`${styles.value} big-text text-end`}>10%</div>
            </div>
          </div>
        </section>
      )}
      {!vote && (
        <section className={`${styles.matchProbability}`}>
          <div className={`${styles.title} d-flex justify-content-between align-items-center`}>
            <h4 className="text-uppercase mb-0">What will be result?</h4>
            <Button variant="link" className="text-primary" onClick={handleVote}>
              Cancel
            </Button>
          </div>
          <div className={`${styles.votesOption} common-box text-uppercase`}>
            <Button onClick={handleVote} variant="link" className="d-flex align-items-center justify-content-center">
              <div className={`${styles.flag}`}>
                <MyImage src={FlagIndia} alt="India" layout="responsive" />
              </div>
              <span>Ban to Win</span>
            </Button>
            <Button onClick={handleVote} variant="link" className="d-flex align-items-center justify-content-center">
              <div className={`${styles.flag}`}>
                <MyImage src={DrawIcon} alt="Draw" layout="responsive" />
              </div>
              <span>Draw</span>
            </Button>
            <Button onClick={handleVote} variant="link" className="d-flex align-items-center justify-content-center">
              <div className={`${styles.flag}`}>
                <MyImage src={FlagIndia} alt="England" layout="responsive" />
              </div>
              <span>WI to Win</span>
            </Button>
          </div>
        </section>
      )}
    </>
  )
}

export default MatchProbability
