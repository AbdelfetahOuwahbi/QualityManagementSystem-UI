import React, {useEffect, useState} from "react";
import {TiUserAdd} from "react-icons/ti";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import SysAddConsultant from "./SysAddConsultant";
import {Button, Modal, ToggleSwitch} from "flowbite-react";
import * as XLSX from "xlsx";
import toast, {Toaster} from "react-hot-toast";
import {isTokenExpired, isTokenInCookies} from "../CommonApiCalls";
import Cookies from "js-cookie";

export default function SysAllConsultants() {
    const [addConsultantVisible, setAddConsultantVisible] = useState(false);


    const [selectedField, setSelectedField] = useState('firstName'); // Default selected field



    const [confirmDelete, setConfirmDelete] = useState({ userId: null, value: false });
    const [modifyConsultantVisible, setModifyConsultantVisible] = useState(
        {
            value: false,
            userId: null,
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
        }
    );


    // Consultant Properties
    const [id, setId] = useState([]);
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [role, setRole] = useState([]);
    const [organismeName, setOrganismeName] = useState([]);

    // Search states for each field
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [searchOrganismeName, setSearchOrganismeName] = useState();


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
        setRole([]);
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
            if (data.length > 0) {
                toast((t) => (
                    <span>
                        la liste est a jours ...
                    </span>
                ));
                console.log("Consultants -->", data);
                for (let i = 0; i < data.length; i++) {
                    setId((prev) => [...prev, data[i].id]);
                    setFirstName((prev) => [...prev, data[i].firstname]);
                    setLastName((prev) => [...prev, data[i].lastname]);
                    setEmail((prev) => [...prev, data[i].email]);
                    setPhone((prev) => [...prev, data[i].phone]);
                    setRole((prev) => [...prev, "Consultant"]);
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


        }
    }, []);


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

    // Function to export table data as Excel
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById("consultantsTable"));
        XLSX.utils.book_append_sheet(wb, ws, "Consultants");
        XLSX.writeFile(wb, "Consultants.xlsx");
    };

    // useEffect(() => {
    //     console.log(confirmDelete);
    // }, [confirmDelete])

    // Function to render search inputs based on the selected field
    const renderSearchInput = () => {
        switch (selectedField) {
            case 'firstName':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher prénom" onChange={(e) => setSearchFirstName(e.target.value)} />;
            case 'lastName':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher nom" onChange={(e) => setSearchLastName(e.target.value)} />;
            case 'email':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher email" onChange={(e) => setSearchEmail(e.target.value)} />;
            case 'phone':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher téléphone" onChange={(e) => setSearchPhone(e.target.value)} />;
            case 'role':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher rôle" onChange={(e) => setSearchRole(e.target.value)} />;
            case 'organisme':
                return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none" placeholder="Rechercher organisme" onChange={(e) => setSearchOrganismeName(e.target.value)} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <div className='flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center'>
                    <TiUserAdd onClick={() => setAddConsultantVisible(true)}
                               className="ml-4 w-7 h-7 text-gray-700 cursor-pointer"/>
                    {/* Button to export table as Excel */}
                    <button onClick={exportToExcel}
                            className='bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 hover:bg-neutral-500'>
                        Exporter (Format Excel)
                    </button>
                </div>
                <div className="flex flex-row gap-4">

                    <select className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm" value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
                        <option value="firstName">Prénom</option>
                        <option value="lastName">Nom</option>
                        <option value="email">Email</option>
                        <option value="phone">Téléphone</option>
                        <option value="role">Rôle</option>
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
                            Rôle
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Organisme
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
                                (!searchRole || role[index].toLowerCase().includes(searchRole.toLowerCase())) &&
                                (!searchOrganismeName || organismeName[index].toLowerCase().includes(searchOrganismeName.toLowerCase()))) {
                                return (
                                    <tr key={index} className="border-b">
                                        <td className="px-6 py-4">{name}</td>
                                        <td className="px-6 py-4">{lastName[index]}</td>
                                        <td className="px-6 py-4">{email[index]}</td>
                                        <td className="px-6 py-4">{phone[index]}</td>
                                        <td className="px-6 py-4">{role[index]}</td>
                                        <td className="px-6 py-4">{organismeName[index]}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <a href="#" onClick={() =>
                                                    setModifyConsultantVisible(
                                                        {
                                                            value: true,
                                                            userId: id[index],
                                                            first_name : firstName[index],
                                                            last_name : lastName[index],
                                                            email : email[index],
                                                            phone : phone[index],
                                                        })
                                                } className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Modifier</a>
                                                <a href="#" onClick={() => setConfirmDelete({ userId: id[index], value: true })} className="font-medium text-red-500 dark:text-blue-500 hover:underline" >Supprimer</a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            </div>
            {addConsultantVisible && <SysAddConsultant onClose={() => setAddConsultantVisible(false)} />}
            {modifyConsultantVisible.value && <SysAddConsultant consultantDtls={modifyConsultantVisible} onClose={() => setModifyConsultantVisible({value : false})} />}
            <Modal show={confirmDelete.value} size="md" onClose={() => setConfirmDelete({ userId: null, value: false })} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
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
