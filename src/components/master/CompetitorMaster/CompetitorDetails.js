import { usePageTitle } from "../../hooks/usePageTitle";
import { Fragment, useState, useEffect } from "react";
// import Select from "react-select";
// import { useEffect } from "react";
// import Swal from "sweetalert2";
// import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useNavigate, useParams, NavLink, useOutletContext } from "react-router-dom";
import CompetitorBranch from "./Competitor_Details/CompetitorBranch";


const comppath="tender/master/competitorcreation/competitor/details";

const CompetitorDetails = () => {
  usePageTitle("Competitor Creation");
  const { compid } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const setCompetitorId = useOutletContext();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if(compid)
    
  // }, []);

  return (
    <div className="formContent">
      {!compid && (
        <div className="loading">
          <img
            id="loading-image"
            src="/assets/img/lock.png"
            alt="Loading..."
            width="150"
            height="150"
          />
        </div>
      )}
          
      <div className="card mb-2  ">
        <a   
          href="#competitorBranch"
          className="d-block card-header py-3 bg-white "
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="competitorBranch"
        >
          <h6 className="m-0 font-weight-bold text-dark">
            BRANCHES OF THE COMPANY
          </h6>
        </a>
        {/* Card Content - Collapse */}
        <div className="collapse" id="competitorBranch">
          <div className="card-header">
            <CompetitorBranch />
          </div>
        </div>
    </div>


    <div className="card mb-2  ">
        <a
          href="#competitorNetWorth"
          className="d-block card-header py-3 bg-white"
          data-toggle="collapse"
          role="button"
          aria-expanded="true"
          aria-controls="competitorNetWorth"

        >
          <h6 className="m-0 font-weight-bold text-primary text-dark">
            NETWORTH OF THE COMPANY
          </h6>
        </a>
        {/* Card Content - Collapse */}
        <div className="collapse" id="competitorNetWorth">
          <div className="card-header">
            This is a collapsable card example using Bootstrap's built in
            collapse functionality. <strong>Click on the card header</strong> to
            see the card body collapse and expand!
          </div>
        </div>
        </div>

        <div className="card mb-2  ">
    <a
      href="#qualityCertificates"
      className="d-block card-header py-3 bg-white"
      data-toggle="collapse"
      role="button"
      aria-expanded="true"
      aria-controls="qualityCertificates"

    >
      <h6 className="m-0 font-weight-bold text-primary text-dark">
        QUALITY CERTIFICATES
      </h6>
    </a>
        {/* Card Content - Collapse */}
      <div className="collapse" id="qualityCertificates">
      <div className="card-header">
        This is a collapsable card example using Bootstrap's built in
        collapse functionality. <strong>Click on the card header</strong> to
        see the card body collapse and expand!
      </div>
    </div>
</div>


</div>
  );
};

export default CompetitorDetails;
