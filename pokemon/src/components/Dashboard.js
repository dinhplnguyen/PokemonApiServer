import React from 'react';
import { useState } from 'react'

import Preferences from './Preferences';

import UniqueApi from './dashboard/uniqueApi';
import TopApiUser from './dashboard/topApiUser';
import TopUserEach from './dashboard/topUserEach';

function Dashboard({ admin }) {

  const [showData, setShowData] = useState();

  // render contain of the clicked link 
  function showContent(e) {
    setShowData(e.target.id);
  }

  console.log("dashbpard", admin);


  if (!admin) {
    return (
      <div className="dashboard-wrapper">
        <p>You are not admin</p>
      </div>
    )
  }

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-menu">
          <ul>
            <li><a href="#" id="uniqueApi" onClick={showContent}>Unique Api</a></li>
            <li><a href="#" id="topApiUser" onClick={showContent}>Top Api Users</a></li>
            <li><a href="#" id="topUserEach" onClick={showContent}>Top User Each Endpont</a></li>
            <li><a href="#" id="pokemons" onClick={showContent}>Pokemons</a></li>
          </ul>
        </div>
        <div className="dashboard-content">
          {showData === "uniqueApi" && <UniqueApi />}
          {showData === "topApiUser" && <TopApiUser />}
          {showData === "topUserEach" && <TopUserEach />}

        </div>
      </div>

    </>
  )
}

export default Dashboard;

