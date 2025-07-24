import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Button from './Button.vue'

describe('Button', () => {
  it('renders a button element by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders with custom component when specified', () => {
    const wrapper = mount(Button, {
      props: {
        component: 'a',
      },
    })
    expect(wrapper.element.tagName).toBe('A')
  })

  it('applies secondary class when secondary prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        secondary: true,
      },
    })
    expect(wrapper.classes()).toContain('button--secondary')
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('passes attributes to the root element', () => {
    const wrapper = mount(Button, {
      attrs: {
        'data-testid': 'test-button',
        'disabled': true,
      },
    })
    expect(wrapper.attributes('disabled')).toBe('')
    expect(wrapper.attributes('data-testid')).toBe('test-button')
  })
})
