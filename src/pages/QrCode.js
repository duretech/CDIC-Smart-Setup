
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Nav, Navbar, Button, Form, Tooltip } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";
import { apiUrl } from "../util/urls";

import Sibebar from '../component/Sidebar';
import swal from "sweetalert";
import axios from "axios";
import QRCode from "qrcode.react";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';



import { setLoader, setUserTemplate } from '../redux/actions/userAction'

const animatedComponents = makeAnimated();
const QrCode = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)
  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }
  const [count, setCount] = useState();
  const [QrArray, setQrArray] = useState([])
  const componentRef = useRef();

  const [cardVariableToggle, setCardVariableToggle] = useState(false)
  const [variableList, setVariableList] = useState([]);
  const [currentSelectedVariable, setCurrentSelectedVariable] = useState([]);
  const [selecedVariableList, setSelecedVariableList] = useState(null);

  const [programDetailsObject, setProgramDetailsObject] = useState({})

  console.log(userStoreState, "userStoreState")
  const getQrCode = (type) => {
    dispatch(setLoader(true))
    // API.get(`qrcode/generate?count=` + count)
    if (type == 'code') {
      let url = apiUrl + `qrcode/generate?count=` + count
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: sessionStorage.getItem("Authorization") },
      }).then((res) => {
        console.log(res)
        var FileSaver = require('file-saver');
        var blob = new Blob([res.data], { type: 'application/pdf' });
        FileSaver.saveAs(blob, "QRCode_" + new Date());
        dispatch(setLoader(false))
      })
    } else {
      if (selecedVariableList) {
        API.get('qrcode/generatelist?count=' + count).then((res) => {
          console.log(res)
          dispatch(setLoader(false))
          setQrArray(res.data.data)
        })
      } else {
        swal({
          title: "",
          text: "Please Configure QR Card",
          icon: "info",
          button: "Close",
        });
        dispatch(setLoader(false))
      }
    }
  }
  function renderQrCard() {
    // console.log(QrArray, "Array")
    if (QrArray.length > 0) {
      return QrArray.map((el, idx) => {
        return <div key={idx} className="mb-2"
          style={{
            padding: '7px',
            width: '50%',
            float: 'left',
          }}>
          {/* ,float:'left' */}
          <div className="card" style={{
            padding: '10px'
          }}>
            <h6 className="text-uppercase" style={{ 'font-weight': 400 }}>{programDetailsObject.name}</h6>
            <div className="row">
              <div className="col-7 mb-2" >
                {/* <div style={{ 'justify-content': 'space-between', display: 'flex' }}> */}
                {/* <img className="loginPageLogo logo1" style={{ width: '100%', height: '50px', margin: 'auto 0' ,'margin-bottom': '10px' }} src={PartnersClubLogos} alt="" /> */}
                <div className="heading">
                  <div className="row">
                    {
                      selecedVariableList.map(variable => {
                        return <span className="col-md-12 text-left">{variable.label} : </span>
                      })
                    }
                    {/* <span className="col-md-12 ">HH Head Name : </span>
                    <span className="col-md-12 ">Address : </span>
                    <span className="col-md-12 ">Date of visit : ___/___/___</span> */}
                  </div>
                </div>
                {/* </div> */}
              </div>
              <div className="col-2">
                <QRCode id={idx} value={el} renderAs="svg" size={100} includeMargin={false} />
              </div>
            </div>
          </div>
        </div>
      })
    }
  }
  function printQRCards() {
    var contents = document.getElementById("printQRDiv").innerHTML;
    var frame1 = document.createElement('iframe');
    frame1.name = "frame1";
    frame1.style.position = "absolute";
    // frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`<html><head><title>QR Cards</title>`);
    frameDoc.document.write(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    </head><body>`);
    //frameDoc.document.write('<link href="../assets/css/card.css" rel="stylesheet" type="print" />');
    frameDoc.document.write(contents);
    frameDoc.document.write(`</body>
    <style>
    @media print {
      .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
           float: left;
      }
      .col-sm-12 {
           width: 100%;
      }
      .col-sm-11 {
           width: 91.66666667%;
      }
      .col-sm-10 {
           width: 83.33333333%;
      }
      .col-sm-9 {
           width: 75%;
      }
      .col-sm-8 {
           width: 66.66666667%;
      }
      .col-sm-7 {
           width: 58.33333333%;
      }
      .col-sm-6 {
           width: 50%;
      }
      .col-sm-5 {
           width: 41.66666667%;
      }
      .col-sm-4 {
           width: 33.33333333%;
      }
      .col-sm-3 {
           width: 25%;
      }
      .col-sm-2 {
           width: 16.66666667%;
      }
      .col-sm-1 {
           width: 8.33333333%;
      }
   }
    </style><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script></html>`);
    frameDoc.document.close();
    console.log(frameDoc)
    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      document.body.removeChild(frame1);
    }, 1000);
    return false;
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Generate QR card function allows the user to download and print QR cards and associate them with the patient at the registration stage.
    </Tooltip>
  );
  const onChange = selectedOption => {
    console.log(selectedOption)
    setCurrentSelectedVariable(selectedOption)
  }
  const addCardVariable = () => {
    let inputJson = programDetailsObject
    inputJson['showInQrCard'] = currentSelectedVariable
    API.put('dataStore/translations/' + userStoreState.userDetails.organisationUnits[0].id, inputJson).then(res => {
      console.log(res, "check res")
      if (res.data.status == 'OK') {
        swal({
          title: "Success",
          text: "Card Configuration Updated",
          icon: "success",
          button: "Close",
        });
        setSelecedVariableList(currentSelectedVariable)
        setCardVariableToggle(false)
      }
    })
  }
  useEffect(() => {
    API.get('dataStore/translations/' + userStoreState.userDetails.organisationUnits[0].id).then(res => {
      console.log(res.data, "datastore")
      setProgramDetailsObject(res.data)
      if (res.data.showInQrCard){
        setCurrentSelectedVariable(res.data.showInQrCard)
        setSelecedVariableList(res.data.showInQrCard)
      }
    })
    let tempArr = userTemplate.trackedentityattributes
    let labelArr = []
    tempArr.map((set, id) => {
      labelArr.push({
        'label': set.name,
        'value': set.trackedEntityAttributeId
      })
    })
    setVariableList(labelArr)
  }, [userTemplate])
  return (
    <>
      <Sibebar open={true} />
      <div className="contentapp">
        <Navbar expand="lg">
          <button type="button" id="sidebarCollapse" className="btn btn-info hammenu"><i data-v-c3854e32="" className="fas fa-bars"></i></button>
          <Navbar.Brand className="navTitle" href="#home"></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <img className="avatar mr-2" src={imgurl.avatar.default} />
              <div>
                <span className="name">{userStoreState.userDetails.name}</span><br></br>
                <span>{userStoreState.userDetails.email}</span>
              </div>
              <button className="btn btn-sign" onClick={logoutClickHandler}><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

            </Nav>

          </Navbar.Collapse>
        </Navbar>
        <div className="smart-setup-wrapper" style={{ height: "calc(100vh - 60px)" }}>
          <div className="row">
            <div className="col-12">
              <div className="form-wizard ">
                <Card>
                  <Card.Header className="cardBlueHeader" as="h5">Generate QR Code</Card.Header>
                  {storeState.user.isEdit ?
                    <Card.Body className="odkDiv" >
                      <Row>
                        <Col lg={8}>
                          <Form>
                            <Form.Group controlId="formBasicEmail">
                              {/* <Form.Label>Enter No of QR code to be generated</Form.Label> */}
                              <Form.Control
                                value={count}
                                onChange={function (e) {
                                  // console.log(e.target.value)
                                  setCount(e.target.value)
                                }}
                                type="number"
                                placeholder="Enter Number of QR Codes to be Generated" />
                            </Form.Group>
                          </Form>
                          <Button className="mr-2 float-left" onClick={() => getQrCode('code')} variant="primary">Generate QR Code</Button>
                          <Button className="mr-2 float-left" onClick={() => getQrCode('card')} variant="primary">Generate QR Card</Button>
                          <Button className="mr-2 float-left"
                            onClick={() => {
                              setQrArray([])
                              setCardVariableToggle(true)
                            }} variant="primary">Configure QR Card</Button>
                          {QrArray.length > 0 ?
                            <>
                              <Button className="mr-2 float-left" onClick={() => printQRCards()} variant="primary">Print</Button>
                            </>
                            :
                            ''}
                          {cardVariableToggle ? <>
                            <div className="mt-2 mb-2"
                              style={{
                                padding: '7px',
                                width: '50%',
                                float: 'left',
                              }}>
                                
                          <h6>
                            Sample Card
                          </h6>
                              {/* ,float:'left' */}
                              <div className="card" style={{
                                padding: '10px'
                              }}>
                                <h6 className="text-uppercase" style={{ 'font-weight': 400 }}>{programDetailsObject.name}</h6>
                                <div className="row">
                                  <div className="col-7 mb-2" >
                                    {/* <div style={{ 'justify-content': 'space-between', display: 'flex' }}> */}
                                    {/* <img className="loginPageLogo logo1" style={{ width: '100%', height: '50px', margin: 'auto 0' ,'margin-bottom': '10px' }} src={PartnersClubLogos} alt="" /> */}
                                    <div className="heading">
                                      <div className="row">
                                        {
                                          currentSelectedVariable.map(variable => {
                                            return <span className="col-md-12 text-left">{variable.label} : </span>
                                          })
                                        }
                                        {/* <span className="col-md-12 ">HH Head Name : </span>
                    <span className="col-md-12 ">Address : </span>
                    <span className="col-md-12 ">Date of visit : ___/___/___</span> */}
                                      </div>
                                    </div>
                                    {/* </div> */}
                                  </div>
                                  <div className="col-2">
                                    <QRCode value={'Test'} renderAs="svg" size={100} includeMargin={false} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </> : null}
                        </Col>
                        <Col lg={4}>
                          {cardVariableToggle ? <>
                            <Card>
                              <Card.Header className="regcardheader">Add Variable to Card
                                <span className="closesign" onClick={() => setCardVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                              </Card.Header>
                              <Card.Body className="regtabbody">
                                <Select
                                  className="basic-multi-select multiselect"
                                  classNamePrefix="select"
                                  isMulti
                                  defaultValue={selecedVariableList}
                                  options={variableList}
                                  menuIsOpen={true}
                                  components={animatedComponents}
                                  onChange={onChange}
                                />
                                <div className="d-flex justify-content-between mt-3">
                                  <Button onClick={() => addCardVariable()} className="addbtn mt-3"> Add</Button>
                                  <Button onClick={() => setCardVariableToggle(false)} className="addbtn mt-3" >Close</Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </> : null}
                        </Col>
                        {QrArray.length > 0 ?
                          <div ref={componentRef} className="printQRDiv row" id="printQRDiv"
                            style={{
                              padding: '0 100px'
                            }}>
                            {renderQrCard()}
                          </div> : null
                        }
                      </Row>
                    </Card.Body> : <p>Program not published</p>}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-6">
            <p className="footext">Powered by  <img className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
          <div className="col-6">
            <div className="widthMaxContent ml-auto pt-2">
              <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QrCode;