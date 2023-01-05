import React from 'react'

function Pokemon({ pokemon }) {
  const getThreeDigitId = (id) => {
    if (id < 10) return `00${id}`
    if (id < 100) return `0${id}`
    return id
  }

  return (
    // <div className="pokemon-list">

    <a href={`/pokemon/${pokemon.id}`}>
      <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${getThreeDigitId(pokemon.id)}.png`} />
      {/* <h2>{pokemon.name.english}</h2>
        <p>Type: {pokemon.type.join(', ')}</p>
        <p>Attack: {pokemon.base.Attack}</p>
        <p>Defense: {pokemon.base.Defense}</p>
        <p>HP: {pokemon.base.HP}</p>
        <p>Speed: {pokemon.base.Speed}</p> */}
    </a>

    // </div>
  )
}

export default Pokemon