<script>
  import { getSudoku } from 'sudoku-gen';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput } from './lib/stores';
  import './components/board.css';

  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;

  const sudoku = getSudoku('easy');

  const structuredBoard = (sudokuString) => {
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

  const grid = structuredBoard(sudoku.puzzle);

  function setActiveCell(event) {
    const {r, c, v} = event.detail;
    $selectedNumber = v;
    $activeCell = {r, c, v};
  }

  const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'];
  const numberKeys = ['1','2','3','4','5','6','7','8','9'];
  function onKeydown(e) {
    if (!directionKeys.includes(e.key) && !numberKeys.includes(e.key)) return;

    if (e.key == 'ArrowUp') {
      myrow = (myrow + 9 - 1) % 9;
    }
    if (e.key == 'ArrowDown') {
      myrow = (myrow + 9 + 1) % 9;
    }
    if (e.key == 'ArrowLeft') {
      mycol = (mycol + 9 - 1) % 9;
    }
    if (e.key == 'ArrowRight') {
      mycol = (mycol + 9 + 1) % 9;
    }
    $activeCell = {r: myrow, c: mycol, v: grid[myrow][mycol]};


    
    let editable = sudoku.puzzle[myrow*9+mycol] == '-';
    
    $selectedNumber = grid[myrow][mycol];
    if(!editable) return;
    $currentInput = editable ? e.key : grid[myrow][mycol];
    
1
    if (numberKeys.includes(e.key+'')) {
      grid[myrow][mycol] = parseInt(e.key, 10);
    }

    if(e.key == 'Delete' || e.key == 'Backspace') {
      grid[myrow][mycol] = 0;
      $selectedNumber = 0;
      $currentInput = 0;
    }

  }


</script>

<svelte:body on:keydown={onKeydown} />
<main>
  <p>{sudoku.puzzle}</p>
  <p>activeCell.r: {$activeCell.r}, activeCell.c: {$activeCell.c}</p>
  <p>myrow: {myrow}, mycol: {mycol}</p>
  <p>selectedNumber: {$selectedNumber}</p>
  <p>currentInput: {$currentInput}</p>
  <div class="board">
    {#each grid as row, r}
      <div class="row">
        {#each row as cell, c}
          <Cell
            active={$activeCell.c === c && $activeCell.r === r}
            value={cell}
            answer={sudoku.solution[r*9+c]}
            editable={sudoku.puzzle[r*9+c] == '-'}
            r={r} c={c}
            on:select={setActiveCell}
          />
        {/each}
      </div>
    {/each}
  </div>
</main>