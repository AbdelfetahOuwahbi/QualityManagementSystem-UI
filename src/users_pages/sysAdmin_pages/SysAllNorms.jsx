import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaBars } from 'react-icons/fa';
import SysMainPage from './SysMainPage';
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls.jsx";
import Cookies from "js-cookie";
import { serverAddress } from "../../ServerAddress.jsx";
import { Button, FloatingLabel, Modal, Label, TextInput, Textarea } from "flowbite-react";
import SysAddNorm from './SysAddNorm';

export default function SysAllNorms() {
    // État pour gérer l'ouverture et la fermeture du menu système
    const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);

    // État pour stocker la liste des normes
    const [norms, setNorms] = useState([]);

    // États pour gérer l'édition d'un critère
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingCritere, setEditingCritere] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedComment, setEditedComment] = useState('');

    // États pour gérer l'ouverture et la fermeture de la modal de chapitre
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [editedChapterCode, setEditedChapterCode] = useState('');
    const [editedChapterLabel, setEditedChapterLabel] = useState('');
    const [selectedNormeId, setSelectedNormeId] = useState(null);

    // États pour gérer l'ouverture et la fermeture de la modal de norme
    const [isNormModalOpen, setIsNormModalOpen] = useState(false);
    const [isEditingNorm, setIsEditingNorm] = useState(false);
    const [editedNormCode, setEditedNormCode] = useState('');
    const [editedNormLabel, setEditedNormLabel] = useState('');
    const [editedApplicationDomain, setEditedApplicationDomain] = useState('');
    const [editedNormeDescription, setEditedNormeDescription] = useState('');
    const [editedVersion, setEditedVersion] = useState('');
    const [selectedNorm, setSelectedNorm] = useState(null);

    // États pour gérer la modal de confirmation de suppression
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');

    // État pour gérer l'affichage du formulaire d'ajout de norme
    const [showAddNorm, setShowAddNorm] = useState(false);

    // États pour gérer l'ajout d'un nouveau critère
    const [newCritereDescription, setNewCritereDescription] = useState('');
    const [newCritereComment, setNewCritereComment] = useState('');
    const [showAddCritereForm, setShowAddCritereForm] = useState(false);

    // États pour gérer l'ajout d'un nouveau chapitre
    const [showAddChapterForm, setShowAddChapterForm] = useState(false);
    const [newChapterCode, setNewChapterCode] = useState('');
    const [newChapterLabel, setNewChapterLabel] = useState('');
    const [newChapterCriteres, setNewChapterCriteres] = useState([{ description: '', comment: '' }]);

    useEffect(() => {
        fetchAllNorms();
    }, []);
    // Fonction pour récupérer toutes les normes
    const fetchAllNorms = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                const response = await fetch(`http://${serverAddress}:8080/api/v1/normes`, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setNorms(data);
            } catch (error) {
                console.error(error);
                toast.error("Une erreur s'est produite lors du chargement des normes.");
            }
        }
    };
    // Fonction pour ouvrir la modal de confirmation de suppression
    const openConfirmModal = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setIsConfirmModalOpen(true);
    };
    // Fonction pour supprimer un chapitre ou un critère ou une norme selon son type
    const confirmDelete = async () => {
        let url;
        if (deleteType === 'critere') {
            url = `http://${serverAddress}:8080/api/v1/criteres/${itemToDelete}`;
        } else if (deleteType === 'chapitre') {
            url = `http://${serverAddress}:8080/api/v1/chapitres/${itemToDelete}`;
        } else if (deleteType === 'norme') {
            url = `http://${serverAddress}:8080/api/v1/normes/${itemToDelete}`;
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
            });
            const errorData = await response.json();
            if (response.ok) {
                toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} supprimé avec succès.`);
                fetchAllNorms();
                setIsConfirmModalOpen(false);
                if (deleteType === 'chapitre') {
                    setIsModalOpen(false);
                    setSelectedChapter(null);
                } else if (deleteType === 'norme') {
                    setIsNormModalOpen(false);
                    setSelectedNorm(null);
                }
            }else if(errorData.errorCode == "Frame_already_exists"){
                toast.error(errorData.message);
            } else {
                toast.error(`Erreur lors de la suppression du ${deleteType}.`);
            }
        } catch (error) {
            console.error(error);
            toast.error(`Erreur lors de la suppression du ${deleteType}.`);
        }
    };


    // Fonctions liées aux critères---------------------------------------------------------------------
    // Ouvrir la modal pour confirmer la suppression d'un critère
    const handleDelete = (critereId) => {
        openConfirmModal(critereId, 'critere');
    };
    // Fonction pour gérer l'édition d'un critère
    const handleEditClick = (index, critere) => {
        setEditingIndex(index);
        setEditingCritere(critere);
        setEditedDescription(critere.description);
        setEditedComment(critere.comment);
    };
    // Annuler l'édition d'un critère
    const handleCancelClick = () => {
        setEditingIndex(null);
        setEditingCritere(null);
        setEditedDescription('');
        setEditedComment('');
    };
    // Mettre à jour un critère existant
    const handleUpdate = async (chapitreId) => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/criteres/${editingCritere.id}?chapitreId=${chapitreId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: editedDescription,
                    comment: editedComment,
                }),
            });
            if (response.ok) {
                toast.success("Critère mis à jour avec succès.");
                fetchAllNorms();
                handleCancelClick();
            } else {
                toast.error("Erreur lors de la mise à jour du critère.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour du critère.");
        }
    };
    // Gérer les changements dans les champs des nouveaux critères
    const handleCritereChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCriteres = newChapterCriteres.map((critere, i) =>
            i === index ? { ...critere, [name]: value } : critere
        );
        setNewChapterCriteres(updatedCriteres);
    };
    // Ajouter un nouveau critère à un chapitre existant
    const handleAddCritereToChapter = async () => {
        if (!newCritereDescription || !newCritereComment) {
            toast.error("Tous les champs des critères doivent être remplis.");
            return;
        }

        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/criteres/${selectedChapter.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newCritereDescription, comment: newCritereComment }),
            });

            if (response.ok) {
                toast.success("Critère ajouté avec succès.");
                fetchAllNorms();
                setNewCritereDescription('');
                setNewCritereComment('');
                setShowAddCritereForm(false);
            } else {
                const errorData = await response.json();
                console.error("Erreur lors de l'ajout du critère:", errorData);
                toast.error("Erreur lors de l'ajout du critère. " + (errorData.message || ''));
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du critère:", error);
            toast.error("Erreur lors de l'ajout du critère.");
        }
    };
    // Ajouter un nouveau critère pour un nouveau chapitre
    const addNewCritere = () => {
        setNewChapterCriteres([...newChapterCriteres, { description: '', comment: '' }]);
    };
    // Supprimer un critère du formulaire d'ajout de chapitre
    const removeCritere = (index) => {
        if (newChapterCriteres.length > 1) {
            setNewChapterCriteres(newChapterCriteres.filter((_, i) => i !== index));
        }
    };

    // Fonctions liées aux chapitres---------------------------------------------------------------------
    // Ouvrir la modal pour confirmer la suppression d'un chapitre
    const handleDeleteChapter = (chapitreId) => {
        openConfirmModal(chapitreId, 'chapitre');
    };
    // Gérer la sélection d'un chapitre
    const handleChapterClick = (chapter, normeId) => {
        setSelectedChapter(chapter);
        setSelectedNormeId(normeId); // Stocker normeId
        setEditedChapterCode(chapter.code);
        setEditedChapterLabel(chapter.label);
        setIsModalOpen(true);
    };
    // Fermer la modal de chapitre
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedChapter(null);
        setIsEditingChapter(false);
        setShowAddCritereForm(false);
    };
    // Mettre à jour un chapitre existant
    const handleUpdateChapter = async () => {
        // Ajoutez votre logique de mise à jour du chapitre ici
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/chapitres/${selectedChapter.id}?normeId=${selectedNormeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editedChapterCode,
                    label: editedChapterLabel
                }),
            });
            const responseBody = await response.json();
            console.log("responseBody ->>",responseBody)
            if (response.status === 200 || response.status === 201) {
                toast.success("Chapitre mis à jour avec succès.");
                fetchAllNorms();
                handleCloseModal();
            }else if (responseBody.errorCode === "VALIDATION_ERROR"){
                const errorMessages = responseBody.message.split(',');
                errorMessages.forEach(message => {
                    toast.error(message.trim());
                });
            }else if(responseBody.errorCode === "Frame_already_exists") {
                toast.error(responseBody.message);
            }else {
                toast.error("Erreur lors de la mise à jour du chapitre.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour du chapitre.");
        }
    };
    // Ajouter un nouveau chapitre
    const handleAddChapter = async () => {
        // Vérifiez si tous les critères ont des descriptions et des commentaires
        if (newChapterCriteres.some(critere => !critere.description || !critere.comment)) {
            toast.error("Tous les champs des critères doivent être remplis.");
            return;
        }

        console.log("newChapterCriteres", newChapterCriteres);
        console.log("newChapterCode", newChapterCode);
        console.log("newChapterLabel", newChapterLabel);

        // Créez l'objet à envoyer dans la requête
        const chapitreData = {
            code: newChapterCode,
            label: newChapterLabel,
            criteres: newChapterCriteres
        };

        console.log("chapitreData", chapitreData);

        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/chapitres/${selectedNorm.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chapitreData),
            });

            // Vérifiez le statut de la réponse
            if (response.ok) {
                toast.success("Chapitre ajouté avec succès.");
                fetchAllNorms();
                setNewChapterCode('');
                setNewChapterLabel('');
                setNewChapterCriteres([{ description: '', comment: '' }]);
                setShowAddChapterForm(false);
            } else {
                // Loggez le message d'erreur retourné par l'API
                const errorData = await response.json();
                console.error("Erreur lors de l'ajout du chapitre:", errorData);
                toast.error("Erreur lors de l'ajout du chapitre. " + (errorData.message || ''));
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du chapitre:", error);
            toast.error("Erreur lors de l'ajout du chapitre.");
        }
    };

    // Fonctions liées aux normes---------------------------------------------------------------------
    // Ouvrir la modal pour confirmer la suppression d'une norme
    const handleDeleteNorm = (normId) => {
        openConfirmModal(normId, 'norme');
    };
    // Gérer la sélection d'une norme
    const handleNormClick = (norm) => {
        setSelectedNorm(norm);
        setEditedNormCode(norm.code);
        setEditedNormLabel(norm.label);
        setEditedApplicationDomain(norm.applicationDomain);
        setEditedNormeDescription(norm.description);
        setEditedVersion(norm.version);
        setIsEditingNorm(false);
        setIsNormModalOpen(true);
    };
    // Mettre à jour une norme existante
    const handleUpdateNorm = async () => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/normes/${selectedNorm.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editedNormCode,
                    label: editedNormLabel,
                    applicationDomain: editedApplicationDomain,
                    description: editedNormeDescription,
                    version: editedVersion,
                }),
            });
            const responseBody = await response.json();
            if (response.status === 200 || response.status === 201) {
                toast.success("Chapitre mis à jour avec succès.");
                fetchAllNorms();
                handleCloseNormModal();
            }else if (responseBody.errorCode === "VALIDATION_ERROR"){
                const errorMessages = responseBody.message.split(',');
                errorMessages.forEach(message => {
                    toast.error(message.trim());
                });
            }else if(responseBody.errorCode === "Frame_already_exists") {
                toast.error(responseBody.message);
            }else {
                toast.error("Erreur lors de la mise à jour de la norme.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour de la norme.");
        }
    };
    // Fermer la modal de norme
    const handleCloseNormModal = () => {
        setIsNormModalOpen(false);
        setSelectedNorm(null);
        setIsEditingNorm(false);
        setEditedNormCode('');
        setEditedNormLabel('');
        setEditedApplicationDomain('');
        setEditedNormeDescription('');
        setEditedVersion('');
    };


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex p-4 w-full justify-between">
                {/* Bars Icon That toogles the visibility of the menu */}
                <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)}
                        className='w-6 h-6 cursor-pointer text-neutral-600' />
            </div>
            <div className='border-t border-gray-300 py-4'></div>
            <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
                <h1 className='text-4xl font-p_bold'>Referentiels</h1>
            </div>
            <div className='border-t border-gray-300 w-96 mb-10'></div>
            <div className='w-full h-10 flex items-center px-4 md:px-10'>
                <button
                    className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-x-2`}// Show the SysAddNorm component
                    onClick={() => setShowAddNorm(true)}>
                    Ajouter une norme
                </button>
            </div>

            <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg px-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">N°</th>
                        <th className="px-6 py-3">Normes Code</th>
                        <th className="px-6 py-3">Chapitre Code</th>
                        <th className="px-6 py-3">Critère Description</th>
                        <th className="px-6 py-3">Critère Commentaire</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {norms.map((norm, normIndex) => {
                        const totalCriteres = norm.chapitres.reduce((acc, chapitre) => acc + chapitre.criteres.length, 0);
                        return (
                            <React.Fragment key={norm.id}>
                                {norm.chapitres.map((chapitre, chapitreIndex) => {
                                    const totalCriteresChapitre = chapitre.criteres.length;
                                    return (
                                        <React.Fragment key={chapitre.id}>
                                            {chapitre.criteres.map((critere, critereIndex) => (
                                                <tr key={critere.id} className="border-b">
                                                    {chapitreIndex === 0 && critereIndex === 0 && (
                                                        <td className="px-6 py-4" rowSpan={totalCriteres}>
                                                            {normIndex + 1}
                                                        </td>
                                                    )}
                                                    {chapitreIndex === 0 && critereIndex === 0 && (
                                                        <td className="px-6 py-4" rowSpan={totalCriteres}>
                                        <span
                                            className="cursor-pointer bg-white text-black hover:underline"
                                            onClick={() => handleNormClick(norm)}>{norm.label}</span>
                                                        </td>
                                                    )}
                                                    {critereIndex === 0 && (
                                                        <td className="px-6 py-4" rowSpan={totalCriteresChapitre}>
                                        <span
                                            className="cursor-pointer bg-white text-black hover:underline"
                                            onClick={() => handleChapterClick(chapitre, norm.id)}>{chapitre.label}</span>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4">
                                                        {editingIndex === critere.id ? (
                                                            <FloatingLabel
                                                                onChange={(e) => setEditedDescription(e.target.value)}
                                                                variant="outlined" label={critere.description} value={editedDescription} />
                                                        ) : (
                                                            critere.description
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {editingIndex === critere.id ? (
                                                            <FloatingLabel
                                                                onChange={(e) => setEditedComment(e.target.value)}
                                                                variant="outlined" label={critere.comment} value={editedComment} />
                                                        ) : (
                                                            critere.comment
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 flex flex-col gap-2">
                                                        {editingIndex === critere.id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdate(chapitre.id)}
                                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelClick}
                                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditClick(critere.id, critere)}
                                                                    className="font-medium text-blue-600 hover:underline"
                                                                >
                                                                    Modifier
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(critere.id)}
                                                                    className="font-medium text-red-600 hover:underline"
                                                                >
                                                                    Supprimer
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}

                    </tbody>
                </table>
            </div>
            {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />}
            {isNormModalOpen && (
                <Modal show={isNormModalOpen} size="md" onClose={handleCloseNormModal}>
                    <Modal.Header>
                        Norme Détails
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            {isEditingNorm ? (
                                <>
                                    <FloatingLabel
                                        onChange={(e) => setEditedNormCode(e.target.value)}
                                        variant="outlined" label={selectedNorm.code} value={editedNormCode} />
                                    <FloatingLabel
                                        onChange={(e) => setEditedNormLabel(e.target.value)}
                                        variant="outlined" label={selectedNorm.label} value={editedNormLabel} />
                                    <FloatingLabel
                                        onChange={(e) => setEditedApplicationDomain(e.target.value)}
                                        variant="outlined" label={selectedNorm.applicationDomain} value={editedApplicationDomain} />
                                    <FloatingLabel
                                        type="number"
                                        onChange={(e) => setEditedVersion(e.target.value)}
                                        variant="outlined" label={selectedNorm.version} value={editedVersion} />
                                    <FloatingLabel
                                        onChange={(e) => setEditedNormeDescription(e.target.value)}
                                        variant="outlined" label={"description"} value={editedNormeDescription} />
                                    <div className="flex justify-end space-x-2">
                                        <Button color="success" onClick={handleUpdateNorm}>
                                            Enregistrer
                                        </Button>
                                        <Button color="light" onClick={handleCloseNormModal}>
                                            Annuler
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Code: {selectedNorm.code}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Label: {selectedNorm.label}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Domaine d'Application: {selectedNorm.applicationDomain}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Version: {selectedNorm.version}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Description: {selectedNorm.description}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <Button color="failure" onClick={() => handleDeleteNorm(selectedNorm.id)}>
                                            Supprimer
                                        </Button>
                                        <Button color="info" onClick={() => setIsEditingNorm(true)}>
                                            Modifier
                                        </Button>
                                        <Button color="yellow" onClick={() => setShowAddChapterForm(true)}>
                                            Ajouter Chapitre
                                        </Button>
                                    </div>
                                </>
                            )}

                            {showAddChapterForm && (
                                <div className="space-y-6 mt-6">
                                    <h2 className="text-2xl font-bold mb-4">Ajouter un Chapitre</h2>
                                    <div className="mb-4">
                                        <Label htmlFor="chapterCode">Code</Label>
                                        <TextInput
                                            id="chapterCode"
                                            name="chapterCode"
                                            value={newChapterCode}
                                            onChange={(e) => setNewChapterCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="chapterLabel">Label</Label>
                                        <TextInput
                                            id="chapterLabel"
                                            name="chapterLabel"
                                            value={newChapterLabel}
                                            onChange={(e) => setNewChapterLabel(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4">Ajouter des Critères</h3>
                                    {newChapterCriteres.map((critere, index) => (
                                        <div key={index} className="mb-4">
                                            <h4 className="text-lg font-semibold mb-2">Critère {index + 1}</h4>
                                            <div className="mb-2">
                                                <Label htmlFor={`description-${index}`}>Description</Label>
                                                <Textarea
                                                    id={`description-${index}`}
                                                    name="description"
                                                    value={critere.description}
                                                    onChange={(e) => handleCritereChange(e, index)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <Label htmlFor={`comment-${index}`}>Commentaire</Label>
                                                <Textarea
                                                    id={`comment-${index}`}
                                                    name="comment"
                                                    value={critere.comment}
                                                    onChange={(e) => handleCritereChange(e, index)}
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => removeCritere(index)}
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                Supprimer le Critère
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addNewCritere} className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Ajouter un Critère
                                    </Button>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <Button color="success" onClick={handleAddChapter}>
                                            Ajouter
                                        </Button>
                                        <Button color="light" onClick={() => setShowAddChapterForm(false)}>
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {isConfirmModalOpen && (
                <Modal show={isConfirmModalOpen} size="md" onClose={() => setIsConfirmModalOpen(false)}>
                    <Modal.Header>
                        Confirmation de Suppression
                    </Modal.Header>
                    <Modal.Body>
                        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
                        <div className="flex justify-end space-x-2">
                            <Button color="failure" onClick={confirmDelete}>
                                Supprimer
                            </Button>
                            <Button color="light" onClick={() => setIsConfirmModalOpen(false)}>
                                Annuler
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {selectedChapter && (
                <Modal show={isModalOpen} size="md" onClose={handleCloseModal}>
                    <Modal.Header>
                        Chapitre Details
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            {isEditingChapter ? (
                                <>
                                    <FloatingLabel
                                        onChange={(e) => setEditedChapterCode(e.target.value)}
                                        variant="outlined" label={selectedChapter.code} value={editedChapterCode} required />
                                    <FloatingLabel
                                        onChange={(e) => setEditedChapterLabel(e.target.value)}
                                        variant="outlined" label={selectedChapter.label} value={editedChapterLabel} required />
                                    <div className="flex justify-end space-x-2">
                                        <Button color="success" onClick={handleUpdateChapter}>
                                            Enregistrer
                                        </Button>
                                        <Button color="light" onClick={() => setIsEditingChapter(false)}>
                                            Annuler
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Code: {selectedChapter.code}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        Label: {selectedChapter.label}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <Button color="failure" onClick={() => handleDeleteChapter(selectedChapter.id)}>
                                            Supprimer
                                        </Button>
                                        <Button color="info" onClick={() => setIsEditingChapter(true)}>
                                            Modifier
                                        </Button>
                                        <Button color="yellow" onClick={() => setShowAddCritereForm(true)}>
                                            Ajouter Critère
                                        </Button>
                                    </div>
                                </>
                            )}

                            {showAddCritereForm && (
                                <div className="space-y-6 mt-6">
                                    <h2 className="text-2xl font-bold mb-4">Ajouter un Critère</h2>
                                    <div className="mb-4">
                                        <Label htmlFor="description">Description</Label>
                                        <TextInput
                                            id="description"
                                            name="description"
                                            value={newCritereDescription}
                                            onChange={(e) => setNewCritereDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="comments">Commentaire</Label>
                                        <TextInput
                                            id="comments"
                                            name="comments"
                                            value={newCritereComment}
                                            onChange={(e) => setNewCritereComment(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button color="success" onClick={handleAddCritereToChapter}>
                                            Ajouter
                                        </Button>
                                        <Button color="light" onClick={() => setShowAddCritereForm(false)}>
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
            <SysAddNorm show={showAddNorm} onClose={() => setShowAddNorm(false)} /> {/* Render the SysAddNorm component */}
        </>
    );
}
