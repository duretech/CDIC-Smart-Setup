import React, { useState } from 'react';
import { Button, Nav, Navbar, Form } from 'react-bootstrap';
import { ErrorMessage, Field, FieldArray, Formik, Form as FForm } from 'formik';
import * as Yup from 'yup';
import {
    Link,
    useHistory
} from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash"
import API, { register } from '../util';
import TextError from '../component/ErrorText';
import imgurl from '../assets/images/imgUrl';

import { useSelector, useDispatch } from 'react-redux';
import { setLoader } from '../redux/actions/userAction'
import { basicAuthToken } from '../config/appConfig';

const Register = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const passwordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
    const RegistrationSchema = Yup.object().shape({
        // firstname: Yup.string().required('First name is required'),
        firstname: Yup.string().min(2, 'Minimum length 2 character').required('First name is required'),
       // lastname: Yup.string().required('Last name is required'),
        lastname: Yup.string().min(2, 'Minimum length 2 character').required('Last name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string().min(10, 'Minimum length 10'),
       // password: Yup.string().min(6, 'Minimum length 6 character').required('Password is required'),
       password: Yup.string()
       .matches(passwordRegex, "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.")
       .required("Password is required"),
    });
    const onRegistrationSubmit = values => {
        setLoading(true);
        dispatch(setLoader(true))
        register(basicAuthToken, values)
            .then((res) => {
                let elem = document.createElement("div");
                if (res.status === 200) {
                    if (res.data.messagewithtoken != undefined) {
                        elem.innerHTML = res.data.messagewithtoken;
                    } else {
                        elem.innerHTML = res.data.message;
                    }
                    swal({
                        title: res.data.messagewithtoken ? "Success" : "Error",
                        content: elem,
                        icon: res.data.messagewithtoken ? "success" : "error",
                        button: "Close",
                    }).then(function () {
                        if (res.data.messagewithtoken)
                            history.push('/Activate')
                    });

                }
                dispatch(setLoader(false))
                setLoading(false)
            })
            .catch((error) => {
                dispatch(setLoader(false))
                setLoading(false)
                console.log("error>>", error);
                swal({
                    title: "Error",
                    text: "Registration error",
                    icon: "error",
                    button: "Close",
                });
            });
    }
    return (
        <div>
            <div>
                <Navbar className="navbg" expand="lg">
                    <Navbar.Brand href="#home">
                        {/* <img className="endLogo" src={imgurl.endlogo.default} /> */}
                        <span className="ml-2">Smart-Setup</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto pr-4 mr-1">
                            <Nav.Link ><Link className="navLink" to="/">Login</Link></Nav.Link>
                            <Nav.Link ><Link className="navLink" to="/Register">Register</Link></Nav.Link>
                            <Nav.Link ><Link className="navLink" to="/Activate">Activate Account</Link></Nav.Link>

                        </Nav>

                    </Navbar.Collapse>
                </Navbar>
            </div>
            <div className="mainContentLogin pt-5 pb-5">
                <div className="registercontent">
                    <div className="card-title"><h4>Register</h4></div>
                    <div className="row content">

                        <div className="col">

                            <div className="card-content">
                                <div className="info info-horizontal">
                                    <div className="icon icon-primary"><i className="fa fa-chart-line"></i></div>
                                    <div className="description"><h4 className="info-title">Program Performance</h4>
                                        <p className="description"> Real time indicators &amp; program performance for community centric intiatives. Configure program as you need. </p>
                                    </div>
                                </div>
                                <div className="info info-horizontal">
                                    <div className="icon icon-info"><i className="fa fa-cog"></i></div>
                                    <div className="description"><h4 className="info-title">Smart Setup</h4>
                                        <p className="description"> Ready to use business templates on the cloud. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <Formik
                                initialValues={{
                                    firstname: '',
                                    lastname: '',
                                    email: '',
                                    mobile: '',
                                    password: '',
                                }}
                                validationSchema={RegistrationSchema}
                                onSubmit={values => {
                                    console.log(values)
                                    onRegistrationSubmit(values)
                                }}
                            >
                                {({ errors, touched }) => (
                                    <FForm>
                                        <Form.Group controlId="formBasicEmail">
                                            <Field name='firstname'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Your First Name *</Form.Label>
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
                                                            <Form.Label className="label">Your Last Name *</Form.Label>
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
                                        <Form.Group controlId="formBasicEmailAddress">
                                            <Field name='email'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Email Address *</Form.Label>
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
                                        <Form.Group controlId="formOrganizationName">
                                            <Field name='orgname'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Organization Name</Form.Label>
                                                            <div className="formgroup">
                                                                <span className="formInput">
                                                                    <input
                                                                        placeholder='Organization'
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
                                                name="orgname"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formOrganizationType">
                                            <Field name='orgtype'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Organization Type</Form.Label>
                                                            <div className="formgroup">
                                                                <span className="formInput">
                                                                    <select type='text' className='form-control' {...field}>
                                                                        <option>--Select--</option>
                                                                        <option value="Government">Government</option>
                                                                        <option value="NGO">NGO</option>
                                                                        <option value="Community Based Organisation (CBO)">Community Based Organisation (CBO)</option>
                                                                        <option value="Private Company">Private Company</option>
                                                                        <option value="CSR organisation">CSR organisation</option>
                                                                        <option value="WHO Country/Regional Office">WHO Country/Regional Office</option>
                                                                        <option value="Others">Others</option>
                                                                    </select>
                                                                </span>
                                                            </div>

                                                        </>
                                                    )
                                                }}
                                            </Field>
                                            <ErrorMessage
                                                component={TextError}
                                                name="orgtype"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formYourMobileNumber">
                                            <Field name='mobile'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Your Mobile Number</Form.Label>
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
                                        <Form.Group controlId="formYourPassword">
                                            <Field name='password'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">Password *</Form.Label>
                                                            <div className="formgroup">
                                                                <span className="formInput">
                                                                    <input
                                                                        placeholder='Password'
                                                                        type='password'
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
                                                name="password"
                                            />
                                        </Form.Group>

                                        <Button className="regbtn" type="submit" disabled={loading}>
                                            Register
                                        </Button>
                                    </FForm>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                <div>

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
        </div>


    );


};

export default Register;