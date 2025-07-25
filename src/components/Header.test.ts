import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Header from './Header.vue'
import Logo from './Logo.vue'

describe('Header', () => {
  it('renders a heading with Logo', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          RouterLink: true,
        },
      },
    })
    const logo = wrapper.get('h1').findComponent(Logo)
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('aria-hidden')).toBe('false')
  })

  it('renders title in the heading when provided', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          RouterLink: true,
        },
      },
      props: {
        title: 'My Profile',
      },
    })
    const heading = wrapper.get('h1')
    expect(heading.text()).toBe('My Profile')
    expect(heading.findComponent(Logo).attributes('aria-hidden')).toBe('true')
  })
})
