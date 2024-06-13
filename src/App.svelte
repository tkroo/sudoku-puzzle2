<script>
  import { getSudoku } from 'sudoku-gen';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput } from './lib/stores';
  import './components/board.css';
  import NumberGrid from './components/NumberGrid.svelte';
  import { humanReadableTime } from './lib/humanReadableTime';

  const levels = ['easy', 'medium', 'hard', 'expert'];

  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;

  let sudoku = getSudoku('easy');
  let grid = structuredBoard(sudoku.puzzle);
  $:gridFlat = grid.flat();

  $:solved = sudoku.solution.trim() == grid.flat().join('').trim();

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
    if(paused && !solved) paused = false;
  }

  function onKeydown(e) {
    const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'];
    const numberKeys = ['1','2','3','4','5','6','7','8','9'];
    if (!directionKeys.includes(e.key) && !numberKeys.includes(e.key)) return;

    if (paused && !solved) paused = false;

    $currentInput = 0;
    $selectedNumber = 0;

    if (e.key == 'ArrowUp') myrow = (myrow + 9 - 1) % 9;
    if (e.key == 'ArrowDown') myrow = (myrow + 9 + 1) % 9;
    if (e.key == 'ArrowLeft') mycol = (mycol + 9 - 1) % 9;
    if (e.key == 'ArrowRight') mycol = (mycol + 9 + 1) % 9;
    $activeCell = {r: myrow, c: mycol, v: grid[myrow][mycol]};
    $selectedNumber = grid[myrow][mycol];
    
    let editable = sudoku.puzzle[myrow*9+mycol] == '-';
    if(!editable) return;
    $currentInput = editable ? e.key : grid[myrow][mycol];
 
    if (numberKeys.includes(e.key+'')) grid[myrow][mycol] = parseInt(e.key, 10);

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
    clearInterval(myInterval)
    timeElapsed = 0;
    paused = false;
    startInterval();
  }

  // TIMER
  let myInterval = null;
  let timeElapsed = 0;
  let paused = false;
  function startInterval() {
    clearInterval(myInterval)
		
    myInterval = setInterval(()=> {
      timeElapsed += 1;
    }, 1000)
		
	}
  $: if (paused) {
		clearInterval(myInterval)
	} else {
		startInterval();
	}

	$: if (solved) {
		paused = true;
	}

</script>

<svelte:body on:keydown={onKeydown} />
<main>
  <h1>Sudoku</h1>
  <div class="controls">
    {#each levels as level}
      <button class:selectedLevel={level == sudoku.difficulty} on:click={() => generateBoard(level)}>{level}</button>
    {/each}
  </div>
  <div class="timer">
    <button disabled={solved} on:click={() => paused = !paused}>{paused ? 'Resume' : 'Pause'}</button>
    <button disabled={solved} on:click={() => timeElapsed = 0}>Reset</button>
    <span>{solved ? 'Solved in ' : ''}{humanReadableTime(timeElapsed)}</span>
  </div>
  <div class="flexrow">
    <div class="board" class:solved>
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

<!-- <p>{sudoku.puzzle}</p> -->
<!-- <p>activeCell.r: {$activeCell.r}, activeCell.c: {$activeCell.c}</p> -->
<!-- <p>myrow: {myrow}, mycol: {mycol}</p> -->
<!-- <p>selectedNumber: {$selectedNumber}</p> -->
<!-- <p>currentInput: {$currentInput}</p> -->
<!-- <hr> -->
<!-- <p>{grid.flat().join('')}</p> -->
<!-- <p>{sudoku.solution}</p> -->
