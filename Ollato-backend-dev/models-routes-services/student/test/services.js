/*  eslint-disable */
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { removenull, catchError, getUniqueString, handleCatchError } = require('../../../helper/utilities.services')
const { sequelize } = require('../../../database/sequelize')
const { Op, Sequelize } = require('sequelize')
const testTimeModel = require('./test.time.norms.model')
const packageModel = require('../../admin/package/package.model')
const testModel = require('./test.model')
const testDetailsModel = require('./test.detail.model')
const questionModel = require('./questions.model')
const quesAnsModel = require('./questions.ans.model')
const StudentDetail = require('../auth/student_details.model')
const StudentModel = require('../auth/student.model')
const studentPackagesModel = require('../package/student.packages.model')
const StudentTest = require('./student.test.model')
const StudentTestAns = require('./student.test.ans.model')
const StudentCalcTest = require('./student.calc.test.model')
const StudentCalcTestDetail = require('./student.calc.test.detail.model')
const StudentCalcTestNorm = require('./student.calc.test.norm.model')
const NormGrade = require('./norm.grade.model')
const Norm = require('../../admin/norms/norms.model')
const TestDetail = require('./test.detail.model')
const StudentInterestTest = require('./student.interest.test.model')
const Rezorpay = require('razorpay')
const shortId = require('shortid')
const { softwarMatrixCheck } = require('./software.matrix.check')
const softwarMatrixModel = require('../../admin/software_matrix/software.matrix.model')
const softwarMatrixDetailModel = require('../../admin/software_matrix/software.matrix.details.model')
const StudentTestResult = require('./student.test.result.model')
const StudentTestSoftwareMatrix = require('./student.test.software.matrix.model')
const careerProfileModel = require('../../admin/career-profile/career-profile.model')
const studentCalcResultModel = require('./student.test.result.model')
const careerDetailModel = require('../../admin/career-profile/career-profile-detail.model')
const { sendMailFinishTest } = require('../../../helper/email.service')
const StudentPackages = require('../package/student.packages.model')
const centerModel = require('../../center/Auth/center.model')
const CenterRevenueModel = require('../../center/revenue/center_revenue.model')
const testNormDesModel = require('../../admin/test-norm-description/test-norm-desc.model')
const InterestSynopsisModel = require('./interest.synopsis.model')
const config = require('../../../config/config-file')
const gradeModel = require('../../admin/grade/grade.model')
const pdfGenerator = require('../../../helper/generateTestReport')
const ReportGenerationModel = require('./test_report/report.generation.model') 
const { sendMailReportPdf } = require('../../../helper/email.service')
const path = require('path')
const { putObj } = require('../../../helper/s3config')
const fs = require('fs')

