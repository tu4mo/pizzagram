import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Field from './Field.vue'

describe('Field', () => {
  it('renders the label text in a label element by default', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Username',
      },
    })
    expect(wrapper.find('label').text()).toBe('Username')
  })

  it('renders as a different element when specified', () => {
    const wrapper = mount(Field, {
      props: {
        as: 'div',
        label: 'Username',
      },
    })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Username',
      },
      slots: {
        default: '<input type="text" />',
      },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })
})
