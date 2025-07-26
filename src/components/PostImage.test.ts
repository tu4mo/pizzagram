import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PostImage from './PostImage.vue'

import { EMPTY_IMAGE } from '@/consts'

describe('PostImage', () => {
  it('renders as a div with image when no route is provided', () => {
    const wrapper = mount(PostImage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
      props: {
        imageUrl: 'test-image.jpg',
      },
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders as a RouterLink with image when route is provided', () => {
    const wrapper = mount(PostImage, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a><slot /></a>',
          },
        },
      },
      props: {
        thumbnail: true,
        to: { name: 'post', params: { id: '123' } },
      },
    })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('sets alt attribute on the image', () => {
    const wrapper = mount(PostImage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
      props: {
        alt: 'Test image',
      },
    })

    expect(wrapper.get('img').attributes('alt')).toBe('Test image')
  })

  it('uses empty image as fallback when no imageUrl is provided', () => {
    const wrapper = mount(PostImage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('img').attributes('src')).toBe(EMPTY_IMAGE)
  })
})
