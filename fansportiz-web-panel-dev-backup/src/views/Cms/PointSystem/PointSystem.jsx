import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { Nav, NavItem, NavLink, TabContent, Table, TabPane } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { useNavigate, useParams } from 'react-router-dom'

// Components
import SkeletonMore from '../../../component/SkeletonMore'

// Utils
import { getSportImgFunc } from '../../../utils/helper'

// APIs
import useScorePoints from '../../../api/more/queries/useScorePoints'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'

function PointSystem () {
  const { ActiveSport, InnerTab } = useParams()
  const navigate = useNavigate()

  const [format, setFormat] = useState('')

  const [activeSport, setActiveSport] = useQueryState('ActiveSport', '')
  const [innerTab, setInnerTab] = useQueryState('InnerTab', '')

  const { data: scorePointData, isLoading: isScorePointLoading } = useScorePoints(format)
  const { data: activeSports, isLoading: isActiveSportsLoading, activeSport: queryActiveSport } = useActiveSports()

  const data = useMemo(
    () => {
      const cms = {}
      if (scorePointData && activeSport) {
        activeSport === 'cricket' && scorePointData.forEach((sp) => {
          if (!cms[sp.bMulti]) {
            cms[sp.bMulti] = []
          }
          cms[sp.bMulti].push(sp)
        })
        return activeSport === 'cricket' ? cms : scorePointData
      }
    },
    [scorePointData, activeSport]
  )

  useEffect(() => {
    if (InnerTab) {
      setInnerTab(InnerTab)
    }
    if (ActiveSport) {
      setActiveSport(ActiveSport.toLowerCase())
    }
  }, [])

  useEffect(() => {
    if (queryActiveSport) {
      setActiveSport(queryActiveSport)
    }
  }, [queryActiveSport])

  useEffect(() => {
    if (activeSport) {
      if (activeSport !== 'cricket') {
        setInnerTab('')
        setFormat(activeSport)
      } else if (activeSport === 'cricket') {
        setInnerTab('ODI')
        setFormat('ODI')
      }
    }
  }, [activeSport])

  function onSetInnerTab (data) {
    setInnerTab(data)
    setFormat(data)
  }

  return (
    <>
      <Nav className="d-flex justify-content-around flex-nowrap align-items-center match-links sports m-0">
        {
          activeSports && activeSports.length
            ? activeSports.sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1))
              .map((data, index) => (
                <NavItem key={data.sKey}>
                  <NavLink
                    className={classnames({ active: activeSport === data.sKey.toLowerCase() })}
                    onClick={() => {
                      setActiveSport(data.sKey.toLowerCase())
                    }}
                  >
                    <img
                      alt={data.sName}
                      src={getSportImgFunc(data.sKey)}
                    />
                    <div className="sportsText">
                      {data.sName.charAt(0).toUpperCase()}
                      {data.sName.slice(1).toLowerCase()}
                    </div>
                  </NavLink>
                </NavItem>
              ))
            : ''
        }
      </Nav>
      <div className="point-system-container-second bg-white">
        <TabContent activeTab={activeSport}>
          <TabPane tabId={activeSport}>
            {
              activeSport === 'cricket'
                ? (
                  <>
                    <Nav className="d-flex flex-nowrap align-items-center live-tabs">
                      <NavItem><NavLink className={classnames({ active: innerTab === 'ODI' })} onClick={() => onSetInnerTab('ODI')}><FormattedMessage id="ODI" /></NavLink></NavItem>
                      <NavItem><NavLink className={classnames({ active: innerTab === 'T10' })} onClick={() => onSetInnerTab('T10')}><FormattedMessage id="T_10" /></NavLink></NavItem>
                      <NavItem><NavLink className={classnames({ active: innerTab === 'T20' })} onClick={() => onSetInnerTab('T20')}><FormattedMessage id="T_20" /></NavLink></NavItem>
                      <NavItem><NavLink className={classnames({ active: innerTab === 'TEST' })} onClick={() => onSetInnerTab('TEST')}><FormattedMessage id="Test" /></NavLink></NavItem>
                      <NavItem><NavLink className={classnames({ active: innerTab === '100BALL' })} onClick={() => onSetInnerTab('100BALL')}><FormattedMessage id="Hundred_Balls" /></NavLink></NavItem>
                    </Nav>
                    <TabContent activeTab={innerTab}>
                      <TabPane tabId={innerTab}>
                        <div className="point-table">
                          <Table className="m-0">
                            <thead>
                              <tr>
                                <th aria-label="Table Header"><FormattedMessage id="Attribute_Name" /></th>
                                <th aria-label="Table Header"><FormattedMessage id="Points" /></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                              (isScorePointLoading || isActiveSportsLoading)
                                ? <SkeletonMore table />
                                : data && data.false &&
                                data.false.map((data) => (
                                  <tr key={data._id}>
                                    <td>{data.sName}</td>
                                    <td>{data.nPoint}</td>
                                  </tr>
                                ))
                            }
                            </tbody>
                          </Table>
                        </div>
                        <div className="point-table">
                          {(isScorePointLoading || isActiveSportsLoading)
                            ? <SkeletonMore table />
                            : data && data.true &&
                            data.true.map((data) => (
                              <Fragment key={data._id}>
                                <h4 className="point-title">{data.sName}</h4>
                                <Table className="m-0">
                                  <thead>
                                    <tr>
                                      <th aria-label="Table Header"><FormattedMessage id="From_To" /></th>
                                      <th aria-label="Table Header">
                                        <FormattedMessage id="Minimum" />
                                        {data.sName === 'Strike Rate' && <FormattedMessage id="Ball_Faced" />}
                                        {data.sName === 'Economy Bonus' && <FormattedMessage id="Overs_Bowled" />}
                                      </th>
                                      <th aria-label="Table Header"><FormattedMessage id="Points" /></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      data && data.aPoint && data.aPoint.map((sp) => (
                                        <tr key={sp._id}>
                                          <td>{`${sp.nRangeFrom} - ${sp.nRangeTo}`}</td>
                                          <td>
                                            {sp.nMinValue}
                                            {' '}
                                          </td>
                                          <td>{sp.nBonus}</td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </Table>
                              </Fragment>
                            ))}
                        </div>
                      </TabPane>
                    </TabContent>
                  </>
                  )
                : (
                  <div className="point-table">
                    <Table className="m-0">
                      <thead>
                        <tr>
                          <th aria-label="Table Header"><FormattedMessage id="Attribute_Name" /></th>
                          <th aria-label="Table Header"><FormattedMessage id="Points" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(isScorePointLoading || isActiveSportsLoading)
                          ? <SkeletonMore table />
                          : (
                            <>
                              {data?.length > 0
                                ? data.map((data) => (
                                  <tr key={data._id}>
                                    <td>{data.sName}</td>
                                    <td>{data.nPoint}</td>
                                  </tr>
                                ))
                                : (
                                  <tr>
                                    <td>
                                      <p className="text-center centerFullWidth"><FormattedMessage id="No_score_points_are_available" /></p>
                                    </td>
                                  </tr>
                                  )}
                            </>
                            )
                        }
                      </tbody>
                    </Table>
                  </div>
                  )
            }
          </TabPane>
        </TabContent>
        <button
          className="playNow-btn"
          onClick={() => {
            navigate(`/home/${activeSport}`)
          }}
          type="button"
        >
          <FormattedMessage id="Play_Now" />
        </button>
      </div>
    </>
  )
}

export default PointSystem
