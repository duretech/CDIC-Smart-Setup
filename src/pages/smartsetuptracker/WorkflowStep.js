import React, { useState, useEffect } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setLoader, setEditFlag, setUserTemplate, setUser } from '../../redux/actions/userAction'
import API from "../../util";
import programJson from "../../assets/data/usertemplate.json"

import { Card, Nav, Navbar, Tab, Modal, Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { baseUrl, baseName } from "../../util/urls";

import swal from "sweetalert";

import _ from "lodash";

const WorkflowStep = () => {
    const dispatch = useDispatch();
    const storeState = useSelector((state) => state)
    const [userArray, setUserArray] = useState([])
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const userDetails = useSelector((state) => state.user.userDetails)
    const [showModal, setShowModal] = useState(false);
    const registryUrl = baseUrl && baseName ? baseUrl + baseName : "https://example.com/registry"; // Replace with your actual link

    function handleCopy() {
        navigator.clipboard.writeText(registryUrl);
        // Optionally, show copied feedback
    }
    const [stageArray, setStageArray] = useState(userTemplate.programstages)
    const [userroleprogramstageaccess, setUserroleprogramstageaccess] = useState(programJson.data[0].programtemplate.userroleprogramstageaccess)
    useEffect(() => {
        setStageArray(userTemplate.programstages)
    }, [userTemplate.programstages])
    const handleClose = () => {
        dispatch(setLoader(true))
        let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
        API.get(url).then(res => {
            dispatch(setLoader(false))
            dispatch(setUser(res.data))
            API.get('tracker/smartsetup/get/' + res.data.organisationUnits[0].id).then(res => {
                dispatch(setEditFlag(true))
                getProgramTemplate(res.data)
            })
        })
        setShowModal(false)

    }
    const getProgramTemplate = (data) => {
        dispatch(setLoader(true))
        API.get(`dataStore/template/programtemplate`).then((res) => {
            dispatch(setLoader(false))
            if (res.status === 200) {
                if (data) {
                    res.data.programstages = data.data.programstages
                    // res.data.trackedentityattributes =  data.data.trackedentityattributes
                    res.data["userAccesses"] = data.data.userAccesses
                    res.data["organisationUnits"] = data.data.organisationUnits
                    res.data.appname = data.programdetails.appname
                    res.data.countries = data.programdetails.countries
                    res.data.description = data.programdetails.description
                    res.data.disclaimer = data.programdetails.disclaimer
                    res.data.logo = data.programdetails.logo
                    res.data.name = data.programdetails.name
                    res.data.programuid = data.programdetails.programuid
                    res.data.selectedlanguage = data.programdetails.selectedlanguage
                    res.data['users'] = data.programdetails.users
                    res.data['deletedObjects'] = data.programdetails.deletedObjects ? data.programdetails.deletedObjects : { "deletedAttribute": [], "deletedDataElement": [] }
                    // Code for attribute checkbox group
                    let tempTrackHolder = []
                    data.data.trackedentityattributes.map(element => {
                        if (element.type == 'boolean') {
                            data.data.programSections.map(section => {
                                if (section.name.includes(element.name)) {
                                    element.attributeRefType = 'checkbox'
                                    element.type = 'checkbox'
                                    element.checkboxoption = _.map(section.trackedEntityAttributes, function (elemgrp) { return elemgrp.name })
                                    let checkboxvalues = []
                                    section.trackedEntityAttributes.map(el => {
                                        data.data.trackedentityattributes.map(ell => {
                                            console.log(el.id, ell.dataElementId)
                                            if (ell.trackedEntityAttributeId == el.id)
                                                checkboxvalues.push(ell)
                                        })
                                    })
                                    element.options = checkboxvalues
                                    tempTrackHolder.push(element)
                                }
                            })
                        } else {
                            tempTrackHolder.push(element)
                        }
                    })
                    res.data.trackedentityattributes = tempTrackHolder
                }
                dispatch(setUserTemplate(res.data))
                if (data && data.data && data.programdetails)
                    getDependency(data, res.data)
                else
                    dispatch(setActiveTab('step1'))
            }
        }).catch(error => {
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const getDependency = (data, userTemplate) => {
        console.log(userTemplate)
        let programuid = data.programdetails.programuid
        var programRules, programRuleVariables, stageDependentArray = []
        var attributedependentquestions = []
        API.get(`programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet&paging=false`).then((response) => {
            console.log(response.data.programRuleVariables)
            programRuleVariables = response.data.programRuleVariables
            API.get(`programRules?filter=program.id:eq:` + programuid + `&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false`).then((response) => {
                console.log(response.data.programRules)
                programRules = response.data.programRules
                programRuleVariables.map(variable => {
                    if (variable.program.id == programuid) {
                        if (variable.programRuleVariableSourceType == "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE") {

                            let temp = {}
                            temp['dependentdataelementnames'] = []
                            programRules.map(rule => {
                                if (rule.condition && rule.condition.includes('!=') && rule.condition.match(/\{(.*?)\}/)[1] == variable.displayName) {
                                    temp['variableId'] = variable.id
                                    temp['dataelementname'] = variable.displayName.split('_')[1]
                                    temp['ruleId'] = rule.id
                                    console.log(rule.condition.split('!= ')[1])
                                    temp['matchingvalue'] = rule.condition.split('!= ')[1].replaceAll("'", "")
                                    temp['stagename'] = _.find(userTemplate.programstages, ['id', variable.programStage.id]).name
                                    let stageIndex = _.findIndex(userTemplate.programstages, { 'id': variable.programStage.id })
                                    let parentIndex = _.findIndex(userTemplate.programstages[stageIndex].dataelements, { "name": temp.dataelementname })
                                    rule.programRuleActions.map(action => {
                                        let objHolder = {}
                                        objHolder['childdataelementname'] = _.find(_.find(userTemplate.programstages, ['id', variable.programStage.id]).dataelements, ['dataElementId', action.dataElement.id]).name
                                        objHolder['actionId'] = action.id
                                        temp['dependentdataelementnames'].push(objHolder)

                                        let childIndex = _.findIndex(userTemplate.programstages[stageIndex].dataelements, { "name": objHolder.childdataelementname })
                                        userTemplate.programstages[stageIndex].dataelements[childIndex]['parentQuestion'] = parentIndex
                                        userTemplate.programstages[stageIndex].dataelements[childIndex]['dependentValue'] = temp.matchingvalue;
                                    })
                                }
                            })
                            stageDependentArray.push(temp)
                        }
                        else if (variable.programRuleVariableSourceType == "TEI_ATTRIBUTE") {
                            let temp = {}
                            temp['dependentdataelementnames'] = []
                            programRules.map(rule => {
                                if (rule.condition && rule.condition.includes('!=') && rule.condition.match(/\{(.*?)\}/)[1] == variable.displayName) {
                                    temp['variableId'] = variable.id
                                    temp['dataelementname'] = variable.displayName.split('_')[1]
                                    temp['ruleId'] = rule.id
                                    console.log(rule.condition.split('!= ')[1])
                                    temp['matchingvalue'] = rule.condition.split('!= ')[1].replaceAll("'", "")

                                    let parentIndex = _.findIndex(userTemplate.trackedentityattributes, { "name": temp.dataelementname })
                                    rule.programRuleActions.map(action => {
                                        let objHolder = {}
                                        objHolder['childdataelementname'] = _.find(userTemplate.trackedentityattributes, ['trackedEntityAttributeId', action.trackedEntityAttribute.id]).name
                                        let childIndex = _.findIndex(userTemplate.trackedentityattributes, { "name": objHolder.childdataelementname })
                                        objHolder['actionId'] = action.id
                                        temp['dependentdataelementnames'].push(objHolder)


                                        userTemplate.trackedentityattributes[childIndex]['parentQuestion'] = parentIndex;
                                        userTemplate.trackedentityattributes[childIndex]['dependentValue'] = temp.matchingvalue;

                                    })
                                }
                            })
                            attributedependentquestions.push(temp)
                        }
                    }
                    // _.find(userTemplate.trackedentityattributes,[])
                })
                userTemplate.programstages.map(stage => {
                    let tempArray = [];
                    let datelementHolder = stage.dataelements;
                    stage.dataelements.map(element => {
                        if (element.type == 'boolean') {
                            API.get('dataElementGroups?filter=identifiable:token:' + element.dhisname + '&paging=false&fields=dataElements[id,displayName~rename(code),formName~rename(name)]').then(res => {
                                if (res.data.dataElementGroups.length > 0) {
                                    // console.log(res.data.dataElementGroups)
                                    // stage.dataelements
                                    element.attributeRefType = 'checkbox'
                                    element.type = 'checkbox'
                                    element.groupid = res.data.dataElementGroups[0].id
                                    element.checkboxoption = _.map(res.data.dataElementGroups[0].dataElements, function (elemgrp) { return elemgrp.name })
                                    let checkboxvalues = []
                                    res.data.dataElementGroups[0].dataElements.map(el => {
                                        datelementHolder.map(ell => {
                                            console.log(el.id, ell.dataElementId)
                                            if (ell.dataElementId == el.id)
                                                checkboxvalues.push(ell)
                                        })
                                    })
                                    console.log(checkboxvalues)
                                    element.options = checkboxvalues
                                    tempArray.push(element)
                                }
                            })
                        } else {
                            tempArray.push(element)
                        }
                    })
                    stage.dataelements = tempArray
                })
                console.log(">>>>>>>attributedependentquestions", attributedependentquestions)
                console.log(">>>>>>>stageDependentArray", stageDependentArray)
                userTemplate['attributedependentquestions'] = attributedependentquestions
                userTemplate['stageDependentArray'] = stageDependentArray
                dispatch(setUserTemplate(userTemplate))
                dispatch(setActiveTab('step1'))
            })
        })
    }
    const publishCall = () => {
        console.log(userTemplate, storeState)
        return
        userTemplate.programstages.map(dataset => {
            dataset.languages = []
            console.log(dataset)
            dataset.dataelements.map(element => {
                let temp = {}
                if (!Array.isArray(element.languages))
                    element.languages = []
                else {
                    element.languages = element.languages.filter(el => { if (el.value != '') return el })
                }

                // if (element.attributeRefType == 'optionset') {
                //     if (Array.isArray(element.optionvaluesLocale)) {
                //         element.optionvaluesLocale.map((option, idx) => {
                //             if (option[element.optionvalues[idx]])
                //                 temp[element.optionvalues[idx]] = option[element.optionvalues[idx]].filter(el => { if (el.value != '') return el })
                //         })
                //         element.optionvaluesLocale = temp
                //     }
                // }
            })
        })
        if (storeState.user.isEdit) {
            userTemplate['userid'] = userDetails.id
            userTemplate['username'] = userDetails.userCredentials.username
            userTemplate['orgid'] = storeState.user.userDetails.organisationUnits[0].id
            userTemplate['programuid'] = storeState.programDetails.userTemplate.programuid
            userTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions

            console.log(userTemplate, storeState)
            dispatch(setLoader(true))
            API.post('tracker/smartsetup/edit', userTemplate).then(res => {
                dispatch(setLoader(false))
                console.log(res)
                // if (res.data.status == 'Success') {
                if (res.data.status == 'OK') {
                    swal({
                        title: "Success",
                        text: "Program details updated sucessfully",
                        icon: "success",
                        button: "Close",
                    }).then(function () {
                        dispatch(setLoader(true))
                        API.get('tracker/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
                            dispatch(setLoader(false))
                            dispatch(setEditFlag(true))
                            getProgramTemplate(res.data)
                        }).catch(error => {
                            dispatch(setLoader(false))
                            console.log(error)
                        })
                    });
                } else {
                    swal({
                        title: "Success",
                        text: "Program details updated sucessfully",
                        icon: "success",
                        button: "Close",
                    }).then(function () {
                        dispatch(setLoader(true))
                        API.get('tracker/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
                            dispatch(setLoader(false))
                            dispatch(setEditFlag(true))
                            getProgramTemplate(res.data)
                        }).catch(error => {
                            dispatch(setLoader(false))
                            console.log(error)
                        })
                    });
                }
            }).catch(error => {
                dispatch(setLoader(false))
                console.log(error)
            })
        } else {
            userTemplate['userid'] = userDetails.id
            userTemplate['username'] = userDetails.userCredentials.username
            userTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions
            console.log(userTemplate)
            // return
            dispatch(setLoader(true))
            API.post('tracker/smartsetup/save', userTemplate).then(res => {
                console.log(res)
                dispatch(setLoader(false))
                if (res.status == 200) {
                    setUserArray(res.data.data)
                    setShowModal(true)
                }
            }).catch(error => {
                dispatch(setLoader(false))
                console.log(error)
            })
        }
    }
    // console.log(userroleprogramstageaccess)
    const renderWorkflow = () => {
        return stageArray.map((stage, idx) => {
            return <tr className="VueTables__row " key={`elm0` + idx}>
                <td tabIndex="0" className="workFlowdtdata">{stage.name}</td>

                {
                    userroleprogramstageaccess.map((user, id) => {
                        return <td key={`elm1` + id} tabIndex="0" className="workFlowdtdata">
                            <div className="checkbox">
                                <label>
                                    <input
                                        onChange={(e) => {

                                        }}
                                        type="checkbox" checked disabled className="big-checkbox" />
                                </label>
                            </div>
                        </td>
                    })
                }
            </tr>
        })
    }
    return (
        <>
            <div className="row">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step4'))}>Back</button>
                    <button onClick={() => { publishCall() }} tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" > {storeState.user.isEdit ? "Update" : "Publish"}</button>
                </div>
            </div>

            {/* <div className="row m-2"><div className="mt-2 mb-0 offset-sm-6 col-sm-6 work-flow-top-bar"><button type="button" className="btn btndownload"><a href="https://uatltbi.duredemos.com/Manual/PreventTB_TrainingManual_SmartSetup_V5.docx.pdf" target="_blank"> Download Manual</a></button></div></div> */}

            <div className="work-flow-table mx-3 mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th tabIndex="0">
                                <span title="">Form Name</span><span></span>
                                <div className="resize-handle"></div>
                            </th>
                            <th tabIndex="0"><span title="">ORW</span><span></span></th>
                            <th tabIndex="0"><span title="">FACILITY</span><span></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderWorkflow()}
                    </tbody>
                </table>
            </div>
            <div className=" mt-2 col-sm-12 work-flow-top-bar"> *Note : The workflow section is to assign roles to users, the sequence of the variables can be changed in the Forms section </div>

            <div className="row mb-4">
                <div className="col-12 bnBtn">
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step4'))}>Back</button>
                    <button onClick={() => { publishCall() }} tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >{storeState.user.isEdit ? "Update" : "Publish"}</button>
                </div>
            </div>
            <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
                <Modal.Header className="p-2" closeButton>
                    <Modal.Title>Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Input group with copy button */}
                    <Form.Group className="mb-3">
                        <Form.Label>Registry/WebApp Link:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                readOnly
                                value={registryUrl}
                                onClick={e => e.target.select()}
                            />
                            <Button variant="outline-secondary" onClick={handleCopy}>
                                Copy
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Container>
                        <Row>
                            <Col xs={6} md={6} className="mb-3">Username</Col>
                            <Col xs={6} md={6} className="mb-3">Password</Col>
                        </Row>
                        {userArray.length > 0 && userArray.map((user, idx) => (
                            <Row key={`elm2${idx}`}>
                                <Col xs={6} md={6} className="mb-3">{user.username}</Col>
                                <Col xs={6} md={6} className="mb-3">{user.password}</Col>
                            </Row>
                        ))}
                    </Container>
                </Modal.Body>
                <Modal.Footer className="p-2">
                    <Button className="btn wizard-btnn btn-sm mr-4" variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    )
}
export default WorkflowStep;