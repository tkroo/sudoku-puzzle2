export function structuredBoard(sudokuString) {
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

export function findOpenCell(sudoku, grid, searchDirection, rr, cc, firstRun=true) {
  if (sudoku.solution.trim() == grid.flat().join('').trim()) return {r: rr, c: cc, v: grid[rr][cc]};
  let arr = [];
  if(searchDirection == 'forward') {
    for (let r = rr; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        arr.push({r, c, v: grid[r][c]});
      }
    }
  } else if(searchDirection == 'backward') {
    for (let r = rr; r >= 0; r--) {
      for (let c = 8; c >= 0; c--) {
        arr.push({ r, c, v: grid[r][c] });
      }
    }
  } else {
    throw new Error('searchDirection must be "forward" or "backward"');
  }

  arr = firstRun ? arr.slice(1) : arr;
  
  let result = arr.find(x => {
    if (x.r == rr && firstRun) {
      return searchDirection=='forward' ? x.c > cc && x.v == 0 : x.c < cc && x.v == 0;
    } else {
      return x.v == 0;
    }
  });

  if (result != undefined) {
    return result
  } else {
    return searchDirection == 'forward' ? findOpenCell(sudoku, grid, 'forward', 0, 0, false) : findOpenCell(sudoku, grid, 'backward', 8, 8, false);
  }
}