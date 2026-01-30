import React,{useState, useEffect, useRef} from "react";
import { Button, Form, Modal, Container, Row, Image, Col} from 'react-bootstrap';
import { ErrorMessage, Field, useField, Formik, Form as FForm  } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
//redux
import { useSelector,useDispatch } from 'react-redux';
import {setActiveTab,setUserTemplate} from '../../redux/actions/userAction'
import {setProgramDetails} from '../../redux/actions/createProgramAction'

import TextError from '../../component/ErrorText';
import imgurl from '../../assets/images/imgUrl';
import {appicons,images} from '../../util/logos'

import _ from "lodash";

const ProgramDetails = () => {
    const store = useSelector((state)=> state)    
    const dispatch = useDispatch()
    const formRef = useRef(null);
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const [showModal,setShowModal] = useState(false);
    const [selectedLogo,setSelectedLogo] = useState(null);
    const [languagesOptions,setLanguagesOptions] = useState([]);
    const [countyList,setCountyList] = useState([]);
    const [selectedCountyList,setSelectedCountyList] = useState([]);
    const [selectedLanguages,setSelectedLanguages] = useState([{ label: "English", value: 'en' }]);
    const [initialFormData,setInitialFormData] = useState({})
    // console.log(userTemplate)
    useEffect(()=>{
        if(store.user.isEdit){
            setSelectedLanguages(userTemplate.selectedlanguage)
            if(userTemplate && userTemplate.logo) {
                setSelectedLogo(userTemplate.logo.split('/').pop())
            }
        }else{
            setSelectedLanguages([{ label: "English", value: 'en' }])
        }
        setLanguagesOptions(store.countries.languagesList && store.countries.languagesList.map(({ locale, name }) => ({ value: locale, label: name })));
        // setCountyList(store.countries.countryList && store.countries.countryList.map(({ locale, name }) => ({ value: name, label: name })))
    },[store])
    const ProgramDetailsSchema = Yup.object().shape({
        programname: Yup.string().required('Program name is required'),
        appname: Yup.string().required('App name is required'),
        description: Yup.string(),
        disclaimer: Yup.string(),
        languages: Yup.array().nullable(),
        // country:  Yup.array().required('Country is required')
        country:  Yup.string().required('Country is required'),
    });
    const handleClose = () => setShowModal(false);
    const handleImgeSelection = (imagename) => {
        setSelectedLogo(imagename)
        setShowModal(false)
    }
    const onChange = selectedOption => {
        setSelectedLanguages(selectedOption)
        console.log(`Option selected:`, selectedOption);
    };
    const onCountyChange = selectedOption => {
        setSelectedCountyList(selectedOption)
    };
    return(
        <>
            <Formik
                innerRef={formRef}
                enableReinitialize
                initialValues={{
                    programname: userTemplate.name,
                    appname: userTemplate.appname,
                    description: userTemplate.description == 'null' ? "" : userTemplate.description,
                    disclaimer: userTemplate.disclaimer == 'null' ? "" : userTemplate.disclaimer,
                    languages:userTemplate.selectedlanguage,
                    country: store.user.isEdit ? store.user.userDetails.organisationUnits[0].name : ''
                }}
                validationSchema={ProgramDetailsSchema}
                onSubmit={values => {
                    userTemplate.name = values.programname
                    userTemplate.appname = values.appname
                    userTemplate.description = values.description
                    userTemplate.disclaimer = values.disclaimer
                    userTemplate.selectedlanguage = selectedLanguages
                    userTemplate.countries = [values.country]
                    let selectedCountry = store.countries.countryList.filter(country => {if(country.name == values.country) return country.code})
                    userTemplate.countrycode = selectedCountry[0].code
                    // selectedCountyList.map((country,idx) => { return country.value})
                    userTemplate.logo = selectedLogo ? ('assets/img/appIcon/' + selectedLogo) : userTemplate.logo 
                    dispatch(setUserTemplate(userTemplate))
                    dispatch(setActiveTab('step2'))
                    values['languages'] = selectedLanguages;
                    dispatch(setProgramDetails(values))
                }}
            >
                {({ errors, touched }) => (
                    <FForm className="proform">
                        <div className="textbtns mr-3">
                            {/* <span><Button className="testbtn" >Test TBI Generic</Button></span> */}
                            <span><Button type="submit" className="nextbtn ml-2">Next</Button></span>
                        </div>
                        <div className="programTitle mb-4"><h6>Program Details</h6></div>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="formProgramName">
                                    <Field name='programname'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">* Program Name</Form.Label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder="Prevent TB"
                                                    {...field}
                                                />
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="programname"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="formAppName">
                                    <Field name='appname'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">* App Name</Form.Label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder="Prevent TB"
                                                    {...field}
                                                />
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="appname"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="formProgramDesc">
                                    <Field name='description'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">Program Description</Form.Label>
                                                <textarea
                                                    rows={4}
                                                    className='form-control'
                                                    {...field}
                                                />
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="description"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="formDisclaimer">
                                    <Field name='disclaimer'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">Standard Disclaimer, if any</Form.Label>
                                                <textarea
                                                    rows={4}
                                                    className='form-control'
                                                    {...field}
                                                />
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="disclaimer"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="formSelectLanguages">
                                    <Field name='languages'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">Select Languages</Form.Label>
                                                <Select
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    isMulti
                                                    options={languagesOptions} 
                                                    defaultValue={store.user.isEdit ? userTemplate.selectedlanguage : selectedLanguages }
                                                    // {userTemplate.selectedlanguage}
                                                    //isClearable={true}
                                                    //isSearchable={true}
                                                    onChange={onChange}
                                                />
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="languages"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="formSelectCountry">
                                    <Field name='country'>
                                        {({ field, meta }) => {
                                            return (
                                            <>
                                                <Form.Label className="label">* Select Country</Form.Label>
                                                {/* <Select
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    isMulti
                                                    options={countyList} 
                                                    //isClearable={true}
                                                    //isSearchable={true}
                                                    onChange={onCountyChange}
                                                /> */}
                                                <select 
                                                    type='text'
                                                    className='form-control'
                                                    {...field}
                                                    disabled={store.user.isEdit ? true : false}
                                                    >
                                                        <option />
                                                        {
                                                        (store.countries.countryList.length > 0)
                                                            ? _.sortBy(store.countries.countryList,['name']).map((country, idx) => {
                                                            return <option value={country.name} key={idx}>{country.name}</option>
                                                            })
                                                            : ""
                                                        }
                                                </select>
                                                
                                            </>
                                            )
                                        }}
                                    </Field>
                                    <ErrorMessage
                                        component={TextError}
                                        name="country"
                                    />
                                    
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-4">Select Application Icon</div>
                                    <div className="col-5">
                                        <img className="pgmico mr-2" src={selectedLogo == null ? imgurl.pgmico.default : images[selectedLogo].default} />
                                        <i className="far fa-images"></i>
                                        <span onClick={()=>setShowModal(true)}>Update Icon</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="textbtns mr-3 mb-4">
                            {/* <span><Button className="testbtn" >Test TBI Generic</Button></span> */}
                            <span><Button type="submit" className="nextbtn ml-2">Next</Button></span>
                        </div>
                    </FForm>
                )}           
            </Formik>
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Logo</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                            {
                                appicons.length > 0 && appicons.map((image,idx) => {
                                    return <Col key={idx} xs={6} md={2} className="mb-3"><Image src={images[image].default} rounded thumbnail onClick={() => handleImgeSelection(image)} /></Col>
                                })
                            }
                            </Row>
                        </Container>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProgramDetails;