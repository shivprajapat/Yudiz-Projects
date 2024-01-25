import React, { useState } from 'react'
// React packges
import { Form, Nav, Tab } from 'react-bootstrap'
import Select from 'react-select'
/* Components */
import Sidebar from '../../../Components/Sidebar'
import Header from '../../../Components/Header'
import MobileHeader from '../../../Components/MobileHeader'
import TitleHeader from '../../../Components/TitleHeader'

function Settings () {
  /* for SubTest */
  const subtest = [{ value: 'issue', label: 'issue' }, { value: 'error1', label: 'error1' }]
  const [selectedSubTest, setSelectedSubTest] = useState([{ value: 'issue', label: 'issue' }])
  return (
    <>
      <div className="common-layout add-new-form common-dashboard-wrapper no-breadcrumbs light-bg ">
        <Sidebar location={location} />
        <MobileHeader />
        <div className='main-content-box'>
          <Header />
          <TitleHeader name='Settings' />
          <div className='main-layout whitebox-layout'>
            <Form className='light-bg'>
              <div className=''>
                <div className="session-history-box settings-tab-box">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="change_pass">
                    <div className="d-flex justify-content-between align-items-center heading-box">
                      <Nav variant="pills" >
                        <Nav.Item>
                          <Nav.Link eventKey="change_pass">Change Password</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="supports">Supports</Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <div className='btn-box'>
                        <button className='theme-btn text-none' type='submit' >
                          Save New Password
                        </button>
                      </div>
                    </div>
                    <Tab.Content className=''>
                      <Tab.Pane eventKey="change_pass">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-6 col-lg-8 col-md-10">
                                <Form.Group className="form-group" controlId="formnewPassword">
                                  <Form.Label>Current Password</Form.Label>
                                  <div className="password-box no-eye" >
                                    <Form.Control
                                      type="password"
                                      placeholder="Enter Current Password"
                                    />
                                  </div>
                                  <Form.Text className="error-msg"></Form.Text>
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-6 col-lg-8 col-md-10">
                                <Form.Group className="form-group" controlId="formnewPassword">
                                  <Form.Label>New Password</Form.Label>
                                  <Form.Control
                                    type='password'
                                    placeholder="Enter New Password"
                                    name={name}
                                  />
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-6 col-lg-8 col-md-10">
                                <Form.Group className="form-group" controlId="formconfirmPassword">
                                  <Form.Label>Confirm Passwod</Form.Label>
                                  <div className="password-box no-eye" >
                                    <Form.Control
                                      type="password"
                                      placeholder="Re-enter New Password"
                                      name={name}
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="supports" className="support-box">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-6 col-lg-8 col-md-10">
                                <Form.Group className="form-group common-select-style" controlId="formfullname">
                                  <Form.Label>Sub Test</Form.Label>
                                  <Select isSearchable={false} Value={selectedSubTest} onChange={setSelectedSubTest} options={subtest} placeholder={'Select the issue category'} />
                                </Form.Group>
                              </div>
                            </div>{/* inner row ends here */}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group className="form-group " controlId="reason">
                              <Form.Label>Query Description</Form.Label>
                              <Form.Control as="textarea" className='big-textarea' placeholder="Enter Query Description" />
                            </Form.Group>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div >
    </>
  )
}

export default Settings
