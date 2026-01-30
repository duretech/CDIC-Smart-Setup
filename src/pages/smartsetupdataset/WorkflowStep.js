import React, { useState, useEffect } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setLoader, setEditFlag, setUserTemplate, setUser } from '../../redux/actions/userAction'
import API from "../../util";
import programJson from "../../assets/data/usertemplate.json"

import { Button, Modal, Container, Row, Image, Col } from 'react-bootstrap';

import swal from "sweetalert";


const WorkflowStep = () => {
    const dispatch = useDispatch();
    const storeState = useSelector((state) => state)
    const [userArray, setUserArray] = useState([])
    const userTemplate = useSelector((state) => state.programDetails.userTemplate)
    const userDetails = useSelector((state) => state.user.userDetails)
    const [showModal, setShowModal] = useState(false);
    const [stageArray, setStageArray] = useState(userTemplate.datasets)
    const [userroleprogramstageaccess, setUserroleprogramstageaccess] = useState(programJson.data[0].programtemplate.userroleprogramstageaccess)
    useEffect(() => {
        setStageArray(userTemplate.datasets)
    }, [userTemplate.datasets])
    const handleClose = () => {
        dispatch(setLoader(true))
        let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
        API.get(url).then(res => {
            console.log(res)
            setShowModal(false)
            dispatch(setLoader(false))
            if(res.status == 200 && res.data.organisationUnits){  
                dispatch(setUser(res.data))
                API.get('dataset/smartsetup/get/' + res.data.organisationUnits[0].id).then(res => {
                    dispatch(setEditFlag(true))
                    if(res.data.programdetails.value){
                        let programDetails = JSON.parse(res.data.programdetails.value)
                        res.data.programdetails = programDetails
                    }
                    getProgramTemplate(res.data)
                }).catch(error => {
                    dispatch(setActiveTab('step1'))
                    dispatch(setLoader(false))
                    console.log(error)
                })
            }else{
                getUserCall()
            }
        }).catch(error => {
            dispatch(setActiveTab('step1'))
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const getUserCall = () => {
        dispatch(setLoader(true))
        let url = 'me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]'
        API.get(url).then(res => {
            dispatch(setLoader(false))
            if(res.status == 200 && res.data.organisationUnits){  
                dispatch(setUser(res.data))
                API.get('dataset/smartsetup/get/' + res.data.organisationUnits[0].id).then(res => {
                    dispatch(setEditFlag(true))
                    if(res.data.programdetails.value){
                        let programDetails = JSON.parse(res.data.programdetails.value)
                        res.data.programdetails = programDetails
                    }
                    getProgramTemplate(res.data)
                }).catch(error => {
                    dispatch(setActiveTab('step1'))
                    dispatch(setLoader(false))
                    console.log(error)
                })
            }else{
                getUserCall()
            }
        }).catch(error => {
            dispatch(setActiveTab('step1'))
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const getProgramTemplate = (data) => {
        dispatch(setLoader(true))
        API.get(`dataStore/template/template`).then((res) => {
            dispatch(setLoader(false))
            if (res.status === 200) {
                if (data) {
                    res.data.datasets = data.data
                    res.data.appname = data.programdetails.appname
                    res.data.countries = data.programdetails.countries
                    res.data.description = data.programdetails.description
                    res.data.disclaimer = data.programdetails.disclaimer
                    res.data.logo = data.programdetails.logo
                    res.data.name = data.programdetails.name
                    res.data.selectedlanguage = data.programdetails.selectedlanguage
                }
                dispatch(setUserTemplate(res.data))
                dispatch(setActiveTab('step1'))
            }
        }).catch(error => {
            dispatch(setLoader(false))
            console.log(error)
        })
    }
    const publishCall = () => {
        // console.log(userTemplate)
        var blankDataSetFlag = false
        var blankDataSetName = ''
        userTemplate.datasets.map(dataset => {
            dataset.languages = []
            console.log(dataset)
            dataset['isupdate'] = true
            if(dataset.dataelements.length > 0){
                dataset.dataelements.map(element => {
                    element['isupdate'] = true
                    let temp = {}
                    if (!Array.isArray(element.languages))
                        element.languages = []
                    else {
                        element.languages = element.languages.filter(el => { if (el.value != '') return el })
                    }

                    if (element.attributeRefType == 'optionset') {
                        if (Array.isArray(element.optionvaluesLocale)) {
                            element.optionvaluesLocale.map((option, idx) => {
                                if (option[element.optionvalues[idx]])
                                    temp[element.optionvalues[idx]] = option[element.optionvalues[idx]].filter(el => { if (el.value != '') return el })
                            })
                            element.optionvaluesLocale = temp
                        }
                    }
                })
            }else{
                blankDataSetFlag = true
                blankDataSetName += ' '+  dataset.name
            }
        })
        if(blankDataSetFlag){
            // let elem = document.createElement("div");
            // elem.innerHTML = blankDataSetName
            swal({
                title: "Error",
                text: "Cannot submit blank questionnaire",
                // content: elem,
                icon: "error",
                button: "Close",
                });
            dispatch(setActiveTab('step2'))
            return
        }
        // console.log( userTemplate.datasets)
        if (storeState.user.isEdit) {
            userTemplate['userid'] = userDetails.id
            userTemplate['username'] = userDetails.userCredentials.username
            userTemplate['orgid'] = storeState.user.userDetails.organisationUnits[0].id
            dispatch(setLoader(true))
            API.post('dataset/smartsetup/edit', userTemplate).then(res => {
                dispatch(setLoader(false))
                if (res.data.status == 'Success') {
                    swal({
                        title: "Success",
                        text: "Program details updated sucessfully",
                        icon: "success",
                        button: "Close",
                    }).then(function () {
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
            }).catch(error => {
                dispatch(setLoader(false))
                console.log(error)
            })
        } else {
            userTemplate['userid'] = userDetails.id
            userTemplate['username'] = userDetails.userCredentials.username
            userTemplate['formType'] = '03'
            dispatch(setLoader(true))
            API.post('dataset/smartsetup/save', userTemplate).then(res => {
                console.log(res)
                dispatch(setLoader(false))
                if (res.status == 200) {
                    setUserArray(res.data.data)
                    setShowModal(true)
                }
            }).catch(error => {
                dispatch(setLoader(false))
                swal({
                    title: "Error",
                    //text: error.response.data.message,
                    text: "Something went wrong.",
                    icon: "error",
                    button: "Close",
                    });
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
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step3'))}>Back</button>
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
                    <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step3'))}>Back</button>
                    <button onClick={() => { publishCall() }} tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" >{storeState.user.isEdit ? "Update" : "Publish"}</button>
                </div>
            </div>
            <Modal data-backdrop="static"  size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
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
    )
}
export default WorkflowStep;