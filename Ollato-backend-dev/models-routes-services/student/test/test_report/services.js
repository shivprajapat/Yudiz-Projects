/*  eslint-disable */
const { messages, status, jsonStatus } = require('../../../../helper/api.responses')
const { catchError, randomStr } = require('../../../../helper/utilities.services')
const studentCalcTestDetailModel = require('../student.calc.test.detail.model') 
const studentCalcTestModel = require('../student.calc.test.model')
const careerDetailModel = require('../../../admin/career-profile/career-profile-detail.model')
const studentCalcResultModel = require('../student.test.result.model')
const studentCalcTestNormModel = require('../student.calc.test.norm.model')
const studentModel = require('../../auth/student.model')
const gradeModel = require('../../../admin/grade/grade.model')
const studentDetailsModel = require('../../auth/student_details.model')
const testNormDesModel = require('../../../admin/test-norm-description/test-norm-desc.model')
const careerProfileModel = require('../../../admin/career-profile/career-profile.model')
const TestDetailModel = require('../test.detail.model')
const InterestSynopsisModel = require('../interest.synopsis.model')
const studentPackageModel = require('../../package/student.packages.model')
const centerModel = require('../../../center/Auth/center.model')
const packageModel = require('../../../admin/package/package.model')
const CenterRevenueModel = require('../../../center/revenue/center_revenue.model')
const { Sequelize, sequelize} = require('../../../../database/sequelize')
const pdfGenerator = require('../../../../helper/generateTestReport')
const { Op } = require('sequelize')
const { sendMailReportPdf } = require('../../../../helper/email.service')
const config = require('../../../../config/config-file')
const { putObj } =require('../../../../helper/s3config')  
const fs = require('fs')

class StudentTestReportService {

  async getTestReport(req, res) {
    try {
      const { studentTestCustomId } = req.params
      const validStudentTest = await studentCalcTestModel.findOne({where : {custom_id : studentTestCustomId} })
      if (!validStudentTest) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_test  })

