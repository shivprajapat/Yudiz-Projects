import { DOMAIN, FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL, S3_PREFIX, SITE_NAME, TWITTER_URL, YOUTUBE_URL } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import { addHoursIntoDate, capitalizeFirstLetter, convertDateToISTWithFormate, currentDateMonth, dateCheck, getImgURL, stripHtml } from '@shared/utils'
const previewImg = `${DOMAIN}images/CricTracker-Facebook-Preview.jpg`
const logo = `${DOMAIN}images/logo.png`

export const makeSchema = (data, nav) => {
  const ampParam = nav[nav.length - 1] === '?amp=1' ? '?amp=1' : ''
  if (data?.oSeo?.eType === 'ar' || data?.oSeo?.eType === 'fa') {
    return {
      '@context': 'http://schema.org',
      '@type': data?.oSeo?.eSchemaType === 'ar' ? 'Article' : 'NewsArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': DOMAIN + data?.oSeo?.sSlug + '/' + ampParam
      },
      headline: data?.sTitle,
      image: {
        '@type': 'ImageObject',
        url: getImgURL(data?.oImg?.sUrl) || previewImg,
        width: 600,
        height: 400
      },
      articleBody: stripHtml(data?.sContent) || stripHtml(data?.sMatchPreview),
      dateModified: convertDateToISTWithFormate(dateCheck(data?.dUpdated)),
      author: {
        '@type': 'Person',
        name: data?.oDisplayAuthor?.sDisplayName,
        url: DOMAIN + allRoutes.authorDetail(data?.oDisplayAuthor?.oSeo?.sSlug)?.substring(1)
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: logo,
          width: 151,
          height: 24
        }
      },
      description: data?.sDescription
    }
  } else if (data?.oSeo?.eType === 'jo') {
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: data?.sTitle,
      description: data?.sDescription,
      identifier: {
        '@type': 'PropertyValue',
        name: SITE_NAME
      },
      datePosted: currentDateMonth(dateCheck(data?.dCreated)),
      employmentType: 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: SITE_NAME,
        sameAs: DOMAIN,
        logo: `${DOMAIN}images/logo.png`
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '100 1st Floor, 1st Cross Wheeler Rd, Pulikeshi Nagar',
          addressLocality: 'No 26 North Quarters',
          addressRegion: 'Karnataka',
          postalCode: '560005',
          addressCountry: 'IND'
        }
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: data?.fSalaryFrom,
          maxValue: data?.fSalaryTo,
          unitText: 'YEAR'
        }
      }
    }
    if (data?.eOpeningFor !== 'wfo') {
      delete schema.jobLocation
      schema.jobLocationType = 'TELECOMMUTE'
    }
    return schema
  }
  return {}
}

export const makeBreadcrumbSchema = (data, isAMPEnable) => {
  const params = isAMPEnable ? '?amp=1' : ''
  const home = {
    '@type': 'ListItem',
    position: 1,
    item: {
      name: 'Home',
      '@id': DOMAIN
    }
  }
  return {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      home,
      ...data.map((item, index) => {
        const to = data.join('/').split(item)[0]
        return {
          '@type': 'ListItem',
          position: index + 2,
          item: {
            '@id': DOMAIN + to + item + '/' + params,
            name: capitalizeFirstLetter(item?.replace(/-/gi, ' '))
          }
        }
      })
    ]
  }
}

export const makeSiteNavigationSchema = (data, isAmp) => {
  const sidebarNav = []
  const name = new Set()
  data.forEach((navItem, i) => {
    if (navItem?.bIsMulti) {
      navItem?.aSlide.forEach((slideItem, index) => {
        if (!name?.has(slideItem?.sName)) {
          name.add(slideItem?.sName)
          sidebarNav.push({
            '@type': 'SiteNavigationElement',
            position: sidebarNav?.length + 1,
            name: slideItem?.sName,
            url: isAmp ? `${DOMAIN}${slideItem?.sSlug}?amp=1` : `${DOMAIN}${slideItem?.sSlug}`
          })
        }
      })
    } else if (!name?.has(navItem?.sName)) {
      name.add(navItem?.sName)
      sidebarNav.push({
        '@type': 'SiteNavigationElement',
        position: sidebarNav?.length + 1,
        name: navItem?.sName,
        url: isAmp ? `${DOMAIN}${navItem?.sSlug}?amp=1` : `${DOMAIN}${navItem?.sSlug}`
      })
    }
  })
  return {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    itemListElement: sidebarNav
  }
}

