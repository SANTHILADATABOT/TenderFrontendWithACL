import axios from "axios";
import { Fragment,  useContext,  useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2/src/sweetalert2";
import { Loader } from "rsuite";
import AuthContext from "../../../storeAuth/auth-context";
import { can } from "../../UserPermission";

let table;
const UserCreationList = () => {
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {permission} = useContext(AuthContext)

  const deleterecord = async (id) => {
    let response =  axios.delete(`${baseUrl}/api/usercreation/${id}`)
    return response;
  }

  const getList = async () => {
    const userCreationList = await axios.get(`${baseUrl}/api/usercreation`);
    
   

    var dataSet;
    if (
      userCreationList.status === 200 
    ) {
      let list = [...userCreationList.data.userlist];
      let listarr = list.map((item, index, arr) => {
        let editbtn = !!(permission?.["User Creation"]?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> ' : '' ;
        let deletebtn =  !!(permission?.["User Creation"]?.can_delete) ? '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>' : '';
        return {
        ...item,
        status : (item.activeStatus ===  "active") ? `<span class="text-success font-weight-bold"> Active </span>` : `<span class="text-warning font-weight-bold"> Inactive </span>`,
        // action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
        action:  editbtn + deletebtn ,
        sl_no: index + 1,
      }});

      dataSet = listarr;

    } else {
       dataSet = [];
    }

    console.log(dataSet)
    let i = 0;
    table = $("#dataTable").DataTable({
      data: dataSet,
      columns: [
        {
          //data: 'sl_no',
          render: function (data, type, row) {
            return ++i;
          },
        },
        { data: "userName" },
        { data: "role_name" },
        { data: "mobile" },
        { data: "email" },
        { data: "name" },
        { data: "confirm_passsword" },
        { data: "status" },
        { data: "action" },
      ],
    })
    setLoading(false)
    //to edit 
    $("#dataTable tbody").on("click", "tr .fa-edit", function () {
      let rowdata = table.row($(this).closest("tr")).data();
      navigate(
        `/tender/master/usercreation/edit/${rowdata.id}`
      );
    });

    // to delete a row
    $("#dataTable tbody").on("click", "tr .fa-trash-alt", async function () {
      let rowdata = table.row($(this).closest("tr")).data();
      
      Swal.fire({
        text: `Are You sure, to delete ${rowdata.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#2fba5f",
        cancelButtonColor: "#fc5157",
      }).then( async (willDelete) => {
        if (willDelete.isConfirmed) {
         let response = await deleterecord(rowdata.id)

         if (response.data.status === 200) {
            Swal.fire({ //success msg
              icon: "success",
              text: `${rowdata.name} role has been removed!`,
              timer: 1500,
              showConfirmButton: false,
            });

            //delete in datatable
              table
              .row($(this).parents("tr"))
              .remove()
              .column(0)
              .nodes()
              .each(function (cell, i) {
                cell.innerHTML = i + 1;
              })
              .draw();
          }else if (response.data.status === 404) {
            Swal.fire({ // error msg
              icon: "error",
              text: response.data.message,
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Cancelled",
              icon: "error",
              timer: 1500,
            });
          }
        } 
      });
    });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Fragment>
      <div>
        {loading && <Loader size="lg" backdrop content="Fetching Data..." />}
      </div>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center">
            <tr>
              <th className="">Sl.No</th>
              <th className="">User Name</th>
              <th className="">User Type (Role)</th>
              <th className="">Mobile</th>
              <th className="">E-mail</th>
              <th className="">Login Id</th>
              <th className="">Password</th>
              <th className="">Status</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default UserCreationList;