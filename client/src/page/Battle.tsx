import { useState } from "react";
import GoBoard from "../component/GoBoard";
import { GoGame } from "../lib/GoGame";
import { Point } from "../types/type";

const Battle = () => {
  const [goGame] = useState<GoGame>(new GoGame(19));
  // Add currentPlayer later

  /*
    - point: from GoBoard
  */
  const handleMove = (point: Point): boolean => {
    // check is your turn later

    const result = goGame.move(point);

    // socket emit

    return result;
  };

  return (
    <div>
      <GoBoard
        boardSize={19}
        onStoneDrop={(point: Point) => {
          return handleMove(point);
        }}
      />
    </div>
  );
};

export default Battle;
