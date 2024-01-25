import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function InnerHTML({ html, ...rest }) {
  const ref = useRef()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parsedHTML = document.createRange().createContextualFragment(html)
      ref.current.innerHTML = ''
      ref.current.append(parsedHTML)
      const scrollTable = document.getElementsByTagName('table')
      for (let i = 0; i < scrollTable.length; i++) {
        const wrapper = document.createElement('div')
        wrapper.classList.add('table-responsive')
        wrapper.append(scrollTable[i].cloneNode(true))
        scrollTable[i].replaceWith(wrapper)
      }
    }
  }, [html])

  return <div {...rest} ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}

InnerHTML.propTypes = {
  html: PropTypes.string
}

export default InnerHTML
