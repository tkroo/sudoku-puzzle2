<script>
  import { getSudoku } from 'sudoku-gen';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput } from './lib/stores';
  import './components/board.css';
  import NumberGrid from './components/NumberGrid.svelte';

  const levels = ['easy', 'medium', 'hard', 'expert'];
  

  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;

  let sudoku = getSudoku('easy');
  let grid = structuredBoard(sudoku.puzzle);
  $:gridFlat = grid.flat();


  function structuredBoard(sudokuString) {
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


  function setActiveCell(event) {
    const {r, c, v} = event.detail;
    $selectedNumber = v;
    $activeCell = {r, c, v};
  }

  function onKeydown(e) {
    if (!directionKeys.includes(e.key) && !numberKeys.includes(e.key)) return;

    $currentInput = 0;
    $selectedNumber = 0;

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

    if (numberKeys.includes(e.key+'')) {
      grid[myrow][mycol] = parseInt(e.key, 10);
    }

    if(e.key == 'Delete' || e.key == 'Backspace') {
      grid[myrow][mycol] = 0;
      $selectedNumber = 0;
      $currentInput = 0;
    }

  }

  function generateBoard(level) {
    sudoku = getSudoku(level);
    grid = structuredBoard(sudoku.puzzle);
    $activeCell = {r: 0, c: 0, v: grid[0][0]};
    $currentInput = 0;
    $selectedNumber = 0;
  }

</script>

<svelte:body on:keydown={onKeydown} />
<main>
  <p>{sudoku.puzzle}</p>
  <p>activeCell.r: {$activeCell.r}, activeCell.c: {$activeCell.c}</p>
  <p>myrow: {myrow}, mycol: {mycol}</p>
  <p>selectedNumber: {$selectedNumber}</p>
  <p>currentInput: {$currentInput}</p>
  <div class="controls">
    {#each levels as level}
      <button on:click={() => generateBoard(level)}>{level}</button>
    {/each}
  </div>
  <div class="flexrow">
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
    <NumberGrid bind:gridFlat />
  </div>
</main>
