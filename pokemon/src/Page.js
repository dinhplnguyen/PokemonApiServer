import React from 'react'
import Pokemon from './Pokemon'
function page({ currentPokemons, searchInput, typeCheckList, currentPo, firstIndex, lastIndex }) {

  const { inputText, typeCheck, hpDrag, atkDrag } = searchInput

  const filteredPokemons = currentPokemons.filter(pokemon => {
    return pokemon.name.english.toLowerCase().includes(inputText.toLowerCase())
  })

  const filteredPokemonsByHp = filteredPokemons.filter(pokemon => {
    return pokemon.base.HP >= hpDrag
  })

  const filteredPokemonsByAtk = filteredPokemonsByHp.filter(pokemon => {
    return pokemon.base.Attack >= atkDrag
  })

  const filteredPokemonsByType = filteredPokemonsByAtk.filter(pokemon => {
    if (typeCheckList.length === 0) {
      return true
    }
    return typeCheckList.includes(pokemon.type[0])
  })

  // only show 10 pokemons in one page
  const currentPokemonsInPage = filteredPokemonsByType.slice(firstIndex, lastIndex)


  return (
    <div>

      <div className="pokemon-list">
        {/* {updateCurrentPokes(filteredPokemonsByType)} */}
        {

          currentPokemonsInPage.map(item => (
            // <div className="pokemon-list">
            <Pokemon key={item.id} pokemon={item} />
            // </div>
          ))
        }
      </div>
    </div>

  )
}

export default page