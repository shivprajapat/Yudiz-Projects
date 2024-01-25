import React from 'react'
import { useIntl } from 'react-intl'

import { imgCrafts1 } from '@/assets/images'
import { Button, Heading } from '@/components/generic'
import { PressListItem } from '@/components/CardList'

const Press = () => {
  const intl = useIntl()
  const pressData = [
    {
      id: 1,
      img: imgCrafts1,
      topTitle: 'India Today',
      title: 'Bridging the gap between crafts and couture',
      description:
        'Anar Patel, a passionate social worker and dedicated handloom supporter talks about her love for traditional art and craft .',
    },
    {
      id: 2,
      img: imgCrafts1,
      topTitle: 'The Asian Age',
      title: 'Bridging the gap between crafts and couture',
      description:
        'Anar Patel, a passionate social worker and dedicated handloom supporter talks about her love for traditional art and craft .',
    },
    {
      id: 3,
      img: imgCrafts1,
      topTitle: 'World art community',
      title: 'World art community',
      description:
        'Craft, music or entrepreneurship, Gujaratis have been taking big strides across different fields. Simply Gujarati speaks to a few of those who have made the state proud of their achievements.',
    },
    {
      id: 4,
      img: imgCrafts1,
      topTitle: 'World Book of Records ',
      title: 'Craft roots exhibition at yashwant club in Indore',
      description:
        'Craft, music or entrepreneurship, Gujaratis have been taking big strides across different fields. Simply Gujarati speaks to a few of those who have made the state proud of their achievements.',
    },
    {
      id: 5,
      img: imgCrafts1,
      topTitle: 'The Indian Express',
      title: 'Back to the roots',
      description:
        'Anar Patel, a passionate social worker and dedicated handloom supporter talks about her love for traditional art and craft .',
    },
  ]
  return (
    <section className="section-padding">
      <div className="container">
        <Heading title={intl.formatMessage({ id: 'page.title.ourCrafts' })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-12">
          {pressData.map((item, index) => {
            return <PressListItem key={index} {...item} />
          })}
        </div>
        <div className="mt-8 md:mt-12 text-center">
          <Button
            border
            title={intl.formatMessage({ id: 'button.viewMore' })}
          />
        </div>
      </div>
    </section>
  )
}

export default Press
