import { 
  SlideType,
  ChartSlideConfig,
  BulletSlideConfig
} from '../types/slides';
import {
  SlideGroupConfig,
  BulletSlideGroupConfig,
  ChartSlideGroupConfig,
  PictureSlideGroupConfig
} from '../types/editors';

export const preprocessRowCounts = (data: any[]) => {
  return data.map(d => ({
      ...d,
      value: 1
  }));
};

export const preprocessRowValue = (data: any[], field: string) => {
  return data.map(d => ({
      ...d,
      value: d[field]
  }));
};

export const demoData: SlideGroupConfig[] = [
  {
    type: SlideType.BULLETS,
    slides: [{
      content: [
        "Personal growth goal #1",
        "Personal growth goal #2",
        "Professional goal #1"
      ],
    } as BulletSlideConfig],
    captions: {
      bottom_right: "life goals"
    }
  } as BulletSlideGroupConfig,
  {
    type: SlideType.PICTURE,
    slide_count: 3,
  } as PictureSlideGroupConfig,
  {
    type: SlideType.CHART,
    captions: {
      bottom_right: "health"
    },
    slides: [
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_1",
          goal: 80,
          rounding: 0,
          units: "km"
        },
        captions: {
          top_center: "Cardio Activity 1",
        }
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_2",
          goal: 31*2,
          rounding: 0,
          units: "",
        },
        captions: {
          top_center: "Strength Training",
        }
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_3",
          goal: 31*80,
          rounding: 0,
          units: " min"
        },
        captions: {
          top_center: "Sleep Schedule",
        }
      } as ChartSlideConfig,
    ]
  } as ChartSlideGroupConfig,
];

export default demoData;
