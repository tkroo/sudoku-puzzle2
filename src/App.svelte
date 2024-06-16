<script>
  import { getSudoku } from 'sudoku-gen';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput } from './lib/stores';
  import './components/board.css';
  import NumberGrid from './components/NumberGrid.svelte';
  import { humanReadableTime } from './lib/humanReadableTime';

  const difficultyLevel = ['easy', 'medium', 'hard', 'expert'];
  let selectedDifficulty;
  let showDebug = false;
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

  function findOpenCell(searchDirection, rr=myrow, cc=mycol, firstRun=true) {
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
      return searchDirection == 'forward' ? findOpenCell('forward', 0, 0, false) : findOpenCell('backward', 8, 8, false);
    }
  }


  function onKeydown(e) {
    const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace','d'];
    const numberKeys = ['1','2','3','4','5','6','7','8','9'];
    if (e.key == ' ') {
      if (e.shiftKey) {
        let rc = findOpenCell('backward');
        $activeCell = {r: rc.r, c: rc.c, v: grid[rc.r][rc.c]};
        
      } else {
        let rc = findOpenCell('forward');
        $activeCell = {r: rc.r, c: rc.c, v: grid[rc.r][rc.c]};
        
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

  let showModal = false;
  let cancelRef;

  $: if(showModal) {paused = true;} else {paused = false;}
  
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
    {#each difficultyLevel as level}
      <!-- <button class:selectedLevel={level == sudoku.difficulty && !solved} on:click={() => generateBoard(level)}>{level}</button> -->
      <button class:selectedLevel={level == sudoku.difficulty && !solved} on:click={() => {selectedDifficulty = level; showModal = true; cancelRef.focus()}}>{level}</button>
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
  {#if showModal}
  <div class="modal">
    <h2>Are you sure?</h2>
    <p>Any unsaved progress will be lost.</p>
    <button on:click={() => {generateBoard(selectedDifficulty); showModal = false;}}>Yes, new puzzle</button>
    <button bind:this={cancelRef} on:click={() => showModal = false}>No, cancel</button>
  </div>
  {/if}
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
