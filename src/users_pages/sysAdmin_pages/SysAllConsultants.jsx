import React, { useEffect, useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, FloatingLabel, Modal, ToggleSwitch } from "flowbite-react";
import { FaBars } from "react-icons/fa";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { isTokenExpired, isTokenInCookies, lockOrUnlockUser } from "../CommonApiCalls";
import SysMainPage from "./SysMainPage";

export default function SysAllConsultants() {

    const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);

    //Toogler for the addConsultant Modal
    const [addConsultantVisible, setAddConsultantVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('firstName'); // Default selected field
    //for the alert of confirming delete
    const [confirmDelete, setConfirmDelete] = useState({ userId: null, value: false });

    // Consultant Properties
    const [id, setId] = useState([]);
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [organismeName, setOrganismeName] = useState([]);
    const [organismeId, setOrganismeId] = useState([]);
    // toogler of the switch that locks/unlocks consultant account
    const [isAccountLocked, setIsAccountLocked] = useState([]);

    // Ajouter un nouvel état pour suivre l'index de la ligne en cours de modification
    const [editingIndex, setEditingIndex] = useState(-1); // -1 signifie qu'aucune ligne n'est en cours de modification

    // Search states for each field
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [searchOrganismeName, setSearchOrganismeName] = useState('');


    // State to store all organismes
    const [organismes, setOrganismes] = useState([]);
    const [idToSendOrganism, setIdToSendOrganism] = useState(0);

    const [originalData, setOriginalData] = useState({});
    const handleEditClick = (index) => {
        setOriginalData({
            firstName: firstName[index],
            lastName: lastName[index],
            email: email[index],
            phone: phone[index],
            organismeName: organismeName[index],
            isAccountLocked: isAccountLocked[index]
        });
        setEditingIndex(index);
    };

    const handleCancelClick = () => {
        if (editingIndex !== -1) {
            setFirstName(prev => [...prev.slice(0, editingIndex), originalData.firstName, ...prev.slice(editingIndex + 1)]);
            setLastName(prev => [...prev.slice(0, editingIndex), originalData.lastName, ...prev.slice(editingIndex + 1)]);
            setEmail(prev => [...prev.slice(0, editingIndex), originalData.email, ...prev.slice(editingIndex + 1)]);
            setPhone(prev => [...prev.slice(0, editingIndex), originalData.phone, ...prev.slice(editingIndex + 1)]);
            setOrganismeName(prev => [...prev.slice(0, editingIndex), originalData.organismeName, ...prev.slice(editingIndex + 1)]);
            setIsAccountLocked(prev => [...prev.slice(0, editingIndex), originalData.isAccountLocked, ...prev.slice(editingIndex + 1)]);
            setEditingIndex(-1);
        }
    };

    // Function to handle field selection change
    const handleFieldChange = (field) => {
        setSelectedField(field);
    };

    //Function that gets all consultants
    const getAllConsultant = async () => {
        setId([]);
        setFirstName([]);
        setLastName([]);
        setEmail([]);
        setPhone([]);
        setOrganismeName([])
        try {
            const response = await fetch("http://localhost:8080/api/v1/users/consultants", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                },
            });

            const data = await response.json();
            console.log("Consultants -->", data);
            if (data.length > 0) {
                toast((t) => (
                    <span>
                        la liste est a jours ...
                    </span>
                ));
                for (let i = 0; i < data.length; i++) {
                    setId((prev) => [...prev, data[i].id]);
                    setFirstName((prev) => [...prev, data[i].firstname]);
                    setLastName((prev) => [...prev, data[i].lastname]);
                    setEmail((prev) => [...prev, data[i].email]);
                    setPhone((prev) => [...prev, data[i].phone]);
                    setIsAccountLocked((prev) => [...prev, !data[i].accountNonLocked]);
                    setOrganismeId((prev) => [...prev, data[i].organismeDeCertification.id]);
                    setOrganismeName((prev) => [...prev, data[i].organismeDeCertification.raisonSocial]);
                }
            } else {
                toast((t) => (
                    <span>
                        Pas de consultants pour le moment
                    </span>
                ));
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Getting All Consultants
    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {     //Checking the validity of the token ends
            if (firstName.length === 0) {
                getAllConsultant();
            } else {
                console.log("Already Got all consultants ..");
            }

            fetchOrganismes();  // Votre fonction pour charger les données des organismes
        }
    }, []);

    // Function to fetch all organismes
    const fetchOrganismes = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/organismes", {
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setOrganismes(data);  // Supposons que data est un tableau d'objets organisme
        } catch (error) {
            console.error('Error fetching organismes:', error);
            toast.error("Erreur lors du chargement des organismes");
        }
    };

    // Function to export table data as Excel
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const tableClone = document.getElementById("consultantsTable").cloneNode(true);
        const rows = tableClone.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            rows[i].lastChild.remove();
            rows[i].lastChild.remove();
        }
        const ws = XLSX.utils.table_to_sheet(tableClone);
        XLSX.utils.book_append_sheet(wb, ws, "Consultants");
        XLSX.writeFile(wb, "Consultants.xlsx");
    };

    //Function that deletes the user
    async function deleteUser(userId) {
        console.log("userId to be deleted is -->", userId)
        console.log(isTokenExpired())
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/consultants/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                getAllConsultant();
                console.log("User deleted successfully ..");
                toast.success("Ce consultant est éliminé de l'application")
            } else {
                throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            // Handle error
            throw error; // Optionally re-throw the error for the caller to handle
        }
    }

    //Function that Locks/Unlocks Consultant

    async function handleLockUnlockUser(userId, first_name) {
        try {
            const data = await lockOrUnlockUser(userId);
            if (data.includes("Account")) {
                if (data.includes("unlocked")) {
                    toast.success(`Le compte du consultant ${first_name} a été debloqué .. `,
                        {
                            duration: 3000,
                        }
                    )
                } else if (data.includes("locked")) {
                    toast.success(`Le compte du consultant ${first_name} a été bloqué .. `,
                        {
                            duration: 3000,
                        }
                    )
                }
            } else {
                toast.error("une erreur est souvenu, ressayer plus tard !!")
            }
            console.log('User locked/unlocked successfully ?', data);
        } catch (error) {
            console.error('Error locking/unlocking user:', error);
            toast.error("une erreur est souvenu, ressayer plus tard !!")
        }
    }


    const renderSearchInput = () => {
        switch (selectedField) {
            case 'firstName':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher prénom" onChange={(e) => setSearchFirstName(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'lastName':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher nom" onChange={(e) => setSearchLastName(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'email':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher email" onChange={(e) => setSearchEmail(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'phone':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher téléphone" onChange={(e) => setSearchPhone(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'organisme':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher organisme"
                    onChange={(e) => setSearchOrganismeName(e.target.value)} disabled={editingIndex !== -1} />;
            default:
                return null;
        }
    };

    const updateConsultant = async (indexId, index) => {

        setEditingIndex(-1)
        // Vérification de la validité du jeton
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                console.log("consultant details before performing the update -->", id[index])
                const response = await fetch(`http://localhost:8080/api/v1/users/consultants/${id[index]}?organismeId=${indexId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify({
                        "firstname": firstName[index],
                        "lastname": lastName[index],
                        "email": email[index],
                        "phone": phone[index],
                    }),
                });
                const responseBody = await response.json();
                console.log("Response body -->", responseBody);
                // Comparer les données modifiées avec les données originales
                const isDataChanged =
                    firstName[index] !== originalData.firstName ||
                    lastName[index] !== originalData.lastName ||
                    email[index] !== originalData.email ||
                    phone[index] !== originalData.phone;
                if (response.status === 200 || response.status === 201) {
                    if(isDataChanged){
                        toast.success("Ce Consultant est modifié avec succès.");
                    } else {
                        toast.error("Aucune modifiaction n'a été effectuée.");
                    }
                } else if(responseBody.errorCode == "VALIDATION_ERROR") {
                    // Diviser les messages d'erreur s'ils sont séparés par des virgules
                    const errorMessages = responseBody.message.split(',');
                    errorMessages.forEach(message => {
                        toast.error(message.trim()); // Afficher chaque message d'erreur dans un toast séparé
                    });
                } else if (responseBody.errorCode == "User_email_already_exists") {
                    toast.error("L'email que vous avez entrez est déjà utilisé!!");
                } else {
                    toast.error("Une erreur s'est produite lors de la modification de ce consultant.");
                }
            } catch (error) {
                console.error(error); // Gérer les erreurs
                toast.error("Une erreur s'est produite lors de la modification de ce consultant.");
            }
        }
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
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <div className='flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center'>
                    <TiUserAdd
                        onClick={editingIndex === -1 ? () => setAddConsultantVisible(true) : null} //editingIndex === -1 pour ne pas cliquer sur le bouton si on est en train de modifier une ligne
                        className={`ml-4 w-7 h-7 text-gray-700  ${editingIndex !== -1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                    {/* Button to export table as Excel */}
                    <button
                        onClick={exportToExcel}
                        disabled={editingIndex !== -1} // Désactiver le bouton lorsque une ligne est en cours de modification
                        className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 ${editingIndex !== -1 ? 'hover:bg-neutral-500 cursor-not-allowed' : 'hover:bg-neutral-500'}`}>
                        Exporter (Format Excel)
                    </button>

                </div>
                <div className="flex flex-row gap-4">

                    <select
                        className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                        value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
                        <option value="firstName">Prénom</option>
                        <option value="lastName">Nom</option>
                        <option value="email">Email</option>
                        <option value="phone">Téléphone</option>
                        <option value="organisme">Organisme</option>
                    </select>
                    {renderSearchInput()}

                </div>
            </div>

            <div className='border-t border-gray-300 py-4'></div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4">
                <table id="consultantsTable"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Prénom
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nom
                            </th>
                            <th scope="col" className="px-6 py-3">
                                email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Téléphone
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Organisme
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Bloquer le Compte
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {firstName.map((name, index) => {
                            if ((!searchFirstName || name.toLowerCase().includes(searchFirstName.toLowerCase())) &&
                                (!searchLastName || lastName[index].toLowerCase().includes(searchLastName.toLowerCase())) &&
                                (!searchEmail || email[index].toLowerCase().includes(searchEmail.toLowerCase())) &&
                                (!searchPhone || phone[index].includes(searchPhone)) &&
                                (!searchOrganismeName || organismeName[index].toLowerCase().includes(searchOrganismeName.toLowerCase()))) {
                                const isEditing = editingIndex === index;
                                const disableEdit = editingIndex !== -1 && !isEditing; // Désactiver si une autre ligne est en cours de modification
                                return (
                                    <tr key={index} className="border-b">
                                        {editingIndex === index ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        onChange={(e) => setFirstName(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.firstName} value={firstName[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        onChange={(e) => setLastName(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.lastName} value={lastName[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        onChange={(e) => setEmail(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.email} value={email[index]} required />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        onChange={(e) => setPhone(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.phone} value={phone[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        id="mySelect"
                                                        value={organismeName[index]}
                                                        onChange={(e) => {
                                                            const selectedOrganisme = organismes.find((organisme) => organisme.raisonSocial === e.target.value);
                                                            if (selectedOrganisme) {
                                                                setOrganismeId(selectedOrganisme.id); // Assuming setOrganismeId is a state setter for the selected organisme's ID
                                                            }
                                                            setOrganismeName(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)]);
                                                        }}
                                                        onBlur={(e) => {
                                                            const selectedOrganisme = organismes.find((organisme) => organisme.raisonSocial === e.target.value);
                                                            if (selectedOrganisme) {
                                                                // console.log('Selected Organisme ID:', selectedOrganisme.id);
                                                                setIdToSendOrganism(selectedOrganisme.id)

                                                            }
                                                        }}
                                                        className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                                                    >
                                                        {organismes.map((organisme, idx) => (
                                                            <option key={idx} value={organisme.raisonSocial}>
                                                                {organisme.raisonSocial}
                                                            </option>
                                                        ))}
                                                    </select>


                                                </td>
                                                <td>
                                                    <ToggleSwitch
                                                        checked={isAccountLocked[index]}
                                                        label={isAccountLocked[index] === false ? "bloquer ce Compte" : "Debloquer ce Compte"}
                                                        onChange={(newValue) => {
                                                            setIsAccountLocked(prevState => {
                                                                const newState = [...prevState];
                                                                newState[index] = newValue;
                                                                return newState;
                                                            });
                                                            handleLockUnlockUser(id[index], firstName[index])
                                                        }}
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex gap-4">
                                                        <button onClick={() => updateConsultant(idToSendOrganism || organismeId[index], index)}
                                                            className=" font-medium text-green-600 hover:underline ml-2">Enregistrer
                                                        </button>
                                                        <button onClick={() => handleCancelClick(index)}
                                                            className="font-medium text-red-600 hover:underline">Annuler
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">{name}</td>
                                                <td className="px-6 py-4">{lastName[index]}</td>
                                                <td className="px-6 py-4">{email[index]}</td>
                                                <td className="px-6 py-4">{phone[index]}</td>
                                                <td className="px-6 py-4">{organismeName[index]}</td>
                                                <td>
                                                    <ToggleSwitch
                                                        checked={isAccountLocked[index]}
                                                        label={isAccountLocked[index] === false ? "bloquer ce Compte" : "Debloquer ce Compte"}
                                                        onChange={(newValue) => {
                                                            setIsAccountLocked(prevState => {
                                                                const newState = [...prevState];
                                                                newState[index] = newValue;
                                                                return newState;
                                                            });
                                                            handleLockUnlockUser(id[index], firstName[index])
                                                        }}
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex gap-4">
                                                        <button onClick={() => handleEditClick(index)}
                                                            disabled={disableEdit}
                                                            className={`font-medium text-blue-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                            Modifier
                                                        </button>
                                                        <a href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Prévenir le comportement par défaut du lien
                                                                if (!disableEdit) {
                                                                    setConfirmDelete({ userId: id[index], value: true });
                                                                }
                                                            }}
                                                            className={`font-medium text-red-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>Supprimer</a>
                                                    </div>
                                                </td>
                                            </>
                                        )}

                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>

                </table>
            </div>
            {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />}
            {addConsultantVisible && <SysAddConsultant onClose={() => setAddConsultantVisible(false)} />}
            <Modal show={confirmDelete.value} size="md" onClose={() => setConfirmDelete({ userId: null, value: false })}
                popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Êtes-vous sûr que vous voulez supprimer cet utilisateur ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                                deleteUser(confirmDelete.userId)
                                setConfirmDelete({ userId: null, value: false })
                            }}>
                                {"Oui, je suis sur"}
                            </Button>
                            <Button color="gray" onClick={() => setConfirmDelete({ userId: null, value: false })}>
                                Non, Annuler
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}