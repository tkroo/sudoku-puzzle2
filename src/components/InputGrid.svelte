<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  // const nums = [7,8,9,4,5,6,1,2,3];
  const nums = [1,2,3,4,5,6,7,8,9];
  
  function handleClick(event) {
    let value = parseInt(event.target.textContent); 
    dispatch('chooseNumber', {value: value});
  }

</script>

<div class="input-grid">
  {#each nums as value, index}
    <button
      class="num"
      on:click={handleClick}>{value}
    </button>
  {/each}
  <button class="num" on:click={() => dispatch('chooseNumber', {value: 0})}>clear</button>
</div>