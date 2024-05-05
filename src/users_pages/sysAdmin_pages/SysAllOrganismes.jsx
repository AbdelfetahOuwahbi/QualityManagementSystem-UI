import React, { useState, useEffect } from "react";
import { MdOutlineDomainAdd } from "react-icons/md";
import SysAddConsultant from "./SysAddConsultant";


export default function SysAllOrganismes() {

    const [addConsultantVisible, setAddConsultantVisible] = useState(false);

    // useEffect(async() => {
    //     try {
    //         const response = await fetch("http://localhost:8080/api/v1/signIn", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 'email': email,
    //                 'password': password
    //             }),
    //         });

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, [])
    return (
        <>
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <MdOutlineDomainAdd onClick={() => setAddConsultantVisible(true)} className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                <div className="flex flex-row gap-4">


                    <div date-rangepicker class="flex items-center">
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input datepicker datepicker-autohide name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                        </div>
                        <span class="mx-4 text-gray-500">to</span>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input name="end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                        </div>
                    </div>



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
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td class="px-6 py-4">
                                Abdelfetah
                            </td>
                            <td class="px-6 py-4">
                                Ouwahbi
                            </td>
                            <td class="px-6 py-4">
                                abdo90@gmail.com
                            </td>
                            <td class="px-6 py-4">
                                0685974123
                            </td>
                            <td class="px-6 py-4">
                                Consultant
                            </td>
                            <td class="px-6 py-4">
                                Abdelfetah
                            </td>
                            <td class="px-6 py-4">
                                Ouwahbi
                            </td>
                            <td class="px-6 py-4">
                                abdo90@gmail.com
                            </td>
                            <td class="px-6 py-4">
                                0685974123
                            </td>
                            <td class="px-6 py-4">
                                Consultant
                            </td>
                            <td class="px-6 py-4">
                                Abdelfetah
                            </td>
                            <td class="px-6 py-4">
                                <div className="flex gap-4">
                                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Modifier</a>
                                    <a href="#" class="font-medium text-red-500 dark:text-blue-500 hover:underline">Supprimer</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {addConsultantVisible && <SysAddConsultant onClose={() => setAddConsultantVisible(false)} />}
        </>
    );
}
