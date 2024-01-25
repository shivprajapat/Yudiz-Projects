// /* eslint-disable camelcase */

// const Sequelize = require('sequelize')
// const sequelize = require('../../../db_services/sqlConnect')

// class wpPosts extends Sequelize.Model { }

// wpPosts.init({
//   post_author: {
//     type: Sequelize.BIGINT
//   },
//   post_date: {
//     type: Sequelize.DATE
//   },
//   post_date_gmt: {
//     type: Sequelize.DATE
//   },
//   post_content: {
//     type: Sequelize.TEXT
//   },
//   post_title: {
//     type: Sequelize.TEXT
//   },
//   post_excerpt: {
//     type: Sequelize.TEXT
//   },
//   post_status: {
//     type: Sequelize.STRING
//   },
//   comment_status: {
//     type: Sequelize.STRING
//   },
//   ping_status: {
//     type: Sequelize.STRING
//   },
//   post_password: {
//     type: Sequelize.STRING
//   },
//   post_name: {
//     type: Sequelize.STRING
//   },
//   to_ping: {
//     type: Sequelize.TEXT
//   },
//   pinged: {
//     type: Sequelize.TEXT
//   },
//   post_modified: {
//     type: Sequelize.DATE
//   },
//   post_modified_gmt: {
//     type: Sequelize.DATE
//   },
//   post_content_filtered: {
//     type: Sequelize.TEXT
//   },
//   post_parent: {
//     type: Sequelize.BIGINT
//   },
//   guid: {
//     type: Sequelize.STRING
//   },
//   menu_order: {
//     type: Sequelize.INTEGER
//   },
//   post_type: {
//     type: Sequelize.STRING
//   },
//   post_mime_type: {
//     type: Sequelize.STRING
//   },
//   comment_count: {
//     type: Sequelize.BIGINT
//   }
// }, {
//   sequelize,
//   modelName: 'wp_posts',
//   tableName: 'wp_posts',
//   createdAt: 'post_date',
//   underscore: true,
//   timestamps: false
// })

// // posts.sync()

// module.exports = wpPosts
