import React, { useState, useEffect } from 'react'
import { Card, Popover, Button, FloatingLabel } from "flowbite-react";
import { FaBars } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoIosNotificationsOutline } from 'react-icons/io';
import { CiSettings } from 'react-icons/ci';
import { MdOutlinePassword, MdManageAccounts, MdOutlineSettingsSuggest } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import {useLocation, useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { appUrl } from '../../Url.jsx';
import { isTokenExpired, isTokenInCookies, countNotifications, changePassword, extractMainRole } from '../CommonApiCalls';
import ClientMainPage from './ClientMainPage';

export default function ClientDashboard() {

    const navigate = useNavigate();

    const decoded = jwtDecode(Cookies.get("JWT"));
    //then Ill extact the id to send
    const userID = decoded.id;

    // The main role of a user
    const mainUserRole = extractMainRole();

    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

    //Settings Popover variables (Tooglers)
    const [willChangePass, setWillChangePass] = useState(false);
    const [willShowAccountInfos, setWillShowAccountInfos] = useState(false);
    const [willShowAdvancedSettings, setWillShowAdvancedSettings] = useState(false);

    // How many notifications did the SysAdmin Receive
    const [notifsNumber, setNotifsNumber] = useState(0);

    //Settings Popover State
    const [open, setOpen] = useState(false);

    const location = useLocation();
    const shouldChangePassword = location.state?.shouldChangePassword;

    //Change password properties
    const [changedPasswordProperties, setChangedPasswordProperties] = useState({
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
    })

    //the Sys Admin's profile Image
    const [profileImage, setProfileImage] = useState(null);

    //Counting all notifs when the Dashboard Page loads
    useEffect(() => {
        if (!isTokenInCookies()) {
            navigate("/");
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            navigate("/");
        }
        else {      //Checking the validity of the token ends
            const countNotifs = async () => {
                //userId to send to count notifications
                const userID = jwtDecode(Cookies.get("JWT")).id;
                try {
                    const data = await countNotifications(userID, Cookies.get("JWT"));
                    console.log("Number of notifications is --> ", data);
                    setNotifsNumber(data);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };

            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    countNotifs();
                    getProfileImage();
                }
            };

            // Initial fetch
            countNotifs();
            getProfileImage();

            // Set up event listener for visibility change
            document.addEventListener("visibilitychange", handleVisibilityChange);

            // Clean up function to remove event listener when component unmounts
            return () => {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, []);

    //Function that Changes the Password for the Client
    async function changePasswordForClient(currentPassword, newPassword, confirmationPassword) {
        if (newPassword === confirmationPassword) {
            try {
                const response = await changePassword(currentPassword, newPassword, confirmationPassword);
                if (response.ok) {
                    console.log("Password changed successfully for Client");
                    toast.success("Votre mot de passe a été changé avec succès ..");
                } else {
                    toast.error("Une erreur s'est produite, ressayer plus tard !!")
                }
            } catch (error) {
                console.error("Error changing password for Client:", error);
            }
        } else {
            toast.error("Le nouveau mot de passe et sa confirmation ne sont pas identiques !!")
        }
    }

    useEffect(() => {
        if (shouldChangePassword) {
            toast.error( "Veuillez changer votre mot de passe initial.");
            setWillChangePass(true)
            setOpen(true)
        }
    }, [shouldChangePassword]);

    //Function that gets the users profile

    const getProfileImage = async () => {
        try {
            const response = await fetch(`${appUrl}/users/image-path?userId=${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`
                }
            });
            const data = await response.text();
            setProfileImage(data);

        } catch (error) {
            console.log("an error happened while fetching the profile image !!");
        }
    }


    //Content of the settings popOver
    const popOverContent = (
        <div className='flex flex-col gap-4 py-7 px-4 text-sm text-gray-500 dark:text-gray-400'>

            {/* Password Section */}
            <div onClick={() => setWillChangePass(!willChangePass)} className='flex items-center justify-around gap-8 cursor-pointer p-2'>
                <MdOutlinePassword className='w-6 h-6' />
                <h2 id="area-popover" className="font-p_regular text-gray-800">Changer votre mot de passe ?</h2>
                {willChangePass ? (
                    <IoIosArrowUp className='w-6 h-6' />
                ) : (
                    <IoIosArrowDown className='w-6 h-6' />
                )}
            </div>
            <AnimatePresence mode='wait'>
                {willChangePass && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex w-64 flex-col gap-4 p-4 text-sm text-gray-500 dark:text-gray-400">

                        <FloatingLabel variant="outlined" type='password' label="Mot de passe existant"
                            onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, currentPassword: e.target.value })}
                        />

                        <FloatingLabel variant="outlined" type='password' label="Nouveau Mot de passe"
                            onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, newPassword: e.target.value })}
                        />

                        <FloatingLabel variant="outlined" type='password' label="Confirmation"
                            onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, confirmationPassword: e.target.value })}
                        />

                        <div className="flex gap-2">
                            <Button className='bg-sky-500'
                                onClick={() => {
                                    changePasswordForClient(changedPasswordProperties.currentPassword,
                                        changedPasswordProperties.newPassword,
                                        changedPasswordProperties.confirmationPassword
                                    )
                                    setOpen(false)
                                }}>
                                Enregistrer
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='border-b-2 rounded-lg'></div>

            {/* Account informations Section */}
            <div onClick={() => setWillShowAccountInfos(!willShowAccountInfos)} className='flex items-center justify-start gap-8 cursor-pointer p-2'>
                <MdManageAccounts className='w-6 h-6' />
                <h2 id="area-popover" className="font-p_regular text-gray-800">Votre compte</h2>
                {willShowAccountInfos ? (
                    <IoIosArrowUp className='w-6 h-6' />
                ) : (
                    <IoIosArrowDown className='w-6 h-6' />
                )}
            </div>
            <AnimatePresence mode='wait'>
                {willShowAccountInfos && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className='flex items-center pt-2 justify-between'>
                        <div onClick={() => navigate("/Profile")} className='flex items-center justify-around gap-4 cursor-pointer'>
                            <img src={`${appUrl}/images/${profileImage}`} className='h-10 w-10 rounded-full object-cover' alt="Votre profile" />
                            <h1 className='font-p_medium'> Votre profile </h1>
                        </div>
                        <div>
                            <a className='font-p_regular text-red-500 underline' href="">Désactiver votre compte</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='border-b-2 rounded-lg'></div>

            {/* Advanced Settings Section */}
            <div onClick={() => setWillShowAdvancedSettings(!willShowAdvancedSettings)} className='flex items-center justify-start gap-8 cursor-pointer p-2'>
                <MdOutlineSettingsSuggest className='w-6 h-6' />
                <h2 id="area-popover" className="font-p_regular text-gray-800">Paramètres Avancèe</h2>
                {willShowAdvancedSettings ? (
                    <IoIosArrowUp className='w-6 h-6' />
                ) : (
                    <IoIosArrowDown className='w-6 h-6' />
                )}
            </div>
            <AnimatePresence mode='wait'>
                {willShowAdvancedSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className='flex flex-col gap-2 pt-2 justify-between'>
                        <div className='flex cursor-pointer'>
                            <a className='font-p_light' href="">Adv Settings 1</a>
                        </div>
                        <div>
                            <a className='font-p_light' href="">Adv Settings 2</a>
                        </div>
                        <div>
                            <a className='font-p_light' href="">Adv Settings 3</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='border-b-2 rounded-lg'></div>
        </div>

    );

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex flex-col w-full h-auto">

                <div className="flex p-4 w-full items-center justify-between">
                    {/* Bars Icon That toogles the visibility of the menu */}
                    <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />

                    <div className="flex justify-between gap-6">
                        {/* Notification Icon and Indicator */}
                        <div className="relative flex items-center">
                            <IoIosNotificationsOutline onClick={() => window.location.href = '/SysNotifications'} className='w-6 h-6 cursor-pointer text-neutral-600' />
                            {/* This part will be dealed with once we start getting data from our api */}
                            {notifsNumber !== 0 &&
                                <div className="absolute top-0 right-0 -mr-[1px] -mt-[-12px] w-3 h-3 rounded-full bg-red-600 flex items-center justify-center">
                                    <p className="text-white text-xs font-thin">{notifsNumber}</p>
                                </div>
                            }
                        </div>

                        <Popover
                            aria-labelledby="area-popover"
                            open={open}
                            onOpenChange={setOpen}
                            content={popOverContent}
                        >
                            {/* Settings Icon */}
                            <Button>
                                Paramètres <CiSettings className='w-6 h-6 ml-2 cursor-pointer text-neutral-100' />
                            </Button>
                        </Popover>

                    </div>

                </div>
                <div className='border-t border-gray-300 py-4'></div>

                <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
                    <h1 className='text-4xl font-p_bold'>Dashboard</h1>
                </div>
                <div className='border-t border-gray-300 w-96 mb-10'></div>


            </div>


            {/* <div className="px-4 py-2">
                <div className="flex flex-wrap justify-between">
                    {cardData.map((card, index) => (
                        <Card key={index}
                            className={`${card.color} flex text-white shadow-lg duration-300  flex-col mb-4 md:flex-row w-full md:w-1/2`}>
                            <div>
                                <h5 className="text-xl font-p_bold">{card.title}</h5>
                                <p className="text-2xl font-p_semi_bold">{card.content}</p>
                                <p className="text-sm font-p_extra_light opacity-75">{card.change}</p>
                                <div className='w-6 h-6'>{card.icon}</div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div> */}
            {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
        </>
    )
}
