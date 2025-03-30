import React from "react";
import { Point } from "../types/type";

interface GoBoardProps {
  boardSize: number;
  onStoneDrop: (point: Point) => boolean;
}

const GoBoard: React.FC<GoBoardProps> = ({}: GoBoardProps) => {
  return <div>GoBoard</div>;
};

export default GoBoard;
