<template>
  <ul class="select">
    <li v-for="option in options" :key="option.value" class="select__item">
      <label class="select__label">
        <input
          :checked="option.value === value"
          :name="name"
          :value="option.value"
          class="select__input"
          type="radio"
          @change="$emit('change', option.value)"
        />
        {{ option.label }}
      </label>
    </li>
    <li class="select__item">
      <label class="select__label">
        <input
          :checked="customItem === value"
          :name="name"
          :value="customItem"
          class="select__input"
          type="radio"
          @change="$emit('change', customItem)"
        />
        <BaseInput
          :value="customItem"
          borderless
          placeholder="Add new location"
          @input="onCustomItemInput"
        />
      </label>
    </li>
  </ul>
</template>

<script lang="ts">
  import { createComponent, ref } from "@vue/composition-api";

  import BaseInput from "./BaseInput.vue";

  export default createComponent({
    components: {
      BaseInput
    },
    props: {
      name: {
        required: true,
        type: String
      },
      options: {
        type: Array,
        default: () => []
      },
      value: {
        required: true,
        type: String
      }
    },
    setup(props, context) {
      const customItem = ref("");

      const onCustomItemInput = (value: string) => {
        customItem.value = value;
        context.emit("change", value);
      };

      return {
        customItem,
        onCustomItemInput
      };
    }
  });
</script>

<style lang="scss" scoped>
  .select {
    background-color: var(--color-background);
    border: 1px solid var(--color-light);
    border-radius: 0.25rem;
    display: block;
    font-size: 1rem;
    list-style-type: none;

    &__item {
      padding: 1rem;

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-light);
      }
    }

    &__label {
      align-items: center;
      display: flex;
    }

    &__input {
      margin-right: 0.5rem;
    }
  }
</style>
