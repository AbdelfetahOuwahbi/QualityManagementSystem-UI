import React, { useEffect, useState } from "react";
import { MdOutlineDomainAdd, MdAdd } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, FloatingLabel, Modal } from "flowbite-react";
import { FaBars, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getAllEntreprises, isTokenExpired, isTokenInCookies } from "../../CommonApiCalls";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import { appUrl } from "../../../Url.jsx";
import { motion } from "framer-motion";
import ClientMainPage from '../ClientMainPage';
import AddEntreprise from "./AddEntreprise";



export default function AllEntreprises() {

  const decoded = jwtDecode(Cookies.get("JWT"));
  const userID = decoded.id;
  const [consultantLevel, setConsultantLevel] = useState("");

  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  const [addEntrepriseVisible, setAddEntrepriseVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ entrepriseId: null, value: false });

  const [id, setId] = useState([]);
  const [category, setCategory] = useState([]);
  const [raisonSociale, setRaisonSociale] = useState([]);
  const [secteur, setSecteur] = useState([]);
  const [pays, setPays] = useState([]);
  const [ville, setVille] = useState([]);
  const [email, setEmail] = useState([]);
  const [phone, setPhone] = useState([]);
  const [registreDeCommerce, setRegistreDeCommerce] = useState([]);
  const [identifiantFiscale, setIdentifiantFiscale] = useState([]);
  const [patente, setPatente] = useState([]);
  const [cnss, setCnss] = useState([]);
  const [contacts, setContacts] = useState({}); // To store contacts of each entreprise

  const [expandedRows, setExpandedRows] = useState([]); // To track expanded rows

  // Search states for each field
  const [searchCategory, setSearchCategory] = useState('');
  const [searchRaisonSociale, setSearchRaisonSociale] = useState('');
  const [searchSecteur, setSearchSecteur] = useState('');
  const [searchPays, setSearchPays] = useState('');
  const [searchVille, setSearchVille] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchRegistreDeCommerce, setSearchRegistreDeCommerce] = useState('');
  const [searchIdentifiantFiscale, setSearchIdentifiantFiscale] = useState('');
  const [searchPatente, setSearchPatente] = useState('');
  const [searchCnss, setSearchCnss] = useState('');

  const [selectedField, setSelectedField] = useState('category'); // Default selected field
  // Ajout d'un état pour l'index de modification
  const [editingIndex, setEditingIndex] = useState(-1);
  const [originalData, setOriginalData] = useState({});

  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: ''
  });
  const [newContactEntrepriseId, setNewContactEntrepriseId] = useState(null);

  const [editingContactIndex, setEditingContactIndex] = useState(-1);
  const [originalContactData, setOriginalContactData] = useState({});


  // Fonction pour gérer le clic sur modifier
  const handleEditClick = (index) => {
    setOriginalData({
      category: category[index],
      raisonSociale: raisonSociale[index],
      secteur: secteur[index],
      pays: pays[index],
      ville: ville[index],
      email: email[index],
      phone: phone[index],
      registreDeCommerce: registreDeCommerce[index],
      identifiantFiscale: identifiantFiscale[index],
      patente: patente[index],
      cnss: cnss[index]
    });
    setEditingIndex(index);
  };

  // Fonction pour annuler la modification
  const handleCancelClick = () => {
    if (editingIndex !== -1) {
      // Utiliser les valeurs de originalData pour restaurer les données
      setCategory(prev => [...prev.slice(0, editingIndex), originalData.category, ...prev.slice(editingIndex + 1)]);
      setRaisonSociale(prev => [...prev.slice(0, editingIndex), originalData.raisonSociale, ...prev.slice(editingIndex + 1)]);
      setSecteur(prev => [...prev.slice(0, editingIndex), originalData.secteur, ...prev.slice(editingIndex + 1)]);
      setPays(prev => [...prev.slice(0, editingIndex), originalData.pays, ...prev.slice(editingIndex + 1)]);
      setVille(prev => [...prev.slice(0, editingIndex), originalData.ville, ...prev.slice(editingIndex + 1)]);
      setEmail(prev => [...prev.slice(0, editingIndex), originalData.email, ...prev.slice(editingIndex + 1)]);
      setPhone(prev => [...prev.slice(0, editingIndex), originalData.phone, ...prev.slice(editingIndex + 1)]);
      setRegistreDeCommerce(prev => [...prev.slice(0, editingIndex), originalData.registreDeCommerce, ...prev.slice(editingIndex + 1)]);
      setIdentifiantFiscale(prev => [...prev.slice(0, editingIndex), originalData.identifiantFiscale, ...prev.slice(editingIndex + 1)]);
      setPatente(prev => [...prev.slice(0, editingIndex), originalData.patente, ...prev.slice(editingIndex + 1)]);
      setCnss(prev => [...prev.slice(0, editingIndex), originalData.cnss, ...prev.slice(editingIndex + 1)]);
      setEditingIndex(-1); // Réinitialiser l'index d'édition
    }
  };

  // Function to handle field selection change
  const handleFieldChange = (field) => {
    setSelectedField(field);
  };

  //Function that gets all organismes
  const getAllConsultantManagedEntreprises = async () => {
    setId([]);
    setCategory([]);
    setRaisonSociale([]);
    setSecteur([]);
    setPays([]);
    setVille([]);
    setEmail([]);
    setPhone([]);
    setRegistreDeCommerce([]);
    setIdentifiantFiscale([]);
    setPatente([]);
    setCnss([]);
    setContacts({}); // Reset contacts
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const data = await getAllEntreprises(userID, "ManagedEntreprises");
        if (data.length > 0) {
          toast((t) => (
              <span>
              la liste est à jour ...
            </span>
          ));
          console.log("Consultant Managed Entreprises -->", data);
          for (let i = 0; i < data.length; i++) {
            setId((prev) => [...prev, data[i].id]);
            setCategory((prev) => [...prev, data[i].categorie]);
            setVille((prev) => [...prev, data[i].ville]);
            setPhone((prev) => [...prev, data[i].telephone]);
            setSecteur((prev) => [...prev, data[i].secteur]);
            setRaisonSociale((prev) => [...prev, data[i].raisonSocial]);
            setRegistreDeCommerce((prev) => [...prev, data[i].registreDeCommerce]);
            setPays((prev) => [...prev, data[i].pays]);
            setPatente((prev) => [...prev, data[i].patente]);
            setIdentifiantFiscale((prev) => [...prev, data[i].identifiantFiscal]);
            setEmail((prev) => [...prev, data[i].email]);
            setCnss((prev) => [...prev, data[i].cnss]);
            setContacts((prev) => ({ ...prev, [data[i].id]: data[i].contacts }));
          }
        }
      } catch (error) {
        console.error(error); // Handle errors
        toast.error('Une erreur s\'est produite lors du creation de cet organism.');
      }
    }
  };

  useEffect(() => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      if (id.length === 0) {
        getAllConsultantManagedEntreprises();
      } else {
        console.log("Already got all consultant managed entreprises ...");
      }
      fetchConsultantLevel();
    }
  }, []);

  const fetchConsultantLevel = async () => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`${appUrl}/users/consultants/level?id=${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch consultant level');
        }

        const data = await response.json();
        setConsultantLevel(data);
        console.log('Level:', data);
      } catch (error) {
        console.error('Error fetching consultant level:', error);
      }
    }
  };

  // Function to export table data as Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const tableClone = document.getElementById("entrepriseTable").cloneNode(true);
    const rows = tableClone.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].lastChild.remove();
    }

    // Ajouter les contacts à chaque ligne de l'entreprise
    const newRows = [];
    for (let i = 1; i < rows.length; i++) {
      const entrepriseRow = rows[i].cloneNode(true);
      const entrepriseId = id[i - 1]; // Obtenir l'ID de l'entreprise à partir de l'index

      if (contacts[entrepriseId]) {
        contacts[entrepriseId].forEach(contact => {
          const contactRow = entrepriseRow.cloneNode(true);
          contactRow.insertCell(-1).innerText = contact.lastname;
          contactRow.insertCell(-1).innerText = contact.firstname;
          newRows.push(contactRow);
        });
      } else {
        newRows.push(entrepriseRow);
      }
    }

    newRows.forEach(row => tableClone.appendChild(row));
    const ws = XLSX.utils.table_to_sheet(tableClone);
    XLSX.utils.book_append_sheet(wb, ws, "Entreprises clientes");
    XLSX.writeFile(wb, "Entreprises clientes.xlsx");
  };

  const renderSearchInput = () => {
    switch (selectedField) {
      case 'category':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher categorie"
                      onChange={(e) => setSearchCategory(e.target.value)} disabled={editingIndex !== -1} />;
      case 'raisonSociale':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher raison sociale"
                      onChange={(e) => setSearchRaisonSociale(e.target.value)} disabled={editingIndex !== -1} />;
      case 'secteur':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher secteur"
                      onChange={(e) => setSearchSecteur(e.target.value)} disabled={editingIndex !== -1} />;
      case 'pays':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher pays"
                      onChange={(e) => setSearchPays(e.target.value)} disabled={editingIndex !== -1} />;
      case 'ville':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher ville"
                      onChange={(e) => setSearchVille(e.target.value)} disabled={editingIndex !== -1} />;
      case 'email':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher email"
                      onChange={(e) => setSearchEmail(e.target.value)} disabled={editingIndex !== -1} />;
      case 'phone':
        return <input type="number"
                      className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher téléphone"
                      onChange={(e) => setSearchPhone(e.target.value)} disabled={editingIndex !== -1} />;
      case 'registreDeCommerce':
        return <input type="number"
                      className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher registre de commerce"
                      onChange={(e) => setSearchRegistreDeCommerce(e.target.value)}
                      disabled={editingIndex !== -1} />;
      case 'identifiantFiscale':
        return <input type="number"
                      className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher identifiant fiscal"
                      onChange={(e) => setSearchIdentifiantFiscale(e.target.value)}
                      disabled={editingIndex !== -1} />;
      case 'patente':
        return <input type="number"
                      className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher patente"
                      onChange={(e) => setSearchPatente(e.target.value)} disabled={editingIndex !== -1} />;
      case 'cnss':
        return <input type="number"
                      className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
                      placeholder="Rechercher cnss"
                      onChange={(e) => setSearchCnss(e.target.value)} disabled={editingIndex !== -1} />;
      default:
        return null;
    }
  };

  //Function that deletes the user
  async function deleteEntreprise(entrepriseId) {
    // console.log("organism to be deleted is -->", entrepriseId)
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const response = await fetch(`${appUrl}/consulantSMQ/entreprises/${entrepriseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          // getAllOrganimes();
          console.log("entreprise deleted successfully ..");
          toast.success("Cet entreprise est éliminé de l'application")
          window.location.reload();
        } else {
          toast.error(response.statusText)
          throw new Error(`Failed to delete entreprise: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting entreprise:', error);
        // Handle error
        throw error; // Optionally re-throw the error for the caller to handle
      }
    }
  }

  //Function that updates and organism
  const updateEntreprise = async (index) => {
    setEditingIndex(-1)
    // Checking the validity of the token
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`${appUrl}/consulantSMQ/entreprises/${id[index]}?consulantSMQId=${userID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify({
            "categorie": category[index],
            "pays": pays[index],
            "secteur": secteur[index],
            "ville": ville[index],
            "telephone": phone[index],
            "email": email[index],
            "patente": patente[index],
            "cnss": cnss[index],
            "identifiantFiscal": identifiantFiscale[index],
            "registreDeCommerce": registreDeCommerce[index],
            "raisonSocial": raisonSociale[index]
          }),
        });
        console.log(response);
        const responseBody = await response.json();
        console.log(responseBody);
        // Comparer les données modifiées avec les données originales
        const isDataChanged =
            category[index] !== originalData.category ||
            pays[index] !== originalData.pays ||
            secteur[index] !== originalData.secteur ||
            ville[index] !== originalData.ville ||
            phone[index] !== originalData.phone ||
            email[index] !== originalData.email ||
            patente[index] !== originalData.patente ||
            cnss[index] !== originalData.cnss ||
            identifiantFiscale[index] !== originalData.identifiantFiscale ||
            registreDeCommerce[index] !== originalData.registreDeCommerce ||
            raisonSociale[index] !== originalData.raisonSociale;
        if (response?.status === 200 || response?.status === 201) {
          if (isDataChanged) {
            toast.success("Cet Entreprise est modifié avec succès..");
          } else {
            toast.error("Aucune modification n'a été effectuée.");
          }
        } else if (responseBody.errorCode == "VALIDATION_ERROR") {
          // Diviser les messages d'erreur s'ils sont séparés par des virgules
          const errorMessages = responseBody.message.split(',');
          errorMessages.forEach(message => {
            toast.error(message.trim()); // Afficher chaque message d'erreur dans un toast séparé
          });
        } else if (responseBody.errorCode == "User_email_already_exists") {
          toast.error("L'email que vous avez entré est déjà utilisé!!");
        } else {
          toast.error("Une erreur s'est produite lors de la modification de cet entreprise.");
        }
      } catch (error) {
        console.error(error); // Handle errors
        toast.error("Une erreur s'est produite lors de la modification de cet entreprise.");
      }
    }
  };

  const handleRowClick = (index) => {
    const currentExpandedRows = [...expandedRows];
    const isRowExpanded = currentExpandedRows.includes(index);

    if (isRowExpanded) {
      const rowIndex = currentExpandedRows.indexOf(index);
      currentExpandedRows.splice(rowIndex, 1);
    } else {
      currentExpandedRows.push(index);
    }

    setExpandedRows(currentExpandedRows);
  };

  const handleEditContactClick = (index, contact) => {
    setOriginalContactData(contact);
    setEditingContactIndex(index);
  };

  const handleCancelEditContactClick = () => {
    if (editingContactIndex !== -1) {
      setEditingContactIndex(-1);
      const updatedContacts = [...contacts];
      updatedContacts[editingIndex] = originalContactData;
      setContacts(updatedContacts);
    }
  };

  const handleSaveContactClick = async (index, entrepriseId) => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const contact = contacts[entrepriseId][index];

        // Créer un nouvel objet avec uniquement les champs souhaités
        const contactToSave = {
          firstname: contact.firstname,
          lastname: contact.lastname,
          phone: contact.phone,
          email: contact.email
        };

        const response = await fetch(`${appUrl}/entreprise/contacts/${contact.id}?entrepriseId=${entrepriseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify(contactToSave),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save contact');
        }

        const savedContact = await response.json();

        setContacts((prevContacts) => {
          const updatedContacts = {...prevContacts};
          updatedContacts[entrepriseId][index] = savedContact;
          return updatedContacts;
        });

        toast.success("Contact saved successfully");
      } catch (error) {
        console.error(error); // Handle errors
        toast.error(error.message || "Une erreur s'est produite lors de la modification de ce contact.");
      }

      setEditingContactIndex(-1);
    }
  };

  const handleDeleteContactClick = async (index, entrepriseId) => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const contact = contacts[entrepriseId][index];
        const response = await fetch(`${appUrl}/entreprise/contacts/${contact.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete contact');
        }

        // Mise à jour de l'état après la suppression réussie
        setContacts((prevContacts) => {
          const updatedContacts = { ...prevContacts };
          updatedContacts[entrepriseId] = updatedContacts[entrepriseId].filter((_, i) => i !== index);
          return updatedContacts;
        });

        toast.success("Contact supprimé avec succès");
      } catch (error) {
        console.error(error); // Gérer les erreurs
        toast.error(error.message || "Une erreur s'est produite lors de la suppression de ce contact.");
      }
    }
  };

  const handleOpenAddContactModal = (entrepriseId) => {
    setNewContactEntrepriseId(entrepriseId);
    setAddContactModalVisible(true);
  };

  const handleCloseAddContactModal = () => {
    setNewContact({
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    });
    setAddContactModalVisible(false);
  };

  const handleSaveNewContact = async () => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`${appUrl}/entreprise/contacts?entrepriseId=${newContactEntrepriseId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify(newContact),
        });

        if (!response.ok) {
            const errorData = await response.json();
             if (errorData.errorCode == "VALIDATION_ERROR") {
                // Diviser les messages d'erreur s'ils sont séparés par des virgules
                const errorMessages = errorData.message.split(',');
                errorMessages.forEach(message => {
                  toast.error(message.trim()); // Afficher chaque message d'erreur dans un toast séparé
                });
              }
        }else{
          const savedContact = await response.json();

          setContacts((prevContacts) => {
            const updatedContacts = {...prevContacts};
            updatedContacts[newContactEntrepriseId] = [...updatedContacts[newContactEntrepriseId], savedContact];
            return updatedContacts;
          });

          toast.success("Contact added successfully");
          handleCloseAddContactModal();
        }


      } catch (error) {
        console.error(error); // Handle errors
        toast.error(error.message || "Une erreur s'est produite lors de l'ajout de ce contact.");
      }
    }
  };

  const renderContactCards = (index) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-gray-100"
        >
          <button
              onClick={() => handleOpenAddContactModal(id[index])}
              className="absolute top-0 left-0 text-blue-500 hover:text-blue-700 m-2"
          >
            <MdAdd size={24} />
          </button>
          {contacts[id[index]] ? (
              contacts[id[index]].map((contact, idx) => {
                const isEditing = editingContactIndex === idx;
                return (
                    <div
                        key={idx}
                        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                    >
                      {isEditing ? (
                          <>
                            <input
                                className="w-auto mb-2 p-2 border rounded"
                                onChange={(e) => {
                                  const updatedContacts = { ...contacts };
                                  updatedContacts[id[index]][idx].firstname = e.target.value;
                                  setContacts(updatedContacts);
                                }}
                                value={contact.firstname}
                            />
                            <input
                                className="w-auto mb-2 p-2 border rounded"
                                onChange={(e) => {
                                  const updatedContacts = { ...contacts };
                                  updatedContacts[id[index]][idx].lastname = e.target.value;
                                  setContacts(updatedContacts);
                                }}
                                value={contact.lastname}
                            />
                            <input
                                className="w-auto mb-2 p-2 border rounded"
                                onChange={(e) => {
                                  const updatedContacts = { ...contacts };
                                  updatedContacts[id[index]][idx].email = e.target.value;
                                  setContacts(updatedContacts);
                                }}
                                value={contact.email}
                            />
                            <input
                                className="w-auto mb-2 p-2 border rounded"
                                onChange={(e) => {
                                  const updatedContacts = { ...contacts };
                                  updatedContacts[id[index]][idx].phone = e.target.value;
                                  setContacts(updatedContacts);
                                }}
                                value={contact.phone}
                            />
                            <div className="flex mt-2">
                              <button
                                  onClick={() => handleSaveContactClick(idx, id[index])}
                                  className="text-green-500 hover:text-green-700"
                              >
                                <FaSave />
                              </button>
                              <button
                                  onClick={handleCancelEditContactClick}
                                  className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </>
                      ) : (
                          <>
                            <div className="text-lg font-bold">
                              {contact.firstname} {contact.lastname}
                            </div>
                            <div className="text-gray-500">{contact.email}</div>
                            <div className="text-gray-500">{contact.phone}</div>
                            <div className="flex mt-2">
                              <button
                                  onClick={() => handleEditContactClick(idx, contact)}
                                  className="text-blue-500 hover:text-blue-700"
                              >
                                <FaEdit />
                              </button>
                              <button
                                  onClick={() => handleDeleteContactClick(idx, id[index])}
                                  className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </>
                      )}
                    </div>
                );
              })
          ) : (
              <div>Loading contacts...</div>
          )}
        </motion.div>
    );
  };

  return (
      <>
        <Toaster position="top-center" reverseOrder={false} />

        <div className="flex p-4 w-full justify-between">
          <FaBars
              onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
              className="w-6 h-6 cursor-pointer text-neutral-600"
          />
        </div>

        <div className="border-t border-gray-300 py-4"></div>
        <div className="flex flex-row justify-between gap-12 items-center w-full h-16 p-4">
          <div className="flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center">
            {consultantLevel === "responsable" &&
                <MdOutlineDomainAdd
                    onClick={editingIndex === -1 ? () => setAddEntrepriseVisible(true) : null}
                    className={`ml-4 w-7 h-7 text-gray-700 ${editingIndex !== -1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />}
            <button
                onClick={exportToExcel}
                disabled={editingIndex !== -1}
                className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 ${editingIndex !== -1 ? 'hover:bg-neutral-500 cursor-not-allowed' : 'hover:bg-neutral-500'}`}
            >
              Exporter (Format Excel)
            </button>
          </div>
          <div className="flex flex-row gap-4">
            <select
                className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                value={selectedField}
                onChange={(e) => handleFieldChange(e.target.value)}
            >
              <option value="category">Catégorie</option>
              <option value="raisonSociale">Raison Sociale</option>
              <option value="secteur">Secteur</option>
              <option value="pays">Pays</option>
              <option value="ville">Ville</option>
              <option value="email">Email</option>
              <option value="phone">Téléphone</option>
              <option value="registreDeCommerce">Registre de Commerce</option>
              <option value="identifiantFiscale">Identifiant Fiscal</option>
              <option value="patente">Patente</option>
              <option value="cnss">Cnss</option>
            </select>
            {renderSearchInput()}
          </div>
        </div>

        <div className="border-t border-gray-300 py-4"></div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table
              id="entrepriseTable"
              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Catégorie</th>
              <th scope="col" className="px-6 py-3">Raison Sociale</th>
              <th scope="col" className="px-6 py-3">Sécteur</th>
              <th scope="col" className="px-6 py-3">Pays</th>
              <th scope="col" className="px-6 py-3">Ville</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Téléphone</th>
              <th scope="col" className="px-6 py-3">Registre de commerce</th>
              <th scope="col" className="px-6 py-3">Identifiant fiscale</th>
              <th scope="col" className="px-6 py-3">Patente</th>
              <th scope="col" className="px-6 py-3">Cnss</th>
              <th scope="col" className="px-6 py-3">Contacts</th>
              {consultantLevel === "responsable" &&
                  <th scope="col" className="px-6 py-3">Actions</th>
              }
            </tr>
            </thead>
            <tbody>
            {category.map((cat, index) => {
              if ((!searchCategory || category[index].toLowerCase().includes(searchCategory.toLowerCase())) &&
                  (!searchRaisonSociale || raisonSociale[index].toLowerCase().includes(searchRaisonSociale.toLowerCase())) &&
                  (!searchSecteur || secteur[index].toLowerCase().includes(searchSecteur.toLowerCase())) &&
                  (!searchPays || pays[index].toLowerCase().includes(searchPays.toLowerCase())) &&
                  (!searchVille || ville[index].toLowerCase().includes(searchVille.toLowerCase())) &&
                  (!searchEmail || email[index].toLowerCase().includes(searchEmail.toLowerCase())) &&
                  (!searchPhone || phone[index].includes(searchPhone)) &&
                  (!searchRegistreDeCommerce || registreDeCommerce[index].toString().includes(searchRegistreDeCommerce)) &&
                  (!searchIdentifiantFiscale || identifiantFiscale[index].toString().includes(searchIdentifiantFiscale)) &&
                  (!searchPatente || patente[index].toString().includes(searchPatente)) &&
                  (!searchCnss || cnss[index].toString().includes(searchCnss))) {
                const isEditing = editingIndex === index;
                const disableEdit = editingIndex !== -1 && !isEditing; // Désactiver si une autre ligne est en cours de modification
                return (
                    <React.Fragment key={index}>
                      <tr className="border-b">
                        {isEditing ? (
                            // Champs de saisie pour la modification
                            <>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setCategory(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.category}
                                    value={category[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setRaisonSociale(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.raisonSociale}
                                    value={raisonSociale[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setSecteur(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.secteur}
                                    value={secteur[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setPays(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.pays}
                                    value={pays[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setVille(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.ville}
                                    value={ville[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    className="w-auto"
                                    onChange={(e) => setEmail(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.email}
                                    value={email[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    type="number"
                                    className="w-auto"
                                    onChange={(e) => setPhone(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.phone}
                                    value={phone[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    type="number"
                                    className="w-auto"
                                    onChange={(e) => setRegistreDeCommerce(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.registreDeCommerce}
                                    value={registreDeCommerce[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    type="number"
                                    className="w-auto"
                                    onChange={(e) => setIdentifiantFiscale(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.identifiantFiscale}
                                    value={identifiantFiscale[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    type="number"
                                    className="w-auto"
                                    onChange={(e) => setPatente(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.patente}
                                    value={patente[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <FloatingLabel
                                    type="number"
                                    className="w-auto"
                                    onChange={(e) => setCnss(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
                                    variant="outlined" label={originalData.cnss}
                                    value={cnss[index]} />
                              </td>
                              <td className="px-6 py-4">
                                <button
                                    onClick={() => handleRowClick(index)}
                                    className={`font-medium text-yellow-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                  {expandedRows.includes(index) ? "Cacher" : "Voir"}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-4">
                                  <button onClick={() => updateEntreprise(index)}
                                          className="font-medium text-green-600 hover:underline">Enregistrer
                                  </button>
                                  <button onClick={handleCancelClick}
                                          className="font-medium text-red-600 hover:underline">Annuler
                                  </button>
                                </div>
                              </td>
                            </>
                        ) : (
                            // Affichage des données
                            <>
                              <td className="px-6 py-4">{cat}</td>
                              <td className="px-6 py-4">{raisonSociale[index]}</td>
                              <td className="px-6 py-4">{secteur[index]}</td>
                              <td className="px-6 py-4">{pays[index]}</td>
                              <td className="px-6 py-4">{ville[index]}</td>
                              <td className="px-6 py-4">{email[index]}</td>
                              <td className="px-6 py-4">{phone[index]}</td>
                              <td className="px-6 py-4">{registreDeCommerce[index]}</td>
                              <td className="px-6 py-4">{identifiantFiscale[index]}</td>
                              <td className="px-6 py-4">{patente[index]}</td>
                              <td className="px-6 py-4">{cnss[index]}</td>
                              <td className="px-6 py-4">
                                <button
                                    onClick={() => handleRowClick(index)}
                                    disabled={disableEdit}
                                    className={`font-medium text-yellow-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                  {expandedRows.includes(index) ? "Cacher" : "Voir"}
                                </button>
                              </td>
                              {consultantLevel === "responsable" &&
                                  <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                      <button href="#" onClick={() => handleEditClick(index)}
                                              disabled={disableEdit}
                                              className={`font-medium text-blue-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        Modifier
                                      </button>
                                      <a href="#"
                                         onClick={(e) => {
                                           e.preventDefault(); // Prévenir le comportement par défaut du lien
                                           if (!disableEdit) {
                                             setConfirmDelete({ entrepriseId: id[index], value: true });
                                           }
                                         }}
                                         className={`font-medium text-red-600 hover:underline ${disableEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>Supprimer</a>
                                    </div>
                                  </td>
                              }
                            </>
                        )}
                      </tr>
                      {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="13">
                              {renderContactCards(index)}
                            </td>
                          </tr>
                      )}
                    </React.Fragment>
                );
              }
              return null;
            })}
            </tbody>
          </table>
        </div>
        {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
        {addEntrepriseVisible && <AddEntreprise onClose={() => setAddEntrepriseVisible(false)} />}
        <Modal show={confirmDelete.value} size="md"
               onClose={() => setConfirmDelete({ entrepriseId: null, value: false })} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle
                  className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Êtes-vous sûr que vous voulez supprimer cet entreprise ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => {
                  setConfirmDelete(false)
                  deleteEntreprise(confirmDelete.entrepriseId)
                }}>
                  {"Oui, je suis sur"}
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete({ organismId: null, value: null })}>
                  Non, Annuler
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
            show={isAddContactModalVisible} size="md"
            onClose={handleCloseAddContactModal}>
          <Modal.Header>Ajouter un nouveau contact</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col items-center justify-center space-y-4">
              <FloatingLabel
                  className="w-auto"
                  onChange={(e) => setNewContact({ ...newContact, firstname: e.target.value })}
                  variant="outlined" label="First Name"
                  value={newContact.firstname} />
              <FloatingLabel
                  className="w-auto"
                  onChange={(e) => setNewContact({ ...newContact, lastname: e.target.value })}
                  variant="outlined" label="Last Name"
                  value={newContact.lastname} />
              <FloatingLabel
                  type="email"
                  className="w-auto"
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  variant="outlined" label="Email"
                  value={newContact.email} />
              <FloatingLabel
                  className="w-auto"
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  variant="outlined" label="Phone"
                  value={newContact.phone} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSaveNewContact}>Enregistrer</Button>
            <Button color="gray" onClick={handleCloseAddContactModal}>Annuler</Button>
          </Modal.Footer>
        </Modal>

      </>
  );
}
