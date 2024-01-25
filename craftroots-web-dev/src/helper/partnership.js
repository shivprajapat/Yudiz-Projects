const mediaUrl = 'https://' + process.env.NEXT_PUBLIC_S3_MEDIA_URL

const PARTNERSHIP_DATA = {
  b2b: {
    id: 'b2b',
    title: 'B2B',
    img: mediaUrl + '/media/partnership/Background+before+text.jpg',
    cover: mediaUrl + '/media/partnership/Cover+Images.jpg',
    cataglogue: mediaUrl + '/media/partnership/B2B+Catalogue.pdf',
    description:
      'Unveiling our personalized B2B services designed to cater to diverse needs. Our portfolio highlights intricately curated designs that draw inspiration from age-old crafts, imbued with a touch of historical charm.',
    enquiry: { email: 'b2b@craftroots.com', phone: '9586557711' },
  },
  services: {
    id: 'services',
    title: 'Services',
    img: mediaUrl + '/media/partnership/Background+before+text\'.jpg',
    cover: mediaUrl + '/media/partnership/Cover+Image.JPG',
    cataglogue: mediaUrl + '/media/partnership/Services.pdf',
    description:
      'We offer tailored interior design and comprehensive turnkey project solutions for everyone. Our offering showcases intricately designed spaces that draw inspiration from time-honored crafts, seamlessly intertwined with the enchanting narratives of history.',
    enquiry: { email: 'b2b@craftroots.com', phone: '9586557711' },
  },
  'corporate-gifting': {
    id: 'corporate-gifting',
    title: 'Corporate Gifting',
    img: mediaUrl + '/media/partnership/Background+image+before+text.jpg',
    cover: mediaUrl + '/media/partnership/Cover+Image.jfif',
    cataglogue: mediaUrl + '/media/partnership/Corporate+Gifting+Catalogue.pdf',
    description:
      'We present a customized gifting handbook for all occasions throughout the year, featuring meticulously crafted gifts inspired by the natural world and infused with the magic of history.',
    enquiry: { email: 'b2b@craftroots.com', phone: '9586557711' },
  },
}
export default PARTNERSHIP_DATA
