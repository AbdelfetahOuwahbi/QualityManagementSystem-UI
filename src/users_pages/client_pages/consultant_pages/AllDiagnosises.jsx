import React, { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { Modal, Button, Datepicker } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import ClientMainPage from '../ClientMainPage';
import { DiagnosisModal } from './DiagnosisModal';
import { serverAddress } from '../../../ServerAddress';
import { DiagnosisDetails } from './DiagnosisDetails';

export default function AllDiagnosises() {

    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
    //Table to fill with the norm, chapter and criterias
    const [areDiagnosisDetailsShown, setAreDiagnosisDetailsShowen] = useState(false);
    //Norm Id And Entreprise Id that will be sent to the Table 
    const [chosenDiagnosisId, setChosenDiagnosisId] = useState('');
    const [chosenDiagnosisCode, setChosenDiagnosisCode] = useState('');
    const [chosenNormeId, setChosenNormeId] = useState('');
    const [chosenEntrepriseId, setChosenEntrepriseId] = useState('');

    const [diagnosisId, setDiagnosisId] = useState([]);
    const [diagnosisCode, setDiagnosisCode] = useState([]);
    const [diagnosisDate, setDiagnosisDate] = useState([]);
    const [diagnosisEntrepriseId, setDiagnosisEntrepriseId] = useState([]);
    const [diagnosisEntrepriseName, setDiagnosisEntrepriseName] = useState([]);
    const [diagnosisNormId, setDiagnosisNormId] = useState([]);
    const [diagnosisNormName, setDiagnosisNormName] = useState([]);
    const [isdiagnosisDone, setIsDiagnosisDone] = useState([]);

    //DELETE VARIABLES
    const [isDeletingDiagnosis, setIsDeletingDiagnosis] = useState(false);
    const [diagnosisToDelete, setDiagnosisToDelete] = useState(0);

    //UPDATE VARIABLES
    //Will take the id of the diagnosis and from there we'll toogle the visibility of the DPicker by camparing it with the current Diag Id 
    const [isChangingDate, setIsChangingDate] = useState(0);
    const [dateToChange, setDateToChange] = useState(new Date());

    const getAllDiagnosises = async () => {
        setDiagnosisId([]);
        setDiagnosisCode([]);
        setDiagnosisDate([]);
        setDiagnosisEntrepriseId([]);
        setDiagnosisEntrepriseName([]);
        setDiagnosisNormId([]);
        setDiagnosisNormName([]);
        setIsDiagnosisDone([]);
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/diagnosis`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`
                }
            });
            const data = await response.json();
            console.log("Got all diagnosises --> ", data);
            setDiagnosisId(data.map(d => d.id));
            setDiagnosisCode(data.map(d => d.code));
            setDiagnosisDate(data.map(d => d.date));
            setDiagnosisEntrepriseId(data.map(d => d.entrepriseId));
            setDiagnosisEntrepriseName(data.map(d => d.entrepriseRaisonSociale));
            setDiagnosisNormId(data.map(d => d.normeId));
            setDiagnosisNormName(data.map(d => d.normeLabel));
            setIsDiagnosisDone(data.map(d => d.isDone));
        } catch (error) {
            console.error("error getting all diagnosises -> ", error)
        }
    }

    //On Mount We'll get all the saved Diagnosises
    useEffect(() => {
        if (diagnosisId.length > 0) {
            console.log("Already got all Diagnosises !")
        } else {
            getAllDiagnosises();
        }
    }, [])

    //Function that updates a diagnosis
    const updateDiagnosis = async (diagnosis, code, dateToChange) => {
        console.log(diagnosis);
        console.log(dateToChange);
        if (dateToChange.getTime() < new Date().getTime()) {
            console.log("You can't change to a date in the past !!");
            toast.error("vous devez choisir une date supérieur al la date d'aujourd'hui !!")
        } else {
            try {
                const response = await fetch(`http://${serverAddress}:8080/api/v1/diagnosis/${diagnosis}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify({
                        "date": dateToChange,
                        "code": code,
                    }),
                });
                if (response.ok) {
                    console.log("Diagnosis updated successfully");
                    toast.success("La date de ce diagnostic a été modifiée avec succès ..", {
                        duration: 2000
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                } else {
                    console.error("Failed to update diagnosis. Status:", response.status);
                    toast.error("une errur s'est produit, la date n'a été modifiée !!")
                }
            } catch (error) {
                console.error("error updating diagnosis --> ", error)
            }

            setIsChangingDate(0);
        }
    }

    //Function that deletes a diagnosis
    const destroyDiagnosis = async (diagnosis) => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/diagnosis/${diagnosis}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setIsDeletingDiagnosis(false);
                getAllDiagnosises();
                console.log("Diagnosis Destroyed successfully ..");
                toast.success("Ce diagnostic est éliminé ..")
            } else {
                throw new Error(`Failed to delete diagnosis: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting diagnosis:', error);
            // Handle error
            throw error; // Optionally re-throw the error for the caller to handle
        }
    }

    useEffect(() => {
        console.log(diagnosisId);
    }, [diagnosisId])


    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="flex flex-col w-full h-auto pb-10">
                <div className="flex p-4 w-full items-center justify-between">
                    {/* Bars Icon That toogles the visibility of the menu */}
                    <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
                </div>
                <div className='border-t border-gray-300 py-4'></div>


                <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
                    <h1 className='text-4xl font-p_bold'>Mes Diagnostics</h1>
                </div>
                <div className='border-t border-gray-300 w-96 mb-10'></div>

                <div className='w-full h-10 flex items-center px-4 md:px-10'>
                    <button onClick={() => setIsDiagnosisModalOpen(true)} className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-x-2`}>
                        Nouveau diagnostic
                    </button>
                </div>

            </div>

            {/* Table des diagnostics */}

            <div className="px-2 md:px-8 shadow-md">
                <table id="consultantsTable"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date de diagnostic
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Entreprise Cliente
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Norme choisi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {diagnosisId.map((dgns, index) =>
                            <tr key={index} className="border-b">
                                <td className="px-6 py-4">{diagnosisCode[index]}</td>
                                {isChangingDate === diagnosisId[index] ? (

                                    <Datepicker
                                        value={dateToChange}
                                        language="FR-fr"
                                        onSelectedDateChanged={(date) => setDateToChange(date)}
                                        className='z-0'
                                    />

                                ) : (
                                    <td className="px-6 py-4">{diagnosisDate[index].replace('T', ' a ')}</td>
                                )}
                                <td className="px-6 py-4">{diagnosisEntrepriseName[index]}</td>
                                <td className="px-6 py-4">{diagnosisNormName[index]}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {isdiagnosisDone[index] !== "done" &&
                                            <>
                                                {isChangingDate === diagnosisId[index] ?
                                                    <>
                                                        <button onClick={() => updateDiagnosis(diagnosisId[index], diagnosisCode[index], dateToChange)} className="font-medium text-green-500 hover:underline">Enregistrer</button>
                                                        <button onClick={() => setIsChangingDate(false)} className="font-medium text-red-600 hover:underline">Annuler</button>
                                                    </>
                                                    :
                                                    <>
                                                        <button onClick={() => {
                                                            setChosenDiagnosisId(diagnosisId[index])
                                                            setChosenDiagnosisCode(diagnosisCode[index]);
                                                            setChosenEntrepriseId(diagnosisEntrepriseName[index]);
                                                            setChosenNormeId(diagnosisNormId[index]);
                                                            setAreDiagnosisDetailsShowen(!areDiagnosisDetailsShown);
                                                        }} className="font-medium text-blue-600 hover:underline">{isdiagnosisDone[index] === "notStarted" ? "Commencer" : "Continuer"}</button>
                                                        {isdiagnosisDone[index] === "notStarted" &&
                                                            <button onClick={() => {
                                                                setIsChangingDate(diagnosisId[index]);
                                                            }} className="font-medium text-green-500 hover:underline">Changer La date</button>
                                                        }
                                                        <button onClick={() => {
                                                            setIsDeletingDiagnosis(true);
                                                            setDiagnosisToDelete(diagnosisId[index]);
                                                        }} className="font-medium text-red-600 hover:underline">Detruire</button>
                                                    </>
                                                }

                                            </>
                                        }
                                        {isdiagnosisDone[index] === "done" &&
                                            <h1 className='font-p_black text-gray-500 opacity-70'>(Deja fait le {diagnosisDate[index].replace('T', ' a ')})</h1>
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>


            {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
            {isDiagnosisModalOpen && <DiagnosisModal onClose={() => setIsDiagnosisModalOpen(false)} />}
            {areDiagnosisDetailsShown && <DiagnosisDetails diagnosisId={chosenDiagnosisId} DiagnosisCode={chosenDiagnosisCode} chosenNormeId={chosenNormeId} chosenEntreprise={chosenEntrepriseId} onClose={() => setAreDiagnosisDetailsShowen(false)} />}
            <Modal show={isDeletingDiagnosis} size="md" onClose={() => setIsDeletingDiagnosis(false)}
                popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Êtes-vous sûr que vous voulez detruire ce diagnostic ?
                        </h3>
                        <h3 className='mb-5 text-lg font-normal text-sky-700'>notez bien que vous pouvez modifier la date !!</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                                destroyDiagnosis(diagnosisToDelete);
                            }}>
                                {"Oui, je suis sur"}
                            </Button>
                            <Button color="gray" onClick={() => setIsDeletingDiagnosis(false)}>
                                Non, Annuler
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
