import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PokemonDetails({ pokemon }) {

  const params = useParams();
  const id = params.id;

  const [pokemonDetails, setPokemonDetails] = useState();

  useEffect(() => {
    fetch(`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json`)
      .then(res => res.json())
      .then(res => {
        setPokemonDetails(res[id - 1])
      }
      )
  }, [])

  console.log("pokemonDetails", pokemonDetails)

  const getThreeDigitId = (id) => {
    if (id < 10) return `00${id}`
    if (id < 100) return `0${id}`
    return id
  }

  return (
    <div className="pokemonDetails">
      <h1>Pokemon Details</h1>
      {pokemonDetails && (
        <div>
          <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${getThreeDigitId(id)}.png`} />
          <h2>{pokemonDetails.name.english}</h2>
          <p>Type: {pokemonDetails.type.join(', ')}</p>
          <p>Attack: {pokemonDetails.base.Attack}</p>
          <p>Defense: {pokemonDetails.base.Defense}</p>
          <p>HP: {pokemonDetails.base.HP}</p>
          <p>Speed: {pokemonDetails.base.Speed}</p>


        </div>
      )}
    </div>
  )
}

