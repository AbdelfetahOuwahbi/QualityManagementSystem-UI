import React, { useState, useEffect } from "react";
import { TiUserAdd } from "react-icons/ti";
import SysAddConsultant from "./SysAddConsultant";
import { Datepicker } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";


export default function SysAllConsultants() {

    const [addConsultantVisible, setAddConsultantVisible] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Consultant Properties
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);
    const [role, setRole] = useState([]);

    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW1pQGdtYWlsLmNvbSIsImlhdCI6MTcxNDg2MDcyNywiZXhwIjoxNzE0OTQ3MTI3fQ.t_k0Sc4rjkeOBur3IEieqlakKUSJxwGTbj2afG49cw4";


    //Getting All Consultants
    useEffect(() => {
        const getAllConsultant = async () => {
            if (firstName.length === 0) {
                try {
                    const response = await fetch("http://localhost:8080/api/v1/users/consultants", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
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
    }, [])

    //Getting Consultants on date range
    useEffect(() => {
        
        // const formattedDate = startDate.toISOString().split('T')[0] + 'T00:00:00';
        console.log("start date -->", startDate);
        console.log("end date -->", endDate);
        console.log("Start date bigger than End date -> ", startDate > endDate)
    }, [startDate, endDate]);

    console.log(firstName);
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
                <TiUserAdd onClick={() => setAddConsultantVisible(true)} className="ml-4 w-7 h-7 text-gray-700 cursor-pointer" />
                <div className="flex flex-row gap-4 md:pr-16">

                    {/* Start Date */}
                    <Datepicker
                        value={startDate !== null ? startDate.replace('T00:00:00', '') : "Date debut"}
                        onSelectedDateChanged={(date) => setStartDate(date.toISOString().split('T')[0] + 'T00:00:00')}
                    />
                    {/* End Date */}
                    <Datepicker
                        value={endDate !== null ? endDate.replace('T00:00:00', '') : "Date fin"}
                        onSelectedDateChanged={(date) => setEndDate(date.toISOString().split('T')[0] + 'T00:00:00')}
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
