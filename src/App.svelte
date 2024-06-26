<script>
  import { getSudoku } from 'sudoku-gen';
  // import { createGame } from './lib/game';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput, settings } from './lib/stores';
  import './components/board.css';
  import NumberGrid from './components/NumberGrid.svelte';
  import { humanReadableTime } from './lib/humanReadableTime';
  import { findOpenCell, structuredBoard } from './lib/functions';

  const difficultyLevel = ['easy', 'medium', 'hard', 'expert'];
  let selectedDifficulty;
  let showDebug = false;
  let completedGames = [];
  
  let sudoku = getSudoku('easy');
  // let sudoku = createGame('easy');
  let grid = structuredBoard(sudoku.puzzle);
  let history = [grid.flat().join('').replaceAll('0', '-')];
  $:gridFlat = grid.flat();
  $selectedNumber = grid[0][0];
  $activeCell = {r: 0, c: 0, v: grid[0][0]};
  
  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;
  $:solved = sudoku.solution.trim() == grid.flat().join('').trim();
  
  $:if (solved) {
    completedGames = [...completedGames, 
      {
        timeStamp: Date.now(),
        sudoku: sudoku,
        seconds: timeElapsed,
        time: humanReadableTime(timeElapsed) != '' ? humanReadableTime(timeElapsed) : '0 seconds',
      }
    ];
  }

$: fastestGame = completedGames.reduce((previous, current) => {
  return previous.seconds < current.seconds ? previous : current;
}, completedGames[0]);



  

  function setActiveCell(event) {
    const el = event.explicitOriginalTarget;
    el.focus();
    const {r, c, v} = event.detail;
    $selectedNumber = v;
    $activeCell = {r, c, v};
    if(paused && !solved) paused = false;
  }

  // function getColumn() {
  //   return grid.map((row) => row[$activeCell.c]);
  // }

  // function getRow() {
  //   return grid[$activeCell.r];
  // }

  


  function onKeydown(e) {
    e.preventDefault();
    const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace','d'];
    const numberKeys = ['1','2','3','4','5','6','7','8','9'];
    if (e.key == 'Tab') {
      if (e.shiftKey) {
        let rc = findOpenCell(sudoku, grid, 'backward', myrow, mycol);
        $activeCell = {r: rc.r, c: rc.c, v: grid[rc.r][rc.c]};
      } else {
        let rc = findOpenCell(sudoku, grid, 'forward', myrow, mycol);
        $activeCell = {r: rc.r, c: rc.c, v: grid[rc.r][rc.c]};
      }
    }

    // if(e.key == 'c') {
    //   console.log(getColumn());
    // }
    // if(e.key == 'r') {
    //   console.log(getRow());
    // }

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
 
    if (numberKeys.includes(e.key+'')) {
      grid[myrow][mycol] = parseInt(e.key, 10);
      history = [...history, grid.flat().join('').replaceAll('0', '-')];
    }

    if(e.key == 'Delete' || e.key == 'Backspace') {
      grid[myrow][mycol] = 0;
      $selectedNumber = 0;
      $currentInput = 0;
      history = [...history, grid.flat().join('').replaceAll('0', '-')];
    }

  }

  let showModal = false;
  let cancelRef;

  $: if(showModal) {paused = true;} else {paused = false;}

  function handleButtonClick() {
    if (solved) {
      generateBoard(selectedDifficulty);
    } else {
      showModal = true;
    }
  }
  
  function generateBoard(level) {
    sudoku = getSudoku(level);
    // sudoku = createGame(level);
    grid = structuredBoard(sudoku.puzzle);
    history = [grid.flat().join('').replaceAll('0', '-')];
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
    history = [grid.flat().join('').replaceAll('0', '-')];
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

  function solvePuzzle() {
    grid = structuredBoard(sudoku.solution);
    history = [grid.flat().join('').replaceAll('0', '-')];
  }

  function undo () {
    if (history.length > 1) {
      history = history.slice(0, -1);
      grid = structuredBoard(history[history.length - 1]);
    } else if (history.length == 1) {
      grid = structuredBoard(history[0]);
      $activeCell = {r: 0, c: 0, v: grid[0][0]};
    }
  }

</script>

<svelte:body on:keydown={onKeydown} />
<main>
  <h1>Sudoku</h1>
  <div class="controls">
    {#each difficultyLevel as level}
      <!-- <button class:selectedLevel={level == sudoku.difficulty && !solved} on:click={() => generateBoard(level)}>{level}</button> -->
      <button
        class:selectedLevel={level == sudoku.difficulty && !solved}
        on:click={() => {selectedDifficulty = level; handleButtonClick()}}
      >{level}</button>
    {/each}
    <button on:click={solvePuzzle}>solve</button>
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
    <div>
      <button class="btn-undo" on:click={undo}>undo</button>
      <button on:click={() => $settings.showHighlight = !$settings.showHighlight} class:highlight={$settings.showHighlight}>toggle highlight</button>
      <button on:click={() => $settings.showErrors = !$settings.showErrors} class:highlight={$settings.showErrors}>toggle show errors</button>
      <NumberGrid bind:gridFlat />
    </div>
  </div>

  <div class="flexcol">
    {#if completedGames.length > 0}
      <div class="completed">
        <h2>Completed Games</h2>
        <ol>
          {#each completedGames.reverse() as game}
            <li class="completed-item">
              {game.time} - {game.sudoku.difficulty} {fastestGame.timeStamp === game.timeStamp ? ' ** Fastest Game **' : ''}
              <button on:click={() => replay(game.sudoku) }>replay</button>
            </li>
          {/each}
        </ol>
      </div>
    {/if}

    <!-- <div class="history">
      <h2>History</h2>
      {#if history.length > 0}
        <button on:click={undo}>undo</button>
      {/if}
      {#each history as h, i}
       <p><small>{i}:{h}</small></p>
      {/each}
    </div> -->
  </div>

  {#if showModal}
  <div class="modal">
    <h2>Are you sure?</h2>
    <p>Progress will be lost.</p>
    <button on:click={() => {generateBoard(selectedDifficulty); showModal = false;}}>Yes, new puzzle</button>
    <button bind:this={cancelRef} on:click={() => showModal = false}>No, cancel</button>
  </div>
  {/if}
</main>

{#if showDebug}
<div class="debug">
  <p><small>toggle debug info by pressing 'd'</small></p>
  <p>settings: {JSON.stringify(settings)}</p>
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
