import PropTypes from 'prop-types'
import articleStyles from '../style.module.scss'

function ArticleStyles({ children }) {
  return children(articleStyles)
}
ArticleStyles.propTypes = {
  children: PropTypes.func
}
export default ArticleStyles
