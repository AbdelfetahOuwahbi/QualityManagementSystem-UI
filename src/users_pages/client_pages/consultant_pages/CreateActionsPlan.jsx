import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Button, Datepicker, FileInput, Label, Textarea } from 'flowbite-react';
import { IoIosArrowDown } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import Cookies from 'js-cookie';
import { isTokenExpired, isTokenInCookies } from '../../CommonApiCalls';
import { appUrl } from '../../../Url.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import toast, { Toaster } from 'react-hot-toast';

export default function CreateActionsPlan({ diagnosisId, actionOrigin, criteriaId, criteriaDesc, entrepriseId, entreprise, onClose }) {
  const [openModal, setOpenModal] = useState(true);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const [existingResponsible, setExistingResponsible] = useState('');
  const [pilotesIds, setPilotesIds] = useState([]);
  const [pilotesFirstNames, setPilotesFirstNames] = useState([]);
  const [pilotesLastNames, setPilotesLastNames] = useState([]);
  const [pilotesPictures, setPilotesPictures] = useState([]);

  const [actionsDetails, setActionsDetails] = useState([{
    deadLine: new Date(),
    chosenAgent: '',
    action: '',
    ActOrigin: actionOrigin
  }]);

  const filteredOptions = useMemo(() => {
    return pilotesLastNames.filter(lastname =>
        lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, pilotesLastNames]);

  useEffect(() => {
    if (existingResponsible !== '') {
      console.log("Already got the Quality Responsible Agent !!");
    } else {
      getQualityResponsibleAgent();
    }
    if (pilotesIds.length > 0) {
      console.log("Already got the Pilots !!");
    } else {
      getPilots();
    }
  }, [existingResponsible, pilotesIds]);

  const getQualityResponsibleAgent = useCallback(async () => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const response = await fetch(`${appUrl}/users/entreprise/responsableQualites/byEntreprise/${entrepriseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          console.log("QualityResponsibleAgent --> ", data);
          setExistingResponsible(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("error getting quality responsible agent --> ", error);
      }
    }
  }, [entrepriseId]);

  const getPilots = useCallback(async () => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const response = await fetch(`${appUrl}/users/entreprise/pilots/byEntreprise/${entrepriseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Pilots --> ", data);
          const ids = [];
          const firstNames = [];
          const lastNames = [];
          const pictures = [];
          data.forEach((item) => {
            ids.push(item.id);
            firstNames.push(item.firstname);
            lastNames.push(item.lastname);
            pictures.push(item.imagePath);
          });
          setPilotesIds(ids);
          setPilotesFirstNames(firstNames);
          setPilotesLastNames(lastNames);
          setPilotesPictures(pictures);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("error getting quality responsible agent --> ", error);
      }
    }
  }, [entrepriseId]);

  const addNewAction = () => {
    setActionsDetails([...actionsDetails, {
      deadLine: new Date(),
      chosenAgent: '',
      action: '',
      ActOrigin: actionOrigin
    }]);
    setCurrentActionIndex(actionsDetails.length);
  };

  const validateActions = () => {
    for (const action of actionsDetails) {
      if (!action.action || !action.chosenAgent || !action.deadLine) {
        return false;
      }
    }
    return true;
  };

  const submitAction = async () => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      if (!validateActions()) {
        toast.error("Tous les champs des actions et des agents sont requis.");
        return;
      }
      try {
        for (const action of actionsDetails) {
          // Soumettre chaque action individuellement
          console.log("Submitting action: ", action);
          // Logique de soumission de l'action

          const response = await fetch(`${appUrl}/diagnoses/details/actions/${diagnosisId}/${criteriaId}?chosenAgentId=${action.chosenAgent}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Cookies.get("JWT")}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "action": action.action,
              "origin": action.ActOrigin,
              "deadline": action.deadLine,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            console.log("Action submitted successfully: ", data);
          } else {
            console.log(data.message);
            toast.error(`Erreur lors de la soumission de l'action : ${data.message}`);
            return;
          }
        }
        toast.success("Plan d'actions soumis avec succès");
        setOpenModal(false);
        onClose();
      } catch (error) {
        console.log("error submitting this action due to --> ", error);
        toast.error("Erreur lors de la soumission des actions");
      }
    }
  };

  const getAgentName = (agentId) => {
    const index = pilotesIds.indexOf(agentId);
    if (index !== -1) {
      return `${pilotesFirstNames[index]} ${pilotesLastNames[index]}`;
    }
    if (existingResponsible && existingResponsible.id === agentId) {
      return `${existingResponsible.firstname} ${existingResponsible.lastname}`;
    }
    return '';
  };

  return (
      <>
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
        <Modal show={openModal} popup onClose={onClose} size="2xl">
          <Modal.Header>
            <div className='flex flex-wrap gap-2 p-4 w-full'>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Plan d'actions</h3>
              <p className='font-p_extra_light text-sky-600'>(Vous pouvez ajouter plusieurs actions !)</p>
              <div className='flex flex-col gap-1'>
                <h1 className='font-p_semi_bold'>Critère :</h1>
                <h1 className='font-p_black text-xl text-green-500'>{criteriaDesc}</h1>
              </div>
              {actionsDetails.length > 1 && (
                  <div className='flex justify-end w-full mt-2'>
                    <Button
                        onClick={() => setCurrentActionIndex(Math.max(currentActionIndex - 1, 0))}
                        disabled={currentActionIndex === 0}
                        className='font-p_medium transition-all duration-300'
                    >
                      <GrCaretPrevious />
                    </Button>
                    <span className='mx-2'>{currentActionIndex + 1} / {actionsDetails.length}</span>
                    <Button
                        onClick={() => setCurrentActionIndex(Math.min(currentActionIndex + 1, actionsDetails.length - 1))}
                        disabled={currentActionIndex === actionsDetails.length - 1}
                        className='font-p_medium transition-all duration-300'
                    >
                      <GrCaretNext />
                    </Button>
                  </div>
              )}
            </div>
          </Modal.Header>

          <div className="border-t-[1px] border-gray-300"></div>
          <Modal.Body>
            <div className="space-y-6">
              <div className='flex flex-col space-y-4'>
                <div className='flex flex-col gap-1'>
                  <h1 className='font-p_semi_bold'>DeadLine :</h1>
                  <Datepicker
                      value={actionsDetails[currentActionIndex].deadLine}
                      onSelectedDateChanged={(date) => {
                        const newActionsDetails = [...actionsDetails];
                        newActionsDetails[currentActionIndex].deadLine = date;
                        setActionsDetails(newActionsDetails);
                      }}
                      className='w-full'
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="action" value="Action" className='font-p_semi_bold' />
                  <Textarea
                      id="comment"
                      placeholder="L'action ..."
                      required
                      rows={4}
                      value={actionsDetails[currentActionIndex].action}
                      onChange={(e) => {
                        const newActionsDetails = [...actionsDetails];
                        newActionsDetails[currentActionIndex].action = e.target.value;
                        setActionsDetails(newActionsDetails);
                      }}
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <h1 className='font-p_semi_bold'>
                    {actionsDetails[currentActionIndex].chosenAgent ?
                        `L'agent sélectionné est : ${getAgentName(actionsDetails[currentActionIndex].chosenAgent)}`
                        : 'Veuillez sélectionner un agent responsable pour cette action :'}
                  </h1>
                  <div
                      onClick={() => setIsSelectionOpen(!isSelectionOpen)}
                      className='flex w-full h-10 items-center px-2 md:px-4 justify-between gap-4 bg-white border-[1px] border-gray-300 rounded-lg cursor-pointer'>
                    <h2 className='font-p_regular'>sélectionner un agent</h2>
                    <IoIosArrowDown className='w-6 h-6 text-sky-500' />
                  </div>
                  {isSelectionOpen &&
                      <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className='flex flex-row gap-2 border-[1px] p-2 border-gray-200 rounded-lg h-80'>
                          <div className='flex flex-col gap-2 w-1/2'>
                            <div className='flex gap-2'>
                              <h2 className='flex font-p_light text-sky-600'>le responsable qualité :</h2>
                            </div>
                            <div className='border-t border-gray-300 py-1'></div>
                            {existingResponsible !== '' ? (
                                <div
                                    onClick={() => {
                                      const newActionsDetails = [...actionsDetails];
                                      newActionsDetails[currentActionIndex].chosenAgent = existingResponsible.id;
                                      setActionsDetails(newActionsDetails);
                                      setIsSelectionOpen(false);
                                    }}
                                    className={`flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1 ${actionsDetails[currentActionIndex].chosenAgent === existingResponsible.id ? 'bg-gray-200' : ''}`}
                                >
                                  <img src={`${appUrl}/images/${existingResponsible.imagePath}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profil" />
                                  <h2 className='font-p_black text-sm md:text-lg'>{existingResponsible.firstname} {existingResponsible.lastname}</h2>
                                </div>
                            ) : (
                                <h1 className='font-p_extra_light'>Pas de Responsable Qualité pour cette entreprise ..</h1>
                            )}
                          </div>
                          <div className='border-r border-gray-300 py-1'></div>
                          <div className='flex-1 flex-col gap-2'>
                            <div className=''>
                              <h2 className='flex font-p_light text-sky-600'>liste des pilotes :</h2>
                              <h2 className='flex text-sm font-p_black text-sky-600'> (vous pouvez chercher par nom)</h2>
                            </div>
                            <div className="flex items-center gap-1 border-[2px] border-gray-200 w-full h-10 rounded-lg mt-2">
                              <input
                                  onChange={(event) => setSearchTerm(event.target.value)}
                                  type="text" placeholder="Ex : Elbahraoui ..."
                                  className="w-full h-full pl-3 text-sm border-none rounded-lg focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500" />
                              <MdPersonSearch className='w-6 h-6 mr-1 text-sky-500' />
                            </div>
                            <div className='border-t border-gray-300 mt-2 py-1'></div>
                            <div className='overflow-y-auto flex flex-col gap-2 h-36 md:h-52'>
                              {pilotesIds.length > 0 && searchTerm === '' ? (
                                  pilotesIds.map((item, index) =>
                                      <div key={index}
                                           onClick={() => {
                                             const newActionsDetails = [...actionsDetails];
                                             newActionsDetails[currentActionIndex].chosenAgent = item;
                                             setActionsDetails(newActionsDetails);
                                             setIsSelectionOpen(false);
                                           }}
                                           className={`flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1 ${actionsDetails[currentActionIndex].chosenAgent === item ? 'bg-gray-200' : ''}`}
                                      >
                                        <img src={`${appUrl}/images/${pilotesPictures[index]}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profil" />
                                        <h2 className='font-p_black text-lg'>{pilotesFirstNames[index]} {pilotesLastNames[index]}</h2>
                                      </div>
                                  )) : searchTerm !== '' ? (
                                  filteredOptions.map((lastname, index) => (
                                      <div key={index}
                                           onClick={() => {
                                             const agentId = pilotesIds[pilotesLastNames.indexOf(lastname)];
                                             const newActionsDetails = [...actionsDetails];
                                             newActionsDetails[currentActionIndex].chosenAgent = agentId;
                                             setActionsDetails(newActionsDetails);
                                             setIsSelectionOpen(false);
                                           }}
                                           className={`flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1 ${actionsDetails[currentActionIndex].chosenAgent === pilotesIds[pilotesLastNames.indexOf(lastname)] ? 'bg-gray-200' : ''}`}
                                      >
                                        <img src={`${appUrl}/images/${pilotesPictures[pilotesLastNames.indexOf(lastname)]}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profil" />
                                        <h2 className='font-p_black text-lg'>{pilotesFirstNames[pilotesLastNames.indexOf(lastname)]} {lastname}</h2>
                                      </div>
                                  ))
                              ) : (
                                  <h1 className='font-p_extra_light'>Pas de pilotes pour cette entreprise ..</h1>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                  }
                </div>
              </div>
            </div>
          </Modal.Body>
          <div className="border-t-[1px] border-gray-300"></div>
          <Modal.Footer className="space-y-4">
            <div className='flex justify-between items-center w-full gap-2'>
              <Button onClick={addNewAction} className="flex-1 bg-sky-400 text-white font-p_medium transition-all duration-300 rounded-lg hover:translate-y-1">
                Ajouter une autre action
              </Button>
              <Button onClick={submitAction} className="flex-1 bg-green-500 text-white font-p_medium transition-all duration-300 rounded-lg hover:translate-y-1">
                Soumettre toutes les actions
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
  );
}
