import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Drawer, Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
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

  //Checking the type of the consultant
  const [isResponsible, setIsResponsible] = useState(false);
  const [isUpperMenuOpen, setIsUpperMenuOpen] = useState(true);

  const navigate = useNavigate();

  const decoded = jwtDecode(Cookies.get("JWT"));
  //then Ill extact the id to send
  const userID = decoded.id;

  // The main role of a user
  const mainUserRole = extractMainRole();

  // How many notifications did the SysAdmin Receive
  const [modalOpen, setModalOpen] = useState(true);
  const [notifsNumber, setNotifsNumber] = useState(0);

  //the Sys Admin's profile Image
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    }
    else {      //Checking the validity of the token ends
      if (mainUserRole === "Consultant") {
        async function getConsultantLevel() {
          try {
            const response = await fetch(`${appUrl}/users/consultants/level?id=${userID}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${Cookies.get("JWT")}`
              }
            });
            const data = await response.text();
            const cleanedData = data.replace(/^["']|["']$/g, '');
            if (cleanedData === "responsable") {
              setIsResponsible(true);
              console.log(data);
            } else {
              setIsResponsible(false);
              console.log(data);
            }
          } catch (error) {
            console.log("erreur happened while fetching consultant Level -->", error);
          }
        }
        getConsultantLevel();
      }
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



  return (
    <>
      {/* The Navigation Menu */}
      <Drawer open={modalOpen} onClose={onClose}>
        <Drawer.Header />
        <Drawer.Items>
          {/* Profile Image */}
          <div onClick={() => {
            navigate("/Profile");
            setModalOpen(false);
          }}
            className='h-auto items-center justify-around flex flex-col cursor-pointer'>
            <img src={`${appUrl}/images/${profileImage}`} className='w-14 h-14 rounded-full object-cover transition duration-300 hover:scale-110' alt="profile image" />
            {/* username */}
            <div className='py-2'>
              <h1 className='font-p_regular' >{mainUserRole}</h1>
            </div>
          </div>

          <Sidebar aria-label="Sidebar with multi-level dropdown example">
            <Sidebar.Items>
              <Sidebar.ItemGroup>

                <div
                  onClick={() => setIsUpperMenuOpen(!isUpperMenuOpen)}
                  className='flex w-full bg-white h-10 items-center px-1 md:px-4 justify-between gap-4  border-t-[1px] border-b-[1px] border-gray-300 rounded-sm cursor-pointer'>
                  <h2 className='font-p_regular'> Entitées Globale </h2>
                  {isUpperMenuOpen ? (
                    <IoIosArrowUp className='w-6 h-6 text-sky-500' />
                  ) : (
                    <IoIosArrowDown className='w-6 h-6 text-sky-500' />
                  )}
                </div>
                {isUpperMenuOpen &&
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className='flex flex-col gap-2'>
                      <Sidebar.Item onClick={() => {
                      }} href="/ClientDashboard" icon={HiChartPie}
                        className='mt-2'
                      >
                        Dashboard
                      </Sidebar.Item>

                      <Sidebar.Item onClick={() => {
                      }} href="/ClientNotifications" icon={IoMdNotificationsOutline} label={notifsNumber}>
                        Boite
                      </Sidebar.Item>
                      {mainUserRole === "Consultant" &&
                        <Sidebar.Collapse icon={GoOrganization} label="Entreprises Clientes">

                          <Sidebar.Item onClick={() => {
                          }} icon={CiBoxList} href="/AllEntreprises">Liste des Entreprises
                          </Sidebar.Item>
                          {isResponsible &&
                            <Sidebar.Item onClick={() => {
                            }} icon={CiBoxList} href="/AllUsers">Liste des utilisateurs
                            </Sidebar.Item>
                          }

                        </Sidebar.Collapse>
                      }
                      {mainUserRole === "Consultant" &&
                        <Sidebar.Collapse icon={FaCheckToSlot} label="Mes Diagnostics">

                          <Sidebar.Item onClick={() => {
                          }} icon={CiBoxList} href="/AllDiagnosises">Liste des Diagnostics
                          </Sidebar.Item>
                        </Sidebar.Collapse>
                      }
                    </motion.div>
                  </AnimatePresence>
                }

                <Sidebar.Item className='cursor-pointer' onClick={() => handleLogout()} icon={FaSignOutAlt}>
                  Déconnexion
                </Sidebar.Item>

              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>

          <Sidebar>
            <SidebarItems>
              <SidebarItemGroup>

              </SidebarItemGroup>
            </SidebarItems>
          </Sidebar>

        </Drawer.Items>
      </Drawer>
    </>
  );
}
