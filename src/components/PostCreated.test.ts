import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import PostCreated from './PostCreated.vue'

describe('PostCreated', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows empty string when no date is provided', () => {
    const wrapper = mount(PostCreated, {
      props: {
        createdAt: undefined,
      },
    })

    expect(wrapper.text()).toBe('')
  })

  it('shows relative time in minutes when less than an hour old', () => {
    const now = new Date('2025-08-09T12:00:00')
    vi.setSystemTime(now)

    const wrapper = mount(PostCreated, {
      props: {
        createdAt: new Date('2025-08-09T11:45:00'), // 15 minutes ago
      },
    })

    expect(wrapper.text()).toBe('15 minutes ago')
  })

  it('shows relative time in hours when less than a day old', () => {
    const now = new Date('2025-08-09T12:00:00')
    vi.setSystemTime(now)

    const wrapper = mount(PostCreated, {
      props: {
        createdAt: new Date('2025-08-09T08:00:00'), // 4 hours ago
      },
    })

    expect(wrapper.text()).toBe('4 hours ago')
  })

  it('shows relative time in days when less than 5 days old', () => {
    const now = new Date('2025-08-09T12:00:00')
    vi.setSystemTime(now)

    const wrapper = mount(PostCreated, {
      props: {
        createdAt: new Date('2025-08-07T12:00:00'), // 2 days ago
      },
    })

    expect(wrapper.text()).toBe('2 days ago')
  })

  it('shows full date when 5 or more days old', () => {
    const now = new Date('2025-08-09T12:00:00')
    vi.setSystemTime(now)

    const oldDate = new Date('2025-08-01T12:00:00') // 8 days ago
    const wrapper = mount(PostCreated, {
      props: {
        createdAt: oldDate,
      },
    })

    expect(wrapper.text()).toBe('8/1/2025')
  })
})
