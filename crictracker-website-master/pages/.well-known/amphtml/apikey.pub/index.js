import PropTypes from 'prop-types'

function AMPHtmlPublicKey({ error }) {
  return (
    <div className="container py-2">
      <p>{error}</p>
    </div>
  )
}
AMPHtmlPublicKey.propTypes = {
  error: PropTypes.any
}
export default AMPHtmlPublicKey

const key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs2WU2fo0GviWhXtTeBpz
Rz/JqyU7p+qK9OJZKk0qydQwvPqKHj5Cw7NOzBxnPw8m974D9Y5tbVF1srEVno+S
xr+d50MstaNgkxutK428Yk55zyLoUsTkDUWcomGtrgsqdkrwGVljtEsoKEnCNNq8
dabkEUmrW6Suh0lqtQeQenmrRA/SHaTCjblwp1kWSLK9zHdWD+C38+zabgUC1ZLM
kwy8zvtINxL3ItaEdKkXW+Xl13vyUPpZm0UeSJ4xcJojjasJII7pzJ34BDR5xHZ9
g1elqEeob1mVjJUQw3K1Ew1mhNM5AenQvGQMEAIkRkbdR9j9mADLtW2FdPiVXxTl
hQIDAQAB
-----END PUBLIC KEY-----
`

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.write(key)
    res.end()
    return {
      props: {}
    }
  } catch (e) {
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
