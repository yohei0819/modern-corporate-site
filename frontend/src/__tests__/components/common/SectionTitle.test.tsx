import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionTitle from '@/components/common/SectionTitle';

describe('SectionTitle', () => {
  it('renders title text', () => {
    render(<SectionTitle title="テストタイトル" />);
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionTitle title="タイトル" subtitle="サブタイトル" />);
    expect(screen.getByText('サブタイトル')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<SectionTitle title="タイトル" />);
    expect(screen.queryByText('サブタイトル')).not.toBeInTheDocument();
  });

  it('centers by default', () => {
    render(<SectionTitle title="タイトル" />);
    const heading = screen.getByText('タイトル');
    expect(heading.parentElement).toHaveClass('text-center');
  });

  it('aligns left when specified', () => {
    render(<SectionTitle title="タイトル" align="left" />);
    const heading = screen.getByText('タイトル');
    expect(heading.parentElement).not.toHaveClass('text-center');
  });
});
