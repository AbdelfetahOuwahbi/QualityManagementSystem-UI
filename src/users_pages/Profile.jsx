import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MdEditNote } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { FaBars } from 'react-icons/fa6';
import { FloatingLabel } from 'flowbite-react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { isTokenExpired, isTokenInCookies } from './CommonApiCalls';
import toast, { Toaster } from 'react-hot-toast';
import profileImg from '../assets/profile.jpg';
import SysMainPage from './sysAdmin_pages/SysMainPage';

export default function Profile() {

  const navigate = useNavigate();

  //Ill get the token from cookies
  const token = Cookies.get("JWT");
  const userRole = Cookies.get("userRoles");
  console.log("The Role of the user that needs to be parsed because it is stored in cookies-->",userRole);
  //Ill decode it !!
  const decoded = jwtDecode(token);
  //Ill extact the email to send
  const userEmail = decoded.sub;
  console.log("user email that we will send to change the informations-->",userEmail);


  const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);
  const [startedEditing, setStartedEditing] = useState(false);

  const [userDetails, setUserDetails] = useState(
    {
      id: "",
      accountNonLocked: "",
      createdDate: "",
      email: "",
      firstname: "",
      lastname: "",
      lastModifiedDate: "",
      phone: "",
    } || {

    }
  )

  useEffect(() => {
    const GetMyData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/sysadmins/email/${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ` Bearer ${Cookies.get("JWT")}`
          }
        });

        const data = await response.json();
        setUserDetails(prev => ({ ...prev, id: data.id }));
        setUserDetails(prev => ({ ...prev, accountNonLocked: data.accountNonLocked }));
        setUserDetails(prev => ({ ...prev, createdDate: data.createdDate }));
        setUserDetails(prev => ({ ...prev, lastModifiedDate: data.lastModifiedDate }));
        setUserDetails(prev => ({ ...prev, firstname: data.firstname }));
        setUserDetails(prev => ({ ...prev, lastname: data.lastname }));
        setUserDetails(prev => ({ ...prev, email: data.email }));
        setUserDetails(prev => ({ ...prev, phone: data.phone }));
      } catch (error) {
        console.log(error);
      }
    }
    GetMyData();
  }, [])

  //Function that updates a user's profile
  const updateProfile = async (userDetails) => {
    // Vérification de la validité du jeton
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/sysadmins/${userDetails.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify({
            "firstname": userDetails.firstname,
            "lastname": userDetails.lastname,
            "email": userDetails.email,
            "phone": userDetails.phone,
          }),
        });
        console.log("first, the response is -->", response);
        if (response.status === 200 || response.status === 201) {
          toast.success("Votre informations sont modifiées avec succès.");
        }
      } catch (error) {
        console.error(error); // Gérer les erreurs
        toast.error("Une erreur s'est produite lors de la modification de vos informations.");
      }
    }
};

useEffect(() => {
  console.log(userDetails);
}, [userDetails])

return (
  <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="flex p-4 w-full justify-between">
      {/* Bars Icon That toogles the visibility of the menu */}
      <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
    </div>

    <div className='border-t border-gray-300 py-4'></div>

    <section className="w-full h-auto">
      <div className="flex flex-col">
        {/* <!-- Profile Image --> */}
        <div className="mx-4 md:mx-32 flex flex-row items-center justify-between">
          <div className='flex items-center justify-start gap-4 relative'>
            {/* Profile Image */}
            <img src={profileImg} alt="Votre profile" className="w-16 h-16 md:w-32 md:h-32 cursor-pointer rounded-full transition duration-300 hover:scale-110 object-cover" />

            {/* Online Indicator Icon */}
            <TbPointFilled className='absolute w-6 h-6 md:w-10 md:h-10 ml-12 mb-10 md:mb-20 md:ml-24 rounded-full text-green-400 bg-white' />

            {/* FullName */}
            <h1 className="text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
              {userDetails.firstname}
            </h1>
          </div>


          <div className='flex flex-row items-center gap-1'>
            {!startedEditing ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdEditNote onClick={() => setStartedEditing(!startedEditing)} className='w-10 h-10 cursor-pointer' />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='cursor-pointer'
                onClick={() => {
                  setStartedEditing(false);
                  updateProfile(userDetails)
                }}
              >
                <FaCheck className='w-8 h-8 cursor-pointer' />
              </motion.div>
            )}
          </div>

        </div>

        <div
          className="flex flex-col gap-4 px-2 md:px-10 py-4 md:py-14">
          {/* <!-- Description --> */}
          <p className="md:mx-10 w-fit text-gray-700 dark:text-gray-400 text-center text-md">Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem
            veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore
            similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic
            eligendi vitae animi nam in, est earum culpa illum aliquam.</p>


          {/* <!-- Detail --> */}
          <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
            <div className="mx-6 w-full flex md:flex-row flex-col gap-2 justify-center">
              <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                  <div className="flex flex-col pb-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Prénom</dt>
                    {startedEditing ? (
                      <FloatingLabel variant="outlined" type='text' value={userDetails.firstname} label="Prénom"
                        onChange={(e) => setUserDetails(prev => ({ ...prev, firstname: e.target.value }))}
                      />
                    ) : (
                      <dd className="text-lg font-semibold">{userDetails.firstname}</dd>
                    )}
                  </div>
                  <div className="flex flex-col py-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Nom</dt>
                    {startedEditing ? (
                      <FloatingLabel variant="outlined" type='text' value={userDetails.lastname} label="Prénom"
                        onChange={(e) => setUserDetails(prev => ({ ...prev, lastname: e.target.value }))}
                      />
                    ) : (
                      <dd className="text-lg font-semibold">{userDetails.lastname}</dd>
                    )}
                  </div>
                  <div className="flex flex-col py-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Compte lancé en</dt>
                    <dd className="text-lg font-semibold">{userDetails.createdDate.substring(0, 10)}</dd>
                  </div>
                </dl>
              </div>
              <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">

                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">numéro de téléphone</dt>
                    {startedEditing ? (
                      <FloatingLabel variant="outlined" type='text' value={userDetails.phone} label="Prénom"
                        onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <dd className="text-lg font-semibold">+212 {userDetails.phone}</dd>
                    )}
                  </div>
                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Email</dt>
                    <dd className="text-lg font-semibold">{userDetails.email}</dd>
                  </div>

                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Status actuel</dt>
                    <dd className={`text-lg font-semibold ${userDetails.accountNonLocked === true ? "text-green-500" : "text-red-500"} `}>En ligne | {userDetails.accountNonLocked === true ? "Compte Activé" : "Compte Désactivé"}</dd>
                  </div>
                </dl>
              </div >
            </div >
          </div >

        </div >
      </div >
    </section >
    {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />
    }
  </>
)
}
