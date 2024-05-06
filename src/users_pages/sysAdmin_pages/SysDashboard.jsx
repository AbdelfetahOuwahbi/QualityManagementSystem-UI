import {Card, Table} from "flowbite-react";
import {FaBuilding, FaRegHandshake, FaUsers, FaUserTie} from 'react-icons/fa';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  legend: {
    display: true
  },
  responsive: true,
  maintainAspectRatio: false
};


export default function SysDashboard() {
  const [organismes, setOrganismes] = useState([]);
  const [totalOrganismes, setTotalOrganismes] = useState(0);
  const [totalConsultants, setTotalConsultants] = useState(0);
  const [totalEntreprises, setTotalEntreprises] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);  // State for user count


  useEffect(() => {
    const urlOrganismes = 'http://localhost:8080/api/v1/organismes';
    const urlUsersCount = 'http://localhost:8080/api/v1/users/count';
    fetch(urlOrganismes, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get("JWT")}`,
        'Content-Type': 'application/json'
      }
    })
        .then(response => response.json())
        .then(data => {
          setOrganismes(data);
          setTotalOrganismes(data.length);
          let consultantsCount = 0;
          let entreprisesCount = 0;
          data.forEach(organisme => {
            organisme.consultants.forEach(consultant => {
              consultantsCount++;
              entreprisesCount += consultant.entreprises.length;
            });
          });
          setTotalConsultants(consultantsCount);
          setTotalEntreprises(entreprisesCount);
        })
        .catch(error => console.error('Error fetching organismes data:', error));

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

  //

  const cardData = [
    {
      title: "Total Users",
      content: totalUsers,
      icon: <FaUsers className="text-3xl text-white"/>,
      color: "bg-purple-500",
      change: "+5.0% vs last 90 days"
    },
    {
      title: "Total Consultants",
      content: totalConsultants,
      icon: <FaUserTie className="text-3xl text-white"/>,
      color: "bg-green-500",
      change: "+10.2% vs last 90 days"
    },
    {
      title: "Total Companies",
      content: totalEntreprises,
      icon: <FaBuilding className="text-3xl text-white"/>,
      color: "bg-blue-500",
      change: "+7.4% vs last 90 days"
    },
    {
      title: "Total Organizations",
      content: totalOrganismes,
      icon: <FaRegHandshake className="text-3xl text-white"/>,
      color: "bg-yellow-500",
      change: "+3.1% vs last 90 days"
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
                  <Table striped={false} hoverable={true}>
                    <Table.Head>
                      <Table.HeadCell>Organisme</Table.HeadCell>
                      <Table.HeadCell>Consultant</Table.HeadCell>
                      <Table.HeadCell>Entreprise</Table.HeadCell>
                      <Table.HeadCell>Contact</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {organismes.map(organisme => organisme.consultants.map(consultant => {
                        // Handle cases where a consultant might not have any enterprises
                        if (consultant.entreprises.length === 0) {
                          return (
                              <Table.Row key={consultant.id}>
                                <Table.Cell>{organisme.raisonSocial}</Table.Cell>
                                <Table.Cell>{consultant.firstname + " " + consultant.lastname}</Table.Cell>
                                <Table.Cell>No enterprises</Table.Cell>
                                <Table.Cell>No contacts</Table.Cell>
                              </Table.Row>
                          );
                        }
                        return consultant.entreprises.map(entreprise => {
                          // Display all contacts associated with each enterprise
                          const contactEmails = entreprise.contacts.map(contact => contact.email).join(", ");
                          return (
                              <Table.Row key={entreprise.id}>
                                <Table.Cell>{organisme.raisonSocial}</Table.Cell>
                                <Table.Cell>{consultant.firstname + " " + consultant.lastname}</Table.Cell>
                                <Table.Cell>{entreprise.raisonSocial}</Table.Cell>
                                <Table.Cell>{contactEmails || "No contacts"}</Table.Cell>
                              </Table.Row>
                          );
                        });
                      }))}
                    </Table.Body>
                  </Table>
                </div>
              </div>

            </div>
          </div>
  );
}
