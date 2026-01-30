import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Nav,
  Form,
  Navbar,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { ErrorMessage, Field, Formik, Form as FForm } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { loginApi, multipartPostCall } from "../util";
import {
  setUser,
  setLoader,
  setEditFlag,
  setUserTemplate,
} from "../redux/actions/userAction";
import { setProgramDetails } from "../redux/actions/createProgramAction";
import imgurl from "../assets/images/imgUrl";
import TextError from "../component/ErrorText";
import API from "../util";

import _ from "underscore";

import oldformat from "../assets/data/oldFormat.json";
import newformat from "../assets/data/newFormat.json";
import axios from "axios";
import { apiUrl } from "../util/urls";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const storeState = useSelector((state) => state);

  const handleClose = () => setShowModal(false);

  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleVideoClose = () => setShowVideoModal(false);

  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const handleTutorialClose = () => setShowTutorialModal(false);

  const resetPassword = () => {};
  const resetSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Username is required"),
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Username is required"),
    password: Yup.string()
      .min(6, "Minimum length 6 character")
      .required("Password is required"),
  });
  const getProgramTemplate = (data) => {

    dispatch(setLoader(true));
    API.get(`dataStore/template/programtemplate`).then((res) => {
      if (res.status === 200) {
        if (data && data.data && data.programdetails) {
          console.log("data in start", res.data.programstages, data.data.programstages);
          res.data.programstages = data.data.programstages;
          res.data["userAccesses"] = data.data.userAccesses;
          res.data["organisationUnits"] = data.data.organisationUnits;
          res.data.appname = data.programdetails.appname;
          res.data.attributesArray = data.data.attributesArray;
          res.data.countries = data.programdetails.countries;
          res.data.description = data.programdetails.description;
          res.data.disclaimer = data.programdetails.disclaimer;
          res.data.logo = data.programdetails.logo;
          res.data.name = data.programdetails.name;
          res.data.programuid = data.programdetails.programuid;
          res.data.selectedlanguage = data.programdetails.selectedlanguage;
          res.data.roleBasedArray = data.programdetails.roleBasedArray;
          res.data.resetPassFlag = data.programdetails.resetPassFlag || true;
          res.data.showInQrCard = data.programdetails?.showInQrCard || [];
          res.data["users"] = data.programdetails.users;
          res.data["deletedObjects"] = data.programdetails.deletedObjects
            ? data.programdetails.deletedObjects
            : { deletedAttribute: [], deletedDataElement: [] };

          res.data["programSections"] = data.data.programSections;
          // Code for attribute checkbox group
          let tempTrackHolder = [];
          data.data.trackedentityattributes.map((element) => {
            if (element.type == "boolean") {
              data.data.programSections.map((section) => {
                if (section.name.includes(element.name)) {
                  element.attributeRefType = "checkbox";
                  element.type = "checkbox";
                  element.checkboxoption = _.map(
                    section.trackedEntityAttributes,
                    function (elemgrp) {
                      return elemgrp.name;
                    }
                  );
                  let checkboxvalues = [];
                  section.trackedEntityAttributes.map((el) => {
                    data.data.trackedentityattributes.map((ell) => {
                      console.log(el.id, ell.dataElementId);
                      if (ell.trackedEntityAttributeId == el.id)
                        checkboxvalues.push(ell);
                    });
                  });
                  element.options = checkboxvalues;
                  tempTrackHolder.push(element);
                }
              });
            } else {
              tempTrackHolder.push(element);
            }
          });
          res.data.trackedentityattributes = tempTrackHolder;
        }
        dispatch(setLoader(false));
        console.log(res.data, "res.data in start");
        dispatch(setProgramDetails(res.data));
        dispatch(setUserTemplate(res.data));
        if (data && data.data && data.programdetails)
          getDependency(data, res.data);
        else history.push("/dashboard");
        // dispatch(setLanguagesList(res.data.selectedlanguage))
        // console.log(res)
      }
    });
  };
  const getDependency = (data, userTemplate) => {
    console.log(userTemplate);
    let programuid = data.programdetails.programuid;
    var programRules,
      programRuleVariables,
      stageDependentArray = [];
    var attributedependentquestions = [];
    API.get(
      `programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet&paging=false`
    ).then((response) => {
      console.log(response.data.programRuleVariables);
      programRuleVariables = response.data.programRuleVariables;
      API.get(
        `programRules?filter=program.id:eq:` +
          programuid +
          `&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false`
      ).then((response) => {
        console.log(response.data.programRules);
        programRules = response.data.programRules;
        programRuleVariables.map((variable) => {
          if (variable.program.id == programuid) {
            if (
              variable.programRuleVariableSourceType ==
              "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"
            ) {
              let temp = {};
              temp["dependentdataelementnames"] = [];
              programRules.map((rule) => {
                if (
                  rule.condition &&
                  rule.condition.includes("!=") &&
                  rule.condition.match(/\{(.*?)\}/)[1] == variable.displayName
                ) {
                  temp["variableName"] = variable.displayName;
                  temp["dataElementId"] = variable.dataElement.id;
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  console.log(rule.condition.split("!= ")[1]);
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");
                  temp["stagename"] = _.find(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  })?.name;
                  let stageIndex = _.findIndex(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  });
                  let parentIndex = _.findIndex(
                    userTemplate.programstages[stageIndex]?.dataelements,
                    { name: temp?.dataelementname }
                  );
                  rule.programRuleActions.map((action) => {
                    if (
                      _.find(
                        _.find(userTemplate.programstages, {
                          id: variable?.programStage?.id,
                        })?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      )
                    ) {
                      let objHolder = {};
                      objHolder["childdataelementname"] = _.find(
                        _.find(userTemplate?.programstages, {
                          id: variable?.programStage?.id,
                        })?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      )?.name;
                      objHolder["actionId"] = action.id;
                      objHolder["dataElementId"] = action?.dataElement?.id;
                      temp["dependentdataelementnames"].push(objHolder);

                      let childIndex = _.findIndex(
                        userTemplate?.programstages[stageIndex]?.dataelements,
                        { name: objHolder?.childdataelementname }
                      );
                      userTemplate.programstages[stageIndex].dataelements[
                        childIndex
                      ]["parentQuestion"] = parentIndex;
                      userTemplate.programstages[stageIndex].dataelements[
                        childIndex
                      ]["dependentValue"] = temp.matchingvalue;
                    }
                  });
                }
              });
              stageDependentArray.push(temp);
            } else if (
              variable.programRuleVariableSourceType == "TEI_ATTRIBUTE"
            ) {
              let temp = {};
              temp["dependentdataelementnames"] = [];
              programRules.map((rule) => {
                console.log(rule, "rule");
                if (
                  rule.condition &&
                  rule.condition.includes("!=") &&
                  rule.condition.match(/\{(.*?)\}/)[1] == variable.displayName
                ) {
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  console.log(rule.condition.split("!= ")[1]);
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");

                  let parentIndex = _.findIndex(
                    userTemplate.trackedentityattributes,
                    { name: temp.dataelementname }
                  );
                  rule.programRuleActions.map((action) => {
                    if (
                      _.find(userTemplate.trackedentityattributes, {
                        trackedEntityAttributeId: action.trackedEntityAttribute.id,
                      })
                    ) {
                      let objHolder = {};
                      objHolder["childdataelementname"] = _.find(
                        userTemplate.trackedentityattributes,
                        {
                          trackedEntityAttributeId: action.trackedEntityAttribute.id,
                        }
                      ).name;
                      let childIndex = _.findIndex(
                        userTemplate.trackedentityattributes,
                        { name: objHolder.childdataelementname }
                      );
                      objHolder["actionId"] = action.id;
                      temp["dependentdataelementnames"].push(objHolder);

                      userTemplate.trackedentityattributes[childIndex][
                        "parentQuestion"
                      ] = parentIndex;
                      userTemplate.trackedentityattributes[childIndex][
                        "dependentValue"
                      ] = temp.matchingvalue;
                    }
                  });
                }
              });
              attributedependentquestions.push(temp);
            }
          }
          // _.find(userTemplate.trackedentityattributes,[])
        });
        userTemplate.programstages.map((stage) => {
          let tempArray = [];
          let datelementHolder = stage.dataelements;
          stage.dataelements.map((element) => {
            if (element.type == "boolean") {
              API.get(
                "dataElementGroups?filter=identifiable:token:" +
                  element.dhisname +
                  "&paging=false&fields=id,name,dataElements[id,displayName~rename(code),formName~rename(name)]"
              ).then((res) => {
                if (res.data.dataElementGroups.length > 0 && _.findWhere(res.data.dataElementGroups, { name: element.dhisname })) {
                  // console.log(res.data.dataElementGroups)
                  // stage.dataelements
                  let currentGroup = _.findWhere(res.data.dataElementGroups, { name: element.dhisname })
                  element.attributeRefType = "checkbox";
                  element.type = "checkbox";
                  element.groupid = currentGroup.id;
                  element.checkboxoption = _.map(
                    currentGroup.dataElements,
                    function (elemgrp) {
                      return elemgrp.name;
                    }
                  );
                  let checkboxvalues = [];
                  currentGroup.dataElements.map((el) => {
                    datelementHolder.map((ell) => {
                      if (ell.dataElementId == el.id) checkboxvalues.push(ell);
                    });
                  });
                  console.log(checkboxvalues);
                  element.options = checkboxvalues;
                  tempArray.push(element);
                }
              });
            } else {
              tempArray.push(element);
            }
          });
          stage.dataelements = tempArray;
        });
        userTemplate["attributedependentquestions"] =
          attributedependentquestions;
        userTemplate["stageDependentArray"] = stageDependentArray;
        dispatch(setUserTemplate(userTemplate));
        history.push('/dashboard')
      });
    });
  };
  const loginSubmit = (values) => {
    dispatch(setLoader(true));
    const Authorization =
      "Basic " + btoa(values.email.trim() + ":" + values.password.trim());
    loginApi(Authorization)
      .then((res) => {
        console.log(res);
        dispatch(setLoader(false));
        if (res.status === 200) {
          // _.find(res.data.userCredentials.userRoles, {name: "APPADMIN"}) || _.find(res.data.userCredentials.userRoles, {name: "Superuser"})
          if (true) {
            sessionStorage.setItem("Authorization", Authorization);
            sessionStorage.setItem("userData", JSON.stringify(res.data));
            console.log(res.data);
            // history.push('/landingpage')
            // return
            console.log(
              "res.data.introduction:>>",
              res.data.introduction,
              storeState.user.inProgressPublish
            );
            if (res.data.introduction && res.data.introduction === "Publish") {
              API.get(
                "tracker/smartsetup/get/" + res.data.organisationUnits[0].id
              ).then((res) => {
                dispatch(setEditFlag(true));
                getProgramTemplate(res.data);
              });
            } else {
              getProgramTemplate();
              dispatch(setEditFlag(false));
            }
            dispatch(setUser(res.data));
          } else {
            swal({
              title: "Not Authorized",
              //text: error.response.data.message,
              text: "You are not authorized to access this app",
              icon: "error",
              button: "Close",
            });
          }
        }
        dispatch(setLoader(false));
      })
      .catch((error) => {
        if (error.response) {
          swal({
            title: "Login Failed",
            //text: error.response.data.message,
            text: "Please check the credentials.",
            icon: "error",
            button: "Close",
          });
        } else {
          swal({
            title: "Login Failed",
            text: "Please check the credentials.",
            icon: "error",
            button: "Close",
          });
        }
        dispatch(setLoader(false));
      });
  };

  useEffect(() => {
    // console.log("==========Temp Code==============");
    // console.log(newformat, "newformat");
    // newformat.trackedentityattributes.map((el) => {
    //   delete el.id;
    //   delete el.trackedEntityAttributeId;
    //   delete el.options;
    //   delete el.optionsetid;
    //   if (!el.attributeRefType) {
    //     el.attributeRefType = "text";
    //     el.type = "text";
    //   }
    //   if (el.name == null) el.name = el.orignalname;
    //   // if(!el.orignalname)
    //   console.log(el.name);
    // });
    // newformat.programSections.map((sec) => {
    //   delete sec.id;
    //   sec.trackedEntityAttributes.map((te) => {
    //     delete te.id;
    //   });
    // });
    // newformat.programstages.map((stage) => {
    //   delete stage.id;
    //   stage.programStageSections.map((sec) => {
    //     delete sec.id;
    //     delete sec.lastUpdated;
    //     delete sec.lastUpdatedBy;
    //     delete sec.created;
    //     sec.dataElements.map((de) => {
    //       delete de.id;
    //     });
    //   });
    //   // delete stage.programStageSections
    //   stage.dataelements.map((de) => {
    //     delete de.id;
    //     delete de.dataElementId;
    //     delete de.options;
    //     delete de.optionsetid;
    //     if (!de.attributeRefType) {
    //       de.attributeRefType = "text";
    //       de.type = "text";
    //     }
    //     if (de.name == null) de.name = de.orignalname;
    //     // if(!de.orignalname)
    //     console.log(de.name);
    //   });
    // });
    // console.log(newformat, "postupdate");

    // TEMP CODE END
    


    //   let temp = {}
    //   instance.get("https://lrmis.imonitorplus.com/service/api/dataSets/zvHu42EdDI6?fields=dataSetElements[id,dataSet[id],dataElement[id,displayName,categoryCombo[id,displayName]]").then(res => {
    //     console.log(res)
    //     res.data.dataSetElements.map(el => {
    //         temp[el.dataElement.displayName] = el.dataElement.id
    //     })
    //     console.log(temp)
    //   })
    // console.log(oldformat,newformat)
    // let attributeList = oldformat.application[0].trackedentityattributes
    // let tempArr = []
    // let arr2= []
    // newformat.trackedentityattributes.map( attribute => {
    //     let matched = false
    //     attributeList.map(att => {
    //         if((att.name).trim().toLocaleLowerCase() == attribute.name.trim().toLowerCase()){
    //             matched = true
    //             let temp = {}
    //             temp['name'] = attribute.name
    //             let arr =[]
    //             Object.keys(att.languages).map(el => {
    //                 arr.push({locale: el, property: 'NAME', value: att.languages[el]})
    //                 temp[el] = att.languages[el]
    //             })
    //             let localArr = []
    //             if(attribute.attributeRefType == 'optionset'){
    //                 att.optionvalues.map((option,idx) => {
    //                     let a = []
    //                     Object.keys(att.optionvaluesLocale).map(loc => {
    //                         a.push({'locale': loc, 'property': 'NAME', 'value': att.optionvaluesLocale[loc][idx] ? att.optionvaluesLocale[loc][idx].name : ''})
    //                     })
    //                     let temp = {}
    //                     temp[option] = a
    //                     localArr.push(temp)
    //                 })
    //                 attribute.optionvaluesLocale = localArr
    //             }
    //             tempArr.push(temp)
    //             attribute['languages'] = arr
    //         }
    //     })
    //     if(!matched)
    //     arr2.push(attribute.name)
    // })
    // console.log(newformat,"updated json")
    // console.log("==========Temp ENd==============")
    console.log("==========Loading APP==============");
    localStorage.removeItem("persist:root");
    sessionStorage.clear();
    localStorage.clear();
    dispatch(setLoader(false));
  }, []);
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
            <Nav className="ml-auto pr-4 mr-1">
              <Nav.Link>
                <Link className="navLink" to="/">
                  Login
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link className="navLink" to="/Register">
                  Register
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link className="navLink" to="/Activate">
                  Activate Account
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="mainContentLogin">
        <div className="row pt-5 pl-5 pr-5 maincontent">
          <div className="col-8">
            {/* <p className="descmessage"> This is the first step for adapting this platform to country specific need. The user would need a one-time registration on the smart-set-up. Once the users have successfully registered, they will get access to the smart set-up where they can create a program, configure registration and service forms, alerts, dashboard indicators and publish. The user can also upload index cases for which contact investigation is needed, manage user groups and facility and even print QR coded cards. </p>

                        <div>
                            <a href="javascript:void(0)" target="_blank">
                                <Button className="downloadbtn p-1" variant="light" >
                                    <i className="fab fa-android pr-2"></i>
                                    PlayStore
                                </Button>
                            </a>
                            <a href="javascript:void(0)" target='_blank'>
                                <Button className="downloadbtn ml-2 p-1" variant="light" >
                                    <i className="fab fa-apple pr-2"></i>
                                    AppStore
                                </Button>
                            </a>
                            <a href='https://tpttest.imonitorplus.com/caredashboard/' target='_blank'>
                                <Button className="downloadbtn ml-2 p-1" variant="light" >
                                    <i className="fa fa-area-chart pr-2"></i>
                                    Dashboard
                                </Button>
                            </a>
                            <a href='https://tpttest.imonitorplus.com/productuatv1/' target='_blank'>
                                <Button className="downloadbtn ml-2 p-1" variant="light" >
                                    <i className="fab fa-chrome pr-2"></i>
                                    Webapp
                                </Button>
                            </a>
                            <Button onClick={() => setShowVideoModal(true)} className="p-1 downloadbtn ml-2" variant="light" >
                                <i className="fab fa-youtube pr-2"></i>
                                Training Video
                            </Button>
                            <Button onClick={() => setShowTutorialModal(true)} className="downloadbtn ml-2 p-1" variant="light">
                                <i className="fas fa-book pr-2"></i>
                                Training Manual
                            </Button>
                        </div> */}
          </div>

          <div className="col-4">
            <Card className="loginCard">
              <Card.Header className="card-header">
                <span>Login Form</span>
              </Card.Header>
              <Card.Body className="card-body">
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={(values) => {
                    loginSubmit(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <FForm>
                      <Form.Group controlId="formBasicEmail">
                        <Field name="email">
                          {({ field, meta }) => {
                            return (
                              <>
                                <Form.Label className="label">
                                  Username
                                </Form.Label>
                                <div className="formgroup">
                                  <span className="input-group-addon">
                                    <i className="far fa-user-circle"></i>
                                  </span>
                                  <span className="formInput">
                                    <input
                                      type="text"
                                      className="form-control"
                                      {...field}
                                    />
                                  </span>
                                </div>
                              </>
                            );
                          }}
                        </Field>
                        <ErrorMessage component={TextError} name="email" />
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Field name="password">
                          {({ field, meta }) => {
                            return (
                              <>
                                <Form.Label className="label">
                                  Password
                                </Form.Label>
                                <div className="formgroup">
                                  <span className="input-group-addon">
                                    <i className="fas fa-fingerprint"></i>
                                  </span>
                                  <span className="formInput">
                                    <input
                                      type="password"
                                      className="form-control"
                                      {...field}
                                    />
                                  </span>
                                </div>
                              </>
                            );
                          }}
                        </Field>
                        <ErrorMessage component={TextError} name="password" />
                      </Form.Group>

                      <Button
                        className="loginBtn text-white"
                        variant="primary"
                        type="submit"
                      >
                        Log me in
                      </Button>
                    </FForm>
                  )}
                </Formik>
                <div>
                  <p
                    className="forgotbtn"
                    onClick={() => setShowModal(true)}
                    type="button"
                  >
                    Forgot Password
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-6">
            <p className="footext">
              Powered by{" "}
              <img
                alt="durelogo"
                className="fooimg"
                src={imgurl.durelogo.default}
              />
            </p>{" "}
          </div>
          <div className="col-6">
            <div className="widthMaxContent ml-auto pt-2">
              <p className="footextcopy">
                Copyright © 2020. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="p-2">
          <Modal.Title className="h5">Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={resetSchema}
              onSubmit={(values) => {
                // console.log(values)
                dispatch(setLoader(true));
                var bodyFormData = new FormData();
                bodyFormData.append("username", values.email);
                multipartPostCall("account/recovery", bodyFormData)
                  .then((res) => {
                    // console.log(res)
                    dispatch(setLoader(false));
                    setShowModal(false);
                    swal({
                      title: "Done",
                      text: res.data.message,
                      icon: "success",
                      button: "Close",
                    });
                  })
                  .catch((err) => {
                    dispatch(setLoader(false));
                    if (err.response) {
                      swal({
                        title: "Fail",
                        text: err.response.data.message,
                        icon: "error",
                        button: "Close",
                      });
                    } else {
                      swal({
                        title: "Fail",
                        text: "Fail to update",
                        icon: "error",
                        button: "Close",
                      });
                    }
                  });
              }}
            >
              {({ errors, touched }) => (
                <FForm>
                  <Form.Group controlId="formBasicEmail">
                    <Field name="email">
                      {({ field, meta }) => {
                        return (
                          <>
                            <Form.Label className="label">Username</Form.Label>
                            <div className="formgroup">
                              <span className="formInput">
                                <input
                                  type="text"
                                  className="form-control"
                                  {...field}
                                />
                              </span>
                            </div>
                          </>
                        );
                      }}
                    </Field>
                    <ErrorMessage component={TextError} name="email" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Reset
                  </Button>
                </FForm>
              )}
            </Formik>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showVideoModal} onHide={handleVideoClose} centered>
        <Modal.Header closeButton className="p-2">
          <Modal.Title className="h5">Training Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <video width="100%" controls="controls">
              <source
                src="https://ltbigen.duredemos.com/training_resources/PreventTBGenericVideo.mp4"
                type="video/mp4"
              />{" "}
              Your browser does not support HTML5 video.
            </video>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        show={showTutorialModal}
        onHide={handleTutorialClose}
        centered
      >
        <Modal.Header closeButton className="p-2">
          <Modal.Title className="h5">Demo Credentials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <h6>Smartsetup</h6>
            <Row>
              <Col xs={6} md={6} className="mb-3">
                <p className="mb-0">Username : demouser@ltbigen.com</p>
                <p className="mb-0">Password : Test@123</p>
              </Col>
            </Row>
            <hr></hr>
            <h6>Dashboard</h6>
            <Row>
              <Col xs={6} md={6} className="mb-3">
                <p className="mb-0">Username : demouser@ltbigen.com</p>
                <p className="mb-0">Password : Test@123</p>
              </Col>
            </Row>
            <hr></hr>
            <h6>App/Webapp</h6>
            <Row>
              <Col xs={4} md={4} className="mb-3">
                <p className="mb-0">Username : 31745_orw1@uatpreventtb.org</p>
                <p className="mb-0">Password : Test@123</p>
                <p className="mb-0">Token : 123456</p>
                <p className="mb-0">Pin : 1234</p>
              </Col>
              <Col xs={4} md={4} className="mb-3">
                <p className="mb-0">
                  Username : 31745_facilitytb1@uatpreventtb.org
                </p>
                <p className="mb-0">Password : Test@123</p>
                <p className="mb-0">Token : 123456</p>
                <p className="mb-0">Pin : 1234</p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
