import React, { useEffect, useState } from 'react'
import { Carousel, Popover } from 'flowbite-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { isTokenExpired, isTokenInCookies, persistentSession } from '../users_pages/CommonApiCalls';
import Header from './Header';
import Homephoto from '../assets/Homephoto_2.png';
import logo from '../assets/logo.png';
import Norms from './Norms';
import Footer from './F_ooter';
import Services from './Services';
import Contact from './Contact';

export default function Main_page() {

  //this is used to persist the session if the user is already logged in 
  // useEffect(() => {
  //   if (!isTokenInCookies) {
  //     console.log("this user must perform login first !!")
  //   } else {      
  //     //Checking the existance of userRoles in cookies
  //     const userRoles = Cookies.get("userRoles");
  //     if (userRoles !== undefined && userRoles !== null && userRoles !== "") {
  //       const userRoleArray = JSON.parse(userRoles);
  //       const mainRole = userRoleArray
  //         .filter(role => ['Sysadmin', 'Consultant', 'Admin', 'Responsable', 'Pilot'].includes(role.name))
  //         .map(role => role.name);
  //       console.log("Main role of the user:", mainRole[0]);
  //       if (mainRole[0] === 'Sysadmin') {
  //         persistentSession("Sysadmin");
  //       } else {
  //         persistentSession(mainRole[0])
  //       }
  //     }
  //   }
  // }, [])



  //This Const is used to Toogle the Contact Form visibility
  const [isContactVisible, setIsContactVisible] = useState(false);

  //This is the Content of the Popover on the button "Contacter nous"
  const PopoverContent = (
    <div className="w-64 p-3">
      <div className="mb-2 flex items-center justify-between">
        <a href="#">
          <img
            className="h-10 w-10 rounded-full"
            src={logo}
            alt="Jese Leos"
          />
        </a>
      </div>
      <p id="profile-popover" className="text-base font-semibold leading-none text-gray-900 dark:text-white">
        <a href="#">QmsApp</a>
      </p>
      <p className="mb-4 text-sm">
        Votre Plateforme pour une meilleur experience en l'amelioration qualite{' '}
        <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
          QmsApp.com
        </a>
        .
      </p>
      <ul className="flex text-sm">
        <li className="me-2">
          <a href="#" className="hover:underline">
            <span className="font-semibold text-gray-900 dark:text-white">72 </span>
            <span>sociétés</span>
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            <span className="font-semibold text-gray-900 dark:text-white">10000 </span>
            <span>utilisateurs</span>
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      {/* Header Section Starts */}
      <Header />
      {/* Header Section Ends */}

      {/* Home Section Starts */}
      <div className='bg-neutral-200' id='home'>
        <div className='px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen '>
          <Carousel className='w-full mx-auto mt-20 md:mt-0'>
            <div className="flex flex-col md:flex-row-reverse h-full items-center md:justify-between">
              <motion.img
                initial={{ scale: 0.5, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
                src={Homephoto} alt="Collaborations" className='w1/2 h-1/2 object-contain mt-10' />
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
                className='flex-col lg:px-8'>
                <h1 className='text-2xl md:text-5xl font-medium md:font-p_semi_bold mb-4 text-neutral-600'>Votre allié de confiance pour <br /> concevoir et mettre en œuvre <br /> un système de gestion QSE <br />
                  <span className='text-sky-400 font-p_bold'>intuitif, intelligent et efficace.</span>
                </h1 >
                <h1 className='md:text-xl text-neutral-600 font-p_light md:font-p_regular'>Optimisez votre gestion QSE en tirant parti du plein potentiel de l'intelligence artificielle.</h1>

                {/* The Popover on Contact Button Code Starts*/}
                <Popover
                  aria-labelledby="profile-popover"
                  content={PopoverContent}
                  trigger="hover"
                >
                  <button onClick={() => setIsContactVisible(!isContactVisible)} className='bg-sky-400 mb-4 md:mb-0 text-white mt-4 py-2 px-4 font-p_medium transition-all duration-300 rounded hover:translate-x-2 hover:bg-neutral-500'>
                    Contacter nous
                  </button>
                </Popover>
                {/* The Popover on Contact Button Code Starts*/}

              </motion.div>
            </div>

            {/* We can add more items to this carousel here */}

          </Carousel>
        </div>

      </div>
      {/* Home Section Ends */}

      {/* Norms Section Starts */}
      <Norms />
      {/* Norms Section Ends */}

      {/* Services Section Starts */}
      <Services />
      {/* Services Section Ends */}

      {/* Footer Section Starts */}
      <Footer />
      {/* Footer Section Ends */}
      {isContactVisible && <Contact onClose={() => setIsContactVisible(false)} />}
    </>
  )
}
