import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getJobs,
  addJob,
  saveJob,
  deleteJob,
} from "../actions";

const jobSelector = (state) => state.job.jobList;
const jobCountSelector = (state) => state.job.count;

function JobList() {
    const [isDialogShown, setIsDialogShown] = useState(false);
    const [descriere, setDescriere] = useState("");
    const navigate = useNavigate();
    const [deadline, setDeadline] = useState(new Date());
    const [isNewRecord, setIsNewRecord] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = useSelector(jobSelector);
    const count = useSelector(jobCountSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const handleAddClick = (evt) => {
        setIsDialogShown(true);
        setIsNewRecord(true);
        setDescriere("");
        setDeadline(new Date());
    };

    const hideDialog = () => {
        setIsDialogShown(false);
    };

    const handleSaveClick = () => {
        if(isNewRecord) {
            if(descriere.length >=3) {
                dispatch(addJob({descriere, deadline}));
                toast.success("Job adaugat!");
                setIsDialogShown(false);
                setSelectedJob(null);
                setDescriere("");
                setDeadline(new Date());
            }
            else {
                if(descriere.length < 3) {
                    toast.error("Descrierea trebuie sa aiba cel putin 3 caractere")
                }
            }
        } else {
            if(descriere.length >=3){
                dispatch(saveJob(selectedJob, {descriere, deadline}));
            
            toast.success("Job ul a fost actualizat");
            setIsDialogShown(false);
            setSelectedJob(null);
            setDescriere("");
            setDeadline(new Date());
            }
            else {
                if(descriere.length <3 ) {
                    toast.error("Descrierea trebuie sa aiba cel putin 3 caractere")

                }
            } 
        }
    };
    const editJob = (rowData) =>{
        setSelectedJob(rowData.id);
        setDescriere(rowData.descriere);
        setDeadline(rowData.deadline);
        setIsDialogShown(true);
        setIsNewRecord(false);
    };

    const handleDeleteJob = (rowData) => {
        dispatch(deleteJob(rowData.id));
    };

    const redirect = (rowData) => {
      setSelectedJob(rowData.id);
      navigate(`/jobs/${rowData.id}/candidates`);
    };

    const tableFooter = (
        <div>
          <Button label="Add" icon="pi pi-plus" onClick={handleAddClick} />
        </div>
    );
    
    const dialogFooter = (
        <div>
          <Button label="Salveaza" icon="pi pi-save" onClick={handleSaveClick} />
        </div>
    );

    const opsColumn = (rowData) => {
        return (
          <>
            <Button
              icon="pi pi-pencil"
              onClick={() => editJob(rowData)}
            />
            <Button
              icon="pi pi-times"
              className="p-button p-button-danger"
              onClick={() => handleDeleteJob(rowData)}
            />
          </>
        );
      };

      return (
        <div>
          <DataTable
            value={jobs}
            footer={tableFooter}
          >
            <Column
              header="Descriere"
              field="descriere"
            />
            <Column
              header="Deadline"
              field="deadline"
            />
            <Column body={opsColumn} />
          </DataTable>
          <Dialog
            visible={isDialogShown}
            onHide={hideDialog}
            footer={dialogFooter}
          >
            <div>
              <InputText className="mb-2"
                placeholder="Descriere"
                onChange={(evt) => setDescriere(evt.target.value)}
                value={descriere}
              />
            </div>
            <div>
              <InputText className="mb-2"
                placeholder="Deadline"
                onChange={(evt) => setDeadline(evt.target.value)}
                value={deadline}
              />
            </div>
            
          </Dialog>
        </div>
      );
}
export default JobList;