# Daily Portfolio Positions Reports

The workflow is to load a list of portfolio rows from Google Spreadsheet, then for each row generate a report with charts and send it to the email. Also, you can see the recent charts online. 

The advantage of the system is that you can easily change the set of items in the watchlist. To do that, you only need a smartphone that works with Google Sheets. 

You can run the workflow regularly at suitable intervals. For example, on business days in the morning and again 15 minutes before the end of the trading time.

The system currently supports three types of reports:
1. Single stock or ETF.
2. Relative performance of two tickers.
3. FX currencies pair. 

Additional report types can be easily added as needed.

![Watchlist spreadsheet example](/misc/1.PNG)

The system consists of the AWS Lambda backend and a React frontend. This repository contains the code of the React frontend. Currently, the frontend is an AWS Amplify app. Also, there is an additional frontend implemented with Django serverless using Zappa.

The AWS Lambda backend consists of several Python functions coordinated by the state machine. Please see [its repository](https://github.com/s-kust/stocks-data-backend) with the codebase and setup instructions.

How to fill out the portfolio spreadsheet:
1. There must be four columns: Ticker1, Ticker2, Type, and Note.
2. If Ticker2 contains some value, Ticker1 at the same row can not be empty.
3. If both Ticker1 and Ticker2 are not empty, you will get the report with their relative performance for the last 1.5 years. 
4. If Ticker2 is empty, you will get the single ticker idea report for Ticker1. 
5. Note cell can be empty or fulfilled, as you wish. You will get its text in the email together with charts.

Reports currently look like this.
![Long-short spread report example](/misc/2.png)
and single ticker idea report
![Ticker report example](/misc/3.png)

The front-end deployment is a typical AWS Amplify application deployment. Before running the deployment, please change the backend API endpoint URL in the `src/app.js` file. 

Unfortunately, the backend deployment is more complicated and time-consuming. You'll have to prepare the portfolio Google Spreadsheet accessible by the API calls, several AWS S3 buckets, data provider API key, and secret strings in the AWS Secret Manager. Plese see the detailed instructions in the backend repository.
