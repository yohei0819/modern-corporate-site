import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton from '@/components/common/Skeleton';

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies skeleton class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('skeleton');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    expect(container.firstChild).toHaveClass('skeleton', 'h-4', 'w-full');
  });

  it('applies inline width and height', () => {
    const { container } = render(<Skeleton width="200px" height="100px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('100px');
  });
});
