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

export const demoData: SlideGroupConfig[] = [
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
    source: "",
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
        source: "SPREADSHEET_URL_1",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Bonetti"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "SPREADSHEET_URL_2",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Thibault"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "SPREADSHEET_URL_3",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "McBone"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "SPREADSHEET_URL_3",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Agrippa"
      } as ChartSlideConfig,
      {
        type: SlideType.CHART,
        source: "SPREADSHEET_URL_3",
        goal: 40,
        rounding: 0,
        units: "hours",
        title: "Capo Ferro"
      } as ChartSlideConfig,
    ]
  } as ChartSlideGroupConfig,
];

export default demoData;