class StudentService {
  async getAllTestwithSubcategory(req, res) {
    try {
      const existPackage = await getStudentPackage(req.user.id)
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const studentDetail = await StudentDetail.findOne({raw: true, where: { student_id: req.user.id }})
      if(!studentDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      
      const { grade_id } = studentDetail
      
      const query = {
        where: { deleted_at : null, is_active: 'y'}
      }
      const includes = [{
        required:false,
        model: testTimeModel,
        as:'test_time',
        where: { grade_id, is_active: 'y', deleted_at : null },
        attributes : ['grade_id','time_Sec']
      }]

      let studentCalcTest = await StudentCalcTest.findOne({
        raw: true, 
        where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: 0, deleted_at: null }, 
        order: [
          ['id', 'ASC']
        ]
      })
      if (studentCalcTest) {
        includes.push({
          required:false,
          model: StudentTest,
          as:'studentTests',
          where: { student_calc_test_id: studentCalcTest.id, is_submitted: true, deleted_at : null },
          attributes : ['test_id','test_detail_id']
        })
      }else{
        includes.push({
          required:false,
          model: StudentTest,
          as:'studentTests',
          where: { student_calc_test_id: null, is_submitted: true, deleted_at : null },
          attributes : ['test_id','test_detail_id']
        })
      }
      query.include = [
        {
          model: testDetailsModel,
          as: 'test_details',
          include: includes ,
          where: { is_active: 'y', deleted_at : null },
          attributes:['id','title', 'no_of_questions', 'description', 'meaning','sort_order']
        },
        {
          model: StudentInterestTest,
          required: false,
          as: 'studentInterestTest',
          where: { student_id: req.user.id, grade_id, student_package_id: existPackage.id, is_submitted: true, deleted_at : null },
          attributes:['id','test_id']
        }
      ]

      query.order =  [
        ['sort_order', 'ASC'],
        ['test_details','sort_order', 'ASC']
      ]

      query.attributes = ['id','title', 'description'] 
      const tests = await testModel.findAll(query)
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: tests })
    } catch (error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
  }

  async getAllCompletedTest(req, res) {
    try {
      const existPackage = await getStudentPackage(req.user.id)
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const gotAllTest = await StudentCalcTest.findAll({where : {student_id: req.user.id} })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: gotAllTest })
    } catch (error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
  }

  async getAllInterestTest(req, res) {
    try {
      const existPackage = await getStudentPackage(req.user.id)
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const studentDetail = await StudentDetail.findOne({raw: true, where: { student_id: req.user.id }})
      if(!studentDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      
      const { grade_id } = studentDetail

      const { testId } = req.body

      const exitStudentTest = await StudentInterestTest.findOne({raw: true, where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: 1, deleted_at: null }})
      if(exitStudentTest) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].test_already_given  })


      const gotTestDetails = await testDetailsModel.findAll({raw: true, where: { test_id: testId, is_active: 'y', deleted_at : null }})     
      
      const gotTestDetailsId = await gotTestDetails.map((gotData) => gotData.id )
      
      const allQuestions = await questionModel.findAll({where: {test_detail_id:{ [Op.in] : gotTestDetailsId }, deleted_at : null, is_active: 'y'},
        include : [{
          model : quesAnsModel,
          as : 'options',
          require :false,
          where: {deleted_at:null},
          attributes: { exclude: ['is_correct_ans', 'is_active','deleted_at','created_by','updated_by','created_at','updated_at']}
        }],
        order: [
          ['sort_order', 'ASC'],
          ['options', 'sort_order', 'ASC']
        ],
        attributes: { exclude: ['deleted_at', 'is_active','created_by','updated_by','created_at','updated_at']}
      })
     return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: {'questions': allQuestions } })
    } catch (error) {
      return await catchError('testService.getAllInterestTestQuestions', error, req, res)
    }
  }
  
  async getAllInterestTestQuestions(req, res) {
    try {
      const existPackage = await getStudentPackage(req.user.id)
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const studentDetail = await StudentDetail.findOne({raw: true, where: { student_id: req.user.id }})
      if(!studentDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      
      const { grade_id } = studentDetail

      let { testId } = req.body
      if(testId != 2) testId = 2 //for interest test we need to check test id 2

      const exitStudentTest = await StudentInterestTest.findOne({raw: true, where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: 1, deleted_at: null }})
      if(exitStudentTest) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].test_already_given  })

      /** Add student test */
      // Check student calc test available for not
      let studentCalcTestId = ''
      let studentCalcTest = await StudentCalcTest.findOne({
        raw: true, 
        where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: 0, deleted_at: null },
        order: [
          ['id', 'ASC']
        ]
      })
      if (studentCalcTest) {
        studentCalcTestId = studentCalcTest.id
      }else {
        const studentCalcTestObj = {
            custom_id: await getUniqueString(8, StudentCalcTest),
            student_id: req.user.id,
            grade_id,
            package_id: existPackage.package_id,
            student_package_id: existPackage.id
        }
        const createdStudentCalcTest = await StudentCalcTest.create(studentCalcTestObj)
        studentCalcTestId = createdStudentCalcTest.id
      }

      /** Add student interest test data */
      let studentInterestTestId = 0
      const studentInterestTestObj = {
        custom_id: await getUniqueString(8, StudentCalcTest),
        test_id: testId,
        student_id: req.user.id,
        grade_id,
        package_id: existPackage.package_id,
        student_package_id: existPackage.id,
        student_calc_test_id: studentCalcTestId
      }
      const createdStudentInterestTest = await StudentInterestTest.create(studentInterestTestObj)
      studentInterestTestId = createdStudentInterestTest.id

      const gotTestDetails = await testDetailsModel.findAll({raw: true, where: { test_id: testId, is_active: 'y', deleted_at : null }})
      for ( let i = 0; i < gotTestDetails.length; i++ ) {
        let testDetail = gotTestDetails[i]
        /** get test questions */
        const questions = await questionModel.findAll({where: {test_detail_id: testDetail.id, deleted_at : null, is_active: 'y'},
          include : [{
            model : quesAnsModel,
            as : 'options',
            require :false,
            where: {deleted_at:null},
            attributes: { exclude: ['is_correct_ans', 'is_active','deleted_at','created_by','updated_by','created_at','updated_at']}
          }],
          order: [
            ['sort_order', 'ASC'],
            ['options', 'sort_order', 'ASC']
          ],
          limit: testDetail.no_of_questions,
          attributes: { exclude: ['deleted_at', 'is_active','created_by','updated_by','created_at','updated_at']}
        })
        const questionsIds = questions.map((result) => result.id);

        const studentTestObj = {
          custom_id: await getUniqueString(8, StudentTest),
          student_calc_test_id: studentCalcTestId,
          student_id: req.user.id,
          grade_id,
          test_id: testDetail.test_id,
          test_detail_id: testDetail.id,
          package_id: existPackage.package_id,
          student_package_id: existPackage.id,
          questions: questionsIds,
          student_interest_test_id: studentInterestTestId
        }
        const createdStudentTest = await StudentTest.create(studentTestObj)
      }
      
      const gotTestDetailsId = await gotTestDetails.map((gotData) => gotData.id )
      
      const allQuestions = await questionModel.findAll({where: {test_detail_id:{ [Op.in] : gotTestDetailsId }, deleted_at : null, is_active: 'y'},
        include : [{
          model : quesAnsModel,
          as : 'options',
          require :false,
          where: {deleted_at:null},
          attributes: { exclude: ['is_correct_ans', 'is_active','deleted_at','created_by','updated_by','created_at','updated_at']}
        }],
        order: [
          ['sort_order', 'ASC'],
          ['options', 'sort_order', 'ASC']
        ],
        attributes: { exclude: ['deleted_at', 'is_active','created_by','updated_by','created_at','updated_at']}
      })
      const allQuestionsIds = allQuestions.map((result) => result.id);
      await StudentInterestTest.update({ questions: allQuestionsIds }, { where: { id: studentInterestTestId } })
     return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: {'questions': allQuestions, 'student_test': {'id': studentInterestTestId, 'test_type': 'interest'} } })
    } catch (error) {
      return await catchError('testService.getAllInterestTestQuestions', error, req, res)
    }
  }

  async getAllQuestions(req, res) {
    try {
      // check student package
      let existPackage = await getStudentPackage(req.user.id)
      if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      removenull(req.body)
      const { id } = req.body
      if (!id) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'id') }) 
      // check student already given test or not
      const exitStudentTest = await StudentTest.findOne({raw: true, where: { student_id: req.user.id, student_package_id: existPackage.id, test_detail_id: id, is_submitted: 1, deleted_at: null }})
      if(exitStudentTest) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].test_already_given  })
      const studentDetail = await StudentDetail.findOne({raw: true, where: { student_id: req.user.id }})
      if(!studentDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Student') })
      
      const { grade_id } = studentDetail

      let testDetail = await testDetailsModel.findOne({
        raw: true,
        include: {
          required:false,
          model: testTimeModel,
          as:'test_time',
          where: { grade_id, is_active: 'y', deleted_at : null },
          attributes : []
        },
        where: { id: id, deleted_at : null, is_active: 'y'},
        attributes : { 
          exclude : ['deleted_at', 'is_active','created_by','updated_by','created_at','updated_at', ],
          include:[ [Sequelize.col('test_time.time_Sec'), 'time_Sec'] ]
        }
      })
      if (testDetail) {
        // get submitted test ids
        const submittedTests = await StudentTest.findAll({raw: true, where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: true } })
        const submittedTestIds = submittedTests.map((results) => results.test_detail_id )

        const remainingTest = await testDetailsModel.findAll({ raw: true, where: { sort_order : { [Op.lt] : testDetail.sort_order }, test_id: testDetail.test_id  } })
        const remainingTestIds = remainingTest.map((results) => results.id )
        const remainTestArray = remainingTestIds.filter(d => !submittedTestIds.includes(d))

        if(remainTestArray.length){
          return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].previous_test_remaining })
        }
        /** Add student test */
        // Check student calc test available for not
        let studentCalcTestId = ''
        let studentCalcTest = await StudentCalcTest.findOne({
          raw: true, 
          where: { student_id: req.user.id, student_package_id: existPackage.id, is_submitted: 0, deleted_at: null },
          order: [
            ['id', 'ASC']
          ]
        })
        if (studentCalcTest) {
          studentCalcTestId = studentCalcTest.id
        }else {
          const studentCalcTestObj = {
              custom_id: await getUniqueString(8, StudentCalcTest),
              student_id: req.user.id,
              grade_id,
              package_id: existPackage.package_id,
              student_package_id: existPackage.id
          }
          const createdStudentCalcTest = await StudentCalcTest.create(studentCalcTestObj)
          studentCalcTestId = createdStudentCalcTest.id
        }

        /** get test questions */
        const questions = await questionModel.findAll({where: {test_detail_id: id, deleted_at : null, is_active: 'y'},
          include : [{
            model : quesAnsModel,
            as : 'options',
            require :false,
            where: {deleted_at:null},
            attributes: { exclude: ['is_correct_ans', 'is_active','deleted_at','created_by','updated_by','created_at','updated_at']}
          }],
          order: [
            ['sort_order', 'ASC'],
            ['options', 'sort_order', 'ASC']
          ],
          limit: testDetail.no_of_questions,
          attributes: { exclude: ['deleted_at', 'is_active','created_by','updated_by','created_at','updated_at']}
        })
        const questionsIds = questions.map((result) => result.id);

        const studentTestObj = {
          custom_id: await getUniqueString(8, StudentTest),
          student_calc_test_id: studentCalcTestId,
          student_id: req.user.id,
          grade_id,
          test_id: testDetail.test_id,
          test_detail_id: testDetail.id,
          package_id: existPackage.package_id,
          student_package_id: existPackage.id,
          questions: questionsIds
        }
        const createdStudentTest = await StudentTest.create(studentTestObj)
        const newTestData = {
          id: createdStudentTest.id,
          custom_id: createdStudentTest.custom_id
        }
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: {testDetail, questions, 'student_test': newTestData} })
      }
      return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
    } catch (error) {
      console.error(error,"error")
      return await catchError('testService.getAllQuestions', error, req, res)
    }
  }
  async getMainTestCompletedDetail(req, res) {
    try {
      removenull(req.body)
      const getStudentTests = await StudentCalcTest.findAll({
        include: [{
          required:false,
          model: StudentTest,
          as:'studentTest',
          where: { deleted_at : null },
          attributes: []
        }],
        where: { student_id : req.user.id, deleted_at: null },
        attributes: [ 
          'id',
          'custom_id',
          'student_id',
          'student_package_id',
          'is_submitted',
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN studentTest.is_submitted = true THEN 1 ELSE 0 END')), 'completed_test']
        ],
        group: [ 'StudentCalcTest.id' ],
        order: [
          ['id', 'ASC'],
          ['is_submitted', 'DESC']
        ]
      })
      
      let studentTestData = []
      for(let i = 0; i < getStudentTests.length; i++){
        let testData = getStudentTests[i]
        
        // check package is not expired before complete test
        const studentPackage = await StudentPackages.findOne({
          raw: true,
          where: {
            id: testData.student_package_id, 
            student_id: testData.student_id, 
            isExpired: false, 
            payment_status: 'C', 
            expireDate: { [Op.gte] : new Date() }  
          }
        })
        if (!studentPackage && !testData.is_submitted) continue
        /**** END  */
        const query = {
          where: { deleted_at : null, is_active: 'y'}
        }
        const includes = [{
          required:false,
          model: StudentTest,
          as:'studentTests',
          where: { student_calc_test_id: testData.id, is_submitted: true, deleted_at : null },
          attributes : ['test_id','test_detail_id']
        }]
        query.include = [
          {
            model: testDetailsModel,
            as: 'test_details',
            include: includes ,
            where: { is_active: 'y', deleted_at : null },
            attributes:['id','title', 'sort_order', 'test_id']
          }
        ]
  
        query.order =  [
          ['test_details','sort_order', 'ASC']
        ]
        
        query.attributes = ['id','title', 'description'] 

        const tests = await testModel.findAll(query)
        studentTestData.push({testData, tests})
      }
      const totalTest = await TestDetail.count({ where: { is_active: 'y', deleted_at: null } })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: {studentTestData, 'total_test': totalTest}, message: messages[req.userLanguage].success.replace('##', 'data') })
    } catch (error) {
      return await catchError('testService.getAllQuestions', error, req, res)
    }
  }

  async studentAssessment(req, res) {
    try {
      removenull(req.body)
      const { completedTestId } = req.body
      
      const studentCompletedCount = await StudentTest.findAll({raw:true, where: { student_calc_test_id : completedTestId },
      attributes: [ 
        [ Sequelize.fn('SUM', Sequelize.literal('CASE WHEN StudentTest.test_id = 1 AND StudentTest.is_submitted = true THEN 1 ELSE 0 END')), 'given_aptitute_test'],
        [ Sequelize.fn('SUM', Sequelize.literal('CASE WHEN StudentTest.test_id = 2 AND StudentTest.is_submitted = true THEN 1 ELSE 0 END')), 'given_interest_test'],
        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN StudentTest.is_submitted = true THEN 1 ELSE 0 END')), 'given_all_test']
      ]
      })
      const totalTestCount = await testDetailsModel.findAll({ raw: true,
        attributes: [ [Sequelize.fn('count', Sequelize.col('id')), 'total_test'],
        [ Sequelize.fn('SUM', Sequelize.literal('CASE WHEN test_id = 1 THEN 1 ELSE 0 END')), 'total_interest_test'],
        [ Sequelize.fn('SUM', Sequelize.literal('CASE WHEN test_id = 2 THEN 1 ELSE 0 END')), 'total_aptitute_test']
      ]
      })
      const overAllProgress =  studentCompletedCount[0].given_all_test * 100 /  totalTestCount[0].total_test
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data : { 'total': {...studentCompletedCount[0],...totalTestCount[0], overAllProgress } }, message: messages[req.userLanguage].success.replace('##', 'data')})
    } catch (error) {
      catchError('student.assessment', error, req, res)
    }
  }

  async studentAssessmentReport(req, res) {
    try {
      removenull(req.body)
      const { studentTestCustomId } = req.body
      const validStudentTest = await StudentCalcTest.findOne({where : {custom_id : studentTestCustomId} })
      if (!validStudentTest) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_test  })

      // Interest test details
      let interestTestDetails = await StudentCalcTestDetail.findAll({ 
        where : { student_calc_test_id: validStudentTest.getDataValue('id') },
        include:[{
          model: testDetailsModel,
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
        interestGraphLabel.push(interestTestDetails[index].test_detail_name)
        interestGraphValue.push(score)
      }

       // Aptitude test details
       let aptitudeTestDetails = await StudentCalcTestNorm.findAll({ where : { student_calc_test_id: validStudentTest.getDataValue('id') }, include:[{
            model: testDetailsModel,
            as:'testDetails',
            attributes:[]
          }],
          attributes: [[Sequelize.col('testDetails.title'), 'test_detail_name'],'id','norms_code','custom_id','student_calc_test_id', 'test_detail_id', 'marks_obtained', 'sten_scores', 'score_round', [Sequelize.col('testDetails.synopsis'), 'synopsis'] ],
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
      

      for (let index = 0; index < aptitudeTestDetails.length; index++) {

        let score = aptitudeTestDetails[index].score_round
        if(score < 0) {
          score = 0
        }
        aptituteGraphLabel.push(aptitudeTestDetails[index].test_detail_name)
        aptituteGraphValue.push(score)
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
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data : { interest : { interestGraphLabel, interestGraphValue }, apptitude: { aptituteGraphLabel, aptituteGraphValue }, conclusive_findings: gotStudentTestResult }, message: messages[req.userLanguage].success.replace('##', 'data')})
    } catch (error) {
      catchError('student.assessment', error, req, res)
    }
  }

  async updateStudentQuestionOption(req, res) {
    try {
      removenull(req.body)
      const { student_test_id, question_id, option_id, test_type} = req.body
      const studentId = req.user.id

      /** check for quetion */
      const question = await questionModel.findOne({raw: true, where: { id: question_id }})
      if(!question) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Question') })

      /** check for quetion's option */
      const questionAns = await quesAnsModel.findOne({raw: true, where: { question_id, id: option_id }})
      if(!questionAns) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Question option') })

      let student_current_test_id = student_test_id
      if(test_type && test_type === 'interest') {

        const test_detail_id = question.test_detail_id
        /** check for student test */
        const studentTestData = await StudentTest.findOne({raw: true, where: { student_interest_test_id: student_test_id, test_detail_id, student_id: studentId, is_submitted: 0 }})
        if (!studentTestData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'student test') })

        student_current_test_id = studentTestData.id
      }

      let is_correct = false
      let marks = 0
      if(questionAns.is_correct_ans){
        is_correct = true
        marks = question.marks
      }

      /** 
       * check for student already attempt quetion or not
       * If alreay attempted and updated and then update selection only
       * or create new entry for selection 
       */
      const studentQuestionAns = await StudentTestAns.findOne({raw: true, where: { student_id: req.user.id, student_test_id: student_current_test_id, question_id }})
      if(studentQuestionAns){
        await StudentTestAns.update({ question_ans_id: option_id, is_correct_ans: is_correct, marks_obtained: marks }, { where: { id: studentQuestionAns.id, deleted_at: null } })
      } else {
        /** Add student quetion's ans */
        const studentAnsObj = {
          custom_id: await getUniqueString(8, StudentTest),
          student_id: req.user.id,
          student_test_id: student_current_test_id,
          question_id,
          question_ans_id: option_id, 
          is_correct_ans: is_correct, 
          marks_obtained: marks
        }
        await StudentTestAns.create(studentAnsObj)
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', 'Question option'), data: [] })
    } catch (error) {
      return await catchError('testService.getAllQuestions', error, req, res)
    }
  }

  async getOtherPackages(req, res) {
    try {
      const existPackage = await studentPackagesModel.findAll({raw :true, where : { student_id: req.user.id }})
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const allExistPackagesId = existPackage.map((result) => result.package_id )
      
      const otherPackages = await packageModel.findAll({raw: true, where : { id : {[Op.ne] : allExistPackagesId } }})

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: otherPackages })
    } catch (error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
  }
  async getTestSubCategoryById(req, res) {
    try {

      const existPackage = await getStudentPackage(req.user.id)
      if(!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })
      
      const studentDetail = await StudentDetail.findOne({raw: true, where: { student_id: req.user.id }})
      if(!studentDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'data') })
      
      const { grade_id } = studentDetail

      const { id } = req.body 
      const gotTestDetails = await testDetailsModel.findOne({
        where : { id },
        include: [{
          required:false,
          model: testTimeModel,
          as:'test_time',
          where: { grade_id, is_active: 'y', deleted_at : null },
          attributes : ['grade_id','time_Sec']
        }]
      })
      if(!gotTestDetails) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'test') })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'test-detail'), data: gotTestDetails })
    } catch (error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
  }

  /** Student test finish */
  async studentTestFinish(req, res) {
    let existPackage = await getStudentPackage(req.user.id)
    if (!existPackage) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_have_package  })

    try {
      removenull(req.body)
      const { student_test_id, is_timeout, test_type } = req.body
      const studentId = req.user.id

      let student = await StudentModel.findOne({raw: true, where: { id: studentId, is_active: 'y', deleted_at: null }})
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })
      
      /** check for student test */
      let studentTestData = ''
      if(test_type && test_type === 'interest') {
        studentTestData = await StudentInterestTest.findOne({raw: true, where: { id: student_test_id, student_id: studentId, student_package_id: existPackage.id }})
      }else{
        studentTestData = await StudentTest.findOne({raw: true, where: { id: student_test_id, student_id: studentId, is_submitted: 0, student_package_id: existPackage.id }})
      }
      if (!studentTestData) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'student test') })
      /** Check student gave all questions' ans or not when submit test  */
      if (!is_timeout){
        if (!studentTestData.questions) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'student test') })
        
        const testQuestions = JSON.parse(studentTestData.questions)
        let testQuestionAns = []
        if(test_type && test_type === 'interest') {
          let allInterestTestIds = await StudentTest.findAll({raw: true, where: { student_interest_test_id: student_test_id, student_id: studentId }})
          const studentTestIds = allInterestTestIds.map((result) => result.id);
          testQuestionAns = await StudentTestAns.findAll({ raw: true, where: { student_test_id: { [Op.in] : studentTestIds } } })
        }else{
          testQuestionAns = await StudentTestAns.findAll({ raw: true, where: { student_test_id } })
        }
        const questionsAnsIds = testQuestionAns.map((result) => result.question_id);
        const remainQuestionTest = testQuestions.filter(d => !questionsAnsIds.includes(d))
        if(remainQuestionTest.length){
          const getApptitudeRemainQuestion = await questionModel.findAll({
            raw: true,
            where: {
              id: {
                [Op.in]: remainQuestionTest
              }
            },
            attributes: ['sort_order'],
            order: [
              ['sort_order', 'ASC']
            ]
          })

          const notAnsTestIds = getApptitudeRemainQuestion.map((result) => result.sort_order)

          return res.status(status.NotAcceptable).jsonp({ status: jsonStatus.NotAcceptable, message: messages[req.userLanguage].test_not_complete, data: {'remaining_question_id': remainQuestionTest, 'remaining_question_no': notAnsTestIds} })
        }
      }

      /** get Test deatil */
      if(test_type && test_type === 'interest') {
        let allInterestTestIds = await StudentTest.findAll({raw: true, where: { student_interest_test_id: student_test_id, student_id: studentId }})
        await Promise.all(
          allInterestTestIds.map(async studentTestData => {
              await updateStudentTest(studentTestData)
            })
        )
        // Update interest test
        await StudentInterestTest.update(
          {
            is_submitted: true,
            submission_Time: new Date()
          },
          { where: { id: student_test_id } }
        )

      }else{
        await updateStudentTest(studentTestData)
      }

      /** check student complete all test or not */
      const studentCompletedTest = await StudentTest.findAll({ 
        raw: true, where: { is_submitted: true, student_package_id: existPackage.id, student_id: studentId }, attributes: ['test_detail_id'],
        order: [
          ['test_detail_id', 'ASC']
        ]
      })
      const studentTestIds = studentCompletedTest.map((result) => result.test_detail_id)
      const getTotalTests = await TestDetail.findAll({ 
        raw: true, where: { is_active: 'y', deleted_at: null  }, attributes: [[Sequelize.col('id'), 'test_detail_id']],
        order: [
          ['id', 'ASC']
        ]
      })
      const TestIds = getTotalTests.map((result) => result.test_detail_id);
      const remainTest = TestIds.filter(d => !studentTestIds.includes(d))
      let allTestFinish = false
      if(!remainTest.length){
        await studentTestCompleted(studentTestData)
        allTestFinish = true
      }
      if (allTestFinish) {
        const studentCalcTest = await StudentCalcTest.findOne({ 
          raw: true, 
          where: {
            student_id: studentId
          } 
        })
        await ReportGenerationModel.create({test_custom_id:studentCalcTest.custom_id, student_id:studentId })
        const studentName = student.first_name.concat(' ', student.last_name)
        if (student.email) {
          const resp = await sendMailFinishTest(studentName, student.email)  
          if (resp === undefined) throw Error()
        } else {
          const resp = await sendMailFinishTest(studentName, config.RECEIVER_EMAIL) 
          if (resp === undefined) throw Error()
        }
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].submit_success.replace('##', 'Test'), data: {'all_test_finish': allTestFinish} })
    } catch (error) {
      console.log('error :', error)
      return await catchError('testService.studentTestFinish', error, req, res)
    }
  }

  async studentTestResult(req, res) {
    try{
      const studentId = req.user.id
      const studentCalcTest = await StudentCalcTest.findOne({ 
        raw: true, 
        where: {
          student_id: studentId,
          is_submitted: 1,
          id: 9 // student_calc_test_id
        } 
      })
      await studentTestResult(studentCalcTest)
    } catch (error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
    
  }

  async razorpayPayment(req, res) {
    const rezorpay = new Rezorpay({
      key_id: 'rzp_test_zNZiB3KgbnDuIG',
      key_secret: 'tabNqEVIzOhXgRKwec5qey9m'
    })

    const payment_capture = 1
    const amount = 499
    const currency = 'INR'
    const options = {
      amount: amount*100,
      currency,
      receipt: shortId.generate(),
      payment_capture
    }
    try{
      const response = await rezorpay.orders.create(options)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: response })
    }catch(error) {
      return await catchError('testService.getAllTestwithSubcategory', error, req, res)
    }
  }

  async getStudentTestReport(studentTestCustomId){
    try {
      const validStudentTest = await StudentCalcTest.findOne({where : {custom_id : studentTestCustomId} })
      if (!validStudentTest) return false
  
      const gotReportPath = validStudentTest.getDataValue('report_path')
      if(gotReportPath) return { 'report_path': gotReportPath }
  
      let studentDetails = await StudentModel.findAll({ where:{ id : validStudentTest.getDataValue('student_id')},
        include:[{
          model: StudentDetail,
          as : 'studentDetails',
          attributes:[],
          include : [{ model: gradeModel, as : 'grades', attributes:[] }]
        }],
        attributes:[[Sequelize.col('studentDetails.grades.title'), 'grade'],'user_name','first_name','last_name','email', 'id', 'center_id', 'counselor_id']
      })
      studentDetails = studentDetails.map((ele) => ele.get({ plain: true }));
      studentDetails = studentDetails[0]
  
      const studentPackage = await StudentPackages.findOne({ raw: true, 
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
            return false;
          }
      }
      // Interest test details
      let interestTestDetails = await StudentCalcTestDetail.findAll({ 
        where : { student_calc_test_id: validStudentTest.getDataValue('id') },
        include:[{
          model:testDetailsModel,
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
    
      let interestTestDominateDetails = await StudentCalcTestDetail.findAll({ 
        where : { student_calc_test_id: validStudentTest.getDataValue('id') },
        include:[{
          model:testDetailsModel,
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
      let aptitudeTestDetails = await StudentCalcTestNorm.findAll({ where : { student_calc_test_id: validStudentTest.getDataValue('id') }, include:[{
            model:testDetailsModel,
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
      
     
      const fileNm = pdf.fileNm
      const filePath = path.resolve(__dirname, `../../../public/uploads/reports/${fileNm}`)

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
      await StudentCalcTest.update({ report_path: pdf.fileRelativePath }, { where: {custom_id : studentTestCustomId} })
      
      return { 'report_path': pdf.fileRelativePath }
    } catch (error) {
      console.log('error :', error);
      return handleCatchError(error)
    }
  }
}

const studentTestResult = async (studentCalcTestData) => {
  try{
    let studentCalcTest = await StudentCalcTest.findOne({ 
      raw: true, 
      where: {
        is_submitted: 1,
        id: studentCalcTestData.id // student_calc_test_id
      } 
    })
    
    /** get student interest test data */
    const studentTestDetail = await StudentCalcTestDetail.findAll({
      where: {
        student_calc_test_id: studentCalcTest.id
      },
      attributes: ['id', 'test_abb', 'converted_score', 'rank'],
      order: [
        ['rank', 'ASC'],
        ['converted_score', 'DESC'],
        ['test_detail_id', 'ASC']
      ]
    })
    const studentTestAbb = studentTestDetail.map((result) => result.test_abb);
    
    const combinations = []

    // generate 3 letter coeds
    for(let i = 0; i < studentTestAbb.length - 2; i++){
      for(let j = i + 1; j < studentTestAbb.length -1; j++){
        for(let k = j + 1; k < studentTestAbb.length; k++){
          combinations.push([studentTestAbb[i],studentTestAbb[j],studentTestAbb[k]])
        }
      }
    }
 
    let softwar_matrix = []
    for(let i = 0; i < combinations.length; i++){
      let alphabet = combinations[i]
      const allPossibleWords = await makeWords(alphabet, 3);
      const dataArray = (await allPossibleWords).map(s => {
        for(let i = 0; i<s.length-1; i++){ 
          for(let j = i+1; j<s.length; j++){ 
              if (s[i] == s[j]) return false; 
            } 
        } 
        return s; 
      })
      const finalArray = await dataArray.filter((val) => val)
      softwar_matrix = softwar_matrix.concat(finalArray)
    }

    let finalSoftwareMetrix = []
    for(let i = 0; i < softwar_matrix.length; i++) {
      const code = softwar_matrix[i]
      finalSoftwareMetrix.push(code)
      if(softwarMatrixCheck[code]) {
        finalSoftwareMetrix = finalSoftwareMetrix.concat(softwarMatrixCheck[code])
      }
    }
    let uniqCodes = finalSoftwareMetrix.filter(function (value, index, array) { 
      return array.indexOf(value) === index;
    });

    // Add user software matrix codes
    await StudentTestSoftwareMatrix.create({
      custom_id: await getUniqueString(8, StudentTestSoftwareMatrix),
      student_id: studentCalcTest.student_id,
      student_calc_test_id: studentCalcTest.id,
      student_codes: JSON.stringify(uniqCodes)
    })

    await getStudentCarrerSuggestion(studentCalcTest, uniqCodes)

  } catch (error) {
    return await catchError('testService.getAllQuestions', error)
  }
}
const getStudentCarrerSuggestion = async (studentCalcTest, codes) => {
  try {
     const studentTestNorm = await StudentCalcTestNorm.findAll({
      row: true,
      where: {
        student_calc_test_id: studentCalcTest.id
      },
      order: [
        ['test_detail_id', 'ASC']
      ]
    })

    let studentResultMatrix = []
    for(let i = 0; i < codes.length; i++) {
      const code = codes[i]
      const abbArray = code.split('')
      const softwarMatrixs = await softwarMatrixModel.findAll({
        row: true,
        where: {
          test_abb_1: abbArray[0],
          test_abb_2: abbArray[1],
          test_abb_3: abbArray[2],
          is_active: 'y',
          deleted_at: null
        }
      })
      // get stuent software matrix
      for(let k = 0; k < softwarMatrixs.length; k++) {
        const softwarMatrix = softwarMatrixs[k]
        if (softwarMatrix) {
          if(studentResultMatrix.length >= 3){
            break;
          }
          let careerFound = true
          for(let j = 0; j < studentTestNorm.length; j++) {
            const studentNorm = studentTestNorm[j]
            let where = {
              software_matrix_id: softwarMatrix.id,
              test_detail_id: studentNorm.test_detail_id
            }
            /** After client confirmation uncomment */
            if (studentNorm.norms_code === 'A' || studentNorm.norms_code === 'H'){
              const min = studentNorm.min_marks
              const max = studentNorm.max_marks
              const arr = [min, max]
              const closetResult = await closest(Math.round(studentNorm.adjusted_score), arr)
              if (closetResult === min){
                where.norm_values = {
                  [Op.like]: `%${studentNorm.norms_code}%`
                }
              } else {
                where.norm_values = {
                  [Op.like]: `${studentNorm.norms_code}%`
                }
              }
            } else {
              where.norm_values = {
                [Op.like]: `%${studentNorm.norms_code}%`
              }
            }
            /** If client ask to check norm value directly without check nearest value uncomment below */
            // where.norm_values = {
            //   [Op.like]: `%${studentNorm.norms_code}%`
            // }
            const query = {
              raw: true,
              where
            }
            const softwareMatrixDetail = await softwarMatrixDetailModel.findOne(query)
            if (!softwareMatrixDetail) {
              careerFound = false
            }
          }
          if(careerFound) {
            studentResultMatrix.push({
              student_calc_test_id: studentCalcTest.id,
              software_matrix_id: softwarMatrix.id,
              career_profile_detail_id: softwarMatrix.career_profile_detail_id
            })
          }
        }
      }
    }
    for (let i = 0; i < studentResultMatrix.length; i++){
      let studentResultMatrixData = studentResultMatrix[i]
      let studentResultData = {
        custom_id: await getUniqueString(8, StudentTestResult),
        student_id: studentCalcTest.student_id,
        student_calc_test_id: studentCalcTest.id,
        software_matrix_id: studentResultMatrixData.software_matrix_id,
        career_profile_detail_id: studentResultMatrixData.career_profile_detail_id
      }
      await StudentTestResult.create(studentResultData)
    }
  } catch (error) {
    return await catchError('testService.getAllQuestions', error)
  }
 
}

const makeWords = async (letters, length) => {
  return Array
  .from({ length })
  .fill(letters)
  .reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []))
  .map(a => a.join(''))
}

const closest = async (num, arr) => {
  let counts = arr,
  goal = num;
  let curr = await counts.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
  return curr
}

/** Update student test data */
const updateStudentTest = async (studentTestData) =>{
  /** get Test deatil */
  const testDetailId = studentTestData.test_detail_id
  let testDetail = await testDetailsModel.findOne({ raw: true, where: { id: testDetailId, is_active: 'y', deleted_at: null } })
  if(!testDetail) throw Error()

  /** Get total quetions count for test */
  let studentTotals = {}
  const testTotals = await getTestTotals(testDetailId)
  
  let totalMarks = 0
  let totalQuetions = 0
  if(testTotals.length) {
    totalMarks = parseFloat(testTotals[0].total_marks)
    totalQuetions = testTotals[0].total_quetions
  }
  studentTotals.totalMarks = totalMarks
  studentTotals.totalQuetions = totalQuetions
 

  /** get student totals */
  const studentTestTotals = await getStudentTestTotals(studentTestData.id)
  
  let studentTotalMarks = 0
  let studentTotalQuetions = 0
  let studentTotalCorrect = 0
  let studentTotalWrong = 0
  if(studentTestTotals.length) {
    studentTotalMarks = parseFloat(studentTestTotals[0].total_marks)
    studentTotalQuetions = studentTestTotals[0].total_quetions
    studentTotalCorrect = parseInt(studentTestTotals[0].total_correct)
    studentTotalWrong = studentTotalQuetions - studentTotalCorrect
  }
  const notAttempted = testDetail.no_of_questions - studentTotalQuetions

  studentTotals.studentTotalMarks = studentTotalMarks
  studentTotals.studentTotalQuetions = studentTotalQuetions
  studentTotals.studentTotalCorrect = studentTotalCorrect
  studentTotals.studentTotalWrong = studentTotalWrong
  studentTotals.notAttempted = notAttempted

  /** update student test data */
  await StudentTest.update(
    {
      is_submitted: true,
      submission_Time: new Date(),
      marks_obtained: studentTotalMarks,
      marks_wrong: studentTotalWrong,
      not_attempted: notAttempted
    },
    { where: { id: studentTestData.id } }
  )

  /** add student test calculation  */
  /** 1 = Aptitude Test, 2 = Interest Test  */
  /******** For Aptitude Test (update calculation in test norm table) */
  if(studentTestData.test_id === 1 && studentTestData.test_detail_id !== 4) {
    let submittedTestNormData = await addStudentCalcTestNorm(studentTestData, testDetail, studentTotals)
    if(!submittedTestNormData) throw Error()
  }
  /******** For Interest Test (update calculation in test details table)  */
  if(studentTestData.test_id === 2){
    let submittedTestDetailData = await addStudentCalcTestDetail(studentTestData, testDetail, studentTotals)
    if(!submittedTestDetailData) throw Error()
  }
}

/** Get student current package */
const getStudentPackage = async (student_id) => {
  const studentPackage = await studentPackagesModel.findOne({raw: true, where: { student_id, onlineTest: true, isExpired: false, payment_status: 'C', expireDate: { [Op.gte] : new Date() }  }, order: [ [ 'created_at', 'ASC' ]],})
  return studentPackage
}

/** Get test total questions and total marks */
const getTestTotals = async (test_detail_id) => {
  const totals = await questionModel.findAll({ 
    raw: true, 
    where: { test_detail_id, is_active: 'y', deleted_at: null },
    attributes: [
      'test_detail_id',
      [ Sequelize.fn('SUM', Sequelize.col('marks')), 'total_marks'],
      [ Sequelize.fn('COUNT', Sequelize.col('id')), 'total_quetions'],
    ],
    group: ['test_detail_id'],
  })
  return totals
}

/** Get student test total attempted questions, total correct marks, total wrong ans  */
const getStudentTestTotals = async (student_test_id) => {
  const totals = await StudentTestAns.findAll({ 
    raw: true, 
    where: { student_test_id, deleted_at: null },
    attributes: [
      'student_test_id',
      [ Sequelize.fn('SUM', Sequelize.col('marks_obtained')), 'total_marks'],
      [ Sequelize.fn('COUNT', Sequelize.col('id')), 'total_quetions'],
      // [ Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN is_correct_ans = true THEN 1 ELSE 0 END')), 'total_correct_ans'],
      // [ Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN is_correct_ans = false THEN 1 ELSE 0 END')), 'total_wrong_ans'],
      [ Sequelize.fn('SUM', Sequelize.col('is_correct_ans')), 'total_correct'],
    ],
    group: ['student_test_id'],
  })
  return totals
}

/** Add student calculation test norm for Apptitude Test  */
const addStudentCalcTestNorm = async (studentTestData, testDetail, studentTotals) => {
  const testId = studentTestData.test_id
  const testDetailId = studentTestData.test_detail_id
  const gradeId = studentTestData.grade_id
  const optionsCount = testDetail.no_options
  const marksObtained = studentTotals.studentTotalMarks

  /** calculation for adjust score, stens score */
  let adjustedScore = studentTotals.studentTotalCorrect - (studentTotals.studentTotalWrong/(optionsCount - 1))
  const stenScores = (adjustedScore/studentTotals.totalQuetions) * 10
  const scoreRound = Math.round(stenScores)
  if(adjustedScore < 1){
    adjustedScore = 1
  }

  /** Find norm value for obtained marks */
  const normGrade = await NormGrade.findOne({ 
    raw: true, 
    where: {
      min_marks: {
        [Op.lte]: Math.round(adjustedScore),
      },
      max_marks: {
        [Op.gte]: Math.round(adjustedScore),
      },
      grade_id: gradeId,
      test_id: testId,
      test_detail_id: testDetailId
    } 
  })
  if(!normGrade) return false
  
  const minMarks = normGrade.min_marks
  const maxMarks = normGrade.max_marks
  const normId = normGrade.norm_id
  
  const norm = await Norm.findByPk(normId)

  /** get grade norms for test */
  const checkStudentTestNorm = await StudentCalcTestNorm.findOne({ 
    raw: true, 
    where: {
      student_calc_test_id: studentTestData.student_calc_test_id,
      student_test_id: studentTestData.id,
      test_id: testId,
      test_detail_id: testDetailId,
      grade_id: gradeId,
    } 
  })
  
  /** check student already submit test or not */
  if(checkStudentTestNorm) {
    const updateStudentCalcTestNorm = await StudentCalcTestNorm.update(
      {
        min_marks: minMarks,
        max_marks: maxMarks,
        marks_obtained: marksObtained,
        norm_id: normId,
        norms_code: norm.code,
        adjusted_score: adjustedScore,
        score_round: scoreRound,
        sten_scores: stenScores,
        out_of_score: studentTotals.totalQuetions,
      },
      { where: { id: checkStudentTestNorm.id } }
    )
    return updateStudentCalcTestNorm
  }else {
    const studentTestCalcNorm = {
      custom_id: await getUniqueString(8, StudentCalcTestNorm),
      student_calc_test_id: studentTestData.student_calc_test_id,
      student_test_id: studentTestData.id,
      test_id: testId,
      test_detail_id: testDetailId,
      grade_id: gradeId,
      min_marks: minMarks,
      max_marks: maxMarks,
      marks_obtained: marksObtained,
      norm_id: normId,
      norms_code: norm.code,
      adjusted_score: adjustedScore,
      score_round: scoreRound,
      sten_scores: stenScores,
      out_of_score: studentTotals.totalQuetions,
    }
    const studentCalcTestNorm = await StudentCalcTestNorm.create(studentTestCalcNorm)
    return studentCalcTestNorm
  }
}

/** Add student calculation test detail for Apptitude Test  */
const addStudentCalcTestDetail = async (studentTestData, testDetail, studentTotals) => {
  const testId = studentTestData.test_id
  const testDetailId = studentTestData.test_detail_id
  const totalQuestionCount = testDetail.no_of_questions
  const marksObtained = studentTotals.studentTotalMarks
  
  /** calculation for converted score, stens score */
  let convertedScore = (marksObtained/totalQuestionCount) * 10
  const stenScores = Math.round(convertedScore)
  const scoreRound = Math.round(convertedScore)

  /** get student test detail for test */
  const checkStudentTestDetail = await StudentCalcTestDetail.findOne({ 
    raw: true, 
    where: {
      student_calc_test_id: studentTestData.student_calc_test_id,
      student_test_id: studentTestData.id,
      test_id: testId,
      test_detail_id: testDetailId
    } 
  })
  
  /** check student already submit test or not */
  if(checkStudentTestDetail) {
    const updateStudentCalcTestDetail = await StudentCalcTestDetail.update(
      {
        converted_score: convertedScore,
        score_round: scoreRound,
        sten_scores: stenScores,
        out_of_score: totalQuestionCount
      },
      { where: { id: checkStudentTestDetail.id } }
    )
    return updateStudentCalcTestDetail
  }else {
    const studentTestCalcDetail = {
      custom_id: await getUniqueString(8, StudentCalcTestDetail),
      student_calc_test_id: studentTestData.student_calc_test_id,
      student_test_id: studentTestData.id,
      test_id: testId,
      test_detail_id: testDetailId,
      test_abb: testDetail.sub_test_abb,
      marks_obtained: marksObtained,
      converted_score: convertedScore,
      score_round: scoreRound,
      sten_scores: stenScores,
      out_of_score: totalQuestionCount
    }
    const studentCalcTestDetail = await StudentCalcTestDetail.create(studentTestCalcDetail)
    return studentCalcTestDetail
  }
}

/** Student test completed  */
const studentTestCompleted = async (studentTestData) => {
  /** update student's test to completed */
  await StudentCalcTest.update(
    {
      is_submitted: true,
      submission_Time: new Date()
    },
    { where: { id: studentTestData.student_calc_test_id } }
  )

  let studentCalcTestData = await StudentCalcTest.findOne({
    raw: true,
    where: { id: studentTestData.student_calc_test_id }
  })

  /** update package for complete test */
  await studentPackagesModel.update({ onlineTest: false }, { where: { id: studentTestData.student_package_id } })

  /** update interest test rank */
  const interestTests = await StudentCalcTestDetail.findAll({
    raw: true, 
    where: {
      student_calc_test_id: studentTestData.student_calc_test_id
    },
    order: [
      ['sten_scores', 'DESC'],
      ['converted_score', 'DESC']
    ]
  })
  let rank = 0
  let previosConvertedScore = 0;
  for(let i = 0; i < interestTests.length; i++){
    let element = interestTests[i]
    rank++
    if (previosConvertedScore === element.sten_scores){
      rank--
    }
    previosConvertedScore = element.sten_scores
    await StudentCalcTestDetail.update({ rank }, { where: { id: element.id } })
  }

  /** Write code here for final result */
  await studentTestResult(studentCalcTestData)
}

module.exports = new StudentService()
