import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Spacer from './Spacer.vue'

describe('Spacer', () => {
  it('applies gap style based on prop', () => {
    const wrapper = mount(Spacer, {
      props: {
        gap: '2'
      }
    })

    expect(wrapper.attributes('style')).toBe('gap: 2rem;')
  })

  it('renders slot content', () => {
    const wrapper = mount(Spacer, {
      props: {
        gap: '1'
      },
      slots: {
        default: '<div>Content</div>'
      }
    })

    expect(wrapper.html()).toContain('<div>Content</div>')
  })
})
