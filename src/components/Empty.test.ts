import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Empty from './Empty.vue'

describe('Empty', () => {
  it('renders slot content', () => {
    const wrapper = mount(Empty, {
      slots: {
        default: 'No content',
      },
    })
    expect(wrapper.text()).toBe('No content')
  })
})
