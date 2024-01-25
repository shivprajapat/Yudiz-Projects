// @ts-check
const { Client } = require('@elastic/elasticsearch')
const config = require('../config')
const client = new Client({ node: config.DB_ELASTIC_SEARCH_NODE })
async function checkConnection () {
  try {
    const response = await client.ping()
    if (!response) {
      console.log('Elasticsearch cluster is not reachable')
    }
    console.log('Connected to Elasticsearch')
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error)
  }
}

async function addBulkDoc ({ indexName, documents }) {
  const body = []
  for (const document of documents) {
    body.push({ index: { _index: indexName } })
    body.push(document)
  }

  const response = await client.bulk({ body })
  return response
}

async function addDoc ({ indexName, document }) {
  const response = await client.index({
    index: indexName,
    document,
    id: document?._id?.toString()
  })
  return response
}

async function findDoc ({ search, totalResult = 20 }) {
  const response = await client.search({
    index: 'autosuggest_index',
    body: {
      _source: ['id', 'sName'],
      size: totalResult,
      query: {
        bool: {
          must: [
            {
              match: {
                eStatus: 'Y'
              }
            },
            {
              match: {
                sName: {
                  query: search,
                  fuzziness: 'AUTO',
                  operator: 'and'
                }
              }
            }
          ]
        }
      }
      // "query": {
      //     "bool": {
      //         "should": [
      //             {
      //                 "match": {
      //                     "sName": {
      //                         "query": search,
      //                         "fuzziness": "AUTO"
      //                     }
      //                 }
      //             },
      //             {
      //                 "wildcard": {
      //                     "sName": {
      //                         "value": `*${search}*`,
      //                         "boost": 0.5
      //                     }
      //                 }
      //             }
      //         ]
      //     }
      // }
    }
  })
  return response?.hits?.hits ?? {}
}

// async function deleteAllData (indexName) {
//     try {
//         await client.deleteByQuery({
//             index: indexName,
//             body: {
//                 query: {
//                     match_all: {},
//                 },
//             },
//         });
//     } catch (error) {
//         throw error
//     }
// }

checkConnection()
module.exports = { addBulkDoc, findDoc, addDoc }
