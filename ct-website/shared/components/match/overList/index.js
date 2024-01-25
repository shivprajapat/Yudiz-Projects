import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'

const OverList = ({ data, id }) => {
  const { t } = useTranslation()
  return (
    <section className={`${styles.overList}`} id={id}>
      <div className={`${styles.item} common-box d-flex align-items-center mb-3`}>
        <div className={`${styles.over} text-center`}>
          <p className={`${styles.overNo} mb-2 font-semi`}>{data?.sOver} {t('common:Over')}</p>
          <div className={`${styles.overRun} font-bold`}>{data?.nOverTotal} {t('common:Runs')}</div>
        </div>
        <div className={`${styles.details}`}>
          <p>
            <span className="font-semi mb-2">{data?.oOver?.aBowlers[0]?.oBowler?.sFullName}</span> {data?.oOver?.aBatters[0]?.oBatter?.sFullName && t('common:To')} <span className="font-semi">{data?.oOver?.aBatters[0]?.oBatter?.sFullName}</span>
            <span className="font-semi">{data?.oOver?.aBatters[1]?.oBatter?.sFullName && ' & ' + data?.oOver?.aBatters[1]?.oBatter?.sFullName}</span>
          </p>
          <div className={`${styles.balls} d-flex scroll-list text-center font-semi`}>
            {data?.aBall?.map((ball, index) => {
              return (
                <div className={`${styles.ball}`} key={index}>
                  {ball?.sScore === 'w' && <div className={`${styles.run} rounded-pill bg-danger border-danger text-white`}>{ball?.sScore?.toUpperCase()}</div>}
                  {ball?.sScore === '4' && <div className={`${styles.run} rounded-pill bg-success border-success text-white`}>{ball?.sScore}</div>}
                  {ball?.sScore === '6' && <div className={`${styles.run} rounded-pill bg-primary border-primary text-white`}>{ball?.sScore}</div>}
                  {ball?.sScore === '0' && <div className={`${styles.run} rounded-pill`}>{ball?.sScore}</div>}
                  {(ball?.sScore === '4b' || ball?.sScore === '4lb') && <div className={`${styles.run} rounded-pill bg-info border-info`}>{ball?.sScore}</div>}
                  {(ball?.sScore !== 'w' && ((ball?.nRuns > 0 && ball?.nRuns < 4) || ball?.nRuns === 5 || ball?.nRuns > 6)) && <div className={`${styles.run} rounded-pill bg-info border-info`}>{ball?.sScore}</div>}
                  <span>{ball?.sOver}.{ball?.sBall}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

OverList.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string
}

export default OverList
