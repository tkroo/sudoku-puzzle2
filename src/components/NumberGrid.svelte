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
    // const num = event.target.textContent;
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

<style>
  .wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: fit-content;
    border: 3px solid black;
    }
    .num {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3rem;
      height: 3rem;
      border: 1px solid #ccc;
      background-color: #ddd;
      color: #555;
    }

    .done {
      background-color: hsla(120, 100%, 25%, 0.5);
    }

</style>