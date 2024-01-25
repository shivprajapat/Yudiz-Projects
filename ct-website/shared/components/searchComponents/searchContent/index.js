import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import Layout from '@shared-components/layout'
import { SearchIcon, CloseIcon } from '@shared-components/ctIcons'
import { searchNav } from '@shared/constants/allNavBars'
import { allRoutes } from '@shared/constants/allRoutes'
import { navLoader } from '@shared/libs/allLoader'
import { WIDGET } from '@shared/constants'

const CommonNav = dynamic(() => import('@shared/components/commonNav'), { loading: () => navLoader() })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })

function SearchContent({ children }) {
  const router = useRouter()
  const search = useRef(null)
  const [value, setValue] = useState(router?.query?.q || '')

  function handleSearch(e) {
    if (value) {
      e.preventDefault()
      search.current.value = value.trim()
      router.push({
        pathname: allRoutes.search,
        query: { q: value.trim() }
      })
    }
  }

  function handleClear() {
    setValue('')
    search.current.value = ''
  }

  useEffect(() => {
    search.current.value = router?.query?.q?.trim() || ''
  }, [router])

  return (
    <Layout title="CricTracker">
      <section className="common-section">
        <Container>
          <Row>
            <Col lg={9} className="left-content">
              <Form>
                <Form.Group className={`${formStyles.formGroup} ${styles.searchGroup} position-relative`} controlId="search">
                  <Form.Control
                    ref={search}
                    defaultValue={router?.query?.q}
                    onChange={({ target }) => setValue(target.value)}
                    required
                    className={`${formStyles.formControl} ${styles.searchControl}`}
                    type="text"
                  />
                  <div className={`${styles.icon} ${styles.searchIcon}`}>
                    <SearchIcon />
                  </div>
                  {value && (
                    <Button onClick={handleClear} variant="link" className={`${styles.icon} ${styles.closeBtn}`}>
                      <CloseIcon />
                    </Button>
                  )}
                  <Button onClick={handleSearch} type="submit" className={`${styles.icon} ${styles.searchBtn} theme-btn small-btn`}>
                    <Trans i18nKey="common:Search" />
                  </Button>
                </Form.Group>
              </Form>
              <CommonNav items={searchNav(router.query.type)} queryParams />
              {children}
            </Col>
            <Col lg={3} className="common-sidebar">
              <AllWidget type={WIDGET.currentSeries} show />
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}
SearchContent.propTypes = {
  children: PropTypes.node.isRequired
}
export default SearchContent
