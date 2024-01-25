/* eslint-disable camelcase */
const { Sequelize } = require('sequelize')
const sequelize = require('../../db_services/sqlConnect')
const { categories: CategoryModel, seo: SeoModel } = require('../models')
const async = require('async')
const axios = require('axios')

class Category {
  async dumpCategorySQLToMongo(req, res) {
    try {
      const { limit } = req.query

      const data = await sequelize.query('SELECT * FROM wp_terms wt JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id WHERE wtt.taxonomy="category" LIMIT :limit;', { raw: true, replacements: { limit: parseInt(limit) }, type: Sequelize.QueryTypes.SELECT })

      if (data?.length) {
        for (const c of data) {
          if (c.name) {
            const exist = await CategoryModel.findOne({ sName: c.name }).lean()
            if (!exist) {
              const params = {
                sName: c.name,
                nCount: c.count,
                sContent: c.description,
                eType: 's',
                eStatus: 'a'
              }

              const newCategory = await CategoryModel.create(params)
              const seoParams = { iId: newCategory._id, eType: 'ct', sSlug: c.slug }

              await SeoModel.create(seoParams)
            }
          }
        }
      }
      return res.send('category migration done')
    } catch (error) {
      return error
    }
  }

  async getCategorySeo(req, res) {
    try {
      const categorySeo = await SeoModel.find({ eType: 'ct', eStatus: 'a' }).lean()
      async.eachSeries(categorySeo, async (seo, cb) => {
        try {
          const { data: { json, status } } = await axios.get(`https://awesome.crictracker.com/wp-json/yoast/v1/get_head?url=https://awesome.crictracker.com/${seo?.sSlug}/`)
          if (status === 200) {
            const query = {
              sTitle: json?.title,
              sDescription: json?.description,
              sRobots: `${json?.robots?.follow.charAt(0).toUpperCase() + json?.robots?.follow.slice(1)}, ${json?.robots?.index.charAt(0).toUpperCase() + json?.robots?.index.slice(1)}`,
              sCUrl: json.canonical.split('/')[json.canonical.split('/').length - 2],
              oFB: {
                sTitle: json?.og_title,
                sDescription: json?.og_description
              },
              oTwitter: {
                sTitle: json?.og_title,
                sDescription: json?.og_description
              }
            }
            console.log({ sTitle: json?.title })
            await SeoModel.updateOne({ _id: seo._id }, query)
            Promise.resolve(cb)
          }
        } catch (err) {
          Promise.resolve(cb)
        }
      }, (err) => {
        if (err) console.log(err)
      })
      res.json({ message: 'done' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new Category()
