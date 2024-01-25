const puppeteer = require('puppeteer')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const config = require('../config/config-file')

const pdfGene = async (data = {}) => {
  try {
    const randomStr = Date.now()
    const template = fs.readFileSync(config.INVOICE_TEMPLATE_PATH + 'center_invoice.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const htmlContent = ejs.render(template, { data, baseUrl })
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--enable-blink-features=HTMLImports'
      ]
    })
    const page = await browser.newPage()
    const filePath = path.resolve(__dirname, `../public/uploads/invoices/center-package-invoice-${randomStr}.pdf`)
    await page.setContent(htmlContent)

    const pdfBuffer = await page.pdf()
    await page.pdf({ path: filePath, format: 'a4', printBackground: true })

    await page.close()
    await browser.close()

    return { image: pdfBuffer, imagePath: filePath }
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = pdfGene
