import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'

export default function TopApiUser() {

  const userAppid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg1YTljMTVjODgzZDhiZTgzNWNiNTIiLCJpYXQiOjE2Njk3MDQxMzZ9.pFr9_iplgS8jUfqc7Fxwy-BHcxWnlParEmFDLStdh-4"

  const [topApiUser, setTopApiUser] = useState([])

  const [appid, setAppid] = useState(userAppid) // add your appid here

  useEffect(() => {
    fetch('http://localhost:5001/api/v1/topapiuser?appid=' + appid)
      .then(res => res.json())
      .then(data => {
        setTopApiUser(data)
      })
  }, [])

  console.log("topApiUser: ", topApiUser);

  const topApiUserList = topApiUser.map((user, index) => {
    return (
      <li key={index}>
        <p>{user.username}</p>
        <p>{user.count}</p>
      </li>
    )
  })

  // create the data for the chart
  const data = [
    ['Username', 'Total Requests'],
    ...topApiUser.map((user) => [user.username, user.count])
  ]


  return (
    <>
      <div className="topApiUser-wrapper">
        <h1>Top API User</h1>
        <div className="topApiUser">
          <ul>
            {topApiUserList}
          </ul>
          <Chart
            chartType="ScatterChart"
            data={data}
            width="100%"
            height="400px"
            legendToggle
          />

        </div>
      </div>
    </>
  )
}
