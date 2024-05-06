import React, { useState, useEffect } from "react";
import { MdOutlineDomainAdd } from "react-icons/md";
import { Datepicker } from "flowbite-react";
import * as XLSX from "xlsx";
import SysAddOrganism from "./SysAddOrganism";
import { getAllEntreprises } from "../CommonApiCalls";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";


export default function SysAllOrganismes() {

    const [addOrganismVisible, setAddOrganismVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ organismId: null, value: false });
    const [modifyOrganismVisible, setModifyOrganismVisible] = useState(
        {
            value: false,
            organismId: null,
            Category: "",
            Pays: "",
            Secteur: "",
            Ville: "",
            Phone: "",
            Email: "",
            Patente: "",
            Cnss: "",
            Identifiant_fiscale: "",
            Registre_de_commerce: "",
            Raison_Sociale: ""
        });

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

    // Function to handle field selection change
    const handleFieldChange = (field) => {
        setSelectedField(field);
    };

    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {    //Checking the validity of the token ends
            if (id.length === 0) {
                const getAllOrganimes = async () => {
                    // setId([])
                    // setCategory([])
                    // setRaisonSociale([])
                    // setSecteur([])
                    // setPays([])
                    // setVille([])
                    // setEmail([])
                    // setPhone([])
                    // setRegistreDeCommerce([])
                    // setIdentifiantFiscale([])
                    // setPatente([])
                    // setCnss([])
                    try {
                        const data = await getAllEntreprises("organism");
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
                getAllOrganimes();
            } else {
                console.log("Already got all organismes ...");
            }
        }
    }, [])


    // Function to export table data as Excel
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById("organismTable"));
        XLSX.utils.book_append_sheet(wb, ws, "Organismes de certifications");
        XLSX.writeFile(wb, "Organismes de certifications.xlsx");
    };

    const renderSearchInput = () => {
        switch (selectedField) {
            case 'category':
                return <input placeholder="Rechercher catégorie"
                    onChange={(e) => setSearchCategory(e.target.value)} />;
            case 'raisonSociale':
                return <input placeholder="Rechercher raison sociale"
                    onChange={(e) => setSearchRaisonSociale(e.target.value)} />;
            case 'secteur':
                return <input placeholder="Rechercher secteur" onChange={(e) => setSearchSecteur(e.target.value)} />;
            case 'pays':
                return <input placeholder="Rechercher pays" onChange={(e) => setSearchPays(e.target.value)} />;
            case 'ville':
                return <input placeholder="Rechercher ville" onChange={(e) => setSearchVille(e.target.value)} />;
            case 'email':
                return <input placeholder="Rechercher email" onChange={(e) => setSearchEmail(e.target.value)} />;
            case 'phone':
                return <input placeholder="Rechercher téléphone" onChange={(e) => setSearchPhone(e.target.value)} />;
            case 'registreDeCommerce':
                return <input placeholder="Rechercher registre de commerce"
                    onChange={(e) => setSearchRegistreDeCommerce(e.target.value)} />;
            case 'identifiantFiscale':
                return <input placeholder="Rechercher identifiant fiscal"
                    onChange={(e) => setSearchIdentifiantFiscale(e.target.value)} />;
            case 'patente':
                return <input placeholder="Rechercher patente" onChange={(e) => setSearchPatente(e.target.value)} />;
            case 'cnss':
                return <input placeholder="Rechercher cnss" onChange={(e) => setSearchCnss(e.target.value)} />;
            default:
                return null;
        }
    };

    //Function that deletes the user
    async function deleteOrganism(organismId) {
        console.log("userId to be deleted is -->", userId)
        console.log(isTokenExpired())
        try {
            const response = await fetch(`http://localhost:8080/api/v1/organismes/${userId}`, {
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

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <div className='flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center'>
                    <MdOutlineDomainAdd onClick={() => setAddOrganismVisible(true)}
                        className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                    {/* Button to export table as Excel */}
                    <button onClick={exportToExcel} className='bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 hover:bg-neutral-500'>
                        Exporter (Format Excel)
                    </button>
                </div>
                <div className="flex flex-row gap-4">
                    <select value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
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
                <table id="organismTable" className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">


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
                    </thead >
                    <tbody>
                        {category.map((name, index) => {
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
                                return (
                                    <tr key={index} className="border-b">
                                        <td className="px-6 py-4">
                                            {category[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {raisonSociale[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {secteur[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {pays[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ville[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {email[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {phone[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {registreDeCommerce[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {identifiantFiscale[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {patente[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            {cnss[index]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <a href="#"
                                                    onClick={() => setModifyOrganismVisible({
                                                        value: !modifyOrganismVisible.value,
                                                        organismId: id[index],
                                                        Category: category[index],
                                                        Pays: pays[index],
                                                        Secteur: secteur[index],
                                                        Ville: ville[index],
                                                        Phone: phone[index],
                                                        Email: email[index],
                                                        Patente: patente[index],
                                                        Cnss: cnss[index],
                                                        Identifiant_fiscale: identifiantFiscale[index],
                                                        Registre_de_commerce: registreDeCommerce[index],
                                                        Raison_Sociale: raisonSociale[index]
                                                    })}
                                                    className="font-medium text-blue-600 hover:underline">Modifier</a>
                                                <a href="#"
                                                    className="font-medium text-red-500 hover:underline">Supprimer</a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table >
            </div >
            {addOrganismVisible && <SysAddOrganism onClose={() => setAddOrganismVisible(false)} />}
            {modifyOrganismVisible.value && <SysAddOrganism organismDtls={modifyOrganismVisible} onClose={() => setModifyOrganismVisible(false)} />}
        </>
    );
}

