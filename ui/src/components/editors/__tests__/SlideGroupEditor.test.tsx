import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlideGroupEditor from '../SlideGroupEditor';
import { SlideType } from '../../../data/slide_interfaces';

const defaultProps = {
  type: SlideType.BULLET_LIST,
  content: ['Test bullet point'],
  onChange: jest.fn(),
};

describe('SlideGroupEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<SlideGroupEditor {...defaultProps} />);
    
    // Should show the slide type
    expect(screen.getByText('Bullet List')).toBeInTheDocument();
    
    // Should show the content
    expect(screen.getByDisplayValue('Test bullet point')).toBeInTheDocument();
  });

  it('handles collapse state', async () => {
    const { container } = render(<SlideGroupEditor {...defaultProps} />);
    
    // Should start collapsed
    expect(container.querySelector('.collapsed')).toBeInTheDocument();
    
    // TODO: Add collapse trigger once UI is finalized
  });

  it('calls onChange when content is modified', async () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByDisplayValue('Test bullet point');
    fireEvent.change(input, { target: { value: 'Test bullet point updated' } });
    
    expect(onChange).toHaveBeenCalledWith({
      content: ['Test bullet point updated']
    });
  });

  it('renders captions section', () => {
    const props = {
      ...defaultProps,
      captions: {
        top_center: 'Top caption',
        bottom_center: 'Bottom caption',
      }
    };
    
    render(<SlideGroupEditor {...props} />);
    
    expect(screen.getByDisplayValue('Top caption')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bottom caption')).toBeInTheDocument();
  });

  // TODO: Add tests for slide type switching once SpeedDial interaction is finalized
});
