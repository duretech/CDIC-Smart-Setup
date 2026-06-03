import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Form, Tabs, Tab, Accordion, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setLoader, setEditFlag, setUserTemplate, setUser, setInProgressPublish } from '../../redux/actions/userAction'
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import TextError from '../../component/ErrorText';
import {
  useHistory
} from "react-router-dom";

import makeAnimated from 'react-select/animated';
import swal from "sweetalert";
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';
import API from "../../util";

import _ from "underscore";

import { Tabs as Tabsnew, Tab as Tabnew } from 'react-tabs-scrollable'
import 'react-tabs-scrollable/dist/rts.css'

const animatedComponents = makeAnimated();

const disabledArray = [];

const ServicesStep = () => {
  const history = useHistory();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const userInputs = useSelector((state) => state.programDetails.details)
  const currentUserTemplate = useSelector(state => state.programDetails.userTemplate);

  const [stageArray, setStageArray] = useState(userTemplate.programstages > 0 ? userTemplate.programstages : [])
  const [stageRenderKey, setStageRenderKey] = useState(0)
  const [questionObject, setQuestionObject] = useState({})
  const [userArray, setUserArray] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [optionsArray, setOptionsArray] = useState([])
  const [optionValuesLocaleObject, setOptionValuesLocaleObject] = useState({})
  const [optionValuesLocaleArray, setOptionValuesLocaleArray] = useState([])
  const [languagesArray, setLanguagesArray] = useState([])
  const [isEditQuestion, setIsEditQuestion] = useState(false)
  const [dataVariableToggle, setDataVariableToggle] = useState(false)
  const [formToggle, setformToggle] = useState(false)
  const [isEditStage, setIsEditStage] = useState(false)
  const [tabKey, setKey] = useState(userInputs && userInputs.languages ? userInputs.languages[0].value : null);
  const [currentDataelement, setCurrentDataelement] = useState([])
  const [stageDependentArray, setStageDependentArray] = useState(userTemplate.stageDependentArray)
  const userDetails = useSelector((state) => state.user.userDetails)
  const [lowAge, setLowAge] = useState(userTemplate.age ? userTemplate.age.split('-')[0] : 5)
  const [highAge, setHighAge] = useState(userTemplate.age ? userTemplate.age.split('-')[1] : 10)
  const [optionsError, setOptionsError] = useState('');

  //variable for Add New Section
  const addNewSectionFormRef = useRef(null);
  const [addNewSectionToggle, setaddNewSectionToggle] = useState(false)
  const addNewSectionObjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })
  // Variable for Section render
  const stageSectionFormRef = useRef(null);
  const [renderSectionToggle, setRenderSectionToggle] = useState(false)
  const [currentStage, setCurrentStage] = useState(userTemplate.programstages[0])
  const [programStageSections, setProgramStageSections] = useState(currentStage?.programStageSections)
  const [attribuetArray, setAttribuetArray] = useState(userTemplate.trackedentityattributes > 0 ? userTemplate.trackedentityattributes : [])
  const [dependentArray, setDependentArray] = useState([])
  const [unmappedAttributes, setUnmappedAttributes] = useState([])
  const sectionObjectSchema = Yup.object().shape({
    name: Yup.string()
    // dataElements: Yup.array(),
  })
  const [selectedSection, setSelectedSection] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sections, setSections] = useState([]);
  const [unassignedDataElements, setUnassignedDataElements] = useState([]);
  const [dataElements, setDataElements] = useState([]);
  const [selectedDataElements, setSelectedDataElements] = useState([]);
  // Variable for Mobile Render
  const [renderMobileViewToggle, setRenderMobileViewToggle] = useState(false)
  const [activeTab, setActiveTabNew] = React.useState(0)

  // define a onClick function to bind the value on tab click
  const onTabClick = (e, index) => {
    setActiveTabNew(index)
  }

  // Variable for Delete flow
  const [deleteVariableToggle, setDeleteVariableToggle] = useState(false)
  const [deletedElementArray, setDeletedElementArray] = useState(userTemplate.deletedObjects.deletedDataElement)
  const [currentElementList, setCurrentElementList] = useState([])
  const onElementSelect = selectedOption => {
    setCurrentElementList(selectedOption)
  }
  const [tempKey, setTempKey] = useState(0)
  const [stageLabelArray, setStageLabelArray] = useState(userTemplate.programstages > 0 ? userTemplate.programstages : [])
  const [stageInReferral, setStageInReferral] = useState(userTemplate.stageInReferral ? userTemplate.stageInReferral : [])
  const [currentRefFlowFlag, setCurrentRefFlowFlag] = useState(userTemplate.isReferralWorkflow)
  const onStageSelect = selectedOption => {
    setStageInReferral(selectedOption)
  }

  const pushQuestionListToStage = () => {
    let arrayHolder = stageArray
    let deleteArrHolder = deletedElementArray
    arrayHolder.map((stageObj, id) => {
      if (stageObj.name && convertToLowerCase(stageObj.name) == convertToLowerCase(stageObject['name'])) {
        stageObj.dataelements.push(...currentElementList)
      }
    })
    setDeletedElementArray(
      deleteArrHolder.filter(function (obj) {
        return !this.has(obj.dataElementId);
      }, new Set(currentElementList.map(obj => obj.dataElementId)))
    )
    setStageArray([...arrayHolder])
    setDeleteVariableToggle(false)
  }
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

  // Utility: checks if Smartsetup disabling is enabled
  const isSmartsetupDisabled = (dataElement) => {
    return Array.isArray(dataElement.attributesArray) &&
      dataElement.attributesArray.some(
        (attr) => attr.name === "Disable in Smartsetup" && attr.value === "true"
      )
  }

  const getCoreTypeValue = (dataElement) => {
    if (Array.isArray(dataElement.attributesArray)) {
      const coreAttr = dataElement.attributesArray.find(
        (attr) => attr.name === "Core"
      );
      return coreAttr ? coreAttr.value : "-";
    }
    return "-";
  };


  // Utility: checks if a service question should be disabled
  const checkServiceQuestionForDisable = (servicename, questionname) => {
    if ((servicename == 'refertoinvestigation' || servicename == 'Refer to Investigation') && (questionname == 'Symptoms' ||
      questionname == 'Refer to Lab for Investigation' ||
      questionname == 'Refer to Facility Center')) {
      return 'disabled';
    } else {
      return '';
    }
  }
  // 
