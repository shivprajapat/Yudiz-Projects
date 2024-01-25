import React from 'react'
import PropTypes from 'prop-types'
import { MathJaxProvider, MathJaxNode } from '@yozora/react-mathjax'

const MathExpression = ({ opt }) => {
  return (
    <MathJaxProvider>
        <MathJaxNode inline formula={opt?.math_expression} />
    </MathJaxProvider>
  )
}
export default React.memo(MathExpression)

MathExpression.propTypes = {
  opt: PropTypes.object
}
