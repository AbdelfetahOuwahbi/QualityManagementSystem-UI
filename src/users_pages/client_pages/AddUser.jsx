import React, { useState, useEffect } from 'react'
import { Button, Radio, Label, Modal, ModalFooter, TextInput } from "flowbite-react";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import toast, {Toaster} from 'react-hot-toast';
import { isTokenExpired, isTokenInCookies, getAllEntreprises } from '../CommonApiCalls';
import { serverAddress } from '../../ServerAddress';

export default function AddUser({ organismId, userType, onClose }) {

  const userID = jwtDecode(Cookies.get("JWT")).id;

  const [openModal, setOpenModal] = useState(true);
  const [id, setId] = useState([]);
  const [raisonSociale, setRaisonSociale] = useState([]);
  const [userDetails, setUserDetails] = useState(
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      entreprise: "",
      level: "senior",
    }
  );
  const [finalReqBody, setFinalReqBody] = useState({});

  useEffect(() => {
    switch (userType) {
      case "admin":
        setFinalReqBody({
          firstname: userDetails.first_name,
          lastname: userDetails.last_name,
          email: userDetails.email,
          phone: userDetails.phone,
          type: "admin",
          roles: [
            {
              name: "Admin",
            }
          ],
          entrepriseId: userDetails.entreprise,
        });
        break;
      case "qualityResponsible":
        setFinalReqBody({
          firstname: userDetails.first_name,
          lastname: userDetails.last_name,
          email: userDetails.email,
          phone: userDetails.phone,
          type: "responsable",
          roles: [
            {
              name: "Responsable",
            }
          ],
          entrepriseId: userDetails.entreprise,
        });
        break;
      case "pilot":
        setFinalReqBody({
          firstname: userDetails.first_name,
          lastname: userDetails.last_name,
          email: userDetails.email,
          phone: userDetails.phone,
          type: "pilot",
          roles: [
            {
              name: "Pilot",
            }
          ],
          entrepriseId: userDetails.entreprise,
        });
        break;
      case "consultant":
        setFinalReqBody({
          firstname: userDetails.first_name,
          lastname: userDetails.last_name,
          email: userDetails.email,
          phone: userDetails.phone,
          level: userDetails.level,
          type: "consultant",
          roles: [
            {
              name: "Consultant",
            }
          ],
          organismeId: organismId,
        });
        break;
    }
  }, [userDetails])

  useEffect(() => {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      if (id.length > 0) {
        console.log("Already got client entreprises");
      } else {
        getClientEntreprises();
      }
    }
  }, [])

  //Function that gets All client Entreprises
  const getClientEntreprises = async () => {
    try {
      const data = await getAllEntreprises(userID, "ManagedEntreprises");
      if (data.length > 0) {
        console.log("Consultant Managed Entreprises -->", data);
        for (let i = 0; i < data.length; i++) {
          setId((prev) => [...prev, data[i].id]);
          setRaisonSociale((prev) => [...prev, data[i].raisonSocial]);
        }
      }
    } catch (error) {
      console.log("error getting client entreprises --> ", error);
    }
  }

  //Function that saves the user 
  const saveUser = async () => {
    console.log(JSON.stringify(finalReqBody));
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify(finalReqBody)
        });
        const data = await response.json();
        console.log(`data after saving the ${userType} is-->`, data);
        if (response.status === 200 || response.status === 201) {
          toast.success('Cet utilisateur est ajoutè avec succès..');
          window.location.reload();
        }
        else {
          console.log("error message is --> ", data.message);
          if (data.errorCode === "User_email_already_exists") {
            toast.error("L'email que vous avez entrez est déjà utilisé, entrer un autre!!");
          } else if (data.errorCode === "VALIDATION_ERROR") {
            const errorMessages = data.message.split(',');
            errorMessages.forEach(message => {
              toast.error(message.trim());
            });
          }
          else {
            toast.error('Une erreur s\'est produite lors du creation de cet utilisateur.');
          }
          throw new Error(`Failed to save user: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log("error happened while saving the user -->", error);
      }
    }
  }
  return (
    <>
      <Modal show={openModal} className='py-6' popup onClose={onClose}>
        <Modal.Header>
          <div className='flex flex-col md:flex-row gap-2 p-4 items-center'>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Ajouter Un </h3>
            <h4 className='font-p_extra_bold text-sky-600 mt-[2px]'>
              {userType === "consultant" ? "Consultant" :
                userType === "admin" ? "administrateur" :
                  userType === "qualityResponsible" ? "Responsable qualité" : "Pilote"}</h4>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Entrer les informations de cet utilisateur</h3>

            {/* Consultant Details Section Starts */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="prénom" value="Prénom" />
              </div>
              <TextInput
                id="first_name"
                placeholder="Votre prénom"
                value={userType.first_name}
                onChange={(event) => setUserDetails({
                  ...userDetails,
                  first_name: event.target.value
                })}
                required
              />

              <div className="mb-2 block">
                <Label htmlFor="nom" value="Nom" />
              </div>
              <TextInput
                id="last_name"
                placeholder="Votre nom"
                value={userDetails.last_name}
                onChange={(event) => setUserDetails({
                  ...userDetails,
                  last_name: event.target.value
                })}
                required
              />

              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                placeholder="exemple@gmail.com"
                value={userDetails.email}
                onChange={(event) => setUserDetails({
                  ...userDetails,
                  email: event.target.value
                })}
                required
              />

              <div className="mb-2 block">
                <Label htmlFor="phone" value="Téléphone" />
              </div>
              <TextInput
                id="phone"
                placeholder="06********"
                value={userDetails.phone}
                onChange={(event) => setUserDetails({
                  ...userDetails,
                  phone: event.target.value
                })}
                required={true}
              />
            </div>
            {userType !== "consultant" &&
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="organism" value="Sélectionner une entreprise cliente" />
                </div>
                <select
                  id="entreprise"
                  className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                  value={userDetails.organism}
                  onChange={(e) => {
                    const selectedEntrepriseId = e.target.value;
                    // Updating state with the selected organism ID
                    setUserDetails({
                      ...userDetails,
                      entreprise: selectedEntrepriseId
                    });
                  }}
                >
                  <option value="">Sélectionner une entreprise</option>
                  {id.map((entreprise, index) => (
                    <option key={index} value={id[index]}>
                      {raisonSociale[index]}
                    </option>
                  ))}
                </select>
              </div>
            }
            {userType === "consultant" &&
              <div>

                <div className="mb-2 block">
                  <Label htmlFor="consultantLevel" value="Niveau de consultant" />
                </div>
                <div className="flex items-center mb-4">
                  <Radio
                    id="junior"
                    name="level"
                    value="junior"
                    checked={userDetails.level === "junior"}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      level: e.target.value
                    })}
                  />
                  <Label htmlFor="junior" className="ml-2">Junior</Label>
                </div>
                <div className="flex items-center mb-4">
                  <Radio
                    id="senior"
                    name="level"
                    value="senior"
                    checked={userDetails.level === "senior"}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      level: e.target.value
                    })}
                  />
                  <Label htmlFor="senior" className="ml-2">Senior</Label>
                </div>
              </div>
            }
          </div>
        </Modal.Body>
        <ModalFooter>

          <div className="w-full">
            <Button onClick={() => saveUser()}>Ajouter</Button>
          </div>

        </ModalFooter>
      </Modal>
    </>
  )
}
