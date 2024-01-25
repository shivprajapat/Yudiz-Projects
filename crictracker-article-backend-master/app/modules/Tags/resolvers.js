const { addTag, editTag, updateTagStatus, deleteTag, getTags, getTagById, bulkTagUpdate, getTagCounts, resolveTag, updateOtherTags, getTagByIdFront, getTagArticlesFront } = require('./controllers')

const Mutation = {
  addTag,
  editTag,
  updateTagStatus,
  deleteTag,
  bulkTagUpdate,
  updateOtherTags
}

const Query = {
  getTags,
  getTagById,
  getTagCounts,
  getTagByIdFront,
  getTagArticlesFront
}

const tagGetData = {
  oSeo: (tag) => {
    if (['p', 't', 'v'].includes(tag.eType)) return { __typename: 'Seo', iId: tag.iId }
    return { __typename: 'Seo', iId: tag._id }
  }
}

const tagData = {
  oSeo: (tag) => {
    if (['p', 't', 'v'].includes(tag.eType)) return { __typename: 'Seo', iId: tag.iId }
    else return { __typename: 'Seo', iId: tag._id }
  },
  oSubAdmin: (tag) => {
    return { __typename: 'subAdmin', _id: tag.iSubmittedBy }
  },
  __resolveReference: (reference) => {
    return resolveTag(reference._id)
  }
}

const oTagDataFront = {
  oSeo: (tag) => {
    if (['p', 't', 'v'].includes(tag.eType)) return { __typename: 'Seo', iId: tag.iId }
    else return { __typename: 'Seo', iId: tag._id }
  }
}

const oEditTagData = {
  oSeo: (tag) => {
    if (['p', 't', 'v'].includes(tag.eType)) return { __typename: 'Seo', iId: tag.iId }
    else return { __typename: 'Seo', iId: tag._id }
  },
  oTeam: (tag) => {
    if (tag.eType === 't') return { __typename: 'oShortTeam', _id: tag.iId }
  },
  oPlayer: (tag) => {
    if (tag.eType === 'p') return { __typename: 'oShortPlayer', _id: tag.iId }
  },
  oVenue: (tag) => {
    if (tag.eType === 'v') return { __typename: 'oShortVenue', _id: tag.iId }
  }
}

const resolvers = { Mutation, Query, tagGetData, tagData, oTagDataFront, oEditTagData }

module.exports = resolvers
