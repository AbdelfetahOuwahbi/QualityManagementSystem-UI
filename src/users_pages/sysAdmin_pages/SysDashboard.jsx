import React, { useState, useEffect } from 'react'
import { Card, Table } from "flowbite-react";
import { FaBuilding, FaRegHandshake, FaUsers, FaUserTie } from 'react-icons/fa';
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { isTokenExpired, isTokenInCookies, countNotifications } from '../CommonApiCalls';
import Cookies from 'js-cookie'
import SysMainPage from './SysMainPage';

export default function SysDashboard() {
  const [consultants, setConsultants] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);  // State for user count

  // How many notifications did the SysAdmin Receive
  const [notifsNumber, setNotifsNumber] = useState(0);
  const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);


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
        setConsultants(data);
        const consultantsCount = data.length;
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
        setTotalUsers(data.count);  // Assuming the response format has a count property
      })
      .catch(error => console.error('Error fetching user count:', error));
  }, []);

  const getTotal = (key) => {
    if (!consultants) return 0;
    // Si la clé est 'organismeDeCertification', traiter différemment pour obtenir des ID uniques
    if (key === 'organismeDeCertification') {
      const uniqueIds = new Set(consultants.map(consultant => consultant[key]?.id).filter(id => id !== undefined));
      return uniqueIds.size;
    }
    // Comportement précédent pour les autres clés
    return consultants.reduce((acc, consultant) => acc + (consultant[key]?.length || 0), 0);
  };

  //

  const cardData = [
    {
      title: "Total Users",
      content: totalUsers,
      icon: <FaUsers className="text-3xl text-white" />,
      color: "bg-purple-500",
      change: "+5.0% vs last 90 days"
    }, {
      title: "Total Consultants",
      content: consultants.length,
      icon: <FaUserTie className="text-3xl text-white" />,
      color: "bg-green-500"
    },
    {
      title: "Total Organisations",
      content: getTotal('organismeDeCertification'),
      icon: <FaBuilding className="text-3xl text-white" />,
      color: "bg-blue-500"
    },
    {
      title: "Total Enterprises",
      content: getTotal('entreprises'),
      icon: <FaRegHandshake className="text-3xl text-white" />,
      color: "bg-yellow-500"
    }
  ];

  return (
    <>
      <div className="flex flex-col w-full h-auto">

        <div className="flex p-4 w-full justify-between">
          {/* Bars Icon That toogles the visibility of the menu */}
          <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />

          <div className="flex justify-between gap-6">
            {/* Notification Icon and Indicator */}
            <div className="relative flex items-center">
              <IoIosNotificationsOutline onClick={() => window.location.href = '/SysNotifications'} className='w-6 h-6 cursor-pointer text-neutral-600' />
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

        </div>
        <div className='border-t border-gray-300 py-4'></div>
      </div>


      <div className="px-4 py-2">
        <div className="flex flex-wrap justify-between">
          {cardData.map((card, index) => (
            <Card key={index}
              className={`${card.color} text-white shadow-lg transition-shadow duration-300 p-4 mb-4 md:w-1/4`}>
              <div>
                <h5 className="text-xl font-bold">{card.title}</h5>
                <p className="text-2xl font-bold">{card.content}</p>
                <p className="text-sm opacity-75">{card.change}</p>
                <div>{card.icon}</div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex flex-col md:flex-row space-x-4">
          <div className="md:w-1/2 md:ml-auto">
            <div className="overflow-auto">
              <Table striped={true} hoverable={true}>
                <Table.Head>
                  <Table.HeadCell>Entreprise</Table.HeadCell>
                  <Table.HeadCell>Consultant</Table.HeadCell>
                  <Table.HeadCell>Organisme</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {consultants.map(consultant => (
                    consultant.entreprises.map((entreprise, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{entreprise.raisonSocial}</Table.Cell>
                        <Table.Cell>{consultant.firstname + " " + consultant.lastname}</Table.Cell>
                        <Table.Cell>{consultant.organismeDeCertification.raisonSocial}</Table.Cell>
                      </Table.Row>
                    ))
                  ))}
                </Table.Body>
              </Table>

            </div>
          </div>

        </div>
      </div>
      {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />}
    </>
  );
}