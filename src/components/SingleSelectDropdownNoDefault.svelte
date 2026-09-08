<script lang="ts">
  // Single-select dropdown, with no selection by default.
  // Unlike SingleSelectDropdown, does not include label.

  type Option = {
    value: string;
    label: string;
  };

  let {
    id,
    defaultDisabledText,
    options,
    selectedValue = $bindable(""),
  }: {
    id: string;
    defaultDisabledText: string;
    options: readonly Option[];
    selectedValue: string;
  } = $props();
</script>

<div class="select select-compact">
  <select id={`select-${id.toLowerCase()}`} bind:value={selectedValue}>
    <!-- Initial default - will be disabled when changed -->
    <option value="" disabled>{defaultDisabledText}</option>

    <!-- Options -->
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style>
</style>
