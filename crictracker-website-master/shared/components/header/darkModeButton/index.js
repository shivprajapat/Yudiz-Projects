import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import darkMode from '@assets/images/dark-mode.svg'
import lightMode from '@assets/images/light-mode.svg'

import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import MyImage from '@shared/components/myImage'
import { setCookie } from '@shared/utils'

const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function DarkModeButton({ isLightBg }) {
  const { t } = useTranslation()
  const [isDark, setDark] = useState(window?.isDark || false)

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-mode', 'dark')
      localStorage.setItem('ct-theme', 'dark')
      setCookie({ cName: 'ctTheme', cValue: 'dark', exDays: 90 })
      window.isDark = true
    } else {
      document.body.setAttribute('data-mode', 'light')
      localStorage.setItem('ct-theme', 'light')
      setCookie({ cName: 'ctTheme', cValue: 'light', exDays: 90 })
      window.isDark = false
    }
  }, [isDark])

  useEffect(() => {
    window?.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
      setDark(matches)
    })
  }, [])

  function handleDark() {
    setDark(!isDark)
  }

  return (
    <CustomFormGroup className={`${formStyles.formSwitch} ${styles.modeSwitch} ${isLightBg && styles.darkSwitch} d-flex align-items-center`} controlId="darkMode">
      {/* <Form.Switch.Label>{t('common:DarkMode')}</Form.Switch.Label> */}
      <Form.Switch type="switch" onChange={handleDark} id='modeSwitch' checked={isDark} className='d-none' />
      <CtToolTip tooltip={isDark ? t('common:LightMode') : t('common:DarkMode')}>
        <label htmlFor='modeSwitch' className={`${isDark ? styles.darkModeIcon : styles.lightModeIcon} me-2`}>
          {isDark ? (
            <MyImage className={styles.lightModeImg} src={lightMode} width={22} height={22} alt='dark mode' />
          ) : (
            <MyImage className={styles.darkModeImg} width={22} height={22} src={darkMode} alt='light mode' />
          )}
        </label>
      </CtToolTip>
    </CustomFormGroup>
  )
}
DarkModeButton.propTypes = {
  isLightBg: PropTypes.bool
}
export default DarkModeButton
