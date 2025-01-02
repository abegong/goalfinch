import { Slide, SlideType, Captions } from './slide_interfaces';

export class BaseSlide extends Slide {
  constructor(type: SlideType, content?: any, captions?: Captions) {
    super();
    this.type = type;
    if (content) this.content = content;
    if (captions) this.captions = captions;
  }
}

export default BaseSlide;
