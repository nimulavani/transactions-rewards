## Getting Started
npm install
npm start

# transaction-rewards
customer reward points calculation
rewards dashboard that simulates transaction data, calculates reward points, and shows three views:

- Transactions
- User monthly rewards
- Total Rewards

## Deatils
- Mock API  in`src/api/transactionsApi.js`
- Reward point calculation from transaction price
- Transactions table contains -list of all transactions
- User monthly rewards table contains - transactions grouped by user per month
- Total Rewards table contains - transactions grouped by user


## code wise
  TransactionAPI - to fetch list of transactions from transactions.json 
  ErrorBoundary --to handle React render time errors
  RewardCalculation -- to calculate rewards based on transaction price


## code flow
index.html --> index.js -->App.js(on mount transctions data get loaded and rewards get calculated) 
-->Transactions(side menu on click)-Transaction table will render  

## Note
Attached all output screenshots under public folder




