<script lang="ts">
  type Option = {
    value: string;
    label: string;
  };

  let {
    label,
    options,
    selectedValue = $bindable(),
    onChange,
  }: {
    label: string;
    options: readonly Option[];
    selectedValue: string;
    onChange?: () => void;
  } = $props();
</script>

<label class="inline-select">
  {`${label}:`}
  <div class="select select-compact">
    <select
      id={`select-${label.toLowerCase()}`}
      bind:value={selectedValue}
      onchange={onChange}
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
</label>

<style>
  .inline-select {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
