import React from 'react'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import './style.scss'
import BankAccount from 'pages/edit-profile/components/bank-account'
import useAdminSettings from './hooks/use-admin-setting'
import GeneralSettings from 'admin/shared/components/general-settings'
import WalletForm from 'admin/shared/components/wallet-form'

const Settings = () => {
  const { selectedTab, handleTabChange, handleStepSubmit, defaultValues, loading, commissionValues } = useAdminSettings()

  return (
    <>
      <h2 className="admin-heading mb-3">Settings</h2>
      <div id="edit-settings-container">
        <Tab.Container id="edit-profile-tabs" className="side-tabs" activeKey={selectedTab}>
          <Row>
            <Col xxl={3} lg={4} md={3}>
              <Nav variant="pills" className="flex-column bg-dark rounded">
                <Nav.Item className="nav-item" onClick={() => handleTabChange('generalSettings')}>
                  <Nav.Link eventKey="generalSettings">General Settings</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleTabChange('donation')}>
                  <Nav.Link eventKey="donation">Donate</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleTabChange('commission')}>
                  <Nav.Link eventKey="commission">Commission</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xxl={6} lg={7} md={9} className="offset-xxl-1 offset-lg-1">
              <div className="edit-profile-right-section scrollable w-100 p-5">
                <Tab.Content>
                  <Tab.Pane eventKey="generalSettings">
                    <GeneralSettings handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="donation" mountOnEnter>
                    <WalletForm
                      handleStepSubmit={handleStepSubmit}
                      defaultValues={defaultValues}
                      loading={loading}
                    ></WalletForm>
                    <BankAccount handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="commission" mountOnEnter>
                    <h5>Commission Wallet Address</h5>
                    {process.env.REACT_APP_SUPER_ADMIN_ETHEREUM_ADDRESS}
                    <BankAccount handleStepSubmit={handleStepSubmit} defaultValues={commissionValues} loading={loading} />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  )
}

export default Settings
