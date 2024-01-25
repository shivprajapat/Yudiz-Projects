import PropTypes from 'prop-types'
import LightboxComponent from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

function LightBox({ open, close, slides, index, thumbnails, zoom }) {
  const plugins = []
  if (thumbnails) {
    plugins.push(Thumbnails)
  }
  if (zoom) {
    plugins.push(Zoom)
  }
  return (
    <LightboxComponent
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={plugins}
    />
  )
}

LightBox.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      srcSet: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ),
  thumbnails: PropTypes.bool,
  zoom: PropTypes.bool,
}
LightBox.defaultProps = {
  thumbnails: false,
  zoom: false,
}

export default LightBox
