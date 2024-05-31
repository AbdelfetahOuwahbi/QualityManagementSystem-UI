import React, { useEffect, useState } from 'react'
import { Spinner } from 'flowbite-react';
import { FaBars } from 'react-icons/fa6';
import { CgDetailsMore } from "react-icons/cg";
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { extractMainRole, isTokenExpired, isTokenInCookies } from '../CommonApiCalls';
import { appUrl } from '../../Url';
import ActionPlanDetails from './ActionPlanDetails';
import ClientMainPage from './ClientMainPage';
import { jwtDecode } from "jwt-decode";
export default function ActionsPlans() {

    const mainUserRole = extractMainRole();
    const userID = jwtDecode(Cookies.get("JWT")).id;

    console.log(mainUserRole, " ", userID);

    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
    const [isActionDetailShowen, setIsActionDetailShowen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actions, setActions] = useState([]);
    const [dataToNextComponent, setDataToNextComponent] = useState({});

    useEffect(() => {
        if (actions.length > 0) {
            console.log("Already got all actions for this entreprise !!");
        } else {
            getActionsPlans();
        }
    }, [])

    //Function that gets the ActionsPlans
    async function getActionsPlans() {
        setIsLoading(true);
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            try {
                const response = await fetch(`${appUrl}/diagnoses/details/actions/by-entreprise/${JSON.parse(localStorage.getItem("EntrepriseId"))}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("JWT")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setIsLoading(false);
                        console.log("Here are all actions for this entreprise --> ", data);
                        setActions(data);
                        toast((t) => (
                            <span>
                                Liste met a jour ..
                            </span>
                        ));
                    } else {
                        setIsLoading(false);
                        console.log("No actions were found for this entreprise");
                        toast((t) => (
                            <span>
                                Pas d'actions pour le moment ..
                            </span>
                        ));
                    }
                } else {
                    toast.error("une errur s'est prosuit, ressayer plus tard !!")
                }
            } catch (error) {
                setIsLoading(false);
                console.log("error happened while fetching actions plans --> ", error);
            }
        }
    }
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex p-4 w-full justify-between">
                {/* Bars Icon That toogles the visibility of the menu */}
                <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
                {mainUserRole !== "Consultant" &&
                    <div className='flex items-center gap-2'>
                        <img src={`${appUrl}/images/organism/${localStorage.getItem("EntrepriseImage")}`}
                            className='w-8 h-8 rounded-full object-cover'
                            alt={localStorage.getItem("EntrepriseName")} />
                        <h1 className='font-p_medium text-sky-600'>{localStorage.getItem("EntrepriseName")}</h1>
                    </div>
                }
            </div>

            <div className='border-t border-gray-300 py-4'></div>
            <div className='w-full h-auto flex flex-col'>
                <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center gap-4">
                    <h1 className='text-4xl font-p_bold'>Plan D'actions</h1>
                    {/* Activity Indicator Goes here */}
                    {isLoading &&
                        <Spinner className="w-8 h-8 ml-12" aria-label="Default status example" />
                    }
                </div>
                <div className='border-t border-gray-300 w-96'></div>

            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 mt-8">
                <table
                    id="entrepriseTable"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date de création
                            </th>
                            <th scope="col" className="px-6 py-3">
                                DeadLine
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Origine
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Responsable
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions?.map((action, index) => (
                            (mainUserRole === "Consultant" || mainUserRole === "Responsable" || (mainUserRole === "Pilot" && userID === action.chosenAgent.id)) && (
                                <tr key={index} className='border-b'>
                                    <td className="px-6 py-4">
                                        {action.action}
                                    </td>
                                    <td className="px-6 py-4">
                                        {action.createdDate.replace('T', ' a ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {action.deadline.replace('T', ' a ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {action.origin}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className='flex items-center gap-4'>
                                            <img src={`${appUrl}/images/${action.chosenAgent.imagePath}`}
                                                className='w-8 h-8 rounded-full object-cover'
                                                alt={action.chosenAgent.firstname} />
                                            {action.chosenAgent.firstname}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <CgDetailsMore onClick={() => {
                                            setIsActionDetailShowen(!isActionDetailShowen);
                                            setDataToNextComponent(action);
                                        }}
                                            className='w-7 h-7 text-sky-500 cursor-pointer' />
                                    </td>
                                </tr>
                            )
                        ))}

                    </tbody>
                </table>
            </div>
            {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
            {isActionDetailShowen && <ActionPlanDetails actionProperties={dataToNextComponent} onClose={() => setIsActionDetailShowen(false)} />}
        </>
    )
}
