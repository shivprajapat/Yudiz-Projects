exports.formatName = (name) => {
  return (name.charAt(0).toUpperCase() + name.slice(1))
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1)
    })
    .join('')
}
