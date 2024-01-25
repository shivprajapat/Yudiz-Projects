
const writeXlsxFile = require('write-excel-file/node')
const { handleCatchError } = require('../../helper/utilities.services')

async function createXlsxFile(schema, objects, sFileName) {
  try {
    const data = await writeXlsxFile(objects, {
      schema,
      headerStyle: {
        backgroundColor: '#ae1d4d',
        color: '#FFFFFF',
        borderColor: '#000000',
        align: 'center',
        rowSpan: 2,
        width: '30pt',
        height: '30pt'
      },
      buffer: true
    })

    return {
      filename: `${sFileName}.xlsx`,
      content: data
    }
  } catch (err) {
    return handleCatchError(err)
  }
}

module.exports = {
  createXlsxFile
}
