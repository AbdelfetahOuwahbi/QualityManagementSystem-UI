import React, { useEffect, useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaPlus, FaMinus } from "react-icons/fa"; // Import the icons
import { Button, FloatingLabel, Modal, ToggleSwitch } from "flowbite-react";
import { FaBars } from "react-icons/fa";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired, isTokenInCookies, lockOrUnlockUser } from "../../CommonApiCalls";
import ClientMainPage from "../ClientMainPage";
import AddUser from "../AddUser";
import { appUrl } from "../../../Url";

export default function AllUsers() {

    const userID = jwtDecode(Cookies.get("JWT")).id;

    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

    const [addUserVisible, setAddUserVisible] = useState(false);
    const [requiredUsersType, setRequiredUsersType] = useState("admin");
    const [selectedField, setSelectedField] = useState('firstName');
    const [confirmDelete, setConfirmDelete] = useState({ userId: null, value: false });

    const [id, setId] = useState([]);
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [image, setImage] = useState([]);
    const [organismeName, setOrganismeName] = useState([]);
    const [organismeId, setOrganismeId] = useState([]);
    const [isAccountLocked, setIsAccountLocked] = useState([]);
    const [level, setLevel] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [entrepriseId, setEntrepriseId] = useState([]);
    const [entrepriseName, setEntrepriseName] = useState([]);

    const [editingIndex, setEditingIndex] = useState(-1);

    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchOrganismeName, setSearchOrganismeName] = useState('');
    const [searchLevel, setSearchLevel] = useState('');
    const [searchEntrepriseName, setSearchEntrepriseName] = useState('');

    const [originalData, setOriginalData] = useState({});
    const [expandedRows, setExpandedRows] = useState([]); // State to track expanded rows



    const handleEditClick = (index) => {
        setOriginalData({
            firstName: firstName[index],
            lastName: lastName[index],
            email: email[index],
            phone: phone[index],
            organismeName: organismeName[index] || "",
            entrepriseName: entrepriseName[index] || "",
            level: level[index],
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
            if (requiredUsersType === "consultant") {
                setOrganismeName(prev => [...prev.slice(0, editingIndex), originalData.organismeName, ...prev.slice(editingIndex + 1)]);
                setLevel(prev => [...prev.slice(0, editingIndex), originalData.level, ...prev.slice(editingIndex + 1)]);
            }
            setIsAccountLocked(prev => [...prev.slice(0, editingIndex), originalData.isAccountLocked, ...prev.slice(editingIndex + 1)]);
            setEditingIndex(-1);
        }
    };

    const handleFieldChange = (field) => {
        setSelectedField(field);
    };

    function initializeAll() {
        setId([]);
        setFirstName([]);
        setIsAccountLocked([]);
        setLastName([]);
        setEmail([]);
        setPhone([]);
        setImage([]);
        setOrganismeId([]);
        setOrganismeName([]);
        setLevel([]);
        setEntreprises([]);
        setEntrepriseId([]);
        setEntrepriseName([]);
    };

    useEffect(() => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            if (firstName.length === 0) {
                getRequiredUsers();
            } else {
                console.log(`Already Got all ${requiredUsersType}s ..`);
            }
        }
    }, [requiredUsersType]);

    //Needs an endPoint
    const getRequiredUsers = async () => {
        let restOfThePath = "";
        switch (requiredUsersType) {
            case "admin":
                restOfThePath = `users/entreprise/admins/by-consultant/${userID}`
                break;
            case "qualityResponsible":
                restOfThePath = `users/entreprise/responsableQualites/by-consultant/${userID}`
                break;
            case "pilot":
                restOfThePath = `users/entreprise/pilots/by-consultant/${userID}`;
                break;
            case "consultant":
                restOfThePath = `users/consultants/byConsultant/${userID}`
                break;
        }
        try {
            const response = await fetch(`${appUrl}/${restOfThePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                },
            });

            const data = await response.json();
            console.log(`${requiredUsersType}s -->`, data);
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
                    setImage((prev) => [...prev, data[i].imagePath]);
                    setIsAccountLocked((prev) => [...prev, !data[i].accountNonLocked]);
                    if (requiredUsersType === "consultant") {
                        setLevel((prev) => [...prev, data[i].level]);
                        setOrganismeId((prev) => [...prev, data[i].organismeDeCertification.id]);
                        setOrganismeName((prev) => [...prev, data[i].organismeDeCertification.raisonSocial]);
                        setEntreprises((prev) => [...prev, data[i].entreprises]);
                    } else {
                        setEntrepriseId((prev) => [...prev, data[i].entreprise.id]);
                        setEntrepriseName((prev) => [...prev, data[i].entreprise.raisonSocial]);
                    }
                }
            } else {
                toast((t) => (
                    <span>
                        Pas de {requiredUsersType === "admin" ? "administrateurs" :
                            requiredUsersType === "qualityResponsible" ? "Responsables qualité" :
                                requiredUsersType === "pilot" ? "Pilotes" : "Consultants"} pour le moment
                    </span>
                ));
            }

        } catch (error) {
            console.log(error);
        }
    }

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const tableClone = document.getElementById("consultantsTable").cloneNode(true);
        const rows = tableClone.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            rows[i].lastChild.remove();
            rows[i].lastChild.remove();
            rows[i].lastChild.remove();
        }
        const ws = XLSX.utils.table_to_sheet(tableClone);
        XLSX.utils.book_append_sheet(wb, ws, "Consultants");
        XLSX.writeFile(wb, "Consultants.xlsx");
    };

    //Tested but not used yet until we make sure consultant can also perform the delete operation
    async function deleteUser(userId) {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {

            let restOfThePath = "";
            switch (requiredUsersType) {
                case "admin":
                    restOfThePath = `users/entreprise/admins/${id[index]}`
                    break;
                case "qualityResponsible":
                    restOfThePath = `users/entreprise/responsableQualites/${id[index]}`
                    break;
                case "pilot":
                    restOfThePath = `users/entreprises/pilots/${id[index]}`;
                    break;
                case "consultant":
                    restOfThePath = `users/consultants/${id[index]}`
                    break;
            }

            try {
                const response = await fetch(`${appUrl}/users/consultants/${userId}`, {
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
                throw error;
            }
        }
    }

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

    //Tested but not used yet until we make sure consultant can also perform the delete operation
    const updateUser = async (indexId, index) => {
        setEditingIndex(-1)
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                let restOfThePath = "";
                switch (requiredUsersType) {
                    case "admin":
                        restOfThePath = `users/entreprise/admins/${id[index]}?entrepriseId=${indexId}`
                        break;
                    case "qualityResponsible":
                        restOfThePath = `users/entreprise/responsableQualites/${id[index]}?entrepriseId=${indexId}`
                        break;
                    case "pilot":
                        restOfThePath = `users/entreprises/pilots/${id[index]}?entrepriseId=${indexId}`;
                        break;
                    case "consultant":
                        restOfThePath = `users/consultants/${id[index]}?organismeId=${indexId}`
                        break;
                }
                const response = await fetch(`${appUrl}/${restOfThePath}`, {
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
                const isDataChanged =
                    firstName[index] !== originalData.firstName ||
                    lastName[index] !== originalData.lastName ||
                    email[index] !== originalData.email ||
                    phone[index] !== originalData.phone;
                if (response.status === 200 || response.status === 201) {
                    if (isDataChanged) {
                        toast.success("Cet utilisateur est modifié avec succès.");
                    } else {
                        toast.error("Aucune modification n'a été effectuée.");
                    }
                } else if (responseBody.errorCode == "VALIDATION_ERROR") {
                    const errorMessages = responseBody.message.split(',');
                    errorMessages.forEach(message => {
                        toast.error(message.trim());
                    });
                } else if (responseBody.errorCode == "User_email_already_exists") {
                    toast.error("L'email que vous avez entrez est déjà utilisé!!");
                } else {
                    toast.error("Une erreur s'est produite lors de la modification de ce consultant.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Une erreur s'est produite lors de la modification de ce consultant.");
            }
        }
    };


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
            case 'entreprise':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher entreprise"
                    onChange={(e) => setSearchEntrepriseName(e.target.value)} disabled={editingIndex !== -1} />;
            case 'level':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher niveau"
                    onChange={(e) => setSearchLevel(e.target.value)} disabled={editingIndex !== -1} />;
            default:
                return null;
        }
    };


    const toggleRowExpansion = (index) => {
        if (expandedRows.includes(index)) {
            setExpandedRows(expandedRows.filter(i => i !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex p-4 w-full justify-between">
                <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                    className='w-6 h-6 cursor-pointer text-neutral-600' />
            </div>
            <div className='border-t border-gray-300 py-6'></div>
            <div className='flex flex-col md:flex-row md:justify-between gap-4 md:gap-12 items-center w-full h-auto md:h-16 p-4'>
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center">
                    <TiUserAdd
                        onClick={editingIndex === -1 ? () => setAddUserVisible(true) : null}
                        className={`ml-4 w-7 h-7 text-sky-500 ${editingIndex !== -1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                    <button
                        onClick={exportToExcel}
                        disabled={editingIndex !== -1}
                        className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 ${editingIndex !== -1 ? 'hover:bg-neutral-500 cursor-not-allowed' : 'hover:bg-neutral-500'}`}>
                        Exporter (Format Excel)
                    </button>
                </div>

                <div className="flex items-center justify-center flex-col gap-2 mt-4 md:mt-0 md:pb-12">
                    <h1 className='font-p_medium ml-3'>Séléctionner le type d'utilisateur a afficher :</h1>
                    <h2 className='flex text-sm font-p_black text-sky-600'> (Ces utilisateur concernent seulement les organisations que vous gérez!)</h2>
                    <select
                        className="items-center rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block sm:text-sm"
                        style={{ width: '300px' }}
                        value={requiredUsersType}
                        onChange={(e) => {
                            setRequiredUsersType(e.target.value);
                            initializeAll();
                        }}
                    >
                        <option value="admin">Administrateurs</option>
                        <option value="qualityResponsible">Responsables Qualité</option>
                        <option value="pilot">Pilotes</option>
                        <option value="consultant">Consultant</option>
                    </select>
                </div>


                <div className="flex flex-col md:flex-row gap-2">
                    <select
                        className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block sm:text-sm"
                        value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
                        <option value="firstName">Prénom</option>
                        <option value="lastName">Nom</option>
                        <option value="email">Email</option>
                        <option value="phone">Téléphone</option>
                        {requiredUsersType === "consultant" ? (
                            <>
                                <option value="organisme">Organisme</option>
                                <option value="level">Niveau</option>
                            </>
                        ) : (
                            <option value="entreprise">Entreprise</option>
                        )}
                    </select>
                    {renderSearchInput()}
                </div>

            </div>

            <div className='border-t border-gray-300 py-4'></div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pb-4">
                <table id="consultantsTable"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">

                            </th>
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
                            {requiredUsersType === "consultant" ? (
                                <>
                                    <th scope="col" className="px-6 py-3">
                                        Organisme
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Niveau
                                    </th>
                                </>
                            ) : (
                                <th scope="col" className="px-6 py-3">
                                    Entreprise
                                </th>
                            )}
                            <th scope="col" className="px-6 py-3">
                                Bloquer le Compte
                            </th>
                            {requiredUsersType === "consultant" &&
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            }
                            {requiredUsersType === "consultant" &&
                                <th scope="col" className="px-6 py-3">
                                    Détails
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {firstName.map((name, index) => {
                            if ((!searchFirstName || name?.toLowerCase().includes(searchFirstName?.toLowerCase())) &&
                                (!searchLastName || lastName[index]?.toLowerCase().includes(searchLastName?.toLowerCase())) &&
                                (!searchEmail || email[index]?.toLowerCase().includes(searchEmail?.toLowerCase())) &&
                                (!searchPhone || phone[index]?.includes(searchPhone)) &&
                                (!searchLevel || level[index]?.includes(searchLevel)) &&
                                (!searchOrganismeName || organismeName[index]?.toLowerCase().includes(searchOrganismeName?.toLowerCase())) &&
                                (!searchEntrepriseName || entrepriseName[index]?.toLowerCase().includes(searchEntrepriseName?.toLowerCase()))) {
                                const isEditing = editingIndex === index;
                                const disableEdit = editingIndex !== -1 && !isEditing;
                                const isRowExpanded = expandedRows.includes(index);

                                return (
                                    <React.Fragment key={index}>
                                        <tr className="border-b">
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
                                                    {requiredUsersType === "consultant" ? (
                                                        <>
                                                            <td className="px-6 py-4">{organismeName[index]}</td>
                                                            <td className="px-6 py-4">{level[index]}</td>
                                                        </>
                                                    ) : (
                                                        <td className="px-6 py-4">{entrepriseName[index]}</td>
                                                    )}
                                                    <td>
                                                        <ToggleSwitch
                                                            checked={isAccountLocked[index]}
                                                            label={isAccountLocked[index] === false ? "bloquer ce Compte" : "Débloquer ce Compte"}
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
                                                            <button onClick={() => updateUser(requiredUsersType === "consultant" ? organismeId[index] : entrepriseId[index], index)}
                                                                className=" font-medium text-green-600 hover:underline ml-2">Enregistrer
                                                            </button>
                                                            <button onClick={() => handleCancelClick(index)}
                                                                className="font-medium text-red-600 hover:underline">Annuler
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={() => toggleRowExpansion(index)}>
                                                            {isRowExpanded ? <FaMinus /> : <FaPlus />}
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <img src={`${appUrl}/images/${image[index]}`}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            alt={name} />
                                                    </td>
                                                    {id[index] === userID ? (
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2 items-center">
                                                                <h2 className='font-p_regular text-green-500'>(Vous) </h2>
                                                                <h2>{name}</h2>
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td className="px-6 py-4">{name}</td>
                                                    )}
                                                    <td className="px-6 py-4">{lastName[index]}</td>
                                                    <td className="px-6 py-4">{email[index]}</td>
                                                    <td className="px-6 py-4">{phone[index]}</td>
                                                    {requiredUsersType === "consultant" ? (
                                                        <>
                                                            <td className="px-6 py-4">{organismeName[index]}</td>
                                                            <td className="px-6 py-4">{level[index]}</td>
                                                        </>
                                                    ) : (
                                                        <td className="px-6 py-4">{entrepriseName[index]}</td>
                                                    )}
                                                    <td>
                                                        <ToggleSwitch
                                                            checked={isAccountLocked[index]}
                                                            label={isAccountLocked[index] === false ? "bloquer ce Compte" : "Débloquer ce Compte"}
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
                                                    {requiredUsersType === "consultant" &&
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-4">
                                                                <button onClick={() => handleEditClick(index)}
                                                                    disabled={disableEdit}
                                                                    className={`font-medium text-blue-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                    Modifier
                                                                </button>
                                                                <a href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (!disableEdit) {
                                                                            setConfirmDelete({ userId: id[index], value: true });
                                                                        }
                                                                    }}
                                                                    className={`font-medium text-red-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>Supprimer</a>
                                                            </div>
                                                        </td>
                                                    }
                                                    {requiredUsersType === "consultant" &&
                                                        <td className="px-6 py-4">
                                                            <button onClick={() => toggleRowExpansion(index)}>
                                                                {isRowExpanded ? <FaMinus /> : <FaPlus />}
                                                            </button>
                                                        </td>
                                                    }
                                                </>
                                            )}
                                        </tr>
                                        {requiredUsersType === "consultant" && isRowExpanded && (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-800">
                                                        <p>Entreprises:</p>
                                                        <ul>
                                                            {entreprises[index].map((entreprise, idx) => (
                                                                <li key={idx}>
                                                                    <strong>{entreprise.raisonSocial}</strong> - {entreprise.ville}, {entreprise.pays} ({entreprise.email})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td colSpan="3">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-800">
                                                        <p>Niveau:</p>
                                                        <ul>
                                                            {level[index]}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            </div>
            {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
            {addUserVisible && <AddUser organismId={organismeId[0]} userType={requiredUsersType} onClose={() => setAddUserVisible(false)} />}
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
