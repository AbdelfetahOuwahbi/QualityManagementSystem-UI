import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Textarea, Modal } from 'flowbite-react';
import 'flowbite/dist/flowbite.css';
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls.jsx";
import Cookies from "js-cookie";
import { serverAddress } from "../../ServerAddress.jsx";
import toast from "react-hot-toast";

export default function SysAddNorm({ onClose, show }) {

    //To toogle the visibilty of criteria fields
    const [did_Chapter_Filled_Its_Criterias, setDid_Chapter_Filled_Its_Criterias] = useState(false);

    const initialNormeState = {
        code: '',
        label: '',
        applicationDomain: '',
        version: '',
        description: ''
    };

    const initialChapitreState = {
        code: '',
        label: '',
        description: ''
    };

    const initialCritereState = {
        description: '',
        comment: ''
    };

    const [step, setStep] = useState(1);
    const [norme, setNorme] = useState(initialNormeState);
    const [currentChapitre, setCurrentChapitre] = useState(initialChapitreState);
    const [criteres, setCriteres] = useState([initialCritereState]);
    const [fetchNorme, setFetchNorme] = useState({});
    const [fetchChapitre, setFetchChapitre] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!show) {
            resetForm();
        }
    }, [show]);

    const resetForm = () => {
        setStep(1);
        setNorme(initialNormeState);
        setCurrentChapitre(initialChapitreState);
        setCriteres([initialCritereState]);
        setFetchNorme({});
        setFetchChapitre(null);
        setSubmitted(false);
    };

    const handleChange = (e, setState, state) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const saveNorme = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                const response = await fetch(`http://${serverAddress}:8080/api/v1/normes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify(norme),
                });
                const responseBody = await response.json();
                if (response.status === 200 || response.status === 201) {
                    toast.success("Norme ajoutée avec succès.");
                    setFetchNorme(responseBody); // Enregistrer la réponse pour utiliser l'ID de la norme
                    handleNextStep();
                } else if (responseBody.errorCode === "VALIDATION_ERROR") {
                    const errorMessages = responseBody.message.split(',');
                    errorMessages.forEach(message => {
                        toast.error(message.trim());
                    });
                } else {
                    toast.error("Une erreur s'est produite lors de l'ajout de cette norme.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Une erreur s'est produite lors de l'ajout de cette norme.");
            }
        }
    };

    const saveChapitre = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                const response = await fetch(`http://${serverAddress}:8080/api/v1/chapitres/${fetchNorme.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify({
                        ...currentChapitre,
                    }),
                });
                const responseBody = await response.json();
                if (response.status === 200 || response.status === 201) {
                    setFetchChapitre(responseBody);
                    toast.success("Chapitre ajouté avec succès.");
                } else {
                    toast.error("Une erreur s'est produite lors de l'ajout du chapitre.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Une erreur s'est produite lors de l'ajout du chapitre.");
            }
        }
    };

    const saveCriteres = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                for (let i = 0; i < criteres.length; i++) {
                    const critere = criteres[i];
                    const response = await fetch(`http://${serverAddress}:8080/api/v1/criteres/${fetchChapitre.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get("JWT")}`,
                        },
                        body: JSON.stringify({
                            ...critere,
                        }),
                    });
                    const responseBody = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        toast.success("Critère ajouté avec succès.");
                    } else {
                        toast.error("Une erreur s'est produite lors de l'ajout du critère.");
                    }
                }
                setSubmitted(true); // Définir submitted à true après avoir soumis les critères
            } catch (error) {
                console.error(error);
                toast.error("Une erreur s'est produite lors de l'ajout des critères.");
            }
        }
    };

    const handleNormeSubmit = (e) => {
        e.preventDefault();
        saveNorme();
    };

    const handleChapitreSubmit = (e) => {
        e.preventDefault();
        saveChapitre();
        setDid_Chapter_Filled_Its_Criterias(false);
    };

    const handleCritereSubmit = (e) => {
        e.preventDefault();
        saveCriteres();
    };

    const handleNewChapitre = () => {
        setFetchChapitre(null); // Reset fetchChapitre to add a new chapitre
        setCriteres([initialCritereState]); // Reset criteres
        setSubmitted(false); // Reset submitted
    };

    const addCritere = () => {
        setCriteres([...criteres, { description: '', comment: '' }]);
    };

    const removeCritere = () => {
        if (criteres.length > 1) {
            setCriteres(criteres.slice(0, -1));
        }
    };

    const handleCritereChange = (index, e) => {
        const updatedCriteres = criteres.map((critere, i) =>
            i === index ? { ...critere, [e.target.name]: e.target.value } : critere
        );
        setCriteres(updatedCriteres);
    };

    const handleClose = () => {
        setShowConfirm(true);
    };

    const confirmClose = () => {
        setShowConfirm(false);
        onClose();
    };

    return (
        <>
            <Modal show={show} onClose={handleClose} size="xl">
                <Modal.Header>
                    Ajouter une Norme
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={step === 1 ? handleNormeSubmit : handleCritereSubmit}>
                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-bold mb-4">Ajouter une Norme</h2>
                                <div className="mb-4">
                                    <Label htmlFor="code">Code</Label>
                                    <TextInput id="code" name="code" value={norme.code}
                                        onChange={(e) => handleChange(e, setNorme, norme)} required />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="label">Label</Label>
                                    <TextInput id="label" name="label" value={norme.label}
                                        onChange={(e) => handleChange(e, setNorme, norme)} required />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="applicationDomain">Application Domain</Label>
                                    <TextInput id="applicationDomain" name="applicationDomain" value={norme.applicationDomain}
                                        onChange={(e) => handleChange(e, setNorme, norme)} required />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="version">Version</Label>
                                    <TextInput type="number" id="version" name="version" value={norme.version}
                                        onChange={(e) => handleChange(e, setNorme, norme)} required />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={norme.description}
                                        onChange={(e) => handleChange(e, setNorme, norme)} required />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Next</Button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h2 className="text-2xl font-bold mb-4">Ajouter un Chapitre et ses Critères</h2>
                                {!fetchChapitre && (
                                    <>
                                        <div className="mb-4">
                                            <Label htmlFor="code">Code</Label>
                                            <TextInput id="code" name="code" value={currentChapitre.code}
                                                onChange={(e) => handleChange(e, setCurrentChapitre, currentChapitre)} required />
                                        </div>
                                        <div className="mb-4">
                                            <Label htmlFor="label">Label</Label>
                                            <TextInput id="label" name="label" value={currentChapitre.label}
                                                onChange={(e) => handleChange(e, setCurrentChapitre, currentChapitre)} required />
                                        </div>
                                        <div className="mb-4">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea id="description" name="description" value={currentChapitre.description}
                                                onChange={(e) => handleChange(e, setCurrentChapitre, currentChapitre)} required />
                                        </div>
                                        <div className="mb-4">
                                            <Button type="button" onClick={handleChapitreSubmit} className="bg-blue-500 hover:bg-blue-600 text-white">Save Chapitre</Button>
                                        </div>
                                    </>
                                )}
                                {fetchChapitre && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">Ajouter des Critères</h3>
                                        {did_Chapter_Filled_Its_Criterias === false && criteres.map((critere, index) => (
                                            <div key={index} className="mb-4">
                                                <h4 className="text-lg font-semibold mb-2">Critère {index + 1}</h4>
                                                <div className="mb-2">
                                                    <Label htmlFor={`description-${index}`}>Description</Label>
                                                    <Textarea id={`description-${index}`} name="description" value={critere.description}
                                                        onChange={(e) => handleCritereChange(index, e)} required />
                                                </div>
                                                <div className="mb-2">
                                                    <Label htmlFor={`comment-${index}`}>Commentaire</Label>
                                                    <Textarea id={`comment-${index}`} name="comment" value={critere.comment}
                                                        onChange={(e) => handleCritereChange(index, e)} required />
                                                </div>
                                            </div>
                                        ))}

                                        {!submitted && (
                                            <div className="flex justify-between mb-4">
                                                <Button type="button" onClick={addCritere} className="bg-blue-500 hover:bg-blue-600 text-white">Ajouter un Critère</Button>
                                                {criteres.length > 1 && (
                                                    <Button type="button" onClick={removeCritere} className="bg-red-500 hover:bg-red-600 text-white">Supprimer le Dernier Critère</Button>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <Button type="button" onClick={() => {
                                                handleNewChapitre();
                                                setDid_Chapter_Filled_Its_Criterias(false);
                                            }} className="bg-yellow-500 hover:bg-yellow-600 text-white">Nouveau Chapitre</Button>
                                            {!submitted && (
                                                <Button onClick={() => setDid_Chapter_Filled_Its_Criterias(true)} type="submit" className="bg-green-500 hover:bg-green-600 text-white">Submit</Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </form>
                </Modal.Body>
            </Modal>

            {showConfirm && (
                <Modal show={showConfirm} onClose={() => setShowConfirm(false)} size="md">
                    <Modal.Header>
                        Confirmation
                    </Modal.Header>
                    <Modal.Body>
                        <p>Êtes-vous sûr de vouloir quitter ? Toutes les modifications non enregistrées seront perdues.</p>
                        <div className="flex mt-10 justify-end gap-4">
                            <Button type="button" onClick={confirmClose} className="bg-red-500 hover:bg-red-600 text-white">Oui</Button>
                            <Button type="button" onClick={() => setShowConfirm(false)} className="bg-gray-500 hover:bg-gray-600 text-white">Non</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
}
