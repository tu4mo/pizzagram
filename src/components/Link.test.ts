import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Link from './Link.vue'

describe('Link', () => {
  it('renders RouterLink with correct props and slot content', () => {
    const wrapper = mount(Link, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
      props: {
        to: '/profile',
      },
      slots: {
        default: 'Go to profile',
      },
    })
    expect(wrapper.attributes('href')).toBe('/profile')
    expect(wrapper.text()).toBe('Go to profile')
  })
})
