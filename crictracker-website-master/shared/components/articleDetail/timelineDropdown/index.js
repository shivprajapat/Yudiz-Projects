import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useClickAway from '@shared/hooks/useClickAway'
import { Dropdown } from 'react-bootstrap'
import styles from './style.module.scss'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
const Timeline = dynamic(() => import('shared/components/articleDetail/timeline'))

export default function TimelineDropdown({ timelineData }) {
  const dropdownRef = useRef({})
  const { t } = useTranslation()
  const [showTimeline, setShowTimeline] = useState(false)

  function handleToggle(value) {
    setShowTimeline(value ?? !showTimeline)
  }
  useClickAway(dropdownRef, () => handleToggle(false))
  return (
    <Dropdown drop='up' ref={dropdownRef} show={showTimeline} className={`${styles.timelineHeader} justify-content-end`} >
      <Dropdown.Toggle id="timeline" className='theme-btn btn  pe-2 btn-primary' onClick={() => handleToggle()} >
        {t('Timeline')}
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.timelineHeaderMenu} >
        <div className={'common-box mb-0 p-1'}>
          <Timeline timelineData={timelineData} handleClose={handleToggle} />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}
TimelineDropdown.propTypes = {
  timelineData: PropTypes.array
}
