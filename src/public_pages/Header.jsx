import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-scroll';
import { FaXmark, FaBars } from "react-icons/fa6";
import Contact from './Contact';
import SignIn from './SignIn';

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    //Contact Modal visibility Controller
    const [contactVisible, setContactVisible] = useState(false);

    //SignIn Modal visibility Controller
    const [signInVisible, setsignInVisible] = useState(false);


    //Toogling menu (false when closed w true when opened)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        //For the nav to be still and not moving along with the scroll
        function handleScroll() {
            if (window.scrollY > 100) {

                setIsSticky(true);
            } else {

                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        //Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }

    });

    //nav items

    const navItems = [
        { link: "Home", path: "home" },
        { link: "Aperçu", path: "preview" },
        { link: "Services", path: "services" },
        { link: "Articles", path: "articles" },

    ]

    return (
        <header className='w-full bg-white md:bg-transparent fixed top-0 left-0 right-0'>
            <nav className={`py-4 px-4 lg:px-14 ${isSticky ? 'sticky top-0 left-0 right-0 border-b bg-white duration-500' : ''}`}>
                <div className='flex justify-between items-center text-base gap-8'>
                    <a href="" className='text-2xl'>
                        <img src={logo} alt="QmsLogo" className='w-12 h-12 inline-block items-center' />
                        <span className='font-p_extra_bold'>QmsApp</span>
                    </a>
                    {/**Navigation items for large devices */}
                    <ul className='hidden md:flex space-x-12'>
                        {navItems.map(({ link, path }) =>
                            <Link to={path} spy={true} smooth={true} offset={-100} key={path}
                                className='block font-p_regular text-gray-900 hover:text-gray-600 cursor-pointer'>
                                {link}
                            </Link>
                        )}
                    </ul>

                    {/**Button for large devices */}
                    <div className='hidden lg:flex items-center gap-4'>
                        <a href="#" onClick={() => setsignInVisible(!signInVisible)} className='font-p_regular hover:scale-105 duration-300'> S'authentifier</a>
                        <button onClick={() => setContactVisible(!contactVisible)} className='bg-sky-400 text-white font-p_medium py-2 px-4 transition-all duration-300 rounded hover:bg-neutral-500'>
                            Contacter nous
                        </button>
                    </div>


                    {/* Menu button for mobile devices */}
                    <div className='md:hidden'>
                        <button className='text-neutral-600 focus:outline-none focus:text-gray-500' onClick={() => toggleMenu()}>
                            {
                                isMenuOpen ? (<FaXmark className='w-6 h-6 text-neutral-600' />) : (<FaBars className='w-6 h-6' />)
                            }
                        </button>
                    </div>
                </div>
                {/* Nav Items For mobile devices */}
                <div className={`space-y-4 px-4 mt-16 py-7 bg-green-500 ${isMenuOpen ? "block fixed top-0 left-0 right-0" : "hidden"}`}>
                    {navItems.map(({ link, path }) =>
                        <Link to={path} spy={true} smooth={true} offset={-100} key={path}
                            className='block font-p_regular text-base text-white hover:text-gray-400 cursor-pointer'>
                            {link}
                        </Link>
                    )}
                    {/**Button for large devices */}
                    <div className='flex md:hidden items-center gap-4'>
                        <a href="#" onClick={() => {
                            setsignInVisible(!signInVisible)
                            setIsMenuOpen(false);
                        }} className='font-p_regular hover:scale-105 duration-300 text-white'> S'authentifier</a>
                        <button onClick={() => {
                            setContactVisible(!contactVisible)
                            setIsMenuOpen(false);
                            setIsSticky(!isSticky)
                        }} className='bg-sky-400 text-white font-p_medium py-2 px-4 transition-all duration-300 rounded hover:bg-neutral-500'>
                            Contacter nous
                        </button>
                    </div>
                </div>
            </nav>
            {contactVisible && <Contact onClose={() => setContactVisible(false)} />}
            {signInVisible && <SignIn onClose={() => setsignInVisible(false)} />}
        </header>
    )
}
