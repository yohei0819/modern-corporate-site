import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />);
    expect(screen.getByText('CORP.')).toBeInTheDocument();
  });

  it('renders navigation sections', () => {
    render(<Footer />);
    expect(screen.getByText('企業情報')).toBeInTheDocument();
    expect(screen.getByText('採用情報')).toBeInTheDocument();
    expect(screen.getByText('その他')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '会社紹介' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: '募集職種' })).toHaveAttribute('href', '/jobs');
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/テクノロジーで未来を創る/)).toBeInTheDocument();
  });
});
