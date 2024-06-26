import { getSudoku } from "sudoku-gen";

function structureBoard(sudokuString){
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

export function createGame(difficulty) {
  const game = getSudoku(difficulty);
  const grid = structureBoard(game.solution);
  return {
    game,
    grid,
    
    solve() {
      // this.solution = this.puzzle;
      // grid = this.structureBoard(sudoku.solution);
      // history = [grid.flat().join('').replaceAll('0', '-')];
      return {
        grid: structureBoard(this.game.solution),
        history: [this.game.solution.replaceAll('0', '-')]
      }
    }
  }
}