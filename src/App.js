import React from 'react';
import { sortBy } from 'lodash';
import './App.css';
// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { API } from 'aws-amplify';
import { ReactComponent as ArrowUpIcon } from './up-arrow.svg';
import { ReactComponent as ArrowDownIcon } from './down-arrow.svg';
import { useParams, Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
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
      <Container fluid>
        <Row><Col>
          <Navbar bg="light" variant="light">
            <Container>
              <Nav>
                <Nav.Item><Nav.Link href="/">Homepage</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="https://charts-public.s3.amazonaws.com/Serhii-Kushchenko-CV.pdf">CV download (PDF)</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="https://github.com/s-kust/">My GitHub</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="https://www.linkedin.com/in/kushchenko/">LinkedIn profile</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link href="https://stackoverflow.com/users/3139228/serhii-kushchenko">Stack Overflow profile</Nav.Link></Nav.Item>
              </Nav>
            </Container>
          </Navbar>
        </Col></Row>
        {!params.rowId
          ? <List list={portfolio} sort={sort} handleSort={handleTickersSort} />
          : null
        }
        <Outlet />
        <Row><Col>
          <Card style={{ width: '18rem' }}>
            <Card.Header>More info about me:</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><a href="https://charts-public.s3.amazonaws.com/Serhii-Kushchenko-CV.pdf">CV download (PDF)</a></ListGroup.Item>
              <ListGroup.Item><a href="https://github.com/s-kust/">GitHub profile</a></ListGroup.Item>
              <ListGroup.Item><a href="https://www.linkedin.com/in/kushchenko/">LinkedIn profile</a></ListGroup.Item>
              <ListGroup.Item><a href="https://stackoverflow.com/users/3139228/serhii-kushchenko">Stack Overflow profile</a></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col></Row>
        <Row><Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Text>
                © Serhii Kushchenko, 2020-{new Date().getFullYear()}.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col></Row>
      </Container>
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
      <Container fluid>
        <Row><Col><h1>Portfolio Tickers List</h1></Col></Row>
        <Table bordered >
          <thead>
            <tr>
              <th><Button variant="primary" onClick={() => handleSort('TICKER')}>
                Ticker
                {sort.sortKey === 'TICKER' && !sort.isReverse ? (
                  <ArrowUpIcon height="12px" width="12px" />) : (<span></span>)}
                {sort.sortKey === 'TICKER' && sort.isReverse ? (
                  <ArrowDownIcon height="12px" width="12px" />) : (<span></span>)}
              </Button></th>
              <th><Button variant="primary" onClick={() => handleSort('TYPE')}>
                Type
                {sort.sortKey === 'TYPE' && !sort.isReverse ? (
                  <ArrowUpIcon height="12px" width="12px" />) : (<span></span>)}
                {sort.sortKey === 'TYPE' && sort.isReverse ? (
                  <ArrowDownIcon height="12px" width="12px" />) : (<span></span>)}
              </Button></th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((item) => (
              <tr>
                <td>{item.ticker}</td>
                <td>{item.type}</td>
                <td>{item.note}</td>
                <td><Link to={`${item.id}`} key={item.id}>Charts</Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};


export default App;
