import React, { useEffect, useState } from 'react'
import Page from './Page'
import SearchBar from './SearchBar'
import Pagination from './Pagination';

import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom'

import axios from 'axios'

import Login from './components/Login'
import Logout from './components/Logout'
import Dashboard from './components/Dashboard'
import Preferences from './components/Preferences'

import useToken from './useToken';
import Pokemon from './Pokemon';
import PokemonDetails from './PokemonDetails';
import Ghost from './ghost'

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken))
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const [pokemons, setPokemons] = useState([])

  const [searchInput, setSearchInput] = useState({
    inputText: '',
    typeCheck: [],
    hpDrag: 0,
    atkDrag: 0
  })
  const [typeCheck, setTypeCheck] = useState([])

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(10);


  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
      .then(res => res.data)
      .then(res => {
        setPokemons(res)
      })
      .catch(err => console.log("err", err))
  }, [])

  // get pokemon type no duplicate
  const pokemonType = []
  pokemons.map(pokemon => {
    if (!pokemonType.includes(pokemon.type[0])) {
      pokemonType.push(pokemon.type[0])
    }
  })

  const indexOfLastRecord = currentPage * pokemonsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - pokemonsPerPage;
  const numberOfPages = Math.ceil(pokemons.length / pokemonsPerPage);


  const checkAdmin = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken)
    if (userToken?.role === "admin") {
      return true
    }
    return false
  }

  const { token, setToken } = useToken();
  const [admin, setAdmin] = useState(checkAdmin());

  // if token is not set, redirect to login page
  if (!token) {
    return <Login setToken={setToken} setAdmin={checkAdmin} />
  }

  // set token timeout 1 minute
  setTimeout(() => {
    sessionStorage.removeItem('token')
    // display time left in console
    // console.log("time left: " + (60 - Math.floor((Date.now() - token?.time) / 1000)) + "s")
    window.location.reload()
  }, 30000)


  console.log("admin", admin)
  return (
    <>
      <Logout />
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} pokemonsType={pokemonType}
                typeCheck={typeCheck} setTypeCheck={setTypeCheck} />
              < Page currentPokemons={pokemons} currentPage={currentPage} searchInput={searchInput}
                typeCheckList={typeCheck} firstIndex={indexOfFirstRecord} lastIndex={indexOfLastRecord} />
              < Pagination
                numberOfPages={numberOfPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          } />
          <Route path="dashboard" element={<Dashboard admin={admin} />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="ghost" element={<Ghost />} />
        </Routes>
      </Router>

    </>
  )
}

export default App