<script>
  export let nums = [1,2,3,4,5,6,7,8,9];

</script>

<div class="candidates-wrap">
  <div class="candidates">
    {#each nums as candidate}
      <div class="candidate">{candidate}</div>
    {/each}
  </div>
</div>

<style>
  .candidates-wrap {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .candidates {
    width: 100%;
    padding: 0.25rem;
    line-height: 0.8;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 0.25rem;
    font-weight: 400;
    font-size: 0.8rem;
    color: #666;
  }
</style>