'use strict'
const { randomStr } = require('../helper/utilities.services')

module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE interest_synopsis', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }

    await queryInterface.bulkInsert('interest_synopsis', [{
      custom_id: randomStr(8, 'string'),
      test_detail_id: 10,
      sub_title: '<ul class="list-s"><li>Realistic</li><li>(Building)</li></ul>',
      core_values: '<ul><li>Practicality</li><li>Productivity</li><li>Structure</li><li>Independence</li><li>Physical Skill</li></ul>',
      personality_traits: '<ul><li>Realistic</li><li>Sensible</li><li>Mechanical</li><li>Traditional</li><li>Down-to-earth</li><li>Shy </li><li>Frank</li><li>Conforming</li><li>Honest</li><li>Persistent</li></ul>',
      job_tasks: '<ul ><li>Building</li><li>Repairing</li><li>Taking Action</li><li>Using Machines</li><li>Using Tools</li></ul>',
      occupations: 'Engineering, Gardening',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      test_detail_id: 11,
      sub_title: '<ul class="list-s"><li>Investigative</li><li>(Thinking)</li></ul>',
      core_values: '<ul><li>Discovery</li><li>Understanding</li><li>Logic</li><li>Independence</li><li>Intellect</li></ul>',
      personality_traits: '<ul><li>Intellectual</li><li>Curious</li><li>Logical</li><li>Analytical</li><li>Scholarly</li><li>Cautious</li><li>Precise</li><li>Modest</li><li>Rational</li></ul>',
      job_tasks: '<ul><li>Researching</li><li>Experimenting</li><li>Theorizing</li><li>Analyzing</li><li>Problem-Solving</li></ul>',
      occupations: 'Medicine, Pilot',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      test_detail_id: 12,
      sub_title: '<ul class="list-s"><li>Artistic</li><li>(Creating)</li></ul>',
      core_values: '<ul><li>Originality</li><li>Creativity</li><li>Freedom</li><li>Individuality</li><li>Flexibility</li></ul>',
      personality_traits: '<ul><li>Independent</li><li>Intuitive</li><li>Sensitive</li><li>Imaginative</li><li>Spontaneous</li><li>Creative</li><li>Open</li><li>Original</li></ul>',
      job_tasks: '<ul><li>Creating Art</li><li>Writing</li><li>Interpreting</li><li>Designing</li><li>Expressing Ideas</li></ul>',
      occupations: 'Architect, Editor',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      test_detail_id: 13,
      sub_title: '<ul class="list-s"><li>Social</li><li>(Helping)</li></ul>',
      core_values: '<ul><li>Cooperation</li><li>Service</li><li>Altruism</li><li>Connection</li><li>Empathy</li></ul>',
      personality_traits: '<ul><li>Compassionate</li><li>Patient</li><li>Helpful</li><li>Friendly</li><li>Generous</li><li>Tactful</li><li>Responsible</li></ul>',
      job_tasks: '<ul><li>Counseling</li><li>Assisting</li><li>Advising</li><li>Teaching</li><li>Providing Service</li></ul>',
      occupations: 'Teaching, Counselling',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      test_detail_id: 14,
      sub_title: '<ul class="list-s"><li>Enterprising</li><li>(Persuading)</li></ul>',
      core_values: '<ul><li>Influence</li><li>Leadership</li><li>Risk-Taking</li><li>Achievement</li><li>Initiative</li></ul>',
      personality_traits: '<ul><li>Assertive</li><li>Energetic</li><li>Confident</li><li>Ambitious</li><li>Adventurous</li><li>Sociable</li><li>Agreeable</li></ul>',
      job_tasks: '<ul><li>Managing</li><li>Deciding</li><li>Strategizing</li><li>Selling</li><li>Motivating</li></ul>',
      occupations: 'Business Management, Law',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      test_detail_id: 15,
      sub_title: '<ul class="list-s"><li>Conventional</li><li>(Organizing)</li></ul>',
      core_values: '<ul><li>Structure</li><li>Order</li><li>Clarity</li><li>Precision</li><li>Attention to Detail</li></ul>',
      personality_traits: '<ul><li>Orderly</li><li>Precise</li><li>Detail-Oriented</li><li>Conservative</li><li>Thorough</li><li>Obedient</li><li>Practical</li></ul>',
      job_tasks: '<ul><li>Filing</li><li>Calculating</li><li>Processing</li><li>Systematizing</li><li>Following Procedures</li></ul>',
      occupations: 'Accountancy, Fire inspector',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('interest_synopsis', null, {})
  }
}
