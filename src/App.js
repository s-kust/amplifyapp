import React from 'react';
import { sortBy } from 'lodash';
// import logo from './logo.svg';
import './App.css';
// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { API } from 'aws-amplify';
import { ReactComponent as ArrowUpIcon } from './up-arrow.svg';
import { ReactComponent as ArrowDownIcon } from './down-arrow.svg';
import { useParams, Outlet, Link } from "react-router-dom";
// import { render } from '@testing-library/react';

export const PortfolioContext = React.createContext();

const getPortfolioRows = () => {
  const apiName = 'PortfolioRows';
  const path = '/';
  const myInit = {
    headers: {},
    response: true,
    queryStringParameters: {},
  };
  var apiCallResult;
  Amplify.configure({
    Auth: {},
    API: {
      endpoints: [
        {
          name: "PortfolioRows", // name of the API in API Gateway console
          endpoint: "https://xdjzphtw1i.execute-api.us-east-1.amazonaws.com/prod",
          region: "us-east-1",
          paths: ['/']
        }
      ]
    }
  });
  apiCallResult = API
    .get(apiName, path, myInit).then(response => JSON.parse(response.data.body)).catch(error => {
      console.log(error.response);
      throw new Error();
    });
  return apiCallResult;
}

const transformPortfolio = (listOfLists) => {
  // console.log("Start function transformPortfolio");
  // console.log("Function transformPortfolio input:");
  // console.log(listOfLists);
  let resultListOfDicts = [];
  for (var i = 0; i < listOfLists.length; i++) {
    let portfolioItem = {
      id: listOfLists[i][0],
      ticker: listOfLists[i][1],
      type: listOfLists[i][2],
      note: listOfLists[i][3],
      pic1: listOfLists[i][4],
      pic2: listOfLists[i][5],
    }
    // console.log("Iteration result:");
    // console.log(portfolioItem);
    resultListOfDicts.push(portfolioItem)
  }
  // console.log("Function transformPortfolio output:");
  // console.log(resultListOfDicts);
  return resultListOfDicts;
}

export function getPortfolioRowById(portfolioData, number) {
  // console.log("Start getPortfolioRowById - number");
  // console.log(number);
  console.log("portfolioData - IDs");
  console.log(portfolioData);
  // currentPortfolioRows.forEach(myFunction);
  let result = portfolioData.find(
    portfolioRow => portfolioRow.id === number
  );
  console.log("getPortfolioRowById - result");
  console.log(result);
  return result;
}

function App() {

  const [portfolio, setPortfolio] = React.useState([]);
  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  });

  const handleTickersSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;

    setSort({ sortKey, isReverse });
  };

  React.useEffect(() => {
    getPortfolioRows()
      .then(result => transformPortfolio(result))
      .then(result => setPortfolio(result));
  }, []);

  console.log("portfolio state before return:");
  console.log(portfolio);
  let params = useParams();

  return (
    <PortfolioContext.Provider value={portfolio}>
      <div className="App">
        <header className="App-header">
          {!params.rowId
            ? <List list={portfolio} sort={sort} handleSort={handleTickersSort} />
            : null
          }
          <Outlet />
          <p>Footer 13</p>
        </header>
      </div>
    </PortfolioContext.Provider>
  );
}

const SORTS = {
  NONE: (list) => list,
  TICKER: (list) => sortBy(list, 'ticker'),
  TYPE: (list) => sortBy(list, 'type'),
};

const List = ({ list, sort, handleSort }) => {
  console.log("Begin List, list:");
  console.log(list);

  const sortFunction = SORTS[sort.sortKey];

  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div>
      <h1>Portfolio Tickers List</h1>
      <div>
        <span style={{ width: '40%' }}>
          <button type="button" onClick={() => handleSort('TICKER')}>
            Ticker
            {sort.sortKey === 'TICKER' && !sort.isReverse ? (
              <ArrowUpIcon height="12px" width="12px" />) : (<span></span>)}
            {sort.sortKey === 'TICKER' && sort.isReverse ? (
              <ArrowDownIcon height="12px" width="12px" />) : (<span></span>)}
          </button>
        </span>
        <span style={{ width: '30%' }}>
          <button type="button" onClick={() => handleSort('TYPE')}>
            Type
            {sort.sortKey === 'TYPE' && !sort.isReverse ? (
              <ArrowUpIcon height="12px" width="12px" />) : (<span></span>)}
            {sort.sortKey === 'TYPE' && sort.isReverse ? (
              <ArrowDownIcon height="12px" width="12px" />) : (<span></span>)}
          </button>
        </span>
      </div>

      {sortedList.map((item) => (
        // <Item
        //   key={item.id}
        //   item={item}
        // />
        <div className="item">
          <span style={{ width: '15%' }}>{item.ticker} </span>
          <span style={{ width: '20%' }}>{item.type} </span>
          <span style={{ width: '55%' }}>{item.note} </span>
          <span style={{ width: '10%' }}><Link to={`${item.id}`} key={item.id}>Charts</Link></span>
        </div>
      ))}
    </div>
  );
};


export default App;
