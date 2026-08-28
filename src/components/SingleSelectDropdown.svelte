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

<label>
  {`${label}:`}
  <select bind:value={selectedValue} onchange={onChange}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</label>
