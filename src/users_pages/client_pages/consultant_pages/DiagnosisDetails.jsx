import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox } from "flowbite-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { serverAddress } from "../../../ServerAddress";

export function Diagnosises({ diagnosisId, DiagnosisCode, chosenEntreprise, chosenNormeId, onClose }) {

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(true);
  const [norms, setNorms] = useState({});

  //Filtering Variable (The consultant can filter, what criterias of which chapitre he want to see and process)
  const [selectedChapter, setSelectedChapter] = useState('');
  const [criteriasForSelectedChapter, setCriteriasForSelectedChapter] = useState([]);

  //Checkboxes That will be fill with the status in the diagnosis details
  const [statusRelatedCheckbox, setStatusRelatedCheckbox] = useState([{
    compliant: false,
    nonCompliant: false,
    NA: false,
  }]);


  const [diagnosisDetails, setDiagnosisDetails] = useState([]);

  //Variable that controls the visibility and appearance of some UI items related to diagnosis
  const [alreadyStartedDiagnosis, setAlreadyStartedDiagnosis] = useState(false);

  //getting diagnosis details whenever the user switches chapters
  useEffect(() => {
    getDiagnosisDetails();
  }, [criteriasForSelectedChapter])

  // Setting the checkboxes
  useEffect(() => {
    const initialCheckboxState = criteriasForSelectedChapter.map((item) => {
      const diagnosis = diagnosisDetails?.find(d => d.critereId === item.id);
      return {
        compliant: diagnosis ? diagnosis.status === "compliant" : false,
        nonCompliant: diagnosis ? diagnosis.status === "nonCompliant" : false,
        NA: diagnosis ? diagnosis.status === "NA" : false
      };
    });
    setStatusRelatedCheckbox(initialCheckboxState);
    //Checks if the consultant has started the diagnosis or not
    const diagnosisStarted = diagnosisDetails.find(d => d.status !== null);
    if (diagnosisStarted) {
      setAlreadyStartedDiagnosis(true);
    }
  }, [criteriasForSelectedChapter, diagnosisDetails]);


  //Function that updates the values of a specific checkbox once a new or an already checked checkbox gets checked
  const handleCheckboxChange = (index, type) => {
    setStatusRelatedCheckbox(prevState =>
      prevState.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            compliant: type === 'compliant' ? !item.compliant : false,
            nonCompliant: type === 'nonCompliant' ? !item.nonCompliant : false,
            NA: type === 'NA' ? !item.NA : false
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (Object.keys(norms).length > 0) {
      console.log("Already got the whole table");
    } else {
      getNormAndChildren();
      //I need to check this calling later to make sure data is always available
      getDiagnosisDetails();
    }
  }, []);

  // Function to fetch norm and its children
  const getNormAndChildren = async () => {
    try {
      const response = await fetch(`http://${serverAddress}:8080/api/v1/normes/${chosenNormeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get("JWT")}`,
        }
      });
      const data = await response.json();
      // console.log("Got the chosen norm and its children -->", data);
      setNorms(data);

    } catch (error) {
      console.log("Error occurred while getting the norm and its children -->", error)
    }
  }

  //Funtion that gets the Diagnosis Details

  const getDiagnosisDetails = async () => {
    try {
      const response = await fetch(`http://${serverAddress}:8080/api/v1/details/diagnosis/${diagnosisId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get("JWT")}`,
        }
      });
      const data = await response.json();
      console.log("Got the Diagnosis Details -->", data);
      setDiagnosisDetails(data);
    } catch (error) {
      console.log("error getting diagnosis Details -->", error);
    }
  }

  //Function that updates the Compliancy of a criteria
  const updateCriteriaCompliancy = async (criteriaId, Compliancy) => {
    // console.log("Updating To --> ", Compliancy);
    // console.log("in criteria Id ->", criteriaId);
    // console.log("and diagnosis id ->", diagnosisId);
    try {
      const response = await fetch(`http://${serverAddress}:8080/api/v1/details/updateSpecific?critereId=${criteriaId}&diagnosisId=${diagnosisId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        },
        body: JSON.stringify({
          "status": Compliancy,
        })
      });
      if (response.ok) {
        console.log(`criteria with the id ${criteriaId} has been set to ${Compliancy} successfully ..`);
        toast.success(`Ce critère a changè d'ètat avec succès .. `)
      } else {
        console.log(`criteria with the id ${criteriaId} has not been set to ${Compliancy} !!`);
        toast.error(`Ce critère n'a changè d'ètat !!`)
      }
      // console.log(data);
    } catch (error) {
      console.log("error happened while updating criteria compliance -->", error);
    }
  }

  //Function that updates the diagnosisState
  async function updateDiagnosisState(Diagstate) {
    // console.log("code of the diagnosis --> ",DiagnosisCode);
    // console.log("state to load --> ",Diagstate);
    try {
      const response = await fetch(`http://${serverAddress}:8080/api/v1/diagnosis/${diagnosisId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        },
        body: JSON.stringify({
          "code": DiagnosisCode,
          "is_done": Diagstate,
        })
      });
      const data = await response.json();
      console.log("data from the updating the diagnosis state --> ", data);
      // navigate("/AllDiagnosises");
    } catch (error) {
      console.log("error while updating the diagnosis state --->", error);
    }
  }

  // useEffect(() => {
  //   console.log("these are the diagnosis details (as an array) --> ", diagnosisDetails);
  // }, [diagnosisDetails])

  // useEffect(() => {
  //   console.log("these are the Chriterias for the selected chapter --> ", criteriasForSelectedChapter);
  // }, [criteriasForSelectedChapter])

  // useEffect(() => {
  //   console.log("these are the Checkboxes State --> ", statusRelatedCheckbox);
  // }, [statusRelatedCheckbox])

  return (
    <>
      <Modal show={openModal} size='xxl' onClose={onClose}>
        <Modal.Header>
          <div className='md:w-[90rem] flex flex-col md:flex-row items-center gap-8 md:gap-0 md:justify-between md:px-10'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center flex-row gap-2'>
                <h1 className='font-p_medium'>Code de Diagnostic : </h1>
                <h1 className='font-p_medium text-sky-700'> {DiagnosisCode}</h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1 className='font-p_medium'>Entreprise Cliente : </h1>
                <h1 className='font-p_medium text-sky-700'> {chosenEntreprise}</h1>
              </div>
              <div className='flex flex-row gap-2'>
                <h1 className='font-p_medium'>La Norme Choisi : </h1>
                <h1 className='font-p_medium text-sky-700'> {norms.label}</h1>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <h1>Charger les Critéres de Chapitre :</h1>
              <select
                className="rounded-lg p-4 border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  // console.log(e.target.value);
                  setCriteriasForSelectedChapter(norms.chapitres[e.target.value].criteres);
                }}
              >
                <option value="">Sélectionner un Chapitre</option>
                {norms.chapitres?.map((chapitre, index) =>
                  <option key={index} value={index}>
                    {chapitre.code}
                  </option>
                )}
              </select>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Critères</th>
                <th scope="col" className="px-6 py-3">Conforme / Non Conforme / NA</th>
              </tr>
            </thead>
            <tbody>
              {criteriasForSelectedChapter.length > 0 &&
                criteriasForSelectedChapter.map((criteria, Criteriaindex) => {
                  const diagnosis = diagnosisDetails?.find(d => d.critereId === criteria.id);
                  return diagnosis ? (
                    <tr key={Criteriaindex} className="border-b">
                      <td className="px-6 py-4">{criteria.comment}</td>
                      <td className="px-5 py-5">
                        <div className='flex place-items-center gap-2'>
                          <div className='flex items-center flex-col gap-2'>
                            <h1 className='font-p_light text-green-500'>Conforme</h1>
                            {/* SHOULD BE HANDLED TOMORROW (FUNCTION IS ALREADY CREATED) */}
                            <Checkbox
                              checked={statusRelatedCheckbox[Criteriaindex]?.compliant}
                              onChange={() => {
                                handleCheckboxChange(Criteriaindex, 'compliant');
                                updateCriteriaCompliancy(diagnosis.critereId, "compliant");
                              }}
                              disabled={statusRelatedCheckbox[Criteriaindex]?.nonCompliant || statusRelatedCheckbox[Criteriaindex]?.NA}
                              color={"green"}
                              className='w-8 h-8'
                            />
                          </div>
                          <div className='flex items-center flex-col gap-2'>
                            <h1 className='font-p_light text-red-500'>N.Conforme</h1>
                            <Checkbox
                              checked={statusRelatedCheckbox[Criteriaindex]?.nonCompliant}
                              onChange={() => {
                                handleCheckboxChange(Criteriaindex, 'nonCompliant');
                                updateCriteriaCompliancy(diagnosis.critereId, "nonCompliant");
                              }}
                              disabled={statusRelatedCheckbox[Criteriaindex]?.compliant || statusRelatedCheckbox[Criteriaindex]?.NA}
                              color={"red"}
                              className='w-8 h-8'
                            />
                          </div>
                          <div className='flex items-center flex-col gap-2'>
                            <h1 className='font-p_light text-yellow-400'>NA</h1>
                            <Checkbox
                              checked={statusRelatedCheckbox[Criteriaindex]?.NA}
                              onChange={() => {
                                handleCheckboxChange(Criteriaindex, 'NA');
                                updateCriteriaCompliancy(diagnosis.critereId, "NA");
                              }}
                              disabled={statusRelatedCheckbox[Criteriaindex]?.nonCompliant || statusRelatedCheckbox[Criteriaindex]?.compliant}
                              color={"yellow"}
                              className='w-8 h-8'
                            />
                          </div>
                          {statusRelatedCheckbox[Criteriaindex]?.nonCompliant &&
                            <div className='flex items-center ml-4 mt-7 flex-row gap-2'>
                              <IoIosArrowForward className='text-sky-500 h-6 w-6' />
                              <button className='flex items-center justify-between px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-400'>
                                Creér le plan d'actions
                                <FaArrowsDownToPeople className="w-7 h-7" />
                              </button>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  ) : null;
                })}
            </tbody>
          </table>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            setOpenModal(false);
            updateDiagnosisState("done");
          }}>Terminer</Button>
          <Button color="gray" onClick={() => {
            setOpenModal(false);
            updateDiagnosisState("alreadyStarted");
          }}>Souvegarder et Continuer plus tard</Button>
          {alreadyStartedDiagnosis === false &&
            <button className="py-2 px-5 rounded-lg bg-red-500 hover:bg-red-400 text-white" onClick={() => setOpenModal(false)}>Annuler</button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}