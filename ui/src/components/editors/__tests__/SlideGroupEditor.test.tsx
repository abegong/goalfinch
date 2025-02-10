import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlideGroupEditor from '../SlideGroupEditor';
import { SlideType } from '../../../types/slides';
import { BulletSlideGroupConfig } from '../../../types/slide_groups';

const defaultConfig = {
  type: SlideType.BULLETS,
  name: "Test Bullet Group",
  slides: [{
    type: SlideType.BULLETS,
    bullets: ['Test bullet point']
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
        bullets: ['Test bullet point updated']
      }]
    });
  });

  it('renders bullet list editor for bullet list slide groups', () => {
    const props = {
      type: SlideType.BULLETS,
      config: {
        ...defaultConfig,
      },
    };
    render(<SlideGroupEditor {...props} onChange={jest.fn()} />);
    
    expect(screen.getByDisplayValue('Test bullet point')).toBeInTheDocument();
  });

  it('updates bullet points when edited', () => {
    const onChange = jest.fn();
    render(<SlideGroupEditor type={SlideType.BULLETS} config={defaultConfig} onChange={onChange} />);
    
    const input = screen.getByDisplayValue('Test bullet point');
    fireEvent.change(input, { target: { value: 'New bullet point' } });
    
    expect(onChange).toHaveBeenCalledWith({
      slides: [{
        type: SlideType.BULLETS,
        bullets: ['New bullet point']
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
});
