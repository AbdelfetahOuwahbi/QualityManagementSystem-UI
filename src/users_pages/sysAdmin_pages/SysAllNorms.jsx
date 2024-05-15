import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaBars } from 'react-icons/fa';
import SysMainPage from './SysMainPage';
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls.jsx";
import Cookies from "js-cookie";
import { serverAddress } from "../../ServerAddress.jsx";
import { Button, FloatingLabel, Modal, Label, TextInput } from "flowbite-react";
import SysAddNorm from './SysAddNorm'; // Import the SysAddNorm component

export default function SysAllNorms() {
    const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);
    const [norms, setNorms] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingCritere, setEditingCritere] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedComment, setEditedComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [editedChapterCode, setEditedChapterCode] = useState('');
    const [editedChapterLabel, setEditedChapterLabel] = useState('');
    const [selectedNormeId, setSelectedNormeId] = useState(null); // Nouvel état pour stocker normeId
    const [isNormModalOpen, setIsNormModalOpen] = useState(false);
    const [isEditingNorm, setIsEditingNorm] = useState(false);
    const [editedNormCode, setEditedNormCode] = useState('');
    const [editedNormLabel, setEditedNormLabel] = useState('');
    const [editedApplicationDomain, setEditedApplicationDomain] = useState('');
    const [editedNormeDescription, setEditedNormeDescription] = useState('');
    const [editedVersion, setEditedVersion] = useState('');
    const [selectedNorm, setSelectedNorm] = useState(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [showAddNorm, setShowAddNorm] = useState(false);
    const [newCritereDescription, setNewCritereDescription] = useState('');
    const [newCritereComment, setNewCritereComment] = useState('');
    const [showAddCritereForm, setShowAddCritereForm] = useState(false);

    // New state for adding chapter
    const [showAddChapterForm, setShowAddChapterForm] = useState(false);
    const [newChapterCode, setNewChapterCode] = useState('');
    const [newChapterLabel, setNewChapterLabel] = useState('');
    const [newCriteres, setNewCriteres] = useState([{ description: '', comment: '' }]); // New state for adding criteria

    useEffect(() => {
        fetchAllNorms();
    }, []);

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

    const openConfirmModal = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setIsConfirmModalOpen(true);
    };

    const handleDelete = (critereId) => {
        openConfirmModal(critereId, 'critere');
    };

    const handleDeleteChapter = (chapitreId) => {
        openConfirmModal(chapitreId, 'chapitre');
    };

    const handleDeleteNorm = (normId) => {
        openConfirmModal(normId, 'norme');
    };

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
            if (response.ok) {
                toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} supprimé avec succès.`);
                fetchAllNorms();
                setIsConfirmModalOpen(false);
            } else {
                toast.error(`Erreur lors de la suppression du ${deleteType}.`);
            }
        } catch (error) {
            console.error(error);
            toast.error(`Erreur lors de la suppression du ${deleteType}.`);
        }
    };

    const handleEditClick = (index, critere) => {
        setEditingIndex(index);
        setEditingCritere(critere);
        setEditedDescription(critere.description);
        setEditedComment(critere.comment);
    };

    const handleCancelClick = () => {
        setEditingIndex(null);
        setEditingCritere(null);
        setEditedDescription('');
        setEditedComment('');
    };

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

    const handleChapterClick = (chapter, normeId) => {
        setSelectedChapter(chapter);
        setSelectedNormeId(normeId); // Stocker normeId
        setEditedChapterCode(chapter.code);
        setEditedChapterLabel(chapter.label);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedChapter(null);
        setIsEditingChapter(false);
        setShowAddCritereForm(false);
    };

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
            if (response.ok) {
                toast.success("Chapitre mis à jour avec succès.");
                fetchAllNorms();
                handleCloseModal();
            } else {
                toast.error("Erreur lors de la mise à jour du chapitre.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour du chapitre.");
        }
    };

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
            if (response.ok) {
                toast.success("Norme mise à jour avec succès.");
                fetchAllNorms();
                handleCloseNormModal();
            } else {
                toast.error("Erreur lors de la mise à jour de la norme.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour de la norme.");
        }
    };

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

    const handleAddCritere = async () => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/criteres/${selectedChapter.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: newCritereDescription,
                    comment: newCritereComment
                }),
            });
            if (response.ok) {
                toast.success("Critère ajouté avec succès.");
                fetchAllNorms();
                setNewCritereDescription('');
                setNewCritereComment('');
                setShowAddCritereForm(false);
            } else {
                toast.error("Erreur lors de l'ajout du critère.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout du critère.");
        }
    };

    // Function to handle adding a chapter
    const handleAddChapter = async () => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/chapitres/${selectedNorm.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: newChapterCode,
                    label: newChapterLabel,
                    criteres: newCriteres // Add the criteria to the chapter
                }),
            });
            if (response.ok) {
                toast.success("Chapitre ajouté avec succès.");
                fetchAllNorms();
                setNewChapterCode('');
                setNewChapterLabel('');
                setNewCriteres([{ description: '', comment: '' }]); // Reset criteria state
                setShowAddChapterForm(false);
            } else {
                toast.error("Erreur lors de l'ajout du chapitre.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout du chapitre.");
        }
    };

    // Function to handle adding new criterion fields
    const handleAddCritereField = () => {
        setNewCriteres([...newCriteres, { description: '', comment: '' }]);
    };

    // Function to handle changing criteria fields
    const handleCritereChange = (index, field, value) => {
        const updatedCriteres = [...newCriteres];
        updatedCriteres[index][field] = value;
        setNewCriteres(updatedCriteres);
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex p-4 w-full justify-between">
                {/* Bars Icon That toggles the visibility of the menu */}
                <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)}
                        className='w-6 h-6 cursor-pointer text-neutral-600' />
            </div>
            <div className='border-t border-gray-300 py-4'></div>
            <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
                <h1 className='text-4xl font-p_bold'>Referentiels</h1>
                <div className='w-full h-10 flex items-center px-4 md:px-10'>
                    <button
                        className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-x-2`}
                        onClick={() => setShowAddNorm(true)} // Show the SysAddNorm component
                    >
                        Ajouter une norme
                    </button>
                </div>
            </div>
            <div className='border-t border-gray-300 w-96 mb-10'></div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4">
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
                    {norms.map((norm, normIndex) => (
                        <React.Fragment key={norm.id}>
                            {norm.chapitres.map((chapitre, chapitreIndex) => (
                                <React.Fragment key={chapitre.id}>
                                    {chapitre.criteres.map((critere, critereIndex) => (
                                        <tr key={critere.id} className="border-b">
                                            <td className="px-6 py-4">
                                                {critereIndex === 0 && chapitreIndex === 0 && normIndex + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                {critereIndex === 0 && chapitreIndex === 0 && (
                                                    <span
                                                        className="cursor-pointer bg-white text-black hover:underline"
                                                        onClick={() => handleNormClick(norm)}>{norm.code}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {critereIndex === 0 && (
                                                    <span
                                                        className="cursor-pointer bg-white text-black hover:underline"
                                                        onClick={() => handleChapterClick(chapitre, norm.id)}>{chapitre.code}</span>
                                                )}
                                            </td>
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
                            ))}
                        </React.Fragment>
                    ))}
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

                            {/* Formulaire pour ajouter un chapitre */}
                            {showAddChapterForm && (
                                <div className="space-y-6 mt-6">
                                    <h2 className="text-2xl font-bold mb-4">Ajouter un Chapitre</h2>
                                    <div className="mb-4">
                                        <Label htmlFor="chapterCode">Code</Label>
                                        <TextInput id="chapterCode" name="chapterCode" value={newChapterCode}
                                                   onChange={(e) => setNewChapterCode(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="chapterLabel">Label</Label>
                                        <TextInput id="chapterLabel" name="chapterLabel" value={newChapterLabel}
                                                   onChange={(e) => setNewChapterLabel(e.target.value)} required />
                                    </div>
                                    {newCriteres.map((critere, index) => (
                                        <div key={index} className="mb-4">
                                            <Label htmlFor={`critereDescription${index}`}>Description du Critère {index + 1}</Label>
                                            <TextInput
                                                id={`critereDescription${index}`}
                                                name="critereDescription"
                                                value={critere.description}
                                                onChange={(e) => handleCritereChange(index, 'description', e.target.value)}
                                                required
                                            />
                                            <Label htmlFor={`critereComment${index}`}>Commentaire du Critère {index + 1}</Label>
                                            <TextInput
                                                id={`critereComment${index}`}
                                                name="critereComment"
                                                value={critere.comment}
                                                onChange={(e) => handleCritereChange(index, 'comment', e.target.value)}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <Button onClick={handleAddCritereField} color="blue">
                                        Ajouter un autre Critère
                                    </Button>
                                    <div className="flex justify-end space-x-2">
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

                            {/* Formulaire pour ajouter un critère */}
                            {showAddCritereForm && (
                                <div className="space-y-6 mt-6">
                                    <h2 className="text-2xl font-bold mb-4">Ajouter un Critère</h2>
                                    <div className="mb-4">
                                        <Label htmlFor="description">Description</Label>
                                        <TextInput id="description" name="description" value={newCritereDescription}
                                                   onChange={(e) => setNewCritereDescription(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="comments">Commentaire</Label>
                                        <TextInput id="comments" name="comments" value={newCritereComment}
                                                   onChange={(e) => setNewCritereComment(e.target.value)} required />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button color="success" onClick={handleAddCritere}>
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
