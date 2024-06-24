<script>
  import { selectedNumber, currentInput } from '../lib/stores';
  import { createEventDispatcher } from 'svelte';
    import CandidateGrid from './CandidateGrid.svelte';
  const dispatch = createEventDispatcher();

  export let active;
  export let value;
  export let r;
  export let c;
  export let editable;
  export let answer;
  export let showHighlight

  function handleClick(event) {
    dispatch('select', {v: parseInt(value) || 0, r:r, c:c});
    $currentInput = value;
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="cell"
  class:current={active}
  class:editable={editable}
  class:error={(answer != value) && (value != 0)}
  class:highlight={showHighlight && ($currentInput == value || $selectedNumber == value) && (value != 0)}
  on:click={handleClick}
>{value == 0 ? '' : value}
<!-- <span>{r},{c}</span> -->
 <!-- <CandidateGrid /> -->
</div>
