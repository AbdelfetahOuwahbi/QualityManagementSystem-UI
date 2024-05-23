import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getAllEntreprises, isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import SysMainPage from './SysMainPage';


export default function SysAllEntreprises() {

  const [isSysMenuOpen, setIsSysMenuOpen] = useState(false);

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

  // Function to handle field selection change
  const handleFieldChange = (field) => {
    setSelectedField(field);
  };

  //Function that gets all organismes

  const getAllClientEntreprises = async () => {
    setId([])
    setCategory([])
    setRaisonSociale([])
    setSecteur([])
    setPays([])
    setVille([])
    setEmail([])
    setPhone([])
    setRegistreDeCommerce([])
    setIdentifiantFiscale([])
    setPatente([])
    setCnss([])
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const data = await getAllEntreprises(null, "entreprises");
        if (data.length > 0) {
          toast((t) => (
            <span>
              la liste est a jours ...
            </span>
          ));
          console.log("All Entreprises -->", data);
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
          }
        }
      } catch (error) {
        console.error(error); // Handle errors
        toast.error('Une erreur s\'est produite lors du creation de cet organism.');
      }
    }
  }

  useEffect(() => {
    //Checking the validity of the token starts
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {    //Checking the validity of the token ends
      if (id.length === 0) {
        getAllClientEntreprises();
      } else {
        console.log("Already got all entreprises ...");
      }

    }
  }, [])



  // Function to export table data as Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const tableClone = document.getElementById("entrepriseTable").cloneNode(true);
    const ws = XLSX.utils.table_to_sheet(tableClone);
    XLSX.utils.book_append_sheet(wb, ws, "Entreprises clientes");
    XLSX.writeFile(wb, "Entreprises clientes.xlsx");
  };

  const renderSearchInput = () => {
    switch (selectedField) {
      case 'category':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher categorie"
          onChange={(e) => setSearchCategory(e.target.value)} />;
      case 'raisonSociale':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher raison sociale"
          onChange={(e) => setSearchRaisonSociale(e.target.value)} />;
      case 'secteur':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher secteur"
          onChange={(e) => setSearchSecteur(e.target.value)} />;
      case 'pays':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher pays"
          onChange={(e) => setSearchPays(e.target.value)} />;
      case 'ville':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher ville"
          onChange={(e) => setSearchVille(e.target.value)} />;
      case 'email':
        return <input className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher email"
          onChange={(e) => setSearchEmail(e.target.value)} />;
      case 'phone':
        return <input type="number"
          className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher téléphone"
          onChange={(e) => setSearchPhone(e.target.value)} />;
      case 'registreDeCommerce':
        return <input type="number"
          className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher registre de commerce"
          onChange={(e) => setSearchRegistreDeCommerce(e.target.value)}
        />;
      case 'identifiantFiscale':
        return <input type="number"
          className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher identifiant fiscal"
          onChange={(e) => setSearchIdentifiantFiscale(e.target.value)}
        />;
      case 'patente':
        return <input type="number"
          className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher patente"
          onChange={(e) => setSearchPatente(e.target.value)} />;
      case 'cnss':
        return <input type="number"
          className="px-4 py-2 rounded border border-gray-300 w-64 text-lg focus:outline-none"
          placeholder="Rechercher cnss"
          onChange={(e) => setSearchCnss(e.target.value)} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <div className="flex p-4 w-full justify-between">
        {/* Bars Icon That toogles the visibility of the menu */}
        <FaBars onClick={() => setIsSysMenuOpen(!isSysMenuOpen)}
          className='w-6 h-6 cursor-pointer text-neutral-600' />
      </div>

      <div className='border-t border-gray-300 py-4'></div>
      <div className='flex flex-row justify-between gap-12 items-center w-full h-16 p-4'>
        <div className='flex flex-col md:flex-row gap-2 mb-10 md:mb-0 md:gap-12 md:items-center'>
          {/* <MdOutlineDomainAdd onClick={editingIndex === -1 ? () => setAddEntrepriseVisible(true) : null}
              className={`ml-4 w-7 h-7 text-gray-700  ${editingIndex !== -1 ? 'cursor-not-allowed' : 'cursor-pointer'}`} /> */}
          <button onClick={exportToExcel}
            className={`bg-sky-400 text-white py-2 px-4 font-p_medium transition-all duration-300 rounded-full hover:translate-x-2 hover:bg-neutral-500`}>
            Exporter (Format Excel)
          </button>
        </div>
        <div className="flex flex-row gap-4 ">
          <select
            className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
            value={selectedField} onChange={(e) => handleFieldChange(e.target.value)}>
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

      <div className='border-t border-gray-300 py-4'></div>


      <div className="relative px-2 md:px-6 overflow-x-auto shadow-md sm:rounded-lg">
        <table id="entrepriseTable"
          className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">


            <tr>
              <th scope="col" className="px-6 py-3">
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3">
                Raison Sociale
              </th>
              <th scope="col" className="px-6 py-3">
                Sécteur
              </th>
              <th scope="col" className="px-6 py-3">
                Pays
              </th>
              <th scope="col" className="px-6 py-3">
                Ville
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Téléphone
              </th>
              <th scope="col" className="px-6 py-3">
                Registre de commerce
              </th>
              <th scope="col" className="px-6 py-3">
                Identifiant fiscale
              </th>
              <th scope="col" className="px-6 py-3">
                Patente
              </th>
              <th scope="col" className="px-6 py-3">
                Cnss
              </th>
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
                return (
                  <tr key={index} className="border-b">
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
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
      {isSysMenuOpen && <SysMainPage onClose={() => setIsSysMenuOpen(false)} />}
    </>
  );
}
