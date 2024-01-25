import Ads from '@shared/components/ads'
import Head from 'next/head'
import { useState } from 'react'

const boxStyles = { padding: '12px', border: '1px solid #eaeaea', borderRadius: '10px' }
export default function Home() {
  const [count, setCount] = useState(0)
  if (count === 1) {
    throw new Error('I crashed!')
  }
  return (
    <div>
      <Head>
        <meta name="robots" content="noindex" />
        <meta name="robots" content="nofollow" />
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Ads
          id="div-ad-gpt-138639789-1664362011-0"
          adIdDesktop="Crictracker2022_Desktop_Interstitial_960x490"
          adIdMobile="Crictracker2022_Mobile_Interstitial_300x300"
          dimensionDesktop={[960, 490]}
          dimensionMobile={[300, 300]}
          mobile
          className={'text-center mb-4'}
        />
        <p >
          {count} Get started by sending us a sample error
        </p>
        <button type="button" style={{
          ...boxStyles,
          backgroundColor: '#c73852',
          borderRadius: '12px',
          border: 'none'
        }} onClick={() => {
          setCount(count + 1)
        }}>
          Throw error
        </button>

        <p>
          For more information, see <a href="https://docs.sentry.io/platforms/javascript/guides/nextjs/">https://docs.sentry.io/platforms/javascript/guides/nextjs/</a>
        </p>
      </main>
    </div>
  )
}
