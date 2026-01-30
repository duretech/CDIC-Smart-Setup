import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Form, Tabs, Tab, Accordion, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setUserTemplate } from '../../redux/actions/userAction'
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import TextError from '../../component/ErrorText';
import {
    useHistory
} from "react-router-dom";

import _ from "lodash";

const ServicesStep = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const storeState = useSelector((state) => state)
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const userInputs = useSelector((state) => state.programDetails.details)
    const [stageArray, setStageArray] = useState(userTemplate.datasets > 0 ? userTemplate.datasets : [])
    const [stageRenderKey, setStageRenderKey] = useState(0)
    const [questionObject, setQuestionObject] = useState({})
    const [optionsArray, setOptionsArray] = useState([])
    const [optionValuesLocaleObject, setOptionValuesLocaleObject] = useState({})
    const [optionValuesLocaleArray, setOptionValuesLocaleArray] = useState([])
    const [languagesArray, setLanguagesArray] = useState([])
    const [isEditQuestion, setIsEditQuestion] = useState(false)
    const [dataVariableToggle, setDataVariableToggle] = useState(false)
    const [formToggle, setformToggle] = useState(false)
    const [isEditStage, setIsEditStage] = useState(false)
    const [tabKey, setKey] = useState(userInputs && userInputs.languages.length>0 ? userInputs.languages[0].value : null);
    const [currentDataelement, setCurrentDataelement] = useState([])
    // console.log(storeState)
    const questionObjectSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        mandatory: Yup.string(),
        attributeRefType: Yup.string().required('Attribute Type is required'),
        stagename: Yup.string().required('Stage Name is required'),
        parentQuestion: Yup.string(),
        dependentValue: Yup.string(),
    });
    const stageObjectSchema = Yup.object().shape({
        name: Yup.string().required('Stage name is required'),
    });
    const [stageObject, setStageObject] = useState({})
    const [defaultActiveKey, setDefaultActiveKey] = useState('0')
    const stageTogglerHandler = (stageName) => {
        let arrayHolder = stageArray
        arrayHolder.map((stageObj, idx) => {
            if (stageObj.name == stageName) {
                let currrentFlag = !stageObj.isActive
                stageObj.isActive = currrentFlag
            }
        })
        setStageArray([...arrayHolder])
    }
    useEffect(() => {
        let tempArr = userTemplate.datasets
        tempArr.map((set, id) => {
            if(!set['sortOrder']){
                set['sortOrder'] = id
            }
            set.dataelements.map((element, idx) => {
                tempArr[id].dataelements[idx]['sortOrder'] = idx
            })
            if (!set.level) {
                set.level = '1'
            }
        })
        setStageArray(_.sortBy(tempArr,'sortOrder'))
        console.log(tempArr)
    }, [userTemplate])
    useEffect(() => {
        // console.log(languagesObject)
    }, [languagesArray])
    useEffect(() => {
        // console.log(optionValuesLocaleObject)
    }, [optionValuesLocaleObject])
    // Utility Functions 
    const mergeByProperty = (target, source, prop) => {
        source.forEach(sourceElement => {
            let targetElement = target.find(targetElement => {
                return sourceElement[prop] === targetElement[prop];
            })
            targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
        })
    }
    const move = (array, from, to, on = 1) => {
        return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
    }
    const convertToLowerCase = (str) => {
        return str.toLowerCase().split(' ').join('');
    }
    // End
    const pushQuestionToStage = (values) => {
        setDataVariableToggle(false)
        let arrayHolder = stageArray
        let localeHolder = [...optionValuesLocaleArray]
        arrayHolder.map((stageObj, id) => {
            if (stageObj.name && convertToLowerCase(stageObj.name) == convertToLowerCase(values['stagename'])) {
                if (values.attributeRefType == 'optionset') {
                    values['optionvalues'] = optionsArray
                    values['optionname'] = "option_" + Date.now();
                }
                else if (values.attributeRefType == 'checkbox')
                    values['checkboxoption'] = optionsArray
                values['languages'] = languagesArray
                values.languages.map((lang, idx) => {
                    if (lang.locale == 'en')
                        values.languages.splice(idx, 1)
                })
                if (isEditQuestion) {
                    stageObj.dataelements.map((element, idx) => {
                        if (element.orignalname === values.orignalname) {
                            element.optionvaluesLocale = localeHolder
                            values['isupdate'] = true
                            arrayHolder[id].dataelements[idx] = values
                            return
                        }
                    })
                } else {
                    values['optionvaluesLocale'] = localeHolder
                    stageObj.dataelements.push(values)
                }
            }
        })
        console.log(values, arrayHolder)
        setStageArray([...arrayHolder])
        // console.log(stageArray)
        // setStageArray([...stageArray,values])
    }
    // Code for Movment of Service/Question
    const moveService = (from, to) => {
        let tempArr = stageArray
        tempArr[from]['sortOrder'] = to
        tempArr[to]['sortOrder'] = from
        if (to != -1 && from < stageArray.length) {
            setStageArray(move(tempArr, from, to))
        }
    }
    const moveQuestion = (from, to, questionArr, stagenameKey) => {
        let tempArr = stageArray
        questionArr[from]['sortOrder'] = to
        questionArr[to]['sortOrder'] = from
        tempArr.map((el, idx) => {
            if (el.name == stagenameKey) {
                if (to != -1 && from < questionArr.length) {
                    el.dataelements = move(questionArr, from, to)
                }
                el.name = ''
                el.name = stagenameKey
                setStageRenderKey(stageRenderKey + 1)
            }
        })
        setStageArray(tempArr)
        console.log(tempArr)
    }
    // Movment Code End
    const frequencyChange = (stageIndex, frequency) => {
        let arrayHolder = stageArray
        arrayHolder[stageIndex].period = frequency
        setStageArray([...arrayHolder])
    }
    const levelChange = (stageIndex, level) => {
        let arrayHolder = stageArray
        arrayHolder[stageIndex].level = level
        setStageArray([...arrayHolder])
    }
    const renderStages = () => {
        return (
            <>
                <Accordion defaultActiveKey={defaultActiveKey} key={`elm_0` + stageRenderKey} >
                    {stageArray.map((stage, index) => {
                        return (
                            <Card key={`elm0` + index}>
                                <Card.Header className="formtabletitle">
                                    <Row className="w-100 no-gutters">
                                        <Col lg={3}>
                                            <Accordion.Toggle onClick={() => { setDefaultActiveKey(index.toString()) }} className="formtableheader" as={Button} variant="link" eventKey={index.toString()}>
                                                <i className={`fas mr-2 ${defaultActiveKey == index ? "fa-minus" : "fa-plus"}`}></i> {stage.name}
                                            </Accordion.Toggle>
                                        </Col>
                                        <Col lg={3} className="d-flex">
                                            <span className="p-1 m-auto">Level</span>
                                            <select
                                                type='text'
                                                className='h-100 form-control form-control-sm'
                                                value={stage.level}
                                                onChange={(e) => levelChange(index, e.target.value)}
                                            >
                                                <option value=''>Select Level</option>
                                                <option value={1}>Level-1</option>
                                                <option value={2}>Level-2</option>
                                                <option value={3}>Level-3</option>
                                            </select>
                                        </Col>
                                        <Col lg={3} className="d-flex">
                                            {/* <Form.Label className="label"></Form.Label> */}
                                            <span className="p-1 m-auto">Period</span>
                                            <select
                                                type='text'
                                                className='h-100 form-control form-control-sm'
                                                value={stage.period}
                                                onChange={(e) => frequencyChange(index, e.target.value)}
                                                disabled={storeState.user.isEdit && stage.id ? true : false}
                                            >
                                                {
                                                    (userTemplate.frequencyOptions.length > 0)
                                                        ? userTemplate.frequencyOptions.map((frequency, idx) => {
                                                            return <option value={frequency.label} key={`elm1` + idx}>{frequency.label}</option>
                                                        })
                                                        : ""
                                                }
                                            </select>
                                        </Col>
                                        <Col lg={3}>
                                            <ul className="float-right define-services-tools d-inline m-0 p-0">
                                                <li className="d-inline">
                                                    <Form.Check
                                                        type="switch"
                                                        id={stage.keyname}
                                                        className="d-inline top-7"
                                                        checked={stage.isActive}
                                                        onChange={() => stageTogglerHandler(stage.name)}
                                                    />
                                                    <i
                                                        onClick={() => {
                                                            // history.push('/FormIO')
                                                            setStageObject(stage)
                                                            setformToggle(true)
                                                            setDataVariableToggle(false)
                                                            setIsEditStage(true)
                                                        }}
                                                        title="Edit Form Name" aria-hidden="true" className="fas fa-edit"></i>
                                                    <i title="Add Question" onClick={() => {
                                                        setformToggle(false)
                                                        setIsEditQuestion(false)
                                                        setIsEditStage(false)
                                                        setQuestionObject({ stagename: stage.name, mandatory: ' ', name: '', attributeRefType: '' })
                                                        setOptionsArray([])
                                                        // let temp = {}
                                                        let tempArr = []
                                                        userInputs.languages.map(el => {
                                                            // temp[el.value] = []
                                                            tempArr.push({
                                                                locale: el.value,
                                                                property: "NAME",
                                                                value: ""
                                                            })
                                                        })
                                                        setLanguagesArray(tempArr)
                                                        setOptionValuesLocaleArray([])
                                                        // setOptionValuesLocaleObject(temp)
                                                        setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null)
                                                        setDataVariableToggle(true)
                                                        setCurrentDataelement(stage.dataelements)
                                                    }} aria-hidden="true" className="fa fa-plus mr-3"></i>
                                                    <i title="Move Up" onClick={() => moveService(index, index - 1)} className="fas fa-long-arrow-alt-up"></i>
                                                    <i title="Move Down" onClick={() => moveService(index, index + 1)} className="fas fa-long-arrow-alt-down"></i>

                                                </li>
                                            </ul>
                                        </Col>
                                    </Row>

                                </Card.Header>
                                <Accordion.Collapse eventKey={index.toString()}>
                                    <Card.Body className="formstables">
                                        <table className="table">
                                            <thead >
                                                <tr >
                                                    <th width="30%">Questions</th>
                                                    <th >Type</th>
                                                    <th >Mandatory</th>
                                                    {/* <th width="10%" className="text-center">Status</th> */}
                                                    <th width="10%" className="text-center">Actions</th>
                                                    <th width="15%" className="text-center">Sequence</th>
                                                </tr>
                                            </thead>
                                            <tbody className="formsbody">
                                                {stage.dataelements.map((element, idx) => {
                                                    return <tr className="" key={`elm2` + idx}>
                                                        <td >{element.name}</td>
                                                        <td className="texttablestyle">{element.attributeRefType}</td>
                                                        <td className="texttablestyle">{element.mandatory == 'true' ? "Yes" : "No"}</td>
                                                        {/* <td className="text-center">
                                                                <Form.Check
                                                                        type="switch"
                                                                        id={element.name}
                                                                        className="d-inline top-7"
                                                                        checked={element.isActive}
                                                                    />
                                                                </td> */}
                                                        <td className="td-actions justify-content-center">
                                                            {/* <button type="button" title="Add Question" className="btn btn-info btn_Edit"><i className="fas fa-plus"></i></button> */}
                                                            <button
                                                                onClick={() => {
                                                                    // history.push('/FormIO')
                                                                    console.log(element)
                                                                    element.stagename = stage.name
                                                                    let tempArr = []
                                                                    userInputs.languages.map(el => {
                                                                        tempArr.push({
                                                                            locale: el.value,
                                                                            property: "NAME",
                                                                            value: ""
                                                                        })
                                                                    })
                                                                    if (!Array.isArray(element.languages))
                                                                        element.languages = []
                                                                    if (element.languages.length == 0) {
                                                                        setLanguagesArray(tempArr)
                                                                    } else {
                                                                        tempArr.map(el => {
                                                                            element.languages.map(lang => {
                                                                                if (el.locale == lang.locale) {
                                                                                    el.value = lang.value
                                                                                }
                                                                            })
                                                                        })
                                                                        setLanguagesArray(tempArr)
                                                                    }
                                                                    if (element.attributeRefType == 'optionset') {
                                                                        let temp = []
                                                                        // userInputs.languages.map((lang, id) => {
                                                                        if (Array.isArray(element.optionvaluesLocale)) {
                                                                            element.optionvalues.map((option, idx) => {
                                                                                let localHolder = []
                                                                                userInputs.languages.map((lang, id) => {
                                                                                    console.log(element.optionvaluesLocale[idx][option])
                                                                                    if (element.optionvaluesLocale[idx][option][id]) {
                                                                                        // element.optionvaluesLocale[idx][option].push({ locale: lang.value, property: 'NAME', value: '' })
                                                                                        localHolder.push({ locale: lang.value, property: 'NAME', value: '' })
                                                                                    }
                                                                                })
                                                                                element.optionvaluesLocale[idx][option] = localHolder
                                                                            })
                                                                            setOptionValuesLocaleArray([])
                                                                            setOptionValuesLocaleArray(element.optionvaluesLocale)
                                                                        } else {
                                                                            element.optionvalues.map(option => {
                                                                                if (Object.keys(element.optionvaluesLocale).length == 0 || element.optionvaluesLocale[option].length == 0) {
                                                                                    let obj = {}
                                                                                    obj[option] = userInputs.languages.map((lang) => {
                                                                                        return {
                                                                                            "locale": lang.value,
                                                                                            "property": "NAME",
                                                                                            "value": ""
                                                                                        }
                                                                                    })
                                                                                    temp.push(obj)
                                                                                } else {
                                                                                    let obj = {}
                                                                                    let tempArr = userInputs.languages.map((lang) => {
                                                                                        return {
                                                                                            "locale": lang.value,
                                                                                            "property": "NAME",
                                                                                            "value": ""
                                                                                        }
                                                                                    })
                                                                                    tempArr.map(elm => {
                                                                                        var matched = element.optionvaluesLocale[option].filter(el => { if (elm.locale == el.locale) return el })
                                                                                        if (matched.length > 0)
                                                                                            elm.value = matched[0].value
                                                                                    })
                                                                                    obj[option] = tempArr
                                                                                    temp.push(obj)
                                                                                }
                                                                                setOptionValuesLocaleArray([])
                                                                                setOptionValuesLocaleArray(temp)
                                                                            })
                                                                        }
                                                                        // })
                                                                    }
                                                                    element.attributeRefType == 'optionset' ? setOptionsArray(element.optionvalues) : (element.attributeRefType == 'checkbox' ? setOptionsArray(element.checkboxoption) : setOptionsArray([]))
                                                                    setQuestionObject(element)
                                                                    setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null)
                                                                    setformToggle(false)
                                                                    setIsEditStage(false)
                                                                    setDataVariableToggle(true)
                                                                    setIsEditQuestion(true)
                                                                    // console.log(element,languagesArray)
                                                                }}
                                                                type="button" title="Edit Question" className="btn btn-info btn_Edit"><i className="fa fa-pencil-alt"></i></button>
                                                        </td>
                                                        <td className="text-center sequence-column">
                                                            <span title="Move Up">
                                                                <i onClick={() => moveQuestion(idx, idx - 1, stage.dataelements, stage.name)} className="fas fa-long-arrow-alt-up"></i>
                                                            </span>
                                                            <span title="Move Down">
                                                                <i onClick={() => moveQuestion(idx, idx + 1, stage.dataelements, stage.name)} className="fas fa-long-arrow-alt-down"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        )
                    })}
                </Accordion>
            </>
        )
    }
    return (
        <>
            <div className="row pt-1">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step1'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3"
                        onClick={() => {
                            userTemplate.datasets = stageArray
                            dispatch(setUserTemplate(userTemplate))
                            dispatch(setActiveTab('step3'))
                            // console.log(stageArray,userTemplate)
                        }}
                    >Next</button>
                </div>
            </div>
            <div className="row mb-2 ml-2">
                <div className="col-12">
                    <button onClick={() => {
                        setStageObject({
                            name: '',
                            isActive: true,
                            level:'1',
                            period: 'Monthly',
                            dataelements: []
                        })
                        setformToggle(true)
                        setDataVariableToggle(false)
                        setIsEditStage(false)
                    }} type="button" data-toggle="tooltip" title="Add Form" className="btn btn-sm addbtn mt-2"> Add Form </button>

                    <button onClick={() => { history.push('/FormIO')}} type="button" data-toggle="tooltip" className="btn btn-sm addbtn ml-2 mt-2"> Use FormIO </button>
                </div>
            </div>

            <div className="row m-2 formcontent">
                <div className="col-8" key={`elm_1` + stageRenderKey}>
                    {renderStages()}
                </div>
                {dataVariableToggle ?
                    <div className="col-4">
                        <Formik
                            innerRef={formRef}
                            initialValues={questionObject}
                            enableReinitialize
                            validationSchema={questionObjectSchema}
                            onSubmit={values => {
                                pushQuestionToStage(values)
                            }}
                        >
                            {({ errors, touched }) => (
                                <FForm className="">
                                    <Card>
                                        <Card.Header className="regcardheader">Data Variables
                                            <span className="closesign" onClick={() => setDataVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                                        </Card.Header>
                                        <Card.Body className="regtabbody">
                                            <Field name='stagename'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">* Select Form</Form.Label>
                                                            <select
                                                                type='text'
                                                                className='form-control'
                                                                {...field}
                                                            >
                                                                <option value="">Select Form</option>
                                                                {
                                                                    (stageArray.length > 0)
                                                                        ? stageArray.map((stage, idx) => {
                                                                            return <option value={stage.name} key={`elm3` + idx}>{stage.name}</option>
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
                                                name="stagename"
                                            />

                                            <Tabs
                                                activeKey={tabKey == null ? userInputs.languages[0].value : tabKey}
                                                onSelect={(k) => setKey(k)}
                                                style={{ marginTop: '10px' }}
                                            >
                                                {userInputs.languages.map((language, idx) => {
                                                    return <Tab key={`elm4` + idx} eventKey={language.value} title={language.label} style={{ marginTop: '15px', padding: '10px' }}>
                                                        <Form.Group controlId="formBasicEmail">
                                                            {idx == 0 ?
                                                                <>
                                                                    <Field name='name'>
                                                                        {({ field, meta }) => {
                                                                            return (
                                                                                <>
                                                                                    <Form.Label className="label">* Name</Form.Label>
                                                                                    <input
                                                                                        type='text'
                                                                                        className='form-control'
                                                                                        placeholder="Name"
                                                                                        {...field}
                                                                                    />
                                                                                </>
                                                                            )
                                                                        }}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        component={TextError}
                                                                        name="name"
                                                                    />
                                                                </> :
                                                                <>
                                                                    <Form.Label className="label">* Name</Form.Label>
                                                                    <input
                                                                        onChange={(e) => {
                                                                            let langArr = languagesArray
                                                                            langArr.map(lang => {
                                                                                if (lang.locale == language.value) {
                                                                                    lang.value = e.target.value
                                                                                }
                                                                            })
                                                                            setLanguagesArray([...languagesArray])
                                                                        }}
                                                                        value={languagesArray[idx].value}
                                                                        type='text'
                                                                        className='form-control'
                                                                        placeholder="Name"
                                                                    />
                                                                </>}
                                                        </Form.Group>
                                                        {idx == 0 ?
                                                            <>
                                                                <Form.Group>
                                                                    <Field name='attributeRefType'>
                                                                        {({ field, meta }) => {
                                                                            return (
                                                                                <>
                                                                                    <Form.Label className="label">* Select Type</Form.Label>
                                                                                    <select
                                                                                        type='text'
                                                                                        className='form-control'
                                                                                        {...field}
                                                                                        disabled={isEditQuestion}
                                                                                    >
                                                                                        <option value="">Select Type</option>
                                                                                        <option value="text">Text</option>
                                                                                        <option value="optionset">Option List</option>
                                                                                        <option value="number">Number</option>
                                                                                        <option value="date">Date</option>
                                                                                        {/* <option value="checkbox">Checkbox Options</option> */}
                                                                                    </select>

                                                                                </>
                                                                            )
                                                                        }}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        component={TextError}
                                                                        name="attributeRefType"
                                                                    />
                                                                </Form.Group>
                                                            </> : null}
                                                        {/* {((formRef.current.values.attributeRefType == 'optionset' || formRef.current.values.attributeRefType == 'checkbox') && idx != 0) ?
                                                            <p>Option List</p>
                                                            : null} */}
                                                        {
                                                            (formRef.current != null && (formRef.current.values.attributeRefType == 'optionset' || formRef.current.values.attributeRefType == 'checkbox')) ?
                                                                <>
                                                                    <p>Option list</p>
                                                                    {optionsArray.map((el, id) => {
                                                                        if (idx == 0) {
                                                                            return (
                                                                                <InputGroup key={`elm_5` + id} className="mb-3">
                                                                                    <FormControl
                                                                                        key={`elm5` + id}
                                                                                        onChange={(e) => {
                                                                                            let tempObj = {
                                                                                                "name": e.target.value,
                                                                                                "code": language.value,
                                                                                                "transalationid": ""
                                                                                            }
                                                                                            console.log(questionObject, id)
                                                                                            if (storeState.user.isEdit && isEditQuestion) {
                                                                                                let tempObj = { ...questionObject }
                                                                                                if (tempObj['options'][id]) {
                                                                                                    if (tempObj['options'][id]['id']) {
                                                                                                        tempObj['options'][id]['code'] = e.target.value
                                                                                                        tempObj['options'][id]['name'] = e.target.value
                                                                                                        tempObj['options'][id]['isupdate'] = true
                                                                                                        tempObj['isupdate'] = true
                                                                                                    } else {
                                                                                                        tempObj['options'][id]['name'] = e.target.value
                                                                                                    }
                                                                                                } else {
                                                                                                    let optObj = {
                                                                                                        'name': e.target.value,
                                                                                                        'sortOrder':id
                                                                                                    }
                                                                                                    tempObj['options'].push(optObj)
                                                                                                }
                                                                                                setQuestionObject(tempObj)
                                                                                            }
                                                                                            let arryHolder = optionsArray
                                                                                            arryHolder[id] = e.target.value
                                                                                            setOptionsArray([...arryHolder])


                                                                                            // NEW logic
                                                                                            let aH = optionValuesLocaleArray
                                                                                            let temp = {}
                                                                                            temp[e.target.value] = []
                                                                                            temp[e.target.value] = Object.values(aH[id])[0]
                                                                                            aH[id] = temp
                                                                                            setOptionValuesLocaleArray([...aH])
                                                                                        }}
                                                                                        value={el}
                                                                                        type='text'
                                                                                        className='form-control'
                                                                                    />
                                                                                    <Button
                                                                                        variant="outline-secondary"
                                                                                        onClick={(e) => {
                                                                                            let tempObj = { ...questionObject }
                                                                                            tempObj['options'][id]['isdelete'] = true
                                                                                            tempObj['options'][id]['isupdate'] = true
                                                                                            tempObj['isupdate'] = true
                                                                                            setQuestionObject(tempObj)
                                                                                            optionsArray.splice(id, 1)
                                                                                            setOptionsArray([...optionsArray])
                                                                                            optionValuesLocaleArray.splice(id, 1)
                                                                                            setOptionValuesLocaleArray([...optionValuesLocaleArray])
                                                                                        }}
                                                                                    >
                                                                                        <i className="fa fa-trash-alt"></i>
                                                                                    </Button>
                                                                                </InputGroup>
                                                                            )
                                                                        } else {
                                                                            return (
                                                                                <>
                                                                                    <InputGroup key={`elm_6` + id} className="mb-3">
                                                                                        <FormControl
                                                                                            key={`elm6` + id}
                                                                                            onChange={(e) => {
                                                                                                if (isEditQuestion && questionObject.id) {
                                                                                                    let tempObj = { ...questionObject }
                                                                                                    tempObj['options'][id]['isupdate'] = true
                                                                                                    setQuestionObject(tempObj)
                                                                                                }
                                                                                                // NEw logic
                                                                                                let aH = optionValuesLocaleArray
                                                                                                aH[id][optionsArray[id]][idx].value = e.target.value
                                                                                                setOptionValuesLocaleArray([...aH])
                                                                                            }}
                                                                                            value={optionValuesLocaleArray[id] ? optionValuesLocaleArray[id][optionsArray[id]][idx].value : null}
                                                                                            // value={optionValuesLocaleObject[language.value] ? (optionValuesLocaleObject[language.value][id] ? optionValuesLocaleObject[language.value][id].name : null) : null}
                                                                                            type='text'
                                                                                            className='form-control'
                                                                                        />
                                                                                    </InputGroup>
                                                                                </>
                                                                            )
                                                                        }
                                                                    })}
                                                                    {idx == 0 ?
                                                                        <Button onClick={() => {
                                                                            setOptionsArray([...optionsArray, ''])
                                                                            var temp = []
                                                                            temp = userInputs.languages.map((lang) => {
                                                                                return {
                                                                                    "locale": lang.value,
                                                                                    "property": "NAME",
                                                                                    "value": ""
                                                                                }
                                                                            })
                                                                            setOptionValuesLocaleArray([...optionValuesLocaleArray, { '': temp }])

                                                                        }} className="addbtn btn-sm">Add Options</Button> : null
                                                                    }
                                                                </>
                                                                : null
                                                        }
                                                    </Tab>
                                                })}

                                            </Tabs>
                                            <br />
                                            <Form.Group>
                                                <Field name="mandatory">
                                                    {({ field, meta }) => {
                                                        return (
                                                            <>
                                                                <Form.Label className="label">* Mandatory</Form.Label>
                                                                <div className="radio-item">
                                                                    <input
                                                                        {...field}
                                                                        value='true'
                                                                        checked={field.value == 'true'}
                                                                        name="mandatory"
                                                                        type="radio"
                                                                    />
                                                                    <label htmlFor="true">Yes</label>
                                                                </div>

                                                                <div className="radio-item">
                                                                    <input
                                                                        {...field}
                                                                        value='false'
                                                                        name="mandatory"
                                                                        checked={field.value == 'false'}
                                                                        type="radio"
                                                                    />
                                                                    <label htmlFor="false">No</label>
                                                                </div>
                                                            </>
                                                        )
                                                    }}
                                                </Field>
                                                <ErrorMessage
                                                    component={TextError}
                                                    name="mandatory"
                                                />
                                            </Form.Group>
                                            {/* <Form.Group>
                                                <Field name='parentQuestion'>
                                                    {({ field, meta }) => {
                                                        return (
                                                            <>
                                                                <Form.Label className="label">Parent question</Form.Label>
                                                                <Form.Control as="select" {...field}>
                                                                    <option value="">-</option>
                                                                    {currentDataelement.map((element, idx) => {
                                                                        if (element.type == "optionset") {
                                                                            return <option key={idx} value={idx} >{element.name}</option>
                                                                        }
                                                                    })}
                                                                </Form.Control>
                                                            </>
                                                        )
                                                    }}
                                                </Field>
                                            </Form.Group>
                                            {(formRef.current != null && formRef.current.values.parentQuestion != '' && currentDataelement[formRef.current.values.parentQuestion]) ?
                                                <Form.Group>
                                                    <Field name='dependentValue'>
                                                        {({ field, meta }) => {
                                                            return (
                                                                <>
                                                                    <Form.Label>Dependent Value</Form.Label>
                                                                    <Form.Control as="select" {...field}>
                                                                        <option>-</option>
                                                                        {currentDataelement[formRef.current.values.parentQuestion].options.map((element, idx) => {
                                                                            return <option key={idx} >{element.name}</option>
                                                                        })}
                                                                    </Form.Control>
                                                                </>
                                                            )
                                                        }}
                                                    </Field>
                                                </Form.Group>
                                                : null
                                            } */}
                                            <div>
                                                <Button type="submit" className="addbtn"> {isEditQuestion ? 'Update' : 'Add'}</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </FForm>
                            )}
                        </Formik>
                    </div>
                    : null}
                {formToggle ?
                    <div className="col-4">
                        <Formik
                            initialValues={stageObject}
                            enableReinitialize
                            validationSchema={stageObjectSchema}
                            onSubmit={values => {
                                let arrayHolder = stageArray
                                if (isEditStage) {
                                    arrayHolder.map((stage, idx) => {
                                        if (stage.orignalname == values.orignalname)
                                            stage.name = values.name
                                    })
                                } else {
                                    values['orignalname'] = values.name
                                    values['sortOrder'] = arrayHolder.length + 1
                                    arrayHolder.push(values)
                                }
                                setStageArray([...arrayHolder])
                                setformToggle(false)
                            }}
                        >
                            {({ errors, touched }) => (
                                <FForm className="">
                                    <Card>
                                        <Card.Header className="regcardheader">{isEditStage ? 'Edit' : 'Add'} Form
                                            <span className="closesign" onClick={() => setformToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                                        </Card.Header>
                                        <Card.Body className="regtabbody">
                                            <Field name='name'>
                                                {({ field, meta }) => {
                                                    return (
                                                        <>
                                                            <Form.Label className="label">* Form Name</Form.Label>
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                placeholder="Name"
                                                                {...field}
                                                            />

                                                        </>
                                                    )
                                                }}
                                            </Field>
                                            <ErrorMessage
                                                component={TextError}
                                                name="name"
                                            />
                                            <div className="mt-3">
                                                <Button type="submit" className="addbtn"> {isEditStage ? 'Update' : 'Add'}</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </FForm>
                            )}
                        </Formik>
                    </div>
                    : null}

            </div>

            <div className="row pt-1 mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step1'))}>Back</button>
                    <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3"
                        onClick={() => {
                            userTemplate.datasets = stageArray
                            dispatch(setUserTemplate(userTemplate))
                            dispatch(setActiveTab('step3'))
                        }}>Next</button>
                </div>
            </div>
        </>
    )
}

export default ServicesStep;