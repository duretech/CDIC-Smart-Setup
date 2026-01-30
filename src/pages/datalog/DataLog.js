
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { apiUrl, baseUrl } from "../../util/urls";
import {
  Card,
  Nav,
  Navbar,
  Button,
  Form,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import Select from 'react-select';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import imgurl from '../../assets/images/imgUrl';
import API from "../../util";
import TextError from '../../component/ErrorText';
import Sibebar from '../../component/Sidebar';
import Swal from "sweetalert2";

import { setLoader } from '../../redux/actions/userAction'

import Tab from 'react-bootstrap/Tab'
import TabContainer from 'react-bootstrap/TabContainer'
import TabContent from 'react-bootstrap/TabContent'
import TabPane from 'react-bootstrap/TabPane'
import Table from './LogTable'

const XlUpload = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)
  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }
  const [dataSetArr, setdataSetArr] = useState([])
  const [logTableKey, setlogTableKey] = useState(0)
  const [logData, setlogData] = useState([])
  const [selecteddataset, setselecteddataset] = useState(null)
  const [prevselecteddataset, setprevselecteddataset] = useState(null)

  useEffect(() => {
    if (storeState.user.userDetails) {
      getDataSet()
    }
  }, [storeState.user.userDetails]);


  const getDataSet = () => {
    dispatch(setLoader(true))
    if (!storeState.user.userDetails.organisationUnits[0].id) {
      return;
    }
    API.get(`/dataset/smartsetup/get/${storeState.user.userDetails.organisationUnits[0].id}`).then(res => {
      console.log('smartsetup/get>>>', res)
      dispatch(setLoader(false))
      if (res.data.data) {
        let temparr = []
        res.data.data.forEach(element => {
          temparr.push({ value: element.id, id: element.id, label: element.name })
          setdataSetArr([...dataSetArr, { value: element.id, id: element.id, label: element.name }])
        });
        setdataSetArr(temparr)

      }
    })
  }

  const getlogs = (selectedoption) => {
    dispatch(setLoader(true))
    let params = {
      useruid: userStoreState.userDetails.id, //userStoreState.userDetails.id,
      datasetuid: selectedoption.id, //selectedoption.id,
      orguid: userStoreState.userDetails.organisationUnits[0].id, //userStoreState.userDetails.organisationUnits[0].id
    }
    console.log('getFileFormatUrl>>', params)
    
    API.get('/dataset/bulk/data/logs', {params: params})
    .then(res => {
      dispatch(setLoader(false))
      
      console.log('bulk/data/logs>>>', res, typeof res.data, res.data)
      if(res.data.data && res.data.data.length > 0) {
        let temparr = res.data.data.map(o => {
          return {
            ...o,
            uploadedOn: moment(o.uploadedOn).format("YYYY-MM-DD hh:mm A")
          }
        })
        
        setlogData(temparr.reverse())
        setlogTableKey(Math.random())
      } else {
        setlogData([])
        setlogTableKey(Math.random())
      }
    })
  }

  const onChange = (selectedOption) => {
    console.log('onChange>>', selectedOption)
    
    setselecteddataset(selectedOption)
    setprevselecteddataset(selectedOption)
    if(selectedOption && selectedOption.id) {
      getlogs(selectedOption)
    }
      
  }

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
        <div id="datalog" className="smart-setup-wrapper" style={{ height: "calc(100vh - 60px)" }}>
          <div className="row">
            <div className="col-12">
              <div className="form-wizard ">
                <Card>
                  <Card.Header className="cardBlueHeader" as="h5">Data Upload Log</Card.Header>
                  {storeState.user.isEdit ?
                    <Card.Body className="odkDiv" >
                      <Row className='mb-4'>
                        <Col sm={12} md={6} className="text-left">
                          <Form.Group className="dataset-dropdown-group" controlId="formSelectDataset">
                            <Form.Label className="label text-left">Select Dataset</Form.Label>
                            <Select
                              aria-labelledby="aria-label"
                              className="basic-multi-select"
                              classNamePrefix="select"
                              options={dataSetArr}
                              isClearable={true}
                              isSearchable={true}
                              onChange={onChange}
                              // menuPortalTarget={document.body}
                              menuPosition={'fixed'}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Table
                            key={logTableKey}
                            logData={logData}
                          />
                        </Col>
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

export default XlUpload;