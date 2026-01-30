
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, Nav, Navbar, Button, Form, Tooltip, Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";
import { apiUrl } from "../util/urls";

import Sibebar from '../component/Sidebar';
import swal from "sweetalert";
import axios from "axios";

import { Map, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

import * as Yup from 'yup';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import TextError from '../component/ErrorText';

import Table from '../component/FacilityTable'

import { setLoader, setUserTemplate } from '../redux/actions/userAction'

const FacilityMgmnt = () => {
  const history = useHistory();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.user)

  const [facilityData, setFacilityData] = useState([]);
  const [facilityKey, setFacilityKey] = useState(0);

  const [orgStructure, setOrgStructure] = useState({})

  const formRef = useRef(null);
  const formRefOrg = useRef(null);
  const [facilityAddVariable, setFacilityAddVariable] = useState(false)

  // Code for org add
  const [orgAddVariable, setOrgAddVariable] = useState(false)

  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
    formRefOrg.current.values.parent = currentNode.value
    // setSelectedOrg(selectedNodes)
  }
  // org code end
  // Code for map marker
  const center = {
    lat: 51.505,
    lng: -0.09,
  }
  const [position, setPosition] = useState(center)
  function DraggableMarker() {
    const [draggable, setDraggable] = useState(false)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
            console.log(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {true
              ? 'Lat ' + (position.lat).toFixed(4) + ' : Long ' + (position.lng).toFixed(4)
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
  }
  // End
  // For Facility Creation
  const facilityObjectSchema = Yup.object().shape({
    code: Yup.string(),
    name: Yup.string().required('Facility name is required'),
    state: Yup.string().required('State is required'),
    address: Yup.string().required('Facility address is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().min(10, 'Minimum length 10'),
  });
  const orgSchema = Yup.object().shape({
    name: Yup.string().required('Organization  name is required'),
    parent: Yup.string()
  });
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const handleChange = (e) => {
    console.log(e)
  }

  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }
  useEffect(() => {
    getFacilityList()
    getOrgStructure()
    getStateList()
  }, []);

  const getOrgStructure = () => {
    let dataHolder = {
      label: userStoreState.userDetails.organisationUnits[0].name,
      value: userStoreState.userDetails.organisationUnits[0].id,
      children: []
    }
    API.get(`organisationUnits?fields=id%2Cpath%2CdisplayName%2Cchildren%3A%3AisNotEmpty&paging=false`).then((res) => {
      dataHolder.children = res.data.organisationUnits.map((org, idx) => { return ({ value: org.id, label: org.displayName }) })
      setOrgStructure(dataHolder)
    })
  }

  const getStateList = () => {
    API.get('organisationUnits/' + userStoreState.userDetails.organisationUnits[0].id + '?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]').then(res => {
      console.log(res.data)
      setStateList(res.data.children)
    })
  }
  const getFacilityList = () => {
    // API.post('dashboardIndicator/getFacilitylist',{"orguid": userStoreState.userDetails.organisationUnits[0].id}).then(res => {
    API.get('organisationUnits?filter=comment:eq:Facility&paging=false&fields=[id,name,description,address,phoneNumber,email,programs]').then(res => {
      console.log(res.data)
      setFacilityData(res.data.organisationUnits)
      setFacilityKey(Math.random())
    })
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
        <div className="smart-setup-wrapper" style={{ height: "calc(100vh - 60px)" }}>
          <div className="row">
            <div className="col-12">
              <div className="form-wizard ">
                <Card>
                  <Card.Header className="cardBlueHeader" as="h5">Facility Management</Card.Header>
                  {storeState.user.isEdit ?
                    <div classes="row">
                      <div className="col-12">
                        <div className="col-12">
                          <div className="row mb-2">
                            <div className="col-12">
                              <button onClick={(e) => { setFacilityAddVariable(true); setOrgAddVariable(false) }} type="button" title="Add Facility" className="btn btn-sm addbtn mt-2 float-right"> Create New Facility </button>
                              <button onClick={(e) => { setFacilityAddVariable(false); setOrgAddVariable(true) }} type="button" title="Add Organization " className="btn btn-sm addbtn mt-2 float-right mr-2"> Create New Organization  </button>
                            </div>
                          </div>
                          {facilityAddVariable ?

                            <Formik
                              innerRef={formRef}
                              initialValues={{
                                code: "",
                                name: "",
                                address: "",
                                email: "",
                                phoneNumber: "",
                              }}
                              validationSchema={facilityObjectSchema}
                              onSubmit={values => {
                                let instanct = {
                                  ...values,
                                  "shortName": values.name,
                                  "openingDate": new Date().toISOString(),
                                  "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                      position.lng,
                                      position.lat
                                    ]
                                  },
                                  "comment": "Facility",
                                  "parent": {
                                    "id": values.state
                                  }
                                }
                                console.log(instanct, values)
                                dispatch(setLoader(true))
                                // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                                API.post('/organisationUnits', instanct).then(response => {
                                  console.log(response)
                                  dispatch(setLoader(false))
                                  let elem = document.createElement("div");
                                  if (response.data.status == "OK") {
                                    elem.innerHTML = "Facility created sucessfully."
                                    swal({
                                      title: "Success",
                                      content: elem,
                                      icon: "success",
                                      button: "Close",
                                    }).then(function () {
                                      getFacilityList()
                                      setFacilityAddVariable(false)
                                    });
                                  } else {
                                    let elem = document.createElement("div");
                                    elem.innerHTML = 'Someting went wrong.'
                                    swal({
                                      title: "Error",
                                      content: elem,
                                      icon: "error",
                                      button: "Close",
                                    })
                                  }
                                })
                              }}
                            >
                              {({ errors, touched }) => (
                                <FForm className='userAddForm'>
                                  <Card>
                                    <Card.Header className="regcardheader">Add Facility
                                      <span className="closesign" onClick={(e) => { setFacilityAddVariable(false) }}><i aria-hidden="true" className="fa fa-times"></i></span>
                                    </Card.Header>
                                    <Card.Body className="regtabbody">
                                      <Row>
                                        <Col lg="8">
                                          <Row>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicCode">
                                                <Field name='code'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Facility Code</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <input
                                                              placeholder='Facility Code'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="code"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicName">
                                                <Field name='name'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Facility Name</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <input
                                                              placeholder='Facility Name'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="name"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicAddress">
                                                <Field name='address'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Facility Address</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <textarea
                                                              rows="4"
                                                              placeholder='Facility Address'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="address"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicEmail">
                                                <Field name='email'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Facility Email</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <input
                                                              placeholder='Facility Email'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="email"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicNumber">
                                                <Field name='phoneNumber'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Facility Phohne Number</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <input
                                                              placeholder='Facility Phohne Number'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="phoneNumber"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicState">
                                                <Field name='state'
                                                  onChange={(e) => {
                                                    console.log(e)
                                                  }}>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">State</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <select type='text' className='form-control' {...field}>
                                                              <option>--Select--</option>
                                                              {stateList.map((state, id) => {
                                                                return <option key={id} value={state.id}> {state.name}</option>
                                                              })}
                                                            </select>
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="state"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicName">
                                                <Field name='district'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">District</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <select type='text' className='form-control' {...field}>
                                                              <option>--Select--</option>
                                                              {/* {userRoles.map((role, id) => {
                                                                      return <option key={id} value={role.value}> {role.label}</option>
                                                                  })} */}
                                                            </select>
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="district"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicName">
                                                <Field name='city'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">City</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <select type='text' className='form-control' {...field}>
                                                              <option>--Select--</option>
                                                              {/* {userRoles.map((role, id) => {
                                                                      return <option key={id} value={role.value}> {role.label}</option>
                                                                  })} */}
                                                            </select>
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="city"
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg="4" >
                                          <Map style={{ height: '100%' }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                                            <TileLayer
                                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <DraggableMarker />
                                          </Map>
                                        </Col>
                                      </Row>

                                      <Button className="btn addbtn mt-2" type="submit">
                                        Add
                                      </Button>
                                    </Card.Body>
                                  </Card>
                                </FForm>
                              )}
                            </Formik>
                            : null}

                          {orgAddVariable ?

                            <Formik
                              innerRef={formRefOrg}
                              initialValues={{
                                name: "",
                              }}
                              validationSchema={orgSchema}
                              onSubmit={values => {
                                // console.log(values)
                                let instanct = {
                                  ...values,
                                  "shortName": values.name,
                                  "openingDate": new Date().toISOString(),
                                  "parent": {
                                    "id": values.parent
                                  }
                                }
                                console.log(instanct)
                                dispatch(setLoader(true))
                                // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                                API.post('/organisationUnits', instanct).then(response => {
                                  console.log(response)
                                  dispatch(setLoader(false))
                                  let elem = document.createElement("div");
                                  if (response.data.status == "OK") {
                                    elem.innerHTML = "Organization  created sucessfully."
                                    swal({
                                      title: "Success",
                                      content: elem,
                                      icon: "success",
                                      button: "Close",
                                    }).then(function () {
                                      getFacilityList()
                                      setOrgAddVariable(false)
                                    });
                                  } else {
                                    let elem = document.createElement("div");
                                    elem.innerHTML = 'Someting went wrong.'
                                    swal({
                                      title: "Error",
                                      content: elem,
                                      icon: "error",
                                      button: "Close",
                                    })
                                  }
                                })
                              }}
                            >
                              {({ errors, touched }) => (
                                <FForm className='orgAddForm'>
                                  <Card>
                                    <Card.Header className="regcardheader">Add Organization 
                                      <span className="closesign" onClick={(e) => { setOrgAddVariable(false) }}><i aria-hidden="true" className="fa fa-times"></i></span>
                                    </Card.Header>
                                    <Card.Body className="regtabbody">
                                      <Row>
                                        <Col lg="8">
                                          <Row>
                                            <Col lg="6">
                                              <Form.Label className="label">Organization  Parent</Form.Label>
                                              <DropdownTreeSelect texts={{ placeholder: 'Select Organization ' }} className="customSelect" data={orgStructure} mode="radioSelect" onChange={onChange} />
                                            </Col>
                                            <Col lg="6">
                                              <Form.Group controlId="formBasicName">
                                                <Field name='name'>
                                                  {({ field, meta }) => {
                                                    return (
                                                      <>
                                                        <Form.Label className="label">Organization  Name</Form.Label>
                                                        <div className="formgroup">

                                                          <span className="formInput">
                                                            <input
                                                              placeholder='Organization  Name'
                                                              type='text'
                                                              className='form-control'
                                                              {...field}

                                                            />
                                                          </span>
                                                        </div>
                                                      </>
                                                    )
                                                  }}
                                                </Field>
                                                <ErrorMessage
                                                  component={TextError}
                                                  name="name"
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>

                                      <Button className="btn addbtn mt-2" type="submit">
                                        Add
                                      </Button>
                                    </Card.Body>
                                  </Card>
                                </FForm>
                              )}
                            </Formik>
                            : null}
                        </div>

                      </div>
                      <div className="col-12">
                        <Card.Body className="odkDiv" >
                          <Table
                            key={facilityKey}
                            userData={facilityData}
                          // edituser={editUser}
                          />
                          {/* </div> */}
                        </Card.Body>
                      </div>
                    </div>
                    : <p>Program not published</p>}
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

export default FacilityMgmnt;