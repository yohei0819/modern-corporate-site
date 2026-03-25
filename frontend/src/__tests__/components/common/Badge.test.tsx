import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '@/components/common/Badge';

describe('Badge', () => {
  it('renders known category label', () => {
    render(<Badge category="info" />);
    expect(screen.getByText('お知らせ')).toBeInTheDocument();
  });

  it('renders press category with correct color', () => {
    render(<Badge category="press" />);
    const el = screen.getByText('プレスリリース');
    expect(el).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('renders event category', () => {
    render(<Badge category="event" />);
    expect(screen.getByText('イベント')).toBeInTheDocument();
  });

  it('renders blog category', () => {
    render(<Badge category="blog" />);
    expect(screen.getByText('ブログ')).toBeInTheDocument();
  });

  it('falls back to raw category string for unknown types', () => {
    render(<Badge category="unknown" />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('uses gray fallback color for unknown category', () => {
    render(<Badge category="unknown" />);
    const el = screen.getByText('unknown');
    expect(el).toHaveClass('bg-gray-100', 'text-gray-800');
  });
});
