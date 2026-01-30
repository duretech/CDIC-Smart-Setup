import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Nav, Form, Navbar, Modal, Container, Row, Col } from 'react-bootstrap';
import {
  Link,
  useHistory
} from "react-router-dom";

import { useDispatch } from 'react-redux';

import { setUser, setLoader, setEditFlag, setUserTemplate, } from '../redux/actions/userAction'
import { setProgramDetails } from '../redux/actions/createProgramAction'
import imgurl from '../assets/images/imgUrl';
import API from "../util";

import _ from "lodash";

const LandingPage = () => {


  const history = useHistory();
  const dispatch = useDispatch()

  const [selectedTemplate, setSelectedTemplate] = useState("TB");

  const changeTemplate = (selectedTemp) => {
    console.log(selectedTemp)
    setSelectedTemplate(selectedTemp)
  }
  const getProgramTemplate = (data) => {
    dispatch(setLoader(true))
    API.get(`dataStore/template/genericTemplate`).then((res) => {
      res.data = res.data[selectedTemplate];
      if (res.status === 200) {
        if (data && data.data && data.programdetails) {
          res.data.programstages = data.data.programstages
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
        dispatch(setLoader(false))
        dispatch(setProgramDetails(res.data))
        dispatch(setUserTemplate(res.data))
        if (data && data.data && data.programdetails)
          getDependency(data, res.data)
        else
          history.push('/dashboard')
        // dispatch(setLanguagesList(res.data.selectedlanguage))
        // console.log(res)
      }
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
                    if (_.find(_.find(userTemplate.programstages, ['id', variable.programStage.id]).dataelements, ['dataElementId', action.dataElement.id])) {
                      let objHolder = {}
                      objHolder['childdataelementname'] = _.find(_.find(userTemplate.programstages, ['id', variable.programStage.id]).dataelements, ['dataElementId', action.dataElement.id]).name
                      objHolder['actionId'] = action.id
                      temp['dependentdataelementnames'].push(objHolder)

                      let childIndex = _.findIndex(userTemplate.programstages[stageIndex].dataelements, { "name": objHolder.childdataelementname })
                      userTemplate.programstages[stageIndex].dataelements[childIndex]['parentQuestion'] = parentIndex
                      userTemplate.programstages[stageIndex].dataelements[childIndex]['dependentValue'] = temp.matchingvalue;
                    }
                  })
                }
              })
              stageDependentArray.push(temp)
            }
            else if (variable.programRuleVariableSourceType == "TEI_ATTRIBUTE") {
              let temp = {}
              temp['dependentdataelementnames'] = []
              programRules.map(rule => {
                console.log(rule, "rule")
                if (rule.condition && rule.condition.includes('!=') && rule.condition.match(/\{(.*?)\}/)[1] == variable.displayName) {
                  temp['variableId'] = variable.id
                  temp['dataelementname'] = variable.displayName.split('_')[1]
                  temp['ruleId'] = rule.id
                  console.log(rule.condition.split('!= ')[1])
                  temp['matchingvalue'] = rule.condition.split('!= ')[1].replaceAll("'", "")

                  let parentIndex = _.findIndex(userTemplate.trackedentityattributes, { "name": temp.dataelementname })
                  rule.programRuleActions.map(action => {
                    if (_.find(userTemplate.trackedentityattributes, ['trackedEntityAttributeId', action.trackedEntityAttribute.id])) {
                      let objHolder = {}
                      objHolder['childdataelementname'] = _.find(userTemplate.trackedentityattributes, ['trackedEntityAttributeId', action.trackedEntityAttribute.id]).name
                      let childIndex = _.findIndex(userTemplate.trackedentityattributes, { "name": objHolder.childdataelementname })
                      objHolder['actionId'] = action.id
                      temp['dependentdataelementnames'].push(objHolder)


                      userTemplate.trackedentityattributes[childIndex]['parentQuestion'] = parentIndex;
                      userTemplate.trackedentityattributes[childIndex]['dependentValue'] = temp.matchingvalue;
                    }
                  })
                }
                attributedependentquestions.push(temp)
              })
            }
          }
          // _.find(userTemplate.trackedentityattributes,[])
        })
        userTemplate.programstages.map(stage => {
          let tempArray = [];
          let datelementHolder = stage.dataelements;
          stage.dataelements.map(element => {
            if (element.type == 'boolean') {
              API.get('dataElementGroups?filter=identifiable:token:' + element.dhisname + '&paging=false&fields=id,dataElements[id,displayName~rename(code),formName~rename(name)]').then(res => {
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
        // console.log(">>>>>>>attributedependentquestions",attributedependentquestions)
        // console.log(">>>>>>>stageDependentArray",stageDependentArray)
        userTemplate['attributedependentquestions'] = attributedependentquestions
        userTemplate['stageDependentArray'] = stageDependentArray
        dispatch(setUserTemplate(userTemplate))
        history.push('/dashboard')
      })
    })
  }
  const processRequest = () => {
    let userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData.introduction && userData.introduction === 'Publish') {
      API.get('tracker/smartsetup/get/' + userData.organisationUnits[0].id).then(res => {
        dispatch(setEditFlag(true))
        getProgramTemplate(res.data)
      })
    }
    else {
      getProgramTemplate()
      dispatch(setEditFlag(false))
    }
    dispatch(setUser(userData))
  }

  const logoutClickHandler = () => {
    sessionStorage.clear()
    history.push('/')
  }

  return (
    <div>
      <div>
        <Navbar className="navbg" expand="lg">
          <Navbar.Brand href="#home">
            {/* <img alt='logo' className="endLogo" src={imgurl.endlogo.default} /> */}
            <span className="ml-2">Smart-Setup</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav ">
            <Nav className="ml-auto">
              {/* <img alt='avtar' className="avatar mr-2" src={imgurl.avatar.default} /> */}
              <button className="btn btn-sign" onClick={logoutClickHandler}><i className="fas fa-sign-out-alt fa-2x pull-right"></i></button>

            </Nav>

          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="mainContentLogin">
        <div className='container-fluid'>
          <Row>
            <Col lg={6} className='m-auto'>
              <Card className="loginCard landingCard mt-3">
                
                <Card.Body className="card-body card-section1">
                <Card.Header >
                <span className='mx-1'> Select Template </span>
                </Card.Header>
                  <div className="grid mt-3">
                    {/* <Row>
                      <Col>
                        <label className="card" onClick={e => { changeTemplate('TB') }}>
                        
                          <span className="plan-details d-block">
                           
                                <input name="" className="radio1" type="radio" checked />
                                <span className="plan-type mb-3">   TB  </span>
                                <img alt='' className="float-right w-30" src={imgurl.pgmico.default} />
                          </span>
                        </label>
                      </Col>
                      <Col>
                        <label className="card" onClick={e => { changeTemplate('HIV') }}>
                        <span className="plan-details d-block" aria-hidden="true">
                          <input name="" className="radio1" type="radio" />
                         
                            <span className="plan-type mb-3">TB</span>
                            <img alt='' className="float-right w-30" src={imgurl.pgmico.default} />
                          </span>
                        </label>
                      </Col>
                      <Col>
                        <label className="card" onClick={e => { changeTemplate('TB') }}>
                        
                          <span className="plan-details d-block">
                           
                                <input name="" className="radio1" type="radio" checked />
                                <span className="plan-type mb-3">   TB  </span>
                                <img alt='' className="float-right w-30" src={imgurl.pgmico.default} />
                          </span>
                        
                         
                        </label>
                      </Col>
                      <Col>
                        <label className="card" onClick={e => { changeTemplate('HIV') }}>
                        <span className="plan-details d-block" aria-hidden="true">
                          <input name="" className="radio1" type="radio" />
                            <span className="plan-type mb-3 mx-2">HIV</span>
                          </span>
                        </label>
                      </Col>
                    
                    </Row> */}
                    <Row>
                    <Col lg={2}></Col>
                      <Col lg={4}>
                        <label className={`card ${selectedTemplate === 'TB' ? 'activeTemplate' : ''}`} onClick={e => { changeTemplate('TB') }} style={{ height: '106px', width:'177px', backgroundColor:'#c6538e91' }}>

                          <span className="plan-details d-block">

                            {/* <input name="template" className="radio1" type="radio" checked /> */}
                            <span className='main-section'>
                                {/* <input name="template" className="radio1" type="radio" checked /> */}
                                <img alt='' className="w-40" src={imgurl.tb_icon.default} />
                                <span className="plan-type mx-4">   TB  </span>
                            </span>    
                          </span>
                        </label>
                      </Col>
                      <Col lg={4}>
                        <label className={`card ${selectedTemplate === 'HIV' ? 'activeTemplate' : ''}`} onClick={e => { changeTemplate('HIV') }} style={{ height: '106px', width:'177px' ,backgroundColor:'#1298d587' }}>
                          <span className="plan-details d-block" aria-hidden="true">
                            {/* <input name="template" className="radio1" type="radio" /> */}

                            <span className='main-section'>
                          {/* <input name="template" className="radio1" type="radio" /> */}
                          <img alt='' className="w-40" src={imgurl.hiv_icon.default} />
                            <span className="plan-type mx-4">HIV</span>
                        </span>
                          </span>
                        </label>
                      </Col>

                      
                    </Row>
                    <Row>
                    <Col lg={2}></Col>
                    <Col lg={4}>
                        <label className={`card ${selectedTemplate === 'MALARIA' ? 'activeTemplate' : ''}`} onClick={e => { changeTemplate('MALARIA') }} style={{ height: '106px', width:'177px', backgroundColor:'#ee344980'
                         }}>
                        <span className="plan-details d-block" aria-hidden="true">
                         
                        <span className='main-section'>
                          {/* <input name="template" className="radio1" type="radio" /> */}
                          <img alt='' className="w-40" src={imgurl.malaria_icon.default} />
                            <span className="plan-type mx-3">Malaria</span>
                         </span>  
                          </span>
                        </label>
                      </Col>
                      <Col lg={4}>
                        <label className={`card ${selectedTemplate === 'SCA' ? 'activeTemplate' : ''}`} onClick={e => { changeTemplate('SCA') }} style={{ height: '106px' ,width:'177px' ,backgroundColor:'#e8b72a9e' }}>
                        <span className="plan-details d-block" aria-hidden="true">
                        <span className='main-section' style={{paddingTop:'0px'}}>
                        
                          <img alt='' className="w-40" src={imgurl.sickle_icon.default} />
                            <span className="plan-type mx-3 mt-xl-n1">Sickle Cell Anemia</span>
                         </span>  
                          </span>
                        </label>
                      </Col>
                    </Row>
                  </div>
                  <div className='smart-button'>
                    <Button onClick={e => { processRequest() }} className="text-white mt-3 continue-btn" variant="primary" type="submit">
                      Continue
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Style here */}
            <Col lg={6} className="card2">
              {/* Description for TB and HIV */}
              {selectedTemplate == 'TB' ? 
              <Card className='card-section2'>
              <Card.Header className='mt-4'>
                  {/* <span className='icon'><i class="fa fa-arrow-down" aria-hidden="true"></i></span> */}
                  <span className='mx-1 mt-5 card2-heading'> Details </span>
                </Card.Header>
          <Card.Body className='' style={{ marginTop: '-17px' }}>Select template to customize the workflow for programs like TB, HIV, Malaria, or Sickle cell anemia. 
          Smart setup allows users to use the existing template or add, edit, and remove stages/variables to best align the program with existing or aspired field implementation. 
          Users can publish multiple programs by selecting the required templates after logging in to their registered accounts.
          The platform also displays a preview of the flow created indicating how the configured fields would appear on the final device interface.
          After finalizing your selections, click on the ‘Publish’ 
          button to get unique user credentials which can be used to visualize the published program on the application.</Card.Body>
              </Card>
              : null}
              
              {selectedTemplate == 'HIV' ? 
              <Card className='card-section2'>
              <Card.Header className='mt-4'>
                  {/* <span className='icon'><i class="fa fa-arrow-down" aria-hidden="true"></i></span> */}
                  <span className='mx-1 mt-5 card2-heading'> Details </span>
                </Card.Header>
              <Card.Body className='' style={{ marginTop: '-17px' }}>Select template to customize the workflow for programs like TB, HIV, Malaria, or Sickle cell anemia. 
          Smart setup allows users to use the existing template or add, edit, and remove stages/variables to best align the program with existing or aspired field implementation. 
          Users can publish multiple programs by selecting the required templates after logging in to their registered accounts.
          The platform also displays a preview of the flow created indicating how the configured fields would appear on the final device interface.
          After finalizing your selections, click on the ‘Publish’ 
          button to get unique user credentials which can be used to visualize the published program on the application.</Card.Body>
              </Card>
              : null}
               {selectedTemplate == 'MALARIA' ? 
              <Card className='card-section2'>
              
              <Card.Header className='mt-4'>
                  {/* <span className='icon'><i class="fa fa-arrow-down" aria-hidden="true"></i></span> */}
                  <span className='mx-1 mt-5 card2-heading'>Details </span>
                </Card.Header>
              <Card.Body className='' style={{ marginTop: '-17px' }}>Select template to customize the workflow for programs like TB, HIV, Malaria, or Sickle cell anemia. 
          Smart setup allows users to use the existing template or add, edit, and remove stages/variables to best align the program with existing or aspired field implementation. 
          Users can publish multiple programs by selecting the required templates after logging in to their registered accounts.
          The platform also displays a preview of the flow created indicating how the configured fields would appear on the final device interface.
          After finalizing your selections, click on the ‘Publish’ 
          button to get unique user credentials which can be used to visualize the published program on the application.</Card.Body>
              </Card>
              : null}
               {selectedTemplate == 'SCA' ? 
              <Card className='card-section2'>
               
                <Card.Header className='mt-4'>
                  {/* <span className='icon'><i class="fa fa-arrow-down" aria-hidden="true"></i></span> */}
                  <span className='mx-1 mt-5 card2-heading'>Details </span>
                </Card.Header>
                <Card.Body className='' style={{ marginTop: '-17px' }}>Select template to customize the workflow for programs like TB, HIV, Malaria, or Sickle cell anemia. 
          Smart setup allows users to use the existing template or add, edit, and remove stages/variables to best align the program with existing or aspired field implementation. 
          Users can publish multiple programs by selecting the required templates after logging in to their registered accounts.
          The platform also displays a preview of the flow created indicating how the configured fields would appear on the final device interface.
          After finalizing your selections, click on the ‘Publish’ 
          button to get unique user credentials which can be used to visualize the published program on the application.</Card.Body>
              </Card>
              : null}
            </Col>
          </Row>

        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-6">
            <p className="footext">Powered by  <img alt='durelogo' className="fooimg" src={imgurl.durelogo.default} /></p>  </div>
          <div className="col-6">
            <div className="widthMaxContent ml-auto pt-2">
              <p className="footextcopy">Copyright © 2020. All rights reserved</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;