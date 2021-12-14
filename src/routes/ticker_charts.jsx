import React from 'react';
import { useParams, Link } from "react-router-dom";
import { PortfolioContext, getPortfolioRowById } from '../App';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BUCKET_NAME = "https://charts-public.s3.amazonaws.com/"

export default function TickerCharts() {
  let params = useParams();
  const value = React.useContext(PortfolioContext);
  let foundTicker = getPortfolioRowById(value, parseInt(params.rowId, 10));
  let pathPic2;
  if (foundTicker.pic2 !== "") {
    pathPic2 = BUCKET_NAME + foundTicker.pic2;
  }
  let pathPic1 = BUCKET_NAME + foundTicker.pic1;
  console.log("foundTicker");
  console.log(foundTicker);
  return (
    <div>
      <Container fluid>
        <Row><Col><p><Link to={"/"}>Return to the list of tickers</Link></p></Col></Row>
        <Row><Col><img src={pathPic1} alt="" /></Col></Row>
        {pathPic2
          ? <Row><Col><img src={pathPic2} alt="" /></Col></Row>
          : null
        }
      </Container>
    </div>
  );
}