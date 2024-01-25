import React from 'react'
import { useIntl } from 'react-intl'

import { Button, Heading } from '@/components/generic'
import { imgCrafts1, imgTanabana } from '@/assets/images'
import { CraftsListItem } from '@/components/CardList'
const OurCrafts = () => {
  const intl = useIntl()
  const craftsData = [
    {
      id: 1,
      img: imgCrafts1,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
    {
      id: 2,
      img: imgTanabana,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
    {
      id: 3,
      img: imgTanabana,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
    {
      id: 4,
      img: imgTanabana,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
    {
      id: 5,
      img: imgTanabana,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
    {
      id: 6,
      img: imgTanabana,
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description:
        'Lorem ipsum dolor sit amet consectetur. In vulputate at adipiscing sem malesuada. Dui convallis Ohio morbid mi ipsum est lacus.',
    },
  ]
  return (
    <section className="section-padding">
      <div className="container">
        <Heading title={intl.formatMessage({ id: 'page.title.ourCrafts' })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-6 gap-y-6 lg:gap-y-12">
          {craftsData.map((item, index) => {
            return <CraftsListItem key={index} {...item} />
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

export default OurCrafts
