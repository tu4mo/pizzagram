import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { useRoute } from 'vue-router'

import NavItem from './NavItem.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}))

describe('NavItem', () => {
  it('renders RouterLink with icon and title by default', () => {
    const wrapper = mount(NavItem, {
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<span><slot /></span>',
          },
          RouterLink: {
            props: ['to', 'ariaLabel'],
            template: '<a :to="to" :aria-label="ariaLabel"><slot /></a>',
          },
        },
      },
      props: {
        icon: 'home',
        title: 'Home',
        to: { name: 'home' },
      },
    })

    expect(wrapper.find('a').text()).toBe('Home')
  })

  it('shows badge when provided', () => {
    const wrapper = mount(NavItem, {
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<span><slot /></span>',
          },
          RouterLink: {
            props: ['to'],
            template: '<a :to="to"><slot /></a>',
          },
        },
      },
      props: {
        badge: 5,
        icon: 'bell',
        title: 'Notifications',
        to: { name: 'notifications' },
      },
    })

    expect(wrapper.text()).toContain('5')
  })

  it('renders as label when custom prop is true', async () => {
    vi.mocked(useRoute).mockReturnValue({
      name: 'home',
    } as any)

    const wrapper = mount(NavItem, {
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<span><slot /></span>',
          },
          RouterLink: true,
        },
      },
      props: {
        custom: true,
        icon: 'camera',
        title: 'Take Photo',
        to: { name: 'camera' },
      },
    })

    expect(wrapper.find('label').attributes('aria-current')).toBeUndefined()

    await wrapper.setProps({ to: { name: 'home' } })
    expect(wrapper.find('label').attributes('aria-current')).toBe('page')
  })
})
