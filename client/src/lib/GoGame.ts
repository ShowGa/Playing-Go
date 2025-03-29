type Stone = "black" | "white";

type Point = [number, number];

export class GoGame {
  private size: number;
  private currentPlayer: Stone;
  private board: (Stone | null)[][];

  constructor(size: number = 19) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.currentPlayer = "black";
  }

  public restartGame() {
    this.clearBoard();

    this.currentPlayer = "black";
  }

  private clearBoard() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
  }

  public move(point: Point) {
    const [x, y] = point;

    // check if the point is already occupied
    if (this.board[x][y] !== null) {
      return false;
    }

    // update the board (make a move)
    this.board[x][y] = this.currentPlayer;

    // remove dead stones
    const isStoneRemoved = this.removeDeadStones(point);

    // check if the move is suicidal
    const group = this.getGroup(point, this.currentPlayer);
    if (this.getLiberties(group) === 0 && !isStoneRemoved) {
      this.board[x][y] = null;
    }
    // switch player
    this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";

    return true;
  }

  private removeDeadStones(lastMove: Point) {
    const [x, y] = lastMove;

    // find opponent
    const opponent = this.currentPlayer === "black" ? "white" : "black";

    let isStoneRemoved = false; // modify => if the count of removed stone required

    // find the lastMove's dajacent stones that may be affected by the removal
    for (const [adjx, adjy] of this.getAdjacentPoints([x, y])) {
      // check if the adjacent stone is an opponent's stone
      if (this.board[adjx][adjy] === opponent) {
        // get the opponent's group
        const group = this.getGroup([adjx, adjy], opponent);
        // check if the opponent's group is dead
        if (this.getLiberties(group) === 0) {
          // remove the opponent's group
          for (const [gx, gy] of group) {
            this.board[gx][gy] = null;
          }

          isStoneRemoved = true; // modify => if the count of removed stone required
        }
      }
    }

    return isStoneRemoved;
  }

  private getAdjacentPoints([x, y]: Point) {
    const adjacentPoints: Point[] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    // deal with the edges => remove the points that are out of bounds
    return adjacentPoints.filter(
      ([adjx, adjy]) =>
        adjx >= 0 && adjx < this.size && adjy >= 0 && adjy < this.size
    );
  }

  /*
    - visitedPoint : for avoiding the infinite loop and record the visited points for sending into the recursive function as a parameter

    - color : the color of the stone

    - group : the group of the stones [[x, y], [x, y], [x, y], ...]

    Logic:
    - if the point is already visited, return empty []
    - if the point is not visited, add the point to the group
    - if the point is not visited, check the adjacent points
    - if the adjacent point is the same color, call the function recursively
    - if the adjacent point is not the same color, return the group
  */
  private getGroup(
    point: Point,
    color: Stone,
    visitedPoint: Set<string> = new Set()
  ) {
    const [x, y] = point;
    const key = `${x},${y}`; // use a string as a key for the visited points

    // if the point is already visited or the point is not the same color, return empty []
    if (visitedPoint.has(key) || this.board[x][y] !== color) {
      return [];
    }

    visitedPoint.add(key);
    const group = [point];

    // get the adjacent points and add them to the group (if they are the same color and not visited)
    for (const adjacentPoint of this.getAdjacentPoints(point)) {
      group.push(...this.getGroup(adjacentPoint, color, visitedPoint));
    }

    return group;
  }

  private getLiberties(group: Point[]): number {
    const liberties = new Set<string>();

    for (const [x, y] of group) {
      for (const [adjx, adjy] of this.getAdjacentPoints([x, y])) {
        if (this.board[adjx][adjy] === null) {
          liberties.add(`${adjx},${adjy}`);
        }
      }
    }

    return liberties.size;
  }
}
