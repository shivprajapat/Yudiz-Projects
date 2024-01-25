import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import AssistanceForm from './AssistanceForm'
import useFooter from '@/hooks/useFooter'
import { allRoutes } from '@/constants/allRoutes'

function Footer() {
  const { footerData, footerLinks, footerSocialLinks, copyrightText } =
    useFooter()

  const router = useRouter()
  return (
    <footer
      id="footer"
      className={`${
        router.pathname === allRoutes.productDetails ? 'pb-14 sm:pb-0' : ''
      } bg-secondary-600`}
    >
      <div className="container">
        <div className="md:flex md:justify-between py-6 md:py-10 lg:py-14">
          <div className="w-full md:w-1/6 mb-6 md:mb-0 flex">
            <div
              id="footer"
              // className="ml-auto"
              dangerouslySetInnerHTML={{
                __html: footerSocialLinks,
              }}
            />
            {/* </div> */}
          </div>
          <div className="w-full md:w-1/3 lg:w-1/3 flex">
            {footerData?.map((links) => {
              const { title, items } = links
              return (
                <div key={links.id} className="w-1/2">
                  <h6 className="footer-heading">{title}</h6>
                  <ul>
                    {items.map((item) => {
                      const { link, itemTitle } = item
                      return (
                        <li className="mb-4" key={link.link}>
                          <Link
                            href={link}
                            className="text-sm text-grey-800 lading-[22px] font-normal opacity-90 hover:text-secondary-200 font-jost transition-all"
                            prefetch={false}
                          >
                            {itemTitle}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className="w-full lg:w-1/4 md:w-1/3">
            <AssistanceForm footerSocialLinks={footerSocialLinks} />
          </div>
        </div>
      </div>
      <div className="relative copy-right">
        <div className="container py-6 md:py-10">
          <div className="sm:flex sm:items-center text-center sm:justify-between pt-4 sm:mt-0">
            <span
              className="text-xs lg:text-sm text-grey-800 leading-4"
              dangerouslySetInnerHTML={{
                __html: copyrightText,
              }}
            ></span>
            <div className="flex mt-4 space-x-6 justify-center sm:mt-0">
              {footerLinks?.map((link) => (
                <Link
                  href={link?.link}
                  key={link?.link}
                  className="text-xs lg:text-sm text-grey-800 leading-4 hover:text-primary"
                >
                  <span>{link?.itemTitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
