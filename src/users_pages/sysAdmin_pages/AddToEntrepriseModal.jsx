import React, { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { serverAddress } from "../../ServerAddress";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";

export default function AddToEntrepriseModal({ isVisible, onClose, consultantId }) {
    const [entreprises, setEntreprises] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState("");

    const decoded = jwtDecode(Cookies.get("JWT"));
    // const userID = decoded.id;
    const userID = "dad950dadb0845ae9c3c1571043f8b0720240522142741";

    useEffect(() => {
        const fetchConsulantResponsableEntreprises = async () => {
            console.log("userID: ", userID);
            console.log("consultantId: ", consultantId);
            if (!isTokenInCookies()) {
                window.location.href = "/";
            } else if (isTokenExpired()) {
                Cookies.remove("JWT");
                window.location.href = "/";
            } else {
                try {
                    const response = await fetch(`http://${serverAddress}:8080/api/v1/consulantSMQ/entreprises/all-entreprises?consultantId=${userID}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${Cookies.get("JWT")}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setEntreprises(data);
                    } else {
                        console.error('Failed to fetch entreprises: ', response.status, response.statusText);
                        toast.error("Erreur lors du chargement des entreprises");
                    }
                } catch (error) {
                    console.error('Error fetching entreprises:', error);
                    toast.error("Erreur lors du chargement des entreprises");
                }
            }
        };

        if (isVisible) {
            fetchConsulantResponsableEntreprises();
        }
    }, [isVisible, userID]);

    const handleAddConsultant = async () => {
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            if (selectedEntreprise) {
                try {
                    console.log(`Adding consultant ${consultantId} to entreprise ${selectedEntreprise}`);
                    const response = await fetch(`http://${serverAddress}:8080/api/v1/consulantSMQ/entreprises/${selectedEntreprise}/add-consultant?consultantSMQId=${consultantId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get("JWT")}`,
                        }
                    });
                    const result = await response.text();
                    console.log("Result: ", result);
                    if (result == "Le consultant a été ajouté à l'entreprise avec success !") {
                            toast.success("Consultant ajouté à l'entreprise avec succès !");
                            onClose();
                            window.location.reload();
                    }else if (result == "Le consultant est déjà ajouté à l'entreprise !") {
                        onClose();
                        toast.error("Le consultant est déjà ajouté à l'entreprise !");
                    }
                    else {
                        console.error('Failed to add consultant: ', response.status, response.statusText);
                        toast.error("Échec de l'ajout du consultant à l'entreprise.");
                    }
                } catch (error) {
                    console.error('Error adding consultant to entreprise:', error);
                    toast.error("Une erreur s'est produite !!");
                }
            } else {
                toast.error("Veuillez sélectionner une entreprise");
            }
        }
    }

    return (
        <Modal show={isVisible} onClose={onClose}>
            <Modal.Header>
                Ajouter Consultant à une Entreprise
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setSelectedEntreprise(e.target.value)}
                        value={selectedEntreprise}
                    >
                        <option value="" disabled>Select an entreprise</option>
                        {entreprises.map((entreprise) => (
                            <option key={entreprise.id} value={entreprise.id}>
                                {entreprise.raisonSocial}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleAddConsultant}>
                    <FaPlus className="mr-2" /> Ajouter
                </Button>
                <Button color="gray" onClick={onClose}>
                    Annuler
                </Button>
            </Modal.Footer>
        </Modal>
    );
}