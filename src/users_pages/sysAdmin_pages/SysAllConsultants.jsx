import React, { useState, useEffect } from "react";
import { TiUserAdd } from "react-icons/ti";
import SysAddConsultant from "./SysAddConsultant";
import { FloatingLabel } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";

export default function SysAllConsultants() {
    const [addConsultantVisible, setAddConsultantVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('firstName'); // Default selected field

    // Consultant Properties
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [role, setRole] = useState([]);

    // Search states for each field
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchRole, setSearchRole] = useState('');

    // Function to handle field selection change
    const handleFieldChange = (field) => {
        setSelectedField(field);
    };

    //Getting All Consultants
    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            //Checking the validity of the token ends
            const getAllConsultant = async () => {
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
                                La liste est à jour.
                            </span>
                        ));
                        for (let i = 0; i < data.length; i++) {
                            setFirstName((prev) => [...prev, data[i].firstname]);
                            setLastName((prev) => [...prev, data[i].lastname]);
                            setEmail((prev) => [...prev, data[i].email]);
                            setPhone((prev) => [...prev, data[i].phone]);
                            setRole((prev) => [...prev, "Consultant"]);
                        }
                    } else {
                        toast((t) => (
                            <span>
                                Pas de consultants pour le moment.
                            </span>
                        ));
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            getAllConsultant();
        }
    }, []);

    // Function to render search inputs based on the selected field
    const renderSearchInput = () => {
        switch (selectedField) {
            case 'firstName':
                return <input placeholder="Rechercher prénom" onChange={(e) => setSearchFirstName(e.target.value)} />;
            case 'lastName':
                return <input placeholder="Rechercher nom" onChange={(e) => setSearchLastName(e.target.value)} />;
            case 'email':
                return <input placeholder="Rechercher email" onChange={(e) => setSearchEmail(e.target.value)} />;
            case 'phone':
                return <input placeholder="Rechercher téléphone" onChange={(e) => setSearchPhone(e.target.value)} />;
            case 'role':
                return <input placeholder="Rechercher rôle" onChange={(e) => setSearchRole(e.target.value)} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <TiUserAdd onClick={() => setAddConsultantVisible(true)} className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                <div className="flex flex-row gap-4">
                    <select value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
                        <option value="firstName">Prénom</option>
                        <option value="lastName">Nom</option>
                        <option value="email">Email</option>
                        <option value="phone">Téléphone</option>
                        <option value="role">Rôle</option>
                    </select>
                    {renderSearchInput()}
                </div>
            </div>

            <div className='border-t border-gray-300 py-4'></div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                            (!searchRole || role[index].toLowerCase().includes(searchRole.toLowerCase()))) {
                            return (
                                <tr key={index} className="border-b">
                                    <td className="px-6 py-4">{name}</td>
                                    <td className="px-6 py-4">{lastName[index]}</td>
                                    <td className="px-6 py-4">{email[index]}</td>
                                    <td className="px-6 py-4">{phone[index]}</td>
                                    <td className="px-6 py-4">{role[index]}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <a href="#" className="font-medium text-blue-600 hover:underline">Modifier</a>
                                            <a href="#" className="font-medium text-red-500 hover:underline">Supprimer</a>
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
        </>
    );
}
