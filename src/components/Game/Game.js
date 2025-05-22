import React from "react";

import { sample, range } from "../../utils";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import { checkGuess } from "../../game-helpers";
import { WORDS } from "../../data";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  let [gameOver, setGameOver] = React.useState(false);
  let [gameWon, setGameWon] = React.useState(false);
  let [guess, setGuess] = React.useState("");
  let [guessList, setGuessList] = React.useState([]);
  return (
    <>
      <div className="guess-results">
        {guessList.map(({ id, result }) => {
          return (
            <p className="guess" key={id}>
              {result.map(({ letter, status }, index) => (
                <span className={`cell ${status}`} key={index}>
                  {letter}
                </span>
              ))}
            </p>
          );
        })}
        {range(0, NUM_OF_GUESSES_ALLOWED - guessList.length, 1).map(
          (number) => {
            return (
              <p className="guess" key={number}>
                {range(0, 5).map((number) => (
                  <span className="cell" key={number}></span>
                ))}
              </p>
            );
          }
        )}
      </div>
      <form
        className="guess-input-wrapper"
        onSubmit={(event) => {
          event.preventDefault();
          const newGuessList = [
            ...guessList,
            { id: crypto.randomUUID(), result: checkGuess(guess, answer) },
          ];
          setGuessList(newGuessList);
          if (guess === answer) {
            setGameOver(true);
            setGameWon(true);
          } else if (newGuessList.length >= NUM_OF_GUESSES_ALLOWED) {
            setGameOver(true);
            setGameWon(false);
          }
          setGuess("");
        }}
      >
        <label htmlFor="guess-input">Enter guess:</label>
        <input
          id="guess-input"
          type="text"
          pattern="[a-zA-Z]{5}"
          title="5 letter word"
          value={guess}
          disabled={gameOver}
          onChange={(event) => setGuess(event.target.value.toUpperCase())}
        />
      </form>
      {gameOver &&
        (gameWon ? (
          <div className="happy banner">
            <p>
              <strong>Congratulations!</strong> Got it in
              <strong>{guessList.length} guesses</strong>
            </p>
          </div>
        ) : (
          <div className="sad banner">
            <p>
              Sorry, the correct answer is <strong>{answer}</strong>.
            </p>
          </div>
        ))}
    </>
  );
}

export default Game;
