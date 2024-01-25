const WORDS_PER_MIN = 275 // wpm

const IMAGE_READ_TIME = 12 // in seconds

const TABLE_ROW_READ_TIME = 10 // in seconds

const CHINESE_KOREAN_READ_TIME = 500 // cpm

const IMAGE_TAGS = ['img', 'Image']

/**
 *  String#imageReadTime() -> { time, count }
 *
 *  Get Image Read Time from a string.
 *
 * */

function imageCount(imageTags, string) {
  const combinedImageTags = imageTags.join('|')
  const pattern = `<(${combinedImageTags})([\\w\\W]+?)[\\/]?>`
  const reg = new RegExp(pattern, 'g')
  return (string.match(reg) || []).length
}

function imageReadTime(customImageTime = IMAGE_READ_TIME, tags = IMAGE_TAGS, string, imageNumberCount = 0) {
  let seconds = 0
  let count = imageCount(tags, string)
  count = parseInt(count) + parseInt(imageNumberCount)

  if (count > 10) {
    seconds = count / 2 * (customImageTime + 3) + (count - 10) * 3 // n/2(a+b) + 3 sec/image
  } else {
    seconds = count / 2 * (2 * customImageTime + (1 - count)) // n/2[2a+(n-1)d]
  }

  return {
    time: seconds / 60,
    count
  }
}

/**
 *  String#wordsReadTime() -> { characterTime, otherLanguageTime, wordTime, wordCount }
 *
 *  Get Words count from a string.
 *
 * */

function wordsCount(string) {
  const pattern = '\\w+'
  const reg = new RegExp(pattern, 'g')
  return (string.match(reg) || []).length
} // Chinese / Japanese / Korean

function otherLanguageReadTime(string) {
  const pattern = '[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]'
  const reg = new RegExp(pattern, 'g')
  const count = (string.match(reg) || []).length
  const time = count / CHINESE_KOREAN_READ_TIME
  const formattedString = string.replace(reg, '')
  return {
    count,
    time,
    formattedString
  }
}

function wordsReadTime(string, wordsPerMin = WORDS_PER_MIN) {
  const {
    count: characterCount,
    time: otherLanguageTime,
    formattedString
  } = otherLanguageReadTime(string)
  const wordCount = wordsCount(formattedString)
  const wordTime = wordCount / wordsPerMin
  return {
    characterCount,
    otherLanguageTime,
    wordTime,
    wordCount
  }
}

/**
 *  String#stripTags() -> String
 *
 *  Strip HTML tags string.
 *
 * */
function stripTags(string) {
  const pattern = '<\\w+(\\s+("[^"]*"|\\\'[^\\\']*\'|[^>])+)?>|<\\/\\w+>'
  const reg = new RegExp(pattern, 'gi')
  return string.replace(reg, '')
}

/**
 *  String#stripWhitespace() -> String
 *
 *  Strip HTML tags string.
 *
 * */
function stripWhitespace(string) {
  return string.replace(/^\s+/, '').replace(/\s+$/, '')
}

/**
 *  String#humanizeTime() -> String
 *
 *  Convert time(in minutes) to a humanized string.
 *
 * */
function humanizeTime(time) {
  if (time < 0.5) {
    return 'less than a minute'
  }

  if (time >= 0.5 && time < 1.5) {
    return '1 minute'
  }

  return `${Math.ceil(time)} minutes`
}

/**
 *  String#tableReadTime() -> { time, count }
 *
 *  Get Table Read Time from a string.
 *
 * */

function trCount(string) {
  const pattern = '<(tr)([\\w\\W]+?)[\\/]?>'
  const reg = new RegExp(pattern, 'g')
  return (string.match(reg) || []).length
}

function thCount(string) {
  const pattern = '<(th)([\\w\\W]+?)[\\/]?>'
  const reg = new RegExp(pattern, 'g')
  return (string.match(reg) || []).length
}

function tdCount(string) {
  const pattern = '<(td)([\\w\\W]+?)[\\/]?>'
  const reg = new RegExp(pattern, 'g')
  return (string.match(reg) || []).length
}

function tableReadTime(customTableRowTime = TABLE_ROW_READ_TIME, string) {
  const totalTr = trCount(string)
  const totalTh = thCount(string)
  const totalTd = tdCount(string)

  let seconds = 0
  const td = (totalTd + (totalTh - 1))
  const count = totalTr

  if (td < 10) {
    seconds = totalTr * customTableRowTime
  } else {
    seconds = totalTr * (((td - 10) * (customTableRowTime / 10)) + customTableRowTime)
  }

  return {
    time: seconds / 60,
    count
  }
}

function readTime(string, customWordTime = 275, customImageTime = 12, imageNumberCount = 0, customTableRowTime = 10, chineseKoreanReadTime = 500) {
  // For image read time
  const imageTags = IMAGE_TAGS
  const {
    time: imageTime,
    count: imageCount$$1
  } = imageReadTime(customImageTime, imageTags, string, imageNumberCount)

  // For words read time
  const strippedString = stripTags(stripWhitespace(string))
  const {
    characterCount,
    otherLanguageTime,
    wordTime,
    wordCount
  } = wordsReadTime(strippedString, customWordTime)

  // For table read time
  const {
    time: tableTotalReadTime,
    count: tableRowColoumnCounts
  } = tableReadTime(customTableRowTime, string)

  return {
    humanizedDuration: humanizeTime(imageTime + wordTime + tableTotalReadTime),
    duration: Math.ceil(imageTime + wordTime + tableTotalReadTime),
    totalWords: wordCount,
    wordTime,
    totalImages: imageCount$$1,
    imageTime,
    otherLanguageTimeCharacters: characterCount,
    otherLanguageTime,
    tableTotalReadTime,
    tableRowColoumnCounts
  }
}

module.exports = { readTime }
