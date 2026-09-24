import { useState } from "react";
import "./App.css";
import { pokemons } from "./data/pokemon";

function getRandomPokemon() {
  const idx = Math.floor(Math.random() * pokemons.length);
  const selectedPokemon = pokemons[idx];

  return {
    ...selectedPokemon,
    pokedexNumber: selectedPokemon.pokedexNumber.toString().padStart(3, "0"),
  };
}

const App = () => {
  const [pokemon, setPokemon] = useState(getRandomPokemon);

  function handleNextPokemon() {
    setPokemon(getRandomPokemon());
  }
  return (
    <div className="app">
      <h1>Who's That Pokémon</h1>
      <h2>How good a Pokémon master are you? Test it out !</h2>
      <div className="card card-front">
        {pokemon.type.map((t) => (
          <div className={`type-container ${t.toLowerCase()}`}></div>
        ))}

        <div className="card-content">
          <img
            className="pokemon-image"
            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
          />

          <div className="text-container">
            <p>
              Type:{" "}
              <div className="type-row">
                {pokemon.type.map((t) => (
                  <span key={t} className={`type-badge ${t.toLowerCase()}`}>
                    {t}
                  </span>
                ))}
              </div>
            </p>
            <p>Generation: {pokemon.generation}</p>
            <p>Evolution: {pokemon.evolution}</p>
            <p>
              {pokemon.pokedexEntry}
            </p>
          </div>
        </div>
      </div>


       <div className="card back">
        {pokemon.type.map((t) => (
          <div className={`type-container ${t.toLowerCase()}`}></div>
        ))}

        <div className="card-content">
          <img
            className="pokemon-image"
            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
          />

          <div className="text-container">
            <p>
              Type:{" "}
              <div className="type-row">
                {pokemon.type.map((t) => (
                  <span key={t} className={`type-badge ${t.toLowerCase()}`}>
                    {t}
                  </span>
                ))}
              </div>
            </p>
            <p>Generation: {pokemon.generation}</p>
            <p>Evolution: {pokemon.evolution}</p>
            <p>
              {pokemon.pokedexEntry}
            </p>
          </div>
        </div>
      </div>

      <img
        title="Next"
        className="button"
        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffpzbq-b6733f1e-ed37-489f-9761-6acd4bf7badd.png/v1/fill/w_1280,h_1280/pokeball_by_jormxdos_dffpzbq-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiIvZi9lOGRkYzRkYS0yM2RkLTQ1MDItYjY1Yi0zNzhjOWNmZTVlZmEvZGZmcHpicS1iNjczM2YxZS1lZDM3LTQ4OWYtOTc2MS02YWNkNGJmN2JhZGQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.wUWVpX76Kd4tCiedeVq7qGCDU2euwEUsf9omKuWfxrU"
        onClick={handleNextPokemon}
      ></img>

      {/* <div className="pokemon-silhouette">
        <img
          src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/130.png"
          className="pokemon top"
        />
        <img
          src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/130.png"
          className="pokemon bottom"
        />
      </div> */}

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpCLsbe68LGYoFLzWXh2uPqxBXoz3WL8lJF5Lnrwq9hGN765tNG8VSHqP9&s=10"
              alt="Avatar"
              style={{ width: "300px", height: "300px" }}

            ></img>
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
