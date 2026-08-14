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
import { loginApi, multipartPostCall, sendTokenAPI, validateTokenAPI,updatePasswordAPI } from "../util";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import _ from "underscore";
import toast, { Toaster } from 'react-hot-toast';
import oldformat from "../assets/data/oldFormat.json";
import newformat from "../assets/data/newFormat.json";
import axios from "axios";
import { apiUrl } from "../util/urls";
import { decryptData, encryptData } from "../component/AesEnc.js";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const storeState = useSelector((state) => state);

  const handleClose = () => setShowModal(false);

  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleVideoClose = () => setShowVideoModal(false);

  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const handleTutorialClose = () => setShowTutorialModal(false);

  const [showPassword, setShowPassword] = useState(false)

  const resetPassword = () => { };
  const resetSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Username is required"),
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;

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
      `programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id,name,description],trackedEntityAttribute[id],useCodeForOptionSet&paging=false`
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

        // STEP 1: Process dependencies FIRST
        programRuleVariables.map((variable) => {
          if (variable.program.id == programuid) {
            if (
              variable.programRuleVariableSourceType ==
              "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"
            ) {
              let temp = {};
              temp["dependentdataelementnames"] = [];
              let hasValidRule = false;

              programRules.map((rule) => {
                if (rule.condition && rule.condition.includes("!=")) {
                  const match = rule.condition.match(/\{(.*?)\}/);
                  if (match && match[1] == variable.displayName) {
                    hasValidRule = true;
                    temp["variableName"] = variable.displayName;
                    temp["dataElementId"] = variable?.dataElement?.id;
                    temp["variableId"] = variable.id;
                    temp["dataelementname"] = variable?.dataElement?.name.includes("_") ? variable?.dataElement?.name.split("_")[1] : variable?.dataElement?.name; //variable.displayName.split("_")[1] //
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
                      { dataElementId: variable.dataElement.id }
                    );

                    rule.programRuleActions.map((action) => {
                      if (
                        action?.dataElement?.id &&
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
                          { dataElementId: action?.dataElement?.id }
                        );

                        if (childIndex !== -1 && parentIndex !== -1) {
                          userTemplate.programstages[stageIndex].dataelements[
                            childIndex
                          ]["parentQuestion"] = parentIndex;
                          userTemplate.programstages[stageIndex].dataelements[
                            childIndex
                          ]["dependentValue"] = temp.matchingvalue;
                        }
                      }
                    });
                  }
                }
              });

              if (hasValidRule) {
                stageDependentArray.push(temp);
              }
            } else if (
              variable.programRuleVariableSourceType == "TEI_ATTRIBUTE"
            ) {
              let temp = {};
              temp["dependentdataelementnames"] = [];
              let hasValidRule = false;

              programRules.map((rule) => {
                console.log(rule, "rule");
                if (rule.condition && rule.condition.includes("!=")) {
                  const match = rule.condition.match(/\{(.*?)\}/);
                  if (match && match[1] == variable.displayName) {
                    hasValidRule = true;
                    temp["variableId"] = variable.id;
                    temp["dataelementname"] = variable?.displayName?.includes("_") ? variable?.displayName?.split("_")[1] : variable?.displayName;
                    temp["ruleId"] = rule.id;
                    console.log(rule.condition.split("!= ")[1]);
                    temp["matchingvalue"] = rule.condition
                      .split("!= ")[1]
                      .replaceAll("'", "");

                    let parentIndex = _.findIndex(
                      userTemplate.trackedentityattributes,
                      { trackedEntityAttributeId: variable.trackedEntityAttribute.id }
                    );

                    rule.programRuleActions.map((action) => {
                      if (
                        action?.trackedEntityAttribute?.id &&
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
                          { trackedEntityAttributeId: action.trackedEntityAttribute.id }
                        );

                        objHolder["actionId"] = action.id;
                        temp["dependentdataelementnames"].push(objHolder);

                        if (childIndex !== -1 && parentIndex !== -1) {
                          userTemplate.trackedentityattributes[childIndex][
                            "parentQuestion"
                          ] = parentIndex;
                          userTemplate.trackedentityattributes[childIndex][
                            "dependentValue"
                          ] = temp.matchingvalue;
                        }
                      }
                    });
                  }
                }
              });

              if (hasValidRule) {
                attributedependentquestions.push(temp);
              }
            }
          }
        });

        // STEP 2: Process checkboxes and MARK option dataElements as hidden
        const checkboxPromises = [];

        userTemplate.programstages.map((stage) => {
          stage.dataelements.map((element) => {
            if (element.type == "boolean") {
              const promise = API.get(
                "dataElementGroups?filter=identifiable:token:" +
                element.dhisname +
                "&paging=false&fields=id,name,dataElements[id,displayName~rename(code),formName~rename(name)]"
              ).then((res) => {
                if (res.data.dataElementGroups.length > 0 && _.findWhere(res.data.dataElementGroups, { name: element.dhisname })) {
                  let currentGroup = _.findWhere(res.data.dataElementGroups, { name: element.dhisname });

                  // Modify parent element
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

                  // ✅ NEW: Mark all checkbox option dataElements as hidden
                  currentGroup.dataElements.map((el) => {
                    stage.dataelements.map((ell) => {
                      if (ell.dataElementId == el.id) {
                        // Mark this as a checkbox option (not a standalone question)
                        // ell.isCheckboxOption = true;
                        // ell.parentCheckboxId = element.dataElementId;
                        // checkboxvalues.push(ell);
                        checkboxvalues.push({
                            ...ell,
                            isCheckboxOption: true,
                            parentCheckboxId: element.dataElementId,
                        });
                      }
                    });
                  });

                  console.log(checkboxvalues);
                  element.options = checkboxvalues;
                }
              }).catch(err => {
                console.error("Error fetching checkbox data:", err);
              });

              checkboxPromises.push(promise);
            }
          });
        });

        // STEP 3: Wait for all checkbox processing, then dispatch
        Promise.all(checkboxPromises).then(() => {
          userTemplate["attributedependentquestions"] = attributedependentquestions;
          userTemplate["stageDependentArray"] = stageDependentArray;
          console.log("userTemplate ", userTemplate)
          dispatch(setUserTemplate(userTemplate));
          history.push('/dashboard');
        }).catch(err => {
          console.error("Error processing checkboxes:", err);
          userTemplate["attributedependentquestions"] = attributedependentquestions;
          userTemplate["stageDependentArray"] = stageDependentArray;
          dispatch(setUserTemplate(userTemplate));
          history.push('/dashboard');
        });
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

    //   let instance = axios.create({
    //     headers: {
    //       get: {        // can be common or any other method
    //         "Authorization": "Basic " + btoa("lrmis_admin" + ":" + "Test@123")
    //       }
    //     }
    //   })

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
    // localStorage.removeItem("persist:root");
    // sessionStorage.clear();
    // localStorage.clear();
    dispatch(setLoader(false));
  }, []);

  // Forgot password functionality
  function openForgotPasswordPopup() {
  swal({
    title: "Forgot Password",
    text: "Please enter your username to reset your password",
    content: "input",
    buttons: ["Cancel", "Continue"],
    className: "my-custom-swal",
    icon: "info",
    closeOnClickOutside: false,
  }).then((username) => {
    if (username === null) {
      // User clicked Cancel, do nothing
      return;
    }
    
    if (username && username.trim()) {
      validateUsername(username.trim());
    } else {
      // Show error if Continue clicked without input
      swal({
        title: "Username Required",
        text: "Please enter your username to continue.",
        icon: "warning",
        className:"my-custom-swal",
        button: "OK",
      }).then(() => {
        openForgotPasswordPopup(); // Show the popup again
      });
    }
  });
}



