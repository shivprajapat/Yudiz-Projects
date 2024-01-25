// import axios from 'axios'
// import React from 'react'
// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router'
// import Loader from './../LoaderCircle/index'

// const ThreeDeeViewer = () => {
//   let { id } = useParams()
//   const [player, setPlayer] = useState('')
//   const [loading, setLoading] = useState('')

//   useEffect(() => {
//     setLoading(true)
//     getData()
//   }, [])

//   const getData = async () => {
//     const data = await axios.get(`https://sketchfab.com/oembed?url=https://sketchfab.com/models/${id}`)
//     setPlayer(data.data.html)
//     setLoading(false)
//   }

//   return <div style={{ margin: 'auto' }}></div>
// }

// export default ThreeDeeViewer
