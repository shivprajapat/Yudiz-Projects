import React, { Fragment } from 'react'
import Navbar from '../../../components/Navbar'
import LeaderBoardData from './LeaderBoardData'

function LeaderBoardComponent (props) {
  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeaderBoardData {...props}/>
        </section>
      </main>
    </Fragment>
  )
}

export default LeaderBoardComponent
