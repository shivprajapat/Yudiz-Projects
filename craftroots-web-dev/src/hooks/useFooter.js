import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { request } from '@/services/api.service'
import { FooterLink } from '@/queries'

// Custom hook to fetch data from an API

function createLinkArray(ele) {
  return Array.from(ele.querySelector('ul').querySelectorAll('a')).map((a) => {
    return {
      link: a.getAttribute('href'),
      itemTitle: a.innerText,
    }
  })
}

function createFeaturedonArray(ele) {
  return Array.from(ele.querySelectorAll('a')).map((a) => {
    const img = a.querySelector('img')
    return {
      link: a.getAttribute('href'),
      image: img.getAttribute('src'),
    }
  })
}
export default function useFooter() {
  const footerQueryVariables = {
    links: 'footer_links',
    socilaLinks: 'footer_social_links',
    ourRoots: 'Our_Roots',
    footerQuickLinks: 'footer_quick_links',
    featuredOnLinks: 'Featured On',
  }
  const [footerData, setFooterData] = useState([])
  const storeConfigState = useSelector((state) => state.storeReducer)

  const footerConfigdata = async () => {
    const result = await request({
      ...FooterLink,
      variables: {
        identifiers: [
          footerQueryVariables.ourRoots,
          footerQueryVariables.footerQuickLinks,
          footerQueryVariables.links,
          footerQueryVariables.socilaLinks,
          footerQueryVariables.featuredOnLinks,
        ],
      },
    })
    let footerRes = []
    let footerLinks = []
    let footerSocialLinks
    let FeaturedOnData = []

    result?.cmsBlocks?.items?.forEach((cmsItem) => {
      const footerHTML = convertEntitiesToHTML(cmsItem.content)
      const ele = document.createElement('div')
      ele.innerHTML = footerHTML
      switch (cmsItem?.identifier) {
        case footerQueryVariables.ourRoots:
        case footerQueryVariables.footerQuickLinks:
          footerRes.push({
            id: footerRes.length + 1,
            title: ele?.querySelector('h3').innerText,
            items: createLinkArray(ele),
          })
          break
        case footerQueryVariables.links:
          footerLinks = createLinkArray(ele)

          break
        case footerQueryVariables.featuredOnLinks:
          FeaturedOnData = createFeaturedonArray(ele)

          break
        default:
          footerSocialLinks = ele.innerHTML
          break
      }
    })
    setFooterData({
      data: footerRes,
      links: footerLinks,
      socialLinks: footerSocialLinks,
      featuredOnLinks: FeaturedOnData,
    })
  }

  function convertEntitiesToHTML(asciiString) {
    var tempElement = document.createElement('div')
    tempElement.innerHTML = asciiString
    return tempElement.innerText
  }

  useEffect(() => {
    footerConfigdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    footerData: footerData.data,
    footerLinks: footerData.links,
    footerSocialLinks: footerData.socialLinks,
    featuredOnLinks: footerData.featuredOnLinks,
    copyrightText: storeConfigState?.data?.storeConfig?.copyright,
  }
}
