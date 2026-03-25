import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Breadcrumb from '@/components/layout/Breadcrumb';

describe('Breadcrumb', () => {
  it('always renders home link', () => {
    render(<Breadcrumb items={[]} />);
    const home = screen.getByText('ホーム');
    expect(home.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders items as links when href is provided', () => {
    render(
      <Breadcrumb
        items={[
          { label: '求人一覧', href: '/jobs' },
          { label: 'エンジニア' },
        ]}
      />,
    );
    const jobsLink = screen.getByText('求人一覧');
    expect(jobsLink.closest('a')).toHaveAttribute('href', '/jobs');
  });

  it('renders last item as plain text when no href', () => {
    render(
      <Breadcrumb
        items={[
          { label: '求人一覧', href: '/jobs' },
          { label: 'エンジニア' },
        ]}
      />,
    );
    const current = screen.getByText('エンジニア');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveClass('font-medium');
  });

  it('has accessible label', () => {
    render(<Breadcrumb items={[{ label: 'テスト' }]} />);
    expect(screen.getByLabelText('パンくずリスト')).toBeInTheDocument();
  });

  it('renders separator between items', () => {
    const { container } = render(
      <Breadcrumb items={[{ label: 'ページ' }]} />,
    );
    expect(container.textContent).toContain('/');
  });
});
