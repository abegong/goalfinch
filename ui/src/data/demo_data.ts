import { 
  SlideType,
  type ChartSlideConfig,
  type BulletSlideConfig,
  type PictureSlideConfig
} from '../types/slides';
import { 
  type SlideGroupConfig,
  type BulletSlideGroupConfig,
  type ChartSlideGroupConfig,
  type PictureSlideGroupConfig
} from '../types/slide_groups';
import type { ConnectionsConfig } from '../types/connections';

export const demoSlides: SlideGroupConfig[] = [
  {
    type: SlideType.BULLETS,
    name: "Life goals",
    slides: [{
      type: SlideType.BULLETS,
      bullets: [
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
    name: "Pictures",
    source: "Good memories",
    slide_count: 3,
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
    name: "Goals",
    captions: {
      bottom_right: "Practice fencing techniques"
    },
    slides: [
      {
        type: SlideType.CHART,
        source: "Training progress",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Bonetti"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "Training progress",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Thibault"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "Training progress",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "McBone"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "Training progress",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Agrippa"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "Training progress",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Capo Ferro"
      } as ChartSlideConfig,
    ]
  } as ChartSlideGroupConfig,
];

export const demoConnections: ConnectionsConfig = {
  backend: null,
  pictureSources: [
    {
      name: "Good memories",
      url: "https://goal-finch.s3.us-east-1.amazonaws.com/princess-bride/manifest.json"
    }
  ],
  dataSources: [
    {
      name: "Training progress",
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7hsKbxKmjj6H0037LSRIz41P1UzpZFmJRGv2c9z-imk3nTaKpLXQbDs1CQ5wmxEbYDTCTeQJsRAyD/pub?output=csv"
    }
  ]
};

export default demoSlides;
