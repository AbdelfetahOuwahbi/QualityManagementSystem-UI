import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Drawer, Sidebar, Popover, SidebarItemGroup, SidebarItems, SidebarItem } from "flowbite-react";
import { CiBoxList } from "react-icons/ci";
import { SiGithubactions } from "react-icons/si";
import { IoMdNotificationsOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import { FcOrganization } from "react-icons/fc";
import { FaCheckToSlot } from "react-icons/fa6";
import { HiChartPie } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { GoOrganization } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { doesHeHaveAccess, extractMainRole } from "../CommonApiCalls";
import { appUrl } from "../../Url.jsx";
// Method that counts all notifications
//From common Api Calls
import { isTokenExpired, isTokenInCookies, handleLogout, countNotifications } from "../CommonApiCalls";

export default function ClientMainPage({ onClose }) {

  const navigate = useNavigate();

  const decoded = jwtDecode(Cookies.get("JWT"));
  //then Ill extact the id to send
  const userID = decoded.id;

  // The main role of a user
  const mainUserRole = extractMainRole();

  // How many notifications did the SysAdmin Receive
  const [modalOpen, setModalOpen] = useState(true);
  const [notifsNumber, setNotifsNumber] = useState(0);

  //Checks if there is an entreprise in local Storage
  const [nowThereIsAnEntreprise, setNowThereIsAnEntreprise] = useState(false);
  const [searchedEntreprise, setSearchedEntreprise] = useState("");

  //Checking the type of the consultant
  const [isResponsible, setIsResponsible] = useState(false);
  const [isUpperMenuOpen, setIsUpperMenuOpen] = useState(false);
  const [isEntrepriseMenuOpen, setIsEntrepriseMenuOpen] = useState(false);
  const [chosenEntrepriseDetails, setChosenEntrepriseDetails] = useState(
    {
      name: "",
      id: '',
      image: "",
    }
  );

  //the Sys Admin's profile Image
  const [user, setUser] = useState({});

  // Function to save The Entreprise to localStorage
  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  // Function to load The Entreprise from localStorage
  const loadFromLocalStorage = (key) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error('Error loading from localStorage', error);
      return null;
    }
  };

  //Function that filters the entreprises values
  const filteredEntreprises = user.entreprises?.filter(entreprise =>
    entreprise.raisonSocial.toLowerCase().includes(searchedEntreprise.toLowerCase())
  );

  useEffect(() => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
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
          getUser();
        }
      };

      // Initial fetch
      if (Object.keys(user).length === 0) {
        getUser();
      } else {
        console.log("Already got the user !!");
      }
      countNotifs();

      //Checking the existance of an entreprise in the local storage
      const existingDetails = loadFromLocalStorage('chosenEntrepriseDetails');
      if (existingDetails) {
        if (existingDetails.id !== '') {
          setNowThereIsAnEntreprise(true);
          // console.log("We found an entreprise in local Storage on Mount --> ", existingDetails);
          setChosenEntrepriseDetails(existingDetails);
        } else {
          // console.log("We found an entreprise in local Storage on Mount But its Empty !! --> ", existingDetails);
        }
      }
      // Set up event listener for visibility change
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Clean up function to remove event listener when component unmounts
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, []);

  //Checking the existance of a chosen Entreprise Before chosing another one and also persists that choise
  useEffect(() => {
    if (chosenEntrepriseDetails.id !== '') {
      const existingDetails = loadFromLocalStorage('chosenEntrepriseDetails');
      if (existingDetails) {
        // console.log("We found an entreprise in local Storage After select --> ", existingDetails);
        if (JSON.stringify(existingDetails) === JSON.stringify(chosenEntrepriseDetails)) {
          // console.log("The Entreprise that you try to save is identical to the one stored");
        } else {
          // console.log("The Entreprise that you try to save is NOT identical to the one stored .. setting the new One ..", chosenEntrepriseDetails);
          saveToLocalStorage('chosenEntrepriseDetails', chosenEntrepriseDetails);
          setNowThereIsAnEntreprise(true);
        }
      } else {
        // console.log("No entreprise found in local storage, setting the chosen value now ...");
        saveToLocalStorage('chosenEntrepriseDetails', chosenEntrepriseDetails);
        setNowThereIsAnEntreprise(true);
      }
    }
  }, [chosenEntrepriseDetails]);

  //Function that gets the consultant's managed entreprises
  async function getUser() {
    try {
      const response = await fetch(`${appUrl}/users/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        }
      });
      const data = await response.json();
      if (mainUserRole === "Consultant") {
        const cleanedData = data.level.replace(/^["']|["']$/g, '');
        if (cleanedData === "responsable") {
          setIsResponsible(true);
        } else {
          setIsResponsible(false);
        }
      }
      console.log(`The user in Client Menu--> `, data);
      setUser(data);
    } catch (error) {
      console.log("erreur happened while fetching consultant Level -->", error);
    }
  }

  //Entreprises Popover Content
  const content = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input onChange={(e) => setSearchedEntreprise(e.target.value)} type="search" id="default-search" className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rechercher une entreprise ..." required />
        </div>
      </div>
      {searchedEntreprise === "" ? (
        user.entreprises?.map((entreprise, index) =>
          <div
            key={index}
            onClick={() => {
              setChosenEntrepriseDetails(
                {
                  name: entreprise.raisonSocial,
                  id: entreprise.id,
                  image: `${appUrl}/images/organism/${entreprise.imagePath}`
                }
              );
            }}
            className='flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-2'>
            <img src={`${appUrl}/images/organism/${entreprise.imagePath}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
            <h2 className='font-p_regular text-sm text-black'>{entreprise.raisonSocial}</h2>
          </div>
        )
      ) : (
        filteredEntreprises?.map((entreprise, index) => (
          <div
            key={index}
            onClick={() => {
              setChosenEntrepriseDetails({
                name: entreprise.raisonSocial,
                id: entreprise.id,
                image: `${appUrl}/images/organism/${entreprise.imagePath}`
              });
            }}
            className='flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg items-center p-2'>
            <img src={`${appUrl}/images/organism/${entreprise.imagePath}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
            <h2 className='font-p_regular text-sm text-black'>{entreprise.raisonSocial}</h2>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      {/* The Navigation Menu */}
      <Drawer open={modalOpen} onClose={onClose} className="custom-scrollbar">
        <Drawer.Header />
        <Drawer.Items>
          {/* Profile Image */}
          <div onClick={() => {
            navigate("/Profile");
            setModalOpen(false);
          }}
            className='h-auto items-center justify-around flex flex-col cursor-pointer'>
            <img src={`${appUrl}/images/${user.imagePath}`} className='w-14 h-14 rounded-full object-cover transition duration-300 hover:scale-110' alt="profile image" />
            {/* username */}
            <div className='py-2'>
              <h1 className='font-p_regular' >{mainUserRole}</h1>
            </div>
          </div>

          {/* Administrative SideBar Items */}

          {mainUserRole === "Consultant" &&
            <>
              <div
                onClick={() => setIsUpperMenuOpen(!isUpperMenuOpen)}
                className='flex w-full bg-white mt-4 h-10 items-center px-1 md:px-4 justify-between gap-4  border-t-[1px] border-b-[1px] border-sky-400 rounded-lg cursor-pointer'>
                <h2 className='font-p_regular'> Mes Services </h2>
                {isUpperMenuOpen ? (
                  <IoIosArrowUp className='w-6 h-6 text-sky-500' />
                ) : (
                  <IoIosArrowDown className='w-6 h-6 text-sky-500' />
                )}
              </div>
              <Sidebar aria-label="Sidebar with multi-level dropdown example">
                <Sidebar.Items >
                  <Sidebar.ItemGroup>

                    {isUpperMenuOpen &&
                      <AnimatePresence mode='wait'>
                        <motion.div
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className='flex flex-col gap-2 '>
                          <Sidebar.Item onClick={() => {
                          }} href="/ClientDashboard" icon={() => <HiChartPie className='text-sky-500 w-6 h-6' />}>
                            Dashboard
                          </Sidebar.Item>

                          <Sidebar.Item className={`${notifsNumber > 0 && "animate-pulse"}`} onClick={() => {
                          }} href="/ClientNotifications" icon={() => <IoMdNotificationsOutline className='text-sky-500 w-6 h-6' />} label={notifsNumber}>
                            Boite
                          </Sidebar.Item>

                          {isResponsible &&
                            <>
                              <Sidebar.Collapse icon={() => <GoOrganization className='text-sky-500 w-6 h-6' />} label="Entreprises Clientes">
                                <AnimatePresence mode='wait'>
                                  <motion.div
                                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                  >
                                    <Sidebar.Item onClick={() => {
                                    }} icon={() => <CiBoxList className='text-sky-500 w-6 h-6' />} href="/AllEntreprises">Liste des Entreprises
                                    </Sidebar.Item>
                                    <Sidebar.Item onClick={() => {
                                    }} icon={() => <CiBoxList className='text-sky-500 w-6 h-6' />} href="/AllUsers">Liste des utilisateurs
                                    </Sidebar.Item>
                                  </motion.div>
                                </AnimatePresence>

                              </Sidebar.Collapse>

                              <Sidebar.Collapse icon={() => <FaCheckToSlot className='text-sky-500 w-6 h-6' />} label="Mes Diagnostics">
                                <AnimatePresence mode='wait'>
                                  <motion.div
                                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                  >
                                    <Sidebar.Item onClick={() => {
                                    }} icon={() => <CiBoxList className='text-sky-500 w-6 h-6' />} href="/AllDiagnosises">Liste des Diagnostics
                                    </Sidebar.Item>
                                  </motion.div>
                                </AnimatePresence>

                              </Sidebar.Collapse>
                            </>
                          }




                        </motion.div>
                      </AnimatePresence>
                    }

                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </Sidebar>
            </>
          }

          <div className='border-t border-gray-300 py-2'></div>


          {/* Entreprise SideBar Items */}
          {mainUserRole === "Consultant" &&
            <>
              <Popover trigger="hover" content={content} placement="bottom">
                <div className='flex animate-pulse items-center justify-center gap-4 w-full h-10 shadow-lg bg-sky-400 rounded-lg mb-6 cursor-pointer'>
                  {chosenEntrepriseDetails.id === '' ? (
                    <>
                      <h1 className="font-p_bold">Choisir une entreprise </h1>
                      <FcOrganization className='w-6 h-6 text-white' />
                    </>
                  ) : (
                    <>
                      <img src={`${chosenEntrepriseDetails.image}`} className='h-6 w-6 rounded-full object-cover' alt="Votre profile" />
                      <h2 className='font-p_bold text-sm text-white'>{chosenEntrepriseDetails.name}</h2>
                    </>
                  )}
                </div>
              </Popover>

              {nowThereIsAnEntreprise &&
                <>
                  <div
                    onClick={() => setIsEntrepriseMenuOpen(!isEntrepriseMenuOpen)}
                    className='flex w-full bg-white h-10 items-center px-1 md:px-4 justify-between gap-4  border-t-[1px] border-b-[1px] border-sky-400 rounded-lg cursor-pointer'>
                    <h2 className='font-p_regular'> Menu </h2>
                    {isEntrepriseMenuOpen ? (
                      <IoIosArrowUp className='w-6 h-6 text-sky-500' />
                    ) : (
                      <IoIosArrowDown className='w-6 h-6 text-sky-500' />
                    )}
                  </div>
                  {isEntrepriseMenuOpen &&
                    <Sidebar>
                      <SidebarItems>
                        <SidebarItemGroup>
                          <AnimatePresence mode='wait'>
                            <motion.div
                              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                              <Sidebar.Item className='cursor-pointer' href='/ActionsPlans' icon={() => <SiGithubactions className='w-6 h-6 text-sky-500' />}>
                                Plan D'actions
                              </Sidebar.Item>
                            </motion.div>
                          </AnimatePresence>
                        </SidebarItemGroup>
                      </SidebarItems>
                    </Sidebar>
                  }
                </>
              }
            </>
          }

          {/* This Menu is For The Clients (Admin, Respo, Pilot) */}

          {mainUserRole !== "Consultant" &&
            <Sidebar>
              <SidebarItems>
                <SidebarItemGroup>

                  <Sidebar.Item className='cursor-pointer' href='/ActionsPlans' icon={() => <SiGithubactions className='w-6 h-6 text-sky-500' />}>
                    Plan D'actions
                  </Sidebar.Item>

                </SidebarItemGroup>
              </SidebarItems>
            </Sidebar>
          }

          {/* NonJob Related Sidebar Items */}

          <Sidebar>
            <SidebarItems>
              <SidebarItemGroup>
                <Sidebar.Item className='cursor-pointer' onClick={() => handleLogout()} icon={() => <FaSignOutAlt className='text-sky-500 w-6 h-6' />}>
                  Déconnexion
                </Sidebar.Item>
              </SidebarItemGroup>
            </SidebarItems>
          </Sidebar>

        </Drawer.Items>
      </Drawer>
    </>
  );
}
