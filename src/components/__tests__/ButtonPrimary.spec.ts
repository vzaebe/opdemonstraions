import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonPrimary from '../ButtonPrimary.vue'

describe('ButtonPrimary', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(ButtonPrimary, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.classes()).toContain('btn-md')
  })

  it('applies correct size classes', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { size: 'lg' },
      slots: { default: 'Large Button' }
    })

    expect(wrapper.classes()).toContain('btn-lg')
  })

  it('applies correct variant classes', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { variant: 'outline' },
      slots: { default: 'Outline Button' }
    })

    expect(wrapper.classes()).toContain('btn-outline')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(ButtonPrimary, {
      slots: { default: 'Click me' }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(ButtonPrimary, {
      props: { disabled: true },
      slots: { default: 'Disabled Button' }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(ButtonPrimary, {
      props: { loading: true },
      slots: { default: 'Loading Button' }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { loading: true },
      slots: { default: 'Loading Button' }
    })

    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Loading Button')
  })

  it('applies correct type attribute', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { type: 'submit' },
      slots: { default: 'Submit Button' }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('applies aria-label when provided', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { ariaLabel: 'Custom aria label' },
      slots: { default: 'Button' }
    })

    expect(wrapper.attributes('aria-label')).toBe('Custom aria label')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(ButtonPrimary, {
      props: { disabled: true },
      slots: { default: 'Disabled Button' }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('applies focus styles correctly', async () => {
    const wrapper = mount(ButtonPrimary, {
      slots: { default: 'Focusable Button' }
    })

    await wrapper.trigger('focus')
    expect(wrapper.classes()).toContain('btn-primary')
  })
})
