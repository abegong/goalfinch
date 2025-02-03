import { 
  SlideType,
  ChartSlideConfig,
  BulletSlideConfig,
  PictureSlideConfig
} from '../types/slides';
import {
  SlideGroupConfig,
  BulletSlideGroupConfig,
  ChartSlideGroupConfig,
  PictureSlideGroupConfig
} from '../types/slide_groups';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const preprocessRowCounts = (data: any[]) => {
  return data.map(d => ({
      ...d,
      value: 1
  }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      type: SlideType.BULLETS,
      content: [
        "Become a wizard-level swordsman",
        "Find the six-fingered man",
        "Avenge my father"
      ],
    } as BulletSlideConfig],
    captions: {
      bottom_right: "Life goals"
    }
  } as BulletSlideGroupConfig,
  {
    type: SlideType.PICTURE,
    slides: [
      {
        type: SlideType.PICTURE,
      } as PictureSlideConfig,
      {
        type: SlideType.PICTURE,
      } as PictureSlideConfig,
      {
        type: SlideType.PICTURE,
      } as PictureSlideConfig
    ],
    captions: {}
  } as PictureSlideGroupConfig,
  {
    type: SlideType.CHART,
    captions: {
      bottom_right: "Practice fencing techniques"
    },
    slides: [
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_1",
          goal: 40,
          rounding: 0,
          units: "hours",
          caption: "Bonetti"
        },
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_2",
          goal: 40,
          rounding: 0,
          units: "hours",
          caption: "Thibault"
        },
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_3",
          goal: 40,
          rounding: 0,
          units: "hours",
          caption: "McBone"
        },
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_3",
          goal: 40,
          rounding: 0,
          units: "hours",
          caption: "Agrippa"
        },
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        content: {
          url: "SPREADSHEET_URL_3",
          goal: 40,
          rounding: 0,
          units: "hours",
          caption: "Capo Ferro"
        },
      } as ChartSlideConfig,
    ]
  } as ChartSlideGroupConfig,
];

export default demoData;
