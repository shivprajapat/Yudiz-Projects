import React from 'react'
import Image from 'next/image'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import { imgSmallBorder } from '@/assets/images'
import { Heading, Meta } from '@/components/generic'
import META from '@/helper/meta-constant'
import NextImage from '@/components/generic/NextImage'
import { BRAND_NAME } from '@/helper/constant'
import { fetchCMSPageData } from '@/helper'
const MEDIA_URL = 'https://' + process.env.NEXT_PUBLIC_S3_MEDIA_URL

const TIME_LINE_DATA = [
  {
    id: 1,
    year: '1995',
    img: MEDIA_URL + '/media/wysiwyg/1995.jpg',
    title: 'Where it All Started',
    description:
      'Smt. Anandiben Patel, along with her daughter Smt. Anar Patel registered an organization named Gramshree Women Empowerment to empower marginalized women through income generation activities.',
  },
  {
    id: 2,
    year: '1997-98',
    img: MEDIA_URL + '/media/wysiwyg/1997-98.JPG',
    title: 'Humble Beginnings',
    description:
      'Gramshree introduces skill development programs and employs slum-dwelling women at Gandhi Ashram and Ramapir no Tekro in Ahmedabad - the early beginning of what one day become Craftroots lead handicraft center. ',
  },
  {
    id: 3,
    year: '2001-02',
    img: MEDIA_URL + '/media/wysiwyg/2001-02.jpg',
    title: 'Helping Hands',
    description:
      'The Gujarat earthquake devastated the villages of Bhuj. Gramshree team, with partner organizations, restored Ludiya village, Gandhi nu Gam, Hodko, and Dhordo by organizing medical camps, constructing houses, and more. Also, Craftroots team fanned the rich handicraft culture of villages by establishing a center at Ludiya village ',
  },
  {
    id: 4,
    year: '2003-05',
    img: MEDIA_URL + '/media/wysiwyg/2003-05.jpg',
    title: 'Wave of Handicraft',
    description:
      'The wave of handicraft then reached Patan in Gujarat, reviving the vintage Mashru weaving craft. Simultaneously a weaving centre was established at Ranip in Ahmedabad, Gujarat.',
  },
  {
    id: 5,
    year: '2005-06',
    img: MEDIA_URL + '/media/wysiwyg/2005-06.JPG',
    title: 'Growing Strong',
    description:
      'With immense love and blessing from the audience, Craftroots established its 1st retail store in Ahmedabad, showcasing handicraft creations of the artisans spread across the nation. ',
  },
  {
    id: 6,
    year: '2006-07',
    img: MEDIA_URL + '/media/wysiwyg/2006-07.JPG',
    title: 'Vision to Empower',
    description:
      'Craftroots pioneers a host of handicraft and weaving centers in and near Ahmedabad to elevate the socio- economic position of the communities and spread awareness of the rich Indian crafts.',
  },
  {
    id: 7,
    year: '2009-10',
    img: MEDIA_URL + '/media/wysiwyg/2009-10.jpg',
    title: 'Change through Craft',
    description:
      'Craftroots endeavors to bring change in society therefore, the profits acquired from selling products are reinvested to initiate support programs in health, education, personal finance, leadership training of the artisans, and contribute to handicraft clusters development across the country',
  },
  {
    id: 8,
    year: '2013',
    img: MEDIA_URL + '/media/wysiwyg/2013.jpg',
    title: 'We went Global',
    description:
      'Craftroot took the flight overseas, hence conducted handicraft exhibitions in Dubai and Singapore.',
  },
  {
    id: 9,
    year: '2014',
    img: MEDIA_URL + '/media/wysiwyg/2014.JPG',
    title: 'Collaboration',
    description:
      'Craftroots aims to create a space that enables artisans and young enthusiasts to collaborate and co-create. Therefore, we began conducting workshops where artisans and designing students from universities such as CEPT, UID, NIFT, and more come together to share and execute ideas on craft development.',
  },
  {
    id: 10,
    year: '2016',
    img: MEDIA_URL + '/media/wysiwyg/2016.JPG',
    title: 'Where We are Now',
    description:
      'Inaugurated a Retail outlet in Delhi and signature store in Ahmedabad.',
  },
  {
    id: 11,
    year: '2017',
    img: MEDIA_URL + '/media/wysiwyg/2017.JPG',
    title: '2017',
    description:
      'With great excitement, we inaugurated our second store in Ahmedabad, located at Bodakdev, offering a delightful shopping experience to be had.',
  },
  {
    id: 12,
    year: '2020-21',
    img: MEDIA_URL + '/media/wysiwyg/2020.JPG',
    title: '2020-21',
    description:
      'Under the SFURTI Project, Smt. Anar Patel nurtured a dream, to create a craft innovation center at Lilapur, a place to gleam, where artisans could flourish and their skills would be esteemed.',
  },
  {
    id: 13,
    year: '2022',
    img: MEDIA_URL + '/media/wysiwyg/2022.JPG',
    title: '2022',
    description:
      'Craftroots made a bold move, expanding Pan India by organizing Craft Melas and opening stand-alone stores, an ambitious display. Proudly inaugurated our first store in Mumbai, a promising gateway.',
  },
  {
    id: 14,
    year: '2023',
    img: MEDIA_URL + '/media/wysiwyg/2023.jpg',
    title: '2023',
    description:
      'With great joy and anticipation, we inaugurated our second store in Mumbai, adding another vibrant site to our growing presence, delivering quality and style.',
  },
]

