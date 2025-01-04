import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSection } from '../CollapsibleSection';

describe('CollapsibleSection', () => {
  const defaultProps = {
    title: 'Test Section',
    children: <div>Test content</div>
  };

  it('renders title and content', () => {
    render(<CollapsibleSection {...defaultProps} />);
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('starts collapsed', () => {
    const { container } = render(<CollapsibleSection {...defaultProps} />);
    const content = screen.getByText('Test content').closest('.section-content');
    
    expect(content).toHaveClass('collapsed');
  });

  it('toggles content visibility on click', () => {
    const { container } = render(<CollapsibleSection {...defaultProps} />);
    const header = screen.getByText('Test Section').closest('.section-header');
    const content = screen.getByText('Test content').closest('.section-content');
    
    expect(content).toHaveClass('collapsed');
    
    fireEvent.click(header!);
    expect(content).not.toHaveClass('collapsed');
    
    fireEvent.click(header!);
    expect(content).toHaveClass('collapsed');
  });

  it('rotates collapse icon when toggled', () => {
    render(<CollapsibleSection {...defaultProps} />);
    const header = screen.getByText('Test Section').closest('.section-header');
    const icon = screen.getByText('▼');
    
    expect(icon).not.toHaveClass('expanded');
    
    fireEvent.click(header!);
    expect(icon).toHaveClass('expanded');
    
    fireEvent.click(header!);
    expect(icon).not.toHaveClass('expanded');
  });
});
