<script lang="ts">
  type Option = {
    value: string;
    label: string;
  };

  interface Props {
    options: readonly Option[];
    selectedValues?: string[];
  }

  let { options, selectedValues = $bindable([]) }: Props = $props();
</script>

<fieldset class="checkbox-group">
  {#each options as option}
    <label class="checkbox-option">
      <input
        type="checkbox"
        value={option.value}
        // Whether already checked
        checked={selectedValues.includes(option.value)}
        // When clicked, add/remove this checkbox's value from selectedValues
        onchange={(event) => {
          const checked = (event.currentTarget as HTMLInputElement).checked;

          if (checked) {
            selectedValues = [...selectedValues, option.value];
          } else {
            selectedValues = selectedValues.filter(
              (item) => item !== option.value,
            );
          }
        }}
      />

      {option.label}
    </label>
  {/each}
</fieldset>

<style>
  .checkbox-group {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    margin-left: 3rem;
  }
</style>
