import React, { useState } from 'react';

function SearchBar({ searchInput, setSearchInput, pokemonsType, typeCheck, setTypeCheck }) {

  const textInput = (event) => {
    setSearchInput({ ...searchInput, inputText: event.target.value })
  }

  const typeCheckInput = (event) => {
    if (event.target.id && !typeCheck.includes(event.target.id)) {
      setTypeCheck([...typeCheck, event.target.id])
    } else {
      setTypeCheck(typeCheck.filter(item => item !== event.target.id))
    }
    setSearchInput({ ...searchInput, typeCheck: typeCheck })
  }
  console.log("typeCheck", typeCheck)

  const hpDragger = (event) => {
    setSearchInput({ ...searchInput, hpDrag: event.target.value })
  }

  const atkDragger = (event) => {
    setSearchInput({ ...searchInput, atkDrag: event.target.value })
  }

  return (
    <form>
      <input type="text" placeholder="Search..." onChange={textInput} />
      <p>
        <div id="list1">
          <span class="anchor">Select Fruits</span>
          <ul class="items">
            {pokemonsType.map((type, index) => {
              return (
                <li>
                  <input type="checkbox" id={type} onChange={typeCheckInput} />
                  <label for={`item-${index}`}>{type}</label>
                </li>
              )
            })}
          </ul>
        </div>
      </p>
      <p>
        <input type="range" min="0" max="300" onChange={hpDragger} />
        {' '}
        HP: {searchInput.hpDrag}
      </p>
      <p>
        <input type="range" min="0" max="200" onChange={atkDragger} />
        {' '}
        ATK: {searchInput.atkDrag}
      </p>
    </form>
  );

}

export default SearchBar;