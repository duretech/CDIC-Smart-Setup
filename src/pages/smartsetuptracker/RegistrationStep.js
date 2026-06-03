import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Form, Tabs, Tab, Accordion, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setUserTemplate } from '../../redux/actions/userAction'
import { ErrorMessage, Field, useField, Formik, Form as FForm } from 'formik';
import * as Yup from 'yup';
import TextError from '../../component/ErrorText';
import API from "../../util";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';
import _ from "underscore";

const animatedComponents = makeAnimated();

const disabledArray = ['Gender', 'UIC', 'Client type', 'First name', 'Phone number (permanent)', 'QR code', 'Others', 'Age', 'Surname']

const RegistrationStep = () => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const storeState = useSelector((state) => state)
  const userTemplate = useSelector((state) => state.programDetails.userTemplate)
  const userInputs = useSelector((state) => state.programDetails.details)
  const [tabKey, setKey] = useState(userInputs && userInputs.languages ? userInputs.languages[0].value : null)
  const [attribuetArray, setAttribuetArray] = useState(userTemplate.trackedentityattributes > 0 ? userTemplate.trackedentityattributes : [])
  const [unmappedAttributes, setUnmappedAttributes] = useState([])
  const [questionObject, setQuestionObject] = useState({})
  const [optionsArray, setOptionsArray] = useState([])
  const [optionValuesLocaleArray, setOptionValuesLocaleArray] = useState([])
  const [languagesArray, setLanguagesArray] = useState([])
  const [isEditQuestion, setIsEditQuestion] = useState(false)
  const [dataVariableToggle, setDataVariableToggle] = useState(false)
  const [attributeRenderKey, setAttributeRenderKey] = useState(0)
  const [defaultActiveKey, setDefaultActiveKey] = useState('0')
  const [optionsError, setOptionsError] = useState('');
  const [originalOptionsBeforeEdit, setOriginalOptionsBeforeEdit] = useState([]);

  const [dependentArray, setDependentArray] = useState([])

  const [tempKey, setTempKey] = useState(0)
  const [rerenderKey, setRerenderKey] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [unmappedCount, setUnmappedCount] = useState(0);
  const questionObjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mandatory: Yup.string(),
    attributeRefType: Yup.string().required('Attribute Type is required'),
    parentQuestion: Yup.string(),
    dependentValue: Yup.string(),
  });
  //variable for Add New Section
  const addNewSectionFormRef = useRef(null);
  const [addNewSectionToggle, setaddNewSectionToggle] = useState(false)
  const addNewSectionObjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })
  // Variable for Section render
  const sectionFormRef = useRef(null);
  const [programSections, setProgramSections] = useState(userTemplate.programSections)
  const [renderSectionToggle, setRenderSectionToggle] = useState(false)
  const sectionObjectSchema = Yup.object().shape({
    section_name: Yup.string(),
    // dataElements: Yup.array(),
  })
  // Variable for Mobile Render
  const [renderMobileViewToggle, setRenderMobileViewToggle] = useState(false)
  // Variable for Delete flow
  const [deleteVariableToggle, setDeleteVariableToggle] = useState(false)
  const [deletedAttributeArray, setDeletedAttributeArray] = useState(userTemplate.deletedObjects.deletedAttribute)
  const [currentAttributeList, setCurrentAttributeList] = useState([])
  const onElementSelect = selectedOption => {
    setCurrentAttributeList(selectedOption)
  }
  const pushQuestionListToAttribute = () => {
    let arrayHolder = attribuetArray
    arrayHolder.push(...currentAttributeList)
    let deleteArrHolder = deletedAttributeArray
    setDeletedAttributeArray(
      deleteArrHolder.filter(function (obj) {
        return !this.has(obj.trackedEntityAttributeId);
      }, new Set(currentAttributeList.map(obj => obj.trackedEntityAttributeId)))
    )
    setAttribuetArray(arrayHolder);
    setAttributeRenderKey(Math.random())
    setDeleteVariableToggle(false)
  }

  useEffect(() => {
    const count = attribuetArray.filter(attr => attr.programSectionFlag === false).length;
    setUnmappedCount(count);
  }, [attribuetArray]);

  useEffect(() => {
    console.log("userTemplate>>>>", userTemplate);
    let tempHolder = userTemplate.trackedentityattributes
    setProgramSections(userTemplate.programSections)
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
          value: attribute.trackedEntityAttributeId,
          label: attribute.name
        }
        unMappedAttr.push(attr)
      }
      else {
        return
      }
    });
    setUnmappedAttributes(unMappedAttr)
  }, [userTemplate])
  // Sections Configuration Code
  const [selectedSection, setSelectedSection] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (selectedSection) {
      // Get the current section's attributes
      const section = _.findWhere(programSections, { name: selectedSection });
      const currentSectionAttributeIds = section
        ? section.trackedEntityAttributes.map(attr => attr.id || attr.trackedEntityAttributeId || attr.name)
        : [];

      // Filter attribuetArray to show only:
      // 1. Unmapped questions (programSectionFlag: false) that have trackedEntityAttributeId (persisted in DB)
      // 2. Questions already in the current section
      const availableOptions = attribuetArray
        .filter(attr => {
          const attrId = attr.trackedEntityAttributeId || attr.id || attr.name;

          // Include if unmapped AND has trackedEntityAttributeId (exists in DB)
          if (attr.programSectionFlag === false && attr.trackedEntityAttributeId) {
            return true;
          }

          // Include if it's in the current section
          if (currentSectionAttributeIds.includes(attrId)) {
            return true;
          }

          // Exclude all others (mapped to different sections OR newly added without trackedEntityAttributeId)
          return false;
        })
        .map(attr => ({
          value: attr.trackedEntityAttributeId || attr.id || attr.name,
          label: attr.name || attr.displayName
        }));

      setOptions(availableOptions);

      // Pre-select the questions already in this section
      const sectionOptions = section
        ? section.trackedEntityAttributes.map(attr => ({
          value: attr.id || attr.trackedEntityAttributeId || attr.name,
          label: attr.name || attr.displayName
        }))
        : [];
      setSelectedOptions(sectionOptions);
    } else {
      // No section selected - show only unmapped questions that have trackedEntityAttributeId
      const unmappedOptions = attribuetArray
        .filter(attr => attr.programSectionFlag === false && attr.trackedEntityAttributeId)
        .map(attr => ({
          value: attr.trackedEntityAttributeId || attr.id || attr.name,
          label: attr.name || attr.displayName
        }));

      setOptions(unmappedOptions);
      setSelectedOptions([]);
    }
  }, [selectedSection, programSections, attribuetArray, refreshTrigger]);

  const handleSectionChange = (event) => {
    const sectionName = event.target.value;
    setSelectedSection(sectionName);

    // Clear selected options when changing sections
    if (!sectionName) {
      setSelectedOptions([]);
    }
  };


  const handleOptionsChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  // To add New Section 
  // To add New Section
  const handleAddNewItem = (values) => {
    if (_.findIndex(programSections, { name: values.name }) != -1) {
      toast.error('Error: Section With Same Name Already Exists',
        {
          id: 'section-error',
          style: {
            border: '1px solid #44546A',
            padding: '16px',
          },
        }
      )
      setaddNewSectionToggle(false)
    }
    else {
      let currentProgramSections = programSections;
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
        "sortOrder": programSections.length,
        "name": values.name,
        "program": {
          "id": userTemplate.programuid
        },
        "trackedEntityAttributes": []
        // 🔴 NO id property - indicates it's not saved to DB yet
      }
      currentProgramSections.push(newSection)

      // 🔴 REMOVE: This was causing immediate appearance in dropdown
      // let oRequest = {
      //   programSections: currentProgramSections
      // }

      // Update programSections in userTemplate
      setProgramSections(currentProgramSections);

      // Update userTemplate
      const updatedUserTemplate = {
        ...userTemplate,
        programSections: currentProgramSections
      };
      dispatch(setUserTemplate(updatedUserTemplate));

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

  // Updated updateSectionConf function
  const updateSectionConf = (values) => {
    toast.success('Section Configured Successfully!', {
      id: 'section-success',
      style: { border: '1px solid #44546A', padding: '16px' },
    });

    // Map selected options to the required format with sortOrder
    const options = selectedOptions.map((option, index) => ({
      id: option.value,  // This matches attr.trackedEntityAttributeId
      name: option.label,
      displayName: option.label,
      sortOrder: index + 1,
    }));

    // Get IDs of currently selected attributes
    const selectedIds = selectedOptions.map(option => option.value);

    // Clone and update programSections with new trackedEntityAttributes list keyed by selectedSection
    const updatedProgramSections = programSections.map(section => {
      if (section.name === selectedSection) {
        return { ...section, trackedEntityAttributes: options };
      }
      return section; // PRESERVE OTHER SECTIONS - THIS WAS THE KEY FIX!
    });

    // Find previously mapped attribute IDs for the selected section BEFORE update
    const previousSection = programSections.find(section => section.name === selectedSection);
    const previouslyMappedIds = previousSection
      ? previousSection.trackedEntityAttributes.map(attr => attr.id || attr.name || attr.trackedEntityAttributeId)
      : [];

    // Find REMOVED attribute IDs (were in previous section but NOT in current selections)
    const removedIds = previouslyMappedIds.filter(prevId => !selectedIds.includes(prevId));

    // Update attribuetArray programSectionFlag for only removed or currently selected attributes
    const updatedAttribuetArray = attribuetArray.map(attr => {
      const attrId = attr.trackedEntityAttributeId || attr.id || attr.name;

      if (removedIds.includes(attrId)) {
        // Attribute removed from this section - unmap flag false
        return { ...attr, programSectionFlag: false, sortOrder: 0 };
      }

      if (selectedIds.includes(attrId)) {
        // Attribute is currently selected in the section - map flag true and update sort order
        const indexInSelected = selectedIds.indexOf(attrId);
        return { ...attr, programSectionFlag: true, sortOrder: indexInSelected + 1 };
      }

      // Others remain unchanged
      return attr;
    });

    // Update state hooks accordingly
    setProgramSections(updatedProgramSections);
    setAttribuetArray(updatedAttribuetArray);
    setRefreshTrigger(prev => prev + 1);
    setRenderSectionToggle(false);
    setSelectedOptions([...selectedOptions]);
  };

  const pushQuestion = (props) => {
    let values = props;
    values.type = props.attributeRefType;
    let arrayHolder = attribuetArray
    let localeHolder = [...optionValuesLocaleArray]

    Object.keys(localeHolder).map(lang => {
      // localeHolder[lang].map((local,idx) => {
      //     if(local.value == '')
      //     localeHolder[lang].splice(idx, 1)
      // })
    })

    const hasEmptyOption = optionsArray.some(option => option.trim() === "");
    if (hasEmptyOption) {
      setOptionsError("Please fill in all options. No options should be empty!");
      return;
    }

    // **DUPLICATE NAME VALIDATION - START**
    if (!isEditQuestion) {
      // When adding a new question, check against all existing questions
      const isDuplicateName = attribuetArray.some(
        question => question.name.toLowerCase().trim() === values.name.toLowerCase().trim()
      );

      if (isDuplicateName) {
        Swal.fire({
          title: 'Duplicate Name!',
          text: 'A question with this name already exists. Please use a unique name.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: "swal2-ok-btn",
          },
        });
        return;
      }
    } else {
      // When editing, check if name conflicts with OTHER questions (exclude current question)
      const isDuplicateName = attribuetArray.some(
        question =>
          question.orignalname !== values.orignalname &&
          question.name.toLowerCase().trim() === values.name.toLowerCase().trim()
      );

      if (isDuplicateName) {
        Swal.fire({
          title: 'Duplicate Name!',
          text: 'A question with this name already exists. Please use a unique name.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: "swal2-ok-btn",
          },
        });
        return;
      }
    }
    // **DUPLICATE NAME VALIDATION - END**

    if (values.type == 'optionset') {
      if (optionsArray.length == 0) {
        setOptionsError("At least one option is required.");
        return
      }
      if (optionsArray.length !== 0) {
        setOptionsError('');
      }
      values['optionvalues'] = optionsArray
      values['optionname'] = "option_" + Date.now();
    }
    else if (values.type == 'checkbox') {
      if (optionsArray.length == 0) {
        setOptionsError("At least one option is required.");
        return
      }
      if (optionsArray.length !== 0) {
        setOptionsError('');
      }
      values['checkboxoption'] = optionsArray
    }

    values['languages'] = languagesArray
    values.languages.map((lang, idx) => {
      if (lang.locale == 'en' || lang.value == '')
        values.languages.splice(idx, 1)
      // if(lang.value == '')
      //     values.languages.splice(idx, 1)
    })
    setDataVariableToggle(false)

    if (isEditQuestion) {
      arrayHolder.map((el, idx) => {
        if (el.orignalname == values.orignalname) {
          el.name = values.name
          el.mandatory = values.mandatory
          el.languages = values.languages
          el.parentQuestion = values.parentQuestion ? values.parentQuestion : ""
          el.dependentValue = values.dependentValue ? values.dependentValue : ""
          // Updated Elements to be marked
          el.isupdate = true
          if (el.type === 'optionset') {
            // Update optionvalues
            el['optionvalues'] = optionsArray

            // COMPLETE FIX: Build options array comparing current vs original
            if (el['options'] && Array.isArray(el['options'])) {
              let newOptionsArray = []
              // Use originalOptionsBeforeEdit as the baseline
              const baselineOptions = originalOptionsBeforeEdit.length > 0 ? originalOptionsBeforeEdit : el['options']

              // STEP 1: Process current optionsArray visible in UI
              optionsArray.forEach((optionValue, index) => {
                // Find in baseline by name
                const existingOption = baselineOptions.find(opt => opt.name === optionValue)
                if (existingOption) {
                  // Existing option - keep with updated sortOrder
                  newOptionsArray.push({ ...existingOption, sortOrder: index + 1, isupdate: true, isdelete: false })
                } else {
                  // New option - add without id
                  newOptionsArray.push({ name: optionValue, code: optionValue, sortOrder: index + 1, isupdate: true })
                }
              })

              // STEP 2: Find deleted options - in baseline but NOT in optionsArray (renamed = deleted old + new added)
              baselineOptions.forEach(oldOption => {
                if (oldOption.id && !optionsArray.includes(oldOption.name)) {
                  const alreadyAdded = newOptionsArray.some(opt => opt.id === oldOption.id)
                  if (!alreadyAdded) {
                    newOptionsArray.push({ ...oldOption, isdelete: true, isupdate: true })
                  }
                }
              })

              // ✅ STEP 3: Sync optionvaluesLocale keys
              let syncedLocale = [...localeHolder]

              // 3a. Rename locale keys for options whose name changed (has id, not deleted, name differs from baseline)
              newOptionsArray.forEach(opt => {
                if (opt.id && opt.isupdate && !opt.isdelete) {
                  const originalOpt = baselineOptions.find(b => b.id === opt.id)
                  if (originalOpt && originalOpt.name !== opt.name) {
                    syncedLocale = syncedLocale.map(localeObj => {
                      if (localeObj[originalOpt.name] !== undefined) {
                        const existingData = localeObj[originalOpt.name]
                        const localeData = Array.isArray(existingData)
                          ? existingData
                          : Object.values(existingData).filter(v => v && v.locale)
                        const { [originalOpt.name]: _removed, ...rest } = localeObj
                        return { ...rest, [opt.name]: localeData }
                      }
                      return localeObj
                    })
                  }
                }
              })

              // 3b. Add blank locale entries for brand new options (no id, not deleted)
              newOptionsArray.forEach(opt => {
                if (!opt.id && !opt.isdelete) {
                  const alreadyHasLocale = syncedLocale.some(obj => obj[opt.name] !== undefined)
                  if (!alreadyHasLocale) {
                    syncedLocale.push({
                      [opt.name]: userInputs.languages.map(lang => ({
                        locale: lang.value,
                        property: 'NAME',
                        value: ''
                      }))
                    })
                  }
                }
              })

              el['optionvaluesLocale'] = syncedLocale
              el['options'] = newOptionsArray
            } else {
              // First time initialization
              el['options'] = optionsArray.map((optionValue, index) => ({
                name: optionValue, code: optionValue, sortOrder: index + 1, isupdate: true
              }))
              // ✅ Also build fresh locale for first-time init
              el['optionvaluesLocale'] = optionsArray.map(optionValue => ({
                [optionValue]: userInputs.languages.map(lang => ({
                  locale: lang.value,
                  property: 'NAME',
                  value: ''
                }))
              }))
            }
          }

        }
      })

      Swal.fire({
        title: 'Update!',
        text: 'Question Updated Successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "swal2-ok-btn",
        },
      });
      setOriginalOptionsBeforeEdit([]);

    } else {
      values['programSectionFlag'] = false;
      values['orignalname'] = values.name;
      values['optionvaluesLocale'] = localeHolder;

      // Initialize options array for new questions
      if (values.type == 'optionset') {
        values['options'] = optionsArray.map((optionValue, index) => ({
          name: optionValue,
          code: optionValue,
          sortOrder: index + 1,
          isupdate: true
        }));
      }

      arrayHolder.push(values)
      Swal.fire({
        title: 'Add!',
        text: 'New Question Added Successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: "swal2-ok-btn",
        },
      });
    }

    // Code For Dependency Logic
    const existingChildObject = (() => {
      for (const element of dependentArray) {
        const found = element.dependentdataelementnames?.find(
          (c) => c.childdataelementname === values.name
        );
        if (found) return { ...found };
      }
      return null;
    })();

    // ✅ For new rule — never carry actionId (it belongs to old rule)
    const buildChildEntry = () => ({
      childdataelementname: values.name,
      ...(existingChildObject?.actionId && { actionId: existingChildObject.actionId }),
    });

    let tempDepentHolder = [...dependentArray];
    console.log("tempDepentHolder ", tempDepentHolder)
    const parentQuestionObj = values.parentQuestion
      ? attribuetArray.find((el) => el.name === values.parentQuestion)
      : null;

    if (parentQuestionObj) {
      // ✅ STEP A: Find existing rule for THIS child specifically
      const existingRuleForThisChild = dependentArray.find((dep) =>
        dep.dependentdataelementnames?.some(
          (c) => c.childdataelementname === values.name
        )
      );

      // ✅ STEP B: Remove child from whatever rule it currently belongs to
      tempDepentHolder = tempDepentHolder.map((element) => {
        const hasThisChild = element.dependentdataelementnames.some(
          (c) => c.childdataelementname === values.name
        );
        if (!hasThisChild) return element;

        const filtered = element.dependentdataelementnames.filter(
          (c) => c.childdataelementname !== values.name
        );
        return {
          ...element,
          dependentdataelementnames: filtered,
          ...(filtered.length === 0 && { isDelete: true }),
        };
      });

      // ✅ STEP C: Find rule with same parent + new matchingvalue to join
      // Join if: same parent + same matchingvalue (regardless of sibling count)
      // This handles "change back to original value" scenario correctly
      const targetGroupIdx = tempDepentHolder.findIndex(
        (el) =>
          el.dataelementname === parentQuestionObj.name &&
          el.matchingvalue === values.dependentValue &&
          !el.isDelete
      );

      if (targetGroupIdx !== -1) {
        // ✅ Rule exists with same parent + value — add child to it (no actionId for re-join)
        const alreadyExists = tempDepentHolder[targetGroupIdx].dependentdataelementnames.some(
          (c) => c.childdataelementname === values.name
        );
        if (!alreadyExists) {
          tempDepentHolder[targetGroupIdx] = {
            ...tempDepentHolder[targetGroupIdx],
            ...(tempDepentHolder[targetGroupIdx].isDelete && { isDelete: undefined }),
            dependentdataelementnames: [
              ...tempDepentHolder[targetGroupIdx].dependentdataelementnames,
              buildChildEntry(),
            ],
          };
        }
      } else {
        // ✅ No rule for this parent + value — create brand new one, no IDs
        tempDepentHolder.push({
          dataelementname: parentQuestionObj.name,
          matchingvalue: values.dependentValue,
          dependentdataelementnames: [
            buildChildEntry(),
          ],
        });
      }
    } else {
      // ✅ Parent removed — strip child immutably, mark rule deleted if empty
      tempDepentHolder = tempDepentHolder.map((element) => {
        const hasThisChild = element.dependentdataelementnames.some(
          (c) => c.childdataelementname === values.name
        );
        if (!hasThisChild) return element;

        const filtered = element.dependentdataelementnames.filter(
          (c) => c.childdataelementname !== values.name
        );
        return {
          ...element,
          dependentdataelementnames: filtered,
          ...(filtered.length === 0 && { isDelete: true }),
        };
      });
    }
    console.log("tempDepentHolder ", tempDepentHolder)
    setDependentArray(tempDepentHolder);
    setAttribuetArray(arrayHolder)
    setAttributeRenderKey(Math.random())
  }
  // Deleting a Question
  const handleDelete = (originalName) => {
    const indexToDelete = attribuetArray.findIndex(
      (attribute) => attribute.orignalname === originalName
    );

    if (indexToDelete === -1) {
      return;
    }

    // // Dependency check
    // const dependentRule = dependentArray.find(rule =>
    //   rule.dataelementname === originalName && 
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
    const parentRule = dependentArray.find(
      rule => rule.dataelementname === originalName && rule.dependentdataelementnames.length > 0
    );

    const childRule = dependentArray.find(rule =>
      rule.dependentdataelementnames?.some(
        child => child.childdataelementname === originalName
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
        // Execute deletion logic when "Yes" is clicked
        const updatedAttributes = attribuetArray.filter(
          (_, index) => index !== indexToDelete
        );
        setAttribuetArray([...updatedAttributes]);

        const element = attribuetArray[indexToDelete];

        const tempDeleteHolder = [...deletedAttributeArray, element];
        setDeletedAttributeArray(tempDeleteHolder);

        const updatedProgramSections = userTemplate.programSections.map((section) => {
          const updatedTrackedAttributes = section.trackedEntityAttributes.filter(
            (attribute) => attribute.name !== originalName
          );
          return { ...section, trackedEntityAttributes: updatedTrackedAttributes };
        });
        userTemplate.programSections = updatedProgramSections;

        const updatedTopLevelAttributes = userTemplate.trackedentityattributes.filter(
          (attribute) => attribute.orignalname !== originalName
        );
        userTemplate.trackedentityattributes = updatedTopLevelAttributes;
        userTemplate.attributedependentquestions = dependentArray
        dispatch(setUserTemplate({ ...userTemplate }));

        Swal.fire({
          title: 'Deleted!',
          text: 'The question has been successfully deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: "swal2-ok-btn",
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Action canceled by the user
        Swal.fire({
          title: 'Cancelled',
          text: 'The question was not deleted.',
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: "swal2-ok-btn",
          },
        });
      }
    });
  };

  // Sorting of Questions
  const moveQuestion = (orignalname, direction) => {
    // Find which section contains this question
    let targetSectionIndex = null;
    let targetSection = null;

    // Check if question is in a section
    programSections.forEach((section, sectionIdx) => {
      if (section.trackedEntityAttributes.some(attr => {
        const matchingAttr = attribuetArray.find(item => item.trackedEntityAttributeId === attr.id);
        return matchingAttr && matchingAttr.orignalname === orignalname;
      })) {
        targetSectionIndex = sectionIdx;
        targetSection = section;
      }
    });

    if (targetSection) {
      // Moving within a section
      const sectionAttributes = [...targetSection.trackedEntityAttributes];
      const currentIndex = sectionAttributes.findIndex(attr => {
        const matchingAttr = attribuetArray.find(item => item.trackedEntityAttributeId === attr.id);
        return matchingAttr && matchingAttr.orignalname === orignalname;
      });

      if (currentIndex === -1) return;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= sectionAttributes.length) return;

      // Swap elements in trackedEntityAttributes array
      [sectionAttributes[currentIndex], sectionAttributes[targetIndex]] =
        [sectionAttributes[targetIndex], sectionAttributes[currentIndex]];

      // Update sortOrder based on new indices
      sectionAttributes.forEach((attr, index) => {
        attr.sortOrder = index + 1;
      });

      // Update programSections
      const updatedProgramSections = programSections.map((section, idx) => {
        if (idx === targetSectionIndex) {
          return {
            ...section,
            trackedEntityAttributes: sectionAttributes
          };
        }
        return section;
      });

      // Update attribuetArray with new sortOrder
      const updatedAttribuetArray = attribuetArray.map(attr => {
        const sectionAttr = sectionAttributes.find(secAttr => secAttr.id === attr.trackedEntityAttributeId);
        if (sectionAttr) {
          return {
            ...attr,
            sortOrder: sectionAttr.sortOrder
          };
        }
        return attr;
      });

      setProgramSections(updatedProgramSections);
      setAttribuetArray(updatedAttribuetArray);

      const updatedUserTemplate = {
        ...userTemplate,
        trackedentityattributes: updatedAttribuetArray,
        programSections: updatedProgramSections,
      };
      dispatch(setUserTemplate(updatedUserTemplate));
    } else {
      // Moving within unmapped questions (no sortOrder changes for unmapped)
      const unmappedAttributes = attribuetArray.filter(attr => attr.programSectionFlag === false);
      const currentIndex = unmappedAttributes.findIndex(attr => attr.orignalname === orignalname);

      if (currentIndex === -1) return;

      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= unmappedAttributes.length) return;

      // Find indices in main attribuetArray
      const mainCurrentIndex = attribuetArray.findIndex(attr => attr.orignalname === orignalname);
      const mainTargetIndex = attribuetArray.findIndex(attr =>
        attr.orignalname === unmappedAttributes[targetIndex].orignalname
      );

      const updatedArray = [...attribuetArray];
      [updatedArray[mainCurrentIndex], updatedArray[mainTargetIndex]] =
        [updatedArray[mainTargetIndex], updatedArray[mainCurrentIndex]];

      setAttribuetArray(updatedArray);

      const updatedUserTemplate = {
        ...userTemplate,
        trackedentityattributes: updatedArray,
      };

      dispatch(setUserTemplate(updatedUserTemplate));
    }
  };

  const handleDeleteSection = (sectionName) => {
    // Find the section to be deleted
    const sectionToDelete = programSections.find(section => section.name === sectionName);

    // Check if section has any mapped attributes
    const hasAttributes = sectionToDelete &&
      sectionToDelete.trackedEntityAttributes &&
      sectionToDelete.trackedEntityAttributes.length > 0;

    if (hasAttributes) {
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
      text: `Do you want to delete the section "${sectionName}"?`,
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
        // Remove the section from programSections
        const updatedProgramSections = programSections.filter(
          section => section.name !== sectionName
        );

        // Update state
        setProgramSections(updatedProgramSections);

        // Update userTemplate
        const updatedUserTemplate = {
          ...userTemplate,
          programSections: updatedProgramSections,
        };

        dispatch(setUserTemplate(updatedUserTemplate));

        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'The section has been successfully deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-ok-btn',
          },
        });

        // Reset the default active key if the deleted section was active
        if (defaultActiveKey === sectionName) {
          setDefaultActiveKey(programSections[0]?.name || '0');
        }
      }
    });
  };

  const handleMoveSection = (sectionName, direction) => {
    const sections = programSections || [];
    const sectionIndex = sections.findIndex(section => section.name === sectionName);
    if (sectionIndex === -1) return;

    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updatedSections = [...sections];
    [updatedSections[sectionIndex], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[sectionIndex]];

    // Update sortOrder
    const sectionsWithSortOrder = updatedSections.map((section, index) => ({
      ...section,
      sortOrder: index,
    }));

    setProgramSections(sectionsWithSortOrder);
    dispatch(setUserTemplate({ ...userTemplate, programSections: sectionsWithSortOrder }));
  };



  const renderAttributes = (attributes, sectionKey) => {
    // Sort by index in the array instead of sortOrder
    const isSmartsetupDisabled = (attrObj) =>
      Array.isArray(attrObj.attributesArray) &&
      attrObj.attributesArray.some(
        (attr) => attr.name === "Disable in Smartsetup" && attr.value === "true"
      );
    const getCoreTypeValue = (attrObj) => {
      if (Array.isArray(attrObj.attributesArray)) {
        const coreAttr = attrObj.attributesArray.find(
          (attr) => attr.name === "Core"
        );
        return coreAttr ? coreAttr.value : "-";
      }
      return "-";
    };

    return attributes.map((element, idx) => {
      if (element.name !== 'registered by' && element.name !== 'AddressLocation') {
        return (
          <>
            <Toaster
              containerStyle={{ zIndex: 99999 }}
              position="bottom-right"
              reverseOrder={false}
            />
            <tr className="" key={`elm2${idx}${element.orignalname}`}>
              <td>{element.name}</td>
              <td>{element.type}</td>
              <td>{element.mandatory == 'true' || element.mandatory == true ? 'Yes' : 'No'}</td>
              <td className="td-actions">
                <input
                  onChange={(e) => {
                    if (isSmartsetupDisabled(element)) return; // block change if disabled
                    const updatedArray = attribuetArray.map((item) => {
                      if (item.orignalname === element.orignalname) {
                        return { ...item, displayInList: e.target.checked };
                      }
                      return item;
                    });
                    setAttribuetArray(updatedArray);
                    userTemplate.trackedentityattributes = updatedArray;
                    dispatch(setUserTemplate({ ...userTemplate }));
                  }}
                  className={`big-checkbox${isSmartsetupDisabled(element) ? " disabled-in-smartsetup" : ""}`}
                  checked={element.displayInList || false}
                  type="checkbox"
                  disabled={isSmartsetupDisabled(element)}
                  style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}
                />
              </td>

              <td className="td-actions text-center">
                <input
                  onChange={(e) => {
                    if (isSmartsetupDisabled(element)) return; // block change if disabled
                    const updatedArray = attribuetArray.map((item) => {
                      if (!item.orignalname) {
                        return item;
                      }
                      if (item.orignalname === element.orignalname) {
                        return { ...item, searchable: e.target.checked };
                      }
                      return item;
                    });
                    setAttribuetArray(updatedArray);
                    userTemplate.trackedentityattributes = updatedArray;
                    dispatch(setUserTemplate({ ...userTemplate }));
                  }}
                  className={`big-checkbox${isSmartsetupDisabled(element) ? " disabled-in-smartsetup" : ""}`}
                  checked={element.searchable}
                  type="checkbox"
                  disabled={isSmartsetupDisabled(element)}
                  style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}
                />
              </td>
              <td>{getCoreTypeValue(element)}</td>


              <td className="td-actions justify-content-center text-center">
                {/* Edit and Delete buttons remain the same */}
                <button
                  onClick={(e) => {
                    if (isSmartsetupDisabled(element)) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    if (isSmartsetupDisabled(element)) return; // block click if disabled
                    setTempKey(Math.random())
                    setQuestionObject({})
                    setDataVariableToggle(false)
                    let tempArr = [];
                    let langList = [];
                    userInputs.languages.map((el) => {
                      tempArr.push({
                        locale: el.value,
                        property: 'NAME',
                        value: '',
                      });
                    });
                    if (!Array.isArray(element.languages)) element.languages = [];
                    if (element.languages.length === 0) {
                      setLanguagesArray(tempArr);
                    } else {
                      tempArr.map((el) => {
                        element.languages.map((lang) => {
                          if (el.locale === lang.locale) {
                            el.value = lang.value;
                          }
                        });
                      });
                      setLanguagesArray(tempArr);
                    }
                    if (element.type === 'optionset') {
                      let temp = [];
                      if (Array.isArray(element.optionvaluesLocale)) {
                        let localHolder = [];
                        element.optionvalues.map((option, idx) => {
                          let tempObj = {};
                          let temparr = [];
                          userInputs.languages.map((el) => {
                            if (_.findWhere(element.optionvaluesLocale[idx][option], { locale: el.value }))
                              temparr.push(_.findWhere(element.optionvaluesLocale[idx][option], { locale: el.value }));
                            else
                              temparr.push({
                                locale: el.value,
                                property: 'NAME',
                                value: '',
                              });
                          });
                          tempObj[option] = temparr;
                          localHolder.push(tempObj);
                        });
                        element.optionvaluesLocale = localHolder;
                        setOptionValuesLocaleArray([]);
                        setOptionValuesLocaleArray(localHolder);
                      } else {
                        element.optionvalues.map((option) => {
                          if (Object.keys(element.optionvaluesLocale).length === 0 || element.optionvaluesLocale[option].length === 0) {
                            let obj = {};
                            obj[option] = userInputs.languages.map((lang) => ({
                              locale: lang.value,
                              property: 'NAME',
                              value: '',
                            }));
                            temp.push(obj);
                          } else {
                            let obj = {};
                            let tempArr = userInputs.languages.map((lang) => ({
                              locale: lang.value,
                              property: 'NAME',
                              value: '',
                            }));
                            tempArr.map((elm) => {
                              var matched = element.optionvaluesLocale[option].filter((el) => elm.locale === el.locale);
                              if (matched.length > 0) elm.value = matched[0].value;
                            });
                            obj[option] = tempArr;
                            temp.push(obj);
                          }
                          setOptionValuesLocaleArray([]);
                          setOptionValuesLocaleArray(temp);
                        });
                      }
                      // FIX 3: Filter out deleted options from the options array before editing

                      if (element.options && Array.isArray(element.options)) {
                        // **SAVE ORIGINAL OPTIONS BEFORE ANY EDITS**
                        setOriginalOptionsBeforeEdit([...element.options]);

                        // Remove options that are marked as deleted for UI display
                        element.options = element.options.filter(opt => !opt.isdelete);
                      }

                    }
                    element.type === 'optionset'
                      ? setOptionsArray(element.optionvalues)
                      : element.type === 'checkbox'
                        ? setOptionsArray(element.checkboxoption)
                        : setOptionsArray([]);
                    // **FIX: Enrich element with parent data from dependentArray BEFORE setting**
                    const dependencyEntry = dependentArray.find(dep =>
                      dep.dependentdataelementnames?.some(child => child.childdataelementname === element.name)
                    );

                    const enrichedElement = {
                      ...element,
                      parentQuestion: dependencyEntry ? dependencyEntry.dataelementname : (element.parentQuestion || ''),
                      dependentValue: dependencyEntry ? dependencyEntry.matchingvalue : (element.dependentValue || '')
                    };

                    console.log("Element being edited:", {
                      name: enrichedElement.name,
                      parentQuestion: enrichedElement.parentQuestion,
                      dependentValue: enrichedElement.dependentValue,
                      dependencyEntry: dependencyEntry
                    });



                    setQuestionObject(enrichedElement);
                    setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null);
                    setDataVariableToggle(true);
                    setIsEditQuestion(true);
                    window.scrollTo({
                      top: 200,
                      behavior: 'smooth',
                    })
                    setaddNewSectionToggle(false)
                    setRenderSectionToggle(false);
                  }}
                  type="button"
                  title="Edit Question"
                  className={`btn btn-info btn_Edit${isSmartsetupDisabled(element) ? " disabled-in-smartsetup" : ""}`}
                  disabled={isSmartsetupDisabled(element)}
                  style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}
                >
                  <i className="fa fa-pencil-alt" style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}></i>
                </button>

                <button
                  style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}
                  onClick={(e) => {
                    if (isSmartsetupDisabled(element)) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    if (isSmartsetupDisabled(element)) return; // block click if disabled
                    handleDelete(element.orignalname)
                  }}
                  type="button"
                  title="Delete Question"
                  className={`btn btn-danger btn_Edit${isSmartsetupDisabled(element) ? " disabled-in-smartsetup" : disabledArray.includes(element.name) ? " disabled" : ""}`}
                  disabled={isSmartsetupDisabled(element)}
                >
                  <i className="fas fa-trash" style={{
                    cursor: isSmartsetupDisabled(element) ? "default" : "pointer",
                    opacity: isSmartsetupDisabled(element) ? 0.5 : 1,
                  }}></i>
                </button>
              </td>
              {sectionKey ? sectionKey.includes("unmapped") ? (
                <></>
              ) :
                <> </> :
                <td className="text-center sequence-column">
                  <span
                    title="Move Up"
                    onClick={() => {
                      if (!isSmartsetupDisabled(element) && idx !== 0) {
                        moveQuestion(element.orignalname, -1)
                      }
                    }}
                    style={{
                      cursor: isSmartsetupDisabled(element) || idx === 0 ? "default" : "pointer",
                      opacity: isSmartsetupDisabled(element) || idx === 0 ? 0.5 : 1,
                    }}
                  >
                    <i className="fas fa-long-arrow-alt-up" style={{
                      cursor: isSmartsetupDisabled(element) || idx === 0 ? "default" : "pointer",
                      opacity: isSmartsetupDisabled(element) || idx === 0 ? 0.5 : 1,
                    }}></i>
                  </span>
                  <span
                    title="Move Down"
                    onClick={() => {
                      if (
                        !isSmartsetupDisabled(element) &&
                        idx !== attributes.length - 1
                      ) {
                        moveQuestion(element.orignalname, 1)
                      }
                    }}
                    style={{
                      cursor: isSmartsetupDisabled(element) || idx === attributes.length - 1 ? "default" : "pointer",
                      opacity: isSmartsetupDisabled(element) || idx === attributes.length - 1 ? 0.5 : 1,
                    }}
                  >
                    <i className="fas fa-long-arrow-alt-down" style={{
                      cursor: isSmartsetupDisabled(element) || idx === attributes.length - 1 ? "default" : "pointer",
                      opacity: isSmartsetupDisabled(element) || idx === attributes.length - 1 ? 0.5 : 1,
                    }}></i>
                  </span>
                </td>
              }
            </tr>
          </>
        );
      }
    });
  };

  const renderSection = (section, sectionIndex) => {
    // ✅ FIXED: Match by ID, fallback to name
    const sectionAttributes = section.trackedEntityAttributes
      .map(secAttr => {
        // Try ID first, then name
        return attribuetArray.find(attr =>
          storeState.user.isEdit ?
            attr?.orignalname === secAttr?.description
            ||
            attr?.trackedEntityAttributeId === secAttr?.id ||
            attr?.id === secAttr?.id
            :
            attr?.orignalname === secAttr?.description
        );
      })
      .filter(attr => attr); // Remove null/undefined

    return (
      <>
        {/* <Toaster containerStyle={{ zIndex: 99999 }} position="bottom-right" reverseOrder={false} /> */}
        <Accordion defaultActiveKey={programSections[0]?.id} key={`${section.name}-${sectionIndex}`}>
          <Card key={`${section.name}-${sectionIndex}`} className="regcard">
            <Card.Header className="regcardheader d-flex justify-content-between">
              <Accordion.Toggle
                onClick={() => setDefaultActiveKey(section.name.toString())}
                className="formtableheader"
                as={Button}
                variant="link"
                eventKey={section.name.toString()}
              >
                <i className={`fas mr-2 ${defaultActiveKey == section.name ? "fa-minus" : "fa-plus"}`}></i>
                <span>{section.name}</span>
              </Accordion.Toggle>

              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {sectionIndex !== 0 && (
                  <span onClick={() => handleMoveSection(section.name, 'up')} style={{ cursor: 'pointer' }} title="Move Section Up">
                    <i aria-hidden="true" className="fas fa-long-arrow-alt-up"></i>
                  </span>
                )}
                {sectionIndex !== (programSections.length - 1) && (
                  <span onClick={() => handleMoveSection(section.name, 'down')} style={{ cursor: 'pointer' }} title="Move Section Down">
                    <i aria-hidden="true" className="fas fa-long-arrow-alt-down"></i>
                  </span>
                )}
                <span onClick={() => handleDeleteSection(section.name)} style={{ cursor: 'pointer' }} title="Delete Section">
                  <i aria-hidden="true" className="fa fa-trash"></i>
                </span>
              </div>
            </Card.Header>

            <Accordion.Collapse eventKey={section.name.toString()}>
              <Card.Body className="regcardbody">
                <div className="table-responsive">
                  <table className="table ss table-hover" id="programserviceTBL">
                    <thead>
                      <tr>
                        <th width="25%">Questions</th>
                        <th>Type</th>
                        <th>Mandatory</th>
                        <th>Display In Line List</th>
                        <th>Searchable</th>
                        <th>Core Type</th>
                        <th className="text-center">Actions</th>
                        <th className="text-center">Sequence</th>
                      </tr>
                    </thead>
                    <tbody className="formsbody">
                      {sectionAttributes.length > 0 ? (
                        renderAttributes(sectionAttributes)
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No questions configured for this section
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  };





  // Updated renderUnmappedSection function
  const renderUnmappedSection = () => {
    // Force recalculation every time
    const unmappedAttributes = attribuetArray.filter((attr) => {
      const isUnmapped = attr.programSectionFlag === false;
      return isUnmapped;
    });
    // Generate unique key based on actual data
    const sectionKey = `unmapped-${refreshTrigger}-${unmappedAttributes.length}-${Date.now()}`;

    return (
      <div key={sectionKey}>
        {/* <Toaster
          containerStyle={{ zIndex: 99999 }}
          position="bottom-right"
          reverseOrder={false}
        /> */}
        <Accordion key={sectionKey} defaultActiveKey={"unmapped"}>
          <Card key={`card-${sectionKey}`} className="regcard">
            <Card.Header className="regcardheader d-flex justify-content-between">
              <Accordion.Toggle
                onClick={() => { setDefaultActiveKey("unmapped") }}
                className="formtableheader"
                as={Button}
                variant="link"
                eventKey="unmapped"
              >
                <i className={`fas mr-2 ${defaultActiveKey == "unmapped" ? "fa-minus" : "fa-plus"}`}></i>
                <span>Unmapped Questions </span>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="unmapped">
              <Card.Body className="regcardbody">
                {unmappedAttributes.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table ss table-hover" id="programserviceTBL">
                      <thead>
                        <tr>
                          <th width="25%">Questions</th>
                          <th>Type</th>
                          <th>Mandatory</th>
                          <th>Display In Line List</th>
                          <th>Searchable</th>
                          <th>Core Type</th>
                          <th className="text-center">Actions</th>
                          {/* <th className="text-center">Sequence</th> */}
                        </tr>
                      </thead>
                      <tbody key={`tbody-${sectionKey}`} className="formsbody">
                        {renderAttributes(unmappedAttributes, sectionKey)}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>All questions have been mapped to sections.</p>
                  </div>
                )}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  };

  return (
    <>
      {/* <Toaster
        containerStyle={{ zIndex: 99999 }}
        position="bottom-right"
        reverseOrder={false}
      /> */}
      <div className="row pt-1">
        <div className="col-12 bnBtn">
          <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step1'))} >Back</button>
          <div>
            {storeState.user.isEdit ?
              <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
                onClick={() => {
                  setQuestionObject({
                    mandatory: false,
                    searchable: false,
                    displayInList: false,
                    name: '',
                    attributeRefType: '',
                  });
                  setOptionsArray([]);
                  let tempArr = [];
                  userInputs.languages.map((el) => {
                    tempArr.push({
                      locale: el.value,
                      property: 'NAME',
                      value: '',
                    });
                  });
                  setLanguagesArray(tempArr);
                  setOptionValuesLocaleArray([]);
                  setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null);
                  setDataVariableToggle(true);
                  setRenderMobileViewToggle(false);
                  setaddNewSectionToggle(false);
                  setRenderSectionToggle(false)
                  setDeleteVariableToggle(false);
                  setIsEditQuestion(false);
                }}
              >Add New Question</button>
              : <></>}
            {/* {storeState.user.isEdit ? <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
              onClick={() => {
                setDataVariableToggle(false)
                setDeleteVariableToggle(false)
                setRenderMobileViewToggle(false)
                setRenderSectionToggle(false)
                setaddNewSectionToggle((prev) => !prev)
                setSelectedSection({})
                setSelectedOptions({})
                // setRenderMobileViewToggle((prev) => !prev)
              }} > Add New Section</button>
              : <></>} */}
            {storeState.user.isEdit ?
              <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
                onClick={() => {
                  setDataVariableToggle(false)
                  setDeleteVariableToggle(false)
                  setRenderMobileViewToggle(false)
                  setaddNewSectionToggle(false)
                  setRenderSectionToggle((prev) => !prev)
                  setSelectedSection({})
                  setSelectedOptions({})
                  // setRenderMobileViewToggle((prev) => !prev)
                }} >Add & Configure Sections</button>
              : <></>}
            {/* Hiding Show Preview functionality  */}
            {/* <button tabIndex="-1" type="button" className="btn wizard-btnb  mr-2"
              onClick={() => {
                setDataVariableToggle(false)
                setDeleteVariableToggle(false)
                setaddNewSectionToggle(false)
                setRenderMobileViewToggle((prev) => !prev)
                setRenderSectionToggle(false)
              }} > {renderMobileViewToggle ? 'Hide' : 'Show'}  Preview</button> */}

            <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => {
              let tempHolder = userTemplate
              tempHolder['attributedependentquestions'] = dependentArray;
              tempHolder['deletedObjects'].deletedAttribute = deletedAttributeArray;
              tempHolder['programSections'] = programSections;
              dispatch(setUserTemplate(userTemplate))
              dispatch(setActiveTab('step3'))
            }} >Next
            </button>
          </div>
        </div>
      </div>
      <div className="row m-2 grid-container">
        <div className=" left">
          {/* Render Registration Section */}
          <Card key="registration" className="regcard">
            <Card.Header className="regcardheader d-flex justify-content-between">
              <span>

                Registration
              </span>
              <span>
                {/* Hiding Add from deleted list functionality  */}
                {/* {storeState.user.isEdit ? (
                  <i
                    onClick={() => {
                      setDeleteVariableToggle(true);
                      setRenderMobileViewToggle(false);
                      setDataVariableToggle(false);
                    }}
                    title="Add From Deleted List"
                    className="fa-solid fa-list mr-2"
                  ></i>
                ) : null} */}
                {/* <span
                  onClick={() => {
                    setQuestionObject({
                      mandatory: false,
                      searchable: false,
                      displayInList: false,
                      name: '',
                      attributeRefType: '',
                    });
                    setOptionsArray([]);
                    let tempArr = [];
                    userInputs.languages.map((el) => {
                      tempArr.push({
                        locale: el.value,
                        property: 'NAME',
                        value: '',
                      });
                    });
                    setLanguagesArray(tempArr);
                    setOptionValuesLocaleArray([]);
                    setKey(userInputs && userInputs.languages ? userInputs.languages[0].value : null);
                    setDataVariableToggle(true);
                    setRenderMobileViewToggle(false);
                    setaddNewSectionToggle(false);
                    setRenderSectionToggle(false)
                    setDeleteVariableToggle(false);
                    setIsEditQuestion(false);
                  }}
                  title="Add Question"
                  className="addsign"
                >
                  <i aria-hidden="true" className="fa fa-plus"></i>
                </span> */}
              </span>
            </Card.Header>
          </Card>
          {/* Render Program Sections */}
          {programSections.map((section, sectionIndex) => renderSection(section, sectionIndex))}
          {/* Render Unmapped Questions Section */}
          {renderUnmappedSection()}
          {/* <div className="form-group is-empty" id="eligible"><label className="col-form-label"><span>Eligible for TPT(Age in Years)</span></label><div className="form-inline"><input type="number" className="form-control if w-25" /> -<input type="number" className="form-control if w-25" /></div></div> */}
        </div>
        {dataVariableToggle ?
          <div className="ml-3 right">
            <Formik
              key={tempKey}
              innerRef={formRef}
              initialValues={questionObject}
              enableReinitialize
              validationSchema={questionObjectSchema}
              onSubmit={values => {
                pushQuestion(values)
              }}
            >
              {({ errors, touched, resetForm, values }) => {
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
                      <Card.Header className="regcardheader">{isEditQuestion ? "Edit Question" : "Add Question"}
                        <span className="closesign" onClick={() => setDataVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                      </Card.Header>
                      <Card.Body className="regtabbody">
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
                                      if (idx === 0) {
                                        return (
                                          <InputGroup key={`elm5_${id}`} className="mb-3">
                                            <FormControl
                                              key={`elm5_${id}`}
                                              id={id}
                                              onChange={(e) => {
                                                // ✅ Capture ORIGINAL name BEFORE overwriting
                                                const originalOptionName = optionsArray[id]

                                                // Update the optionsArray immutably
                                                const updatedOptionsArray = [...optionsArray]
                                                updatedOptionsArray[id] = e.target.value
                                                setOptionsArray(updatedOptionsArray)

                                                // ✅ Update optionValuesLocaleArray — rename the key from originalOptionName to new value
                                                const updatedLocaleArray = optionValuesLocaleArray.map((localeObj, localeIdx) => {
                                                  if (localeIdx !== id) return localeObj
                                                  // Get the existing locale data under the original key (as an array)
                                                  const existingData = localeObj[originalOptionName]
                                                  const localeData = Array.isArray(existingData)
                                                    ? existingData
                                                    : Object.values(existingData || {}).filter(v => v && v.locale)
                                                  // ✅ Remove old key, set new key (renamed option name)
                                                  const { [originalOptionName]: _removed, ...rest } = localeObj
                                                  return {
                                                    ...rest,
                                                    [e.target.value]: localeData.length > 0
                                                      ? localeData
                                                      : userInputs.languages.map(lang => ({ locale: lang.value, property: 'NAME', value: '' }))
                                                  }
                                                })
                                                setOptionValuesLocaleArray(updatedLocaleArray)

                                                // Handle questionObject update
                                                if (isEditQuestion && questionObject.id) {
                                                  let tempObj = { ...questionObject }
                                                  if (!tempObj.options) tempObj.options = []
                                                  if (tempObj.options[id]) {
                                                    tempObj.options[id] = { ...tempObj.options[id], code: e.target.value, name: e.target.value, isupdate: true }
                                                  } else {
                                                    tempObj.options.push({ name: e.target.value, sortOrder: id })
                                                  }
                                                  tempObj.isupdate = true
                                                  setQuestionObject(tempObj)
                                                }
                                              }}
                                              value={el}
                                              type="text"
                                              className="form-control"
                                            />
                                            <Button
                                              variant="outline-secondary"
                                              onClick={() => {
                                                // **SIMPLY REMOVE FROM UI ARRAYS - pushQuestion will handle the rest**
                                                const updatedOptionsArray = optionsArray.filter((_, index) => index !== id);
                                                const updatedLocaleArray = optionValuesLocaleArray.filter((_, index) => index !== id);

                                                setOptionsArray(updatedOptionsArray);
                                                setOptionValuesLocaleArray(updatedLocaleArray);
                                              }}
                                            >
                                              <i className="fa fa-trash-alt"></i>
                                            </Button>

                                          </InputGroup>
                                        );
                                      } else {
                                        return (
                                          <InputGroup key={`elm6_${id}`} className="mb-3">
                                            <FormControl
                                              key={`elm6_${id}`}
                                              id={id}
                                              onChange={(e) => {
                                                if (isEditQuestion && questionObject.id) {
                                                  let tempObj = { ...questionObject };
                                                  if (tempObj.options && tempObj.options[id]) {
                                                    tempObj.options[id].isupdate = true;
                                                  }
                                                  setQuestionObject(tempObj);
                                                }

                                                let aH = [...optionValuesLocaleArray];
                                                aH[id][optionsArray[id]][idx].value = e.target.value;
                                                setOptionValuesLocaleArray([...aH]);
                                              }}
                                              value={
                                                optionValuesLocaleArray[id]
                                                  ? optionValuesLocaleArray[id][optionsArray[id]]
                                                    ? optionValuesLocaleArray[id][optionsArray[id]][idx]
                                                      ? optionValuesLocaleArray[id][optionsArray[id]][idx].value
                                                      : null
                                                    : null
                                                  : null
                                              }
                                              type="text"
                                              className="form-control"
                                            />
                                          </InputGroup>
                                        );
                                      }
                                    })}

                                    {idx == 0 ?
                                      (
                                        <div className="d-flex flex-column justify-content-center align-items-start w-100">
                                          <Button
                                            key={`elm__6` + idx}
                                            onClick={() => {
                                              setOptionsError("");  // Clear any previous error

                                              // Check if there's an empty option in optionsArray
                                              const hasEmptyOption = optionsArray.some(option => option.trim() === "");
                                              if (hasEmptyOption) {
                                                setOptionsError("Please fill in all options before adding a new one.");
                                                return;
                                              }

                                              // Proceed with adding a new option if all options are filled
                                              setOptionsArray([...optionsArray, '']);
                                              const temp = userInputs.languages.map((lang) => ({
                                                locale: lang.value,
                                                property: "NAME",
                                                value: ""
                                              }));
                                              setOptionValuesLocaleArray([...optionValuesLocaleArray, { '': temp }]);
                                            }}
                                            className="addbtn btn-sm"
                                          >
                                            Add Options
                                          </Button>

                                          {/* Display error message if optionsError is set */}
                                          {optionsError && <div className="text-danger mt-2">{optionsError}</div>}
                                        </div>
                                      )
                                      : null
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
                                      checked={field?.value == 'true' || field?.value == true}
                                      name="mandatory"
                                      type="radio"
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
                                      value='false'
                                      name="mandatory"
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
                              const currentQuestionName = isEditQuestion ? questionObject.name : null;
                              const isProgramPublished = storeState.user.isEdit;

                              const parentCandidates = attribuetArray.filter((el) => {
                                const isValidType = el.attributeRefType === 'optionset' || el.attributeRefType === 'checkbox';
                                const notCheckboxOption = !el.isCheckboxOption;
                                const notSelf = el.name !== currentQuestionName;
                                const hasValidId = isProgramPublished ? !!el.trackedEntityAttributeId : true;
                                return isValidType && notCheckboxOption && notSelf && hasValidId;
                              });

                              return (
                                <>
                                  <Form.Label className="label">Parent question</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="parentQuestion"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      form.setFieldValue('parentQuestion', value);
                                      form.setFieldValue('dependentValue', '');
                                    }}
                                  >
                                    <option value="">-</option>
                                    {parentCandidates.map((el) => (
                                      <option key={el.name} value={el.name}>
                                        {el.name}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </>
                              );
                            }}
                          </Field>
                        </Form.Group>

                        {formRef.current !== null && formRef.current.values.parentQuestion && formRef.current.values.parentQuestion !== "" ? (
                          <Form.Group>
                            <Field name="dependentValue">
                              {({ field, form }) => {
                                const parentQuestionName = formRef.current?.values?.parentQuestion;

                                if (!parentQuestionName) return null;

                                const parentQuestion = attribuetArray.find(el => el.name === parentQuestionName);

                                if (!parentQuestion) return null;

                                let optionsList = [];
                                if (parentQuestion.type === 'optionset' || parentQuestion.attributeRefType === 'optionset') {
                                  optionsList = parentQuestion.optionvalues || [];
                                } else if (parentQuestion.type === 'checkbox' || parentQuestion.attributeRefType === 'checkbox') {
                                  optionsList = parentQuestion.checkboxoption || [];
                                }

                                return (
                                  <>
                                    <Form.Label className="label">Dependent Value</Form.Label>
                                    <Form.Control
                                      as="select"
                                      name="dependentValue"
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        form.setFieldValue('dependentValue', e.target.value);
                                      }}
                                    >
                                      <option value="">-</option>
                                      {optionsList.map((option, idx) => (
                                        <option key={`${option}-${idx}`} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </Form.Control>
                                    {isSubmitDisabled && (
                                      <Form.Text style={{ color: "red", fontSize: 12 }}>
                                        Dependent Value is required when a Parent Question is selected.
                                      </Form.Text>
                                    )}
                                  </>
                                );
                              }}
                            </Field>
                          </Form.Group>
                        ) : null}

                        <div>
                          <Button type="submit" className="addbtn"
                            disabled={isSubmitDisabled}
                            style={{
                              opacity: isSubmitDisabled ? 0.6 : 1,
                              cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                            }}>
                            {isEditQuestion ? 'Update' : 'Add'}
                          </Button>
                        </div>

                      </Card.Body>
                    </Card>
                  </FForm>
                );
              }}
            </Formik>
          </div>
          : null}
        {
          deleteVariableToggle ?
            <div className=" ml-3 right">
              <Card>
                <Card.Header className="regcardheader">Deleted Questions List
                  <span className="closesign" onClick={() => setDeleteVariableToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                </Card.Header>
                <Card.Body className="regtabbody">
                  <Select
                    className="basic-multi-select multiselect"
                    classNamePrefix="select"
                    isMulti
                    options={deletedAttributeArray}
                    menuIsOpen={true}
                    components={animatedComponents}
                    onChange={onElementSelect}
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button onClick={pushQuestionListToAttribute} className="addbtn mt-3"> Add</Button>
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
              <div className=" ml-3 right">
                {/* <div class="tab">
                </div> */}
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
                        <Card.Header className="regcardheader">Add / Configure Section
                          <span className="closesign"
                            onClick={() => {
                              setRenderSectionToggle(false)
                              setaddNewSectionToggle(false)
                            }
                            }
                          >
                            <i aria-hidden="true" className="fa fa-times"></i></span>
                        </Card.Header>
                        <Card.Body className="regtabbody">
                          <div className="d-flex justify-content-end">
                            <button class="tablinks" className="btn wizard-btnb p-30" onClick={() => {
                              setRenderSectionToggle((prev) => !prev)
                              setaddNewSectionToggle(false)
                            }
                            }>Configure Section</button>
                          </div>
                          <Form.Group>
                            <Field name='name'>
                              {({ field, meta }) => {
                                return (
                                  <>
                                    <Form.Label className="label">* Enter Section Name</Form.Label>
                                    <input type="text" className='form-control' required placeholder="Enter Section Name" {...field} ></input>
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
            <>
              <div className=" ml-3 right">
                {/* <div class="tab">
                </div> */}
                <Formik
                  innerRef={sectionFormRef}
                  initialValues={{}}
                  enableReinitialize
                  validationSchema={sectionObjectSchema}
                  onSubmit={values => {
                    updateSectionConf(values)
                  }}
                >
                  {({ errors, touched }) => (
                    <FForm className="">
                      <Card>
                        <Card.Header className="regcardheader">Add / Configure Section
                          <span className="closesign" onClick={() => setRenderSectionToggle(false)}><i aria-hidden="true" className="fa fa-times"></i></span>
                        </Card.Header>
                        <Card.Body className="regtabbody">
                          <div className="d-flex justify-content-end">

                            <button class="tablinks" className="btn wizard-btnb p-30" onClick={() => {
                              setaddNewSectionToggle((prev) => !prev)
                              setRenderSectionToggle(false)
                            }
                            }>Add New Section</button>
                          </div>
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
                                      onChange={handleSectionChange}
                                    >
                                      <option value="">Select Section</option>
                                      {programSections.filter(section => section.id).map(section => {
                                        return <option value={section.name}>{section.name}</option>
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
                          <Form.Group controlId="formSelectLanguages">
                            <Field name='dataElements'>
                              {({ field, meta }) => {
                                return (
                                  <>
                                    <Form.Label className="label">Select Questions</Form.Label>
                                    <Select
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      isMulti
                                      // required={true}
                                      options={options}
                                      onChange={handleOptionsChange}
                                      value={selectedOptions}
                                    // {userTemplate.selectedlanguage}
                                    //isClearable={true}
                                    //isSearchable={true}
                                    // onChange={onChange}
                                    />
                                  </>
                                )
                              }}
                            </Field>
                            <ErrorMessage
                              component={TextError}
                              name="dataElements"
                            />
                          </Form.Group>
                          <div>
                            <Button type="submit" className="addbtn"> Update</Button>
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
          renderMobileViewToggle ? <>
            <div className="smartphone">
              <div className="header">
                Registration
              </div>
              <Formik
                // initialValues={}
                enableReinitialize
                onSubmit={values => {
                }}
              >
                <FForm className="">
                  {_.sortBy(attribuetArray, 'sortOrder').map((element, idx) => {
                    if (element.type == 'text') {
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
                    if (element.type == 'number') {
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
                    if (element.type == 'date') {
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
                    if (element.type == 'optionset') {
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
                    if (element.type == 'checkbox') {
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
                  })
                  }
                </FForm>
              </Formik>
            </div>
          </> : null
        }
      </div>
      <div className="row pt-1 mb-4">
        <div className="col-12 bnBtn">
          <button tabIndex="-1" type="button" className="btn wizard-btnb  ml-3" onClick={() => dispatch(setActiveTab('step1'))}>Back</button>
          <button tabIndex="-1" type="button" className="btn wizard-btnn  mr-3" onClick={() => {
            let tempHolder = userTemplate
            tempHolder['attributedependentquestions'] = dependentArray;
            tempHolder['deletedObjects'].deletedAttribute = deletedAttributeArray;
            tempHolder['programSections'] = programSections;
            dispatch(setUserTemplate(userTemplate))
            dispatch(setActiveTab('step3'))
          }} >Next
          </button>
        </div>
      </div>
    </>
  )
}
export default RegistrationStep;