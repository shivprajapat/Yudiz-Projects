import React from 'react'
import { Nav, Tab } from 'react-bootstrap';

import style from "./style.module.scss";
import { Wrapper } from '@/shared/components';
import { AccountDetails, EditProfile, ParentControl, Restrictions, Subscription, UserProfile } from '@/shared/admin';

const ManageAccount = () => {
  const { admin, admin_items, admin_container } = style;

  const sidebarConfig = [
    {
      path: "account-details",
      title: "Account Details",
    },
    {
      path: "subscription",
      title: "Subscription"
    },
    {
      path: "user-profile",
      title: "User Profile",
    },
    {
      path: "parent-control",
      title: "Parent Control"
    }
  ]
  return (
    <Wrapper Orange>
      <section className={`${admin} banner-padding`} id='admin'>
        <Tab.Container id="left-tabs-example" defaultActiveKey="account-details">
          <div className='d-flex'>
            <div className={admin_items}>
              <Nav variant="pills" className="flex-column">
                {
                  sidebarConfig.map((value, i) => {
                    const { path, title } = value;
                    return (
                      <Nav.Item key={i}><Nav.Link eventKey={path}>{title}</Nav.Link></Nav.Item>
                    )
                  })
                }</Nav>
            </div>
            <div className={admin_container}>
              <Tab.Content>
                <Tab.Pane eventKey="account-details"><AccountDetails /></Tab.Pane>
                <Tab.Pane eventKey="subscription"><Subscription /></Tab.Pane>
                <Tab.Pane eventKey="user-profile">
                  <UserProfile />
                  {/* <EditProfile /> */}
                </Tab.Pane>
                {/* <Tab.Pane eventKey="parent-control"><ParentControl /></Tab.Pane> */}
                <Tab.Pane eventKey="parent-control"><Restrictions /></Tab.Pane>
                
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </section>
    </Wrapper>
  )
}

export default ManageAccount