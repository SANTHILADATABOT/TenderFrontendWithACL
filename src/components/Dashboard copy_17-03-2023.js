import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";
import "./logoicon.css";
import { usePageTitle } from "./hooks/usePageTitle";
import { motion } from "framer-motion";
import { ulbdataActions } from "./store/UlbDataSlice";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Slider } from '@mui/material';
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import Chart from "react-apexcharts";



function valueLabelFormat(value) {
  const units = ['0', "1 Lakh", "3 Lakh", "5 Lakh", "10 Lakh" , "20 Lakh", "Greater than 20 Lakh"];       
  return units[value];
}



function Dashboard() {
  const authCtx = useContext(AuthContext);

  // const authCtx = useContext(AuthContext);
  const { server1: baseUrl } = useBaseUrl();

  const [value, setValue] = React.useState([0,6]);
  
  const [data, setData] = useState([]);

  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const [Live_tenders_count, setLive_tenders_count] = useState(0);
  const [fresh_tenders_count, setfresh_tenders_count] = useState(0);
  const [awarded_tenders_count, setawarded_tenders_count] = useState(0);
  const [completed_tenders_count, setcompleted_tenders_count] = useState(0);
  const [running_tenders_count, setrunning_tenders_count] = useState(0);
  const [bidanalysis, setbidAnalysis] = useState({
    awarded: 0,
    // bid_submitted: 0,
    to_be_opened: 0,
    // bid_details: 0,
    in_tech_eval: 0,
    in_fin_eval: 0,
    cancelled: 0,
    retender: 0,
  });

  // const [ulbPopulation, setUlbPopulation]=useState("");

  
  const marks = [
    { value: 0, label: '0' },
    { value: 6, label: '20 Lakh >' },
  ]; // defines the start and end points for the slider

  // const state = [];
  // const count = [];
  // const countryId = [];
  // const id = [];
  // const pop = [];

  
  

  // let ulbdata = useSelector((state) => state.ulbpopulation.inputData)
  // const dispatch = useDispatch();

  // url: 'bidcreation/creation/live_tenders'
  usePageTitle("Dashboard");

  // useEffect(() => {
  //   // setChart();
  // }, []);

  // const setChart = () => {
  //   setOptions({
  //     chart: {
  //       id: "basic-bar",
  //     },
  //     colors: ['#29ca30','#252525'],
  //     xaxis: {
  //       labels: {
  //         rotate: 270,
  //         borderColor: "#00E396",
  //       },
  //       markers: {
  //         size: 6,
  //         strokeWidth: 3,
  //         fillOpacity: 0,
  //         strokeOpacity: 0,
  //         hover: {
  //           size: 8,
  //         },
  //       },
  //       categories: state,
  //     },
  //     // fill: {
  //     //   colors: ['#000','#d200a1'],
  //     // },
  //     title: {
  //       text: "ULB Details",
  //     },
  //     noData: {
  //       text: "Loading...",
  //     },
  //   });   
  //     setSeries([
  //         {
  //           name: "Count_No",
  //           data: count
  //         },          
  //       ])     
  // };

  // useEffect(()=>{
  //   dispatch(ulbdataActions.storeInput(ulbPopulation));
  // },[ulbPopulation])
  
  useEffect(()=>{
    //Tender Analysis
    axios.get(`${baseUrl}/api/dashboard/tenderanalysis`).then((resp) => {
      // console.log("Tender :",resp.data);
    });


  //Customer Analysis
  axios.get(`${baseUrl}/api/dashboard/ulbdetails`).then((resp) => {
   
    // if(resp.data.awarded_tender_count){
    // console.log("ULB :",resp.data);
    // setawarded_tenders_count(resp.data.awarded_tender_count)
    // }
  });
  // axios.get(`${baseUrl}/api/dashboard/ulbpopdetails`).then((resp) => {
  //   // if(resp.data.awarded_tender_count){
  //     setUlbPopulation(resp.data.ulbdetails);
  //   // console.log("POP :",resp.data.ulbdetails);
    
  //   // setawarded_tenders_count(resp.data.awarded_tender_count)
  //   // }
  // });
  
  
    
    //Customer Bid Analysis
  axios.get(`${baseUrl}/api/dashboard/bidanalysis`).then((resp) => {
    if (resp.data.status === 200) {     
      
      // console.log("Bid :", resp.data);

        setbidAnalysis({ awarded : resp.data.awarded.reduce((acc, item) => {
          return acc + item.count;
        },0),
        bid_submitted: resp.data.bid_submitted.reduce((acc, item) => {
          return acc + item.count;
        },0),
        to_be_opened : resp.data.to_be_opened.reduce((acc, item) => {
          return acc + item.count;
        },0),
        bid_details : resp.data.bid_details.reduce((acc, item) => {
          return acc + item.count;
        },0),
        in_tech_eval : resp.data.in_tech_eval.reduce((acc, item) => {
          return acc + item.count;
        },0),
        in_fin_eval : resp.data.in_fin_eval.reduce((acc, item) => {
          return acc + item.count;
        },0),
        cancelled : resp.data.cancelled.reduce((acc, item) => {
          return acc + item.count;
        },0),
        retender : resp.data.retender.reduce((acc, item) => {
          return acc + item.count;
        },0),
      })
    }
  });

  //Dashboard card
  axios
    .get(`${baseUrl}/api/bidcreation/creation/projectstatus`)
    .then((resp) => {
      // if(resp.data.awarded_tender_count){
// console.log("project status", resp);
      if (resp.data.status === 200) {
        resp.data.live_tender_count &&
          setLive_tenders_count(resp.data.live_tender_count);
        resp.data.fresh_tender_count &&
          setfresh_tenders_count(resp.data.fresh_tender_count);
        resp.data.awarded_tender_count &&
          setawarded_tenders_count(resp.data.awarded_tender_count);
        resp.data.completed_tenders_count &&
          setcompleted_tenders_count(resp.data.completed_tenders_count);
        resp.data.running_tenders_count &&
          setrunning_tenders_count(resp.data.running_tenders_count);
      } else {
        console.log("error");
      }

      // setawarded_tenders_count(resp.data.awarded_tender_count)
      // }

      // setcompleted_tenders_count()
    });
  },[])


  // useEffect(()=>{
  // //   if(ulbPopulation.length>0)
  // //   {    var unique = [];


      
  // //   ulbPopulation.forEach(element => {
  // //       if (!unique.includes(element.id)) {
  // //           unique.push(element.id);
  // //       }
  // //   })

  // // console.log("unique",unique);
  // // };
  // // sliderOnChange();
    
  // },[ulbPopulation])  



// const sliderOnChange=()=>{
//     let unit = [0,100000,300000,500000,1000000,2000000];
//     let value =[0,2];
//     let unique = [];
//     let chartValue = {};   
//     if(ulbPopulation)
//     {
     
//       ulbPopulation.forEach(element => {
//           if (!unique.includes(element.id)) {
//               unique.push(element.id);
//           }
// // console.log(" element.population2011",  element.population2011);
//           // chartValue[element.id] = {
//           //   count : ( chartValue[element.id]?.count || 0) + 1 ,
//           // } 

//           // //chartValue[state_id][count] = Ulb Count whom satisfy slider conditional values
//           //   chartValue[element.id]= ulbPopulation.reduce((result, item) => {
//           //     // console.log("parseInt(item.population2011) >= unit[value[0]]",parseInt(item.population2011) >= unit[value[0]])
//               // if(element.id === parseInt(item.id))
//               // {
//               if ((
//                 (value[0] < 6
//                   ? parseInt(element.population2011) >= unit[value[0]]
//                   : parseInt(element.population2011) >= unit[value[0]] - 1) &&
//                 (value[1] < 6
//                   ? parseInt(element.population2011) <= unit[value[1]]
//                   : parseInt(element.population2011) >= unit[value[1] - 1]) || (value[1] === 6 && (value[0] <6 ? parseInt(element.population2011) >= unit[value[0]] : parseInt(element.population2011) >= unit[value[0]-1] )))
//               ) {
//                 chartValue[element.state_code] = {
//                   count : ( chartValue[element.state_code]?.count || 0) + 1 ,
//                 }   
//               // }   
//             }
//           //     // console.log("result", result);     
//           //   })
         
//       })


//       console.log("chartValue",chartValue);

     




//     // const groupedData = ulbPopulation.reduce((result, item) => {
//     //   if()
//     //   {

//     //   }
//     //   // Check if the group already exists in the result array
//     //   // const group = result.find((group) => group?.id === item?.id);
      
//     //   // // If the group exists, add the value to the existing group
//     //   // if (group) {
//     //   //   group.count+=1;
//     //   // } else {
//     //   //   // If the group doesn't exist, create a new group and add it to the result array
//     //   //   result.push({item});
//     //   // }
//     //   // console.log("Result Array",result);
//     //   return result;
      
//     // });

//     // console.log("chartValue 00 : ",chartValue);
// }

// }

  // axios
  // .get(`${baseUrl}/api/dashboard/customeranalysis`)
  // .then((resp) => {

  // });
  // console.log("Bidanan - ",bidanalysis);


  const handleChange = (event, newValue) => { 
    setValue(newValue);
    console.log("newValue ", newValue); 
      };
//   return (
// <>
//       {/* Page Heading */}

//       <div className="d-sm-flex align-items-center justify-content-between mb-4">
//         <motion.h1
//           className="h3 mb-0 text-gray-800"
//           animate={{ opacity: 1 }}
//           initial={{ opacity: 0 }}
//         >
//           Dashboard
//         </motion.h1>
//       </div>

//       <div className="row">
//         {/* Content Row */}
//         <div className="col-xl-4 col-md-6 mb-4">
//           <motion.div
//             className="card  shadow h-100 py-2 border-left-primary border-3"
//             initial={{
//               x: 1300,
//               opacity: 0,
//             }}
//             animate={{
//               x: 0,
//               opacity: 1,
//             }}
//             transition={{
//               type: "tween",
//               stiffness: 10,
//               duration: 0.5,
//             }}
//           >
//             <div className="card-body ">
//               <div className="row no-gutters align-items-center ">
//                 <div className="col mr-2">
//                   <div className="h4 text-xl font-weight-bold text-primary text-uppercase mb-2 text-center">
//                     Live Tenders
//                   </div>

//                   <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
//                     {Live_tenders_count}
//                   </div>
//                 </div>
//                 <div className="col-auto">
//                   <div className="triangle-live"></div>
//                   {/* <i className="fas fa-calendar fa-2x text-gray-300" /> */}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="col-xl-4 col-md-6 mb-4">
//           <motion.div
//             className="card border-left-success shadow h-100 py-2  border-3"
//             initial={{
//               x: 1300,
//               opacity: 0,
//             }}
//             animate={{
//               x: 0,
//               opacity: 1,
//             }}
//             transition={{
//               type: "tween",
//               stiffness: 10,
//               duration: 0.5,
//               delay: 0.2,
//             }}
//           >
//             <div className="card-body">
//               <div className="row no-gutters align-items-center">
//                 <div className="col mr-2">
//                   <div className="h4 text-xl font-weight-bold text-success text-uppercase mb-2 text-center">
//                     Fresh Tenders
//                   </div>
//                   <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
//                     {fresh_tenders_count}
//                   </div>
//                 </div>
//                 <div className="col-auto">
//                   <div className="triangle-fresh"></div>
//                   {/* <i className="fas fa-clipboard-list fa-2x text-gray-300" /> */}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="col-xl-4 col-md-6 mb-4">
//           <motion.div
//             className="card border-left-info shadow h-100 py-2 triangle-awarded border-3"
//             initial={{
//               x: 1300,
//               opacity: 0,
//             }}
//             animate={{
//               x: 0,
//               opacity: 1,
//             }}
//             transition={{
//               type: "tween",
//               stiffness: 10,
//               duration: 0.5,
//               delay: 0.3,
//             }}
//           >
//             <div className="card-body">
//               <div className="row no-gutters align-items-center">
//                 <div className="col mr-2">
//                   <div className="h4 text-xl font-weight-bold text-info text-uppercase mb-2 text-center">
//                     Awarded Tenders
//                   </div>
//                   <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
//                     {awarded_tenders_count}
//                   </div>
//                 </div>
//                 <div className="col-auto">
//                   <div className="triangle-info"></div>
//                   {/* <i className="fas fa-clipboard-list fa-2x text-gray-300" /> */}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     <button onClick={sliderOnChange()} >Click</button>

//     <div className="DynamicCard">
//         <div className="card shadow mb-4">
//           <div className="card-body">
//             <div className="box">
//               <div className="slider">                            
//                   <Slider
//                     value={value}
//                     min={0}
//                     step={1}
//                     max={6}                   
//                     // getAriaValueText={valueLabelFormat}
//                     valueLabelFormat={valueLabelFormat}
//                     onChange={handleChange}
//                     valueLabelDisplay="auto"
//                     aria-labelledby="range-slider"
//                     marks={marks}
//                   />                    
//               </div>
//             </div>
//             <BarChart value={value}/>
//             {/* <div className="responsive">
//               <Chart
//                 options={options}
//                 series={series}
//                 type="bar"
//                 width="100%"
//                 height={450}
//               />
//             </div> */}           
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-lg-6 col-md-12">
//             <div className="card shadow mb-4">
//               <div className="card-body">
//                 <div className="responsive">
//                   <Chart
//                     type="donut"
//                     width="100%"
//                     height={400}
//                     options={{
//                       labels: [
//                         "Bid Submitted",
//                         "To Be Opened",
//                         // "Bid Details",
//                         "In Tech Eval",
//                         "In Fin Eval",
//                         "Awarded",
//                         "Cancelled",
//                         "Retender",
//                       ],
//                       title: {
//                         text: "Bid Analysis",
//                       },
//                       plotOptions: {
//                         pie: {
//                           donut: {
//                             labels: {
//                               show: true,
//                               total: {
//                                 show:true,
//                                 fontSize: 20,
//                                 color: '#23b4f4'
//                               }
//                             },
//                           },
//                         },
//                       },
//                     }}
//                     series={[                      
//                       data.bid_submitted,
//                       data.to_be_opened,
//                       // data.bid_details,
//                       data.in_tech_eval,
//                       data.in_fin_eval,
//                       data.awarded,
//                       data.cancelled,
//                       data.retender,
//                     ]}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-6 col-md-12">
//             <div className="card shadow mb-4">
//               <div className="card-body">
//                 <div className="responsive">
//                   <Chart
//                     type="pie"
//                     width="100%"
//                     height={400}
//                     options={{
//                       labels: ["Awarded", "Bid Submitted", "Participated"],
//                       title: {
//                         text: "Analysis - 2",
//                       },
//                     }}
//                     series={[12, 25, 60]}
//                   />                  
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//             <div className="card shadow mb-4">
//               <div className="card-body">
//                 <div className="responsive">
//                   {/* <Chart
//                     type="pie"
//                     width="100%"
//                     height={400}
//                     options={{
//                       labels: ["Awarded", "Bid Submitted", "Participated"],
//                       title: {
//                         text: "Analysis - 2",
//                       },
//                     }}
//                     series={[12, 25, 60]}
//                   /> */}
//                   <AreaChart />
//                 </div>
//               </div>
//             </div>
        
       
//       </div>
//       </>   
//   );

 return (
    <>
      <div className="fixedCard">
        {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <motion.h1 className="h3 mb-0 text-gray-800" animate={{opacity:1}} initial={{opacity:0}}>Dashboard</motion.h1>
              
            </div> */}

        <div className="row">
          <div className="col-xl-12 col-md-12">
            <ul className="cardUl">
              <li>
                <motion.div
                  className="card shadow h-100 py-2 border-left-primary border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                  }}
                >
                  <div className="card-body ">
                    <div className="row no-gutters align-items-center ">
                      <div className="col mr-2">
                        {/* <div className='icons icons1'>                                                                                      
                              <i className="fa-regular fa-signal-stream"></i>                         
                            </div> */}
                        <div className="h4 text-xl font-weight-bold text-primary text-uppercase mb-2 text-center">
                          Live Tenders
                        </div>

                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {Live_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-live"></div>
                            
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-success shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.2,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        {/* <div className='icons icons1'>                          
                              <i className="fa-solid fa-phone"></i>                           
                            </div> */}
                        <div className="h4 text-xl font-weight-bold text-success text-uppercase mb-2 text-center">
                          Fresh Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {fresh_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-fresh"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-info shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.3,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-info text-uppercase mb-2 text-center">
                          Awarded Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {awarded_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-pink shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.4,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-pink text-uppercase mb-2 text-center">
                          Running Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {running_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-orange shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.5,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-orange text-uppercase mb-2 text-center">
                          Completed Tenders
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {completed_tenders_count}
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>
            </ul>
          </div>
          {/* <div className="col-xl-4 col-md-6 mb-4 ">
                <div className="card border-left-info shadow h-100 py-2  border-3">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col pl-3 ">
                        <div className="text-xl font-weight-bold text-info text-uppercase mb-2">
                          Awarded Tenders
                        </div>
                          <div className="h2 mb-0 font-weight-bold text-gray-800 ">
                          5
                        </div>
                      </div>
                      <div className="col-auto">
                      <div className="triangle-awarded"></div>
                        //  <i className="fas fa-dollar-sign fa-2x text-gray-300" /> 
                        {/* <img src="assets/icons/tender_awarded1.png" alt="" width="50" height="50" className="mb-1 text-gray-300"/>}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
        </div>

        <div className="row">
          <div className="col-xl-12 col-md-12">
            <ul className="cardUl">
              <li>
                <motion.div
                  className="card shadow h-100 py-2 border-left-red border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.6,
                  }}
                >
                  <div className="card-body ">
                    <div className="row no-gutters align-items-center ">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-red text-uppercase mb-2 text-center">
                          Opening Calls
                        </div>

                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {Live_tenders_count} */} 7
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-live"></div>
                            
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-dblue shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.7,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-dblue text-uppercase mb-2 text-center">
                          Today Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {fresh_tenders_count} */}2
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-fresh"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-brown shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.8,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-brown text-uppercase mb-2 text-center">
                          Attended Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {awarded_tenders_count} */} 2
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-yellow shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 0.9,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-yellow text-uppercase mb-2 text-center">
                          Completed Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {running_tenders_count} */} 2
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>

              <li>
                <motion.div
                  className="card border-left-ash shadow h-100 py-2  border-3"
                  initial={{
                    x: 1300,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: "tween",
                    stiffness: 10,
                    duration: 0.5,
                    delay: 1,
                  }}
                >
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="h4 text-xl font-weight-bold text-ash text-uppercase mb-2 text-center">
                          Over Due Calls
                        </div>
                        <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                          {/* {completed_tenders_count} */} 10
                        </div>
                      </div>
                      {/* <div className="col-auto">
                          <div className="triangle-info"></div>
                            <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                          </div> */}
                    </div>
                  </div>
                </motion.div>
              </li>
            </ul>
          </div>
        
        </div>
      </div>
      <div className="DynamicCard">
        <div className="card shadow mb-6">
          <div className="card-body">
            <div className="box col-lg-12">
              <div className="slider">                          
              <div className="col-md-6 mb-2 h6 text-primery"> Population  :   </div>
              <div className="col-md-6">
                  <Slider
                    value={value}
                    min={0}
                    step={1}
                    max={6}                   
                    // getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    marks={marks}
                  />   
                  </div>                 
              </div>
            </div>
            <BarChart value={value}/>
            {/* <div className="responsive">
              <Chart
                options={options}
                series={series}
                type="bar"
                width="100%"
                height={450}
              />
            </div> */}           
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="card shadow mb-5">
              <div className="card-body">
                <div className="responsive">
                  <Chart
                    type="donut"
                    width="100%"
                    height={400}
                    options={{
                      labels: [
                        // "Bid Submitted",
                        "To Be Opened",
                        // "Bid Details",
                        "In Technical Evaluation ",
                        "In Financial Evaluation ",
                        "Contract Awarded",
                        "Tender Cancelled",
                        "Tender Retender",
                      ],
                      title: {
                        text: "Bid Analysis",
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: '65%',
                            labels: {
                              show: true,
                              total: {
                                show:true,
                                fontSize: 20,
                                color: '#23b4f4'
                              }
                            },
                          },
                        },
                      },
                    }}
                    series={[                      
                      // bidanalysis.bid_submitted,
                      bidanalysis.to_be_opened,
                      // data.bid_details,
                      bidanalysis.in_tech_eval,
                      bidanalysis.in_fin_eval,
                      bidanalysis.awarded,
                      bidanalysis.cancelled,
                      bidanalysis.retender,
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="responsive">
                  <Chart
                    type="pie"
                    width="100%"
                    height={400}
                    options={{
                      labels: [ // "Bid Submitted",
                      "To Be Opened",
                      // "Bid Details",
                      "In Technical Evaluation ",
                      "In Financial Evaluation ",
                      "Contract Awarded",
                      "Tender Cancelled",
                      "Tender Retender"],
                      title: {
                        text: "Bid Analysis - 2",
                      },
                    }}
                    series={[ // bidanalysis.bid_submitted,
                    bidanalysis.to_be_opened,
                    // data.bid_details,
                    bidanalysis.in_tech_eval,
                    bidanalysis.in_fin_eval,
                    bidanalysis.awarded,
                    bidanalysis.cancelled,
                    bidanalysis.retender]}
                  />                  
                </div>
              </div>
            </div>
          </div>
        </div>
        
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="responsive">
                  <AreaChart />
                </div>
              </div>
            </div>
      </div>
    </>
  );


}

export default Dashboard;
