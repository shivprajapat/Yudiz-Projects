export default async function liveArticle(req, res) {
  const response = await fetch(`https://amp.dev/documentation/examples/api/photo-stream?items=10&left=${req?.query?.left}`)
  const data = await response.json()
  data.items = data.items.map((d) => ({ ...d, isPoll: false, options: [{ sTitle: 'Aus', percentage: 10, _id: '123124354sdfs' }, { sTitle: 'Draw', percentage: 20, _id: 'efew534ygerfew' }, { sTitle: 'BAN', percentage: 20, _id: 'ger345121edq' }] }))
  res.status(200).json({
    ...data,
    next: data.items.length ? `/api/live-article/?items=10&left=${+req?.query?.left - 1}` : ''
  })
}
