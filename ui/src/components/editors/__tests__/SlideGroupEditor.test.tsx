import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlideGroupEditor from '../SlideGroupEditor';
import { SlideType } from '../../../types/slides';
import { BulletSlideGroupConfig } from '../../../types/slide_groups';

const defaultConfig = {
  type: SlideType.BULLETS,
  slides: [{
    type: SlideType.BULLETS,
    content: ['Test bullet point']
  }],
  captions: {
    top_center: '',
    bottom_center: '',
    bottom_right: ''
  }
} as BulletSlideGroupConfig;

describe('SlideGroupEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<SlideGroupEditor type={SlideType.BULLETS} config={defaultConfig} onChange={jest.fn()} />);
    
    // Should show the slide type in the Typography component
    expect(screen.getByRole('heading', { level: 6, name: 'Bullet List' })).toBeInTheDocument();
    
    // Should show the content
    expect(screen.getByDisplayValue('Test bullet point')).toBeInTheDocument();
  });

  it('calls onChange when content is modified', async () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor type={SlideType.BULLETS} config={defaultConfig} onChange={onChange} />);
    
    const input = screen.getByDisplayValue('Test bullet point');
    fireEvent.change(input, { target: { value: 'Test bullet point updated' } });
    
    expect(onChange).toHaveBeenCalledWith({
      slides: [{
        type: SlideType.BULLETS,
        content: ['Test bullet point updated']
      }]
    });
  });

  it('renders captions section', () => {
    const props = {
      type: SlideType.BULLETS,
      config: {
        ...defaultConfig,
        captions: {
          top_center: 'Top caption',
          bottom_center: 'Bottom caption',
          bottom_right: 'Bottom right caption'
        },
      },
    };
    render(<SlideGroupEditor {...props} onChange={jest.fn()} />);
    
    expect(screen.getByDisplayValue('Top caption')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bottom caption')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bottom right caption')).toBeInTheDocument();
  });

  it('updates captions when edited', () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor type={SlideType.BULLETS} config={defaultConfig} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Top Center');
    fireEvent.change(input, { target: { value: 'New caption' } });
    
    expect(onChange).toHaveBeenCalledWith({
      captions: {
        ...defaultConfig.captions,
        top_center: 'New caption'
      }
    });
  });

  it('switches slide type while preserving captions', () => {
    const onChange = jest.fn();
    const props = {
      type: SlideType.BULLETS,
      config: {
        ...defaultConfig,
        captions: {
          top_center: 'Keep this caption',
          bottom_center: 'And this one',
          bottom_right: 'And this one too'
        },
      },
    };
    render(<SlideGroupEditor {...props} onChange={onChange} />);
    
    // Open the speed dial and change to Chart type
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    
    const chartButton = screen.getByRole('menuitem', { name: 'Chart' });
    fireEvent.click(chartButton);
    
    // Verify the type change
    expect(onChange).toHaveBeenCalledWith({
      type: SlideType.CHART,
      slides: [{
        type: SlideType.CHART,
        content: {
          url: '',
          goal: 0,
          rounding: 0,
          units: ''
        }
      }]
    });
  });

  it('handles empty content gracefully', () => {
    const props = {
      type: SlideType.BULLETS,
      config: {
        ...defaultConfig,
        slides: [],
      },
    };
    render(<SlideGroupEditor {...props} onChange={jest.fn()} />);
    
    // Should still render without crashing
    expect(screen.getByRole('heading', { level: 6, name: 'Bullet List' })).toBeInTheDocument();
  });

  it('shows all slide type options in menu', () => {
    render(<SlideGroupEditor type={SlideType.BULLETS} config={defaultConfig} onChange={jest.fn()} />);
    
    // Open the speed dial
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    
    // Check for all slide type options
    expect(screen.getByRole('menuitem', { name: 'Image' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Chart' })).toBeInTheDocument();
  });

  it('preserves all caption fields during type changes', () => {
    const onChange = jest.fn();
    const props = {
      type: SlideType.BULLETS,
      config: {
        ...defaultConfig,
        captions: {
          top_center: 'Top Caption',
          bottom_center: 'Bottom Caption',
          bottom_right: 'Bottom right caption'
        },
      },
    };
    render(<SlideGroupEditor {...props} onChange={onChange} />);
    
    // Open the speed dial and change to Chart type
    const speedDial = screen.getByLabelText('Slide group actions');
    fireEvent.click(speedDial);
    
    const chartButton = screen.getByRole('menuitem', { name: 'Chart' });
    fireEvent.click(chartButton);
    
    // Verify the type change resets to default chart config
    expect(onChange).toHaveBeenCalledWith({
      type: SlideType.CHART,
      slides: [{
        type: SlideType.CHART,
        content: {
          url: '',
          goal: 0,
          rounding: 0,
          units: ''
        }
      }]
    });
  });
});
