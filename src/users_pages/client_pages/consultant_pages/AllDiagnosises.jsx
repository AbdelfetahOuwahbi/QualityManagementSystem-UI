import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import ClientMainPage from '../ClientMainPage';
import { DiagnosisModal } from './DiagnosisModal';

export default function AllDiagnosises() {

    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
    const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col w-full h-auto">
                <div className="flex p-4 w-full items-center justify-between">
                    {/* Bars Icon That toogles the visibility of the menu */}
                    <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
                </div>
                <div className='border-t border-gray-300 py-4'></div>


                <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
                    <h1 className='text-4xl font-p_bold'>Mes Diagnostics</h1>
                </div>
                <div className='border-t border-gray-300 w-96 mb-10'></div>

                <div className='w-full h-10 flex items-center px-4 md:px-10'>
                    <button onClick={() => setIsDiagnosisModalOpen(true)} className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-x-2`}>
                        Nouveau diagnostic
                    </button>
                </div>

            </div>
            {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
            {isDiagnosisModalOpen && <DiagnosisModal onClose={() => setIsDiagnosisModalOpen(false)}/>}
        </>
    )
}
