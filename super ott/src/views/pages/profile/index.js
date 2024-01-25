import { useDispatch, useSelector } from 'react-redux'
import { Fragment, useEffect, useState } from 'react'
import { Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap'

import Tabs from './Tabs'
import GeneralTabContent from './GeneralTabContent'
import PasswordTabContent from './PasswordTabContent'
import Breadcrumbs from '@components/breadcrumbs'
import { getAllUserData } from '../../../redux/actions/auth'

import '@styles/react/pages/page-profile.scss'

const Profile = () => {
  const dispatch = useDispatch()
  const { viewUserData } = useSelector((state) => state.auth)
  const [userData, setUserData] = useState()
  const [activeTab, setActiveTab] = useState('1')

  useEffect(() => {
    dispatch(getAllUserData())
  }, [])

  useEffect(() => {
    if (viewUserData) {
      setUserData(userData)
    }
  }, [viewUserData])

  const toggleTab = (tab) => {
    setActiveTab(tab)
  }

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Account Settings" breadCrumbActive="Account Settings" />
      {viewUserData !== null ? (
        <Row>
          <Col className="mb-2 mb-md-0" md="3">
            <Tabs activeTab={activeTab} toggleTab={toggleTab} />
          </Col>
          <Col md="9">
            <Card>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <GeneralTabContent data={viewUserData} />
                  </TabPane>
                  <TabPane tabId="2">
                    <PasswordTabContent />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  )
}

export default Profile
