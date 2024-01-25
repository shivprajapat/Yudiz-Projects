import React, { Fragment, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'reactstrap'

// Components
import Loading from '../../../component/SkeletonMoreData'

// APIs
import useMoreList from '../../../api/more/queries/useMoreList'

// Other
import packageJson from '../../../../package.json'

function More () {
  const location = useLocation()
  const token = localStorage.getItem('Token')

  const { data, isLoading } = useMoreList()

  const moreList = useMemo(
    () => {
      const teams = {}
      if (data) {
        data && data?.length !== 0 && data?.sort((a, b) => a.nPriority - b.nPriority).forEach((league) => {
          if (!league.sCategory) {
            teams[league.sTitle] = []
            teams[league.sTitle].push(league)
          } else {
            if (!teams[league.sCategory]) {
              teams[league.sCategory] = []
            }
            teams[league.sCategory].push({ ...league })
          }
        })
      }
      return teams
    },
    [data]
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container">
        <ul className="p-links m-3">
          <li>
            <Link to={location.pathname === '/more/v1' ? '/point-system/v1' : '/point-system'}>
              <FormattedMessage id="Point_System" />
              <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
            </Link>
          </li>
          <li>
            <Link to={location.pathname === '/more/v1' ? '/offers/v1' : '/offers'}>
              <FormattedMessage id="Offers" />
              <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
            </Link>
          </li>
          {
                moreList && Object.entries(moreList)?.length !== 0 && Object.entries(moreList).map(([key, value]) => (
                  <Fragment key={value._id}>
                    {
                        value && value.length > 1
                          ? (
                            <li>
                              <button id={key} title={key} type="button">
                                {key}
                                <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                              </button>
                              <Collapse toggler={`#${key}`}>
                                <ul className="p-links">
                                  {
                                    value.map((data2) => (
                                      <li key={data2._id}>
                                        <Link to={location.pathname === '/more/v1' ? `/more/${data2.sSlug}/v1` : `/more/${data2.sSlug}`}>
                                          {data2.sTitle}
                                          <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                                        </Link>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </Collapse>
                            </li>
                            )
                          : (
                            <li>
                              <Link to={location.pathname === '/more/v1' ? `/more/${value[0].sSlug}/v1` : `/more/${value[0].sSlug}`}>
                                {key}
                                <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
                              </Link>
                            </li>
                            )
                      }
                  </Fragment>
                ))
              }
          {token && (
          <li>
            <Link to="/complaints">
              <FormattedMessage id="Complaints_and_Feedback" />
              <i className={document.dir === 'rtl' ? 'icon-left' : 'icon-right'} />
            </Link>
          </li>
          )}
        </ul>
        <p className="mt-3 moreVersion">
          <FormattedMessage id="Version" />
          {' '}
          - (
          {packageJson.version}
          )
        </p>
      </div>
    </>
  )
}

export default More
