import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ProfilePhoto from './ProfilePhoto.vue'

import type { User } from '@/api/user'
import { EMPTY_IMAGE } from '@/consts'

const mockUser: User = {
  createdAt: new Date(),
  gravatar: '123',
  id: 'test-id',
  postsCount: 0,
  username: 'testuser',
}

describe('ProfilePhoto', () => {
  const globalConfig = {
    stubs: {
      RouterLink: true,
    },
  }

  it('renders with default props', () => {
    const wrapper = mount(ProfilePhoto, { global: globalConfig })
    expect(wrapper.element.tagName).toBe('IMG')
    expect(wrapper.attributes('src')).toBe(EMPTY_IMAGE)
  })

  it('renders as RouterLink when asLink is true', () => {
    const wrapper = mount(ProfilePhoto, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
      props: {
        asLink: true,
        user: mockUser,
      },
    })

    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('generates correct Gravatar URL when user has gravatar', () => {
    const wrapper = mount(ProfilePhoto, {
      global: globalConfig,
      props: { user: mockUser },
    })

    expect(wrapper.attributes('src')).toBe(
      'https://www.gravatar.com/avatar/123?d=identicon&s=256',
    )
  })

  it('uses empty image when user has no gravatar', () => {
    const userWithoutGravatar: User = {
      ...mockUser,
      gravatar: '',
    }
    const wrapper = mount(ProfilePhoto, {
      global: globalConfig,
      props: { user: userWithoutGravatar },
    })

    expect(wrapper.attributes('src')).toBe(EMPTY_IMAGE)
  })

  it('sets correct alt text from username', () => {
    const wrapper = mount(ProfilePhoto, {
      global: globalConfig,
      props: { user: mockUser },
    })

    expect(wrapper.attributes('alt')).toBe('testuser')
  })
})