// Step 1: Validate username and send token
function validateUsername(username) {
  const requestBody = {
    status: "1",
    username,
    userrole: "",
    userid: ""
  };

  //setLoading(true);

  sendTokenAPI(requestBody)
    .then((res) => {
      //setLoading(false);
      if (res.status === "success") {
        swal({
          title: "Token Required",
          text: "Please enter the verification token you received via your registered email.",
          icon: "warning",
          className:"my-custom-swal",
          button: "OK"
        }).then(() => openTokenVerificationModal(username));
      } else if(res.message === "service unavailable") {
        showInvalidUsernameAlert();
      }
      else {
        showMissingEmailAlert();
      }
    })
    .catch((err) => {
      //setLoading(false);
      console.error("Error validating username:", err);
      showErrorAlert(err, "Failed to validate username.");
    });
}

// Step 2: Send token to email
function sendTokenToEmail(username) {
 const requestBody = {
    status: "1",
    username,
    userrole: "",
    userid: ""
  };

  //setLoading(true);

  sendTokenAPI(requestBody)
    .then((res) => {
      //setLoading(false);
      if (res.status === "success") {
        swal({
          title: "Token Sent!",
          text: "A verification token has been sent to your email address.",
          icon: "success",
          button: "Continue"
        }).then(() => openTokenVerificationModal(username));
      } else {
        showTokenFailureAlert();
      }
    })
    .catch((err) => {
      //setLoading(false);
      showErrorAlert(err, "Failed to send token.");
    });
}

