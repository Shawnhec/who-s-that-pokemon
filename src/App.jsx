import { useState } from "react";
import "./App.css";
import { pokemons } from "./data/pokemon";
import pokeball from "./assets/pokeball.webp";
import greatball from "./assets/greatball.webp";
import ultraball from "./assets/ultraball.webp";
import pokeballRed from "./assets/pokeball-red.png";
import pokeballBlue from "./assets/pokeball-blue.png";
import pokeballYellow from "./assets/pokeball-yellow.png";
import wallpaper1 from "./assets/wallpaper1.png";
import wallpaper2 from "./assets/wallpaper2.svg";
import arrow from ".//assets/arrow.png";

const THEMES = [
  {
    name: "classic",
    wallpaper: wallpaper1,
    balls: { next: pokeball, hint: greatball, theme: ultraball },
  },
  {
    name: "modern",
    wallpaper: wallpaper2,
    balls: { next: pokeballRed, hint: pokeballBlue, theme: pokeballYellow },
  },
];

function getRandomPokemon() {
  const idx = Math.floor(Math.random() * pokemons.length);
  const selectedPokemon = pokemons[idx];

  return {
    ...selectedPokemon,
    pokedexNumber: selectedPokemon.pokedexNumber.toString().padStart(3, "0"),
  };
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}



const App = () => {
  const [pokemon, setPokemon] = useState(getRandomPokemon);
  const [showHint, setShowHint] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [themeIdx, setThemeIdx] = useState(1);

  //new states
  const [currIdx, setCurrIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sequence, setSequence] = useState([]);

  const theme = THEMES[themeIdx];

  function handleNextPokemon() {
    setFlipped(false);
    setPokemon(getRandomPokemon());
    setGuess("");
    setFeedback("");
  }

  function handleChangeTheme() {
    setThemeIdx((i) => (i + 1) % THEMES.length);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(!guess.trim()) return;

    const isCorrect = normalize(guess) === normalize(pokemon.name);
    setFeedback(isCorrect ? "correct" : "wrong");

    //
    if(isCorrect) {
      setFlipped(true);
    }
    else {
      setFlipped(false);
    }
  }

  return (
    <div className="app" style={{ "--wallpaper": `url("${theme.wallpaper}")` }}>
      <h1>Who's That Pokémon</h1>
      <h2>Welcome, Trainer! Are you ready to test your Pokémon knowledge?</h2>
      <p className="stat">Number of Pokémons: {pokemons.length}</p>
      <div className="card-row">
        <img className="button arrow arrow-left" src={arrow}></img>

        <div
          className={`card ${flipped ? "is-flipped" : ""} ${feedback ? feedback : ""}`}
          onClick={() => setFlipped((f) => !f)}
          onAnimationEnd={() => setFeedback("")}
        >
          {/* Card front */}
          <div className="card-face card-front">
            {pokemon.type.map((t) => (
              <div className={`type-container ${t.toLowerCase()}`}></div>
            ))}

            <div className="card-content">
              {showHint && (
                <img
                  className="pokemon-image"
                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
                  draggable="false"
                />
              )}

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
                <p>{pokemon.pokedexEntry}</p>
              </div>
            </div>
          </div>

          {/* Card back */}
          <div className="card-face card-back">
            {pokemon.type.map((t) => (
              <div className={`type-container ${t.toLowerCase()}`}></div>
            ))}

            <div className="card-content">
              <img
                className="pokemon-image"
                src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokemon.pokedexNumber}.png`}
              />

              <div className="text-container">
                <p>Name: {pokemon.name}</p>
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
                <p>{pokemon.pokedexEntry}</p>
              </div>
            </div>
          </div>
        </div>
        <img className="button arrow arrow-right" src={arrow}></img>
      </div>

      <form className="guess-form" onSubmit={handleSubmit}>
        <label htmlFor="guess">Guess the Pokémon: </label>
        <input
          id="guess"
          className={`guess-input ${feedback}`}
          type="text"
          placeholder="Who am I..."
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            setFeedback("");
          }}
        >
        </input>
        <button id="guess-button" type="submit">Check!</button>
      </form>

      <img
        title="Next"
        className="button ball"
        src={theme.balls.next}
        onClick={handleNextPokemon}
      />
      <img
        title="Show hint"
        className="button ball"
        src={theme.balls.hint}
        onClick={() => setShowHint((s) => !s)}
      />
      <img
        title="Change theme"
        className="button ball"
        src={theme.balls.theme}
        onClick={handleChangeTheme}
      />

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
    </div>
  );
};

export default App;
