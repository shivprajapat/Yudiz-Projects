import PropTypes from 'prop-types'

import useCategory from '@shared/hooks/useCategory'

const CategoryMain = ({ category, seoData }) => {
  const { getCategoryPages } = useCategory({ category, seoData })
  return getCategoryPages()
}
CategoryMain.propTypes = {
  category: PropTypes.object,
  seoData: PropTypes.object
}

export default CategoryMain
