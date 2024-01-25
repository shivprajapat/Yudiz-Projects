const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { catchError } = require('../../../helper/utilities.services')
const StudentCalcTest = require('../test/student.calc.test.model')
const StudentTest = require('../test/student.test.model')
const testDetailsModel = require('../test/test.detail.model')
const testModel = require('../test/test.model')

class DashboardService {
  async DashboardCount(req, res) {
    try {
      const assessmentTest = await StudentCalcTest.findOne({
        raw: true,
        where: { student_id: req.user.id },
        order: [
          ['id', 'DESC']
        ],
        attributes: ['id', 'custom_id', 'is_submitted']
      })
      if (!assessmentTest) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: [], message: messages[req.userLanguage].success.replace('##', 'data') })

      const totalTest = await testDetailsModel.count({ where: { is_active: 'y', deleted_at: null } })
      const totalCompletedTest = await StudentTest.count({ where: { student_calc_test_id: assessmentTest.id, is_submitted: 1, deleted_at: null } })
      const assessmentCompletedPercent = Math.round((totalCompletedTest * 100) / totalTest)
      assessmentTest.completed_percent = assessmentCompletedPercent

      const tests = await testModel.findAll({
        raw: true,
        where: { deleted_at: null, is_active: 'y' },
        order: [['id', 'ASC']],
        attributes: ['id', 'title']
      })
      const studentTestData = []
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i]
        const totalTestDetail = await testDetailsModel.count({ where: { is_active: 'y', deleted_at: null, test_id: test.id } })
        const totalCompletedTestDetail = await StudentTest.count({ where: { student_calc_test_id: assessmentTest.id, test_id: test.id, is_submitted: true } })
        test.completed_percent = Math.round((totalCompletedTestDetail * 100) / totalTestDetail)
        studentTestData.push(test)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: { assessmentTest, studentTestData }, message: messages[req.userLanguage].success.replace('##', 'data') })
    } catch (error) {
      console.log('errr: ', error)
      return catchError('DashboardService.count', error, req, res)
    }
  }
}
module.exports = new DashboardService()
