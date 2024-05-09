import React, { useState, useEffect } from 'react'
import { Card, Table, Popover, Label, TextInput, Button, FloatingLabel } from "flowbite-react";
import { FaBuilding, FaRegHandshake, FaUsers, FaUserTie } from 'react-icons/fa';
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { isTokenExpired, isTokenInCookies, countNotifications, changePassword } from '../CommonApiCalls';
import Cookies from 'js-cookie'
import SysMainPage from './SysMainPage';
import toast, { Toaster } from 'react-hot-toast';

export default function SysDashboard() {
  const [consultants, setConsultants] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);  // State for user count
  const [totalConsultants, setTotalConsultants] = useState(0);  // State for Consultant count

  // How many notifications did the SysAdmin Receive
  const [notifsNumber, setNotifsNumber] = useState(0);
  const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);
  //Settings Popover State
  const [open, setOpen] = useState(false);

  //Change password properties
  const [changedPasswordProperties, setChangedPasswordProperties] = useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  })


  //Counting all notifs when the Dashboard Page loads
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


  useEffect(() => {
    const urlConsultants = 'http://localhost:8080/api/v1/users/consultants';
    const urlUsersCount = 'http://localhost:8080/api/v1/users/count';

    fetch(urlConsultants, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get("JWT")}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("consultants are -->", data)
        setConsultants(data);
        const consultantsCount = data.length;
        console.log("number of consultants is -->", consultantsCount)
        setTotalConsultants(consultantsCount);
      })
      .catch(error => console.error('Error fetching consultants data:', error));

    // Fetch for users count
    fetch(urlUsersCount, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get("JWT")}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("number of users is -->", data)
        setTotalUsers(data);
      })
      .catch(error => console.error('Error fetching user count:', error));
  }, []);

  const countUniqueOrganismes = (organisationType, data) => {
    const uniqueOrganisation = new Set();
    if (organisationType === "Organism") {
      data.forEach((consultant) => {
        if (consultant.organismeDeCertification) {
          uniqueOrganisation.add(consultant.organismeDeCertification.id);
        }
      });
    } else {
      data.forEach((consultant) => {
        if (consultant.entreprises.id) {
          uniqueOrganisation.add(consultant.entreprises.id);
        }
      });
    }
    console.log('Total unique organisations:', uniqueOrganisation.size);
    return uniqueOrganisation.size;
  };

  //Function that Changes the Password for SysAdmin
  async function changePasswordForSysAdmin(currentPassword, newPassword, confirmationPassword) {
    if (newPassword === confirmationPassword) {
      try {
        const response = await changePassword(currentPassword, newPassword, confirmationPassword);
        if (response.ok) {
          console.log("Password changes successfully for SysAdmin");
          toast.success("Votre mot de passe a été changé avec succès ..");
        } else {
          toast.error("Une erreur s'est produite, ressayer plus tard !!")
        }
      } catch (error) {
        console.error("Error changing password for SysAdmin:", error);
      }
    } else {
      toast.error("Le nouveau mot de passe et sa confirmation ne sont pas identiques !!")
    }
  }


  const cardData = [
    {
      title: "Total Users",
      content: totalUsers,
      icon: <FaUsers className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      change: "+5.0% vs last 90 days"
    }, {
      title: "Total Consultants",
      content: consultants.length,
      icon: <FaUserTie className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
    },
    {
      title: "Total Organisations",
      content: countUniqueOrganismes("Organism", consultants),
      icon: <FaBuilding className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
    },
    {
      title: "Total Enterprises",
      content: "",
      icon: <FaRegHandshake className="text-3xl text-white" />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500"
    }
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col w-full h-auto">

        <div className="flex p-4 w-full items-center justify-between">
          {/* Bars Icon That toogles the visibility of the menu */}
          <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />

          <div className="flex justify-between gap-6">
            {/* Notification Icon and Indicator */}
            <div className="relative flex items-center">
              <IoIosNotificationsOutline onClick={() => window.location.href = '/SysNotifications'} className='w-6 h-6 cursor-pointer text-neutral-600' />
              {/* This part will be dealed with once we start getting data from our api */}
              {notifsNumber !== 0 &&
                <div className="absolute top-0 right-0 -mr-[1px] -mt-[-12px] w-3 h-3 rounded-full bg-red-600 flex items-center justify-center">
                  <p className="text-white text-xs font-thin">{notifsNumber}</p>
                </div>
              }
            </div>

            <Popover
              aria-labelledby="area-popover"
              open={open}
              onOpenChange={setOpen}
              content={
                <div className="flex w-64 flex-col gap-4 p-4 text-sm text-gray-500 dark:text-gray-400">
                  <h2 id="area-popover" className="font-p_regular text-gray-800 pb-4">vous voulez changer votre mot de passe ?</h2>

                  <FloatingLabel variant="outlined" type='password' label="Mot de passe existant"
                    onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, currentPassword: e.target.value })}
                  />

                  <FloatingLabel variant="outlined" type='password' label="Nouveau Mot de passe"
                    onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, newPassword: e.target.value })}
                  />

                  <FloatingLabel variant="outlined" type='password' label="Confirmation"
                    onChange={(e) => setChangedPasswordProperties({ ...changedPasswordProperties, confirmationPassword: e.target.value })}
                  />

                  <div className="flex gap-2">
                    <Button className='bg-sky-500'
                      onClick={() => {
                        changePasswordForSysAdmin(changedPasswordProperties.currentPassword,
                          changedPasswordProperties.newPassword,
                          changedPasswordProperties.confirmationPassword
                        )
                        setOpen(false)
                      }}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              }
            >
              {/* Settings Icon */}
              <Button>
                Settings <CiSettings className='w-6 h-6 ml-2 cursor-pointer text-neutral-100' />
              </Button>
            </Popover>

          </div>

        </div>
        <div className='border-t border-gray-300 py-4'></div>

        <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
          <h1 className='text-4xl font-p_bold'>Dashboard</h1>
        </div>
        <div className='border-t border-gray-300 w-96 mb-10'></div>

      </div>


      <div className="px-4 py-2">
        <div className="flex flex-wrap justify-between">
          {cardData.map((card, index) => (
            <Card key={index}
              className={`${card.color} flex text-white shadow-lg duration-300  flex-col mb-4 md:flex-row w-full md:w-1/2`}>
              <div>
                <h5 className="text-xl font-p_bold">{card.title}</h5>
                <p className="text-2xl font-p_semi_bold">{card.content}</p>
                <p className="text-sm font-p_extra_light opacity-75">{card.change}</p>
                <div className='w-6 h-6'>{card.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />}
    </>
  );
}