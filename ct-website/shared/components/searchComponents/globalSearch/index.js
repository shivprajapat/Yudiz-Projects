import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import styles from './style.module.scss'

import { Button, Form } from 'react-bootstrap'
import { SearchIcon } from '@shared-components/ctIcons'
import { allRoutes } from '@shared/constants/allRoutes'

function GlobalSearch({ outerStyles }) {
  const { t } = useTranslation()
  const search = useRef(null)
  const [isSearchbar, setIsSearchbar] = useState(false)
  const router = useRouter()
  function handleSearch(e) {
    if (search.current.value) {
      e.preventDefault()
      router.push({
        pathname: allRoutes.search,
        query: { q: search.current.value.trim() }
      })
      setIsSearchbar(false)
      search.current.value = ''
    }
  }

  useEffect(() => {
    isSearchbar && search.current.focus()
  }, [isSearchbar])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.querySelector('body')
      if (isSearchbar) {
        document.body.classList.add('overflow-hidden')
        return () => {
          body.classList.remove('overflow-hidden')
        }
      }
    }
  }, [isSearchbar])

  return (
    <div className={`${isSearchbar && styles.active} ${outerStyles.navLink} ${outerStyles.iconItem} ${styles.searchItem}`}>
      <Button variant="link" onClick={() => setIsSearchbar(!isSearchbar)}>
        <SearchIcon />
      </Button>
      <div className={styles.overlay} onClick={() => setIsSearchbar(!isSearchbar)}></div>
      <div className={`${isSearchbar && styles.active} ${styles.searchBox} align-items-center`}>
        <Form>
          <Form.Group className={`${styles.searchGroup} position-relative`} controlId="search">
            <Form.Control required ref={search} className={styles.searchControl} type="text" placeholder={t('common:SearchPlaceholder')} />
            <div className={`${styles.icon} ${styles.searchIcon}`}>
              <SearchIcon />
            </div>
            <Button type="submit" className={`${styles.icon} ${styles.searchBtn} theme-btn small-btn`} onClick={handleSearch}>
              <Trans i18nKey="common:Search" />
            </Button>
          </Form.Group>
        </Form>
        <Button
          variant="link"
          onClick={() => setIsSearchbar(!isSearchbar)}
          className={styles.closeBtn}
        ></Button>
      </div>
    </div>
  )
}
GlobalSearch.propTypes = {
  outerStyles: PropTypes.object
}
export default GlobalSearch
