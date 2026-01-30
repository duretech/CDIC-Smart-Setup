
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, Nav, Navbar,Tab, Button, Form, Tooltip, Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../../assets/images/imgUrl';

import Sibebar from '../../component/Sidebar';
import swal from "sweetalert";
import axios from "axios";

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'


import * as Yup from 'yup';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import TextError from '../../component/ErrorText';

import DeactivateClient from './DeactivateClient';


const AdminModule = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)

  const [tabActiveKey, settabActiveKey] = useState("first");

  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }

  useEffect(() => {
  }, []);

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
          <div className="row p-3">
            <div className="col-12">
              <Card>
                <Card.Header className="cardBlueHeader" as="h5">Admin Module</Card.Header>
                <Card.Body className='p-1'>
                {storeState.user.isEdit ?
                      <Tab.Container
                        activeKey={tabActiveKey}
                        defaultActiveKey={tabActiveKey}
                      >
                        {" "}
                        {/*activeKey={tabActiveKey}*/}
                        <Row className='p-2 adminMainDiv'>
                          <Col sm={1} md={1} lg={1}>
                            <Nav
                              variant="pills"
                              className="flex-column admin-tabs"
                            >
                              <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-bottom"
                                  eventKey="first"
                                  onClick={() => settabActiveKey("first")}
                                >
                                  <i className="fas fa-user-times"></i>
                                  Deactivated Client
                                </Nav.Link>
                              </Nav.Item>
                              {/* <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-bottom border-radius-top"
                                  eventKey="second"
                                  onClick={() => settabActiveKey("second")}
                                >
                                  <i className="fas fa-bars"></i>
                                  Menu 2
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  className="border-radius-left border-radius-bottom border-radius-top"
                                  eventKey="third"
                                  onClick={() => settabActiveKey("third")}
                                >
                                  <i className="fas fa-bars"></i>
                                  Menu 3
                                </Nav.Link>
                              </Nav.Item> */}
                            </Nav>
                          </Col>
                          <Col sm={11} md={11} lg={11}>
                            <Tab.Content>
                              <Tab.Pane eventKey="first">
                                <DeactivateClient />
                              </Tab.Pane>
                              
                              <Tab.Pane eventKey="second">
                                second
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                  : <p>Program not published</p>}
                </Card.Body>
              </Card>
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

export default AdminModule;