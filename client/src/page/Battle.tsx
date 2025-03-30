import { useState } from "react";
import GoBoard from "../component/GoBoard";
import { GoGame } from "../lib/GoGame";
import { Point, Stone } from "../types/type";

const Battle = () => {
  const [goGame] = useState<GoGame>(new GoGame(19));
  const [currentPlayer, setCurrentPlayer] = useState<Stone>(
    goGame.getCurrentPlayer()
  );
  // Add currentPlayer later

  /*
    - point: from GoBoard
  */
  const handleMove = (point: Point): boolean => {
    // check is your turn later

    const result = goGame.move(point);

    setCurrentPlayer(goGame.getCurrentPlayer());

    // socket emit

    return result;
  };

  return (
    <div>
      <GoBoard
        boardSize={goGame.getSize()} // init props
        boardState={goGame.getBoard()} // init props
        currentPlayer={currentPlayer} // init props
        onStoneDrop={(point: Point) => {
          return handleMove(point);
        }}
      />
    </div>
  );
};

export default Battle;

/*
======= To-Do =======


*/
