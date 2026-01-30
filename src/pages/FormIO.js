
import React, { useState, useEffect, useRef, Component } from 'react';
import { Card, Nav, Navbar, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { setActiveTab, setLoader, setEditFlag, setUserTemplate, setUser } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";

import Sibebar from '../component/Sidebar';
import 'react-dropdown-tree-select/dist/styles.css'

import { FormBuilder } from '@formio/react';
import { element } from 'prop-types';
import _ from "lodash";
import swal from "sweetalert";
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

const FormIO = () => {
    const history = useHistory();
    const formRef = useRef(null);
    const storeState = useSelector((state) => state)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const userDetails = useSelector((state) => state.user.userDetails)
    const dispatch = useDispatch()
    const userStoreState = useSelector((state) => state.user)
    const [FormIOJSON, setFormIOJSON] = useState({ 
        display: "wizard",
        "components": [
            {
                "title": "Patient Registration",
                "label": "Patient Registration",
                "type": "panel",
                "key": "patientRegistration",
                "input": false,
                "tableView": false,
                "components": []
            }
        ]
    })
    const [currentIndex, setCurrentIndex] = useState()

    // 
    const [userArray, setUserArray] = useState([])
    const [showModal, setShowModal] = useState(false);
    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }
    useEffect(() => {
        if (storeState.user.isEdit) {
            API.get(`dataStore/formiometa/` + storeState.user.userDetails.organisationUnits[0].id).then((res) => {
                // console.log(res)
                if (res.status == 200) {
                    setFormIOJSON(res.data)
                }
            })
        }
        console.log(storeState, FormIOJSON)
    }, [])
    const getProgramTemplate = (data) => {
        dispatch(setLoader(true))
        API.get(`dataStore/template/programtemplate`).then((res) => {
            dispatch(setLoader(false))
            if (res.status === 200) {
                if (data) {
                    res.data.programstages =  data.data.programstages
                    res.data.trackedentityattributes =  data.data.trackedentityattributes
                    res.data["userAccesses"] =  data.data.userAccesses
                    res.data["organisationUnits"] =  data.data.organisationUnits
                    res.data.appname = data.programdetails.appname
                    res.data.countries = data.programdetails.countries
                    res.data.description = data.programdetails.description
                    res.data.disclaimer = data.programdetails.disclaimer
                    res.data.logo = data.programdetails.logo
                    res.data.name = data.programdetails.name
                    res.data.programuid = data.programdetails.programuid
                    res.data.selectedlanguage = data.programdetails.selectedlanguage
                    res.data['users'] = data.programdetails.users
                }else{
                    res.data['attributedependentquestions']= []
                    res.data['stageDependentArray']= []
                }
                dispatch(setUserTemplate(res.data))
                dispatch(setActiveTab('step1'))
                history.push('/dashboard')
            }
        }).catch(error => {
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const handleClose = () => {
        dispatch(setLoader(true))
        let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
        API.get(url).then(response => {
            dispatch(setLoader(false))
            dispatch(setUser(response.data))
            API.get('tracker/smartsetup/get/' + response.data.organisationUnits[0].id).then(res => {
                dispatch(setEditFlag(true))
                if (res.data.programdetails.value) {
                    let programDetails = JSON.parse(res.data.programdetails.value)
                    res.data.programdetails = programDetails
                }
                let formIOMeta = FormIOJSON
                // res.data.data.map((dataset,idx) => {
                //     let setIndex = _.findIndex(formIOMeta.components,['label', dataset.name])
                //     formIOMeta.components[setIndex]['uid'] = dataset.id
                //     dataset.dataelements.map((element,id) => {
                //         let elementIndex = _.findIndex(formIOMeta.components[setIndex].components,['label', element.name])
                //         formIOMeta.components[setIndex].components[elementIndex]['uid'] = element.id
                //     })    
                // })
                API.post(`dataStore/formiometa/` + response.data.organisationUnits[0].id, formIOMeta).then((res) => {
                    console.log(res)
                })
                getProgramTemplate(res.data)
            }).catch(error => {
                dispatch(setActiveTab('step1'))
                dispatch(setLoader(false))
                console.log(error)
            })
        }).catch(error => {
            dispatch(setActiveTab('step1'))
            dispatch(setLoader(false))
            console.log(error)
        })
        setShowModal(false)

    }
    const submitCall = () => {
        let input = storeState.programDetails.userTemplate
        input['userid'] = storeState.user.userDetails.id
        input['username'] = storeState.user.userDetails.userCredentials.username
        if (!storeState.user.isEdit) {
            dispatch(setLoader(true))
            input.components = FormIOJSON.components
            // console.log(input)
            API.post('formio/dhis/tracker/save', input).then(res => {
                console.log(res)
                dispatch(setLoader(false))
                if (res.status == 200 && res.data.data) {
                    setUserArray(res.data.data)
                    setShowModal(true)
                }else{

                }
            })
        } else {
            let inputJson = userTemplate
            inputJson['userid'] = userDetails.id
            inputJson['username'] = userDetails.userCredentials.username
            inputJson['orgid'] = storeState.user.userDetails.organisationUnits[0].id
            FormIOJSON.components.map(component => {
                let setIndex = _.findIndex(inputJson.datasets,['id', component.uid])
                inputJson.datasets[setIndex]['name'] = component.title
                inputJson.datasets[setIndex]['isUpdate'] = true
                component.components.map(element => {
                    let elementIndex = _.findIndex(inputJson.datasets[setIndex].dataelements,['id', element.uid])
                    inputJson.datasets[setIndex].dataelements[elementIndex].name = element.label
                    inputJson.datasets[setIndex].dataelements[elementIndex]['isUpdate'] = true
                })
            })
            console.log(inputJson)
            dispatch(setLoader(true))
            API.post('dataset/smartsetup/edit', inputJson).then(res => {
                dispatch(setLoader(false))
                if (res.data.status == 'Success') {
                    swal({
                        title: "Success",
                        text: "Program details updated sucessfully",
                        icon: "success",
                        button: "Close",
                    }).then(function () {
                        API.put(`dataStore/formiometa/` + storeState.user.userDetails.organisationUnits[0].id, FormIOJSON).then((response) => {
                            console.log(response)
                        })
                        dispatch(setLoader(true))
                        let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
                        API.get(url).then(res => {
                            API.get('dataset/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
                                dispatch(setLoader(false))
                                dispatch(setEditFlag(true))                            
                                if(res.data.programdetails.value){
                                    let programDetails = JSON.parse(res.data.programdetails.value)
                                    res.data.programdetails = programDetails
                                }
                                getProgramTemplate(res.data)
                            }).catch(error => {
                                dispatch(setLoader(false))
                                console.log(error)
                            })
                        }).catch(error => {
                            dispatch(setLoader(false))
                            console.log(error)
                        })
                    });
                }
            })  
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
                <div className="smart-setup-wrapper" style={{ height: "calc(100vh - 60px)" }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-wizard">
                                <Card>
                                    <Card.Header className="cardBlueHeader" as="h5">FormIO</Card.Header>
                                    <Card.Body className=""  >
                                        <div className="col-12 mt-4" >

                                            <FormBuilder
                                                options={{
                                                    builder: {
                                                        // layout: false,
                                                        premium: false,
                                                        basic: {
                                                            default: true,
                                                            components: {
                                                                password:false,
                                                                button:false
                                                            }
                                                        },
                                                        advanced: {
                                                            components: {
                                                                email:false,
                                                                phoneNumber:false,
                                                                tags:false,
                                                                day:false,
                                                                time:false,
                                                                currency:false,
                                                                signature:false
                                                            }
                                                        },
                                                        layout:{
                                                            components: {
                                                                htmlelement:false,
                                                                content:false,
                                                                fieldset:false,
                                                                table:false,
                                                                well:false
                                                            }
                                                        },
                                                        data:false
                                                    }
                                                }}
                                                form={FormIOJSON}
                                                onChange={schema => {
                                                    schema.components.map(component => {
                                                        if (!component.level) {
                                                            component.level = '1'
                                                        }
                                                        if (!component.period) {
                                                            component.period = "Monthly"
                                                        }
                                                    })
                                                    setFormIOJSON(schema)
                                                    console.log(schema)
                                                }}
                                            />
                                        </div>
                                        {storeState.user.isEdit ? null : 
                                        <div className="textbtns mr-3">
                                             <span><Button onClick={() => submitCall()} type="submit" className="nextbtn ml-2">Submit</Button></span>
                                        </div> }
                                    </Card.Body>
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
            <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
                <Modal.Header className="p-2" closeButton>
                    <Modal.Title >Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={6} md={6} className="mb-3">Username</Col>
                            <Col xs={6} md={6} className="mb-3">Password</Col>
                        </Row>
                        {
                            userArray.length > 0 && userArray.map((user, idx) => {
                                return <Row key={`elm2` + idx}>
                                    <Col xs={6} md={6} className="mb-3">{user.username}</Col>
                                    <Col xs={6} md={6} className="mb-3">{user.password}</Col>
                                </Row>
                            })
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer className="p-2">
                    <Button className="btn wizard-btnn btn-sm mr-4" variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FormIO;