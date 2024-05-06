import React, { useState, useEffect } from "react";
import { MdOutlineDomainAdd } from "react-icons/md";
import { Datepicker } from "flowbite-react";
import SysAddOrganism from "./SysAddOrganism";
import { getAllEntreprises } from "../CommonApiCalls";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";


export default function SysAllOrganismes() {

    const [addOrganismVisible, setAddOrganismVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date(null));
    const [endDate, setEndDate] = useState(new Date(null));

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

    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {    //Checking the validity of the token ends
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
        }
    }, [])


    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <MdOutlineDomainAdd onClick={() => setAddOrganismVisible(true)} className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                <div className="flex flex-row gap-4">

                </div>
            </div>

            <div className='border-t border-gray-300 py-4'></div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Catégorie
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Raison Sociale
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Sécteur
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Pays
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Ville
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Téléphone
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Registre de commerce
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Identifiant fiscale
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Patente
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Cnss
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {id.map((organism, index) =>
                            <tr key={index} class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td class="px-6 py-4">
                                    {category[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {raisonSociale[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {secteur[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {pays[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {ville[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {email[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {phone[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {registreDeCommerce[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {identifiantFiscale[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {patente[index]}
                                </td>
                                <td class="px-6 py-4">
                                    {cnss[index]}
                                </td>
                                <td class="px-6 py-4">
                                    <div className="flex gap-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Modifier</a>
                                        <a href="#" class="font-medium text-red-500 dark:text-blue-500 hover:underline">Supprimer</a>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {addOrganismVisible && <SysAddOrganism onClose={() => setAddOrganismVisible(false)} />}
        </>
    );
}
