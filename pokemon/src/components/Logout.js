import React from 'react';

import Dashboard from './Dashboard';

export default function Logout() {

  // remove the whole key/value pair from sessionStorage
  function logout() {
    sessionStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div className="logout-wrapper">
      <button onClick={logout}>Logout</button>
      <button onClick={() => window.location.href = "/dashboard"}>Dashboard</button>
    </div>
  )

}