// Step 3: Token verification modal
function openTokenVerificationModal(username) {
swal({
  title: "Enter Verification Token",
  content: {
    element: "input",
    attributes: {
      placeholder: "Enter token here",
      type: "text",
    },
  },
  buttons: {
    cancel: "Cancel",
    resend: { text: "Resend", value: "resend" },
    verify: { text: "Verify", value: "verify" },
  },
  className:"my-custom-swal",
  closeOnClickOutside: false,
}).then((value) => {
    const tokenInput = document.querySelector('.swal-content input');
    const token = tokenInput?.value.trim();

    if (value === "resend") {
      sendTokenToEmail(username);
    } else if (value === "verify") {
      if (token) {
        verifyTokenAndShowPasswordModal(username, token);
      } else {
        swal({
          title: "Token Required",
          text: "Please enter the verification token.",
          icon: "warning",
          button: "OK"
        }).then(() => openTokenVerificationModal(username));
      }
    }
  });

}

// Step 4: Verify token and show password modal
function verifyTokenAndShowPasswordModal(username, token) {
  //setLoading(true);

  validateTokenAPI({ username, token })
    .then((res) => {
      const response = decryptData(res);
      //setLoading(false);

      if (response.status === "success") {
        swal({
          title: "Token Validated!",
          text: "Please set a new password.",
          icon: "success",
          className:"my-custom-swal",
          button: "Continue"
        }).then(() => openNewPasswordModal(username, token));
      } else {
        swal({
          title: "Invalid Token",
          text: "The token is invalid. Please try again.",
          icon: "error",
          className:"my-custom-swal",
          button: "Retry"
        }).then(() => openTokenVerificationModal(username));
      }
    })
    .catch((err) => {
      //setLoading(false);
      showErrorAlert(err, "Token validation failed.");
    });
}

