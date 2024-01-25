import React, { useState } from 'react'
// React packges
import { Nav, Tab } from 'react-bootstrap'
// import Select from 'react-select'

/* Components */
// import Header from '../../../Components/Header'
// import TitleHeader from '../../../Components/TitleHeader'
import Support from './support'

// Actions
import ChangePassword from './ChangePassword'
import Header from '../../../Components/Header'

function Settings () {
  // useState
  const [key, setKey] = useState('change_pass')

  return (
    <>
          <Header/>
          {/* <TitleHeader title='Settings' /> */}
          <div>

              <div className='whitebox-layout'>
                <div className="session-history-box settings-tab-box">
                  <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="change_pass"
                  activeKey={key}
                  onSelect={(k) => {
                    setKey(k)
                  }}>
                    <div className="d-flex justify-content-between align-items-center heading-box">
                      <Nav variant="pills" >
                        <Nav.Item>
                          <Nav.Link eventKey="change_pass">Change Password</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="supports">Supports</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <Tab.Content className=''>
                    {/* <button className='theme-btn text-none' type='submit'>
                              Save New Password
                            </button> */}
                      <Tab.Pane eventKey="change_pass">
                         <ChangePassword />
                      </Tab.Pane>
                      <Tab.Pane eventKey="supports" className="support-box">
                        <Support />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
          </div>
    </>
  )
}

export default Settings
