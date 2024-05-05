import React, { useState, useEffect } from "react";
import { TiUserAdd } from "react-icons/ti";
import SysAddConsultant from "./SysAddConsultant";
import { Datepicker } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";


export default function SysAllConsultants() {

    const [addConsultantVisible, setAddConsultantVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date(null));
    const [endDate, setEndDate] = useState(new Date(null));

    // Consultant Properties
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [role, setRole] = useState([]);

    //Getting All Consultants
    useEffect(() => {
        //Checking the validity of the token starts
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {     //Checking the validity of the token ends
            const getAllConsultant = async () => {
                //This gets executed when no data is available or when endDate is cleared
                if (firstName.length === 0 || endDate.getTime() === new Date(null).getTime()) {
                    setFirstName([]);
                    setLastName([]);
                    setEmail([]);
                    setPhone([]);
                    setRole([]);
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
                                setFirstName((prev) => [...prev, data[i].firstname]);
                                setLastName((prev) => [...prev, data[i].lastname]);
                                setEmail((prev) => [...prev, data[i].email]);
                                setPhone((prev) => [...prev, data[i].phone]);
                                setRole((prev) => [...prev, "Consultant"]);
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
                } else {
                    console.log("already got all consultants")
                }
            }

            getAllConsultant();
        }
    }, [endDate])

    //Getting Consultants on date range
    useEffect(() => {
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            if (endDate.getTime() !== new Date(null).getTime()) {
                const getConsultantByDateRange = async () => {

                    if (firstName.length > 0) {
                        setFirstName([]);
                        setLastName([]);
                        setEmail([]);
                        setPhone([]);
                        setRole([]);
                        try {
                            const response = await fetch(`http://localhost:8080/api/v1/users/consultants/searchByDate?startDate=${startDate.toISOString().split('T')[0] + 'T00:00:00'}&endDate=${endDate.toISOString().split('T')[0] + 'T00:00:00'}`, {
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
                                        Consultants entre {startDate && startDate.toLocaleDateString()} et {endDate && endDate.toLocaleDateString()}
                                    </span>
                                ), {
                                    duration: 3000
                                });


                                console.log("Consultants -->", data);
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
                                        Pas de Consultants entre {startDate && startDate.toLocaleDateString()} et {endDate && endDate.toLocaleDateString()}
                                    </span>
                                ), {
                                    duration: 3000
                                });
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.log("No Consultants at all !")
                    }
                }

                getConsultantByDateRange();
            } else {
                console.log("must pick a new date to get consultants by date range")
            }
        }
    }, [endDate]);

    // useEffect(() => {
    //     console.log("start date --> ", startDate);
    //     console.log("end date --> ", endDate);
    //     console.log("null date is -->", new Date(null).toISOString().split('T')[0] + 'T00:00:00')
    //     console.log(endDate.getTime() === new Date(null).getTime());
    // }, [startDate, endDate])

    // console.log(firstName);
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <TiUserAdd onClick={() => setAddConsultantVisible(true)} className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                <div className="flex flex-row gap-4">

                    {/* Start Date */}
                    <Datepicker
                        defaultDate={new Date(null)}
                        value={startDate.getTime() !== new Date(null).getTime() ? startDate : "Date debut"}
                        onSelectedDateChanged={(date) => setStartDate(date)}
                        language="fr-FR"
                    />
                    {/* End Date */}
                    <Datepicker
                        defaultDate={new Date(null)}
                        value={endDate.getTime() !== new Date(null).getTime() ? endDate : "Date fin"}
                        onSelectedDateChanged={(date) => setEndDate(date)}
                    />

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
                        {firstName.map((consultant, index) =>
                            <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">

                                <td className="px-6 py-4">
                                    {firstName[index]}
                                </td>
                                <td className="px-6 py-4">
                                    {lastName[index]}
                                </td>
                                <td className="px-6 py-4">
                                    {email[index]}
                                </td>
                                <td className="px-6 py-4">
                                    {phone[index]}
                                </td>
                                <td className="px-6 py-4">
                                    {role[index]}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Modifier</a>
                                        <a href="#" className="font-medium text-red-500 dark:text-blue-500 hover:underline">Supprimer</a>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {addConsultantVisible && <SysAddConsultant onClose={() => setAddConsultantVisible(false)} />}
        </>
    );
}
