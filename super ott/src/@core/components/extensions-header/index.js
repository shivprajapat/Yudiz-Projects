// ** React Imports
import Proptypes from 'prop-types'
import { Row, Col } from 'reactstrap'

const ExtensionsHeader = (props) => {
  return (
    <Row className="mb-2">
      <Col sm="12" className="ml-50">
        <p className="font-medium-5 mt-1 extension-title" data-tour="extension-title">
          {props.title}
        </p>
        {props.link ? (
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            {props.subTitle}
          </a>
        ) : (
          <p className="text-primary">{props.subTitle}</p>
        )}
      </Col>
    </Row>
  )
}
export default ExtensionsHeader

// ** PropTypes
ExtensionsHeader.propTypes = {
  title: Proptypes.string.isRequired,
  subTitle: Proptypes.string.isRequired,
  link: Proptypes.string
}