const OurJourney = ({ seoDataRes }) => {
  const intl = useIntl()
  return (
    <>
      <Meta
        title={
          seoDataRes?.cmsPage?.meta_title ||
          seoDataRes?.cmsPage?.title + ' | ' + BRAND_NAME
        }
        description={
          seoDataRes?.cmsPage?.meta_description ||
          META.commonContent.description
        }
        keyword={
          seoDataRes?.cmsPage?.meta_keywords || META.commonContent.keywords
        }
      />
      <section className="section-padding">
        <div className="container">
          <Heading
            title={intl.formatMessage({ id: 'page.ourJourney.title' })}
          />

          <div className="timeline">
            {TIME_LINE_DATA.map((item) => {
              const { id, year, title, img, description } = item
              return (
                <div
                  className="timeline-item relative flex items-center justify-start first:pt-0 first:border-t-0 first:rounded-t-none last:!pb-0 last:rounded-b-none odd:lg:pl-8 odd:lg:pr-28 odd:pb-8 odd:2xl:pr-40 odd:2xl:pl-10 odd:2xl:pb-10 even:lg:pr-8 even:lg:pl-28 even:pb-8 even:2xl:pr-10 even:2xl:pl-40 even:2xl:pb-10"
                  key={id}
                >
                  <div className="bg-grey-100 items-center justify-start p-3 sm:p-6 border border-secondary-300 flex-col sm:flex-row w-full flex gap-4 sm:gap-10 relative odd:flex-col odd:sm:flex-row even:flex-col even:sm:flex-row-reverse">
                    <span className="timeline-border" />
                    <span className="timeline-border-odd" />
                    <div className="odd:order-2 w-full md:w-2/4 xl:w-1/3">
                      <div className="relative w-full h-full p-3">
                        <NextImage
                          src={img}
                          alt={title}
                          className="w-full h-full object-cover mx-auto"
                          width={308}
                          height={201}
                        />
                        <Image
                          src={imgSmallBorder}
                          alt="border"
                          className="absolute w-full h-full inset-0"
                        />
                      </div>
                    </div>
                    <div className="even:text-left odd:text-left w-full md:w-2/4 lg:w-2/3">
                      <h3 className="text-primary text-3xl sm:text-[32px] mb-4 sm:mb-6 font-semibold">
                        {year}
                      </h3>
                      <h6 className="text-secondary-200 text-sm mb-2 font-jost font-medium uppercase tracking-[1.7px]">
                        {title}
                      </h6>
                      <p className="text-grey-800 text-sm xs:text-base sm:text-lg font-normal">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default OurJourney
OurJourney.propTypes = {
  seoDataRes: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
OurJourney.defaultProps = {
  seoDataRes: {
    cmsPage: {
      content: '',
      meta_description: '',
      meta_keywords: '',
      meta_title: '',
      title: '',
    },
  },
}

export async function getServerSideProps() {
  try {
    const seoDataRes = await fetchCMSPageData('our-journey')
    return { props: { seoDataRes } }
  } catch (error) {
    console.log('error', error)
    return { props: { seoDataRes: null } }
  }
}
