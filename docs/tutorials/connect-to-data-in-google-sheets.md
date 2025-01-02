# Connect to Data in Google Sheets

!!! danger

    This page is under construction

One of the easiest ways to get data into Goal Finch is through Google Sheets. You don't need to be a programmer to make this work&mdash;you just need to adjust a few settings.

This tutorial will guide you through connecting Goal Finch to your Google Sheets data.

!!! warning

    Connecting to Google sheets requires making the data in your spreadsheet public and accessible to anyone with the link. Although it is unlikely that someone would find your spreadsheet unless you share the link, you should be aware that it is possible.

    <!-- If you want to set up a more secure data storage method, you can set up the [self-hosted backend](https://www.goalfinch.com/#self-hosted). Here's a tutorial explaining how: [Set up a self-hosted backend](tutorials/set-up-a-self-hosted-backend.md). -->

## Prerequisites

- A Google account
- Access to Google Sheets
- Goal Finch account

## Steps

1. Set up Google Sheets API access
2. Configure OAuth credentials
3. Connect Goal Finch to your spreadsheet

https://medium.com/@Bwhiz/step-by-step-guide-importing-google-sheets-data-into-pandas-ae2df899257f

## Example Configuration

```yaml
connection:
  type: google_sheets
  spreadsheet_id: your-spreadsheet-id
  range: Sheet1!A1:F100
```

## Next Steps

- Learn how to transform your data
- Set up automated syncs
- Create visualizations
