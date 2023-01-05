import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'

export default function TopApiUser() {

  const userAppid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg1YTljMTVjODgzZDhiZTgzNWNiNTIiLCJpYXQiOjE2Njk3MDQxMzZ9.pFr9_iplgS8jUfqc7Fxwy-BHcxWnlParEmFDLStdh-4"

  const [topUserEach, setTopUserEach] = useState([])
  const [appid, setAppid] = useState(userAppid) // add your appid here

  useEffect(() => {
    fetch('http://localhost:5001/api/v1/topusereach?appid=' + appid)
      .then(res => res.json())
      .then(data => {
        setTopUserEach(data)
      })
  }, [])

  console.log("topApiUser: ", topUserEach);

  const topUserEachList = topUserEach.map((api, index) => {
    return (
      <li key={index}>
        <h3>Api: {api.links}</h3>
        <p>Username: {api.username}</p>
        <p>Visited {api.count} times</p>
      </li>
    )
  })

  // create the data for the chart
  const data = [
    ['Api', 'Total Requests'],
    ...topUserEach.map((api) => [api.links + "\n Most Visisted User: " + api.username, api.count])
  ]

  return (
    <>
      <div className="topApiUser-wrapper">
        <h1>Top API User</h1>
        <div className="topApiUser">
          <ul>
            {topUserEachList}
          </ul>
          <Chart
            chartType="ScatterChart"
            data={data}
            // add annotations to the chart
            options={{
              title: 'Top API User',
              hAxis: { title: 'Api' },
              vAxis: { title: 'Total Requests' },
              legend: 'true',
              annotations: {
                textStyle: {
                  fontSize: 12,
                  color: '#000',
                  auraColor: 'none',
                },
              },
            }}
            width="100%"
            height="400px"
            legendToggle
          />

        </div>
      </div>
    </>
  )
}


