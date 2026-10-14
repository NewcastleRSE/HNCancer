<script lang="ts">
  // Single-select dropdown, with inline label and no disabled default option.
  // Also provides input for callback if changing selection needs to trigger additional
  // effects.
  type Option = {
    value: string;
    label: string;
  };

  let {
    label,
    options,
    selectedValue = $bindable(),
    onChange,
    useVisibleLabel = true,
  }: {
    label: string;
    options: readonly Option[];
    selectedValue: string;
    onChange?: () => void;
    useVisibleLabel?: boolean;
  } = $props();

  const selectId = $derived(`select-${label.toLowerCase()}`);
</script>

<div class="inline-select">
  {#if useVisibleLabel}
    <label for={selectId}>{label}:</label>
  {:else}
    <span>{label}:</span>
    <label class="visually-hidden" for={selectId}>{label}</label>
  {/if}

  <div class="select select-compact">
    <select id={selectId} bind:value={selectedValue} onchange={onChange}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .inline-select {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
