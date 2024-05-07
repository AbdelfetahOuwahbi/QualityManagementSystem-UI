import { Card, Table } from "flowbite-react";
import { FaBuilding, FaRegHandshake, FaUsers, FaUserTie } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample data for the chart
const barData = {
  labels: ['Data Point 1', 'Data Point 2', 'Data Point 3', 'Data Point 4'],
  datasets: [{
    label: 'Demo Data',
    data: [65, 59, 80, 81],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)'
    ],
    borderWidth: 1
  }]
};

const barOptions = {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      display: true
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

export default function SysDashboard() {
  const [consultants, setConsultants] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);  // State for user count

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
      icon: <FaUsers className="text-3xl text-white"/>,
      color: "bg-purple-500",
      change: "+5.0% vs last 90 days"
    },{
      title: "Total Consultants",
      content: consultants.length,
      icon: <FaUserTie className="text-3xl text-white"/>,
      color: "bg-green-500"
    },
    {
      title: "Total Organisations",
      content: getTotal('organismeDeCertification'),
      icon: <FaBuilding className="text-3xl text-white"/>,
      color: "bg-blue-500"
    },
    {
      title: "Total Enterprises",
      content: getTotal('entreprises'),
      icon: <FaRegHandshake className="text-3xl text-white"/>,
      color: "bg-yellow-500"
    }
  ];

  return (
      console.log(totalUsers),
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
              <div className="md:w-9/12">
                <div className="bg-gray-200 p-4">
                  <Bar data={barData} options={barOptions}/>
                </div>
              </div>
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
  );
}
