import React from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import './_dashboard.scss'
import DashboardCard from 'Components/DashboardCard'
import iconFigma from '../../Assets/Icons/figma.svg'
export default function Dashboard() {
  return (
    <section className="dashboard">
      <Wrapper transparent>
        <PageTitle title="Dashboard" />
        <Row className='mt-4'>
          <DashboardCard name="Total Projects" number={135} color="#0487FF" />
          <DashboardCard name="New Projects" number={21} color="#0EA085" />
          <DashboardCard name="Completed Project" number={26} color="#F29B20" />
          <DashboardCard name="On Going Projects" number={10} color="#884B9D" />
        </Row>
      </Wrapper>
      <Wrapper transparent>
        <Row>
          <Col xxl={6} lg={6}>
            <Wrapper className="m-0">
              <PageTitle title="Free Resources" />
              <Table responsive className="datatable">
                <thead>
                  <tr>
                    <th style={{width:'40px'}}>#</th>
                    <th>Employee Name</th>
                    <th>Technology</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Rockford</td>
                    <td>Unity</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Farmers Market </td>
                    <td>Magento</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Goffrey Build</td>
                    <td>Design</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Goffrey Build</td>
                    <td>Blockchain</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Goffrey Build</td>
                    <td>React</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Goffrey Build</td>
                    <td>DevOPS</td>
                  </tr>
                </tbody>
              </Table>
            </Wrapper>
          </Col>
          <Col xxl={6} lg={6}>
            <Wrapper className="chart m-0 d-flex h-100"></Wrapper>
          </Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle title="Latest Project" />

          <Table responsive className="datatable project-table">
            <thead>
              <tr>
                <th>#</th>
                <th colSpan={2}>Project Name</th>
                <th align="center">Due Date</th>
                <th align="center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td colSpan={2}>
                  <div className="project-table-td">
                    <div className="img-box">
                      <img src={iconFigma} alt="" className="img-fluid" />
                    </div>
                    <span>Figma UI Tool</span>
                  </div>
                </td>
                <td align="center">16/08/2019</td>
                <td align="center">
                  <button className='light-blue50'>In Progress</button>
                  </td>
              </tr>
              <tr>
                <td>2</td>
                <td colSpan={2}>
                  <div className="project-table-td">
                    <div className="img-box">
                      <img src={iconFigma} alt="" className="img-fluid" />
                    </div>
                    <span>Figma UI Tool</span>
                  </div>
                </td>
                <td align="center">16/08/2019</td>
                <td align="center"><button className='light-blue50'>In Progress</button></td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>
                  <div className="project-table-td">
                    <div className="img-box">
                      <img src={iconFigma} alt="" className="img-fluid" />
                    </div>
                    <span>Figma UI Tool</span>
                  </div>
                </td>
                <td align="center">16/08/2019</td>
                <td align="center"><button className='pending'>Pending</button></td>
              </tr>
              <tr>
                <td>4</td>
                <td colSpan={2}>
                  <div className="project-table-td">
                    <div className="img-box">
                      <img src={iconFigma} alt="" className="img-fluid" />
                    </div>
                    <span>Figma UI Tool</span>
                  </div>
                </td>
                <td align="center">16/08/2019</td>
                <td align="center"><button className='light-ola'>On Hold</button></td>
              </tr>
              <tr>
                <td>5</td>
                <td colSpan={2}>
                  <div className="project-table-td">
                    <div className="img-box">
                      <img src={iconFigma} alt="" className="img-fluid" />
                    </div>
                    <span>Figma UI Tool</span>
                  </div>
                </td>
                <td align="center">16/08/2019</td>
                <td align="center">
                  <button className='light-green'>Completed</button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Wrapper>
    </section>
  )
}
