import React, { useCallback, useEffect, useRef } from "react";
import { Point, Stone } from "../types/type";
import { GoRenderer } from "../lib/GoRenderer";
import { throttle } from "lodash";

interface GoBoardProps {
  boardSize: number;
  boardState: (Stone | null)[][];
  currentPlayer: Stone;
  onStoneDrop: (point: Point) => boolean;
}

const GoBoard: React.FC<GoBoardProps> = ({
  boardSize,
  boardState,
  currentPlayer,
  onStoneDrop,
}: GoBoardProps) => {
  const canvasBoardRef = useRef(null);
  const canvasStoneRef = useRef(null);
  const canvasPreviewStoneRef = useRef(null);
  const canvasHighlightRef = useRef(null);

  const rendererRef = useRef<GoRenderer | null>(null);

  function handleDropStone(e: React.MouseEvent) {
    if (!rendererRef.current) return;

    const margin = rendererRef.current.margin;
    const cellSize = rendererRef.current.cellSize;
    const boardSize = rendererRef.current.boardSize;

    // calculate the position
    const [row, col] = getXYFromMouseEvent(
      e,
      rendererRef.current.canvasHighlight,
      margin,
      cellSize,
      boardSize
    );

    // drop the stone
    const result = onStoneDrop([row, col]);

    // check if droping is illegal
    if (!result) return;

    // render
    rendererRef.current.drawAllTheStones();

    // draw hightlight on the last drop stone
    rendererRef.current.drawHighlight(row, col);
  }

  function getXYFromMouseEvent(
    e: MouseEvent | React.MouseEvent,
    canvas: HTMLCanvasElement,
    margin: number,
    cellSize: number,
    boardSize: number
  ): [number, number] {
    // get the position based on the position of canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // transfer the position to row, col
    let col = Math.round((x - margin) / cellSize);
    let row = Math.round((y - margin) / cellSize);

    // fix the postion exceed the board
    if (col < 0) col = 0;
    if (col >= boardSize) col = boardSize - 1;
    if (row < 0) row = 0;
    if (row >= boardSize) row = boardSize - 1;

    return [row, col];
  }

  const throttledShowPreviewStone = useCallback(
    throttle((e: React.MouseEvent) => {
      if (!rendererRef.current) return;
      const margin = rendererRef.current.margin;
      const cellSize = rendererRef.current.cellSize;
      const boardSize = rendererRef.current.boardSize;
      const turn = currentPlayer;

      // calculate the position
      const [row, col] = getXYFromMouseEvent(
        e,
        rendererRef.current.canvasHighlight,
        margin,
        cellSize,
        boardSize
      );

      // draw preview
      rendererRef.current.drawPreviewStone(row, col, turn);
    }, 100), // second parameter is delay time
    [currentPlayer]
  );

  useEffect(() => {
    if (
      canvasBoardRef.current &&
      canvasStoneRef.current &&
      canvasPreviewStoneRef.current &&
      canvasHighlightRef.current
    ) {
      const renderer = new GoRenderer(
        canvasBoardRef.current,
        canvasStoneRef.current,
        canvasPreviewStoneRef.current,
        canvasHighlightRef.current,
        boardSize,
        boardState,
        20 // margin
      );

      // drawinit
      renderer.drawInit();
      rendererRef.current = renderer;
    }
  }, []);

  return (
    <div
      onClick={handleDropStone}
      className="w-[690px] h-[690px] bg-orange-200 rounded-lg"
    >
      <canvas
        ref={canvasBoardRef}
        width={690}
        height={690}
        style={{ position: "absolute", zIndex: "10" }}
      />
      <canvas
        ref={canvasStoneRef}
        width={690}
        height={690}
        style={{ position: "absolute", zIndex: "11" }}
      />
      <canvas
        ref={canvasPreviewStoneRef}
        width={690}
        height={690}
        style={{ position: "absolute", zIndex: "12" }}
      />
      <canvas
        ref={canvasHighlightRef}
        width={690}
        height={690}
        style={{ position: "absolute", zIndex: "13" }}
        onMouseMove={throttledShowPreviewStone}
        onMouseLeave={() => {
          rendererRef.current?.cleanPreviewStone();
        }}
      />
    </div>
  );
};

export default GoBoard;
