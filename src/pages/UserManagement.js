
import React, { useState, useEffect, useRef } from 'react';
import { Card, Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
//redux
import { useSelector, useDispatch } from 'react-redux';
import imgurl from '../assets/images/imgUrl';
import API from "../util";

import Sibebar from '../component/Sidebar';

import Table from '../component/Table'

import { setLoader } from '../redux/actions/userAction'

import * as Yup from 'yup';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import TextError from '../component/ErrorText';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

import swal from "sweetalert";

const UserManagement = () => {
    const history = useHistory();
    const formRef = useRef(null);
    const storeState = useSelector((state) => state)
    const dispatch = useDispatch();
    const userStoreState = useSelector((state) => state.user)
    const [userTableKey, setUserTableKey] = useState(0)
    const [userData, setUserData] = useState([])
    const [userRoles, setUserRoles] = useState([])
    const [userAddVariable, setUserAddVariable] = useState(false)
    const [userEditVariable, setUserEditVariable] = useState(false)
    const [userEditObject, setUserEditObject] = useState({})
    const [orgStructure, setOrgStructure] = useState({})
    const [selectedOrg, setSelectedOrg] = useState([])
    // console.log(storeState.user.isEdit)
    const logoutClickHandler = () => {
        sessionStorage.clear()
        history.push('/')
    }
    const onChange = (currentNode, selectedNodes) => {
        // console.log('onChange::', currentNode, selectedNodes)
        formRef.current.values.orgUnit = selectedNodes
        // setSelectedOrg(selectedNodes)
    }
    const getOrgStructure = () => {
        let dataHolder = {
            label: userStoreState.userDetails.organisationUnits[0].name,
            value: userStoreState.userDetails.organisationUnits[0].id,
            children: []
        }
        API.get(`organisationUnits?fields=id%2Cpath%2CdisplayName%2Cchildren%3A%3AisNotEmpty&paging=false`).then((res) => {
            dataHolder.children = res.data.organisationUnits.map((org, idx) => { return ({ value: org.id, label: org.displayName }) })
            setOrgStructure(dataHolder)
            // console.log(res.data.organisationUnits)
        })
    }
    const getRoleList = () => {
        API.get(`userRoles?fields=:all`).then((res) => {
            setUserRoles(res.data.userRoles.map((role, idx) => { return ({ value: role.id, label: role.displayName }) }))
            // console.log(userRoles)
        })
    }
    const getUserList = () => {
        dispatch(setLoader(true))
        // API.get(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
        API.get(`users?fields=:all&ou=`+userStoreState.userDetails.organisationUnits[0].id + `&includeChildren=true&paging=false`).then((res) => {
            dispatch(setLoader(false))
            setUserData(res.data.users)
            setUserTableKey(Math.random())
        })
    }
    useEffect(() => {
        if(storeState.user.isEdit){
            getOrgStructure()
            getRoleList()
            getUserList()
        }
    }, [])

    // For User Creation
    const userObjectSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string().min(10, 'Minimum length 10'),
        password: Yup.string().min(6, 'Minimum length 6 character').required('Password is required'),
        role: Yup.string().required('Role is required'),
        orgUnit: Yup.array()
    });

    const userEditSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: Yup.string().min(10, 'Minimum length 10'),
        // password: Yup.string().min(6, 'Minimum length 6 character').required('Password is required')
    });

    const editUser = (userData) => {
        userData.firstname  = userData.firstName
        userData.lastname  = userData.surname
        setUserEditObject(userData)
        setUserEditVariable(true)
        setUserAddVariable(false)
        console.log(userData)
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
                <div className="smart-setup-wrapper" style={{height: "calc(100vh - 60px)"}}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-wizard">
                                <Card>
                                    <Card.Header className="cardBlueHeader" as="h5">User Management</Card.Header>
                                    <Card.Body className=""  >
                                    {storeState.user.isEdit ? <div className="row">
                                            <div className="col-8" >
                                                <Table 
                                                key={userTableKey} 
                                                userData={userData}
                                                edituser={editUser}
                                                 />
                                            </div>
                                            <div className="col-4" >
                                                <div className="row mb-2">
                                                    <div className="col-12">
                                                        <button onClick={(e) => { setUserAddVariable(true);setUserEditVariable(false) }} type="button" title="Add User" className="btn btn-sm addbtn mt-2 float-right"> Add User </button>
                                                    </div>
                                                </div>
                                                {userAddVariable ?

                                                    <Formik
                                                        innerRef={formRef}
                                                        initialValues={{
                                                            firstname: '',
                                                            lastname: '',
                                                            email: '',
                                                            mobile: '',
                                                            password: '',
                                                            role: ''
                                                        }}
                                                        validationSchema={userObjectSchema}
                                                        onSubmit={values => {
                                                            let instanct = {
                                                                "userCredentials": {
                                                                    "cogsDimensionConstraints": [],
                                                                    "catDimensionConstraints": [],
                                                                    "username": values.email,
                                                                    "password": values.password,
                                                                    "userRoles": [
                                                                        {
                                                                            "id": values.role
                                                                        }
                                                                    ]
                                                                },
                                                                "email": values.email,
                                                                "phoneNumber": values.mobile,
                                                                "surname": values.lastname,
                                                                "firstName": values.firstname,
                                                                "organisationUnits": [
                                                                    {
                                                                        "id": values.orgUnit[0].value
                                                                    }
                                                                ],
                                                                "dataViewOrganisationUnits": [
                                                                    {
                                                                        "id": values.orgUnit[0].value
                                                                    }
                                                                ],
                                                                "teiSearchOrganisationUnits": [
                                                                    {
                                                                        "id": values.orgUnit[0].value
                                                                    }
                                                                ],
                                                                "attributeValues": []
                                                            }
                                                            // console.log(values)
                                                            dispatch(setLoader(true))
                                                            // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                                                            API.get('users?filter=userCredentials.username:eq:' + values.email + '&fields=id').then(response => {
                                                                if (response.data.users.length == 0) {
                                                                    API.post('users', instanct).then(res => {
                                                                        dispatch(setLoader(false))
                                                                        // console.log(res)
                                                                        let elem = document.createElement("div");
                                                                        if (res.data.status == "OK") {
                                                                            elem.innerHTML = "User created sucessfully."
                                                                            swal({
                                                                                title: "Success",
                                                                                content: elem,
                                                                                icon: "success",
                                                                                button: "Close",
                                                                            }).then(function () {
                                                                                getUserList()
                                                                                setUserAddVariable(false)
                                                                            });
                                                                        } else {
                                                                            elem.innerHTML = res.data.typeReports[0].objectReports[0].errorReports[0].message
                                                                            swal({
                                                                                title: "Error",
                                                                                content: elem,
                                                                                icon: "error",
                                                                                button: "Close",
                                                                            })
                                                                        }
                                                                    }).catch(error => {
                                                                        console.log(error)
                                                                        dispatch(setLoader(false))
                                                                    })
                                                                } else {
                                                                    let elem = document.createElement("div");
                                                                    elem.innerHTML = 'Username / Email already exist in the system.'
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
                                                                    <Card.Header className="regcardheader">Add User
                                                                        <span className="closesign" onClick={(e) => { setUserAddVariable(false) }}><i aria-hidden="true" className="fa fa-times"></i></span>
                                                                    </Card.Header>
                                                                    <Card.Body className="regtabbody">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Field name='firstname'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">First Name</Form.Label>
                                                                                            <div className="formgroup">

                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='First Name'
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
                                                                                name="firstname"
                                                                            />
                                                                        </Form.Group>

                                                                        <Form.Group controlId="formBasicPassword">
                                                                            <Field name='lastname'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Last Name</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Last Name'
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
                                                                                name="lastname"
                                                                            />

                                                                        </Form.Group>
                                                                        <Form.Group controlId="formYourMobileNumber">
                                                                            <Field name='mobile'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Mobile Number</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Mobile Number'
                                                                                                        type='number'
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
                                                                                name="mobile"
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group controlId="formRole">
                                                                            <Field name='role'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Role</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <select type='text' className='form-control' {...field}>
                                                                                                        <option>--Select--</option>
                                                                                                        {userRoles.map((role, id) => {
                                                                                                            return <option key={id} value={role.value}> {role.label}</option>
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
                                                                                name="role"
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group controlId="formBasicEmailAddress">
                                                                            <Field name='email'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Email Address</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Email'
                                                                                                        type='email'
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
                                                                        <Form.Group controlId="formYourPassword">
                                                                            <Field name='password'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Password</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Password'
                                                                                                        type='password'
                                                                                                        className='form-control'
                                                                                                        {...field}
                                                                                                        autocomplete="new-password"
                                                                                                    />
                                                                                                </span>
                                                                                            </div>
                                                                                        </>
                                                                                    )
                                                                                }}
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                component={TextError}
                                                                                name="password"
                                                                            />
                                                                        </Form.Group>

                                                                        <Form.Group controlId="formOrg">
                                                                            <Form.Label className="label">Organisation</Form.Label>
                                                                            <DropdownTreeSelect texts={{ placeholder: 'Select Organisation' }} className="customSelect" data={orgStructure} mode="radioSelect" onChange={onChange} />
                                                                        </Form.Group>

                                                                        <Button className="btn addbtn mt-2" type="submit">
                                                                            Add
                                                                        </Button>
                                                                    </Card.Body>
                                                                </Card>
                                                            </FForm>
                                                        )}
                                                    </Formik>
                                                    : null}
                                                {userEditVariable ?

                                                    <Formik
                                                        innerRef={formRef}
                                                        initialValues={userEditObject}
                                                        validationSchema={userEditSchema}
                                                        onSubmit={values => {
                                                            // console.log(values)
                                                            dispatch(setLoader(true))
                                                            API.put('users/' + values.id,values).then(res => {
                                                                dispatch(setLoader(false))
                                                                let elem = document.createElement("div");
                                                                if (res.data.status == "OK") {
                                                                    elem.innerHTML = "User updated sucessfully."
                                                                    swal({
                                                                        title: "Success",
                                                                        content: elem,
                                                                        icon: "success",
                                                                        button: "Close",
                                                                    }).then(function () {
                                                                        getUserList()
                                                                        setUserEditVariable(false)
                                                                    });
                                                                }else {
                                                                    elem.innerHTML = res.data.typeReports[0].objectReports[0].errorReports[0].message
                                                                    swal({
                                                                        title: "Error",
                                                                        content: elem,
                                                                        icon: "error",
                                                                        button: "Close",
                                                                    })
                                                                }
                                                            }).catch(error => {
                                                                console.log(error)
                                                                dispatch(setLoader(false))
                                                            })
                                                        }}
                                                    >
                                                        {({ errors, touched }) => (
                                                            <FForm className='userAddForm'>
                                                                <Card>
                                                                    <Card.Header className="regcardheader">Edit User
                                                                        <span className="closesign" onClick={(e) =>{ setUserEditVariable(false) } }><i aria-hidden="true" className="fa fa-times"></i></span>
                                                                    </Card.Header>
                                                                    <Card.Body className="regtabbody">
                                                                        <Form.Group controlId="formBasicEmail">
                                                                            <Field name='firstname'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">First Name</Form.Label>
                                                                                            <div className="formgroup">

                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='First Name'
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
                                                                                name="firstname"
                                                                            />
                                                                        </Form.Group>

                                                                        <Form.Group controlId="formBasicPassword">
                                                                            <Field name='lastname'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Last Name</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Last Name'
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
                                                                                name="lastname"
                                                                            />

                                                                        </Form.Group>
                                                                        <Form.Group controlId="formYourMobileNumber">
                                                                            <Field name='phoneNumber'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Mobile Number</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Mobile Number'
                                                                                                        type='number'
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
                                                                        {/* <Form.Group controlId="formRole">
                                                                            <Field name='role'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Role</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <select type='text' className='form-control' {...field}>
                                                                                                        <option>--Select--</option>
                                                                                                        {userRoles.map((role, id) => {
                                                                                                            return <option key={id} value={role.value}> {role.label}</option>
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
                                                                                name="role"
                                                                            />
                                                                        </Form.Group> */}
                                                                        <Form.Group controlId="formBasicEmailAddress">
                                                                            <Field name='email' >
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">Email Address</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        disabled={true}
                                                                                                        placeholder='Email'
                                                                                                        type='email'
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
                                                                        <Form.Group controlId="formYourPassword">
                                                                            <Field name='password'>
                                                                                {({ field, meta }) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Label className="label">New Password</Form.Label>
                                                                                            <div className="formgroup">
                                                                                                <span className="formInput">
                                                                                                    <input
                                                                                                        placeholder='Password'
                                                                                                        type='password'
                                                                                                        className='form-control'
                                                                                                        {...field}
                                                                                                        autocomplete="new-password"
                                                                                                    />
                                                                                                </span>
                                                                                            </div>
                                                                                        </>
                                                                                    )
                                                                                }}
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                component={TextError}
                                                                                name="password"
                                                                            />
                                                                        </Form.Group>

                                                                        {/* <Form.Group controlId="formOrg">
                                                                            <Form.Label className="label">Organisation</Form.Label>
                                                                            <DropdownTreeSelect texts={{ placeholder: 'Select Organisation' }} className="customSelect" data={orgStructure} mode="radioSelect" onChange={onChange} />
                                                                        </Form.Group> */}

                                                                        <Button className="btn addbtn mt-2" type="submit">
                                                                            Update
                                                                        </Button>
                                                                    </Card.Body>
                                                                </Card>
                                                            </FForm>
                                                        )}
                                                    </Formik>
                                                    : null}
                                            </div>
                                        </div> : <p>Program not published</p>}
                                        
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
        </>
    );
};

export default UserManagement;