<script>
  import { selectedNumber, currentInput } from '../lib/stores';
  const nums = [7,8,9,4,5,6,1,2,3];
  export let g;


  $: countAppearances = () => {
    const b = g.flat().filter(x => x != '0');
    const counts = {};
    for (const num of b) {
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
  }

  function handleClick(event) {
    $currentInput = 0;
    $selectedNumber = event.target.textContent;
  }

</script>

<div class="number-grid">
  {#each nums as value, index}
    <button
      class="num"
      class:done={countAppearances()[value] == 9}
      on:click={handleClick}>{value}
    </button>
  {/each}
</div>