// Step 5: Show new password modal
function openNewPasswordModal(username, token) {

  // Exact SVG paths from Font Awesome Free Regular (far fa-eye / far fa-eye-slash)
  const eyeOpenSVG1 = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="18" fill="#888">
      <path d="M288 144a144 144 0 1 0 144 144A144 144 0 0 0 288 144zm0 240a96 96 0 1 1 96-96 96 96 0 0 1-96 96zm0-160a64 64 0 1 0 64 64 64 64 0 0 0-64-64zm284.52 36.58C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 260.58a31.94 31.94 0 0 0 0 22.84C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-196.58a31.94 31.94 0 0 0 0-22.84zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"/>
    </svg>`;

  const eyeOffSVG1 = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="18" height="18" fill="#888">
      <path d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429 240.39 416 224 416 204a96 96 0 0 0-96-96 95.94 95.94 0 0 0-23.21 38.47zm-37.56 55.44L123.45 96.42C176.29 63.07 228.88 48 320 48c117.54 0 221.53 64.55 278.71 144.4a31.91 31.91 0 0 1 0 22.92c-16.75 27.73-42.21 57.3-74.09 82.43l-59.47-46.47C468 239.7 470 230 470 220c0-72.79-55-132.38-125.07-139.67a95.93 95.93 0 0 0-85.7 121.58zM320 464c-117.54 0-221.53-64.55-278.71-144.4a31.91 31.91 0 0 1 0-22.92c16.47-27.28 41.43-56.44 72.77-81.45l-43.77-34.2C27.77 209.73 3 240.49 3 256c0 1 .17 2 .21 2.94C57 376.52 164.06 448 320 448a372.34 372.34 0 0 0 74.19-7.67l-54-42.19A95.83 95.83 0 0 1 320 400a96 96 0 0 1-96-96 95.82 95.82 0 0 1 1.22-15.11l-50.77-39.7A163.32 163.32 0 0 0 172 268a148.23 148.23 0 0 0 148 148 147.52 147.52 0 0 0 62.22-13.89l-62.22-48.64z"/>
    </svg>`;

  const eyeOpenSVG = '<i class="fas fa-eye"></i>';
  const eyeOffSVG = '<i class="fas fa-eye-slash"></i>';

  const passwordForm = document.createElement('div');
  passwordForm.innerHTML = `
    <div style="text-align: left; margin-top: 15px;">

      <label style="font-weight: bold;">Username:</label>
      <input type="text" value="${username}" disabled
        style="width: 95%; margin-bottom: 15px; border: none; background-color: #f2f2f2;
               padding: 10px; font-size: 14px; box-sizing: border-box;" />

      <label style="font-weight: bold;">New Password:</label>
      <div style="position: relative; margin-bottom: 15px; width: 95%;">
        <input type="password" id="newPassword" placeholder="Enter new password"
          style="width: 100%; border: none; background-color: #f9f9f9;
                 padding: 10px 40px 10px 10px; font-size: 14px; box-sizing: border-box;" />
        <button type="button" id="toggleNewPassword"
          style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                 background: none; border: none; cursor: pointer; padding: 0;
                 display: flex; align-items: center;">
          <span id="eyeIconNew"></span>
        </button>
      </div>

      <label style="font-weight: bold;">Confirm Password:</label>
      <div style="position: relative; margin-bottom: 5px; width: 95%;">
        <input type="password" id="confirmPassword" placeholder="Confirm new password"
          style="width: 100%; border: none; background-color: #f9f9f9;
                 padding: 10px 40px 10px 10px; font-size: 14px; box-sizing: border-box;" />
        <button type="button" id="toggleConfirmPassword"
          style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                 background: none; border: none; cursor: pointer; padding: 0;
                 display: flex; align-items: center;">
          <span id="eyeIconConfirm"></span>
        </button>
      </div>

      <div style="font-size: 12px; color: #666; margin-top: 5px; margin-bottom: 10px;">
        Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.
      </div>
    </div>
  `;

  // Set initial icons (hidden state = eyeOff)
  passwordForm.querySelector('#eyeIconNew').innerHTML = eyeOffSVG;
  passwordForm.querySelector('#eyeIconConfirm').innerHTML = eyeOffSVG;

  // Toggle New Password
  passwordForm.querySelector('#toggleNewPassword').addEventListener('click', function () {
    const input = passwordForm.querySelector('#newPassword');
    const icon = passwordForm.querySelector('#eyeIconNew');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.innerHTML = isHidden ? eyeOpenSVG : eyeOffSVG;
  });

  // Toggle Confirm Password
  passwordForm.querySelector('#toggleConfirmPassword').addEventListener('click', function () {
    const input = passwordForm.querySelector('#confirmPassword');
    const icon = passwordForm.querySelector('#eyeIconConfirm');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.innerHTML = isHidden ? eyeOpenSVG : eyeOffSVG;
  });

  swal({
    title: "Set New Password",
    content: passwordForm,
    buttons: {
      cancel: "Cancel",
      confirm: { text: "Update Password", value: "update" },
    },
    icon: "info",
    className:"my-custom-swal",
    closeOnClickOutside: false
  }).then((result) => {
    if (result === "update") {
      const newPassword = document.getElementById('newPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (!newPassword || !confirmPassword) {
        return showSimpleAlert("Missing Information", "Please fill in both password fields.", "warning", () =>
          openNewPasswordModal(username, token));
      }

      if (newPassword !== confirmPassword) {
        return showSimpleAlert("Password Mismatch", "Passwords do not match.", "error", () =>
          openNewPasswordModal(username, token));
      }

      if (!passwordRegex.test(newPassword)) {
        return showSimpleAlert(
          "Invalid Password",
          "Password must contain at least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 special character.",
          "warning",
          () => openNewPasswordModal(username, token)
        );
      }

      updatePassword(username, newPassword, token);
    } else {
      swal.close();
    }
  });
}