useEffect(() => {
  // ✅ Deep clone to avoid mutating Redux state
let tempArr = userTemplate.programstages.map((set, id) => ({
    ...set,
    sortOrder: id,
    level: set.level || 1,
    dataelements: set.dataelements.map((element, idx) => {
      // remove legacy isUpdated flag, keep only isupdate
      const { isUpdated, ...elementRest } = element;
      return {
        ...elementRest,
        sortOrder: idx,
        // ✅ Preserve isupdate — do NOT reset it here
        ...(
          (element.attributeRefType === 'boolean' || element.type === 'boolean' || element.type === 'BOOLEAN')
            ? { isCheckboxOption: true }
            : {}
        ),
      };
    }),
  }));

  let labelArr = [];
  tempArr.forEach((set) => {
    if (set.name != 'Referral Services') {
      labelArr.push({ label: set.name, value: set.orignalname });
    }
  });

  setStageLabelArray(labelArr);
  setStageDependentArray(userTemplate.stageDependentArray);
  setStageArray(tempArr);
  setCurrentStage(tempArr[0]);
}, [userTemplate]);

  useEffect(() => {
    let tempHolder = userTemplate.trackedentityattributes
    tempHolder.map((el, id) => {
      if (!el['sortOrder'])
        el['sortOrder'] = id + 1
    })
    setAttribuetArray(tempHolder)
    setDependentArray(userTemplate.attributedependentquestions)
    let unMappedAttr = [];
    userTemplate?.trackedentityattributes.forEach(attribute => {
      if (attribute?.programSectionFlag == false) {
        let attr = {
          value: attribute.dataElementId,
          label: attribute.name
        }
        unMappedAttr.push(attr)
      }
      else {
        return
      }
    });
    setUnmappedAttributes(unMappedAttr)
  }, [])

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

  useEffect(() => {
    // console.log(languagesObject)
  }, [languagesArray])
  useEffect(() => {
  }, [optionValuesLocaleObject])
  useEffect(() => {
    if (currentStage && currentStage.programStageSections) {
      setProgramStageSections(currentStage.programStageSections);
    }
  }, [currentStage]);

  useEffect(() => {
    if (currentStage != null) {
      const sectionOptions = programStageSections
        ?.filter(section => section.id)
        ?.map(section => ({
          id: section.id,
          name: section.name,
          displayName: section.displayName,
        }));

      let unassignedDEs = [];
      currentStage?.dataelements.forEach(attribute => {
        if (
          attribute?.programStageSectionFlag === false &&
          !attribute.isCheckboxOption              // ✅ Hide only boolean child options
        ) {
          let attr = {
            value: attribute.dataElementId || attribute.orignalname,
            label: attribute.name
          };
          unassignedDEs.push(attr);
        }
      });

      setSections(sectionOptions || []);
      setUnassignedDataElements(unassignedDEs);
    }
  }, [programStageSections, currentStage]);

  useEffect(() => {
    const section = programStageSections?.find(
      sec => sec.name === selectedSection
    );

    const mappedDataElements = section
      ? section.dataElements
        .map(attr => {
          const de = currentStage?.dataelements?.find(
            d => d.dataElementId === attr.id
          );
          // ✅ Skip ONLY boolean child options
          if (!de || de.isCheckboxOption) {
            return null;
          }
          return { value: attr.id, label: attr.formName };
        })
        .filter(Boolean)
      : [];

    const filteredUnassignedDataElements = unassignedDataElements.filter(attr => {
      const dataElement = currentStage?.dataelements?.find(
        de => (de.dataElementId || de.orignalname) === attr.value
      );
      return (
        dataElement &&
        dataElement.dataElementId &&
        !dataElement.isCheckboxOption              // ✅ Hide only boolean child options
      );
    });

    setDataElements([...mappedDataElements, ...filteredUnassignedDataElements]);
    setSelectedDataElements(mappedDataElements);
  }, [selectedSection, unassignedDataElements, userTemplate, stageArray]);


  const handleDataElementsChange = (selectedOptions) => {
    console.log("Selected Data Elements:", selectedDataElements, selectedOptions);
    setSelectedDataElements(selectedOptions);
  };


  //To update Section Configuration
  const updateStageSectionConf = (values) => {
    // Update stage name if changed
    if (values.name && values.name !== currentStage.name) {
      let arrayHolder = [...stageArray];
      const currentStageIndex = arrayHolder.findIndex(
        stage => stage.orignalname === currentStage.orignalname
      );
      if (currentStageIndex !== -1) {
        arrayHolder[currentStageIndex].name = values.name;
        setStageArray(arrayHolder);
      }
    }

    // Map selected options to the required format with sortOrder
    const options = selectedDataElements.map((option, index) => ({
      id: option.value,
      value: option.value,
      formName: option.label,
      description: currentStage?.dataelements.find(dE => dE.dataElementId == option.value) ? currentStage.dataelements.find(dE => dE.dataElementId == option.value).orignalname : option.label,
      sortOrder: index + 1,
    }));

    // Get IDs of currently selected dataElements
    const selectedIds = selectedDataElements.map(option => option.value);

    // Clone and update programStageSections with new dataElements list
    const updatedProgramStageSections = programStageSections.map(section => {
      if (section.description === selectedSection) {
        return { ...section, dataElements: options };
      }
      return section; // PRESERVE OTHER SECTIONS
    });

    // Find previously mapped dataElement IDs for the selected section BEFORE update
    const previousSection = programStageSections.find(section => section.description === selectedSection);
    const previouslyMappedIds = previousSection
      ? previousSection.dataElements.map(de => de.id || de.value || de.formName || de.dataElementId || de.orignalname)
      : [];

    // Find REMOVED dataElement IDs
    const removedIds = previouslyMappedIds.filter(prevId => !selectedIds.includes(prevId));

    // Update stageArray for the CURRENT STAGE being configured
    const updatedStageArray = stageArray.map(stage => {
      // Only update the current stage being configured by comparing orignalname
      if (stage.orignalname === currentStage.orignalname) {
        const updatedDataElements = stage.dataelements.map(de => {
          const deId = de.dataElementId || de.orignalname || de.id || de.name;

          if (removedIds.includes(deId)) {
            // DataElement removed from this section - unmap
            return { ...de, programStageSectionFlag: false, sortOrder: 0 };
          }

          if (selectedIds.includes(deId)) {
            // DataElement is currently selected - map and set sort order
            const indexInSelected = selectedIds.indexOf(deId);
            return { ...de, programStageSectionFlag: true, sortOrder: indexInSelected + 1 };
          }

          // Others remain unchanged
          return de;
        });

        // KEY FIX: Update BOTH dataelements AND programStageSections
        return {
          ...stage,
          dataelements: updatedDataElements,
          programStageSections: updatedProgramStageSections  // This was missing!
        };
      }

      // Return unchanged stage
      return stage;
    });

    // Update ALL state variables with NEW references
    setProgramStageSections(updatedProgramStageSections);
    setStageArray(updatedStageArray);

    // Update currentStage to reflect changes immediately
    const updatedCurrentStage = updatedStageArray.find(
      stage => stage.orignalname === currentStage.orignalname
    );
    if (updatedCurrentStage) {
      setCurrentStage(updatedCurrentStage);
    }

    setRenderSectionToggle(false);
    if (stageSectionFormRef.current) {
      stageSectionFormRef.current.resetForm({
        values: {
          name: currentStage.name || currentStage.orignalname,
          section_name: '',
          dataElements: [],
        }
      });
    }
    setSelectedDataElements([...selectedDataElements]);

    // Update userTemplate at the end with the changes
    const updatedUserTemplate = {
      ...userTemplate,
      programstages: updatedStageArray,
    };

    // Dispatch the updated template to Redux
    dispatch(setUserTemplate(updatedUserTemplate));
        toast.success('Section Configured Successfully!',
      {
        id: 'section-success',
        style: {
          border: '1px solid #44546A',
          padding: '16px',
        },
      }
    )
  };

  // To add New Section inside Selected Stage 
  // To add New Section inside Selected Stage 
  // To add New Section inside Selected Stage 
  const handleAddNewItem = (values) => {
    if (_.findIndex(programStageSections, { name: values.name }) != -1) {
      toast.error('Error: Section With Same Name Already Exists',
        {
            id: 'section-error',
          style: {
            border: '1px solid #44546A',
            padding: '16px',
          },
        }
      )
    }
    else {
      let currentProgramSections = programStageSections;
      let newSection = {
        "description": values.name,
        "renderType": {
          "MOBILE": {
            "type": "LISTING"
          },
          "DESKTOP": {
            "type": "LISTING"
          }
        },
        "sortOrder": sections.length,
        "displayName": values.name,
        "name": values.name,
        "programStage": {
          "id": currentStage.id
        },
        "dataElements": []
        // 🔴 NO id property - indicates it's not saved to DB yet
      }
      currentProgramSections.push(newSection)

      // 🔴 REMOVE THIS LINE
      // setSections((prev) => [...prev, newSection])

      // Update stageArray with the new section
      let updatedStageArray = stageArray.map((stage, idx) => {
        if (stage.orignalname === currentStage.orignalname) {
          return {
            ...stage,
            programStageSections: currentProgramSections
          };
        }
        return stage;
      });

      setStageArray(updatedStageArray);

      // Update currentStage to reflect the new section
      const updatedCurrentStage = updatedStageArray.find(
        stage => stage.orignalname === currentStage.orignalname
      );
      if (updatedCurrentStage) {
        setCurrentStage(updatedCurrentStage);
        setProgramStageSections(updatedCurrentStage.programStageSections);
      }

      toast.success('New Section Added Successfully',
        {
          id: 'section-add-success',
          style: {
            border: '1px solid #44546A',
            padding: '16px',
          },
        }
      )
      setaddNewSectionToggle(false)
    }
  };
  // To add New Section inside Selected Stage 
  // To add New Section inside Selected Stage 

  const handleSectionChange = (event) => {
    const selectedSection = event.target.value;
    setSelectedSection(selectedSection)
  };

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

  

  const pushQuestionToStage_old = (values) => {
    
    let arrayHolder = stageArray;
    let localeHolder = [...optionValuesLocaleArray];


    // ========= DUPLICATE NAME VALIDATION (PER STAGE) =========
    const currentStageIndex = arrayHolder.findIndex(
      (stageObj) =>
        stageObj.name &&
        convertToLowerCase(stageObj.name) === convertToLowerCase(values.stagename)
    );


    if (currentStageIndex !== -1) {
      const currentStage = arrayHolder[currentStageIndex];


      if (!isEditQuestion) {
        const isDuplicateName = currentStage.dataelements?.some(
          (element) =>
            element.name &&
            convertToLowerCase(element.name.trim()) ===
            convertToLowerCase(values.name.trim())
        );


        if (isDuplicateName) {
          Swal.fire({
            title: "Duplicate Name!",
            text: "A question with this name already exists in this stage. Please use a unique name.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-ok-btn",
            },
          });
          return;
        }
      } else {
        const isDuplicateName = currentStage.dataelements?.some(
          (element) =>
            element.orignalname !== values.orignalname &&
            element.name &&
            convertToLowerCase(element.name.trim()) ===
            convertToLowerCase(values.name.trim())
        );


        if (isDuplicateName) {
          Swal.fire({
            title: "Duplicate Name!",
            text: "A question with this name already exists in this stage. Please use a unique name.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-ok-btn",
            },
          });
          return;
        }
      }
    }
    // ========= END DUPLICATE NAME VALIDATION =========


    arrayHolder.map((stageObj, id) => {
      if (
        stageObj.name &&
        convertToLowerCase(stageObj.name) == convertToLowerCase(values["stagename"])
      ) {
        const hasInvalidOption = optionsArray.some(
          (option) => option.trim() === "" || option.trim().length < 2
        );
        if (hasInvalidOption) {
          setOptionsError("Please fill in all options. Each option must have at least 2 characters!");
          return;
        }


        if (values.attributeRefType == 'optionset') {
          if (optionsArray.length == 0) {
            setOptionsError("At least one option is required.");
            return;
          }
          setOptionsError('');
          values['type'] = 'text';
          values['optionvalues'] = optionsArray;
          values['optionname'] = "option_" + Date.now();


          if (isEditQuestion && questionObject.options && questionObject.options.length > 0) {
            let mergedOptions = [...questionObject.options];
            optionsArray.forEach((optName, idx) => {
              const existsInOptions = mergedOptions.some(
                opt => opt.name === optName && !opt.isdelete
              );
              if (!existsInOptions) {
                mergedOptions.push({
                  name: optName,
                  sortOrder: idx + 1
                });
              }
            });
            values['options'] = mergedOptions;
          } else {
            const optionsAsObjects = optionsArray.map((opt, idx) => ({
              name: opt,
              sortOrder: idx + 1
            }));
            values['options'] = optionsAsObjects;
          }
        } else if (values.attributeRefType == 'checkbox') {
          if (optionsArray.length == 0) {
            setOptionsError("At least one option is required.");
            return;
          }
          setOptionsError('');
          values['checkboxoption'] = optionsArray;


          if (isEditQuestion && questionObject.options && questionObject.options.length > 0) {
            let mergedOptions = [...questionObject.options];
            optionsArray.forEach((optName, idx) => {
              const existsInOptions = mergedOptions.some(
                opt => opt.name === optName && !opt.isdelete
              );
              if (!existsInOptions) {
                mergedOptions.push({
                  name: optName,
                  isCheckboxOption: true,
                  sortOrder: idx + 1
                });
              }
            });
            values['options'] = mergedOptions;
          } else {
            const optionsAsObjects = optionsArray.map((opt, idx) => ({
              name: opt,
              isCheckboxOption: true,
              sortOrder: idx + 1
            }));
            values['options'] = optionsAsObjects;
          }
        }


        values["languages"] = languagesArray;
        values.languages.map((lang, idx) => {
          if (lang.locale == "en") values.languages.splice(idx, 1);
        });


        // ✅ CRITICAL FIX: Convert parent NAME to INDEX before saving
        // This MUST happen before the isEditQuestion block
        if (values.parentQuestion !== "" && values.parentQuestion !== undefined && values.parentQuestion !== null) {
          // Check if parentQuestion is a NAME (string) instead of INDEX (number)
          if (typeof values.parentQuestion === 'string') {
            // Find the index of the parent by name IN THE CURRENT STAGE'S dataelements
            const parentIndex = stageObj.dataelements.findIndex(el =>
              el.name === values.parentQuestion
            );


            if (parentIndex !== -1) {
              console.log(`✅ Converting parent from NAME "${values.parentQuestion}" to INDEX ${parentIndex}`);
              values.parentQuestion = parentIndex;
            } else {
              // Parent not found, clear the parent
              console.warn(`❌ Parent question "${values.parentQuestion}" not found in stage. Clearing parent.`);
              values.parentQuestion = "";
              values.dependentValue = "";
            }
          } else {
            console.log(`✅ Parent question is already an INDEX: ${values.parentQuestion}`);
          }
        } else {
          // Ensure empty values are consistent
          console.log(`ℹ️ No parent question selected`);
          values.parentQuestion = "";
          values.dependentValue = "";
        }


        setDataVariableToggle(false);


        if (isEditQuestion) {
          stageObj.dataelements.map((element, idx) => {
            if (element.orignalname === values.orignalname) {
              element.optionvaluesLocale = localeHolder;
              values["isupdate"] = true;


              // ✅ Make sure we're saving the updated values with INDEX
              arrayHolder[id].dataelements[idx] = { ...values };


              console.log(`✅ Updated question "${values.name}" with parentQuestion:`, values.parentQuestion);
              return;
            } else {
              element.isupdate = false;
            }
          });
          Swal.fire({
            title: "Update!",
            text: "Question Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-ok-btn",
            },
          });
        } else {

          values["orignalname"] = values.name;
          values["optionvaluesLocale"] = localeHolder;
          values["programStageSectionFlag"] = false;
          stageObj.dataelements.push({ ...values });


          console.log(`✅ Added new question "${values.name}" with parentQuestion:`, values.parentQuestion);


          Swal.fire({
            title: "Add!",
            text: "New Question Added Successfully",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-ok-btn",
            },
          });
        }


        // ========= Code For Dependency Logic =========

        // ✅ STEP A: Find EXISTING rule for THIS CHILD question BEFORE removing it
        let existingRuleForChild = null;
        let existingRuleIndex = -1;

        if (isEditQuestion) {
          // ✅ Search in ORIGINAL stageDependentArray, NOT tempDepentHolder
          existingRuleIndex = stageDependentArray.findIndex((dep) =>
            dep.dependentdataelementnames?.some(
              (child) => child.childdataelementname === values.name && dep.stagename === values.stagename
            )
          );

          if (existingRuleIndex !== -1) {
            // ✅ Clone the existing rule to preserve IDs
            existingRuleForChild = { ...stageDependentArray[existingRuleIndex] };

            console.log("📝 Found existing rule for child:", values.name);
            console.log("   Current parent:", existingRuleForChild.dataelementname);
            console.log("   Current value:", existingRuleForChild.matchingvalue);
            console.log("   RuleId:", existingRuleForChild.ruleId || "NOT PRESENT");
            console.log("   VariableId:", existingRuleForChild.variableId || "NOT PRESENT");
          }
        }
        
        // STEP B: Remove this question from ALL existing dependencies
        let tempDepentHolder = [...stageDependentArray];

        //comment code
        // tempDepentHolder = tempDepentHolder.map((element) => {
        //   element.dependentdataelementnames = element.dependentdataelementnames.filter(
        //     child => child.childdataelementname !== values.name
        //   );
        //   return element;
        // }).filter(element => element.dependentdataelementnames.length > 0);

        //commented above code Added below line 
        //tempDepentHolder = tempDepentHolder.filter(element => element.dependentdataelementnames.length > 0);
        tempDepentHolder = tempDepentHolder.map(element => {
          //checking same vaiable name existing in any stage
          const children = element.dependentdataelementnames.filter(
            child =>
              !(child.childdataelementname === values.name &&
                element.stagename === values.stagename)
          );

          return {
            ...element,
            dependentdataelementnames: children,
            ...(children.length === 0 && { isDelete: true })
          };
        });
        //.filter(e => e.dependentdataelementnames.length);


        // STEP C: If a parent is selected, update or create dependency
        if (
          values.parentQuestion !== "" &&
          values.parentQuestion !== undefined &&
          values.parentQuestion !== null &&
          typeof values.parentQuestion === "number"
        ) {
          const parentElement = stageObj.dataelements[values.parentQuestion];
          if (parentElement) {
            console.log("Building dependency for", values.name, "- parent", parentElement.name, "index", values.parentQuestion);

            if (existingRuleForChild) {
              // ✅ EXISTING RULE FOUND - REUSE IT WITH UPDATES
              console.log("♻️ Reusing existing rule");

              // Check if parent changed
              const parentChanged = existingRuleForChild.dataElementId !== parentElement.dataElementId;
              const valueChanged = existingRuleForChild.matchingvalue !== values.dependentValue;

              if (parentChanged) {
                // ✅ PARENT CHANGED - Update name, value, remove variableId & variableName, KEEP ruleId
                console.log("🔄 Parent changed from", existingRuleForChild.dataelementname, "to", parentElement.name);

                existingRuleForChild.dataelementname = parentElement.name;     // ✅ NEW parent name
                existingRuleForChild.dataElementId = parentElement.dataElementId;
                existingRuleForChild.matchingvalue = values.dependentValue;    // ✅ NEW dependent value

                // ✅ REMOVE variableId, variableName, and dataElementId (tied to old parent)
                delete existingRuleForChild.variableId;
                delete existingRuleForChild.variableName;
                //delete existingRuleForChild.dataElementId;

                // ✅ KEEP ruleId unchanged
                console.log("✅ Updated rule (parent changed):", {
                  dataelementname: existingRuleForChild.dataelementname,
                  matchingvalue: existingRuleForChild.matchingvalue,
                  variableId: "REMOVED",
                  variableName: "REMOVED",
                  ruleId: existingRuleForChild.ruleId || "NOT PRESENT",
                  dataElementId: existingRuleForChild.dataElementId
                });

              } else if (valueChanged) {
                // ✅ ONLY DEPENDENT VALUE CHANGED - Update matchingvalue only
                console.log("🔄 Value changed from", existingRuleForChild.matchingvalue, "to", values.dependentValue);

                // ✅ FIRST: Find the existing group in tempDepentHolder using OLD matchingvalue
                const existingGroupIndexOld = tempDepentHolder.findIndex((dep) =>
                  dep.dataElementId === existingRuleForChild.dataElementId &&
                  dep.stagename === stageObj.name &&
                  dep.matchingvalue === existingRuleForChild.matchingvalue  // ✅ OLD value
                );

                if (existingGroupIndexOld !== -1) {
                  // ✅ Update the matchingvalue in place
                  tempDepentHolder[existingGroupIndexOld].matchingvalue = values.dependentValue;

                  // ✅ Add this child back to the group
                  tempDepentHolder[existingGroupIndexOld].dependentdataelementnames.push({
                    childdataelementname: values.name,
                  });

                  console.log("✅ Updated matchingvalue in existing group:", {
                    dataelementname: tempDepentHolder[existingGroupIndexOld].dataelementname,
                    oldValue: existingRuleForChild.matchingvalue,
                    newValue: values.dependentValue,
                    variableId: tempDepentHolder[existingGroupIndexOld].variableId || "NOT PRESENT",
                    variableName: tempDepentHolder[existingGroupIndexOld].variableName || "NOT PRESENT",
                    ruleId: tempDepentHolder[existingGroupIndexOld].ruleId || "NOT PRESENT",
                    dataElementId: tempDepentHolder[existingGroupIndexOld].dataElementId || "NOT PRESENT"
                  });

                  // ✅ Skip the rest - we're done
                  return;
                } else {
                  // ✅ Group doesn't exist (all children were removed), update the cloned rule
                  existingRuleForChild.matchingvalue = values.dependentValue;

                  console.log("✅ Updated rule (value changed, no existing group):", {
                    dataelementname: existingRuleForChild.dataelementname,
                    matchingvalue: existingRuleForChild.matchingvalue,
                    variableId: existingRuleForChild.variableId || "NOT PRESENT",
                    variableName: existingRuleForChild.variableName || "NOT PRESENT",
                    ruleId: existingRuleForChild.ruleId || "NOT PRESENT",
                    dataElementId: existingRuleForChild.dataElementId || "NOT PRESENT"
                  });
                }

              } else {
                console.log("ℹ️ No changes detected (same parent and value)");
              }

              // ✅ Check if we already handled this in the valueChanged block
              if (valueChanged) {
                const alreadyAdded = tempDepentHolder.some((dep) =>
                  dep.dataElementId === existingRuleForChild.dataElementId &&
                  dep.stagename === stageObj.name &&
                  dep.matchingvalue === values.dependentValue &&
                  dep.dependentdataelementnames.some(child => child.childdataelementname === values.name && dep.stagename == values.stagename)
                );

                if (alreadyAdded) {
                  console.log("✅ Child already added in valueChanged block - skipping");
                } else {
                  // ✅ Check if a group exists for the NEW matchingvalue
                  const existingGroupIndex = tempDepentHolder.findIndex((dep) =>
                    dep.dataElementId === existingRuleForChild.dataElementId &&
                    dep.stagename === stageObj.name &&
                    dep.matchingvalue === existingRuleForChild.matchingvalue
                  );

                  if (existingGroupIndex !== -1) {
                    // ✅ Add this child to existing group
                    tempDepentHolder[existingGroupIndex].dependentdataelementnames.push({
                      childdataelementname: values.name,
                    });

                    console.log("✅ Added child to existing group");
                  } else {
                    // ✅ Add as new entry
                    tempDepentHolder.push({
                      ...existingRuleForChild,
                      stagename: stageObj.name,
                      dependentdataelementnames: [
                        {
                          childdataelementname: values.name,
                        },
                      ],
                    });

                    console.log("✅ Added updated rule as new entry");
                  }
                }
              } else {
                // ✅ No value change - just add to matching group or create new entry
                const existingGroupIndex = tempDepentHolder.findIndex((dep) =>
                  dep.dataElementId === existingRuleForChild.dataElementId &&
                  dep.stagename === stageObj.name &&
                  dep.matchingvalue === existingRuleForChild.matchingvalue
                );

                if (existingGroupIndex !== -1) {
                  tempDepentHolder[existingGroupIndex].dependentdataelementnames.push({
                    childdataelementname: values.name,
                  });

                  console.log("✅ Added child to existing group");
                } else {
                  tempDepentHolder.push({
                    ...existingRuleForChild,
                    stagename: stageObj.name,
                    dependentdataelementnames: [
                      {
                        childdataelementname: values.name,
                      },
                    ],
                  });

                  console.log("✅ Added rule as new entry");
                }
              }

            } else {
              // ✅ NO EXISTING RULE - Check if we can add to an existing parent+value group
              console.log("➕ No existing rule for this child");

              const existingGroupIndex = tempDepentHolder.findIndex((dep) =>
                dep.dataElementId === parentElement.dataElementId &&
                dep.stagename === stageObj.name &&
                dep.matchingvalue === values.dependentValue
              );

              if (existingGroupIndex !== -1) {
                // ✅ Add this child to an existing parent+value group
                if (!tempDepentHolder[existingGroupIndex].dependentdataelementnames.some(
                  child => child.childdataelementname === values.name && tempDepentHolder[existingGroupIndex].stagename === values.stagename
                )) {
                  tempDepentHolder[existingGroupIndex].dependentdataelementnames.push({
                    childdataelementname: values.name,
                  });

                  console.log("✅ Added child to existing rule group:", {
                    parent: tempDepentHolder[existingGroupIndex].dataelementname,
                    value: tempDepentHolder[existingGroupIndex].matchingvalue,
                    ruleId: tempDepentHolder[existingGroupIndex].ruleId || "NOT PRESENT",
                    totalChildren: tempDepentHolder[existingGroupIndex].dependentdataelementnames.length
                  });
                }

              } else {
                // ✅ CREATE BRAND NEW RULE (No ruleId, No variableId)
                console.log("➕ Creating brand new rule (no existing parent+value group)");

                const newRule = {
                  dataelementname: parentElement.name,
                  dataElementId: parentElement.dataElementId, // ✅ ADD THIS
                  stagename: stageObj.name,
                  matchingvalue: values.dependentValue,
                  dependentdataelementnames: [
                    {
                      childdataelementname: values.name,
                    },
                  ],
                };

                tempDepentHolder.push(newRule);

                console.log("✅ Created NEW rule (no IDs):", {
                  dataelementname: newRule.dataelementname,
                  matchingvalue: newRule.matchingvalue,
                  children: 1
                });
              }
            }
          } else {
            console.error("Parent element at index", values.parentQuestion, "not found!");
          }
        } else if (values.parentQuestion !== "" && typeof values.parentQuestion === "string") {
          console.error("ERROR: parentQuestion is still a STRING:", values.parentQuestion, "- conversion failed!");
        }


        // Update the state with the new dependency array
        setStageDependentArray(tempDepentHolder);


        // ✅ CRITICAL: Also update userTemplate in Redux with the new dependency array
        const updatedUserTemplate = {
          ...userTemplate,
          programstages: arrayHolder,
          stageDependentArray: tempDepentHolder
        };


        console.log(`✅ Dispatching updated userTemplate to Redux`);
        console.log(`   - Stage: "${stageObj.name}"`);
        console.log(`   - Question: "${values.name}"`);
        console.log(`   - ParentQuestion (INDEX): ${values.parentQuestion}`);
        console.log(`   - DependentValue: "${values.dependentValue}"`);
        console.log(`   - stageDependentArray entries: ${tempDepentHolder.length}`);


        dispatch(setUserTemplate(updatedUserTemplate));
        // ========= END Code For Dependency Logic =========
      }
    });


    setStageArray([...arrayHolder]);


    console.log(`✅ pushQuestionToStage completed`);
  };

