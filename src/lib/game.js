import { getSudoku } from "sudoku-gen";

function structuredBoard(sudokuString){
  const rows = []
  for (let i = 0; i < sudokuString.length; i+= 9) {
    const row = sudokuString.slice(i, i+9).split("");
    for (let j = 0; j < row.length; j++) {
      row[j] = row[j] === "-" ? 0 : parseInt(row[j], 10);
    }
    rows.push(row);
  }
  return rows;
}


export function Game(difficulty) {
  let game = getSudoku(difficulty);
  const grid = structuredBoard(game.puzzle);
  let solved = false;
  return {
    ...game,
    grid,
    
    solve() {
      this.grid = structuredBoard(game.solution);
    }
  }
}
