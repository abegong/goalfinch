export enum SlideType {
  BULLET_LIST = "bullet-list",
  NESTED_IMAGES = "nested-images",
  NESTED_CHARTS = "nested-charts",
  NESTED_BULLET_LIST = "nested-bullet-list",
  CHART = "chart",
}

export interface Captions {
  top_center?: string;
  bottom_center?: string;
  bottom_right?: string;
  bottom_left?: string;
}

export abstract class Slide {
  type!: SlideType;
  content?: any;
  captions?: Captions;
  url?: string;
  goal?: number;
  rounding?: number;
  units?: string;

  getName(): string | null {
    if (this.captions) {
      const captionFields: (keyof Captions)[] = ['top_center', 'bottom_center', 'bottom_right', 'bottom_left'];
      for (const field of captionFields) {
        if (this.captions[field]) {
          return this.captions[field]!;
        }
      }
    }
    return null;
  }
}

export interface ChartSlide extends Slide {
    type: SlideType.CHART;
    content: any;
    captions: Captions;
    url: string;
    goal: number;
    rounding: number;
    units: string;
}

export interface NestedImagesSlide extends Slide {
    type: SlideType.NESTED_IMAGES;
}

export interface NestedChartsSlide extends Slide {
    type: SlideType.NESTED_CHARTS;
    content: ChartSlide[];
}

export interface BulletListSlide extends Slide {
    type: SlideType.BULLET_LIST;
    content: string[];
    captions: Captions;
}

export interface NestedBulletListSlide extends Slide {
    type: SlideType.NESTED_BULLET_LIST;
    content: string[][];
    captions: Captions;
}
