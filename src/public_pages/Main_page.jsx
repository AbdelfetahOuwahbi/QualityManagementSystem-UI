import React, { useEffect, useState } from 'react'
import Header from './Header';
import { Carousel } from 'flowbite-react';
import Homephoto from '../assets/Homephoto_2.png';
import Norms from './Norms';
import Footer from './F_ooter';

export default function Main_page() {

    return (
        <>
            {/* Header Section Starts */}
            <Header />
            {/* Header Section Ends */}

            {/* Home Section Starts */}
            <div className='bg-neutral-200'>
                <div className='px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen '>
                    <Carousel className='w-full mx-auto'>
                        <div className="flex flex-col md:flex-row-reverse h-full items-center justify-between">
                            <img src={Homephoto} alt="Collaborations" className='w1/2 h-1/2 mt-10' />
                            <div className='flex-col lg:px-8'>
                                <h1 className='text-5xl font-p_semi_bold mb-4 text-neutral-600'>Votre allié de confiance pour <br /> concevoir et mettre en œuvre <br /> un système de gestion QSE <br />
                                    <span className='text-sky-400 font-p_bold'>intuitif, intelligent et efficace.</span>
                                </h1 >
                                <h1 className='text-xl text-neutral-600 font-p_regular'>Optimisez votre gestion QSE en tirant parti du plein potentiel de l'intelligence artificielle.</h1>
                                <button className='bg-sky-400 text-white mt-4 py-2 px-4 font-p_medium transition-all duration-300 rounded hover:translate-x-2 hover:bg-neutral-500'>
                                    Contacter nous
                                </button>
                            </div>
                        </div>

                        {/* We can add more items to this carousel here */}

                    </Carousel>
                </div>

            </div>
            {/* Home Section Ends */}

            {/* Norms Section Starts */}
            <Norms />
            {/* Norms Section Ends */}

            {/* Footer Section Starts */}
            <Footer/>
            {/* Footer Section Ends */}
        </>
    )
}
