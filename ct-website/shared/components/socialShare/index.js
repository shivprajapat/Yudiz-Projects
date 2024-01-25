import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Dropdown } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { ShareIcon } from '@shared-components/ctIcons'
const SocialShareList = dynamic(() => import('@shared-components/socialShare/shareList'))

const SocialShare = () => {
  const { t } = useTranslation()

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="link" id="dropdown-basic" className={`${styles.share} text-primary d-inline-flex align-item-center`}>
          <span>{t('common:Share')}</span> <ShareIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <SocialShareList />
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default SocialShare
