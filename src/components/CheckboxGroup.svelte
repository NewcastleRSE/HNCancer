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

  // State for select all/none

  const allSelected = $derived(
    options.length > 0 && selectedValues.length === options.length,
  );

  const someSelected = $derived(
    selectedValues.length > 0 && selectedValues.length < options.length,
  );

  function indeterminate(element: HTMLInputElement, value: boolean) {
    element.indeterminate = value;

    return {
      update(value: boolean) {
        element.indeterminate = value;
      },
    };
  }
</script>

<fieldset class="checkbox-group">
  <label class="checkbox-option select-all">
    <input
      type="checkbox"
      use:indeterminate={someSelected}
      checked={allSelected}
      onchange={() => {
        selectedValues = allSelected
          ? []
          : options.map((option) => option.value);
      }}
    />

    Select all
  </label>

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

  .select-all {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.25rem;
    padding-bottom: 0.35rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid var(--bulma-border);
  }
</style>
