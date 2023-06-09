import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import styles from "../../master/UserCreation/UserCreation.module.css";
import Swal from "sweetalert2";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import { CgSoftwareDownload } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PreLoader from "../../UI/PreLoader";
import DocumentUploadForm from "./DocumentUploadForm";

const selectState = {
  customer: null,
  entrydate: "",
  calltype: null,
  executiveName: null,
  procurement: null,
  businessForecast: null,
  forecastStatus: null,
  addInfo: "",
  nxtFollowupDate: "",
  callcloseStatus: null,
  callcloseDate: "",
  remarks: "",
};



const selectStateErr = {
  customer: "",
  calltype: "",
  businessForecast: "",
  forecastStatus: "",
};

const optionsForCallCloseStatus = [
  { value: "1", label: "Completed" },
  { value: "2", label: "Order List" },
];

const CallLogCreation = () => {
  usePageTitle("Call Log Creation");
  const { server1: baseUrl } = useBaseUrl();
  const { id } = useParams();
  const navigate = useNavigate();
  const [optionsForCallList, setOptionsForCallList] = useState([]);
  const [optionsForCutomerList, setOptionsForCutomerList] = useState([]);
  const [optionsForBizzList, setOptionsForBizzList] = useState([]);
  const [optionsForStatusList, setOptionsForStatusList] = useState([]);
  const [optionsForProcurement, setOptionsForProcurement] = useState([]);
  const [optionsForExecutive, setOptionsForExecutive] = useState([]);
  const ref = useRef();
  const wrapperRef = useRef(null);
  // const [file, setFile] = useState(selectFiles);
  // const [fileCheck, setFileCheck] = useState(null);
  // const [fileListCheck, setFileListCheck] = useState(null);
  // const [fileData, SetFileData] = useState([]);

  const [checked, setChecked] = useState("nextFollowUp");
  const [check, setCheck] = useState(false); //handleing the visibility of procurement type dropdown input field

  const [input, setInput] = useState(selectState);
  const [inputValidation, setInputValidation] = useState(selectStateErr);
  const [dataSending, setDataSending] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [fetchedData, setFetchedData] = useState([]);
  const [isEdited, setEdited] = useState({
    customer: false,
    calltype: false,
    bizztype: false,
    bizz_status_type: false,
    procurement: false,
    callcloseStatus: false,
    executiveName: false,
  });
  const [isFetching, setIsFetching] = useState({
    customer: true,
    calltype: true,
    bizztype: true,
    bizz_status_type: true,
    procurement: true,
    callcloseStatus: true,
    executiveName: true,
    formData: true,
  });

  useEffect(() => {
    if (
      input.customer?.value &&
      input.entrydate &&
      input.calltype?.value &&
      input.executiveName?.value &&
      input.procurement?.value &&
      input.businessForecast?.value &&
      input.forecastStatus?.value &&
      // input.addInfo.value &&
      (input.nxtFollowupDate
        ? input.nxtFollowupDate
        : input.callcloseStatus?.value && input.callcloseDate)
      //  && input.remarks.value
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [input]);

  const InitialRequest = async () => {
    await axios.get(`${baseUrl}/api/calltype/list`).then((res) => {
      setOptionsForCallList(res.data?.calltype);
      setIsFetching((prev) => {
        return { ...prev, calltype: false };
      });
    });

    await axios.get(`${baseUrl}/api/customer/list`).then((res) => {
      setOptionsForCutomerList(res.data?.customerList);
      setIsFetching((prev) => {
        return { ...prev, customer: false };
      });
    });

    await axios.get(`${baseUrl}/api/user/list`).then((res) => {
      setOptionsForExecutive(res.data?.user);
      setIsFetching((prev) => {
        return { ...prev, executiveName: false };
      });
    });

    await axios.get(`${baseUrl}/api/procurementlist/list`).then((res) => {
      setOptionsForProcurement(res.data?.procurementlist);
      setIsFetching((prev) => {
        return { ...prev, procurement: false };
      });
    });
    if (id) {
      await axios.get(`${baseUrl}/api/callcreation/${id}`).then((res) => {
        let fetcheddata = res.data.showcall[0];
        setInput((prev) => {
          return {
            ...prev,
            entrydate: fetcheddata.call_date,
            addInfo: fetcheddata.additional_info,
            nxtFollowupDate: fetcheddata.next_followup_date
              ? fetcheddata.next_followup_date
              : "",
            callcloseDate: fetcheddata.close_date ? fetcheddata.close_date : "",
            remarks: fetcheddata.remarks ? fetcheddata.remarks : "",
          };
        });

        setEdited({
          customer: false,
          calltype: false,
          bizztype: false,
          bizz_status_type: false,
          procurement: false,
          callcloseStatus: false,
          executiveName: false,
        });
        setFetchedData(res.data.showcall[0]);
        if (fetcheddata?.calltype?.label !== "General Customer Visit") {
          setCheck(true);
        }
      });
    }
    setIsFetching((prev) => {
      return { ...prev, formData: false };
    });
  };

  useEffect(() => {
    InitialRequest();
  }, []);

  useEffect(() => {
    if (
      id &&
      fetchedData?.cust_id &&
      !isEdited.customer &&
      optionsForCutomerList?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          customer: optionsForCutomerList.find(
            (x) => x.value === fetchedData.cust_id
          ),
        };
      });
    }
  }, [fetchedData.cust_id, optionsForCutomerList]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.user_id &&
      !isEdited.executiveName &&
      optionsForExecutive?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          executiveName: optionsForExecutive.find(
            (x) => x.value === fetchedData.user_id
          ),
        };
      });
    }
  }, [fetchedData.user_id, optionsForExecutive]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.call_id &&
      !isEdited.calltype &&
      optionsForCallList?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          calltype: optionsForCallList.find(
            (x) => x.value === fetchedData.call_id
          ),
        };
      });
    }
  }, [fetchedData.call_id, optionsForCallList]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.bizz_id &&
      !isEdited.bizztype &&
      optionsForBizzList?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          businessForecast: optionsForBizzList.find(
            (x) => x.value === fetchedData.bizz_id
          ),
        };
      });
    }
  }, [fetchedData.bizz_id, optionsForBizzList]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.bizz_status_id &&
      !isEdited.bizz_status_type &&
      optionsForStatusList?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          forecastStatus: optionsForStatusList.find(
            (x) => x.value === fetchedData.bizz_status_id
          ),
        };
      });
    }
  }, [fetchedData.bizz_status_id, optionsForStatusList]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.proc_id &&
      !isEdited.procurement &&
      optionsForProcurement?.length > 0
    ) {
      setInput((prev) => {
        return {
          ...prev,
          procurement: optionsForProcurement.find(
            (x) => x.value === fetchedData.proc_id
          ),
        };
      });
    }
  }, [fetchedData.proc_id, optionsForProcurement]);

  useEffect(() => {
    if (
      id &&
      fetchedData?.close_status_id &&
      !isEdited.callcloseStatus &&
      optionsForCallCloseStatus?.length > 0
    ) {
      //callcloseStatus
      setInput((prev) => {
        return {
          ...prev,
          callcloseStatus: optionsForCallCloseStatus.find(
            (x) => x.value == fetchedData.close_status_id
          ),
        };
      });
      if (fetchedData.close_status_id && fetchedData.close_date) {
        setChecked("closed");
      }
    }
  }, [fetchedData.close_status_id, optionsForCallCloseStatus]);

  // useEffect(()=>{
  //   if(checked === fet)
  //   {

  //   }
  // },[checked, isEdited.callcloseStatus,fetchedData.close_status_id])

  useEffect(() => {
    setIsFetching((prev) => {
      return { ...prev, bizztype: true };
    });
    if (input.calltype?.value) {
      axios
        .get(`${baseUrl}/api/bizzlist/list/${input.calltype?.value}`)
        .then((res) => {
          setOptionsForBizzList(res.data.bizzlist);
        });
    } else {
      setOptionsForBizzList(null);
    }
    setInput({ ...input, businessForecast: null });
    setIsFetching((prev) => {
      return { ...prev, bizztype: false };
    });
  }, [input.calltype]);

  useEffect(() => {
    setIsFetching((prev) => {
      return { ...prev, bizz_status_type: true };
    });
    if (input.businessForecast?.value) {
      axios
        .get(`${baseUrl}/api/statuslist/list/${input.businessForecast?.value}`)
        .then((res) => {
          setOptionsForStatusList(res.data?.statuslist);
        });
    } else {
      setOptionsForStatusList(null);
    }
    setInput({ ...input, forecastStatus: null });
    setIsFetching((prev) => {
      return { ...prev, bizz_status_type: false };
    });
  }, [input.businessForecast]);

  useEffect(() => {
    if (checked === "closed") {
      setInput({ ...input, nxtFollowupDate: "" });
    }
    if (checked === "nextFollowUp") {
      setInput({
        ...input,
        callcloseDate: "",
        callcloseStatus: "",
        remarks: "",
      });
    }
  }, [checked]);

  const inputHandlerFortext = (e) => {
    if (e.target.name == "nxtFollowupDate") {
      let today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);
      const curr = `${year}-${month}-${day}`;
      if (e.target.value < curr) {
        setInputValidation({ ...inputValidation, [e.target.name]: true });
        setInput((prev) => {
          return { ...prev, [e.target.name]: curr };
        });
      } else {
        setInputValidation({ ...inputValidation, [e.target.name]: false });
        setInput((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
      }
    } else if (e.target.name == "callcloseDate") {
      let today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);
      const curr = `${year}-${month}-${day}`;
      if (e.target.value > curr) {
        setInputValidation({ ...inputValidation, [e.target.name]: true });
        setInput((prev) => {
          return { ...prev, [e.target.name]: curr };
        });
      } else {
        setInputValidation({ ...inputValidation, [e.target.name]: false });
        setInput((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
      }
    } else {
      setInput((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };

  const inputHandlerForSelect = (value, action) => {
    setInput((prev) => {
      return { ...prev, [action.name]: value };
    });

    if (value === "" || value === null) {
      setInputValidation({ ...inputValidation, [action.name]: true });
    } else {
      setInputValidation({ ...inputValidation, [action.name]: false });
    }

    if (
      action.name == "calltype" &&
      value?.label !== "General Customer Visit"
    ) {
      setCheck(true);
    } else if (
      action.name == "calltype" &&
      value?.label === "General Customer Visit"
    ) {
      setCheck(false);
    }

    if (action.name === "calltype") {
      setEdited({ calltype: true, bizztype: true, bizz_status_type: true });
    } else if (action.name === "businessForecast") {
      setEdited({ ...isEdited, bizztype: true, bizz_status_type: true });
    } else if (action.name === "forecastStatus") {
      setEdited({ ...isEdited, bizz_status_type: true });
    }
    if (action.name === "callcloseStatus") {
      setEdited({ ...isEdited, callcloseStatus: true });
    }
  };

  const cancelHandler = () => {
    navigate("/tender/calllog/");
  };

  //   const handleFile = (e) => {
  //     const Files = e.target.files[0];
  //     const FilesValue = e.target.value;
  //     const fileName = Files.name;
  //     const fileType = Files.type;
  //     const fileSize = Files.size + " KB";
  //     const url = URL.createObjectURL(Files); // this points to the File object we just created
  //     // document.querySelector('img').src = url;

  //     // FileMatch
  //     const pngFile = fileName.match("png");
  //     const csvFile = fileName.match("csv");
  //     const mswordFile = fileName.match("docx");
  //     const zipFile = fileName.match("zip");
  //     const pdfFile = fileName.match("pdf");
  //     const msxlFile = fileName.match("vnd.ms-excel");
  //     const xlFile = fileName.match("xlsx");
  //     const osFile = fileName.match("octet-stream");
  //     const rarFile = fileName.match("rar");

  //     setFile({
  //       ...file,
  //       name: fileName,
  //       type: fileType,
  //       size: fileSize,
  //       value: FilesValue,
  //       src: pngFile
  //         ? url
  //         : csvFile
  //         ? csv
  //         : mswordFile
  //         ? msWord
  //         : zipFile
  //         ? zip
  //         : pdfFile
  //         ? pdf
  //         : msxlFile
  //         ? xls
  //         : xlFile
  //         ? xls
  //         : osFile
  //         ? zip
  //         : rarFile
  //         ? rar
  //         : blank,
  //     });
  //     setFileCheck(true);
  //   };

  //   const objectData = {
  //     name: file.name,
  //     size: file.size,
  //     pic: file.src,
  //   };
  // console.log(fileData);
  //   const handleFileAdd = (e) => {
  //     e.preventDefault();
  //     let updated = [...fileData];
  //     console.log("file",file);
  //     updated.push(objectData);
  // //$$$
  //     SetFileData(updated);
  //     setFileListCheck(true);
  //     setFileCheck(false);
  //     Swal.fire({
  //       text: "Uploaded Successfully",
  //       icon: "success",
  //       confirmButtonColor: "#12c350",
  //     });
  //   };

  //   const removePreview = (e) => {
  //     e.preventDefault();
  //     setFileCheck(false);
  //   };

  //   let fileCount = 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target); // Get the form data
    let data = {
      customer_id: input.customer.value,
      call_date: input.entrydate,
      call_type_id: input.calltype.value,
      executive_id: input.executiveName.value,
      procurement_type_id: input.procurement.value,
      bizz_forecast_id: input.businessForecast.value,
      bizz_forecast_status_id: input.forecastStatus.value,
      additional_info: input.addInfo ? input.addInfo : null,
      next_followup_date: input.nxtFollowupDate ? input.nxtFollowupDate : null,
      close_status_id: input.nxtFollowupDate
        ? ""
        : input?.callcloseStatus?.value,
      close_date: input.callcloseDate ? input.callcloseDate : null,
      remarks: input.remarks ? input.remarks : null,
      tokenid: localStorage.getItem("token"),
    };
    setDataSending(true);
    if (id) {
      putData(data, id);
    } else {
      postData(data);
    }
  };

  const postData = (data) => {
    axios
      .post(`${baseUrl}/api/callcreation`, data) // Create an Axios request
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "New Call",
            text: "Created Successfully!",
            confirmButtonColor: "#5156ed",
          });
          navigate("/tender/calllog");
          setDataSending(false);
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "New Call",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
  };

  const putData = (data, id) => {
    axios.put(`${baseUrl}/api/callcreation/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Call Log",
          text: "Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
        // navigate('/tender/calllog')
        setDataSending(false);
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Call Log",
          text: res.data.errors,
          confirmButtonColor: "#5156ed",
        });
        setDataSending(false);
      }
    });
  };

  return (
    <PreLoader loading={isFetching.formData}>
      <div className="CallLogsCreation">
        <div className="card shadow p-2 mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row align-items-center">
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label htmlFor="customer" className="font-weight-bold">
                        Customer Name
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="customer"
                        id="customer"
                        isSearchable="true"
                        isClearable="true"
                        isLoading={isFetching.customer}
                        options={optionsForCutomerList}
                        value={input.customer}
                        onChange={inputHandlerForSelect}
                      ></Select>
                      {inputValidation.customer && (
                        <div className="pt-1">
                          <span className="text-danger font-weight-bold">
                            Enter Customer Name
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label htmlFor="date" className="font-weight-bold">
                        Date
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="myDate"
                        name="entrydate"
                        onChange={(e) => inputHandlerFortext(e)}
                        value={input.entrydate}
                      />
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label htmlFor="calltype" className="font-weight-bold">
                        Call Type{" "}
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="calltype"
                        id="calltype"
                        isSearchable="true"
                        isClearable="true"
                        isLoading={isFetching.calltype}
                        options={optionsForCallList}
                        value={input.calltype}
                        onChange={inputHandlerForSelect}
                      ></Select>
                      {inputValidation.calltype && (
                        <div className="pt-1">
                          <span className="text-danger font-weight-bold">
                            Enter CallType List
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label
                        htmlFor="executiveName"
                        className="font-weight-bold"
                      >
                        Executive Name
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        id="executiveName"
                        name="executiveName"
                        isSearchable="true"
                        isClearable="true"
                        isLoading={isFetching.executiveName}
                        options={optionsForExecutive}
                        value={input.executiveName}
                        onChange={inputHandlerForSelect}
                      ></Select>
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label
                        htmlFor="businessForecast"
                        className="font-weight-bold"
                      >
                        Business Forecast
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="businessForecast"
                        id="businessForecast"
                        isSearchable={true}
                        isClearable={true}
                        isLoading={isFetching.bizztype}
                        options={optionsForBizzList}
                        value={input.businessForecast}
                        onChange={inputHandlerForSelect}
                      ></Select>
                      {inputValidation.businessForecast && (
                        <div className="pt-1">
                          <span className="text-danger font-weight-bold">
                            Enter BusinessForecast
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {check ? (
                  <div className="inputgroup col-lg-6 mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-dark">
                        <label
                          htmlFor="procurement"
                          className="font-weight-bold"
                        >
                          Procurement Type
                        </label>
                      </div>
                      <div className="col-lg-8">
                        <Select
                          name="procurement"
                          id="procurement"
                          isSearchable="true"
                          isClearable="true"
                          isLoading={isFetching.procurement}
                          options={optionsForProcurement}
                          value={input.procurement}
                          onChange={inputHandlerForSelect}
                        ></Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="inputgroup col-lg-6 mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-dark"></div>
                    </div>
                  </div>
                )}
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label
                        htmlFor="forecastStatus"
                        className="font-weight-bold"
                      >
                        Status
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="forecastStatus"
                        id="forecastStatus"
                        isSearchable="true"
                        isClearable="true"
                        isLoading={isFetching.bizz_status_type}
                        options={optionsForStatusList}
                        value={input.forecastStatus}
                        onChange={inputHandlerForSelect}
                      ></Select>
                      {inputValidation.forecastStatus && (
                        <div className="pt-1">
                          <span className="text-danger font-weight-bold">
                            Enter Status
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark ">
                      <label htmlFor="action " className="font-weight-bold">
                        Action
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="nxtRadio">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="nxtRadio"
                            checked={checked === "nextFollowUp"}
                            name="callstatus"
                            value="nextFollowUp"
                            onChange={(e) => {
                              setChecked(e.target.value);
                            }}
                          />
                          Next Follow Up
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <label
                          className="form-check-label"
                          htmlFor="closedRadio"
                        >
                          <input
                            className="form-check-input mx-3"
                            type="radio"
                            id="closedRadio"
                            checked={checked === "closed"}
                            value="closed"
                            onChange={(e) => {
                              setChecked(e.target.value);
                            }}
                          />
                          Close
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label htmlFor="mobile" className="font-weight-bold">
                        Additional Info
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <textarea
                        id="addInfo"
                        className="form-control"
                        name="addInfo"
                        rows="4"
                        cols="50"
                        value={input.addInfo}
                        onChange={(e) => inputHandlerFortext(e)}
                      />
                    </div>
                  </div>
                </div>

                {checked === "nextFollowUp" ? (
                  <div className="inputgroup col-lg-6 mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-dark ">
                        <label
                          htmlFor="activeStatus "
                          className="font-weight-bold"
                        >
                          Next Follow Up
                        </label>
                      </div>
                      <div className="col-lg-8 mb-3">
                        <input
                          className="form-control"
                          name="nxtFollowupDate"
                          type="date"
                          value={input.nxtFollowupDate}
                          onChange={(e) => inputHandlerFortext(e)}
                        />
                      </div>
                      {inputValidation.nxtFollowupDate && (
                        <div className="pt-1">
                          <span className="text-danger font-weight-bold">
                            Date sholud be today or High
                          </span>
                        </div>
                      )}
                      {/* <div className="col-lg-4 text-dark ">
                            <label htmlFor="activeStatus " className="font-weight-bold" >Closer Week<   /label>
                        </div>
                        <div className="col-lg-8">                                        
                            <input className="form-control" type="week" />
                        </div> */}
                    </div>
                  </div>
                ) : checked === "closed" ? (
                  <div className="inputgroup col-lg-6 mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-dark ">
                        <label
                          htmlFor="callclosestatus "
                          className="font-weight-bold"
                        >
                          Close Status
                        </label>
                      </div>
                      <div className="col-lg-8 mb-3">
                        <Select
                          name="callcloseStatus"
                          id="callcloseStatus"
                          isSearchable="true"
                          isClearable="true"
                          isLoading={isFetching.callcloseStatus}
                          options={optionsForCallCloseStatus}
                          value={input.callcloseStatus}
                          onChange={inputHandlerForSelect}
                        ></Select>
                      </div>
                      <div className="col-lg-4 text-dark ">
                        <label htmlFor="closeDate" className="font-weight-bold">
                          Close Date
                        </label>
                      </div>
                      <div className="col-lg-8 mb-3">
                        <input
                          className="form-control"
                          name="callcloseDate"
                          type="date"
                          onChange={(e) => inputHandlerFortext(e)}
                          value={input.callcloseDate}
                        />
                        {inputValidation.callcloseDate && (
                          <div className="pt-1">
                            <span className="text-danger font-weight-bold">
                              Date sholud be today or past Date
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-4 text-dark ">
                        <label htmlFor="closeDate" className="font-weight-bold">
                          Remarks
                        </label>
                      </div>
                      <div className="col-lg-8">
                        <textarea
                          id="remarks"
                          className="form-control"
                          name="remarks"
                          rows="4"
                          cols="50"
                          value={input.remarks}
                          onChange={(e) => inputHandlerFortext(e)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="inputgroup col-lg-6 mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-dark "></div>
                    </div>
                  </div>
                )}

                <div className="inputgroup col-lg-12 mb-4 save_cancel">
                  <button
                    className="btn btn-primary mr-2"
                    type="submit"
                    disabled={dataSending || !isFormValid}
                  >
                    {!id
                      ? dataSending
                        ? "Saving"
                        : "Save"
                      : dataSending
                      ? "Updating"
                      : "Update"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={cancelHandler}
                    disabled={dataSending}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
            
           
          </div>
        </div>
      </div>
      <div>
             <DocumentUploadForm/>           
      </div>
    </PreLoader>
  );
};

export default CallLogCreation;
