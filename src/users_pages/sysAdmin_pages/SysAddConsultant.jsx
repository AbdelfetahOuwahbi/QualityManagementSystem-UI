import { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput, Radio } from "flowbite-react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { appUrl } from "../../Url.jsx";

export default function SysAddConsultant({ consultantDtls, onClose }) {

    console.log("received-->", consultantDtls);

    //Navigation
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(true);


    // console.log("this is consultant details after binding -->", consultantDetails)

    const [organismId, setOrganismId] = useState([]);
    const [organismName, setOrganismName] = useState([]);

    const [consultantDetails, setConsultantDetails] = useState(
        consultantDtls || {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            organism: "",
            level: "responsable",
            userId: ""
        });


    // We will get all organismes and put them in Selection For the SysAdmin to select them
    useEffect(() => {
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            if (organismId.length === 0) {
                async function getAllOrganismes() {
                    try {
                        const response = await fetch(`${appUrl}/organismes`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${Cookies.get("JWT")}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();
                        console.log(data);
                        for (let i = 0; i < data.length; i++) {
                            setOrganismId(prevState => [...prevState, data[i].id]);
                            setOrganismName(prevState => [...prevState, data[i].raisonSocial]);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                getAllOrganismes();
            } else {
                console.log("Already got all organismes")
            }
        }
    }, [])


    //Function that saves the cosultant 
    async function saveConsultant(consultantDetails) {
        console.log(consultantDetails);
        if (!isTokenInCookies()) {
            window.location.href = "/"
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/"
        } else {
            if (consultantDetails.organism === '') {
                toast.error('Vous devez affecter un organisme a ce consultant !!');
            } else if (consultantDetails.first_name === '') {
                toast.error('Vous devez entrer le nom du consultant !!');
            } else if (consultantDetails.last_name === '') {
                toast.error('Vous devez entrer le prénom du consultant !!');
            } else {
                try {
                    console.log("consultant details are -->", consultantDetails);
                    const response = await fetch(`${appUrl}/auth/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get("JWT")}`,
                        },
                        body: JSON.stringify({
                            "firstname": consultantDetails.first_name,
                            "lastname": consultantDetails.last_name,
                            "email": consultantDetails.email,
                            "phone": consultantDetails.phone,
                            "type": "consultant",
                            "level": consultantDetails.level || "responsable",
                            "roles": [
                                {
                                    "name": "Consultant"
                                }
                            ],
                            "organismeId": consultantDetails.organism
                        }),
                    });

                    const data = await response.json();
                    console.log("data after saving consultant is-->", data);
                    if (!response.ok) {
                        console.log("error message is --> ", data.message);
                        if (data.errorCode === "User_email_already_exists") {
                            toast.error("L'email que vous avez entrez est déjà utilisé, entrer un autre!!");
                        } else if (data.errorCode === "VALIDATION_ERROR") {
                            const errorMessages = data.message.split(',');
                            errorMessages.forEach(message => {
                                toast.error(message.trim());
                            });
                        }else if(data.errorCode === "Frame_already_exists"){
                            toast.error(data.message);
                        }
                        else {
                            toast.error('Une erreur s\'est produite lors du creation de ce consultant.');
                        }
                        throw new Error(`Failed to save consultant: ${response.status} ${response.statusText}`);
                    }

                    if (response.status === 200 || response.status === 201) {
                        toast.success('Ce consultant est ajoutè avec succès..');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Error saving consultant:', error);
                }
            }
        }
    }


    return (
        <>
            <Modal show={modalOpen} size="2xl" onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Envoyer les détails de votre organisation</h3>

                        {/* Consultant Details Section Starts */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="prénom" value="Prénom" />
                            </div>
                            <TextInput
                                id="first_name"
                                placeholder="Votre prénom"
                                value={consultantDetails.first_name}
                                onChange={(event) => setConsultantDetails({
                                    ...consultantDetails,
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
                                value={consultantDetails.last_name}
                                onChange={(event) => setConsultantDetails({
                                    ...consultantDetails,
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
                                value={consultantDetails.email}
                                onChange={(event) => setConsultantDetails({
                                    ...consultantDetails,
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
                                value={consultantDetails.phone}
                                onChange={(event) => setConsultantDetails({
                                    ...consultantDetails,
                                    phone: event.target.value
                                })}
                                required={true}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="organism" value="Sélectionner un organisme" />
                            </div>
                            <select
                                id="organism"
                                className="rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                                value={consultantDetails.organism}
                                onChange={(e) => {
                                    const selectedOrganismId = e.target.value;
                                    // Updating state with the selected organism ID
                                    setConsultantDetails({
                                        ...consultantDetails,
                                        organism: selectedOrganismId
                                    });
                                }}
                            >
                                <option value="">Sélectionner un organisme</option>
                                {organismId.map((organism, index) => (
                                    <option key={index} value={organismId[index]}>
                                        {organismName[index]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!consultantDtls &&
                            <div>

                                <div className="mb-2 block">
                                    <Label htmlFor="consultantLevel" value="Niveau de consultant" />
                                </div>
                                <div className="flex items-center mb-4">
                                    <Radio
                                        id="responsable"
                                        name="level"
                                        value="responsable"
                                        checked={consultantDetails.level === "responsable"}
                                        onChange={(e) => setConsultantDetails({
                                            ...consultantDetails,
                                            level: e.target.value
                                        })}
                                    />
                                    <Label htmlFor="responsable" className="ml-2">Responsable</Label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Radio
                                        id="junior"
                                        name="level"
                                        value="junior"
                                        checked={consultantDetails.level === "junior"}
                                        onChange={(e) => setConsultantDetails({
                                            ...consultantDetails,
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
                                        checked={consultantDetails.level === "senior"}
                                        onChange={(e) => setConsultantDetails({
                                            ...consultantDetails,
                                            level: e.target.value
                                        })}
                                    />
                                    <Label htmlFor="senior" className="ml-2">Senior</Label>
                                </div>
                            </div>
                        }
                        <div className="w-full">

                            <Button onClick={() => saveConsultant(consultantDetails)}>Ajouter</Button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}
