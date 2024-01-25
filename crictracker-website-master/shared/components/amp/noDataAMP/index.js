import PropTypes from 'prop-types'

function NoDataAMP(props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{props?.title || 'No Data Found'}</h3>
      <amp-img
        alt="A view of the sea"
        src="/images/no-data.svg"
        // layout="responsive"
        height="213"
        width="240"
      >
      </amp-img>
    </div>
  )
}
export default NoDataAMP

NoDataAMP.propTypes = {
  title: PropTypes.string
}