export const makeMatchDetailSchema = (seo, matchDetail) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'LiveBlogPosting',
    url: `${DOMAIN}${seo?.sSlug}/`,
    articleBody: matchDetail?.sTitle,
    datePublished: convertDateToISTWithFormate(addHoursIntoDate({ h: 1, d: matchDetail?.dStartDate })),
    dateModified: convertDateToISTWithFormate(dateCheck(matchDetail?.dStartDate)),
    headline: seo?.sTitle,
    mainEntityOfPage: `${DOMAIN}${seo?.sSlug}/`,
    articleSection: 'Sports news',
    inLanguage: 'English',
    description: seo?.sDescription,
    thumbnailUrl: previewImg,
    coverageStartTime: convertDateToISTWithFormate(addHoursIntoDate({ h: 1, d: matchDetail?.dStartDate })),
    coverageEndTime: convertDateToISTWithFormate(dateCheck(matchDetail?.dEndDate)),
    about: {
      url: `${DOMAIN}${seo?.sSlug}/`,
      '@type': 'Event',
      startDate: convertDateToISTWithFormate(addHoursIntoDate({ h: 1, d: matchDetail?.dStartDate })),
      name: seo?.sTitle,
      description: seo?.sDescription,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'Live',
      image: previewImg,
      endDate: convertDateToISTWithFormate(dateCheck(matchDetail?.dEndDate)),
      location: {
        '@type': 'Place',
        name: matchDetail?.oVenue?.sName,
        address: matchDetail?.oVenue?.sLocation
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'CricTracker',
      logo: {
        '@type': 'ImageObject',
        url: logo,
        width: '151',
        height: '24'
      }
    },
    author: {
      '@type': 'Person',
      name: 'CricTracker Staff'
    },
    name: 'CricTracker',
    liveBlogUpdate: []
  }
}

export const makeOrganizationSchema = () => {
  return {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: 'https://www.crictracker.com',
    sameAs: [
      SITE_NAME,
      FACEBOOK_URL,
      TWITTER_URL,
      INSTAGRAM_URL,
      YOUTUBE_URL,
      LINKEDIN_URL
    ],
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 151,
      height: 24
    },
    brand: SITE_NAME
  }
}

export const makeWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.crictracker.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.crictracker.com/search/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export const makeSeriesSchema = (scoreCard) => {
  return scoreCard.map((m) => {
    return {
      '@context': 'http://schema.org',
      '@type': 'SportsEvent',
      url: `${DOMAIN}${m?.oSeo?.sSlug}/`,
      name: m?.oSeo?.sTitle,
      description: m?.oSeo?.sDescription,
      startDate: convertDateToISTWithFormate(addHoursIntoDate({ h: 1, d: m?.dStartDate })),
      endDate: convertDateToISTWithFormate(dateCheck(m?.dEndDate)),
      competitor: [{
        '@type': 'SportsTeam',
        name: m?.oTeamScoreA?.oTeam?.sTitle,
        image: S3_PREFIX + m?.oTeamScoreA?.oTeam?.oImg?.sUrl
      }, {
        '@type': 'SportsTeam',
        name: m?.oTeamScoreB?.oTeam?.sTitle,
        image: S3_PREFIX + m?.oTeamScoreB?.oTeam?.oImg?.sUrl
      }],
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          name: `${m?.oVenue?.sName}, ${m?.oVenue?.sLocation}`
        }
      }
    }
  })
}
