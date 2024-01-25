import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const PageError = dynamic(() => import('@shared/components/pageError'))

function Error(Component) {
  return function child(props) {
    useEffect(() => {
      props?.error && console.error(JSON.parse(props?.error), props)
    }, [])
    if (props?.statusCode) {
      return <PageError title="PageNotFound" />
    } else if (props?.error) {
      return <PageError />
    } else {
      return <Component {...props} />
    }
  }
}
export default Error
