import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('renders a loading spinner with correct accessibility attributes', () => {
    const wrapper = mount(Spinner)
    const spinner = wrapper.get('div[role="alert"]')

    expect(spinner.attributes('aria-busy')).toBe('true')
  })

  it('renders slot content when provided', () => {
    const wrapper = mount(Spinner, {
      slots: {
        default: 'Loading...',
      },
    })

    expect(wrapper.text()).toBe('Loading...')
  })
})