      const gotReportPath = validStudentTest.getDataValue('report_path')
      if(gotReportPath) {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: { 'report_path': gotReportPath } })
      }

      let studentDetails = await studentModel.findAll({ where:{ id : validStudentTest.getDataValue('student_id')},
        include:[{
          model: studentDetailsModel,
          as : 'studentDetails',
          attributes:[],
          include : [{ model: gradeModel, as : 'grades', attributes:[] }]
        }],
        attributes:[[Sequelize.col('studentDetails.grades.title'), 'grade'],'user_name','first_name','last_name','email', 'id', 'center_id', 'counselor_id']
      })
      studentDetails = studentDetails.map((ele) => ele.get({ plain: true }));
      studentDetails = studentDetails[0]

      const studentPackage = await studentPackageModel.findOne({ raw: true, 
        where: { 
          [Op.and]: [
            { id: validStudentTest.student_package_id },
            { videoCall: false },
            { f2fCall: false },
            { center_id: { [Op.ne]: null } }
          ]
        } 
      })
      if (studentPackage) {
          const centerDetails = await centerModel.findOne({ raw: true, where: { id: studentPackage.center_id } })
          const packageDetails = await packageModel.findOne({ raw: true, where: { id: studentPackage.package_id } })
   
          const commissionAmount = packageDetails.amount * (centerDetails.commission / 100)
          const total_amount = centerDetails.total_amount + commissionAmount
          const remaining_amount = centerDetails.remaining_amount + commissionAmount
          let transaction
          try {
            transaction = await sequelize.transaction()

            await centerModel.update({ total_amount, remaining_amount }, { where: { id: centerDetails.id } }, { transaction })
            const sCustomId = randomStr(8, 'string')
            await CenterRevenueModel.create({ custom_id: sCustomId, center_id: centerDetails.id, student_id: studentPackage.student_id, package_id: packageDetails.id, amount: commissionAmount }, { transaction })
          
            await transaction.commit()
          } catch (error) {
            if (transaction) await transaction.rollback()
            return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
          }
      }
      // Interest test details
      let interestTestDetails = await studentCalcTestDetailModel.findAll({ 
        where : { student_calc_test_id: validStudentTest.getDataValue('id') },
        include:[{
          model:TestDetailModel,
          as:'testDetails',
          attributes:[]
        }], 
          attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores', 'score_round', 'rank' ],
          order: [
            ['test_detail_id', 'ASC'],
        ],
      })
      interestTestDetails = interestTestDetails.map((ele) => ele.get({ plain: true }));

      /*
      * interestGraphLabel :--> array of test details
      * interestGraphvalue :--> array of rank
      * interestDominantValue :--> obejct of rank and test details
      */
      const interestGraphLabel = []
      const interestGraphValue = []


      for (let index = 0; index < interestTestDetails.length; index++) {
    
        let score = interestTestDetails[index].score_round
        if(score < 0) {
          score = 0
        }
        let testId = interestTestDetails[index].test_detail_id
        let norm
        if(score >= 7 ) norm = 'H'
        else if(score >= 4 && score < 7) norm = 'A'
        else norm = 'L'
        
        const getTestDescription = await testNormDesModel.findOne({
            where : { test_detail_id : testId , norm},
            attributes:['description']
        })
        interestTestDetails[index].description = getTestDescription.getDataValue('description')
        interestGraphLabel.push(interestTestDetails[index].test_detail_name)
        interestGraphValue.push(score)
      }
    
      let interestTestDominateDetails = await studentCalcTestDetailModel.findAll({ 
        where : { student_calc_test_id: validStudentTest.getDataValue('id') },
        include:[{
          model:TestDetailModel,
          as:'testDetails',
          attributes: []
        }],
        attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores', 'score_round', 'rank', 'converted_score'],
        order: [
          ['rank', 'ASC'],
          ['converted_score', 'DESC'],
        ],
        limit : 3
      })

      const interestDominantValue = await interestTestDominateDetails.map((result) => result.getDataValue('test_detail_name'))
      const interestDominantTestDetailId = await interestTestDominateDetails.map((result) => result.getDataValue('test_detail_id'))
      
      
      let interestSynopsisData = []
      for (let i = 0; i < interestDominantTestDetailId.length; i++){
        const synopsisData =  await InterestSynopsisModel.findOne({
          raw: true,
          where: {
            test_detail_id: interestDominantTestDetailId[i]
          }
        })
        if (synopsisData) {
          interestSynopsisData.push(synopsisData)
        }
      }

      // Aptitude test details
      let aptitudeTestDetails = await studentCalcTestNormModel.findAll({ where : { student_calc_test_id: validStudentTest.getDataValue('id') }, include:[{
            model:TestDetailModel,
            as:'testDetails',
            attributes:[]
          }],
          attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','norms_code','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores','score_round', [Sequelize.col('testDetails.synopsis'), 'synopsis'] ],
          order: [
            ['test_detail_id', 'ASC'],
        ],
      })
      aptitudeTestDetails = aptitudeTestDetails.map((ele) => ele.get({ plain: true }));
      /*
      * aptituteGraphLabel :--> array of test details
      * aptituteGraphValue :--> array of rank
      * aptituteDominantValue :--> obejct of rank and test details
      */
      const aptituteGraphLabel = []
      const aptituteGraphValue = []
      const wellDoneArray = []
      const goodArray = []
      const workOnArray = []

  
      for (let index = 0; index < aptitudeTestDetails.length; index++) {
    
        let score = aptitudeTestDetails[index].score_round
        if(score < 0) {
          score = 0
        }
        let testId = aptitudeTestDetails[index].test_detail_id
        let norm =  aptitudeTestDetails[index].norms_code
        if(score >= 7 ) norm = 'H'
        else if(score >= 4 && score < 7) norm = 'A'
        else norm = 'L'
        
        const getTestDescription = await testNormDesModel.findOne({where : { test_detail_id : testId , norm},attributes:['description','plan_of_action']})
        aptitudeTestDetails[index].description = getTestDescription.getDataValue('description')
        aptitudeTestDetails[index].plan = getTestDescription.getDataValue('plan_of_action').split('/')
        aptitudeTestDetails[index].plan_of_action = getTestDescription.getDataValue('plan_of_action')
        aptituteGraphLabel.push(aptitudeTestDetails[index].test_detail_name)
        aptituteGraphValue.push(score)
        if(aptitudeTestDetails[index].norms_code == 'H') wellDoneArray.push({ test_detail_name: aptitudeTestDetails[index].test_detail_name, synopsis: aptitudeTestDetails[index].synopsis})
        if(aptitudeTestDetails[index].norms_code == 'A') goodArray.push({ test_detail_name: aptitudeTestDetails[index].test_detail_name, synopsis: aptitudeTestDetails[index].synopsis})
        if(aptitudeTestDetails[index].norms_code == 'L') workOnArray.push({ test_detail_name: aptitudeTestDetails[index].test_detail_name, synopsis: aptitudeTestDetails[index].synopsis})
      }
        // conclusions data 
      const gotStudentTestResult = await studentCalcResultModel.findAll({ 
        raw:true,
        where : { student_calc_test_id : validStudentTest.getDataValue('id')},
        include:[{
          model:careerDetailModel,
          as:'careerProfileDetail',
          attributes:[]
        }],
        attributes: [
          [Sequelize.col('careerProfileDetail.profile_type_det'), 'career_profile_detail_name'],
          [Sequelize.col('careerProfileDetail.career_profile_id'), 'career_profile_id'],
          'career_profile_detail_id'
        ]
      })
      const careerProfileIds = await gotStudentTestResult.map( result => result.career_profile_id)
      /** Get Career Profile */
      const careerProfiles = await careerProfileModel.findAll({
        raw: true,
        where: {
          id: {
            [Op.in]: careerProfileIds
          }
        }
      })
      
      const pdf = await pdfGenerator({'user': studentDetails,date: validStudentTest.getDataValue('submission_Time'),interestGraphLabel,interestGraphValue,interestDominantValue,'interest':interestTestDetails,'aptitude' : aptitudeTestDetails,aptituteGraphLabel,aptituteGraphValue,wellDoneArray,goodArray,workOnArray, gotStudentTestResult, interestSynopsisData, careerProfiles}) 
      await studentCalcTestModel.update({ report_path: pdf.fileRelativePath }, { where: {custom_id : studentTestCustomId} })
      
      // email report pdf
      const fileNm = pdf.fileNm
      const filePath = path.resolve(__dirname, `../../../../public/uploads/reports/${fileNm}`)
      const studentName = studentDetails.first_name.concat(' ', studentDetails.last_name)
      if (studentDetails.email) {
        const resp = await sendMailReportPdf(filePath, fileNm, studentDetails.email, studentName)
        if (resp === undefined) throw Error()
      } else {
        const resp = await sendMailReportPdf(filePath, fileNm, config.RECEIVER_EMAIL, studentName)
        if (resp === undefined) throw Error()
      }
      
      try{
        const data = await putObj(fileNm,'application/pdf',filePath)
        if(data.ETag) {
          fs.unlinkSync(filePath)
        }
      }catch(error){
        throw Error(error)
      }
      
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: { 'report_path': pdf.fileRelativePath } })
    } catch (error) {
      console.log({error})
      return await catchError('StudentTestReportService.getTestReport', error, req, res)
    } 
  }
  
  async getTestReportBK(req, res) {
    try {
      const { studentTestCustomId } = req.params
      const validStudentTest = await studentCalcTestModel.findOne({where : {custom_id : studentTestCustomId} })
      let studentDetails = await studentModel.findAll({ where:{ id : validStudentTest.getDataValue('student_id')},
      include:[{
        model: studentDetailsModel,
        as : 'studentDetails',
        attributes:[],
        include : [{ model: gradeModel, as : 'grades', attributes:[] }]
      }],
      attributes:[[Sequelize.col('studentDetails.grades.title'), 'grade'],'user_name','first_name','last_name','email']
    })
      studentDetails = studentDetails.map((ele) => ele.get({ plain: true }));
      studentDetails = studentDetails[0]
    

      // Interest test details
      let interestTestDetails = await studentCalcTestDetailModel.findAll({ where : { student_calc_test_id: validStudentTest.getDataValue('id') }, include:[{
        model:TestDetailModel,
        as:'testDetails',
        attributes:[]
      }], 
      attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores', 'rank' ],
      order: [
        ['test_detail_id', 'ASC'],
    ],
    })
    interestTestDetails = interestTestDetails.map((ele) => ele.get({ plain: true }));

    /*
     * interestGraphLabel :--> array of test details
     * interestGraphvalue :--> array of rank
     * interestDominantValue :--> obejct of rank and test details
     */
    const interestGraphLabel = []
    const interestGraphValue = []


    for (let index = 0; index < interestTestDetails.length; index++) {
  
      let score = interestTestDetails[index].sten_scores
      let testId = interestTestDetails[index].test_detail_id
      let norm
      if(score >= 7 ) norm = 'H'
      else if(score >= 4 && score < 7) norm = 'A'
      else norm = 'L'
      
      const getTestDescription = await testNormDesModel.findOne({where : { test_detail_id : testId , norm},attributes:['description']
    })
    interestTestDetails[index].description = getTestDescription.getDataValue('description')
    interestGraphLabel.push(interestTestDetails[index].test_detail_name)
    interestGraphValue.push(score)
    }
    
    let interestTestDominateDetails = await studentCalcTestDetailModel.findAll({ 
      where : { student_calc_test_id: validStudentTest.getDataValue('id') },
      include:[{
        model:TestDetailModel,
        as:'testDetails',
        attributes:[]
      }],
      attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores', 'rank', 'converted_score'],
      order: [
        ['rank', 'ASC'],
        ['converted_score', 'DESC'],
      ],
      limit : 3
    })

const interestDominantValue = await interestTestDominateDetails.map((result) => result.getDataValue('test_detail_name'))

    // Aptitude test details
    let aptitudeTestDetails = await studentCalcTestNormModel.findAll({ where : { student_calc_test_id: validStudentTest.getDataValue('id') }, include:[{
        model:TestDetailModel,
        as:'testDetails',
        attributes:[]
      }],
      attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','norms_code','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores' ],
      order: [
        ['test_detail_id', 'ASC'],
    ],
  })
  aptitudeTestDetails = aptitudeTestDetails.map((ele) => ele.get({ plain: true }));
      /*
     * aptituteGraphLabel :--> array of test details
     * aptituteGraphValue :--> array of rank
     * aptituteDominantValue :--> obejct of rank and test details
     */
      const aptituteGraphLabel = []
      const aptituteGraphValue = []
      const wellDoneArray = []
      const goodArray = []
      const workOnArray = []

  
      for (let index = 0; index < aptitudeTestDetails.length; index++) {
    
        let score = aptitudeTestDetails[index].sten_scores
        let testId = aptitudeTestDetails[index].test_detail_id
        let norm =  aptitudeTestDetails[index].norms_code
        if(score >= 7 ) norm = 'H'
        else if(score >= 4 && score < 7) norm = 'A'
        else norm = 'L'
        
        const getTestDescription = await testNormDesModel.findOne({where : { test_detail_id : testId , norm},attributes:['description','plan_of_action']})
        aptitudeTestDetails[index].description = getTestDescription.getDataValue('description')
        aptitudeTestDetails[index].plan = getTestDescription.getDataValue('plan_of_action').split('/')
        aptituteGraphLabel.push(aptitudeTestDetails[index].test_detail_name)
        aptituteGraphValue.push(score)
        if(aptitudeTestDetails[index].norms_code == 'H') wellDoneArray.push(aptitudeTestDetails[index].test_detail_name)
        if(aptitudeTestDetails[index].norms_code == 'A') goodArray.push(aptitudeTestDetails[index].test_detail_name)
        if(aptitudeTestDetails[index].norms_code == 'L') workOnArray.push(aptitudeTestDetails[index].test_detail_name)
      }
      // conclusions data 
      const gotStudentTestResult = await studentCalcResultModel.findAll({ raw:true, where : { student_calc_test_id : validStudentTest.getDataValue('id')},include:[{
        model:careerDetailModel,
        as:'careerProfileDetail',
        attributes:[]
      }],
      attributes: [[Sequelize.col('careerProfileDetail.profile_type_det'), 'career_profile_detail_name']]
    })
      const gotReportPath = validStudentTest.getDataValue('report_path')
      if (!gotReportPath) {
              // generate test report function
        const pdf = await pdfGenerator({'user': studentDetails,date: validStudentTest.getDataValue('submission_Time'),interestGraphLabel,interestGraphValue,interestDominantValue,'interest':interestTestDetails,'aptitude' : aptitudeTestDetails,aptituteGraphLabel,aptituteGraphValue,wellDoneArray,goodArray,workOnArray, gotStudentTestResult}) 
        const logged = await studentCalcTestModel.update({ report_path: pdf.imagePath }, { where: {custom_id : studentTestCustomId} })
        res.set('Content-Type', 'application/pdf')
        res.download(pdf.imagePath)
      } else {
        res.set('Content-Type', 'application/pdf')
        res.download(gotReportPath)
      }
    } catch (error) {
      return await catchError('testService.getTestReport', error, req, res)
    } 
  }
}

module.exports = new StudentTestReportService()
