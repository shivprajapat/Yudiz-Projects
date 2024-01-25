export const downloadFile = (data = {}) => {
  const link = document.createElement('a')
  link.href = data.downloadUrl
  link.download = data.fileName
  document.body.appendChild(link)

  link.click()
}
