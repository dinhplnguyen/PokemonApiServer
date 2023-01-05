import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'

export default function UniqueApi() {

  const userAppid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg1YTljMTVjODgzZDhiZTgzNWNiNTIiLCJpYXQiOjE2Njk3MDQxMzZ9.pFr9_iplgS8jUfqc7Fxwy-BHcxWnlParEmFDLStdh-4"

  // get the unique api from the server
  const [uniqueApi, setUniqueApi] = useState([])

  const [appid, setAppid] = useState(userAppid)

  useEffect(() => {
    fetch('http://localhost:5001/api/v1/visitedapi?appid=' + appid)
      .then(res => res.json())
      .then(data => {
        setUniqueApi(data)
      })
  }, [])

  console.log("uniqueApi: ", uniqueApi);

  const uniqueApiList = uniqueApi.map((api, index) => {
    return (
      <li key={index}>
        <p>{api.links}</p>
        <p>{api.count}</p>
      </li>
    )
  })

  // create the data for the chart
  const data = [
    ['Api', 'Count'],
    ...uniqueApi.map((api) => [api.links, api.count])
  ]


  return (
    <>
      <div className="uniqueApi-wrapper">
        <h1>Unique API</h1>
        <div className="uniqueApi">
          <ul>
            {uniqueApiList}

            <Chart
              // chartType="ScatterChart"
              chartType="ColumnChart"
              data={data}
              width="100%"
              height="400px"
              legendToggle
            />
          </ul>
        </div>
      </div>
    </>
  )
}