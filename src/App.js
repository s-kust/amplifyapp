import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { API } from 'aws-amplify';
// import awsconfig from './aws-exports';

let apiCallResult = "123";

class UserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiCallReturn: [] };
  }
  componentDidMount() {
    this.getPortfolioRows();
  }

  getPortfolioRows() {
    const apiName = 'PortfolioRows';
    const path = '/';
    const myInit = {
      headers: {},
      response: true,
      queryStringParameters: {},
    };
    console.log("Call of API.get in getPortfolioRows");
    API
      .get(apiName, path, myInit)
      .then(response => {
        // console.log("response:");
        // console.log(response.data.body);
        apiCallResult = JSON.parse(response.data.body);
        // console.log("apiCallResult in then:");
        // console.log(apiCallResult);
        this.setState({
          apiCallReturn: apiCallResult
        });
        console.log("this.state.apiCallReturn in then after assignment:");
        console.log(this.state.apiCallReturn);
      })
      .catch(error => {
        console.log(error.response);
      });
  }
  render() {
    console.log("this.state.apiCallReturn in render:");
    console.log(this.state.apiCallReturn);
    console.log(this.state.apiCallReturn.constructor.name);
    return (
      <div>
        <table>
          <tr>
            <th>Ticker</th>
            <th>Type</th>
            <th>Note</th>
          </tr>
          {
            this.state.apiCallReturn.map(elem => (
              <tr id={elem[1]}>
                <td align="left" width="15%">{elem[1]}</td>
                <td align="left" width="25%">{elem[2]}</td>
                <td align="left" width="60%">{elem[3]}</td>
              </tr>
            ))
          }
        </table>
      </div>
    );
  }
}

function App() {

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
  console.log("Before API.configure call")
  API.configure();

  // return (
  //   <Authenticator>
  //     {({ signOut, user }) => (
  //       <div className="App">
  //         <header className="App-header">
  //           <img src={logo} className="App-logo" alt="logo" />
  //           <h1>Hello from v2.1</h1>
  //           <p>Hey {user.username}, welcome to my channel, with auth!</p>
  //           <button onClick={signOut}>Sign out</button>
  //         </header>
  //       </div>
  //     )
  //     }
  //   </Authenticator>
  // );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello from v2.2</h1>
        <UserComponent />
      </header>
    </div>
  );
}

export default App;
