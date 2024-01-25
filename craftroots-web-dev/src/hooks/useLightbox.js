export default function useLightbox({ items }) {
  const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384]
  const deviceSizes = [640, 768, 1024, 1280, 1536]

  function nextImageUrl(src, size) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`
  }

  function fetchset(src, width, height) {
    const srcSet = imageSizes
      .concat(...deviceSizes)
      .filter((size) => size <= 1536)
      .map((size) => ({
        src: nextImageUrl(src, size),
        width: size,
        height: Math.round((height / width) * size),
      }))
    return srcSet
  }
  const slides = items.map(({ src, width, height }) => ({
    width,
    height,
    src: nextImageUrl(src, width),
    srcSet: fetchset(src, width, height),
  }))
  return { slides }
}
