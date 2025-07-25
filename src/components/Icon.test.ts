import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Icon from './Icon.vue'

describe('Icon', () => {
  it('renders the specified icon', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'heart',
      },
    })
    expect(wrapper.html()).toContain('feather feather-heart')
  })

  it('handles fill prop', async () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'heart',
      },
    })
    const element = wrapper.find('div')
    expect(element.classes()).toContain('icon')
    expect(element.classes()).not.toContain('icon--fill')

    await wrapper.setProps({ fill: true })
    expect(element.classes()).toContain('icon')
    expect(element.classes()).toContain('icon--fill')
  })
})
