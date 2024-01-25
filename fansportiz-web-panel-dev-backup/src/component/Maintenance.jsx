import React, { useEffect } from 'react'
import { Row } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import Logo from '../assests/images/fansportiz_header.svg'
import maintenance from '../assests/images/maintenance.svg'
import { useNavigate } from 'react-router-dom'
import useMaintenanceMode from '../api/settings/queries/useMaintenanceMode'
import useActiveSports from '../api/activeSports/queries/useActiveSports'

function Maintenance () {
  const navigate = useNavigate()

  const { data: Maintenance } = useMaintenanceMode()
  const { activeSport } = useActiveSports()

  useEffect(() => {
    if (Maintenance?.bIsMaintenanceMode === false) {
      navigate(`/home/${activeSport}`)
    }
  }, [Maintenance])

  return (
    <div className="d-flex justify-content-center align-items-center maintenance h-100">
      <Row>
        <div className="notFound">
          <img alt={<FormattedMessage id="Fansportiz" />} src={Logo} style={{ height: '66px' }} />
          <br />
          <br />
          <h1>{Maintenance?.sMessage || <FormattedMessage id="Page_not_found" />}</h1>
          <br />
          <img alt="Maintenance" src={maintenance} style={{ height: '166px' }} />
        </div>
      </Row>
    </div>
  )
}

export default Maintenance
