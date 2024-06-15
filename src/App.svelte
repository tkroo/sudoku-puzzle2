<script>
  import { getSudoku } from 'sudoku-gen';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput } from './lib/stores';
  import './components/board.css';
  import NumberGrid from './components/NumberGrid.svelte';
  import { humanReadableTime } from './lib/humanReadableTime';

  const levels = ['easy', 'medium', 'hard', 'expert'];
  let showDebug = true;
  let completedGames = [];
  
  let sudoku = getSudoku('easy');
  let grid = structuredBoard(sudoku.puzzle);
  $:gridFlat = grid.flat();
  $selectedNumber = grid[0][0];
  $activeCell = {r: 0, c: 0, v: grid[0][0]};
  
  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;
  $:solved = sudoku.solution.trim() == grid.flat().join('').trim();

  $:if (solved) {
    completedGames = [...completedGames, 
      {
        sudoku: sudoku,
        time: humanReadableTime(timeElapsed)
      }
    ];
  }

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


  function findOpenCell(direction) {
    // let myArr = grid.map((r, rIdx) => r.map((c, cIdx) => ({r: rIdx, c: cIdx, v: c})).filter(el => el.v === 0)).flat();
    if (grid.flat().every(x => x != 0)) return;
    // if (myArr.length < 1) return;
    console.log('direction', direction);
    let row = myrow;
    let col = mycol;
    console.log('myrow: ', myrow, 'mycol:', mycol);
    if(direction == 'forward') {
      // find next occurance of 0, starting from current row
      for (let r = row; r < 9; r++) {
        let tmp = nextInRow(r, col);
        if(tmp.found) {
          return {row: tmp.nr, col: tmp.nc};
        } else {
          col = 0;
        }
      }
    } else if(direction == 'backward') {
      // find previous occurance of 0, starting from current row
      for (let r = row; r >= 0; r--) {
        let tmp = prevInRow(r, col);
        if(tmp.found) {
          return {row: tmp.pr, col: tmp.pc};
        } else {
          col = 8;
        }
      }
    } else {
      console.log('unknown direction', direction);
      return;
    }

    function nextInRow(row, col) {
      col = col + 1;
      if (col > 8) {
        col = 0;
        row += 1;
      }
      if (row > 8) {
        row = 0;
      }
      // search for next 0 in current row
      for (let i = col; i < 9; i++) {
        if (grid[row][i] === 0) {
          return {nr: row, nc: i, found: true};
        }
      }
      return {found: false};
    }
    
    function prevInRow(row, col) {
      // search for previous 0 in current row
      col = col - 1;
      if (col < 0) {
        col = 8;
        row -= 1;
      }
      if (row < 0) {
        row = 8;
      }
      for (let i = col; i >= 0; i--) {
        if (grid[row][i] === 0) {
          return {pr: row, pc: i, found: true};
        }
      }
      return {found: false};
    }
  }

  function onKeydown(e) {
    const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace','d'];
    const numberKeys = ['1','2','3','4','5','6','7','8','9'];
    if (e.key == ' ') {
      if (e.shiftKey) {
        let rc = findOpenCell('backward');
        console.log('rc', rc);
        $activeCell = {r: rc.row, c: rc.col, v: grid[rc.row][rc.col]};
      } else {
        let rc = findOpenCell('forward');
        console.log('rc', rc);
        $activeCell = {r: rc.row, c: rc.col, v: grid[rc.row][rc.col]};
      }
    }

    if (!directionKeys.includes(e.key) && !numberKeys.includes(e.key)) return;

    if (paused && !solved) paused = false;

    $currentInput = 0;
    $selectedNumber = 0;
    if (e.key == 'd') showDebug = !showDebug;
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
    $selectedNumber = grid[0][0];
    clearInterval(myInterval)
    timeElapsed = 0;
    paused = false;
    startInterval();
  }

  function replay(s) {
    sudoku = s;
    grid = structuredBoard(sudoku.puzzle);
    $activeCell = {r: 0, c: 0, v: grid[0][0]};
    $currentInput = 0;
    $selectedNumber = grid[0][0];
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
      <button class:selectedLevel={level == sudoku.difficulty && !solved} on:click={() => generateBoard(level)}>{level}</button>
    {/each}
    <button on:click={() => grid = structuredBoard(sudoku.solution)}>solve</button>
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
  <div class="flexcol">
    {#if completedGames.length > 0}
      <div class="completed">
        <h2>Completed Games</h2>
        <ol>
          {#each completedGames.reverse() as game}
            <li>{game.time} - {game.sudoku.difficulty}
              <button on:click={() => replay(game.sudoku) }>replay</button>
            </li>
          {/each}
        </ol>
      </div>
      {/if}
  </div>
  
</main>

{#if showDebug}
<div class="debug">
  <p><small>toggle debug info by pressing 'd'</small></p>
  <p>{JSON.stringify(grid)}</p>
  <p>grid[0][0] : {grid[0][0]}</p>
  <p>typeof grid[0][0] : {typeof grid[0][0]}</p>
  <p>activeCell.r: {$activeCell.r}, activeCell.c: {$activeCell.c}</p>
  <p>myrow: {myrow}, mycol: {mycol}</p>
  <p>selectedNumber: {$selectedNumber}</p>
  <p>currentInput: {$currentInput}</p>
  <!-- <hr> -->
  <!-- <p>{grid.flat().join('')}</p> -->
  <!-- <p>{sudoku.puzzle}</p> -->
  <!-- <p>{sudoku.solution}</p> -->
</div>
{/if}
