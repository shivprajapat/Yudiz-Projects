import React, { Fragment, useState, useEffect, useRef } from 'react'
import SkeletonTable from '../../../../components/SkeletonTable'
import PropTypes from 'prop-types'

function UserTeamPlayer (props) {
  const {
    List
  } = props
  const [loading, setLoading] = useState(false)
  const previousProps = useRef({ List }).current

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Player Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={3} />
              : (
                <Fragment>
                  {
                    List && List.length !== 0 && List.aPlayers.map((data, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {data.iMatchPlayerId && data.iMatchPlayerId.sName ? data.iMatchPlayerId.sName : '-'}
                          {List.iCaptainId === data.iMatchPlayerId._id ? '(C)' : List.iViceCaptainId === data.iMatchPlayerId._id ? '(VC)' : ''}
                        </td>
                        <td>{data.nScoredPoints !== '' ? data.nScoredPoints : '-'}</td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        List && List.length === 0 &&
        (
          <div className="text-center">
            <h3>No User Team Player available</h3>
          </div>
        )
      }
    </Fragment>
  )
}

UserTeamPlayer.propTypes = {
  List: PropTypes.object
}

export default UserTeamPlayer
