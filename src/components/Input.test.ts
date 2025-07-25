import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Input from './Input.vue'

describe('Input', () => {
  it('renders with initial value', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'initial',
      },
    })
    expect(wrapper.element.value).toBe('initial')
  })

  it('emits update event when value changes', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('inherits HTML attributes', () => {
    const wrapper = mount(Input, {
      attrs: {
        placeholder: 'Type something...',
        type: 'email',
      },
      props: {
        modelValue: '',
      },
    })

    expect(wrapper.attributes('placeholder')).toBe('Type something...')
    expect(wrapper.attributes('type')).toBe('email')
  })

  it('handles borderless prop', () => {
    const withBorder = mount(Input, {
      props: {
        modelValue: '',
      },
    })
    expect(withBorder.element.className).not.toContain('input--borderless')

    const borderless = mount(Input, {
      props: {
        borderless: true,
        modelValue: '',
      },
    })
    expect(borderless.element.className).toContain('input--borderless')
  })
})
