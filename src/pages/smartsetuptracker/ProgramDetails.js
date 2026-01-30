import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Modal, Container, Row, Image, Col } from 'react-bootstrap';
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setUserTemplate } from '../../redux/actions/userAction'
import { setProgramDetails } from '../../redux/actions/createProgramAction'
import toast, { Toaster } from 'react-hot-toast';
import TextError from '../../component/ErrorText';
import imgurl from '../../assets/images/imgUrl';
import { appicons, images } from '../../util/logos'

import _ from "lodash";

const ProgramDetails = () => {
    const store = useSelector((state) => state)
    const dispatch = useDispatch()
    const formRef = useRef(null);
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const [showModal, setShowModal] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [languagesOptions, setLanguagesOptions] = useState([]);
    const [countyList, setCountyList] = useState([]);
    const [selectedCountyList, setSelectedCountyList] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState(userTemplate.selectedlanguage);
    const [defaultLanguage, setDefaultLanguage] = useState({});
    const [attributesArray, setAttributesArray] = useState(userTemplate.attributesArray);
    const [flagEnabledValue, setFlagEnabledValue] = useState(attributesArray?.find(attr => attr.name === 'flagEnabled')?.value == "true");
    const [initialFormData, setInitialFormData] = useState({})
    const [defaultLocalValue, setDefaultLocalValue] = useState(attributesArray?.find(attr => attr.name === 'defaultLocal')?.value || '')
    useEffect(() => {
        console.log(store,"check store")
        if (store.user.isEdit) {
            // setSelectedCountyList
            setSelectedLanguages(userTemplate.selectedlanguage)
            if (userTemplate && userTemplate.logo) {
                setSelectedLogo(userTemplate.logo.split('/').pop())
            }
        } else {
            setSelectedLanguages(userTemplate.selectedlanguage)
        }
        setLanguagesOptions(store.countries.languagesList && store.countries.languagesList.map(({ locale, name }) => ({ value: locale, label: name })));
        // setCountyList(store.countries.countryList && store.countries.countryList.map(({ locale, name }) => ({ value: name, label: name })))
    }, [store])
    const ProgramDetailsSchema = Yup.object().shape({
        programname: Yup.string().required('Program name is required'),
        appname: Yup.string().required('App name is required'),
        description: Yup.string(),
        disclaimer: Yup.string(),
        languages: Yup.array().nullable(),
        country: Yup.string().required('Country is required'),
    });
    const handleClose = () => setShowModal(false);
    const handleImgeSelection = (imagename) => {
        setSelectedLogo(imagename)
        setShowModal(false)
        toast.success('New App Icon Selected!',
            {
                style: {
                    border: '1px solid #44546A',
                    padding: '16px',
                },
            }
        )
    }
    const onLangChange = (selectedOption) => {
        setDefaultLocalValue(selectedOption.value)
        if (formRef?.current) {
            formRef.current.setFieldValue('defaultLang', selectedOption?.value || '');
        }
        const index = attributesArray.findIndex(item => item.name === 'defaultLocal');
        if (index !== -1) {
            const updatedArray =  _.cloneDeep(attributesArray);
            updatedArray[index] = { ...updatedArray[index], value: selectedOption.value };
            setAttributesArray(updatedArray)
        }
    }; 
    // const defaultLocalValue = attributesArray?.find(attr => attr.name === 'defaultLocal')?.value || '';

    const onChange = selectedOption => {
        setSelectedLanguages(selectedOption)
        setDefaultLocalValue("")
    };
    const onCountryChange = (e) => {
        formRef.current.values.country = e.target.value
        setSelectedCountyList(e.target.value)
    };

    // Country Dropdown
    const countryOptions = store.countries.countryList.length > 0
        ? _.sortBy(store.countries.countryList, ['name']).map((country) => ({
            value: country.name,
            label: country.name,
        }))
        : [];

    const countryOptionHandleChange = (selectedOption) => {
        onCountryChange({ target: { value: selectedOption?.value || '' } });
        if (formRef?.current) {
            formRef.current.setFieldValue('country', selectedOption?.value || '');
        }
    };
    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <Formik
                innerRef={formRef}
                enableReinitialize
                initialValues={{
                    programname: userTemplate.name,
                    appname: userTemplate.appname,
                    description: userTemplate.description == 'null' ? "" : userTemplate.description,
                    disclaimer: userTemplate.disclaimer == 'null' ? "" : userTemplate.disclaimer,
                    languages: userTemplate.selectedlanguage,
                    country: store.user.isEdit ? store.user.userDetails.organisationUnits[0].name : (store?.programDetails?.details?.country ? store.programDetails.details.country : "")
                }}
                validationSchema={ProgramDetailsSchema}
                onSubmit={values => {
                    userTemplate.name = values.programname
                    userTemplate.appname = values.appname
                    userTemplate.description = values.description
                    userTemplate.disclaimer = values.disclaimer
                    userTemplate.selectedlanguage = selectedLanguages
                    userTemplate.attributesArray = attributesArray
                    userTemplate.countries = [values.country]
                    let selectedCountry = store.countries.countryList.filter(country => { if (country.name == values.country) return country.code })
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
                            {/* <div className="col-6">
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
                            </div> */}
                            <div className="col-6">
                                <Form.Group controlId="formSelectLanguages">
                                    <Field name='languages'>
                                        {({ field, meta }) => {
                                            return (
                                                <>
                                                    <Form.Label className="label">* Select Languages</Form.Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        menuPosition={'fixed'}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        isMulti
                                                        required={true}
                                                        options={languagesOptions}
                                                        defaultValue={store.user.isEdit ? userTemplate.selectedlanguage : selectedLanguages}
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
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        menuPosition={'fixed'}
                                                        required={true}
                                                        options={countryOptions} 
                                                        value={countryOptions.find(option => option.value === formRef?.current?.values?.country)} 
                                                        onChange={countryOptionHandleChange} 
                                                        isDisabled={store.user.isEdit} 
                                                    />
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
                                <Form.Group controlId="formSelectLanguages">
                                    <Field name='defaultLang'>
                                        {({ field, meta }) => {
                                            return (
                                                <>
                                                    <Form.Label className="label">* Select Default Language</Form.Label>
                                                    {<Select
                                                    {...field}
                                                        menuPortalTarget={document.body}
                                                        menuPosition={'fixed'}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        required={true}
                                                        maxMenuHeight={110}
                                                        options={selectedLanguages ? selectedLanguages : languagesOptions}
                                                        value={selectedLanguages && defaultLocalValue ? selectedLanguages.find(option => option.value === defaultLocalValue) : ""}
                                                        // defaultValue={store.user.isEdit ? userTemplate.selectedlanguage : selectedLanguages}
                                                        // {userTemplate.selectedlanguage}
                                                        // isClearable={formRef.current.languages ? true : false}
                                                        //isSearchable={true}
                                                        onChange={onLangChange}
                                                    />}
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
                                <div className="form-group">
                                    <div className="label form-label margin-bottom-5">Display Flag on Navbar</div>
                                    <label class="basic-multi-select css-b62m3t-container switch">

                                        <input
                                            value={flagEnabledValue}
                                            checked={flagEnabledValue}
                                            onClick={(e) => {
                                                setFlagEnabledValue((prev) => !prev)
                                                const index = attributesArray.findIndex(item => item.name === 'flagEnabled');
                                                if (index !== -1) {
                                                    const updatedArray = [...attributesArray];
                                                    updatedArray[index] = { ...updatedArray[index], value: flagEnabledValue ? "false" : "true" };
                                                    setAttributesArray(updatedArray)
                                                }
                                            }}
                                            className="big-checkbox"
                                            type="radio"
                                        />
                                        <span class="slider round"></span>
                                    </label>

                                    {/* <div className="col-5">
                                        <img className="pgmico mr-2" src={selectedLogo == null ? imgurl.pgmico.default : images[selectedLogo].default} />
                                        <i className="far fa-images"></i>
                                        <span onClick={() => setShowModal(true)}>Upload Flag Image</span>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className="col-6">
                                <div className="row">
                                    <div className="col-4">Select Application Icon</div>
                                    <div className="col-5">
                                        <img className="pgmico mr-2" src={selectedLogo == null ? imgurl.pgmico.default : images[selectedLogo].default} />
                                        <i style={{ cursor: 'pointer' }} className="far fa-images"></i>
                                        <span style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>Update Icon</span>
                                    </div>
                                </div>
                            </div> */}
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
                                appicons.length > 0 && appicons.map((image, idx) => {
                                    const currentLogo = selectedLogo == null ? imgurl.pgmico.default : images[selectedLogo].default;
                                    const isSelected = currentLogo === images[image]?.default;
                                    return (
                                        <Col
                                            key={idx}
                                            xs={6}
                                            md={2}
                                            className={`mb-3 ${isSelected ? 'highlight' : ''}`}
                                        >
                                            <Image
                                                style={{ cursor: 'pointer' }}
                                                src={images[image]?.default}
                                                rounded
                                                thumbnail
                                                onClick={() => handleImgeSelection(image)}
                                            />
                                        </Col>
                                    );
                                })
                            }
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProgramDetails;