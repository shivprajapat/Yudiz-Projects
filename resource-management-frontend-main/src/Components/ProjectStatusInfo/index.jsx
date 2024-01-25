import React from 'react'
import Wrapper from 'Components/wrapper'
import { projectStatusColorCode, projectStatusLabel } from 'helpers'

function ProjectStatusInfo() {
  return (
    <Wrapper className="p-2">
      <div className="d-flex flex-wrap">
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode(projectStatusLabel.pending) }}></div>{projectStatusLabel.pending}
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode(projectStatusLabel.inProgress) }}></div>{projectStatusLabel.inProgress}
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode(projectStatusLabel.onHold) }}></div>{projectStatusLabel.onHold}
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode(projectStatusLabel.completed) }}></div>{projectStatusLabel.completed}
        </div>
      </div>
    </Wrapper>
  )
}

export default ProjectStatusInfo
