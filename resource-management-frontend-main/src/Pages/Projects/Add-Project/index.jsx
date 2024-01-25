import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Tabs, Tab } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import { BasicDetails, ContractDetails, DedicatedDetails, FixedCostDetails } from '../Project-Details'
import { getProjectDetail } from 'Query/Project/project.query'
import './_add-project.scss'

export default function AddProject() {
  const { type, id } = useParams()
  const [key, setKey] = useState(type === 'edit' ? '0' : '1')
  const [projectType, setProjectType] = useState('Dedicated')

  const projectData = useQuery(['getProjectDetails', id], () => getProjectDetail(id), {
    enabled: type === 'edit',
    select: (data) => data.data.data.project,
  })

  function ProjectName() {
    return (
      <div className='d-flex justify-content-between p-0'>
        <p className='projectName'>Project Name :</p>  <PageTitle style={{ marginRight: '40px' }} title={projectData?.data?.sName} />
      </div>
    )
  }
  return (
    <section className="add-project">
      <Wrapper isLoading={projectData?.isLoading}>
        <section>
          <div className='d-flex justify-content-between p-0'>
            <PageTitle title="Project Basic Details" />
            {(key === '2') || (key === '3') ? ProjectName() : null}
          </div>

          <Tabs className="project-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="1" tabClassName={projectData.data?.flag?.['1'] === 'Y' ? 'filled' : ''} title={basicDetails()}>
              <BasicDetails
                formData={projectData.data}
                setPage={setKey}
                setProjectType={setProjectType}
                projectType={projectType}
                keyValue={key}
              />
            </Tab>
            <Tab
              eventKey="2"
              tabClassName={projectData.data?.flag?.['2'] === 'Y' && projectData.data?.eProjectType === projectType ? 'filled' : ''}
              disabled={type !== 'edit' || projectData.data?.flag?.['1'] === 'N' || !(projectData.data?.eProjectType === projectType)}
              title={projectType === 'Dedicated' ? dedicatedDetails() : fixedCostDetails()}
            >
              {projectType === 'Dedicated' ? (
                <DedicatedDetails
                  formData={projectData.data}
                  setPage={setKey}
                  projectType={projectType}
                  setProjectType={setProjectType}
                  keyValue={key}
                />
              ) : (
                <FixedCostDetails
                  formData={projectData.data}
                  setPage={setKey}
                  projectType={projectType}
                  setProjectType={setProjectType}
                  keyValue={key}
                />
              )}
            </Tab>
            <Tab
              eventKey="3"
              tabClassName={projectData.data?.flag?.['3'] === 'Y' ? 'filled' : ''}
              disabled={type !== 'edit' || (projectData.data?.flag?.['2'] === 'N' && projectData.data?.flag?.['3'] !== 'Y')}
              title={contractDetails()}
            >
              <ContractDetails formData={projectData.data} setPage={setKey} setProjectType={setProjectType} keyValue={key} />
            </Tab>
          </Tabs>
        </section>
      </Wrapper>
    </section>
  )
}

function basicDetails() {
  return (
    <div className="tab-item nav-item">
      <button>1</button>
      <p className="nav-link">Project Basic Details</p>
    </div>
  )
}
function dedicatedDetails() {
  return (
    <div className="tab-item nav-item">
      <button>2</button>
      <p className="nav-link">Dedicated Project Details</p>
    </div>
  )
}
function contractDetails() {
  return (
    <div className="tab-item nav-item">
      <button>3</button>
      <p className="nav-link">Contract Details</p>
    </div>
  )
}
function fixedCostDetails() {
  return (
    <div className="tab-item nav-item">
      <button>2</button>
      <p className="nav-link">Fixed Cost Project Details</p>
    </div>
  )
}
