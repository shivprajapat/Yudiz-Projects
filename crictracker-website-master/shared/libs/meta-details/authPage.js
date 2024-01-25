const authPageMeta = ({ title, description, robots }) => {
  return {
    sTitle: title,
    sDescription: description,
    oFB: {
      sTitle: title,
      sDescription: description
    },
    oTwitter: {
      sTitle: title,
      sDescription: description
    },
    sRobots: robots || 'noindex, follow'
  }
}

export default authPageMeta
