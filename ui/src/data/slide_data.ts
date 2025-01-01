interface SlideData {
  // Define your data structure here
}

const preprocessRowCounts = (data: any[]) => {
  return data.map(d => ({
      ...d,
      value: 1
  }));
};

const preprocessRowValue = (data: any[], field: string) => {
  return data.map(d => ({
      ...d,
      value: d[field]
  }));
};

export const slideData: SlideData = {
  slide_list : [
    {
        "type": "bullet-list",
        "content": [
            "Personal growth goal #1",
            "Personal growth goal #2",
            "Professional goal #1"
        ],
        "captions": {
            "bottom_right": "life goals"
        }
    },
    {
        "type": "nested-images",
    },
    {
        "type": "nested-charts",
        "captions": {
            "bottom_right": "fitness",
        },
        "content" : [
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Cardio Activity 1",
                    "bottom_center": "",
                    "bottom_right": "health",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_1",
                "goal": 80,
                "rounding": 0,
                "units": "km"
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Strength Training",
                    "bottom_center": "",
                    "bottom_right": "health",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_2",
                "goal": 31*2,
                "rounding": 0,
                "units": "",
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Sleep Schedule",
                    "bottom_center": "",
                    "bottom_right": "health",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_3",
                "goal": 31*80,
                "rounding": 0,
                "units": " min",
            }        
        ]
    },
    {
        "type": "nested-images",
    },
    {
        "type": "checkbox-list",
        "content": [
            "Professional milestone 1",
            "Personal project planning",
        ],
        "captions": {
            "bottom_right": "Quarterly goals"
        }
    },
    {
        "type": "nested-images",
    },
    {
        "type": "nested-charts",
        "captions": {
            "bottom_right": "engagement",
        },
        "content" : [
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Professional Connections",
                    "bottom_center": "",
                    "bottom_right": "networking",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_4",
                "goal": 12,
                "rounding": 0,
                "units": "",
                "preprocessing": "rowCounts"
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Family Activities",
                    "bottom_center": "",
                    "bottom_right": "personal",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_5",
                "goal": 30,
                "rounding": 0,
                "units": "",
                "preprocessing": "rowCounts"
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "placeholder": true,
                "captions": {
                    "top_center": "Communication Metrics",
                    "bottom_center": "",
                    "bottom_right": "engagement",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_6",
                "goal": 70000,
                "rounding": 3,
                "units": "",
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Social Media Engagement",
                    "bottom_center": "",
                    "bottom_right": "engagement",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_7",
                "goal": 1000*31,
                "rounding": 3,
                "units": "",
                "preprocessing": {
                    "field": "impressions",
                    "function": "preprocessRowValue"
                }
            },
            {
                "type": "look-forward-chart",
                "content": "",
                "captions": {
                    "top_center": "Digital Wellness",
                    "bottom_center": "",
                    "bottom_right": "health",
                    "bottom_left": ""
                },
                "url" : "SPREADSHEET_URL_8",
                "goal": 1350,
                "rounding": 1,
                "units": "",
            },            
        ]
    },    
    {
        "type": "nested-images",
    },
    {
        "type": "bullet-list",
        "content": [
            "Professional milestone 2",
            "Networking goal",
            "Personal development goal",
            "Project milestone 1",
            "Personal task 1",
            "Planning milestone",
        ],
        "captions": {
            "bottom_right": "monthly goals"
        }
    },
    {
        "type": "nested-images",
    },
    {
        "type": "nested-bullet-list",
        "content": [
            "Family goal 1",
            "Family goal 2",
            "Family goal 3",
            "Family goal 4",
            "Health and wellness goal",
            "Financial goal",
            "Community engagement goal",
        ],
        "captions": {
            "bottom_right": "family goals"
        }
    },
    {
        "type": "nested-images",
    }
]
};

export default slideData;
