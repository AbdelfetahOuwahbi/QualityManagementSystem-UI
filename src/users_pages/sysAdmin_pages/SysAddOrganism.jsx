import { useEffect, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { Toaster, toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";


export default function SysAddOrganism({ onClose }) {

    const [modalOpen, setModalOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [consultantDetails, setConsultantDetails] = useState([
        {
          category: "",
          Raison_Sociale: "",
          Secteur: "",
          Pays: "",
          Ville: "",
          Email: "",
          phone: "",
          Registre_de_commerce: "",
          Identifiant_fiscale: "",
          Patente: "",
          Cnss: "",
        }
    ]);

    const [organismId, setOrganismId] = useState([]);
    const [organismCategorie, setOrganismCategorie] = useState([]);

    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW1pQGdtYWlsLmNvbSIsImlhdCI6MTcxNDczMzQzOCwiZXhwIjoxNzE0ODE5ODM4fQ.yK7EIdqcwTRFoBWanjOXmkJ5i170r9wgMackY6TmV88";

    // We will get all organismes and put them in Selection For the SysAdmin to select them
    useEffect(() => {
        if (organismId.length === 0) {
            async function getAllOrganismes() {
                try {
                    const response = await fetch(`http://localhost:8080/api/v1/organismes`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        setOrganismId(prevState => [...prevState, data[i].id]);
                        setOrganismCategorie(prevState => [...prevState, data[i].categorie]);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            getAllOrganismes();
        } else {
            console.log("Already got all organismes")
        }
    }, [])

    async function saveConsultant() {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8080/api/v1/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "firstname": consultantDetails[0].first_name,
                    "lastname": consultantDetails[0].last_name,
                    "email": consultantDetails[0].email,
                    "phone": consultantDetails[0].phone,
                    "password": consultantDetails[0].password,
                    "type": "consultant",
                    "roles": [
                        {
                            "name": "Consultant"
                        }
                    ],
                    "organismeId": consultantDetails[0].organisation
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to save consultant: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (response.status === 200 || response.status === 201) {
                toast.success('Ce consultant est ajoutè avec succès..');
                setTimeout(() => {
                    setModalOpen(false);
                    setIsLoading(false);
                }, 2000);
            }
            console.log(data);
        } catch (error) {
            console.error('Error saving consultant:', error);
            toast.error('Une erreur s\'est produite lors du creation de ce consultant.');
        }
    }


    return (
        <>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
            <Modal show={modalOpen} size="2xl" onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Envoyer les details de votre organisation</h3>

                        {/* Consultant Details Section Starts */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="prénom" value="prénom" />
                            </div>
                            <TextInput
                                id="first_name"
                                placeholder="votre prénom"
                                value={consultantDetails[0].first_name}
                                onChange={(event) => setConsultantDetails([
                                    {
                                        ...consultantDetails[0],
                                        first_name: event.target.value
                                    }
                                ])}
                                required
                            />

                            <div className="mb-2 block">
                                <Label htmlFor="nom" value="nom" />
                            </div>
                            <TextInput
                                id="last_name"
                                placeholder="votre nom"
                                value={consultantDetails[0].last_name}
                                onChange={(event) => setConsultantDetails([
                                    {
                                        ...consultantDetails[0],
                                        last_name: event.target.value
                                    }
                                ])}
                                required
                            />

                            <div className="mb-2 block">
                                <Label htmlFor="email" value="email" />
                            </div>
                            <TextInput
                                id="email"
                                placeholder="exemple@gmail.com"
                                value={consultantDetails[0].email}
                                onChange={(event) => setConsultantDetails([
                                    {
                                        ...consultantDetails[0],
                                        email: event.target.value
                                    }
                                ])}
                                required
                            />

                            <div className="mb-2 block">
                                <Label htmlFor="phone" value="Téléphone" />
                            </div>
                            <TextInput
                                id="phone"
                                placeholder="06********"
                                value={consultantDetails[0].phone}
                                onChange={(event) => setConsultantDetails([
                                    {
                                        ...consultantDetails[0],
                                        phone: event.target.value
                                    }
                                ])}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="organisation" value="organisme de certification" />
                            </div>
                            <select
                                id="organisation"
                                value={consultantDetails[0].organisation}
                                onChange={(event) =>
                                    setConsultantDetails([
                                        {
                                            ...consultantDetails[0],
                                            organisation: event.target.value
                                        }
                                    ])
                                }
                                required
                            >
                                <option value="">Selectionner un organisme de certification </option>
                                {organismId.map((organism, index) => (
                                    <option key={index} value={organismId[index]}>
                                        {organismCategorie[index]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="mot de passe initiale" />
                            </div>
                            <TextInput id="password" type="password" value={consultantDetails[0].password}
                                onChange={(Event) => setConsultantDetails([
                                    {
                                        ...consultantDetails[0],
                                        password: Event.target.value
                                    }
                                ])} required />
                        </div>
                        <div className="w-full">
                            <Button onClick={() => saveConsultant()}>{isLoading ? (<Spinner/>) : ("Envoyer")}</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
