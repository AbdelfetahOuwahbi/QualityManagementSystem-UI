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

export default function SysMainPage({onClose}) {
  const [isOpen, setIsOpen] = useState(true);

  // How many notifications did the SysAdmin Receive
  const [notifsNumber, setNotifsNumber] = useState(0);

  useEffect(() => {
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
      {/* The Navigation Menu */}
      <Drawer open={isOpen} onClose={onClose}>
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
                }} href="/SysDashboard" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>

                <Sidebar.Item onClick={() => {
                }} href="/SysNotifications" icon={IoMdNotificationsOutline} label={notifsNumber}>
                  Boite
                </Sidebar.Item>

                <Sidebar.Collapse icon={FaUsersLine} label="Consultants SMQ">

                  <Sidebar.Item onClick={() => {
                  }} icon={CiBoxList} href="/SysAllConsultants">Liste des Consultants SMQ
                  </Sidebar.Item>

                </Sidebar.Collapse>

                <Sidebar.Collapse icon={GoOrganization} label="Orga. de Cerification">

                  <Sidebar.Item onClick={() => {
                  }} icon={CiBoxList} href="/SysAllOrganismes">Liste des Organismes
                  </Sidebar.Item>

                </Sidebar.Collapse>

                <Sidebar.Item onClick={() => handleLogout()} icon={FaSignOutAlt}>
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
