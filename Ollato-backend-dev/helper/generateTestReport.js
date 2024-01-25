const PDFMerger = require('pdf-merger-js')
const puppeteer = require('puppeteer')
const moment = require('moment')
const fs = require('fs')
const ejs = require('ejs')
// const { user } = require('../lang/en/words')

const template = fs.readFileSync('./views/pages/page1.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template1 = fs.readFileSync('./views/pages/page2.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template2 = fs.readFileSync('./views/pages/welcome-to-ollato.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template3 = fs.readFileSync('./views/pages/route-map.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template4 = fs.readFileSync('./views/pages/interest.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template5 = fs.readFileSync('./views/pages/scores-out-of.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template6 = fs.readFileSync('./views/pages/realistic.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template7 = fs.readFileSync('./views/pages/artistic.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template8 = fs.readFileSync('./views/pages/enterprising.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template9 = fs.readFileSync('./views/pages/synopsis.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template10 = fs.readFileSync('./views/pages/aptitude.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template11 = fs.readFileSync('./views/pages/scores-out-of-2.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template12 = fs.readFileSync('./views/pages/verbal-reasoning.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template13 = fs.readFileSync('./views/pages/numerical-reasoning.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template14 = fs.readFileSync('./views/pages/abstract-reasoning.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template15 = fs.readFileSync('./views/pages/perceptual-speed_and-accuracy.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template16 = fs.readFileSync('./views/pages/Mechanical-Reasoning.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template17 = fs.readFileSync('./views/pages/Space-Relations.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template18 = fs.readFileSync('./views/pages/Spelling.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template19 = fs.readFileSync('./views/pages/Language-Usage.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template20 = fs.readFileSync('./views/pages/synopsis-2.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template21 = fs.readFileSync('./views/pages/Conclusive-Findings.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})
const template22 = fs.readFileSync('./views/pages/contact-us.ejs', {
  encoding: 'utf-8' // Unicode Transformation Format (UTF).
})

const pdfSettings = {
  displayHeaderFooter: false,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}

const pdfGenerator = async ({ user, date, interestGraphLabel, interestGraphValue, interestDominantValue, interest, aptitude, aptituteGraphLabel, aptituteGraphValue, wellDoneArray, goodArray, workOnArray, gotStudentTestResult, interestSynopsisData, careerProfiles }) => {
  try {
    const fileName = user.first_name + '_' + user.last_name + '_Test_Report_' + Date.now()
    const filename = `./public/uploads/reports/${fileName}.pdf`
    const fileRelativePath = `uploads/reports/${fileName}.pdf`
    const baseUrl = process.env.DEPLOY_HOST_URL
    const htmlContent = ejs.render(template, { user, date, moment, baseUrl })
    const htmlContent1 = ejs.render(template1, { user, baseUrl })
    const htmlContent2 = ejs.render(template2, { user, baseUrl })
    const htmlContent3 = ejs.render(template3, { user, baseUrl })
    const htmlContent4 = ejs.render(template4, { user, baseUrl })
    const htmlContent5 = ejs.render(template5, { user, interestGraphLabel, interestGraphValue, interestDominantValue, baseUrl })
    const htmlContent6 = ejs.render(template6, { user, interest, baseUrl })
    const htmlContent7 = ejs.render(template7, { user, interest, baseUrl })
    const htmlContent8 = ejs.render(template8, { user, interest, baseUrl })
    const htmlContent9 = ejs.render(template9, { user, interestSynopsisData, baseUrl })
    const htmlContent10 = ejs.render(template10, { user, baseUrl })
    const htmlContent11 = ejs.render(template11, { user, aptituteGraphLabel, aptituteGraphValue, wellDoneArray, goodArray, workOnArray, baseUrl })
    const htmlContent12 = ejs.render(template12, { user, aptitude, baseUrl })
    const htmlContent13 = ejs.render(template13, { user, aptitude, baseUrl })
    const htmlContent14 = ejs.render(template14, { user, aptitude, baseUrl })
    const htmlContent15 = ejs.render(template15, { user, aptitude, baseUrl })
    const htmlContent16 = ejs.render(template16, { user, aptitude, baseUrl })
    const htmlContent17 = ejs.render(template17, { user, aptitude, baseUrl })
    const htmlContent18 = ejs.render(template18, { user, aptitude, baseUrl })
    const htmlContent19 = ejs.render(template19, { user, aptitude, baseUrl })
    const htmlContent20 = ejs.render(template20, { user, wellDoneArray, goodArray, workOnArray, baseUrl })
    const htmlContent21 = ejs.render(template21, { user, gotStudentTestResult, baseUrl })
    const htmlContent22 = ejs.render(template22, { user, baseUrl })
    const mockContent = [htmlContent, htmlContent1, htmlContent2, htmlContent3, htmlContent4, htmlContent5, htmlContent6, htmlContent7, htmlContent8, htmlContent9, htmlContent10, htmlContent11, htmlContent12, htmlContent13, htmlContent14, htmlContent15, htmlContent16, htmlContent17, htmlContent18, htmlContent19, htmlContent20, htmlContent21]

    const browser = await puppeteer.launch({
      headless: true,
      // executablePath: '/opt/homebrew/bin/chromium',
      args: [
        '--enable-blink-features=HTMLImports'
      ]
    })
    const page = await browser.newPage()
    // timeout 60 seconds now
    await page.setDefaultNavigationTimeout(100000)
    const merger = new PDFMerger()

    for (const content of mockContent) {
      await page.emulateMediaType('screen')
      await page.setContent(content, {
        waitUntil: ['load', 'networkidle0']
      })
      await merger.add(await page.pdf(pdfSettings))
    }

    /** Add career prfile PDF */
    for (let i = 0; i < careerProfiles.length; i++) {
      const path = `./public${careerProfiles[i].path}`
      await merger.add(path)
    }
    await page.emulateMediaType('screen')
    await page.setContent(htmlContent22, {
      waitUntil: ['load', 'networkidle0']
    })
    await merger.add(await page.pdf(pdfSettings))

    /** Add last page for dummy. I don't know why last page not show in PDF. */
    // await page.emulateMediaType('screen')
    // await page.setContent(htmlContent22, {
    //   waitUntil: ['load', 'networkidle0']
    // })
    // await merger.add(await page.pdf(pdfSettings))

    await merger.save(filename)
    return { imagePath: filename, fileNm: `${fileName}.pdf`, fileRelativePath }
  } catch (error) {
    console.log('error: from helper: generateTestReport', error)
  }
}
module.exports = pdfGenerator
