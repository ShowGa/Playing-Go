import { Stone } from "../types/type";

export class GoRenderer {
  canvasBoard: HTMLCanvasElement; // Board layer
  canvasStone: HTMLCanvasElement; // Stone layer
  canvasPreviewStone: HTMLCanvasElement; // PreviewStone layer
  canvasHighlight: HTMLCanvasElement; // Highlight layer
  ctxBoard: CanvasRenderingContext2D;
  ctxStone: CanvasRenderingContext2D;
  ctxPreviewStone: CanvasRenderingContext2D;
  ctxHighlight: CanvasRenderingContext2D;
  // Separate the properties from Board obj instead of using the obj straightly for decoupling .
  boardSize: number;
  boardState: (Stone | null)[][];
  margin: number;
  cellSize: number;

  constructor(
    canvasBoard: HTMLCanvasElement,
    canvasStone: HTMLCanvasElement,
    canvasPreviewStone: HTMLCanvasElement,
    canvasHighlight: HTMLCanvasElement,
    boardSize: number,
    boardState: (Stone | null)[][],
    margin: number
  ) {
    this.canvasBoard = canvasBoard;
    this.canvasStone = canvasStone;
    this.canvasPreviewStone = canvasPreviewStone;
    this.canvasHighlight = canvasHighlight;
    this.boardSize = boardSize;
    this.boardState = boardState;
    this.margin = margin;

    const contextBoard = this.canvasBoard.getContext("2d");
    const contextStone = this.canvasStone.getContext("2d");
    const contextPreviewStone = this.canvasPreviewStone.getContext("2d");
    const contextHighlight = this.canvasHighlight.getContext("2d");

    if (
      !contextBoard ||
      !contextStone ||
      !contextPreviewStone ||
      !contextHighlight
    ) {
      throw new Error("Canvas 2D context not available.");
    }

    this.ctxBoard = contextBoard;
    this.ctxStone = contextStone;
    this.ctxPreviewStone = contextPreviewStone;
    this.ctxHighlight = contextHighlight;

    // calculate the cellsize based on the lattice
    this.cellSize =
      (this.canvasBoard.width - this.margin * 2) / (this.boardSize - 1);
  }

  // ========== public method ========== //
  drawInit(): void {
    this.cleanCanvas();
    this.drawGrid();
    this.drawAllTheStones();
  }

  cleanCanvas(): void {
    this.ctxBoard.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );
    this.ctxStone.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );
    this.ctxHighlight.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );
  }

  drawGrid(): void {
    this.ctxBoard.strokeStyle = "#000"; // color

    for (let i = 0; i < this.boardSize; i++) {
      const position = this.margin + i * this.cellSize; // vertical and horizontal

      // horizontal
      this.ctxBoard.beginPath();
      this.ctxBoard.moveTo(this.margin, position); // start point
      this.ctxBoard.lineTo(this.canvasBoard.width - this.margin, position); // end point
      this.ctxBoard.stroke(); // draw the line

      // vertical
      this.ctxBoard.beginPath();
      this.ctxBoard.moveTo(position, this.margin);
      this.ctxBoard.lineTo(position, this.canvasBoard.height - this.margin);
      this.ctxBoard.stroke();
    }

    // draw the dot
    this.drawStarDot();
  }

  drawStarDot(): void {
    // set up the star position
    const starPositions = [
      [3, 3],
      [3, 9],
      [3, 15],
      [9, 3],
      [9, 9],
      [9, 15],
      [15, 3],
      [15, 9],
      [15, 15],
    ];

    const radius = (this.cellSize / 2) * 0.2;

    this.ctxBoard.fillStyle = "black";

    starPositions.forEach(([row, col]) => {
      const x = this.margin + row * this.cellSize;
      const y = this.margin + col * this.cellSize;

      this.ctxBoard.beginPath();
      this.ctxBoard.arc(x, y, radius, 0, Math.PI * 2);
      this.ctxBoard.fill();
    });
  }

  drawStone(row: number, col: number, color: Stone): void {
    const x = this.margin + col * this.cellSize;
    const y = this.margin + row * this.cellSize;
    const radius = (this.cellSize / 2) * 0.8; // custom when the device is defferent

    this.ctxStone.beginPath();
    this.ctxStone.arc(x, y, radius, 0, Math.PI * 2); // angle => Radian
    this.ctxStone.fillStyle = color; // the color of the stone
    this.ctxStone.fill(); // fill up the circle
  }

  drawAllTheStones(): void {
    this.cleanAllTheStones();

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const stone = this.boardState[row][col];
        if (stone !== null) {
          this.drawStone(row, col, stone);
        }
      }
    }
  }
  cleanAllTheStones(): void {
    this.ctxStone.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );
  }

  drawPreviewStone(row: number, col: number, color: Stone): void {
    // clean the PreviewStone canvas
    this.ctxPreviewStone.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );

    // no need to draw when the position was occupied
    if (this.boardState[row][col] !== null) return;

    // draw
    const x = this.margin + col * this.cellSize;
    const y = this.margin + row * this.cellSize;
    const radius = (this.cellSize / 2) * 0.8;

    this.ctxPreviewStone.beginPath();
    this.ctxPreviewStone.arc(x, y, radius, 0, Math.PI * 2); // angle => Radian
    this.ctxPreviewStone.globalAlpha = 0.5; // opacity
    this.ctxPreviewStone.fillStyle = color; // the color of the stone
    this.ctxPreviewStone.fill(); // fill up the circle
  }
  cleanPreviewStone() {
    this.ctxPreviewStone.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );
  }

  drawHighlight(row: number, col: number): void {
    const x = this.margin + col * this.cellSize;
    const y = this.margin + row * this.cellSize;
    const radius = (this.cellSize / 2) * 0.3;

    // clear the previous hightlight
    this.ctxHighlight.clearRect(
      0,
      0,
      this.canvasBoard.width,
      this.canvasBoard.height
    );

    this.ctxHighlight.beginPath();
    this.ctxHighlight.arc(x, y, radius, 0, Math.PI * 2);
    this.ctxHighlight.fillStyle = "red";
    this.ctxHighlight.fill();
  }
}
