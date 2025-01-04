import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlideGroupEditor from '../SlideGroupEditor';
import { SlideType } from '../../../data/slide_interfaces';
import { BulletSlideConfig } from '../slide_editor_types';

const defaultProps = {
  type: SlideType.BULLET_LIST,
  config: {
    type: 'bullet',
    content: ['Test bullet point'],
    captions: {
      top_center: '',
      bottom_center: '',
    },
  } as BulletSlideConfig,
  onChange: jest.fn(),
};

describe('SlideGroupEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<SlideGroupEditor {...defaultProps} />);
    
    // Should show the slide type in the Typography component
    expect(screen.getByRole('heading', { level: 6, name: 'Bullet List' })).toBeInTheDocument();
    
    // Should show the content
    expect(screen.getByDisplayValue('Test bullet point')).toBeInTheDocument();
  });

  it('calls onChange when content is modified', async () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByDisplayValue('Test bullet point');
    fireEvent.change(input, { target: { value: 'Test bullet point updated' } });
    
    expect(onChange).toHaveBeenCalledWith({
      type: 'bullet',
      content: ['Test bullet point updated'],
      captions: {
        top_center: '',
        bottom_center: '',
      },
    });
  });

  it('renders captions section', () => {
    const props = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        captions: {
          top_center: 'Top caption',
          bottom_center: 'Bottom caption',
        },
      },
    };
    render(<SlideGroupEditor {...props} />);
    
    expect(screen.getByDisplayValue('Top caption')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bottom caption')).toBeInTheDocument();
  });

  it('updates captions when edited', () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Top Center');
    fireEvent.change(input, { target: { value: 'New caption' } });
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      captions: {
        ...defaultProps.config.captions,
        top_center: 'New caption',
      },
    }));
  });

  it('switches slide type while preserving captions', () => {
    const onChange = jest.fn();
    const props = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        captions: {
          top_center: 'Keep this caption',
          bottom_center: 'And this one',
        },
      },
      onChange,
    };
    render(<SlideGroupEditor {...props} />);
    
    // Click the speed dial button
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    
    // Click the Chart option
    const chartButton = screen.getByRole('menuitem', { name: 'Chart' });
    fireEvent.click(chartButton);
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      type: 'chart',
      captions: props.config.captions,
    }));
  });

  it('handles empty content gracefully', () => {
    const props = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        content: [],
      },
    };
    render(<SlideGroupEditor {...props} />);
    
    // Should still render without crashing
    expect(screen.getByRole('heading', { level: 6, name: 'Bullet List' })).toBeInTheDocument();
  });

  it('shows all slide type options in menu', () => {
    render(<SlideGroupEditor {...defaultProps} />);
    
    // Open the speed dial
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    
    // Check for all slide type options
    expect(screen.getByRole('menuitem', { name: 'Image Gallery' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Chart' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Bullet List Gallery' })).toBeInTheDocument();
  });

  it('preserves all caption fields during type changes', () => {
    const onChange = jest.fn();
    const props = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        captions: {
          top_center: 'Top Caption',
          bottom_center: 'Bottom Caption',
        },
      },
      onChange,
    };
    render(<SlideGroupEditor {...props} />);
    
    // Open the speed dial and change to Chart type
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    const chartButton = screen.getByRole('menuitem', { name: 'Chart' });
    fireEvent.click(chartButton);
    
    // Verify all caption fields are preserved in the onChange call
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'chart',
        captions: {
          top_center: 'Top Caption',
          bottom_center: 'Bottom Caption',
        },
      })
    );
  });
});
