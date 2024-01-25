import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'

const EndOver = ({ data, id, inning }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className={`${styles.over} bg-info common-box d-flex flex-wrap flex-xl-nowrap align-items-xl-center rounded-0`} id={id}>
        <div className={`${styles.info} d-none d-md-flex flex-xl-column align-items-center text-xl-center`}>
          <p className="mb-0 mb-xl-1">{t('common:EndOfOver')}</p>
          <p className="mb-0 ms-1 big-text fw-bold">{data?.sOver}</p>
        </div>
        <div className={`${styles.info} text-xl-center flex-grow-1`}>
          <p className="mb-1">{t('common:RunScored')}: {data?.nRuns}</p>
          <p className="mb-0 big-text fw-bold">{data?.aOverScores?.map((ball, index) => <span key={index}>{index ? ' ' : ''}{ball}</span>)}</p>
        </div>
        <div className={`${styles.info} text-end text-xl-center flex-grow-1`}>
          <p className="mb-1">{t('common:ScoreAfter')} {data?.sOver} {t('common:Overs')}</p>
          <p className="mb-0 big-text fw-bold">{inning.map((i) => i?.nInningNumber === data?.nInningNumber && i?.sShortName)} - {data?.sScore}</p>
        </div>
        {data?.aBatters.length !== 0 && <div className={`${styles.info} ${styles.partners}`}>
          {data?.aBatters?.map((bat, index) => {
            return (
              <p className="mb-1 d-flex justify-content-xl-between" key={index}>
                {bat?.oBatter?.sFullName || bat?.oBatter?.sShortName} <b className="ms-1">{bat?.nRuns}({bat?.nBallFaced})</b>
              </p>
            )
          })}
        </div>}
        {data?.aBowlers.length !== 0 && <div className={`${styles.info} ${styles.baller} flex-grow-1 text-end text-xl-start`}>
          <p className="mb-1">{data?.aBowlers[0]?.oBowler?.sFullName || data?.aBowlers[0]?.oBowler?.sShortName}</p>
          <p className="mb-0">{data?.aBowlers[0]?.sOvers}-{data?.aBowlers[0]?.nMaidens}-{data?.aBowlers[0]?.nRunsConceded}-{data?.aBowlers[0]?.nWickets}</p>
        </div>}
      </div>
    </>
  )
}

EndOver.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string,
  inning: PropTypes.array,
  index: PropTypes.number
}

export default EndOver
