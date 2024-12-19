<script setup lang="ts">
  import { ref, watch } from 'vue'

  const { isOpen } = defineProps<{ isOpen: boolean }>()

  const emit = defineEmits<{ close: [] }>()

  const dialog = ref<HTMLDialogElement | null>(null)
  const dialogContent = ref<HTMLDivElement | null>(null)

  watch(
    () => isOpen && dialog.value,
    (isOpen) => {
      if (!dialog.value) {
        return
      }

      if (isOpen) {
        dialog.value.showModal()
      } else {
        dialog.value.close()
      }
    },
    { immediate: true },
  )

  function onDialogClick(event: MouseEvent) {
    const rect = dialogContent.value?.getBoundingClientRect()

    if (
      rect &&
      (rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY)
    ) {
      dialog.value?.close()
    }
  }
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    @close="emit('close')"
    @click="onDialogClick"
  >
    <div ref="dialogContent" class="dialog__content">
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
  .dialog {
    -webkit-overflow-scrolling: touch;
    align-items: end;
    background-color: transparent;
    border: 0;
    grid-template-columns: 100%;
    height: 100%;
    justify-items: center;
    max-height: none;
    max-width: none;
    outline: none;
    padding-top: 64px;
    position: relative;
    width: 100%;
  }

  .dialog[open] {
    display: grid;
  }

  .dialog::backdrop {
    background-color: rgba(0, 0, 0, 0);
    transition:
      display var(--transition-fast) allow-discrete,
      overlay var(--transition-fast) allow-discrete,
      background-color var(--transition-fast);
  }

  .dialog[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
  }

  @starting-style {
    .dialog[open]::backdrop {
      background-color: rgb(0, 0, 0, 0);
    }
  }

  .dialog__content {
    background-color: var(--color-background);
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
    max-width: var(--content-width);
    padding-top: var(--radius-md);
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;
  }

  .dialog[open] .dialog__content {
    animation: slide-up var(--transition-fast);
  }

  @media (min-width: 640px) {
    .dialog {
      align-items: center;
      padding: 2rem;
    }

    .dialog__content {
      border-radius: var(--radius-lg);
      padding-top: 0;
    }
  }

  @keyframes slide-up {
    from {
      display: none;
      transform: translateY(100%);
    }

    to {
      display: block;
      transform: translateY(0);
    }
  }
</style>
