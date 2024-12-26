import React, {useState} from "react";

const GiftGame = ({ onGameComplete, isGameComplete }) => {
  const correctGuess = 'CHRISTMAS TREE';
  const [guess, setGuess] = useState('');

  const handleGuess = () => {
    if (guess.trim().toUpperCase() === correctGuess) { onGameComplete(); }
    else { alert(`That's not right! Try again.`); }
  }

  return (
    <div className="w-full p-3 flex flex-col items-center border-t border-gray-200">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-lg font-semibold">Riddle me this:</h2>
        <p className="text-sm text-gray-700 p-3 bg-gray-100 rounded-lg">
          There is a maiden I have seen with diamonds on her face; <br/>
          Her dress is painted emerald green, and silver rounds her waist. <br/>
          She visits only in the blackest days of stillest night— <br/>
          I look upon her body and I swear she’s made of light.
        </p>
        <h2 className="font-semibold text-lg">What is she?</h2>
      </div>
      <div className="mt-3">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="p-2 border rounded"
          placeholder="Type your guess"
          disabled={isGameComplete}
        />
        <button
          onClick={handleGuess}
          disabled={isGameComplete}
          className={
          isGameComplete
            ? "ml-2 px-3 py-2 bg-gray-300 text-white rounded"
            : "ml-2 px-3 py-2 bg-red-400 text-white rounded"
          }
        >
          {isGameComplete ? "✔" : "Check"}
        </button>
      </div>
      {/* If guessed correctly, show a success message */}
      {isGameComplete && (
        <p className="mt-2 text-[#019D91] font-medium">
          Wow, you smart cookie! You may now receive your gift.
        </p>
      )}
    </div>
  )
}

export default GiftGame;
