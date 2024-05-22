import React, { useEffect, useState } from "react";
import { MdOutlineDomainAdd } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, FloatingLabel, Modal } from "flowbite-react";
import { FaBars } from "react-icons/fa";
import * as XLSX from "xlsx";
import SysAddOrganism from "./SysAddOrganism";
import { getAllEntreprises, isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import SysMainPage from "./SysMainPage";
import { serverAddress } from "../../ServerAddress";


export default function SysAllOrganismes() {

    const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);

    const [addOrganismVisible, setAddOrganismVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ organismId: null, value: false });


    const [id, setId] = useState([]);
    const [category, setCategory] = useState([]);
    const [raisonSociale, setRaisonSociale] = useState([]);
    const [secteur, setSecteur] = useState([]);
    const [pays, setPays] = useState([]);
    const [ville, setVille] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [registreDeCommerce, setRegistreDeCommerce] = useState([]);
    const [identifiantFiscale, setIdentifiantFiscale] = useState([]);
    const [patente, setPatente] = useState([]);
    const [cnss, setCnss] = useState([]);

    // Search states for each field
    const [searchCategory, setSearchCategory] = useState('');
    const [searchRaisonSociale, setSearchRaisonSociale] = useState('');
    const [searchSecteur, setSearchSecteur] = useState('');
    const [searchPays, setSearchPays] = useState('');
    const [searchVille, setSearchVille] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchRegistreDeCommerce, setSearchRegistreDeCommerce] = useState('');
    const [searchIdentifiantFiscale, setSearchIdentifiantFiscale] = useState('');
    const [searchPatente, setSearchPatente] = useState('');
    const [searchCnss, setSearchCnss] = useState('');

    const [selectedField, setSelectedField] = useState('category'); // Default selected field
    // Ajout d'un état pour l'index de modification
    const [editingIndex, setEditingIndex] = useState(-1);
    const [originalData, setOriginalData] = useState({});

    // Fonction pour gérer le clic sur modifier
    const handleEditClick = (index) => {
        setOriginalData({
            category: category[index],
            raisonSociale: raisonSociale[index],
            secteur: secteur[index],
            pays: pays[index],
            ville: ville[index],
            email: email[index],
            phone: phone[index],
            registreDeCommerce: registreDeCommerce[index],
            identifiantFiscale: identifiantFiscale[index],
            patente: patente[index],
            cnss: cnss[index]
        });
        setEditingIndex(index);
    };

    // Fonction pour annuler la modification
    const handleCancelClick = () => {
        if (editingIndex !== -1) {
            // Utiliser les valeurs de originalData pour restaurer les données
            setCategory(prev => [...prev.slice(0, editingIndex), originalData.category, ...prev.slice(editingIndex + 1)]);
            setRaisonSociale(prev => [...prev.slice(0, editingIndex), originalData.raisonSociale, ...prev.slice(editingIndex + 1)]);
            setSecteur(prev => [...prev.slice(0, editingIndex), originalData.secteur, ...prev.slice(editingIndex + 1)]);
            setPays(prev => [...prev.slice(0, editingIndex), originalData.pays, ...prev.slice(editingIndex + 1)]);
            setVille(prev => [...prev.slice(0, editingIndex), originalData.ville, ...prev.slice(editingIndex + 1)]);
            setEmail(prev => [...prev.slice(0, editingIndex), originalData.email, ...prev.slice(editingIndex + 1)]);
            setPhone(prev => [...prev.slice(0, editingIndex), originalData.phone, ...prev.slice(editingIndex + 1)]);
            setRegistreDeCommerce(prev => [...prev.slice(0, editingIndex), originalData.registreDeCommerce, ...prev.slice(editingIndex + 1)]);
            setIdentifiantFiscale(prev => [...prev.slice(0, editingIndex), originalData.identifiantFiscale, ...prev.slice(editingIndex + 1)]);
            setPatente(prev => [...prev.slice(0, editingIndex), originalData.patente, ...prev.slice(editingIndex + 1)]);
            setCnss(prev => [...prev.slice(0, editingIndex), originalData.cnss, ...prev.slice(editingIndex + 1)]);
            setEditingIndex(-1); // Réinitialiser l'index d'édition
        }
    };


    // Function to handle field selection change
    const handleFieldChange = (field) => {
        setSelectedField(field);
    };

    //Function that gets all organismes

    const getAllOrganimes = async () => {
        setId([])
        setCategory([])
        setRaisonSociale([])
        setSecteur([])
        setPays([])
        setVille([])
        setEmail([])
        setPhone([])
        setRegistreDeCommerce([])
        setIdentifiantFiscale([])
        setPatente([])
        setCnss([])
        try {
            const data = await getAllEntreprises(null, "organism");
            if (data.length > 0) {
                toast((t) => (
                    <span>
                        la liste est a jours ...
                    </span>
                ));
                console.log("Organismes -->", data);
                for (let i = 0; i < data.length; i++) {
                    setId((prev) => [...prev, data[i].id]);
                    setCategory((prev) => [...prev, data[i].categorie]);
                    setVille((prev) => [...prev, data[i].ville]);
                    setPhone((prev) => [...prev, data[i].telephone]);
                    setSecteur((prev) => [...prev, data[i].secteur]);
                    setRaisonSociale((prev) => [...prev, data[i].raisonSocial]);
                    setRegistreDeCommerce((prev) => [...prev, data[i].registreDeCommerce]);
                    setPays((prev) => [...prev, data[i].pays]);
                    setPatente((prev) => [...prev, data[i].patente]);
                    setIdentifiantFiscale((prev) => [...prev, data[i].identifiantFiscal]);
                    setEmail((prev) => [...prev, data[i].email]);
                    setCnss((prev) => [...prev, data[i].cnss]);
                }
            }
        } catch (error) {
            console.error(error); // Handle errors
            toast.error('Une erreur s\'est produite lors du creation de cet organism.');
        }
    }

    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {    //Checking the validity of the token ends
            if (id.length === 0) {
                getAllOrganimes();
            } else {
                console.log("Already got all organismes ...");
            }
        }
    }, [])


    // Function to export table data as Excel
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const tableClone = document.getElementById("organismTable").cloneNode(true);
        const rows = tableClone.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            rows[i].lastChild.remove();
        }
        const ws = XLSX.utils.table_to_sheet(tableClone);
        XLSX.utils.book_append_sheet(wb, ws, "Organismes de certifications");
        XLSX.writeFile(wb, "Organismes de certifications.xlsx");
    };

    const renderSearchInput = () => {
        switch (selectedField) {
            case 'category':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher categorie"
                    onChange={(e) => setSearchCategory(e.target.value)} disabled={editingIndex !== -1} />;
            case 'raisonSociale':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher raison sociale"
                    onChange={(e) => setSearchRaisonSociale(e.target.value)} disabled={editingIndex !== -1} />;
            case 'secteur':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher secteur"
                    onChange={(e) => setSearchSecteur(e.target.value)} disabled={editingIndex !== -1} />;
            case 'pays':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher pays"
                    onChange={(e) => setSearchPays(e.target.value)} disabled={editingIndex !== -1} />;
            case 'ville':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher ville"
                    onChange={(e) => setSearchVille(e.target.value)} disabled={editingIndex !== -1} />;
            case 'email':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher email"
                    onChange={(e) => setSearchEmail(e.target.value)} disabled={editingIndex !== -1} />;
            case 'phone':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher téléphone"
                    onChange={(e) => setSearchPhone(e.target.value)} disabled={editingIndex !== -1} />;
            case 'registreDeCommerce':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher registre de commerce"
                    onChange={(e) => setSearchRegistreDeCommerce(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'identifiantFiscale':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher identifiant fiscal"
                    onChange={(e) => setSearchIdentifiantFiscale(e.target.value)}
                    disabled={editingIndex !== -1} />;
            case 'patente':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher patente"
                    onChange={(e) => setSearchPatente(e.target.value)} disabled={editingIndex !== -1} />;
            case 'cnss':
                return <input type="number"
                    className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                    placeholder="Rechercher cnss"
                    onChange={(e) => setSearchCnss(e.target.value)} disabled={editingIndex !== -1} />;
            default:
                return null;
        }
    };

    //Function that deletes the user
    async function deleteOrganism(organismId) {
        console.log("organism to be deleted is -->", organismId)
        console.log(isTokenExpired())
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/organismes/${organismId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                getAllOrganimes();
                console.log("User deleted successfully ..");
                toast.success("Cet organism est éliminé de l'application")
            } else {
                toast.error(response.statusText)
                throw new Error(`Failed to delete organism: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting organism:', error);
            // Handle error
            throw error; // Optionally re-throw the error for the caller to handle
        }
    }

    //Function that updates and organism
    const updateOrganism = async (index) => {
        setEditingIndex(-1)
        // Checking the validity of the token
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                const response = await fetch(`http://${serverAddress}:8080/api/v1/organismes/${id[index]}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`,
                    },
                    body: JSON.stringify({
                        "categorie": category[index],
                        "pays": pays[index],
                        "secteur": secteur[index],
                        "ville": ville[index],
                        "telephone": phone[index],
                        "email": email[index],
                        "patente": patente[index],
                        "cnss": cnss[index],
                        "identifiantFiscal": identifiantFiscale[index],
                        "registreDeCommerce": registreDeCommerce[index],
                        "raisonSocial": raisonSociale[index]
                    }),
                });
                const responseBody = await response.json();
                console.log(responseBody);
                // Comparer les données modifiées avec les données originales
                const isDataChanged =
                    category[index] !== originalData.category ||
                    pays[index] !== originalData.pays ||
                    secteur[index] !== originalData.secteur ||
                    ville[index] !== originalData.ville ||
                    phone[index] !== originalData.phone ||
                    email[index] !== originalData.email ||
                    patente[index] !== originalData.patente ||
                    cnss[index] !== originalData.cnss ||
                    identifiantFiscale[index] !== originalData.identifiantFiscale ||
                    registreDeCommerce[index] !== originalData.registreDeCommerce ||
                    raisonSociale[index] !== originalData.raisonSociale;
                if (response?.status === 200 || response?.status === 201) {
                    if (isDataChanged) {
                        toast.success("Cet Organisme est modifié avec succès..");
                    } else {
                        toast.error("Aucune modifiaction n'a été effectuée.");
                    }
                } else if (responseBody.errorCode == "VALIDATION_ERROR") {
                    // Diviser les messages d'erreur s'ils sont séparés par des virgules
                    const errorMessages = responseBody.message.split(',');
                    errorMessages.forEach(message => {
                        toast.error(message.trim()); // Afficher chaque message d'erreur dans un toast séparé
                    });
                } else if (responseBody.errorCode == "User_email_already_exists") {
                    toast.error("L'email que vous avez entrez est déjà utilisé!!");
                } else {
                    toast.error("Une erreur s'est produite lors de la modification de cet organisme.");
                }
            } catch (error) {
                console.error(error); // Handle errors
                toast.error("Une erreur s'est produite lors de la modification de cet organisme.");
            }
        }
    }

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="flex p-4 w-full justify-between">
                {/* Bars Icon That toogles the visibility of the menu */}
                <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)}
                    className='w-6 h-6 cursor-pointer text-neutral-600' />
            </div>

            <div className='border-t border-gray-300 py-4'></div>
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <div className='flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center'>
                    <MdOutlineDomainAdd onClick={editingIndex === -1 ? () => setAddOrganismVisible(true) : null}
                        className={`ml-4 w-7 h-7 text-gray-700  ${editingIndex !== -1 ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
                    <button onClick={exportToExcel}
                        disabled={editingIndex !== -1}
                        className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 ${editingIndex !== -1 ? 'hover:bg-neutral-500 cursor-not-allowed' : 'hover:bg-neutral-500'}`}>
                        Exporter (Format Excel)
                    </button>
                </div>
                <div className="flex flex-row gap-4 ">
                    <select
                        className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                        value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
                        <option value="category">Catégorie</option>
                        <option value="raisonSociale">Raison Sociale</option>
                        <option value="secteur">Secteur</option>
                        <option value="pays">Pays</option>
                        <option value="ville">Ville</option>
                        <option value="email">Email</option>
                        <option value="phone">Téléphone</option>
                        <option value="registreDeCommerce">Registre de Commerce</option>
                        <option value="identifiantFiscale">Identifiant Fiscal</option>
                        <option value="patente">Patente</option>
                        <option value="cnss">Cnss</option>
                    </select>
                    {renderSearchInput()}
                </div>
            </div>

            <div className='border-t border-gray-300 py-4'></div>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table id="organismTable"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">


                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Catégorie
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Raison Sociale
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sécteur
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Pays
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ville
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Téléphone
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Registre de commerce
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Identifiant fiscale
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Patente
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cnss
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((cat, index) => {
                            if ((!searchCategory || category[index].toLowerCase().includes(searchCategory.toLowerCase())) &&
                                (!searchRaisonSociale || raisonSociale[index].toLowerCase().includes(searchRaisonSociale.toLowerCase())) &&
                                (!searchSecteur || secteur[index].toLowerCase().includes(searchSecteur.toLowerCase())) &&
                                (!searchPays || pays[index].toLowerCase().includes(searchPays.toLowerCase())) &&
                                (!searchVille || ville[index].toLowerCase().includes(searchVille.toLowerCase())) &&
                                (!searchEmail || email[index].toLowerCase().includes(searchEmail.toLowerCase())) &&
                                (!searchPhone || phone[index].includes(searchPhone)) &&
                                (!searchRegistreDeCommerce || registreDeCommerce[index].toString().includes(searchRegistreDeCommerce)) &&
                                (!searchIdentifiantFiscale || identifiantFiscale[index].toString().includes(searchIdentifiantFiscale)) &&
                                (!searchPatente || patente[index].toString().includes(searchPatente)) &&
                                (!searchCnss || cnss[index].toString().includes(searchCnss))) {
                                const isEditing = editingIndex === index;
                                const disableEdit = editingIndex !== -1 && !isEditing; // Désactiver si une autre ligne est en cours de modification
                                return (
                                    <tr key={index} className="border-b">
                                        {isEditing ? (
                                            // Champs de saisie pour la modification
                                            <>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setCategory(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.category}
                                                        value={category[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setRaisonSociale(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.raisonSociale}
                                                        value={raisonSociale[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setSecteur(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.secteur}
                                                        value={secteur[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setPays(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.pays}
                                                        value={pays[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setVille(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.ville}
                                                        value={ville[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        className="w-auto"
                                                        onChange={(e) => setEmail(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.email}
                                                        value={email[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        className="w-auto"
                                                        onChange={(e) => setPhone(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.phone}
                                                        value={phone[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        className="w-auto"
                                                        onChange={(e) => setRegistreDeCommerce(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.registreDeCommerce}
                                                        value={registreDeCommerce[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        className="w-auto"
                                                        onChange={(e) => setIdentifiantFiscale(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.identifiantFiscale}
                                                        value={identifiantFiscale[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        className="w-auto"
                                                        onChange={(e) => setPatente(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.patente}
                                                        value={patente[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <FloatingLabel
                                                        type="number"
                                                        className="w-auto"
                                                        onChange={(e) => setCnss(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                                        variant="outlined" label={originalData.cnss}
                                                        value={cnss[index]} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-4">
                                                        <button onClick={() => updateOrganism(index)}
                                                            className="font-medium text-green-600 hover:underline">Enregistrer
                                                        </button>
                                                        <button onClick={handleCancelClick}
                                                            className="font-medium text-red-600 hover:underline">Annuler
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // Affichage des données
                                            <>
                                                <td className="px-6 py-4">{cat}</td>
                                                <td className="px-6 py-4">{raisonSociale[index]}</td>
                                                <td className="px-6 py-4">{secteur[index]}</td>
                                                <td className="px-6 py-4">{pays[index]}</td>
                                                <td className="px-6 py-4">{ville[index]}</td>
                                                <td className="px-6 py-4">{email[index]}</td>
                                                <td className="px-6 py-4">{phone[index]}</td>
                                                <td className="px-6 py-4">{registreDeCommerce[index]}</td>
                                                <td className="px-6 py-4">{identifiantFiscale[index]}</td>
                                                <td className="px-6 py-4">{patente[index]}</td>
                                                <td className="px-6 py-4">{cnss[index]}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-4">
                                                        <button href="#" onClick={() => handleEditClick(index)}
                                                            disabled={disableEdit}
                                                            className={`font-medium text-blue-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                            Modifier
                                                        </button>
                                                        <a href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Prévenir le comportement par défaut du lien
                                                                if (!disableEdit) {
                                                                    setConfirmDelete({ organismId: id[index], value: true });
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
            {addOrganismVisible && <SysAddOrganism onClose={() => setAddOrganismVisible(false)} />}
            <Modal show={confirmDelete.value} size="md"
                onClose={() => setConfirmDelete({ organismId: null, value: false })} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Êtes-vous sûr que vous voulez supprimer cet organism ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                                setConfirmDelete(false)
                                deleteOrganism(confirmDelete.organismId)
                            }}>
                                {"Oui, je suis sur"}
                            </Button>
                            <Button color="gray" onClick={() => setConfirmDelete({ organismId: null, value: null })}>
                                Non, Annuler
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
