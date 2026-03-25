import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppPagination from '@/components/ui/AppPagination.vue';

describe('AppPagination', () => {
  it('does not render when lastPage is 1', () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 1, lastPage: 1 } });
    expect(wrapper.find('nav').exists()).toBe(false);
  });

  it('renders when lastPage > 1', () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 1, lastPage: 3 } });
    expect(wrapper.find('nav').exists()).toBe(true);
  });

  it('disables prev button on first page', () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 1, lastPage: 3 } });
    const prevBtn = wrapper.findAll('button').find(b => b.text() === '前へ');
    expect(prevBtn?.attributes('disabled')).toBeDefined();
  });

  it('disables next button on last page', () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 3, lastPage: 3 } });
    const nextBtn = wrapper.findAll('button').find(b => b.text() === '次へ');
    expect(nextBtn?.attributes('disabled')).toBeDefined();
  });

  it('emits update:currentPage on page click', async () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 1, lastPage: 3 } });
    const page2Btn = wrapper.findAll('button').find(b => b.text() === '2');
    await page2Btn?.trigger('click');
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([2]);
  });

  it('emits update:currentPage on next click', async () => {
    const wrapper = mount(AppPagination, { props: { currentPage: 1, lastPage: 3 } });
    const nextBtn = wrapper.findAll('button').find(b => b.text() === '次へ');
    await nextBtn?.trigger('click');
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([2]);
  });
});
