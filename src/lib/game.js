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
  return {
    difficulty,
    ...getSudoku(difficulty),
    solution: getSudoku(difficulty).solution,
    puzzle: getSudoku(difficulty).puzzle,
    
    solve() {
      // this.solution = this.puzzle;
      // grid = this.structureBoard(sudoku.solution);
      // history = [grid.flat().join('').replaceAll('0', '-')];
      return {
        grid: structureBoard(this.solution),
        history: [this.solution.replaceAll('0', '-')]
      }
    }
  }
}