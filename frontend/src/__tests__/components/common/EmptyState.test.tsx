import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from '@/components/common/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="データがありません" />);
    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="タイトル" description="詳細説明" />);
    expect(screen.getByText('詳細説明')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="タイトル" />);
    expect(screen.queryByText('詳細説明')).not.toBeInTheDocument();
  });

  it('renders default icon', () => {
    render(<EmptyState title="タイトル" />);
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState title="タイトル" icon="🔍" />);
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('renders action link when provided', () => {
    render(<EmptyState title="タイトル" actionLabel="トップへ" actionHref="/" />);
    const link = screen.getByRole('link', { name: 'トップへ' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('does not render action when label or href is missing', () => {
    render(<EmptyState title="タイトル" actionLabel="トップへ" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
