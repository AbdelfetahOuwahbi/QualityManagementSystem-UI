import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Drawer, Sidebar } from "flowbite-react";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { IoMdPersonAdd, IoIosNotificationsOutline, IoMdNotificationsOutline } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { FaBars, FaUsersLine } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { MdAddChart } from "react-icons/md";
import profile from '../../assets/profile.jpg';
import Services from "../../public_pages/Services";
import SysNotifications from "./SysNotifications";
// Method that counts all notifications
import { countNotifications } from "../CommonApiCalls";

import SysAddConsultant from "./SysAddConsultant";
import SysAllConsultants from "./SysAllConsultants";
import SysAllOrganismes from "./SysAllOrganismes";
import SysAddOrganism from "./SysAddOrganism";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import { handleLogout } from "../CommonApiCalls";
import SysDashboard from "./SysDashboard";

export default function SysMainPage() {
  const [isOpen, setIsOpen] = useState(false);


  //Controlling the content to display
  const [displayedContent, setDisplayedContent] = useState("Dashboard");
  const handleClose = () => setIsOpen(false);

  // How many notifications did the SysAdmin Receive
  const [notifsNumber, setNotifsNumber] = useState(0);



  useEffect(() => {
    //Checking the validity of the token starts
    // console.log("is the token is Cookies -> ", isTokenInCookies());
    // console.log("is the token Expired -> ", isTokenExpired());
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    }
    else {      //Checking the validity of the token ends
      const countNotifs = async () => {
        try {
          const data = await countNotifications("SysAdmin", Cookies.get("JWT"));
          console.log("Number of notifications is --> ", data);
          setNotifsNumber(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          countNotifs();
        }
      };

      // Initial fetch
      countNotifs();

      // Set up event listener for visibility change
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Clean up function to remove event listener when component unmounts
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, []);



  return (
    <>
      <div className="flex flex-col w-full h-auto">

        <div className="flex p-4 w-full justify-between">
          {/* Bars Icon That toogles the visibility of the menu */}
          <FaBars onClick={() => setIsOpen(true)} className='w-6 h-6 cursor-pointer text-neutral-600' />
          {
            displayedContent === "Dashboard" &&

            <div className="flex justify-between gap-6">
              {/* Notification Icon and Indicator */}
              <div className="relative flex items-center">
                <IoIosNotificationsOutline onClick={() => setDisplayedContent("Notifications")} className='w-6 h-6 cursor-pointer text-neutral-600' />
                {/* This part will be dealed with once we start getting data from our api */}
                {notifsNumber !== 0 &&
                  <div className="absolute top-0 right-0 -mr-[1px] -mt-[-1px] w-3 h-3 rounded-full bg-red-600 flex items-center justify-center">
                    <p className="text-white text-xs font-thin">{notifsNumber}</p>
                  </div>
                }
              </div>


              {/* Settings Icon */}
              <CiSettings className='w-6 h-6 cursor-pointer text-neutral-600' />
            </div>
          }
        </div>
        <div className='border-t border-gray-300 py-4'></div>
        {/* The Content to Display Based On The Clicked Menu Button*/}
        {displayedContent === "Dashboard" ?
          <SysDashboard /> :
          displayedContent === "Notifications" ?
            <SysNotifications /> :
            displayedContent === "ConsultantsList" ?
              <SysAllConsultants /> :
              displayedContent === "AddConsultant" ?
                <SysAddConsultant /> :
                displayedContent === "OrganismesList" ?
                  <SysAllOrganismes /> :
                  displayedContent === "AddOrganism" ?
                    <SysAddOrganism /> : null
        }
      </div>

      {/* The Navigation Menu */}
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header />
        <Drawer.Items>
          {/* Profile Image */}
          <div className='h-auto items-center justify-around flex flex-col cursor-pointer'>
            <img src={profile} className='w-14 h-14 rounded-full object-cover transition duration-300 hover:scale-110' alt="profile image" />
            {/* username */}
            <div className='py-2'>
              <h1 className='font-p_regular' >Sys Administrateur</h1>
            </div>
          </div>

          <Sidebar aria-label="Sidebar with multi-level dropdown example">
            <Sidebar.Items>
              <Sidebar.ItemGroup>

                <Sidebar.Item onClick={() => {
                  setDisplayedContent("Dashboard")
                  setIsOpen(false)
                }} href="#" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>

                <Sidebar.Item onClick={() => {
                  setDisplayedContent("Notifications")
                  setIsOpen(false)
                }} href="#" icon={IoMdNotificationsOutline} label={notifsNumber}>
                  Boite
                </Sidebar.Item>

                <Sidebar.Collapse icon={FaUsersLine} label="Consultants SMQ">

                  <Sidebar.Item onClick={() => {
                    setDisplayedContent("ConsultantsList")
                    setIsOpen(false)
                  }} icon={CiBoxList} href="#">Liste des Consultants SMQ
                  </Sidebar.Item>

                </Sidebar.Collapse>

                <Sidebar.Collapse icon={GoOrganization} label="Orga. de Cerification">

                  <Sidebar.Item onClick={() => {
                    setDisplayedContent("OrganismesList")
                    setIsOpen(false)
                  }} icon={CiBoxList} href="#">Liste des Organismes
                  </Sidebar.Item>

                </Sidebar.Collapse>

                <Sidebar.Item onClick={() => handleLogout()} href="#" icon={FaSignOutAlt}>
                  Déconnexion
                </Sidebar.Item>

              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>

        </Drawer.Items>
      </Drawer>
    </>
  );
}
