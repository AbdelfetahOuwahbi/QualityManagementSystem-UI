import React, { useEffect, useState } from 'react'
import { Modal, Button, Datepicker, FileInput, Label, Textarea } from 'flowbite-react';
import { IoIosArrowDown } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import Cookies from 'js-cookie';
import { isTokenExpired, isTokenInCookies } from '../../CommonApiCalls';
import { appUrl } from '../../../Url.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateActionsPlan({ actionOrigin, criteriaId, criteriaDesc, entrepriseId, entreprise, onClose }) {

    const [openModal, setOpenModal] = useState(true);

    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    //Stores the QualityResponsibleAgent's
    const [existingResponsible, setExistingResponsible] = useState('');
    const [pilotesIds, setPilotesIds] = useState([]);
    const [pilotesFirstNames, setPilotesFirstNames] = useState([]);
    const [pilotesLastNames, setPilotesLastNames] = useState([]);
    const [pilotesPictures, setPilotesPictures] = useState([]);

    //the Action Details to be stored
    const [actionDetails, setActionDetails] = useState(
        {
            deadLine: new Date(),
            chosenAgent: '',
            action: "",
            ActOrigin: actionOrigin,
            criteria: criteriaId,
            entreprise: entrepriseId
        }
    );

    //Function that filters the searched Agent from the whole pilot table
    const filteredOptions = pilotesLastNames.filter(lastname =>
        lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    }, [])

    const getQualityResponsibleAgent = async () => {
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
    }

    const getPilots = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            try {
                const response = await fetch(`${appUrl}/users/entreprises/pilots/byEntreprise/${entrepriseId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get("JWT")}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Pilots --> ", data);
                    data.map((item) => {
                        setPilotesIds(prev => [...prev, item.id]);
                        setPilotesFirstNames(prev => [...prev, item.firstname]);
                        setPilotesLastNames(prev => [...prev, item.lastname]);
                        setPilotesPictures(prev => [...prev, item.imagePath]);
                    })
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log("error getting quality responsible agent --> ", error);
            }
        }
    }


    //Function that submits the action
    async function submitAction() {
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            try {

            } catch (error) {
                console.log("error submitting this action due to --> ", error);
            }
        }
    }



    return (
        <>
            <Modal show={openModal} popup onClose={onClose}>
                <Modal.Header>
                    <div className='flex flex-col gap-4 p-4 justify-center'>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Plan d'actions </h3>
                        <h4 className='font-p_extra_light text-sky-600'>Vous pouvez ajouter plusieur actions !</h4>
                    </div>
                </Modal.Header>
                <div className="border-t-[1px] border-gray-300"></div>
                <Modal.Body>
                    <div className="">
                        <div className='flex py-10 flex-col'>
                            <div className='mb-8 flex items-center flex-row gap-4'>
                                <h1 className='font-p_semi_bold'>Critére : </h1>
                                <h1 className='font-p_black text-xl text-green-500'> {criteriaDesc}</h1>
                            </div>
                            <div className='flex mb-6 flex-row items-center gap-4'>
                                <h1 className='font-p_semi_bold'>DeadLine : </h1>
                                <Datepicker
                                    value={actionDetails.deadLine}
                                    language="FR-fr"
                                    onSelectedDateChanged={(date) => setDeadLine(date)}
                                    className='w-1/2'
                                />
                            </div>
                            <div>

                                <div className="max-w-md mb-8">
                                    <div className="mb-2 block">
                                        <Label htmlFor="action" value="Action" className='font-p_semi_bold' />
                                    </div>
                                    <Textarea id="comment" placeholder="L'action ..." required rows={4} />
                                </div>

                                {/* Section du selection de l'entreprise */}
                                <div className='mb-4'>
                                    <h1 className='font-p_semi_bold'>Veuillez séléctionner un agent reponsable sur cette action : </h1>
                                </div>

                                <div className='flex flex-col w-full md:px-4 h-auto'>
                                    <div
                                        onClick={() => setIsSelectionOpen(!isSelectionOpen)}
                                        className='flex w-full h-10 items-center px-2 md:px-4 justify-between gap-4 bg-white border-[1px] border-gray-300 rounded-lg cursor-pointer'>
                                        <h2 className='font-p_regular'> séléctionner un agent </h2>
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
                                                {/* Quality responsible */}
                                                <div className='flex flex-col gap-2 w-1/2'>
                                                    <div className='flex gap-2'>
                                                        <h2 className='flex font-p_light text-sky-600'> le résponsable qualité :</h2>
                                                    </div>
                                                    <div className='border-t border-gray-300 py-1'></div>
                                                    {existingResponsible !== '' ? (
                                                        <div
                                                            onClick={() => {
                                                                setChosenAgentId(existingResponsible.id);
                                                                setIsSelectionOpen(false);
                                                            }}
                                                            className='flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1'>
                                                            <img src={`${appUrl}/images/${existingResponsible.imagePath}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
                                                            <h2 className='font-p_black text-sm md:text-lg'>{existingResponsible.firstname} {existingResponsible.lastname}</h2>
                                                        </div>
                                                    ) : (
                                                        <h1 className='font-p_extra_light'>Pas de Responsable Qualité pour cette entreprise ..</h1>
                                                    )}
                                                </div>
                                                <div className='border-r border-gray-300 py-1'></div>
                                                {/* Pilot */}
                                                <div className='flex-1 flex-col gap-2'>
                                                    <div className=''>
                                                        <h2 className='flex font-p_light text-sky-600'> liste des pilotes :</h2>
                                                        <h2 className='flex text-sm font-p_black text-sky-600'> (vous pouvez chercher par nom)</h2>
                                                    </div>
                                                    {/* Search input */}
                                                    <div className="flex items-center gap-1 border-[2px] border-gray-200 w-full h-10 rounded-lg mt-2">
                                                        <input
                                                            onChange={(event) => setSearchTerm(event.target.value)}
                                                            type="text" placeholder="Ex : Elbahraoui ..."
                                                            className="w-full h-full pl-3 text-sm border-none rounded-lg focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500" />
                                                        <MdPersonSearch className='w-6 h-6 mr-1 text-sky-500' />
                                                    </div>
                                                    <div className='border-t border-gray-300 mt-2 py-1'></div>
                                                    {/* Scrollable container for the pilot list */}
                                                    <div className='overflow-y-auto flex flex-col gap-2 h-36 md:h-52'>
                                                        {pilotesIds.length > 0 && searchTerm === '' ? (
                                                            pilotesIds.map((item, index) =>
                                                                <div key={index}
                                                                     onClick={() => {
                                                                         setChosenAgentId(item);
                                                                         setIsSelectionOpen(false);
                                                                     }}
                                                                     className='flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1'>
                                                                    <img src={`${appUrl}/images/${pilotesPictures[index]}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
                                                                    <h2 className='font-p_black text-lg'>{pilotesFirstNames[index]} {pilotesLastNames[index]}</h2>
                                                                </div>
                                                            )) : searchTerm !== '' ? (
                                                            filteredOptions.map((lastname, index) => (
                                                                <div key={index}
                                                                     onClick={() => {
                                                                         setChosenAgentId(pilotesIds[pilotesLastNames.indexOf(lastname)]);
                                                                         setIsSelectionOpen(false);
                                                                     }}
                                                                     className='flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-1'>
                                                                    {/*i may need to take a deeper look at this because A danger might happen if two users have the same name*/}
                                                                    <img src={`${appUrl}/images/${pilotesPictures[pilotesLastNames.indexOf(lastname)]}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
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
                    </div>
                </Modal.Body>
                <div className="border-t-[1px] border-gray-300"></div>
                <Modal.Footer>
                    <div className='flex items-center gap-2 w-full'>
                        <button onClick={submitAction} className={`bg-sky-400 text-white w-full py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-y-1`}>
                            Ajouter une action
                        </button>
                        <Button onClick={() => setOpenModal(false)} color="gray" className='w-full font-p_medium transition-all duration-300 hover:translate-y-1'>Terminer et fermer</Button>
                    </div>
                </Modal.Footer>
            </Modal >
        </>
    )
}