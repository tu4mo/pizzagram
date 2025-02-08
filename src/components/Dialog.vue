<script setup lang="ts">
  import { ref, watch } from 'vue'

  const { isOpen } = defineProps<{ isOpen: boolean }>()

  const emit = defineEmits<{ close: [] }>()

  const dialog = ref<HTMLDialogElement | null>(null)
  const dialogContent = ref<HTMLDivElement | null>(null)

  watch(
    [() => isOpen, () => dialog.value],
    ([isOpen]) => {
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
    align-items: end;
    background-color: transparent;
    border: 0;
    grid-template-columns: 100%;
    height: 100dvh;
    justify-items: center;
    max-height: none;
    max-width: none;
    outline: none;
    overscroll-behavior: contain;
    padding-top: 64px;
    transition:
      display var(--transition-slow) allow-discrete,
      overlay var(--transition-slow) allow-discrete;
    width: 100%;

    &[open] {
      display: grid;
    }
  }

  .dialog::backdrop {
    background-color: rgba(0, 0, 0, 0);
    transition:
      display var(--transition-slow) allow-discrete,
      overlay var(--transition-slow) allow-discrete,
      background-color var(--transition-slow);
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

  @media (min-width: 640px) {
    .dialog {
      align-items: center;
      padding: 2rem;
    }

    .dialog__content {
      animation: slideUp var(--transition-slow);
      border-radius: var(--radius-lg);
      padding-top: 0;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(32px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
