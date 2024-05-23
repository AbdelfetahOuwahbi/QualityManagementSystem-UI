import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Textarea, Modal } from 'flowbite-react';
import 'flowbite/dist/flowbite.css';
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls.jsx";
import Cookies from "js-cookie";
import { serverAddress } from "../../ServerAddress.jsx";
import toast from "react-hot-toast";

export default function SysAddNorm({ onClose, show }) {
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
        criteres: [{ description: '', comment: '' }]
    };

    const [step, setStep] = useState(1);
    const [norme, setNorme] = useState(initialNormeState);
    const [chapitres, setChapitres] = useState([initialChapitreState]);
    const [currentChapitreIndex, setCurrentChapitreIndex] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [chapitreValidated, setChapitreValidated] = useState(false);
    const [codeExists, setCodeExists] = useState(false);

    useEffect(() => {
        if (!show) {
            resetForm();
        }
    }, [show]);

    const resetForm = () => {
        setStep(1);
        setNorme(initialNormeState);
        setChapitres([initialChapitreState]);
        setCurrentChapitreIndex(0);
        setChapitreValidated(false);
    };

    const handleChange = (e, setState, state) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleNextStep = async () => {
        if (step === 1) {
            // Validation des champs de la norme
            if (!norme.code || !norme.label || !norme.applicationDomain || !norme.version || !norme.description) {
                toast.error("Tous les champs de la norme doivent être remplis.");
                return;
            }

            if (isNaN(norme.version) || norme.version <= 0) {
                toast.error("La version doit être un nombre positif.");
                return;
            }

            // Vérification si le code de la norme existe déjà
            const exists = await checkIfCodeExists(norme.code);
            if (exists) {
                toast.error("Le code de la norme existe déjà.");
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleChapitreChange = (e) => {
        const updatedChapitres = chapitres.map((chapitre, index) =>
            index === currentChapitreIndex ? { ...chapitre, [e.target.name]: e.target.value } : chapitre
        );
        setChapitres(updatedChapitres);
    };

    const handleCritereChange = (critereIndex, e) => {
        const updatedChapitres = chapitres.map((chapitre, index) => {
            if (index === currentChapitreIndex) {
                const updatedCriteres = chapitre.criteres.map((critere, i) =>
                    i === critereIndex ? { ...critere, [e.target.name]: e.target.value } : critere
                );
                return { ...chapitre, criteres: updatedCriteres };
            }
            return chapitre;
        });
        setChapitres(updatedChapitres);
    };

    const addChapitre = () => {
        setChapitres([...chapitres, initialChapitreState]);
        setCurrentChapitreIndex(chapitres.length);
        setChapitreValidated(false);
    };

    const addCritere = () => {
        const updatedChapitres = chapitres.map((chapitre, index) => {
            if (index === currentChapitreIndex) {
                return { ...chapitre, criteres: [...chapitre.criteres, { description: '', comment: '' }] };
            }
            return chapitre;
        });
        setChapitres(updatedChapitres);
    };

    const removeCritere = (critereIndex) => {
        const updatedChapitres = chapitres.map((chapitre, index) => {
            if (index === currentChapitreIndex && chapitre.criteres.length > 1) {
                const updatedCriteres = chapitre.criteres.filter((_, i) => i !== critereIndex);
                return { ...chapitre, criteres: updatedCriteres };
            }
            return chapitre;
        });
        setChapitres(updatedChapitres);
    };

    const validateChapitre = () => {
        const currentChapitre = chapitres[currentChapitreIndex];
        const isCodeUnique = chapitres.every((chapitre, index) => index === currentChapitreIndex || chapitre.code !== currentChapitre.code);

        if (!isCodeUnique) {
            toast.error("Le code du chapitre doit être unique.");
            return;
        }

        if (!currentChapitre.code || !currentChapitre.label) {
            toast.error("Tous les champs du chapitre doivent être remplis.");
            return;
        }

        const invalidCritere = currentChapitre.criteres.find(critere => !critere.description || !critere.comment);
        if (invalidCritere) {
            toast.error("Tous les champs des critères doivent être remplis.");
            return;
        }

        setChapitreValidated(true);
    };

    const checkIfCodeExists = async (code) => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/normes/existByCode?normCode=${code}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                },
            });
            const exists = await response.json();
            return exists;
        } catch (error) {
            console.error(error);
            toast.error("Une erreur s'est produite lors de la vérification du code.");
            return false;
        }
    };

    const handleFinalSubmit = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                // Save Norme
                let response = await fetch(`http://${serverAddress}:8080/api/v1/normes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify(norme),
                });
                const responseNorme = await response.json();
                if (responseNorme.errorCode === "VALIDATION_ERROR"){
                    const errorMessages = responseNorme.message.split(',');
                    errorMessages.forEach(message => {
                        toast.error(message.trim());
                    });
                    return;
                } else if(responseNorme.errorCode === "Frame_already_exists") {
                    toast.error(responseNorme.message);
                    return;
                }

                // Save Chapitres and Criteres
                for (const chapitre of chapitres) {
                    response = await fetch(`http://${serverAddress}:8080/api/v1/chapitres/${responseNorme.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get("JWT")}`,
                        },
                        body: JSON.stringify({ code: chapitre.code, label: chapitre.label }),
                    });
                    const responseChapitre = await response.json();
                    if (response.status !== 200 && response.status !== 201) {
                        throw new Error(responseChapitre.message || "Erreur lors de l'ajout du chapitre.");
                    }

                    for (const critere of chapitre.criteres) {
                        response = await fetch(`http://${serverAddress}:8080/api/v1/criteres/${responseChapitre.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${Cookies.get("JWT")}`,
                            },
                            body: JSON.stringify(critere),
                        });
                        const responseCritere = await response.json();
                        if (response.status !== 200 && response.status !== 201) {
                            throw new Error(responseCritere.message || "Erreur lors de l'ajout du critère.");
                        }
                    }
                }

                toast.success("Norme, chapitres et critères ajoutés avec succès.");
                resetForm();
                window.location.reload();
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Une erreur s'est produite.");
            }
        }
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
                    <form onSubmit={(e) => { e.preventDefault(); handleFinalSubmit(); }}>
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
                                    <Label htmlFor="applicationDomain">Domaine d'Application</Label>
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
                                <div className="flex justify-between">
                                    <Button type="button" onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600 text-white">Next</Button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                {!chapitreValidated && (
                                    <>
                                        <h2 className="text-2xl font-bold mb-4">Ajouter un Chapitre et ses Critères</h2>
                                        <div className="mb-4">
                                            <Label htmlFor="code">Code du Chapitre</Label>
                                            <TextInput id="code" name="code" value={chapitres[currentChapitreIndex].code}
                                                       onChange={handleChapitreChange} required />
                                        </div>
                                        <div className="mb-4">
                                            <Label htmlFor="label">Label du Chapitre</Label>
                                            <TextInput id="label" name="label" value={chapitres[currentChapitreIndex].label}
                                                       onChange={handleChapitreChange} required />
                                        </div>
                                        <div className="mb-4">
                                            <h3 className="text-xl font-semibold mb-4">Ajouter des Critères</h3>
                                            {chapitres[currentChapitreIndex].criteres.map((critere, critereIndex) => (
                                                <div key={critereIndex} className="mb-4">
                                                    <h4 className="text-lg font-semibold mb-2">Critère {critereIndex + 1}</h4>
                                                    <div className="mb-2">
                                                        <Label htmlFor={`description-${critereIndex}`}>Description</Label>
                                                        <Textarea id={`description-${critereIndex}`} name="description" value={critere.description}
                                                                  onChange={(e) => handleCritereChange(critereIndex, e)} required />
                                                    </div>
                                                    <div className="mb-2">
                                                        <Label htmlFor={`comment-${critereIndex}`}>Commentaire</Label>
                                                        <Textarea id={`comment-${critereIndex}`} name="comment" value={critere.comment}
                                                                  onChange={(e) => handleCritereChange(critereIndex, e)} required />
                                                    </div>
                                                    <Button type="button" onClick={() => removeCritere(critereIndex)} className="bg-red-500 hover:bg-red-600 text-white">Supprimer le Critère</Button>
                                                </div>
                                            ))}
                                            <Button type="button" onClick={addCritere} className="bg-blue-500 hover:bg-blue-600 text-white">Ajouter un Critère</Button>
                                        </div>
                                        <div className="flex justify-between">
                                            <Button type="button" onClick={handlePreviousStep} className="bg-gray-500 hover:bg-gray-600 text-white">Back</Button>
                                            <Button type="button" onClick={validateChapitre} className="bg-green-500 hover:bg-green-600 text-white">Valider le Chapitre</Button>
                                        </div>
                                    </>
                                )}
                                {chapitreValidated && (
                                    <div className="flex justify-between">
                                        <Button type="button" onClick={addChapitre} className="bg-yellow-500 hover:bg-yellow-600 text-white">Ajouter un autre Chapitre</Button>
                                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Submit</Button>
                                    </div>
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
