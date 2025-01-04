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
    
    // Should show the slide type
    expect(screen.getByText('Bullet List')).toBeInTheDocument();
    
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
});