const pushQuestionToStage = (values) => {
  const arrayHolder = [...stageArray]; // ✅ new reference
  const localeHolder = [...optionValuesLocaleArray];

  // ========= DUPLICATE NAME VALIDATION =========
  const currentStage = arrayHolder.find(
    (s) => convertToLowerCase(s.name) === convertToLowerCase(values.stagename)
  );

  if (currentStage) {
    const isDuplicate = currentStage.dataelements?.some(
      (el) =>
        convertToLowerCase(el.name?.trim()) === convertToLowerCase(values.name?.trim()) &&
        (!isEditQuestion || el.orignalname !== values.orignalname)
    );

    if (isDuplicate) {
      Swal.fire({
        title: "Duplicate Name!",
        text: "A question with this name already exists in this stage. Please use a unique name.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "swal2-ok-btn" },
      });
      return;
    }
  }
  // ========= END DUPLICATE NAME VALIDATION =========

  const stageIndex = arrayHolder.findIndex(
    (s) => convertToLowerCase(s.name) === convertToLowerCase(values.stagename)
  );
  if (stageIndex === -1) return;

  const stageObj = arrayHolder[stageIndex];

  // ========= OPTIONS VALIDATION & ASSIGNMENT =========
  const isOptionType = ["optionset", "checkbox"].includes(values.attributeRefType);

  // ✅ FIX: track whether options were added/changed
  let optionsChanged = false;

  if (isOptionType) {
    const hasInvalidOption = optionsArray.some(
      (opt) => opt.trim() === "" || opt.trim().length < 2
    );
    if (hasInvalidOption) {
      setOptionsError("Please fill in all options. Each option must have at least 2 characters!");
      return;
    }
    if (optionsArray.length === 0) {
      setOptionsError("At least one option is required.");
      return;
    }
    setOptionsError("");

    const isCheckbox = values.attributeRefType === "checkbox";

    const buildOptions = (existing) => {
      const base = existing?.length > 0 ? [...existing] : [];
      optionsArray.forEach((optName, idx) => {
        const exists = base.some((o) => o.name === optName && !o.isdelete);
        if (!exists) {
          base.push({
            name: optName,
            ...(isCheckbox && { isCheckboxOption: true }),
            sortOrder: idx + 1,
          });
        }
      });
      return base;
    };

    const freshOptions = optionsArray.map((opt, idx) => ({
      name: opt,
      ...(isCheckbox && { isCheckboxOption: true }),
      sortOrder: idx + 1,
    }));

    const existingOptions = isEditQuestion ? questionObject?.options : null;
    values.options =
      buildOptions(existingOptions?.length > 0 ? existingOptions : null) ?? freshOptions;

    // ✅ FIX: detect if options changed by comparing saved element's options vs new options
    if (isEditQuestion) {
      const savedElement = stageObj.dataelements.find(
        (el) => el.orignalname === values.orignalname
      );
      const savedOptionNames = (savedElement?.options || [])
        .filter((o) => !o.isdelete)
        .map((o) => o.name)
        .sort();
      const newOptionNames = [...optionsArray].sort();
      optionsChanged =
        savedOptionNames.length !== newOptionNames.length ||
        newOptionNames.some((name, i) => name !== savedOptionNames[i]);
    }

    if (isCheckbox) {
      values.checkboxoption = optionsArray;
    } else {
      values.type = "text";
      values.optionvalues = optionsArray;
      values.optionname = "option_" + Date.now();
    }
  }
  // ========= END OPTIONS =========

  // ========= LANGUAGES CLEANUP =========
  values.languages = languagesArray.filter((lang) => lang.locale !== "en");
  // ========= END LANGUAGES =========

  // ========= PARENT QUESTION — NAME → INDEX CONVERSION =========
  if (values.parentQuestion != null && values.parentQuestion !== "") {
    if (typeof values.parentQuestion === "string") {
      const parentIndex = stageObj.dataelements.findIndex(
        (el) => el.name === values.parentQuestion
      );
      if (parentIndex !== -1) {
        values.parentQuestion = parentIndex;
      } else {
        values.parentQuestion = "";
        values.dependentValue = "";
      }
    }
  } else {
    values.parentQuestion = "";
    values.dependentValue = "";
  }
  // ========= END PARENT CONVERSION =========

  // ========= PARENT + DEPENDENT VALUE VALIDATION =========
  const isValidParentSelected =
    values.parentQuestion !== "" &&
    values.parentQuestion !== undefined &&
    values.parentQuestion !== null;

  const isMissingDependentValue =
    !values.dependentValue ||
    values.dependentValue.trim() === "" ||
    values.dependentValue.trim() === "-";

  if (isValidParentSelected && isMissingDependentValue) {
    if (isEditQuestion) {
      const savedElement = stageObj.dataelements.find(
        (el) => el.orignalname === values.orignalname
      );
      if (savedElement?.dependentValue) {
        values.dependentValue = savedElement.dependentValue;
      }
    }
    Swal.fire({
      title: "Missing Dependent Value!",
      text: "You have selected a parent question. Please provide a valid dependent value before saving.",
      icon: "warning",
      confirmButtonText: "OK",
      customClass: { confirmButton: "swal2-ok-btn" },
    });
    return;
  }
  // ========= END VALIDATION =========

  setDataVariableToggle(false);

  // ========= ADD / UPDATE QUESTION =========
  if (isEditQuestion) {
    const elemIndex = stageObj.dataelements.findIndex(
      (el) => el.orignalname === values.orignalname
    );
    if (elemIndex !== -1) {
      // ✅ Immutable update — new array, new object
      // ✅ FIX: isUpdated is true always on edit, but also guaranteed true when optionsChanged
arrayHolder[stageIndex].dataelements = stageObj.dataelements.map((el, i) => {
  if (i === elemIndex) {
    return { ...el, ...values, optionvaluesLocale: localeHolder, isupdate: true };
  }
  // clear flag on all other elements
  const { isUpdated, ...rest } = el;
  return rest.isupdate ? { ...rest, isupdate: true } : rest;
});
    }
    Swal.fire({
      title: "Update!",
      text: "Question Updated Successfully",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "swal2-ok-btn" },
    });
  } else {
    // ✅ Immutable push
    arrayHolder[stageIndex].dataelements = [
      ...stageObj.dataelements,
      {
        ...values,
        orignalname: values.name,
        optionvaluesLocale: localeHolder,
        programStageSectionFlag: false,
      },
    ];
    Swal.fire({
      title: "Add!",
      text: "New Question Added Successfully",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "swal2-ok-btn" },
    });
  }
  // ========= END ADD / UPDATE =========

  // ========= DEPENDENCY LOGIC =========
  const { name, dependentValue, stagename, parentQuestion } = values;

  const isValidParent =
    typeof parentQuestion === "number" &&
    parentQuestion !== "" &&
    parentQuestion != null;

  // ✅ CAPTURE: Preserve existing child object (actionId, dataElementId) BEFORE stripping
  const existingChildObject = (() => {
    for (const element of stageDependentArray) {
      if (element.stagename !== stagename) continue;
      const found = element.dependentdataelementnames.find(
        (c) => c.childdataelementname === name
      );
      if (found) return { ...found };
    }
    return null;
  })();

  // ✅ BUILD: Reuse preserved child object to keep actionId, dataElementId
  // For brand new children — only childdataelementname
  const buildChildEntry = (childName) => {
    if (existingChildObject?.childdataelementname === childName) {
      return { ...existingChildObject }; // keeps actionId, dataElementId
    }
    return { childdataelementname: childName };
  };

  // ✅ HELPER: Find a group by parent dataElementId + stage + matchingvalue
  const findGroupIndex = (holder, dataElementId, stage, matchVal) =>
    holder.findIndex(
      (dep) =>
        dep.dataElementId === dataElementId &&
        dep.stagename === stage &&
        dep.matchingvalue === matchVal
    );

  // ✅ HELPER: Add child to group — no duplicates
  const addChildToGroup = (holder, index, childName) => {
    const exists = holder[index].dependentdataelementnames.some(
      (c) =>
        c.childdataelementname === childName &&
        holder[index].stagename === stagename
    );
    if (!exists) {
      // ✅ Remove isDelete when re-adding a child to a previously emptied rule
      const { isDelete, ...rest } = holder[index];
      holder[index] = {
        ...rest,
        dependentdataelementnames: [
          ...holder[index].dependentdataelementnames,
          buildChildEntry(childName),
        ],
      };
    }
  };

  // ========= STEP A: Find existing rule for THIS child BEFORE stripping =========
  let existingRuleForChild = null;
  if (isEditQuestion) {
    const existingRuleOriginalIndex = stageDependentArray.findIndex(
      (dep) =>
        dep.stagename === stagename &&
        dep.dependentdataelementnames?.some((c) => c.childdataelementname === name)
    );
    if (existingRuleOriginalIndex !== -1) {
      existingRuleForChild = JSON.parse(
        JSON.stringify(stageDependentArray[existingRuleOriginalIndex])
      );
    }
  }

  // ========= STEP B: Strip this child from ALL existing rules immutably =========
  const fullArray = [...stageDependentArray];
  const tempDepentHolder = fullArray
    .map((element) => {
      const filtered = element.dependentdataelementnames.filter(
        (c) =>
          !(c.childdataelementname === name && element.stagename === stagename)
      );

      if (filtered.length === element.dependentdataelementnames.length) {
        return element; // nothing removed — return original reference
      }

      return {
        ...element,
        dependentdataelementnames: filtered,
        ...(filtered.length === 0 && { isDelete: true }),
      };
    })
    // ✅ Safety cleanup: never keep isDelete on a rule that still has children
    .map((element) => {
      if (element.isDelete && element.dependentdataelementnames.length > 0) {
        const { isDelete, ...rest } = element; // remove isDelete
        return rest;
      }
      return element;
    });

  // ========= STEP C: Re-attach or create dependency =========
  if (isValidParent) {
    const parentElement = stageObj.dataelements[parentQuestion];

    if (parentElement) {
      const { dataElementId: parentDataElementId, name: parentName } = parentElement;

      if (existingRuleForChild) {
        // ── Child HAD a rule before ──
        const parentChanged =
          existingRuleForChild.dataElementId !== parentDataElementId;
        const valueChanged =
          existingRuleForChild.matchingvalue !== dependentValue;

        if (parentChanged) {
          // ✅ Parent switched — update identifiers, drop variable bindings, keep ruleId
          existingRuleForChild.dataelementname = parentName;
          existingRuleForChild.dataElementId = parentDataElementId;
          existingRuleForChild.matchingvalue = dependentValue;
          delete existingRuleForChild.variableId;
          delete existingRuleForChild.variableName;

          const groupIdx = findGroupIndex(
            tempDepentHolder,
            parentDataElementId,
            stagename,
            dependentValue
          );

          if (groupIdx !== -1) {
            addChildToGroup(tempDepentHolder, groupIdx, name);
          } else {
            tempDepentHolder.push({
              ...existingRuleForChild,
              stagename,
              dependentdataelementnames: [buildChildEntry(name)],
            });
          }
        } else if (valueChanged) {
          // ✅ Only value changed
          const hadSiblings = existingRuleForChild.dependentdataelementnames.length > 1;

          if (!hadSiblings) {
            const targetGroupIdx = findGroupIndex(
              tempDepentHolder,
              parentDataElementId,
              stagename,
              dependentValue
            );

            if (targetGroupIdx !== -1) {
              addChildToGroup(tempDepentHolder, targetGroupIdx, name);

              const oldGroupIdx = findGroupIndex(
                tempDepentHolder,
                existingRuleForChild.dataElementId,
                stagename,
                existingRuleForChild.matchingvalue
              );
              if (oldGroupIdx !== -1) {
                tempDepentHolder[oldGroupIdx] = {
                  ...tempDepentHolder[oldGroupIdx],
                  isDelete: true,
                };
              }
            } else {
              const oldGroupIdx = findGroupIndex(
                tempDepentHolder,
                existingRuleForChild.dataElementId,
                stagename,
                existingRuleForChild.matchingvalue
              );

              if (oldGroupIdx !== -1) {
                const { isDelete, ...rest } = tempDepentHolder[oldGroupIdx];
                tempDepentHolder[oldGroupIdx] = {
                  ...rest,
                  matchingvalue: dependentValue,
                  dependentdataelementnames: [buildChildEntry(name)],
                };
              } else {
                existingRuleForChild.matchingvalue = dependentValue;
                tempDepentHolder.push({
                  ...existingRuleForChild,
                  stagename,
                  dependentdataelementnames: [buildChildEntry(name)],
                });
              }
            }
          } else {
            const targetGroupIdx = findGroupIndex(
              tempDepentHolder,
              parentDataElementId,
              stagename,
              dependentValue
            );

            if (targetGroupIdx !== -1) {
              addChildToGroup(tempDepentHolder, targetGroupIdx, name);
            } else {
              tempDepentHolder.push({
                ...existingRuleForChild,
                stagename,
                matchingvalue: dependentValue,
                dependentdataelementnames: [buildChildEntry(name)],
              });
            }
          }
        } else {
          // ✅ No change — same parent, same value — re-add to same group
          const groupIdx = findGroupIndex(
            tempDepentHolder,
            existingRuleForChild.dataElementId,
            stagename,
            existingRuleForChild.matchingvalue
          );

          if (groupIdx !== -1) {
            addChildToGroup(tempDepentHolder, groupIdx, name);
          } else {
            tempDepentHolder.push({
              ...existingRuleForChild,
              stagename,
              dependentdataelementnames: [buildChildEntry(name)],
            });
          }
        }
      } else {
        // ── Child had NO prior rule — fresh attach ──
        const groupIdx = findGroupIndex(
          tempDepentHolder,
          parentDataElementId,
          stagename,
          dependentValue
        );

        if (groupIdx !== -1) {
          addChildToGroup(tempDepentHolder, groupIdx, name);
        } else {
          tempDepentHolder.push({
            dataelementname: parentName,
            dataElementId: parentDataElementId,
            stagename,
            matchingvalue: dependentValue,
            dependentdataelementnames: [buildChildEntry(name)],
          });
        }
      }
    } else {
      console.error(`Parent element at index ${parentQuestion} not found in stage "${stagename}"!`);
    }
  }
  // ========= END DEPENDENCY LOGIC =========

  // ✅ Final cleanup before flush — remove isDelete key entirely if value is undefined or rule has children
  const cleanedDepentHolder = tempDepentHolder.map((element) => {
    if (
      element.isDelete === undefined ||
      (element.isDelete && element.dependentdataelementnames.length > 0)
    ) {
      const { isDelete, ...rest } = element;
      return rest;
    }
    return element;
  });

  // ✅ Single flush — always together
  setStageDependentArray(cleanedDepentHolder);
  dispatch(
    setUserTemplate({
      ...userTemplate,
      programstages: arrayHolder,
      stageDependentArray: cleanedDepentHolder,
    })
  );
  setStageArray([...arrayHolder]);
};

  // Code for Movment of Service/Question
  const moveService = (from, to) => {
    let tempArr = stageArray
    tempArr[from]['sortOrder'] = to
    tempArr[to]['sortOrder'] = from
    if (to != -1 && from < stageArray.length) {
      setStageArray(move(tempArr, from, to))
    }
  }

  // Code for Sorting of Questions  
  const moveQuestion = (stageIndex, dataElementOrignalName, direction) => {

    let updatedStageArray; // Variable to store the updated stage array

    setStageArray((prevStageArray) => {
      updatedStageArray = prevStageArray.map((stage, idx) => {
        if (idx === stageIndex) {
          let updatedDataElements;
          let targetSectionIndex = null;


          // Check if the question belongs to a specific section
          const targetSection = stage.programStageSections?.find((section, index) => {
            if (section.dataElements.some((el) => el.description === dataElementOrignalName)) {
              targetSectionIndex = index;
              return true;
            }
            return false;
          });

          if (targetSection) {
            updatedDataElements = [...targetSection.dataElements];
          } else {
            updatedDataElements = [...stage.dataelements];
          }

          // Find the index of the element to be moved
          const elementIndex = updatedDataElements.findIndex((el) => {
            return targetSection
              ? el.description === dataElementOrignalName // Use `description` for mapped questions
              : el.orignalname === dataElementOrignalName; // Use `orignalname` for unmapped questions
          });


          if (elementIndex === -1) {
            return stage;
          }

          // Calculate the new index
          const newIndex = direction === "up" ? elementIndex - 1 : elementIndex + 1;

          // Ensure the new index is within bounds
          if (newIndex >= 0 && newIndex < updatedDataElements.length) {
            // Swap elements
            const tempElement = updatedDataElements[elementIndex];
            updatedDataElements[elementIndex] = updatedDataElements[newIndex];
            updatedDataElements[newIndex] = tempElement;

            // Update sortOrder for consistency
            // updatedDataElements = updatedDataElements.map((item, index) => ({
            //   ...item,
            //   sortOrder: index + 1, // Ensure all elements have consistent sortOrder
            // }));                             
            const tempSortOrder = updatedDataElements[elementIndex].sortOrder;
            updatedDataElements[elementIndex].sortOrder = updatedDataElements[newIndex].sortOrder;
            updatedDataElements[newIndex].sortOrder = tempSortOrder;

            if (targetSection) {
              // Update the section's dataElements
              const updatedSections = [...stage.programStageSections];
              updatedSections[targetSectionIndex] = {
                ...targetSection,
                dataElements: updatedDataElements,
              };
              return { ...stage, programStageSections: updatedSections };
            } else {
              // Update the stage's dataElements
              return { ...stage, dataelements: updatedDataElements };
            }
          } else {
          }
        }
        return stage;
      });

      return updatedStageArray; // Return the updated array to setStageArray
    });

    // Use setTimeout to ensure updatedStageArray is captured after state update
    setTimeout(() => {

      // Update `userTemplate` to reflect the changes in `updatedStageArray`
      const updatedUserTemplate = { ...userTemplate };
      updatedUserTemplate.programstages[stageIndex] = {
        ...updatedUserTemplate.programstages[stageIndex],
        programStageSections: updatedStageArray[stageIndex].programStageSections,
        dataelements: updatedStageArray[stageIndex].dataelements,
      };

      // Dispatch the updated template to save the state for the database
      dispatch(setUserTemplate(updatedUserTemplate));
    }, 0);
  };

  const handleDeleteQuestion = (stageIndex, dataElementOrignalName, sectionIndex, dataElement, e) => {
    if (isSmartsetupDisabled(dataElement)) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    // Dependency check
    // const dependentRule = stageDependentArray.find(rule =>
    //   rule.dataelementname === dataElement.name && rule.stagename == dataElement.stagename && 
    //   rule.dependentdataelementnames.length > 0
    // );

    // if (dependentRule) {

    //   const childList = dependentRule.dependentdataelementnames
    //     ?.map(c => c.childdataelementname)
    //     .join(", ");

    //   Swal.fire({
    //     title: "Cannot Delete Question",
    //     html: `
    //       This question is used in dependency rules.<br/><br/>
    //       <b>Parent:</b> ${dependentRule.dataelementname}<br/>
    //       <b>Dependent Questions:</b> ${childList || "None"}<br/><br/>
    //       Please unmap the dependency first.
    //     `,
    //     icon: "warning",
    //     confirmButtonText: "OK",
    //     customClass: {
    //       confirmButton: "swal2-ok-btn",
    //     },
    //   });

    //   return;
    // }

  // Dependency check
  const parentRule = stageDependentArray.find(
    rule => rule.dataelementname === dataElement.name && rule.stagename == dataElement.stagename && rule.dependentdataelementnames.length > 0
  );

  const childRule = stageDependentArray.find(rule =>
    rule.dependentdataelementnames?.some(
      child => child.childdataelementname === dataElement.name && rule.stagename == dataElement.stagename
    )
  );

  if ((parentRule && parentRule.dataelementname) || (childRule && childRule.dataelementname)) {

    let message = "";

    // If question is parent
    if (parentRule) {
      const childList = parentRule.dependentdataelementnames
        ?.map(c => c.childdataelementname)
        .join(", ");

      message += `
          <b>This question is a parent dependency.</b><br/>
          <b>Child Questions:</b> ${childList || "None"}<br/><br/>
        `;
      }

      // If question is child
      if (childRule) {
        message += `
          <b>This question is dependent on:</b><br/>
          <b>Parent Question:</b> ${childRule.dataelementname}<br/><br/>
        `;
      }

      Swal.fire({
        title: "Cannot Delete Question",
        html: `
          ${message}
          Please unmap the dependency first.
        `,
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-ok-btn",
        },
      });

      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "Once this question is deleted, it cannot be restored!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let updatedStageArray;

        setStageArray((prevStageArray) => {
          updatedStageArray = prevStageArray.map((stage, idx) => {
            if (idx === stageIndex) {
              // Filter out the element matching the given `orignalname`
              const updatedDataElements = stage.dataelements.filter(
                (element) => element.orignalname !== dataElementOrignalName
              );

              return { ...stage, dataelements: updatedDataElements };
            }
            return stage;
          });

          return updatedStageArray;
        });

        // Synchronize `userTemplate` after state update
        setTimeout(() => {
          const updatedUserTemplate = { ...userTemplate };
          updatedUserTemplate.programstages[stageIndex] = {
            ...updatedUserTemplate.programstages[stageIndex],
            dataelements: updatedStageArray[stageIndex].dataelements,
          };

          // Also delete from programStageSections if it exists
          if (updatedUserTemplate.programstages[stageIndex].programStageSections &&
            updatedUserTemplate.programstages[stageIndex].programStageSections[sectionIndex]) {
            const updatedSectionDataElements = updatedUserTemplate.programstages[stageIndex]
              .programStageSections[sectionIndex].dataElements.filter(
                (element) => element.formName !== dataElementOrignalName
              );

            updatedUserTemplate.programstages[stageIndex]
              .programStageSections[sectionIndex].dataElements = updatedSectionDataElements;
          }

          // Dispatch the updated template
          dispatch(setUserTemplate(updatedUserTemplate));

        }, 0);

        Swal.fire({
          title: 'Deleted!',
          text: 'The question has been successfully deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-ok-btn',
          },
        });
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'The question was not deleted.',
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-ok-btn',
          },
        });
      }
    });
  };

  const handleDeleteSection = (sectionName, stageIndex) => {
    // Get the current stage
    const currentStage = stageArray[stageIndex];

    // Find the section to be deleted in the current stage's programStageSections
    const sectionToDelete = currentStage?.programStageSections?.find(
      section => section.name === sectionName || section.displayName === sectionName
    );

    // Check if section has any mapped data elements
    const hasDataElements = sectionToDelete &&
      sectionToDelete.dataElements &&
      sectionToDelete.dataElements.length > 0;

    if (hasDataElements) {
      // Show warning if section is not empty
      Swal.fire({
        title: 'Cannot Delete Section',
        text: 'Please make sure the section is empty before deleting. Remove all questions from this section first.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal2-ok-btn',
        },
      });
      return;
    }

    // If section is empty, show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the section "${sectionName}" from stage "${currentStage.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Create a copy of stageArray
        const updatedStageArray = stageArray.map((stage, idx) => {
          // Only update the current stage
          if (idx === stageIndex) {
            // Filter out the section to be deleted
            const updatedProgramStageSections = stage.programStageSections?.filter(
              section => section.name !== sectionName && section.displayName !== sectionName
            ) || [];

            return {
              ...stage,
              programStageSections: updatedProgramStageSections,
            };
          }
          return stage;
        });

        // Update state
        setStageArray(updatedStageArray);

        // Update current stage if it's the one being modified
        if (currentStage === stageArray[stageIndex]) {
          setCurrentStage(updatedStageArray[stageIndex]);
          setProgramStageSections(updatedStageArray[stageIndex]?.programStageSections);
        }

        // Update userTemplate
        const updatedUserTemplate = {
          ...userTemplate,
          programstages: updatedStageArray,
        };

        dispatch(setUserTemplate(updatedUserTemplate));

        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'The section has been successfully deleted from this stage.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-ok-btn',
          },
        });

        // Update sections dropdown if needed
        const updatedSections = updatedStageArray[stageIndex]?.programStageSections?.map(section => ({
          id: section.id,
          displayName: section.displayName,
        })) || [];
        setSections(updatedSections);
      }
    });
  };

  const handleMoveSection = (sectionName, stageIndex, direction) => {
    // Get the current stage
    const currentStage = stageArray[stageIndex];

    // Get all sections for this stage
    const sections = currentStage?.programStageSections || [];

    if (sections.length === 0) return;

    // Find the index of the section to move
    const sectionIndex = sections.findIndex(
      section => section.name === sectionName || section.displayName === sectionName
    );

    if (sectionIndex === -1) return;

    // Calculate the new index based on direction
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= sections.length) return;

    // Create a copy of stageArray
    const updatedStageArray = stageArray.map((stage, idx) => {
      // Only update the current stage
      if (idx === stageIndex) {
        // Create a copy of sections array
        const updatedSections = [...sections];

        // Swap the sections
        const temp = updatedSections[sectionIndex];
        updatedSections[sectionIndex] = updatedSections[newIndex];
        updatedSections[newIndex] = temp;

        // Update sortOrder for all sections based on their new positions
        const sectionsWithUpdatedSortOrder = updatedSections.map((section, index) => ({
          ...section,
          sortOrder: index,
        }));

        return {
          ...stage,
          programStageSections: sectionsWithUpdatedSortOrder,
        };
      }
      return stage;
    });

    // Update state
    setStageArray(updatedStageArray);

    // Update current stage if it's the one being modified
    if (currentStage === stageArray[stageIndex]) {
      setCurrentStage(updatedStageArray[stageIndex]);
      setProgramStageSections(updatedStageArray[stageIndex]?.programStageSections);
    }

    // Update userTemplate
    const updatedUserTemplate = {
      ...userTemplate,
      programstages: updatedStageArray,
    };

    dispatch(setUserTemplate(updatedUserTemplate));

    // Update sections dropdown if needed
    const updatedSections = updatedStageArray[stageIndex]?.programStageSections?.map(section => ({
      id: section.id,
      displayName: section.displayName,
    })) || [];
    setSections(updatedSections);
  };


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
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
        <Accordion defaultActiveKey={defaultActiveKey} key={`elm_0`}>
          {stageArray.map((stage, stageIndex) => (
            <Card key={`stage-${stageIndex}-${stageRenderKey}`}>
              <Card.Header className="formtabletitle">
                <Row className="w-100 no-gutters">
                  <Col lg={7}>
                    <Accordion.Toggle
                      onClick={() => setDefaultActiveKey(stageIndex.toString())}
                      className="formtableheader"
                      as={Button}
                      variant="link"
                      eventKey={stageIndex.toString()}
                    >
                      <i
                        className={`fas mr-2 ${defaultActiveKey === stageIndex.toString() ? "fa-minus" : "fa-plus"
                          }`}
                      ></i>
                      {stage.name}
                    </Accordion.Toggle>
                  </Col>
                  <Col lg={5}>
                    <ul className="float-right define-services-tools d-inline m-0 p-0">
                      <li className="d-inline">

                        {stage.id && storeState.user.isEdit ?
                          <>
                            {/* <Accordion.Toggle
                              onClick={() => setDefaultActiveKey(stageIndex.toString())}
                              className="formtableheader"
                              as={Button}
                              variant="link"
                              eventKey={stageIndex.toString()}
                            >
                              <i
                                className={`fas mr-2 ${defaultActiveKey === stageIndex.toString() ? "fa-eye-slash" : "fa-eye"
                                  }`}
                              ></i>
                            </Accordion.Toggle> */}
                            <i
                              title="Add New Section"
                              class="fa-solid fa-circle-plus"
                              onClick={() => {
                                setDataVariableToggle(false)
                                setDeleteVariableToggle(false)
                                setRenderMobileViewToggle(false)
                                setIsEditStage(false)
                                setformToggle(false)
                                setRenderSectionToggle(false)
                                setRenderSubSection(false)
                                setaddNewSectionToggle(true)
                                setCurrentStage(stage)
                                setSelectedSection('')
                                setSelectedDataElements([])
                              }}
                            ></i>
                            {/* <i
                              title="Configure Sub-Section"
                              class="fa-solid fa-indent"
                              onClick={() => {
                                setDataVariableToggle(false)
                                setDeleteVariableToggle(false)
                                setRenderMobileViewToggle(false)
                                setaddNewSectionToggle(false)
                                setRenderSectionToggle(false)
                                setRenderSubSection(true)
                                setCurrentStage(stage)
                                getSubSection()
                              }} ></i> */}
                            <i
                              title="Configure Section"
                              class="fa-solid fa-sliders"
                              onClick={() => {
                                setStageObject(stage)
                                setRenderSectionToggle(true)
                                setDataVariableToggle(false)
                                setDeleteVariableToggle(false)
                                setIsEditStage(false)
                                setformToggle(false)
                                setaddNewSectionToggle(false)
                                setRenderMobileViewToggle(false)
                                setCurrentStage(stage)
                                setaddNewSectionToggle(false)
                                setRenderSubSection(false)
                                setSelectedSection('')
                                setSelectedDataElements([])
                              }} ></i>
                          </>
                          : <></>
                        }

                        {/* <i
                          onClick={() => {
                            setStageObject(stage)
                            setformToggle(true)
                            setDataVariableToggle(false)
                            setIsEditStage(true)
                            setRenderMobileViewToggle(false)
                            setaddNewSectionToggle(false)
                            setRenderSectionToggle(false)
                            setDeleteVariableToggle(false)
                            setRenderSubSection(false)
                            setaddNewSectionToggle(false)

                          }}
                          title="Edit Stage Name" aria-hidden="true" className="fas fa-edit"></i> */}
                        <i title="Add Question" onClick={() => {
                          setRenderSubSection(false)
                          setRenderMobileViewToggle(false)
                          setformToggle(false)
                          setaddNewSectionToggle(false)
                          setRenderSectionToggle(false)
                          setIsEditQuestion(false)
                          setIsEditStage(false)
                          setDeleteVariableToggle(false)
                          setQuestionObject({ stagename: stage.name, mandatory: false, name: '', attributeRefType: '' })
                          setOptionsArray([])
                          setRenderSubSection(false)
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
                          setOptionValuesLocaleObject(tempArr)
                          setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null)
                          setDataVariableToggle(true)
                          setCurrentDataelement(stage.dataelements)
                        }} aria-hidden="true" className="fa fa-plus mr-3"></i>
                        {/* Hiding Add from deleted list functionality  */}
                        {/* {storeState.user.isEdit ? <>
                          <i onClick={() => {
                            setStageObject(stage)
                            setRenderMobileViewToggle(false)
                            setformToggle(false)
                            setIsEditQuestion(false)
                            setIsEditStage(false)
                            setDataVariableToggle(false)
                            setDeleteVariableToggle(true)
                          }} title="Add From Deleted List" 
                          className="fa-solid fa-list"></i>
                          </> : null} */}
                        {/* <i title="Move Up" onClick={() => moveService(stageIndex, stageIndex - 1)} className="fas fa-long-arrow-alt-up"></i>
                        <i title="Move Down" onClick={() => moveService(stageIndex, stageIndex + 1)} className="fas fa-long-arrow-alt-down"></i> */}

                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card.Header>
              <Accordion.Collapse eventKey={stageIndex.toString()}>
                <Card.Body className="formstables">
                  {stage.programStageSections?.length > 0 ? (
                    <>

                      <Accordion defaultActiveKey={-1}>
                        {stage.programStageSections.map((section, sectionIndex) => (
                          <Card key={`sec_${sectionIndex}`}>
                            <Card.Header className="formtabletitle ml-3">
                              <Row className="w-100 no-gutters">
                                <Col lg={9}>
                                  <Accordion.Toggle
                                    onClick={() => setDefaultActiveKey(`${stageIndex}-${sectionIndex}`)}
                                    className="formtableheader"
                                    as={Button}
                                    variant="link"
                                    eventKey={`${stageIndex}-${sectionIndex}`}
                                  >
                                    <i className={`fas mr-2 ${defaultActiveKey == `${stageIndex}-${sectionIndex}` ? "fa-minus" : "fa-plus"}`}></i> {section.name}
                                  </Accordion.Toggle>
                                </Col>
                                <Col lg={3}>
                                  {/* <ul className="float-right define-services-tools d-inline m-0 p-0 justify-content-center"> */}

                                  <span
                                    onClick={() => handleDeleteSection(section.name || section.displayName, stageIndex)}
                                    style={{ cursor: 'pointer', justifyContent: 'center', float: 'right', marginRight: '10px' }}
                                    title="Delete Section"
                                  >
                                    <i aria-hidden="true" className="fa fa-trash"></i>
                                  </span>
                                  {/* Move Up Button - Only shows if NOT first section */}
                                  {sectionIndex !== 0 && (
                                    <span
                                      onClick={() => handleMoveSection(section.name || section.displayName, stageIndex, 'up')}
                                      style={{
                                        cursor: 'pointer',
                                        justifyContent: 'center',
                                        float: 'right',
                                        marginRight: '10px'
                                      }}
                                      title="Section Move Up"
                                    >
                                      <i aria-hidden="true" className="fas fa-long-arrow-alt-up"></i>
                                    </span>
                                  )}

                                  {/* Move Down Button - Only shows if NOT last section */}
                                  {sectionIndex !== (stage.programStageSections?.length - 1) && (
                                    <span
                                      onClick={() => handleMoveSection(section.name || section.displayName, stageIndex, 'down')}
                                      style={{
                                        cursor: 'pointer',
                                        justifyContent: 'center',
                                        float: 'right',
                                        marginRight: '10px'
                                      }}
                                      title="Section Move Down"
                                    >
                                      <i aria-hidden="true" className="fas fa-long-arrow-alt-down"></i>
                                    </span>
                                  )}


                                  {/* </ul> */}
                                </Col>
                              </Row>
                            </Card.Header>
                            <Accordion.Collapse eventKey={`${stageIndex}-${sectionIndex}`}>
                              <Card.Body className="formstables ml-3">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th width="30%">Questions</th>
                                      <th>Type</th>
                                      <th>Mandatory</th>
                                      <th>Core Type</th>
                                      <th width="10%" className="text-center">Actions</th>
                                      <th width="15%" className="text-center">Sequence</th>
                                    </tr>
                                  </thead>
                                  <tbody className="formsbody">

                                    {section?.dataElements && section.dataElements.length > 0 ? section.dataElements.map((element, elementIndex) => {
                                      const dataElement = stage.dataelements.find(de => de.orignalname == element.description);
                                      if (!dataElement || dataElement.isCheckboxOption) {
                                        return null;
                                      }
                                      return dataElement ? (
                                        <tr className={checkServiceQuestionForDisable(stage.name, dataElement.name)} key={`elm2_${elementIndex}`}>
                                          <td>{dataElement.name}</td>
                                          <td className="texttablestyle">{dataElement.attributeRefType}</td>
                                          <td className="texttablestyle">{dataElement.mandatory == 'true' || dataElement.mandatory == true ? "Yes" : "No"}</td>
                                          <td>{getCoreTypeValue(dataElement)}</td>
                                          <td className="td-actions justify-content-center">
                                            <button
                                              onClick={(e) => {
                                                if (isSmartsetupDisabled(dataElement)) {
                                                  e.stopPropagation();
                                                  e.preventDefault();
                                                  return;
                                                }

                                                // ✅ FIX: Reset modal state FIRST
                                                setDataVariableToggle(false);
                                                setIsEditQuestion(false);
                                                setOptionsArray([]);
                                                setOptionValuesLocaleArray([]);
                                                setOptionValuesLocaleObject({});

                                                // ✅ Use setTimeout to properly reset state
                                                setTimeout(() => {
                                                  setTempKey(Math.random());

                                                  // ✅ FIX: Read parentQuestion from current Redux state
                                                  const latestStage = currentUserTemplate.programstages.find(
                                                    (s) => s.name === stage.name
                                                  );
                                                  const latestDataElement = latestStage?.dataelements?.find(
                                                    (de) => de.orignalname === dataElement.orignalname
                                                  );

                                                  let parentQuestionValue;
                                                  if (
                                                    latestDataElement?.parentQuestion !== undefined &&
                                                    latestDataElement?.parentQuestion !== null &&
                                                    latestDataElement?.parentQuestion !== ""
                                                  ) {
                                                    parentQuestionValue = latestDataElement.parentQuestion;
                                                  }

                                                  setQuestionObject({
                                                    ...dataElement,
                                                    parentQuestion: parentQuestionValue,
                                                    stagename: stage.name,
                                                  });

                                                  console.log("Editing question (mapped):", {
                                                    name: dataElement.name,
                                                    parentQuestion: parentQuestionValue,
                                                    dependentValue: dataElement.dependentValue,
                                                  });

                                                  dataElement.stagename = stage.name;

                                                  // Languages
                                                  let tempArr = userInputs.languages.map((el) => ({
                                                    locale: el.value,
                                                    property: "NAME",
                                                    value: "",
                                                  }));

                                                  if (!Array.isArray(dataElement.languages) && dataElement.languages) {
                                                    if (dataElement.languages.length === 0) {
                                                      setLanguagesArray(tempArr);
                                                    } else {
                                                      tempArr.forEach((el) => {
                                                        dataElement.languages.forEach((lang) => {
                                                          if (el.locale === lang.locale) {
                                                            el.value = lang.value;
                                                          }
                                                        });
                                                      });
                                                      setLanguagesArray(tempArr);
                                                    }
                                                  } else {
                                                    // ✅ FIX: Always set tempArr if languages is undefined/empty
                                                    setLanguagesArray(tempArr);
                                                  }
                                                  // Options - checkbox options
                                                  if (dataElement.attributeRefType === "optionset") {
                                                    let temp = [];
                                                    if (Array.isArray(dataElement.optionvaluesLocale)) {
                                                      let localHolder = [];
                                                      dataElement.optionvalues.forEach((option, idx) => {
                                                        let tempObj = {};
                                                        let temparr = [];
                                                        userInputs.languages.forEach((el) => {
                                                          const found = _.findWhere(
                                                            dataElement.optionvaluesLocale[idx][option],
                                                            { locale: el.value }
                                                          );
                                                          if (found) {
                                                            temparr.push(found);
                                                          } else {
                                                            temparr.push({
                                                              locale: el.value,
                                                              property: "NAME",
                                                              value: "",
                                                            });
                                                          }
                                                        });
                                                        tempObj[option] = temparr;
                                                        localHolder.push(tempObj);
                                                      });
                                                      dataElement.optionvaluesLocale = localHolder;
                                                      setOptionValuesLocaleArray(localHolder);
                                                    } else {
                                                      dataElement.optionvalues.forEach((option) => {
                                                        let obj = {};
                                                        let tempArr2 = userInputs.languages.map((lang) => ({
                                                          locale: lang.value,
                                                          property: "NAME",
                                                          value: "",
                                                        }));
                                                        if (
                                                          Object.keys(dataElement.optionvaluesLocale).length !== 0 &&
                                                          dataElement.optionvaluesLocale[option].length !== 0
                                                        ) {
                                                          obj[option] = tempArr2;
                                                        } else {
                                                          tempArr2.forEach((elm) => {
                                                            const matched = dataElement.optionvaluesLocale[
                                                              option
                                                            ].filter((el) => el.locale === elm.locale);
                                                            if (matched.length !== 0) {
                                                              elm.value = matched[0].value;
                                                            }
                                                          });
                                                          obj[option] = tempArr2;
                                                        }
                                                        temp.push(obj);
                                                      });
                                                      setOptionValuesLocaleArray(temp);
                                                    }
                                                    setOptionsArray(dataElement.optionvalues);
                                                  } else if (dataElement.attributeRefType === "checkbox") {
                                                    setOptionsArray(dataElement.checkboxoption);
                                                    // Initialize options structure if missing
                                                    if (!dataElement.options || dataElement.options.length === 0) {
                                                      dataElement.options = dataElement.checkboxoption.map((opt, idx) => ({
                                                        name: opt,
                                                        isCheckboxOption: true,
                                                        sortOrder: idx + 1,
                                                      }));
                                                    }
                                                  } else {
                                                    setOptionsArray([]);
                                                  }

                                                  setQuestionObject(dataElement);
                                                  setKey(
                                                    userInputs && userInputs.languages ? userInputs.languages[0].value : null
                                                  );
                                                  setformToggle(false);
                                                  setIsEditStage(false);
                                                  setDataVariableToggle(true); // ✅ Open modal AFTER state is set
                                                  setIsEditQuestion(true);
                                                  setCurrentDataelement(stage.dataelements);

                                                  window.scrollTo({
                                                    top: 200,
                                                    behavior: "smooth",
                                                  });

                                                  setRenderSectionToggle(false);
                                                  setaddNewSectionToggle(false);
                                                }, 50); // ✅ Small delay ensures state is cleared
                                              }}
                                              type="button"
                                              title="Edit Question"
                                              className="btn btn-info btnEdit"
                                              disabled={isSmartsetupDisabled(dataElement)}
                                              style={{
                                                cursor: isSmartsetupDisabled(dataElement) ? "default" : "pointer",
                                                opacity: isSmartsetupDisabled(dataElement) ? 0.5 : 1,
                                              }}
                                            >
                                              <i
                                                className="fa fa-pencil-alt"
                                                style={{
                                                  cursor: isSmartsetupDisabled(dataElement) ? "default" : "pointer",
                                                  opacity: isSmartsetupDisabled(dataElement) ? 0.5 : 1,
                                                }}
                                              ></i>
                                            </button>

                                            <button
                                              onClick={(e) =>
                                                handleDeleteQuestion(stageIndex, dataElement.orignalname, sectionIndex, dataElement, e)
                                              }
                                              type="button"
                                              title="Delete Question"
                                              className={`btn btn-danger btn_Edit${isSmartsetupDisabled(dataElement) ? " disabled-in-smartsetup" : ""}`}
                                              disabled={isSmartsetupDisabled(dataElement)}
                                              style={{
                                                cursor:
                                                  isSmartsetupDisabled(dataElement)
                                                    ? "default"
                                                    : "pointer",
                                                opacity:
                                                  isSmartsetupDisabled(dataElement)
                                                    ? 0.5
                                                    : 1,
                                              }}
                                            >
                                              <i className="fas fa-trash" style={{
                                                cursor:
                                                  isSmartsetupDisabled(dataElement)
                                                    ? "default"
                                                    : "pointer",
                                                opacity:
                                                  isSmartsetupDisabled(dataElement)
                                                    ? 0.5
                                                    : 1,
                                              }}></i>
                                            </button>
                                          </td>
                                          <td className="text-center sequence-column">
                                            <span title="Move Up">
                                              <i
                                                onClick={() => {
                                                  if (!isSmartsetupDisabled(dataElement) && elementIndex !== 0) {
                                                    moveQuestion(stageIndex, dataElement.orignalname, "up");
                                                  }
                                                }}
                                                disabled={isSmartsetupDisabled(dataElement) || (elementIndex === 0)}
                                                style={{
                                                  cursor:
                                                    isSmartsetupDisabled(dataElement) || (elementIndex === 0)
                                                      ? "default"
                                                      : "pointer",
                                                  opacity:
                                                    isSmartsetupDisabled(dataElement) || (elementIndex === 0)
                                                      ? 0.5
                                                      : 1,
                                                }}
                                                className="fas fa-long-arrow-alt-up"
                                              ></i>
                                            </span>
                                            <span title="Move Down">
                                              <i
                                                style={{
                                                  cursor:
                                                    isSmartsetupDisabled(dataElement) ||
                                                      elementIndex === section?.dataElements.length - 1
                                                      ? "default"
                                                      : "pointer",
                                                  opacity:
                                                    isSmartsetupDisabled(dataElement) ||
                                                      elementIndex === section?.dataElements.length - 1
                                                      ? 0.5
                                                      : 1,
                                                }}
                                                disabled={isSmartsetupDisabled(dataElement)}
                                                onClick={() => {
                                                  if (
                                                    !isSmartsetupDisabled(dataElement) &&
                                                    elementIndex !== section?.dataElements.length - 1
                                                  ) {
                                                    moveQuestion(stageIndex, dataElement.orignalname, "down");
                                                  }
                                                }}
                                                className="fas fa-long-arrow-alt-down"
                                              ></i>
                                            </span>
                                          </td>
                                        </tr>
                                      ) : null;
                                    }) :
                                      <tr>
                                        <td colSpan={7} className="text-center py-4">
                                          No questions configured for this section
                                        </td>
                                      </tr>}

                                  </tbody>
                                </table>
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        ))}
                      </Accordion>

                      {/* Separate Accordion for UNMAPPED ELEMENTS (for each stage)--> */}
                      <Accordion defaultActiveKey={"sec_unmapped"}>
                        <Card key={`sec_unmapped`}>
                          <Card.Header className="formtabletitle ml-3">
                            <Row className="w-100 no-gutters">
                              <Col lg={9}>
                                <Accordion.Toggle
                                  onClick={() => setDefaultActiveKey(`sec_unmapped`)}
                                  className="formtableheader"
                                  as={Button}
                                  variant="link"
                                  eventKey={`sec_unmapped`}
                                >
                                  <i className={`fas mr-2 ${defaultActiveKey === `sec_unmapped` ? "fa-minus" : "fa-plus"}`}></i> Unmapped Questions
                                </Accordion.Toggle>
                              </Col>
                              <Col lg={3}>
                                <ul className="float-right define-services-tools d-inline m-0 p-0">
                                </ul>
                              </Col>
                            </Row>
                          </Card.Header>
                          <Accordion.Collapse eventKey={`sec_unmapped`}>
                            <Card.Body className="formstables ml-3">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th width="30%">Questions</th>
                                    <th>Type</th>
                                    <th>Mandatory</th>
                                    <th>Core Type</th>
                                    <th width="10%" className="text-center">Actions</th>
                                    {/*  <th width="15%" className="text-center">Sequence</th>*/}
                                  </tr>
                                </thead>
                                <tbody className="formsbody">
                                  {/* First filtering the elements on the basis of programStageSectionFlag and then mapping them to the table */}
                                  {stage.dataelements.filter(de => de.programStageSectionFlag === false && !de.isCheckboxOption).map((dataElement, elementIndex) => {
                                    return <tr className={checkServiceQuestionForDisable(stage.name, dataElement.name)} key={`elm2_${elementIndex}`}>
                                      <td>{dataElement.name}</td>
                                      <td className="texttablestyle">{dataElement.attributeRefType}</td>
                                      <td className="texttablestyle">{dataElement.mandatory == 'true' || dataElement.mandatory == true ? "Yes" : "No"}</td>
                                      <td>{getCoreTypeValue(dataElement)}</td>
                                      <td className="td-actions justify-content-center">
                                        <button
                                          onClick={(e) => {
                                            if (isSmartsetupDisabled(dataElement)) {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              return;
                                            }

                                            // ✅ FIX: Reset modal state FIRST
                                            setDataVariableToggle(false);
                                            setIsEditQuestion(false);
                                            setOptionsArray([]);
                                            setOptionValuesLocaleArray([]);
                                            setOptionValuesLocaleObject({});

                                            // ✅ Use setTimeout to properly reset state
                                            setTimeout(() => {
                                              setTempKey(Math.random());

                                              let parentQuestionValue;
                                              if (typeof dataElement.parentQuestion === "number") {
                                                parentQuestionValue = dataElement.parentQuestion;
                                              } else if (
                                                dataElement.parentQuestion !== "" &&
                                                dataElement.parentQuestion !== undefined &&
                                                dataElement.parentQuestion !== null
                                              ) {
                                                const parentIdx = stage.dataelements.findIndex(
                                                  (el) => el.name === dataElement.parentQuestion
                                                );
                                                parentQuestionValue = parentIdx !== -1 ? parentIdx : "";
                                              }

                                              setQuestionObject({
                                                ...dataElement,
                                                parentQuestion: parentQuestionValue,
                                                stagename: stage.name,
                                              });

                                              console.log("Editing question (unmapped):", {
                                                name: dataElement.name,
                                                parentQuestion: parentQuestionValue,
                                                dependentValue: dataElement.dependentValue,
                                              });

                                              dataElement.stagename = stage.name;

                                              let tempArr = userInputs.languages.map((el) => ({
                                                locale: el.value,
                                                property: "NAME",
                                                value: "",
                                              }));

                                              if (!Array.isArray(dataElement.languages) && dataElement.languages) {
                                                if (dataElement.languages.length === 0) {
                                                  setLanguagesArray(tempArr);
                                                } else {
                                                  tempArr.forEach((el) => {
                                                    dataElement.languages.forEach((lang) => {
                                                      if (el.locale === lang.locale) {
                                                        el.value = lang.value;
                                                      }
                                                    });
                                                  });
                                                  setLanguagesArray(tempArr);
                                                }
                                              } else {
                                                // ✅ FIX: Always set tempArr if languages is undefined/empty
                                                setLanguagesArray(tempArr);
                                              }

                                              if (dataElement.attributeRefType === "optionset") {
                                                let temp = [];
                                                if (Array.isArray(dataElement.optionvaluesLocale)) {
                                                  let localHolder = [];
                                                  dataElement.optionvalues.forEach((option, idx) => {
                                                    let tempObj = {};
                                                    let temparr = [];
                                                    userInputs.languages.forEach((el) => {
                                                      const found = _.findWhere(
                                                        dataElement.optionvaluesLocale[idx][option],
                                                        { locale: el.value }
                                                      );
                                                      if (found) {
                                                        temparr.push(found);
                                                      } else {
                                                        temparr.push({
                                                          locale: el.value,
                                                          property: "NAME",
                                                          value: "",
                                                        });
                                                      }
                                                    });
                                                    tempObj[option] = temparr;
                                                    localHolder.push(tempObj);
                                                  });
                                                  dataElement.optionvaluesLocale = localHolder;
                                                  setOptionValuesLocaleArray(localHolder);
                                                } else {
                                                  dataElement.optionvalues.forEach((option) => {
                                                    let obj = {};
                                                    let tempArr2 = userInputs.languages.map((lang) => ({
                                                      locale: lang.value,
                                                      property: "NAME",
                                                      value: "",
                                                    }));
                                                    if (
                                                      Object.keys(dataElement.optionvaluesLocale).length !== 0 &&
                                                      dataElement.optionvaluesLocale[option].length !== 0
                                                    ) {
                                                      obj[option] = tempArr2;
                                                    } else {
                                                      tempArr2.forEach((elm) => {
                                                        const matched = dataElement.optionvaluesLocale[option].filter(
                                                          (el) => el.locale === elm.locale
                                                        );
                                                        if (matched.length !== 0) {
                                                          elm.value = matched[0].value;
                                                        }
                                                      });
                                                      obj[option] = tempArr2;
                                                    }
                                                    temp.push(obj);
                                                  });
                                                  setOptionValuesLocaleArray(temp);
                                                }
                                                setOptionsArray(dataElement.optionvalues);
                                              } else if (dataElement.attributeRefType === "checkbox") {
                                                setOptionsArray(dataElement.checkboxoption);
                                                if (!dataElement.options || dataElement.options.length === 0) {
                                                  dataElement.options = dataElement.checkboxoption.map((opt, idx) => ({
                                                    name: opt,
                                                    isCheckboxOption: true,
                                                    sortOrder: idx + 1,
                                                  }));
                                                }
                                              } else {
                                                setOptionsArray([]);
                                              }

                                              setQuestionObject(dataElement);
                                              setKey(
                                                userInputs && userInputs.languages ? userInputs.languages[0].value : null
                                              );
                                              setformToggle(false);
                                              setIsEditStage(false);
                                              setDataVariableToggle(true); // ✅ Open modal AFTER state is set
                                              setIsEditQuestion(true);
                                              setCurrentDataelement(stage.dataelements);

                                              window.scrollTo({
                                                top: 200,
                                                behavior: "smooth",
                                              });

                                              setRenderSectionToggle(false);
                                              setaddNewSectionToggle(false);
                                            }, 50); // ✅ Small delay ensures state is cleared
                                          }}
                                          type="button"
                                          title="Edit Question"
                                          className="btn btn-info btnEdit"
                                          disabled={isSmartsetupDisabled(dataElement)}
                                          style={{
                                            cursor: isSmartsetupDisabled(dataElement) ? "default" : "pointer",
                                            opacity: isSmartsetupDisabled(dataElement) ? 0.5 : 1,
                                          }}
                                        >
                                          <i
                                            className="fa fa-pencil-alt"
                                            style={{
                                              cursor: isSmartsetupDisabled(dataElement) ? "default" : "pointer",
                                              opacity: isSmartsetupDisabled(dataElement) ? 0.5 : 1,
                                            }}
                                          ></i>
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            handleDeleteQuestion(stageIndex, dataElement.orignalname, dataElement, e)
                                          }}
                                          disabled={isSmartsetupDisabled(dataElement)}
                                          style={{
                                            cursor:
                                              isSmartsetupDisabled(dataElement)
                                                ? "default"
                                                : "pointer",
                                            opacity:
                                              isSmartsetupDisabled(dataElement)
                                                ? 0.5
                                                : 1,
                                          }}
                                          type="button" title="Delete Question" className="btn btn-danger btn_Edit">
                                          <i className="fas fa-trash"
                                            disabled={isSmartsetupDisabled(dataElement)}
                                            style={{
                                              cursor:
                                                isSmartsetupDisabled(dataElement)
                                                  ? "default"
                                                  : "pointer",
                                              opacity:
                                                isSmartsetupDisabled(dataElement)
                                                  ? 0.5
                                                  : 1,
                                            }}></i>
                                        </button>
                                      </td>
                                      {/* <td className="text-center sequence-column">
                                        <span title="Move Up">
                                          <i onClick={() => moveQuestion(stageIndex, dataElement.orignalname, "up")} className="fas fa-long-arrow-alt-up"></i>
                                          <i
                                            style={{
                                              cursor: elementIndex === 0 ? "default" : "pointer",
                                              opacity: elementIndex === 0 ? 0.5 : 1,
                                            }}
                                            onClick={() => {
                                              moveQuestion(stageIndex, dataElement.orignalname, "up");
                                            }}
                                            className="fas fa-long-arrow-alt-up"
                                          ></i>
                                        </span>
                                        <span title="Move Down">
                                          <i
                                            onClick={() => moveQuestion(stageIndex, dataElement.orignalname, "down")}
                                            style={{
                                              cursor: elementIndex === stage?.dataelements.length - 1 ? "default" : "pointer",
                                              opacity: elementIndex === stage?.dataelements.length - 1 ? 0.5 : 1,
                                            }}
                                            className="fas fa-long-arrow-alt-down"
                                          ></i>
                                        </span>
                                      </td> */}
                                    </tr>
                                  })}
                                </tbody>
                              </table>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                      {/* <--Separate Accordion for UNMAPPED ELEMENTS (for each stage)*/}

                    </>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th width="30%">Questions</th>
                          <th>Type</th>
                          <th>Mandatory</th>
                          <th>Core Type</th>
                          <th width="10%" className="text-center">Actions</th>
                          <th width="15%" className="text-center">Sequence</th>
                        </tr>
                      </thead>
                      <tbody className="formsbody">
                        {stage.dataelements.map((dataElement, elementIndex) => (
                          <tr className={checkServiceQuestionForDisable(stage.name, dataElement.name)} key={`elm2_${elementIndex}`}>
                            <td>{dataElement.name}</td>
                            <td className="texttablestyle">{dataElement.attributeRefType}</td>
                            <td className="texttablestyle">{dataElement.mandatory == 'true' || dataElement.mandatory == true ? "Yes" : "No"}</td>
                            <td>{getCoreTypeValue(dataElement)}</td>
                            <td className="td-actions justify-content-center">
                              <button
                                onClick={(e) => {
                                  if (isSmartsetupDisabled(dataElement)) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                  }
                                  dataElement.stagename = stage.name;
                                  let tempArr = [];
                                  userInputs.languages.map(el => {
                                    tempArr.push({
                                      locale: el.value,
                                      property: "NAME",
                                      value: ""
                                    });
                                  });
                                  if (!Array.isArray(dataElement.languages)) {
                                    dataElement.languages = [];
                                  }
                                  if (dataElement.languages.length === 0) {
                                    setLanguagesArray(tempArr);
                                  } else {
                                    tempArr.map(el => {
                                      dataElement.languages.map(lang => {
                                        if (el.locale === lang.locale) {
                                          el.value = lang.value;
                                        }
                                      });
                                    });
                                    setLanguagesArray(tempArr);
                                  }
                                  if (dataElement.attributeRefType === 'optionset') {
                                    let temp = [];
                                    if (Array.isArray(dataElement.optionvaluesLocale)) {
                                      let localHolder = [];
                                      dataElement.optionvalues.map((option, idx) => {
                                        let tempObj = {};
                                        let temparr = [];
                                        userInputs.languages.map(el => {
                                          if (_.findWhere(dataElement.optionvaluesLocale[idx][option], { 'locale': el.value })) {
                                            temparr.push(_.findWhere(dataElement.optionvaluesLocale[idx][option], { 'locale': el.value }));
                                          } else {
                                            temparr.push({ "locale": el.value, "property": "NAME", "value": "" });
                                          }
                                        });
                                        tempObj[option] = temparr;
                                        localHolder.push(tempObj);
                                      });
                                      dataElement.optionvaluesLocale = localHolder;
                                      setOptionValuesLocaleArray([]);
                                      setOptionValuesLocaleArray(localHolder);
                                    } else {
                                      dataElement.optionvalues.map(option => {
                                        if (Object.keys(dataElement.optionvaluesLocale).length === 0 || dataElement.optionvaluesLocale[option].length === 0) {
                                          let obj = {};
                                          obj[option] = userInputs.languages.map((lang) => {
                                            return {
                                              "locale": lang.value,
                                              "property": "NAME",
                                              "value": ""
                                            };
                                          });
                                          temp.push(obj);
                                        } else {
                                          let obj = {};
                                          let tempArr = userInputs.languages.map((lang) => {
                                            return {
                                              "locale": lang.value,
                                              "property": "NAME",
                                              "value": ""
                                            };
                                          });
                                          tempArr.map(elm => {
                                            var matched = dataElement.optionvaluesLocale[option].filter(el => el.locale === elm.locale);
                                            if (matched.length > 0) {
                                              elm.value = matched[0].value;
                                            }
                                          });
                                          obj[option] = tempArr;
                                          temp.push(obj);
                                        }
                                        setOptionValuesLocaleArray([]);
                                        setOptionValuesLocaleArray(temp);
                                      });
                                    }
                                  }
                                  dataElement.attributeRefType === 'optionset' ? setOptionsArray(dataElement.optionvalues) : (dataElement.attributeRefType === 'checkbox' ? setOptionsArray(dataElement.checkboxoption) : setOptionsArray([]));
                                  setQuestionObject(dataElement);
                                  setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null);
                                  setformToggle(false);
                                  setIsEditStage(false);
                                  setDataVariableToggle(true);
                                  setIsEditQuestion(true);
                                  setCurrentDataelement(stage.dataelements);
                                  window.scrollTo({
                                    top: 200,
                                    behavior: 'smooth',
                                  })
                                  setRenderSectionToggle(false)
                                  setaddNewSectionToggle(false)
                                }}
                                type="button" title="Edit Question" className="btn btn-info btn_Edit">
                                <i className="fa fa-pencil-alt"></i>
                              </button>
                              <button
                                onClick={() => {
                                  let tempHolder = [...stageArray];
                                  let tempdeletedElementArray = [...deletedElementArray];
                                  tempHolder[stageIndex].dataelements.splice(elementIndex, 1);
                                  dataElement["value"] = dataElement.dataElementId;
                                  dataElement["label"] = dataElement.name;
                                  tempdeletedElementArray.push(dataElement);
                                  setDeletedElementArray(tempdeletedElementArray);
                                  setStageArray(tempHolder);
                                }}
                                type="button" title="Delete Question" className="btn btn-danger btn_Edit">
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                            <td className="text-center sequence-column">
                              <span title="Move Up">
                                <i onClick={() => moveQuestion(stageIndex, dataElement.orignalname, "up")} className="fas fa-long-arrow-alt-up"></i>
                              </span>
                              <span title="Move Down">
                                <i onClick={() => moveQuestion(stageIndex, dataElement.orignalname, "down")} className="fas fa-long-arrow-alt-down"></i>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>


      </>
    )
  }
  const getProgramTemplate = (data) => {
    dispatch(setLoader(true))
    API.get(`dataStore/template/programtemplate`).then((res) => {
      dispatch(setLoader(false))
      if (res.status === 200) {
        if (data) {
          res.data.programstages = data.data.programstages
          res.data.trackedentityattributes = data.data.trackedentityattributes
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
          res.data["programSections"] = data.data.programSections;
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
  const getDependency = async (data, userTemplate) => {
    console.log("🔄 getDependency called", userTemplate);
    let programuid = data.programdetails.programuid;
    var programRules, programRuleVariables, stageDependentArray = [];
    var attributedependentquestions = [];

    try {
      // Fetch program rule variables
      const variablesResponse = await API.get(
        `programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet&paging=false`
      );
      console.log("✅ Fetched program rule variables");
      programRuleVariables = variablesResponse.data.programRuleVariables;

      // Fetch program rules
      const rulesResponse = await API.get(
        `programRules?filter=program.id:eq:${programuid}&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false`
      );
      console.log("✅ Fetched program rules");
      programRules = rulesResponse.data.programRules;

      // STEP 1: Process dependencies for STAGES
      programRuleVariables.forEach((variable) => {
        if (variable.program.id == programuid) {
          if (
            variable.programRuleVariableSourceType ==
            "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE"
          ) {
            let temp = {};
            temp["dependentdataelementnames"] = [];
            let hasValidRule = false;

            programRules.forEach((rule) => {
              if (rule.condition && rule.condition.includes("!=")) {
                const match = rule.condition.match(/\{(.*?)\}/);
                if (match && match[1] == variable.displayName) {
                  hasValidRule = true;
                  temp["variableName"] = variable.displayName;
                  temp["dataElementId"] = variable.dataElement.id;
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");

                  const stageFromTemplate = _.find(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  });

                  temp["stagename"] = stageFromTemplate?.name;

                  let stageIndex = _.findIndex(userTemplate.programstages, {
                    id: variable?.programStage?.id,
                  });

                  // ✅ FIX: Match by dataElementId, NOT name
                  let parentIndex = _.findIndex(
                    userTemplate.programstages[stageIndex]?.dataelements,
                    { dataElementId: variable.dataElement.id }
                  );

                  console.log(`🔍 Parent lookup:`, {
                    variableName: variable.displayName,
                    dataElementId: variable.dataElement.id,
                    stageIndex,
                    parentIndex,
                    stageName: temp.stagename
                  });

                  rule.programRuleActions.forEach((action) => {
                    if (
                      action?.dataElement?.id &&
                      _.find(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      )
                    ) {
                      let objHolder = {};
                      const childElement = _.find(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      );

                      objHolder["childdataelementname"] = childElement?.name;
                      objHolder["actionId"] = action.id;
                      objHolder["dataElementId"] = action?.dataElement?.id;
                      temp["dependentdataelementnames"].push(objHolder);

                      // ✅ FIX: Match by dataElementId, NOT name
                      let childIndex = _.findIndex(
                        userTemplate.programstages[stageIndex]?.dataelements,
                        { dataElementId: action?.dataElement?.id }
                      );

                      if (childIndex !== -1 && parentIndex !== -1) {
                        console.log(`✅ Setting parentQuestion for child:`, {
                          childName: childElement?.name,
                          childIndex,
                          parentIndex,
                          dependentValue: temp.matchingvalue
                        });

                        userTemplate.programstages[stageIndex].dataelements[
                          childIndex
                        ]["parentQuestion"] = parentIndex;
                        userTemplate.programstages[stageIndex].dataelements[
                          childIndex
                        ]["dependentValue"] = temp.matchingvalue;
                      } else {
                        console.warn(`⚠️ Could not set parentQuestion:`, {
                          childIndex,
                          parentIndex,
                          childName: childElement?.name
                        });
                      }
                    }
                  });
                }
              }
            });

            if (hasValidRule && temp.dependentdataelementnames.length > 0) {
              stageDependentArray.push(temp);
            }
          } else if (
            variable.programRuleVariableSourceType == "TEI_ATTRIBUTE"
          ) {
            let temp = {};
            temp["dependentdataelementnames"] = [];
            let hasValidRule = false;

            programRules.forEach((rule) => {
              if (rule.condition && rule.condition.includes("!=")) {
                const match = rule.condition.match(/\{(.*?)\}/);
                if (match && match[1] == variable.displayName) {
                  hasValidRule = true;
                  temp["variableId"] = variable.id;
                  temp["dataelementname"] = variable.displayName.split("_")[1];
                  temp["ruleId"] = rule.id;
                  temp["matchingvalue"] = rule.condition
                    .split("!= ")[1]
                    .replaceAll("'", "");

                  // ✅ FIX: Match by trackedEntityAttributeId
                  let parentIndex = _.findIndex(
                    userTemplate.trackedentityattributes,
                    { trackedEntityAttributeId: variable.trackedEntityAttribute.id }
                  );

                  rule.programRuleActions.forEach((action) => {
                    if (
                      action?.trackedEntityAttribute?.id &&
                      _.find(userTemplate.trackedentityattributes, {
                        trackedEntityAttributeId: action.trackedEntityAttribute.id,
                      })
                    ) {
                      let objHolder = {};
                      const childAttr = _.find(
                        userTemplate.trackedentityattributes,
                        {
                          trackedEntityAttributeId: action.trackedEntityAttribute.id,
                        }
                      );

                      objHolder["childdataelementname"] = childAttr?.name;

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

            if (hasValidRule && temp.dependentdataelementnames.length > 0) {
              attributedependentquestions.push(temp);
            }
          }
        }
      });

      // STEP 2: Process checkboxes
      const checkboxPromises = [];

      userTemplate.programstages.forEach((stage) => {
        stage.dataelements.forEach((element) => {
          if (element.type == "boolean") {
            const promise = API.get(
              `dataElementGroups?filter=identifiable:token:${element.dhisname}&paging=false&fields=id,name,dataElements[id,displayName~rename(code),formName~rename(name)]`
            ).then((res) => {
              if (res.data.dataElementGroups.length > 0) {
                let currentGroup = _.findWhere(res.data.dataElementGroups, {
                  name: element.dhisname
                });

                if (currentGroup) {
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

                  currentGroup.dataElements.forEach((el) => {
                    stage.dataelements.forEach((ell) => {
                      if (ell.dataElementId == el.id) {
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

                  element.options = checkboxvalues;
                  console.log(`✅ Processed checkbox: ${element.dhisname}`);
                }
              }
            }).catch(err => {
              console.error(`❌ Error fetching checkbox for ${element.dhisname}:`, err);
            });

            checkboxPromises.push(promise);
          }
        });
      });

      // STEP 3: Wait for all checkboxes to load
      console.log(`⏳ Waiting for ${checkboxPromises.length} checkbox groups...`);
      await Promise.all(checkboxPromises);
      console.log(`✅ All checkboxes loaded`);

      // STEP 4: Assign to userTemplate and dispatch
      userTemplate["attributedependentquestions"] = attributedependentquestions;
      userTemplate["stageDependentArray"] = stageDependentArray;

      console.log(`✅ Final data:`, {
        stages: userTemplate.programstages?.length,
        stageDependencies: stageDependentArray.length,
        attributeDependencies: attributedependentquestions.length
      });

      dispatch(setUserTemplate(userTemplate));
      dispatch(setActiveTab("step1"));

      console.log(`✅ getDependency completed`);
    } catch (error) {
      console.error("❌ Error in getDependency:", error);
      // Still dispatch even on error
      userTemplate["attributedependentquestions"] = attributedependentquestions;
      userTemplate["stageDependentArray"] = stageDependentArray;
      dispatch(setUserTemplate(userTemplate));
      dispatch(setActiveTab("step1"));
    }
  };

  const publishCall = () => {
    // return
    userTemplate.programstages.map(dataset => {
      dataset.languages = []
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
      userTemplate['username'] = userDetails.username
      userTemplate['orgid'] = storeState.user.userDetails.organisationUnits[0].id
      userTemplate['programuid'] = storeState.programDetails.userTemplate.programuid
      userTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions
      console.log("userTemplate", userTemplate)
      //return
      console.log(userTemplate, "userTemplate")
      dispatch(setLoader(true))
      // swal({
      //   title: "Changes are saved, Publish is in progress!",
      //   content: "",
      //   icon: "success",
      //   button: "Ok",
      // })
      // dispatch(setActiveTab('step1'))
      // dispatch(setInProgressPublish(true))
      // API.put('/me', {"introduction":"InProgress"}).then(rs => {
      // }).catch(error => {
      //   console.log(error)
      // })
      API.post('tracker/smartsetup/edit', userTemplate).then(res => {
        dispatch(setLoader(false))
        // if (res.data.status == 'Success') {
        if (res.data.status == 'OK') {
          // toast.success('Program details updated sucessfully',
          //   {
          //     style: {
          //       border: '1px solid #44546A',
          //       padding: '16px',
          //     },
          //   }
          // )
          swal({
            title: "Success",
            text: "Program details updated sucessfully",
            icon: "success",
            button: "Close",
          }).then(function () {
            dispatch(setLoader(true))
            API.get('tracker/smartsetup/get/' + storeState.user.userDetails.organisationUnits[0].id).then(res => {
              dispatch(setInProgressPublish(false))
              dispatch(setLoader(false))
              dispatch(setEditFlag(true))
              getProgramTemplate(res.data)
            }).catch(error => {
              dispatch(setLoader(false))
              console.log(error)
            })
          });
        } else {
          toast.success('Program details updated sucessfully',
            {
              id: 'program-success',
              style: {
                border: '1px solid #44546A',
                padding: '16px',
              },
            }
          ).then(function () {
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
      userTemplate['username'] = userDetails.username
      userTemplate['attributedependentquestions'] = storeState.programDetails.userTemplate.attributedependentquestions
      // return
      dispatch(setLoader(true))
      // swal({
      //   title: "Changes are saved, Publish is in progress!",
      //   content: "",
      //   icon: "success",
      //   button: "Ok",
      // })
      // dispatch(setActiveTab('step1'))
      // dispatch(setInProgressPublish(true))
      // API.put('/me', {"introduction":"InProgress"}).then(rs => {
      // }).catch(error => {
      //   console.log(error)
      // })
      API.post('tracker/smartsetup/save', userTemplate).then(res => {
        dispatch(setLoader(false))
        if (res.status == 200) {
          setUserArray(res.data.data)
          swal({
            title: "Program details published sucessfully",
            content: "",
            icon: "success",
            button: "Ok",
          })
          // toast.success('Program details published sucessfully',
          //   {
          //     style: {
          //       border: '1px solid #44546A',
          //       padding: '16px',
          //     },
          //   }
          // )
          setShowModal(true)
        }
      }).catch(error => {
        // dispatch(setLoader(false))
        console.log(error)
      })
    }
  }

  // Code to handle sub section
  const subSectionformRef = useRef(null);
  const [renderSubSection, setRenderSubSection] = useState(false)
  const [subSectionData, setSubSectionData] = useState({})

  const subSectionObjectSchema = Yup.object().shape({
    name: Yup.string()
    // dataElements: Yup.array(),
  })

  const [subsections, setSubsections] = useState([]);
  const [deList, setDeList] = useState([]);
  const [currentDeList, setCurrentDeList] = useState([]);

  const handleSectionChangeNew = (e, setFieldValue) => {
    const selectedSection = e.target.value;
    setFieldValue("section_name", selectedSection); // update Formik value

    const selectedSubsections = subSectionData[selectedSection] || [];
    setSubsections(selectedSubsections.filter(sub => sub.subsectionName));
  };

  const handleSubsectionChange = (e, setFieldValue) => {
    const selectedSubsectionName = e.target.value;
    setFieldValue("subsection_name", selectedSubsectionName);
    const matched = subsections.find(sub => sub.subsectionName === selectedSubsectionName);
    console.log(matched, subSectionformRef.current.values, currentStage, "matched")
    let sectionObject = _.find(currentStage.programStageSections, { "displayName": subSectionformRef.current.values['section_name'] })
    let currenDe = sectionObject ? sectionObject.dataElements.map(attr => ({ value: attr.id, label: attr.description })) : []
    setCurrentDeList(currenDe)

    setDeList(matched ? matched.deList : []);
  };

  const getSubSection = () => {
    API.get('dataStore/subSections/sections').then(res => {
      setRenderSubSection(true)
      setSubSectionData(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  const ToggleSwitch = ({ field, form, label }) => (

    <div className="form-group togglebtn">
      <Form.Label className="label">{label}</Form.Label>
      <div className="form-check form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          id={field.name}
          checked={field.value}
          onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
        />
      </div>
    </div>
  );

  useEffect(() => {
  if (!isEditQuestion || !questionObject?.name) return;

  const stage = _.find(stageArray, {
    name: formRef?.current?.values?.stagename
  });

  if (!stage?.dataelements) return;

  const dependencyEntry = stageDependentArray.find(dep =>
    dep.dependentdataelementnames?.some(child =>
      child.childdataelementname === questionObject.name
    ) && dep.stagename === questionObject.stagename
  );

  if (!dependencyEntry) return;

  const parentIndex = stage.dataelements.findIndex(el =>
    dependencyEntry.dataElementId && el.dataElementId
      ? el.dataElementId === dependencyEntry.dataElementId
      : el.name === dependencyEntry.dataelementname
  );

  if (parentIndex !== -1) {
    formRef.current?.setFieldValue("parentQuestion", parentIndex);
  }

}, [stageArray, questionObject, isEditQuestion]);

  return (
    <>
      <div className="row">
        <div className="col-12 bnBtn">
          <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step2'))}>Back</button>
          <div>
            {/* Hiding Show Preview functionality  */}
            {/* <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
              onClick={() => {
                setformToggle(false)
                setIsEditQuestion(false)
                setIsEditStage(false)
                setDataVariableToggle(false)
                setDeleteVariableToggle(false)
                setRenderMobileViewToggle((prev) => !prev)
                setaddNewSectionToggle(false)
                setRenderSectionToggle(false)
              }} >  {renderMobileViewToggle ? 'Hide' : 'Show'}  Preview</button> */}
            {/* {storeState.user.isEdit ?
              <button onClick={(e) => {
                getSubSection()
                setformToggle(false)
                setIsEditQuestion(false)
                setIsEditStage(false)
                setDataVariableToggle(false)
                setDeleteVariableToggle(false)
                setaddNewSectionToggle(false)
                setRenderSectionToggle(false)
              }} tabIndex="-1" disabled={userDetails.username == "cdicadmin@imonitorplus.com" ? true : false} type="button" className="btn wizard-btnn  mr-2" >
                Configure Sub-section
              </button> : null} */}

            {/* <button onClick={() => { publishCall() }} tabIndex="-1" disabled={userDetails.username == "cdicadmin@imonitorplus.com" ? true : false} type="button" className="btn wizard-btnn  mr-4" > {storeState.user.isEdit ? "Update" : "Publish"}</button> */}
            {/* <div className="row mb-2 ml-2">
        <div className="col-12"> */}
            <button onClick={() => {
              setStageObject({
                name: '',
                isActive: true,
                dataelements: []
              })
              setformToggle(true)
              setDataVariableToggle(false)
              setRenderSectionToggle(false)
              setaddNewSectionToggle(false)
              setIsEditQuestion(false)
              setIsEditStage(false)
            }} type="button" data-toggle="tooltip" title="Add Form" className="btn wizard-btnb  mr-2"> Add Stage </button>
            {/* </div>
      </div> */}
            <button onClick={() => dispatch(setActiveTab('step4'))} tabIndex="-1" type="button" className="btn wizard-btnn  mr-4" > Next</button>
          </div>
        </div>
      </div>
      {/* <div className="row pt-1">
        <div className="col-12 bnBtn">
          <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step2'))}>Back</button>
          <div>
            <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
              onClick={() => {
                setformToggle(false)
                setIsEditQuestion(false)
                setIsEditStage(false)
                setDataVariableToggle(false)
                setDeleteVariableToggle(false)
                setRenderMobileViewToggle((prev) => !prev)
              }} >  {renderMobileViewToggle  ? 'Hide' :'Show' }  Preview</button>
            <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3"
              onClick={() => {
                userTemplate.programstages = stageArray
                let tempHolder = userTemplate
                tempHolder['age'] = lowAge + '-' + highAge
                tempHolder['stageDependentArray'] = stageDependentArray
                tempHolder['deletedObjects'].deletedDataElement = deletedElementArray
                tempHolder['isReferralWorkflow'] = currentRefFlowFlag
                dispatch(setUserTemplate(tempHolder))
                dispatch(setActiveTab('step4'))
                // console.log(stageArray,userTemplate)
              }}
            >Next</button>
          </div>
        </div>
      </div> */}


      <div className="row m-2 formcontent">
        <div className="col-8" key={`elm_1` + stageRenderKey}>
          {renderStages()}
          {/* <Row>
            <Col lg={6}>
              <div className="mt-2 form-group is-empty">
                Enable Referral Workflow
                <Form.Check
                  title="Enable Referral Workflow"
                  onChange={e => {
                    setCurrentRefFlowFlag(e.target.checked)
                  }}
                  type="switch"
                  id='1231231'
                  className="ml-2 d-inline"
                  checked={currentRefFlowFlag}
                />
              </div>
              {
                currentRefFlowFlag ?
                  <div className="mt-2 form-group is-empty">
                    <label class="form-label"><span>Select Stages to show in Referral</span></label>
                    <div class="form-inline">
                      {
                        storeState.user.isEdit ? <Select
                          className="basic-multi-select multiselect"
                          classNamePrefix="select"
                          isMulti
                          isDisabled={true}
                          defaultValue={stageInReferral}
                          options={stageLabelArray}
                          menuIsOpen={false}
                          onChange={onStageSelect}
                        /> : <Select
                          className="basic-multi-select multiselect"
                          classNamePrefix="select"
                          isMulti
                          defaultValue={stageInReferral}
                          options={stageLabelArray}
                          menuIsOpen={true}
                          onChange={onStageSelect}
                        />
                      }

                    </div>
                  </div> : null
              }
            </Col>
            <Col lg={6}>
              <div class="mt-2 form-group is-empty">
                <label class="form-label"><span>Eligible for TPT(Age in Years)</span></label>
                <div class="form-inline">
                  <input onChange={e => {
                    setLowAge(e.target.value)
                  }} type="number" value={lowAge} class="form-control if w-25" />
                  -
                  <input onChange={e => {
                    setHighAge(e.target.value)
                  }} type="number" value={highAge} class="form-control if w-25" />
                </div>
              </div>
            </Col>
          </Row> */}
        </div>
        {
          dataVariableToggle ?
            <div className="col-4">
              <Formik
                key={tempKey}
                innerRef={formRef}
                initialValues={questionObject}
                enableReinitialize
                validationSchema={questionObjectSchema}
                onSubmit={values => {
                  pushQuestionToStage(values)
                }}
              >
                {({ errors, touched, values }) => {
                // ✅ Compute once here — available to entire JSX below
                const hasParent =
                  values?.parentQuestion !== "" &&
                  values?.parentQuestion !== null &&
                  values?.parentQuestion !== undefined;

                const isMissingDependentValue =
                  !values?.dependentValue ||
                  values?.dependentValue.trim() === "" ||
                  values?.dependentValue.trim() === "-";

                const isSubmitDisabled = hasParent && isMissingDependentValue;
                
                return (
                  <FForm className="">
                    <Card>
                      <Card.Header className="regcardheader"> {isEditQuestion ? "Edit Question" : "Add Question"}
                        <span className="closesign" onClick={() => setDataVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                      </Card.Header>
                      <Card.Body className="regtabbody">
                        <Field name='stagename'>
                          {({ field, meta }) => {
                            return (
                              <>
                                <Form.Label className="label">* Select Stage</Form.Label>
                                <select
                                  type='text'
                                  className='form-control'
                                  {...field}
                                  disabled={true}
                                >
                                  <option value="">Select Stage</option>
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
                                              <option value="checkbox">Checkbox</option>
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
                                                      'sortOrder': id
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
                                              onClick={() => {
                                                let tempObj = { ...questionObject };

                                                // Initialize options array if it doesn't exist
                                                if (!tempObj['options']) {
                                                  tempObj['options'] = [];
                                                }

                                                // Handle deletion differently based on field type
                                                if (tempObj.attributeRefType === 'checkbox') {
                                                  // For CHECKBOX: Remove from options array completely
                                                  tempObj['options'].splice(id, 1);

                                                  // Also update checkboxoption array
                                                  if (tempObj['checkboxoption']) {
                                                    tempObj['checkboxoption'] = tempObj['checkboxoption'].filter((_, index) => index !== id);
                                                  }
                                                } else if (tempObj.attributeRefType === 'optionset') {
                                                  // For OPTIONSET: Mark with isdelete flag
                                                  if (tempObj['options'][id]) {
                                                    tempObj['options'][id]['isdelete'] = true;
                                                  }
                                                }

                                                setQuestionObject(tempObj);

                                                // Remove from UI display arrays
                                                const updatedOptionsArray = optionsArray.filter((_, index) => index !== id);
                                                setOptionsArray(updatedOptionsArray);

                                                const updatedLocaleArray = optionValuesLocaleArray.filter((_, index) => index !== id);
                                                setOptionValuesLocaleArray(updatedLocaleArray);
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
                                              {console.log(optionValuesLocaleArray, "optionValuesLocaleArray")}
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
                                                value={
                                                  optionValuesLocaleArray?.[id]?.[optionsArray[id]]?.[idx]?.value || ''
                                                }
                                                // value={optionValuesLocaleArray[id] ? (optionValuesLocaleArray[id][optionsArray[id]][idx] ? optionValuesLocaleArray[id][optionsArray[id]][idx].value : null) : null}
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
                                      (
                                        <div className="d-flex flex-column justify-content-center align-items-start w-100">
                                          <Button onClick={() => {
                                            setOptionsError("");  // Clear any previous error

                                            // Check if there's an empty option in optionsArray
                                            const hasEmptyOption = optionsArray.some(option => option.trim() === "");
                                            if (hasEmptyOption) {
                                              setOptionsError("Please fill in all options before adding a new one.");
                                              return;
                                            }
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
                                          }} className="addbtn btn-sm">Add Options</Button>
                                          {optionsError && <div className="text-danger mt-2">{optionsError}</div>}
                                        </div>

                                      ) : null
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
                                      value={true}
                                      checked={field?.value == 'true' || field?.value == true}
                                      name="mandatory"
                                      type="radio"
                                      id="true"
                                      onClick={(e) => {
                                        let temp = questionObject
                                        temp.mandatory = Boolean(e.target.value === 'true')
                                        setQuestionObject(temp)
                                      }}
                                    />
                                    <label htmlFor="true">Yes</label>
                                  </div>

                                  <div className="radio-item">
                                    <input
                                      {...field}
                                      value={false}
                                      name="mandatory"
                                      id="false"
                                      checked={field?.value == 'false' || field?.value == false}
                                      type="radio"
                                      onClick={(e) => {
                                        let temp = questionObject
                                        temp.mandatory = Boolean(e.target.value === 'false')
                                        setQuestionObject(temp)
                                      }}
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
                        <Form.Group>
                            <Field name="parentQuestion">
                              {({ field, form }) => {

                                const stage = _.find(stageArray, {
                                  name: formRef?.current?.values?.stagename
                                });

                                if (!stage?.dataelements) {
                                  return (
                                    <>
                                      <Form.Label className="label">Parent question</Form.Label>
                                      <Form.Control as="select" disabled>
                                        <option>Select a stage first</option>
                                      </Form.Control>
                                    </>
                                  );
                                }

                                const currentQuestionIndex = isEditQuestion
                                  ? stage.dataelements.findIndex(el => el.name === questionObject.name)
                                  : -1;

                                const isProgramPublished = storeState.user.isEdit;

                                const parentCandidates = stage.dataelements
                                  .map((el, index) => ({ el, index }))
                                  .filter(({ el, index }) =>
                                    el.attributeRefType === "optionset"&&
                                    !el.isCheckboxOption &&
                                    index !== currentQuestionIndex &&
                                    (isProgramPublished ? !!el.dataElementId : true)
                                  );

                                return (
                                  <>
                                    <Form.Label className="label">Parent question</Form.Label>

                                    <Form.Control
                                      as="select"
                                      name="parentQuestion"
                                      value={field.value ?? ""}
                                      onChange={(e) =>
                                        form.setFieldValue(
                                          "parentQuestion",
                                          e.target.value === "" ? "" : Number(e.target.value)
                                        )
                                      }
                                    >
                                      <option value="">-</option>

                                      {parentCandidates.map(({ el, index }) => (
                                        <option key={el.dataElementId || index} value={index}>
                                          {el.name}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </>
                                );
                              }}
                            </Field>

                            <ErrorMessage component={TextError} name="parentQuestion" />
                          </Form.Group>
                        {(formRef.current != null && formRef.current.values?.parentQuestion != null && currentDataelement[formRef.current.values.parentQuestion]) ?
                          <Form.Group>
                            <Field name='dependentValue'>
                              {({ field, meta }) => {
                                return (
                                  <>
                                    <Form.Label>Dependent Value</Form.Label>
                                    <Form.Control as="select" {...field}>
                                      <option>-</option>

                                      {(() => {
                                        const parentIdxRaw = formRef?.current?.values?.parentQuestion;

                                        // If parentQuestion is empty or not a number, don't render options
                                        const parentIdx =
                                          parentIdxRaw === "" || parentIdxRaw === null || parentIdxRaw === undefined
                                            ? null
                                            : Number(parentIdxRaw);

                                        const parentEl =
                                          Number.isInteger(parentIdx) && Array.isArray(currentDataelement)
                                            ? currentDataelement[parentIdx]
                                            : null;

                                        const list =
                                          parentEl?.optionvalues && Array.isArray(parentEl.optionvalues)
                                            ? parentEl.optionvalues
                                            : parentEl?.checkboxoption && Array.isArray(parentEl.checkboxoption)
                                              ? parentEl.checkboxoption
                                              : [];

                                        return list.map((element) => (
                                          <option key={element} value={element}>
                                            {element}
                                          </option>
                                        ));
                                      })()}
                                    </Form.Control>
                                      {isSubmitDisabled && (
                                        <Form.Text style={{ color: "red", fontSize: 12 }}>
                                          Dependent Value is required when a Parent Question is selected.
                                        </Form.Text>
                                      )}
                                  </>
                                )
                              }}
                            </Field>
                          </Form.Group>
                          : null
                        }
                        <div>
                          <Button type="submit" className="addbtn"
                          disabled={isSubmitDisabled}
                          style={{
                            opacity: isSubmitDisabled ? 0.6 : 1,
                            cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                          }}> {isEditQuestion ? 'Update' : 'Add'}</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </FForm>
                );
                }}
              </Formik>
            </div>
            : null
        }
        {
          formToggle ?
            <div className="col-4">
              <Formik
                initialValues={stageObject}
                enableReinitialize
                validationSchema={stageObjectSchema}
                onSubmit={values => {
                  let arrayHolder = stageArray
                  if (isEditStage) {
                    arrayHolder.map((stage, idx) => {

                      if (stage.orignalname == values.orignalname) {
                        stage.name = values.name
                        stage.hasAccess = values.hasAccess
                      }
                    })
                    toast.success('Stage name updated sucessfully!',
                      {
                          id: 'stage-update-success',
                        style: {
                          border: '1px solid #44546A',
                          padding: '16px',
                        },
                      }
                    )
                  } else {
                    values['orignalname'] = values.name;
                    values.programStageSections = [];
                    arrayHolder.push(values)
                    toast.success('New Stage Added Sucessfully',
                      {
                        id: 'stage-add-success',
                        style: {
                          border: '1px solid #44546A',
                          padding: '16px',
                        },
                      }
                    )
                  }
                  setStageArray([...arrayHolder])
                  setformToggle(false)
                }}
              >
                {({ errors, touched }) => (
                  <FForm className="">
                    <Card>
                      <Card.Header className="regcardheader">{isEditStage ? 'Edit' : 'Add'} Stage
                        <span className="closesign" onClick={() => setformToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                      </Card.Header>
                      <Card.Body className="regtabbody">
                        <Field name='name'>
                          {({ field, meta }) => {
                            return (
                              <>
                                <Form.Label className="label">* Stage Name</Form.Label>
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
            : null
        }

        {
          deleteVariableToggle ?
            <div className="col-4">
              <Card>
                <Card.Header className="regcardheader">Deleted Questions List
                  <span className="closesign" onClick={() => setDeleteVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                </Card.Header>
                <Card.Body className="regtabbody">
                  <Select
                    className="basic-multi-select multiselect"
                    classNamePrefix="select"
                    isMulti
                    options={deletedElementArray}
                    menuIsOpen={true}
                    components={animatedComponents}
                    onChange={onElementSelect}
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button onClick={pushQuestionListToStage} className="addbtn mt-3"> Add to {stageObject.name}</Button>
                    <Button onClick={() => setDeleteVariableToggle(false)} className="addbtn mt-3" >Close</Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
            : null
        }
        {
          addNewSectionToggle ?
            <>
              <div className="col-4">
                <Formik
                  innerRef={addNewSectionFormRef}
                  initialValues={{}}
                  enableReinitialize
                  validationSchema={addNewSectionObjectSchema}
                  onSubmit={values => {
                    handleAddNewItem(values);
                  }
                  }
                >
                  {({ errors, touched }) => (
                    <FForm className="">
                      <Card>
                        <Card.Header className="regcardheader">Add New Section (Stage Name: {currentStage.name})
                          <span className="closesign" onClick={() => setaddNewSectionToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                        </Card.Header>
                        <Card.Body className="regtabbody">
                          <Form.Group>
                            <Field name='name'>
                              {({ field, meta }) => {
                                return (
                                  <>
                                    <Form.Label className="label">* Enter Section Name</Form.Label>
                                    <input type="text" className='form-control' placeholder="Enter Section Name" {...field} ></input>
                                    {/* <select
                                      type='text'
                                      className='form-control'
                                      {...field}
                                      onChange={handleSectionChange}
                                    >
                                      <option value="">Select Type</option>
                                      {programSections.map(section => {
                                        return <option value={section.name}>{section.name}</option>
                                      })}
                                    </select> */}

                                  </>
                                )
                              }}
                            </Field>
                            <ErrorMessage
                              component={TextError}
                              name="name"
                            />
                          </Form.Group>
                          {/* <Form.Group controlId="formSelectLanguages">
                            <Field name='dataElements'>
                              {({ field, meta }) => {
                                return (
                                  <>
                                    <Form.Label className="label">Select Questions To Map</Form.Label>
                                    <Select
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      isMulti
                                      options={options}
                                      onChange={handleOptionsChange}
                                      value={selectedOptions}
                                    />
                                  </>
                                )
                              }}
                            </Field>
                            <ErrorMessage
                              component={TextError}
                              name="languages"
                            />
                          </Form.Group> */}
                          <div>
                            <Button type="submit" className="addbtn"> Add Section</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </FForm>
                  )}
                </Formik>
              </div>
            </> : null
        }
        {
          renderSectionToggle ?
            <div className="col-4">
              <Formik
                innerRef={stageSectionFormRef}
                initialValues={{
                  name: currentStage.name || currentStage.orignalname,  // ✅ seeded correctly
                  section_name: '',
                  dataElements: [],
                }}
                enableReinitialize
                validationSchema={sectionObjectSchema}
                onSubmit={(values) => {
                  updateStageSectionConf(values);
                }}
              >
                {({ errors, touched, values }) => (
                  <FForm className="">
                    <Card>
                      <Card.Header className="regcardheader">
                        Configure Section
                        <span className="closesign" onClick={() => setRenderSectionToggle(false)}>
                          <i aria-hidden="true" className="fa fa-times"></i>
                        </span>
                      </Card.Header>
                      <Card.Body className="regtabbody">
                        {/* Stage Name Field - Optional rename */}
                        <Form.Group>
                          <Field name='name'>
                            {({ field, meta }) => {
                              return (
                                <>
                                  <Form.Label className="label">* Stage Name</Form.Label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    required={true}
                                    placeholder={currentStage.name || currentStage.orignalname}
                                    value={field.value}
                                    // defaultValue={currentStage.name || currentStage.orignalname}
                                    {...field}
                                  />
                                </>
                              );
                            }}
                          </Field>
                          <ErrorMessage
                            component={TextError}
                            name="name"
                          />
                        </Form.Group>

                        <hr className="my-3" />

                        {/* Section Configuration Fields */}
                        <Form.Group>
                          <Field name='section_name'>
                            {({ field, meta }) => {
                              return (
                                <>
                                  <Form.Label className="label">* Select Section Name</Form.Label>
                                  <select
                                    type='text'
                                    className='form-control'
                                    required={true}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleSectionChange(e);
                                    }}
                                  >
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                      <option key={section.name} value={section.name}>{section.displayName}</option>
                                    ))}
                                  </select>
                                </>
                              );
                            }}
                          </Field>
                          <ErrorMessage
                            component={TextError}
                            name="section_name"
                          />
                        </Form.Group>

                        <Form.Group controlId="formSelectLanguages">
                          <Field name='dataElements'>
                            {({ field, meta }) => (
                              <>
                                <Form.Label className="label">Select Questions</Form.Label>
                                <Select
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  isMulti
                                  options={dataElements}
                                  onChange={handleDataElementsChange}
                                  value={selectedDataElements}
                                />
                              </>
                            )}
                          </Field>
                          <ErrorMessage
                            component={TextError}
                            name="dataElements"
                          />
                        </Form.Group>

                        {/* Single Configure Button */}
                        <div className="mt-3">
                          <Button type="submit" className="addbtn">
                            Update
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </FForm>
                )}
              </Formik>
            </div>
            : null
        }


        {
          renderMobileViewToggle ? <>
            <div className="smartphone">
              <div className="">
                <Tabsnew
                  activeTab={activeTab}
                  onTabClick={onTabClick}
                >
                  {stageArray.map((stage, idx) => {
                    return (
                      <Tabnew key={idx} >
                        {stage.name}
                      </Tabnew>
                    )
                  })}
                </Tabsnew>
              </div>
              <Formik
                // initialValues={}
                enableReinitialize
                onSubmit={values => {
                }}
              >
                <FForm className="">
                  {stageArray[activeTab] && _.sortBy(stageArray[activeTab].dataelements, 'sortOrder').map((element, idx) => {
                    if (element.attributeRefType == 'text' || element.attributeRefType == 'facility') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <Form.Label className="label">{element.mandatory ? "*" : ""}{element.name}</Form.Label>
                            <input
                              type='text'
                              className='form-control'
                              placeholder=""
                            />
                          </Form.Group>
                        </>
                      )
                    }
                    if (element.attributeRefType == 'number') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <Form.Label className="label">{element.mandatory ? "*" : ""}{element.name}</Form.Label>
                            <input
                              type='number'
                              className='form-control'
                              placeholder=""
                            />
                          </Form.Group>
                        </>
                      )
                    }
                    if (element.attributeRefType == 'date') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <Form.Label className="label">{element.name}</Form.Label>
                            <input
                              type='date'
                              className='form-control'
                              placeholder=""
                            />
                          </Form.Group>
                        </>
                      )
                    }
                    if (element.attributeRefType == 'optionset') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <Form.Label className="label">{element.name}</Form.Label>
                            <select
                              type='text'
                              className='form-control'
                            >
                              <option value="">Select Type</option>
                              {element.optionvalues.map(option => {
                                return <option value={option}>{option}</option>
                              })}
                            </select>
                          </Form.Group>
                        </>
                      )
                    }
                    if (element.attributeRefType == 'checkbox') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <span className="float-left">{element.name}</span>
                            {/* <Form.Label className="label mb-2">{element.name}</Form.Label> */}
                            <br></br>
                            <div>
                              {element.checkboxoption.map(option => {
                                return <>
                                  <div key={`default-checkbox`} className="mb-1">
                                    <Form.Check
                                      className="text-left"
                                      type="checkbox"
                                      id={`default-checkbox`}
                                      label={option}
                                    />
                                  </div>
                                </>
                              })}
                            </div>
                          </Form.Group>
                        </>
                      )
                    }
                    if (element.attributeRefType == 'IMAGE' || element.attributeRefType == 'FILE_RESOURCE') {
                      return (
                        <>
                          <Form.Group className="pl-2 pr-2" controlId="formBasicEmail">
                            <Form.Label className="label">{element.mandatory ? "*" : ""}{element.name}</Form.Label>
                            <input
                              type='file'
                              className='form-control'
                              placeholder=""
                            />
                          </Form.Group>
                        </>
                      )
                    }
                  })
                  }
                </FForm>
              </Formik>
            </div>
          </> : null
        }
        {/* Code for configure section */}
        {
          renderSubSection ?
            <>
              <div className="col-4">
                <Formik
                  innerRef={subSectionformRef}
                  initialValues={{}}
                  enableReinitialize
                  validationSchema={subSectionObjectSchema}
                  onSubmit={(values) => {
                    console.log(values)
                  }}
                >
                  {({ errors, touched }) => (
                    <FForm className="">
                      <Card>
                        <Card.Header className="regcardheader">Sub Section Configuration (Stage Name: {currentStage.orignalname})
                          <span className="closesign" onClick={() => setRenderSubSection(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                        </Card.Header>
                        <Card.Body className="regtabbody">
                          <Form.Group>
                            <Field name='section_name'>
                              {({ field, form, meta }) => {
                                return (
                                  <>
                                    <Form.Label className="label">* Select Section Name</Form.Label>
                                    <select
                                      {...field}
                                      type='text'
                                      className='form-control'
                                      required={true}
                                      onChange={(e) => handleSectionChangeNew(e, form.setFieldValue)}
                                    >
                                      <option value="">Select Section</option>
                                      {sections.map(section => {
                                        return <option value={section.name}>{section.displayName}</option>
                                      })}
                                      {/* <option value="checkbox">Checkbox Options</option> */}
                                    </select>
                                  </>
                                )
                              }}
                            </Field>
                            <ErrorMessage
                              component={TextError}
                              name="section_name"
                            />
                          </Form.Group>
                          {subsections.length > 0 && (
                            <Form.Group className="mt-3">
                              <Field name="subsection_name">
                                {({ field, form }) => (
                                  <>
                                    <Form.Label className="label">* Select Subsection Name</Form.Label>
                                    <select
                                      className="form-control"
                                      {...field}
                                      onChange={(e) => handleSubsectionChange(e, form.setFieldValue)}
                                    >
                                      <option value="">Select Subsection</option>
                                      {subsections.map((sub, index) => (
                                        <option key={index} value={sub.subsectionName}>
                                          {sub.subsectionName}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                              </Field>
                              <ErrorMessage component={TextError} name="subsection_name" />
                            </Form.Group>
                          )}
                          <div>
                            <Button type="submit" className="addbtn">Next</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </FForm>
                  )}
                </Formik>
              </div>
            </> : null
        }
      </div>

      <div className="row pt-1 mb-4">
        <div className="col-12 bnBtn">
          <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step2'))}>Back</button>
          {/* <button onClick={() => { publishCall() }} tabIndex="-1" disabled={userDetails.username == "cdicadmin@imonitorplus.com" ? true : false} type="button" className="btn wizard-btnn  mr-4" > {storeState.user.isEdit ? "Update" : "Publish"}</button> */}
          <button onClick={() => dispatch(setActiveTab('step4'))} type="button" className="btn wizard-btnn  mr-4" > Next</button>
        </div>
      </div>
      <Modal data-backdrop="static" size="lg" data-keyboard="false" show={showModal} onHide={handleClose}>
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

export default ServicesStep;