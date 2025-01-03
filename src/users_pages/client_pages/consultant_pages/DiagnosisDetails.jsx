import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox } from "flowbite-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { appUrl } from "../../../Url.jsx";
import CreateActionsPlan from "./CreateActionsPlan";
import ActionPlanDetailsModal from "./ActionPlanDetailsModal";

export function DiagnosisDetails({ diagnosisId, DiagnosisCode, chosenEntreprise, chosenEntrepriseId, chosenNormeId, onClose }) {

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(true);
  const [actionsPlanVisible, setActionPlanVisible] = useState(false);
  //Variables that will be used in Actions Plan
  const [criteriaId, setCriteriaId] = useState('');
  const [criteriaDesc, setCriteriaDesc] = useState("");
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

  //This will store the diagnosis details
  const [diagnosisDetails, setDiagnosisDetails] = useState([]);

  //Variable that controls the visibility and appearance of some UI items related to diagnosis
  const [alreadyStartedDiagnosis, setAlreadyStartedDiagnosis] = useState(false);
  const [terminationOpen, setTerminationOpen] = useState(false);

  //for the  modal that will appear when the termination button is clicked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(null);

  const [detailsWithActionPlans, setDetailsWithActionPlans] = useState([]);


  //Checking wether the diagnosis has started or not to controll the availability of Termination Button
  useEffect(() => {
    const diagnosis = statusRelatedCheckbox?.some(d => d.compliant || d.nonCompliant || d.NA);
    diagnosis ? setAlreadyStartedDiagnosis(true) : setAlreadyStartedDiagnosis(false);

  }, [statusRelatedCheckbox])

  //getting diagnosis details whenever the user switches chapters
  useEffect(() => {
    getDiagnosisDetails();
  }, [criteriasForSelectedChapter])

  // Setting the checkboxes when diagnosisDetails is available
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
  }, [criteriasForSelectedChapter, diagnosisDetails]);

  useEffect(() => {
    const fetchDetailsWithActionPlans = async () => {
      try {
        const response = await fetch(`${appUrl}/details/getDetailsIdsFromDiagnosis/${diagnosisId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          }
        });
        const data = await response.json();
        setDetailsWithActionPlans(data);
      } catch (error) {
        console.error("Error fetching details with action plans", error);
      }
    };

    fetchDetailsWithActionPlans();
  }, [diagnosisId]);


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
      const response = await fetch(`${appUrl}/normes/${chosenNormeId}`, {
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
      const response = await fetch(`${appUrl}/details/diagnosis/${diagnosisId}`, {
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

  useEffect(() => {
    console.log("Diagnosis Details -->", diagnosisDetails);
  }, [diagnosisDetails]);
  //Function that updates the Compliancy of a criteria
  const updateCriteriaCompliancy = async (criteriaId, Compliancy) => {
    // console.log("Updating To --> ", Compliancy);
    // console.log("in criteria Id ->", criteriaId);
    // console.log("and diagnosis id ->", diagnosisId);
    try {
      const response = await fetch(`${appUrl}/details/updateSpecific?critereId=${criteriaId}&diagnosisId=${diagnosisId}`, {
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
      const response = await fetch(`${appUrl}/diagnosis/${diagnosisId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        },
        body: JSON.stringify({
          "code": DiagnosisCode,
          "isDone": Diagstate,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Data is saved, you cannot delete the diagnosis anymore ..");
        toast.success("les informations de ce diagnostic sont souvergarder, vous pouvez a tout moment detruire le diagnostic prochainement ..", {
          duration: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      }else if(data.errorCode === "Err"){
        toast.error(data.message);
      } else {
        console.log("response was not ok in updating the diagnosis state ..");
        toast.error("les informations de ce diagnostic ne sont pas enregistrer, ressayer plus tard ..", {
          duration: 1000,
        });
      }
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
                <th scope="col" className="px-6 py-3">Critère description</th>
                <th scope="col" className="px-6 py-3">Critère commentaire</th>
                <th scope="col" className="px-6 py-3">Conforme / Non Conforme / NA</th>
              </tr>
            </thead>
            <tbody>
              {criteriasForSelectedChapter.length > 0 &&
                criteriasForSelectedChapter.map((criteria, Criteriaindex) => {
                  const diagnosis = diagnosisDetails?.find(d => d.critereId === criteria.id);
                  return diagnosis ? (
                    <tr key={Criteriaindex} className="border-b">
                      <td className="px-6 py-4">{criteria.description}</td>
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
                              <button
                                onClick={() => {
                                setActionPlanVisible(true);
                                setCriteriaId(criteria.id);
                                setCriteriaDesc(criteria.description);
                              }}
                              className='flex items-center gap-2 justify-between px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-400'>
                                actions
                                <FaArrowsDownToPeople className="w-7 h-7" />
                              </button>
                            </div>
                          }
                          {console.log("detailsWithActionPlans", detailsWithActionPlans)}
                          { console.log("criteria.id", criteria.id)}
                          {detailsWithActionPlans.includes(criteria.id) && (
                              <Button outline gradientDuoTone="greenToBlue"
                                  onClick={() => {
                                    setIsModalOpen(true);
                                    setSelectedCriteriaId(criteria.id);
                                  }}
                                  className='mt-7'>
                                Historique
                              </Button>
                          )}
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
            setTerminationOpen(true);
          }}
            disabled={!alreadyStartedDiagnosis}
          >Terminer</Button>
          <Button color="gray" onClick={() => {
            updateDiagnosisState("alreadyStarted");
          }}
            disabled={!alreadyStartedDiagnosis}
          >Souvegarder et Continuer plus tard</Button>
          {alreadyStartedDiagnosis === false &&
            <button className="py-2 px-5 rounded-lg bg-red-500 hover:bg-red-400 text-white" onClick={() => setOpenModal(false)}>Pas maintenant</button>
          }
        </Modal.Footer>
      </Modal>

      {/* Termination Confirmation Modal */}

      <Modal
        show={terminationOpen}
        onClose={() => setTerminationOpen(false)}
      >
        <Modal.Header>Vèrifier tous les informations</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Avant de soumettre le diagnostic, veuillez vérifier que toutes les cases à cocher sont correctement cochées
              et que toutes les informations saisies sont exactes. Une fois le diagnostic soumis, il ne sera plus possible
              de modifier les informations relatives à celui-ci. Assurez-vous donc que tout est correct et complet avant
              de procéder à la soumission finale.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDiagnosisState("done")}>Valider</Button>
          <Button color="gray" onClick={() => setTerminationOpen(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      {actionsPlanVisible && <CreateActionsPlan diagnosisId={diagnosisId} actionOrigin="Diagnostic" criteriaDesc={criteriaDesc} entrepriseId={chosenEntrepriseId} entreprise={chosenEntreprise} criteriaId={criteriaId} onClose={() => setActionPlanVisible(false)}/>}
      <ActionPlanDetailsModal
          isOpen={isModalOpen}
          criteriaId={selectedCriteriaId}
          diagnosisId={diagnosisId}
          onClose={() => setIsModalOpen(false)}
      />

    </>
  );
}