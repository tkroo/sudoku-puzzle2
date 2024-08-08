<script>
  import { onMount } from 'svelte';
  import { Game } from './lib/game';
  import Cell from './components/Cell.svelte';
  import { activeCell, selectedNumber, currentInput, settings } from './lib/stores';
  // import NumberGrid from './components/NumberGrid.svelte';
  import InputGrid from './components/InputGrid.svelte';
  import './components/board.css';

  const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];
  let selectedDifficulty = 'easy';
  let showDebug = false;
  let showInput = true;

  // const emptyGrid = () => Array(9).fill().map(() => Array(9).fill('-'));
  let sudoku = { puzzle:  '', solution: '', grid: [] };

  
  $:myrow = $activeCell.r;
  $:mycol = $activeCell.c;
  $:solved = sudoku.solution.trim() == sudoku.grid.flat().join('').trim();  

  onMount(() => {
    generateBoard(selectedDifficulty);
    $selectedNumber = sudoku.grid[0][0];
    $activeCell = {r: 0, c: 0, v: sudoku.grid[0][0]};
  });


  function touchInput() {
    // todo, use numbergrid to get input number
  }


  function setActiveCell(event) {
    const el = event.explicitOriginalTarget;
    el.focus();
    const {r, c, v} = event.detail;
    $selectedNumber = v;
    $activeCell = {r, c, v};
  }


  function updatePosition(currentRow, currentCol, key) {
    let r = currentRow;
    let c = currentCol;
    switch (key) {
      case 'ArrowUp':
        r = (currentRow + 9 - 1) % 9;
        c = currentCol;
        break;
      case 'ArrowDown':
        r = (currentRow + 9 + 1) % 9;
        c = currentCol;
        break;
      case 'ArrowLeft':
        r = currentRow;
        c = (currentCol + 9 - 1) % 9;
        break;
      case 'ArrowRight':
        r = currentRow;
        c = (currentCol + 9 + 1) % 9;
        break;
    }
    return {r,c}
  }

  function onKeydown(e) {
    // e.preventDefault();
    const directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace','d'];
    const numberKeys = ['1','2','3','4','5','6','7','8','9'];
    if (!directionKeys.includes(e.key) && !numberKeys.includes(e.key)) return;

    $currentInput = 0;
    $selectedNumber = 0;
    if (e.key == 'd') showDebug = !showDebug;
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
      const {r, c} = updatePosition(myrow, mycol, e.key);
      myrow = r;
      mycol = c;
    }
    
    $activeCell = {r: myrow, c: mycol, v: sudoku.grid[myrow][mycol]};
    $selectedNumber = sudoku.grid[myrow][mycol];
    
    let editable = sudoku.puzzle[myrow*9+mycol] == '-';
    if(!editable) return;
    $currentInput = editable ? e.key : sudoku.grid[myrow][mycol];
 
    if (numberKeys.includes(e.key+'')) {
      sudoku.grid[myrow][mycol] = parseInt(e.key, 10);
      $selectedNumber = sudoku.grid[myrow][mycol];
    }

    if(e.key == 'Delete' || e.key == 'Backspace') {
      sudoku.grid[myrow][mycol] = 0;
      $selectedNumber = 0;
      $currentInput = 0;
    }

  }

  function generateBoard(level) {
    // sudoku = getSudoku(level);
    sudoku = Game(level);
    $activeCell = {r: 0, c: 0, v: sudoku.grid[0][0]};
    $currentInput = 0;
    $selectedNumber = sudoku.grid[0][0];
  }

  function solvePuzzle() {
    sudoku.solve();
    sudoku=sudoku;
  }

  function setCurrentCell(e) {
    let editable = sudoku.puzzle[myrow*9+mycol] == '-';
    if(!editable) return;
    let v = parseInt(e.detail.value);
    $selectedNumber = v;
    // const {r, c} = $activeCell;
    sudoku.grid[myrow][mycol] = v;
  }

</script>

<svelte:body on:keydown={onKeydown} />
<main>
  <h1>Sudoku</h1>
  <div class="controls">
    {#each DIFFICULTIES as level}
      <!-- <button class:selectedLevel={level == sudoku.difficulty && !solved} on:click={() => generateBoard(level)}>{level}</button> -->
      <button
        class:selectedLevel={level == sudoku.difficulty && !solved}
        on:click={() => {selectedDifficulty = level; generateBoard(level)}}
      >{level}</button>
    {/each}
    <button on:click={solvePuzzle}>solve</button>
  </div>
  <div class="flexrow">
    <div class="board" class:solved>
      {#each sudoku.grid as row, r}
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
      <button on:click={() => $settings.showHighlight = !$settings.showHighlight} class:highlight={$settings.showHighlight}>toggle highlight</button>
      <button on:click={() => $settings.showErrors = !$settings.showErrors} class:highlight={$settings.showErrors}>toggle show errors</button>
      <InputGrid on:chooseNumber={ setCurrentCell }/>
      <!-- <NumberGrid g={sudoku.grid} /> -->
    </div>
  </div>


</main>

{#if showDebug}
<div class="debug">
  <p><small>toggle debug info by pressing 'd'</small></p>
  <hr>
  <p>sudoku: {JSON.stringify(sudoku)}</p>
  <p>sudoku.grid: {sudoku.grid.flat().join('')}</p>
  <p>sudoku.solution.trim() == sudoku.grid.flat().join('').trim()</p>
  <hr>
  <p>settings: {JSON.stringify(settings)}</p>
  <p>grid: {sudoku.grid}</p>
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