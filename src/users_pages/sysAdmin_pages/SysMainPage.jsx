import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Drawer, Sidebar } from "flowbite-react";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { FaUsersLine } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GoOrganization } from "react-icons/go";
import profile from '../../assets/profile.jpg';
import { jwtDecode } from "jwt-decode";
// Method that counts all notifications
import { countNotifications } from "../CommonApiCalls";
import { serverAddress } from "../../ServerAddress";
//From common Api Calls
import { isTokenExpired, isTokenInCookies, handleLogout } from "../CommonApiCalls";

export default function SysMainPage({ onClose }) {

  const navigate = useNavigate();

  const decoded = jwtDecode(Cookies.get("JWT"));
  //then Ill extact the id to send
  const userID = decoded.id;

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
      const response = await fetch(`http://${serverAddress}:8080/api/v1/users/image-path?userId=${userID}`, {
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
            <img src={`http://${serverAddress}:8080/api/v1/images/${profileImage}`} className='w-14 h-14 rounded-full object-cover transition duration-300 hover:scale-110' alt="profile image" />
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

                  <Sidebar.Item onClick={() => {
                  }} icon={CiSettings} href="/SysAllNorms">Normes
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

                <Sidebar.Item className='cursor-pointer' onClick={() => handleLogout()} icon={FaSignOutAlt}>
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
