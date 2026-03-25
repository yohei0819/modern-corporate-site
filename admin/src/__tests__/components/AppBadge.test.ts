import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppBadge from '@/components/ui/AppBadge.vue';

describe('AppBadge', () => {
  it('renders label text', () => {
    const wrapper = mount(AppBadge, { props: { label: '公開中' } });
    expect(wrapper.text()).toBe('公開中');
  });

  it('applies default gray color', () => {
    const wrapper = mount(AppBadge, { props: { label: 'テスト' } });
    expect(wrapper.find('span').classes()).toContain('bg-gray-100');
  });

  it('applies green color', () => {
    const wrapper = mount(AppBadge, { props: { label: '公開', color: 'green' } });
    expect(wrapper.find('span').classes()).toContain('bg-green-100');
  });

  it('applies red color', () => {
    const wrapper = mount(AppBadge, { props: { label: '却下', color: 'red' } });
    expect(wrapper.find('span').classes()).toContain('bg-red-100');
  });

  it('applies blue color', () => {
    const wrapper = mount(AppBadge, { props: { label: '新着', color: 'blue' } });
    expect(wrapper.find('span').classes()).toContain('bg-blue-100');
  });
});
