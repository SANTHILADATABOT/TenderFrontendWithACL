import axios from "axios";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import { ImageConfig } from "../../Config";
import styles from './UploadDoc.module.css';


const DocCard = (props) => {

    const { server1: baseUrl } = useBaseUrl();

    const downloadDoc = (filename, docname, ext) => {
        // const link = document.createElement('a');
        let url = `${baseUrl}/storage/BidDocs/${filename}`
            // link.href = ;
            // link.download = 'file.pdf';
            // document.body.appendChild(link);
            // link.click();url

            axios({
                url: `${baseUrl}/api/download/BidDocs/${filename}`,
                method: 'GET',
                responseType: 'blob', // important
              }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${docname}.${ext}`);
                document.body.appendChild(link);
                link.click();
              });
    }

   

    return (

        <Fragment>
            <div className={`card mb-1 py-1 border-left-info ${styles.docrow}`}>
                <div className="row card-body p-1 align-items-center">
                    <div className="col-sm-1 d-flex justify-content-center">
                        <div className="btn-info btn-circle btn-small"> {+props.index + 1} </div>
                    </div>
                    <div className=" row col-sm-8 bg-gray-200 rounded py-1">
                        <div className="col-sm-1 ">
                            <div>
                            {props.item.file_type === "application/pdf" && <img src={ImageConfig['pdf']} alt="" width="75px" height="75px" />}

                            {props.item.file_type === "application/msword"  && <img src={ImageConfig['doc']} alt="" width="75px" height="75px" />}

                            {props.item.file_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"  && <img src={ImageConfig['doc']} alt="" width="75px" height="75px" />}

                            {props.item.file_type.split('/')[0] === "image" && <img src={`${baseUrl}/storage/BidDocs/${props.item.file_new_name}`} alt="" width="75px" height="75px" />}

                            {(props.item.file_type !== "application/pdf" && 
                              props.item.file_type !== "application/msword" && 
                              props.item.file_type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                              props.item.file_type.split('/')[0] !== "image"
                              ) && <img src={ImageConfig['default']} alt="" width="75px" height="75px" />}

                            {/* <img src={ImageConfig[props.item.file_type.split('/')[1]] || ImageConfig['default']} alt="" width="75px" height="75px" /> */}
                            </div>
                        </div>
                        <div className="col-sm-11 pl-5">

                            <div className="font-weight-bold text-info text-uppercase mb-1">
                            Document Name : {props.item.docname}
                            </div>

                            <div className="row no-gutters align-items-center ">
                                <div className="col-auto">
                                    <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                                        <p className="text-truncate">
                                        File Name : {props.item.file_original_name}
                                        </p>
                                        <p>Size : ({props.item.file_size} KB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                       <div className="col-12 d-flex justify-content-center align-items-center">
                        <div className="btn btn-outline-warning btn-circle btn-small mx-2"  onClick={() => downloadDoc(props.item.id, props.item.docname, props.item.ext)}><i className="fa fa-download"></i></div>
                        {/* <div className="btn btn-outline-warning btn-circle btn-small mx-2"><Link className="fa fa-download" to={`${baseUrl}/storage/BidDocs/${props.item.file_new_name}`} target="_blank" download>
                        </Link></div> */}
                        <div className="btn btn-outline-success btn-circle btn-small mx-2" onClick={() => props.onEdit(props.item)}> <i className="far fa-edit" ></i> </div>
                        <div className="btn btn-outline-danger btn-circle btn-small mx-2" onClick={() => props.onDelete(props.item.id, props.item.docname)}> <i className="fas fa-trash-alt" ></i> </div>
                       </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DocCard