// Step 6: Update password
function updatePassword(email, password, token) {
  //setLoading(true);

  updatePasswordAPI({ email, password })
    .then(() => {
      //setLoading(false);
      swal({
        title: "Password Updated!",
        text: "Your password has been successfully updated.",
        icon: "success",
        button: "Ok"
      }).then(() => {
        swal.close(); // Or redirect
      });
    })
    .catch((err) => {
      //setLoading(false);
      swal({
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update password.",
        icon: "error",
        buttons: {
          retry: { text: "Try Again", value: "retry" },
          cancel: { text: "Cancel", value: null }
        }
      }).then((result) => {
        if (result === "retry") {
          verifyTokenAndShowPasswordModal(email, token);
        }
      });
    });
}

function showSimpleAlert(title, text, icon, callback) {
  swal({ title, text, icon, button: "OK" }).then(callback);
}

function showErrorAlert(err, fallbackMsg) {
  swal({
    title: "Error",
    text: err.response?.data?.message || fallbackMsg,
    icon: "error",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showInvalidUsernameAlert() {
  swal({
    title: "Invalid Username",
    text: "The username you entered is not valid. Please check and try again.",
    icon: "error",
    className:"my-custom-swal",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showMissingEmailAlert() {
  swal({
    title: "Email Not Found",
    text: "No email found with this username. Please check and try again.",
    icon: "error",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showTokenFailureAlert() {
  swal({
    title: "Token Error",
    text: "Failed to send verification token. Please try again.",
    icon: "error",
    button: "Retry"
  }).then(() => openForgotPasswordPopup());
}


  return (
    <div>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        position="bottom-right"
        reverseOrder={false}
      />
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
                          {({ field, meta }) => (
                            <>
                              <Form.Label className="label">Password</Form.Label>

                              <div className="formgroup" style={{ display: "flex", alignItems: "center" }}>
                                <span className="input-group-addon">
                                  <i className="fas fa-fingerprint" />
                                </span>

                                <span className="formInput" style={{ position: "relative", flex: 1 }}>
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    {...field}
                                    style={{ paddingRight: 36 }} // space for eye icon
                                  />

                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label={showPassword ? "Show password" : "Hide password"}
                                    style={{
                                      position: "absolute",
                                      right: 8,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      border: "none",
                                      background: "transparent",
                                      padding: 0,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                  </button>
                                </span>
                              </div>
                            </>
                          )}
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
                    //onClick={() => setShowModal(true)}
                    onClick={() => openForgotPasswordPopup()}
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
