<script>
  import { selectedNumber, currentInput } from '../lib/stores';
  const nums = [7,8,9,4,5,6,1,2,3];
  export let gridFlat;

  $: countAppearances = () => {
    const b = gridFlat.filter(x => x != '0');
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

<div class="wrap">
  {#each nums as value, index}
    <div
      class="num"
      class:done={countAppearances()[value] == 9}
      on:click={handleClick}>{value}
    </div>
  {/each}
</div>
