import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="theme-color" content="#9F5C15" />
        <link
          rel="preconnect"
          href={`https://${process.env.NEXT_PUBLIC_S3_MEDIA_URL}`}
        />
        <link
          rel="dns-prefetch"
          href={`https://${process.env.NEXT_PUBLIC_S3_MEDIA_URL}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Arimo:wght@500&family=Jost:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Arimo:wght@500&family=Josefin+Sans:wght@400;500&family=Jost:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <Script src="/js/newrelic.js" strategy="lazyOnload" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_SCRIPT}`}
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_SCRIPT}');`,
          }}
        />
        {/*
        used this script of nexttel whatsapp icon 
        commented for now because of client change - skipping nextel for now   
        
        <script
          async
          src="https://code.jquery.com/jquery-3.3.1.min.js"
        ></script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
