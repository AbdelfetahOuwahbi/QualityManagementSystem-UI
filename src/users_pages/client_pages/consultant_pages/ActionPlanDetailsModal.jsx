import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Modal, Button } from "flowbite-react";
import { appUrl } from "../../../Url.jsx";
import Cookies from "js-cookie";

export default function ActionPlanDetailsModal({ isOpen, criteriaId, diagnosisId, onClose }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDetailsActions = async () => {
        try {
            const response = await fetch(`${appUrl}/diagnoses/details/actions/${diagnosisId}/${criteriaId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`,
                }
            });
            const data = await response.json();
            console.log("voilaaaa -->", data);
            setData(data);
            setLoading(false);
        } catch (error) {
            console.log("error getting diagnosis Details -->", error);
            toast.error("Erreur lors de la récupération des détails de l'action.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getDetailsActions();
        }
    }, [isOpen, criteriaId]);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Modal show={isOpen} onClose={onClose} size="md">
                <Modal.Header>Actions</Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : data.length > 0 ? (
                        data.map((action, index) => (
                            <div key={index} className="p-4 mb-4 bg-white rounded shadow-md">
                                <h2 className="text-xl font-semibold mb-2">Action {index + 1}</h2>
                                <div className="mb-2">
                                    <p className="font-bold">Action:</p>
                                    <p>{action.action || "N/A"}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="font-bold">Date de création:</p>
                                    <p>{action.createdDate ? action.createdDate.replace('T', ' à ') : "N/A"}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="font-bold">DeadLine:</p>
                                    <p>{action.deadline ? action.deadline.replace('T', ' à ') : "N/A"}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="font-bold">Responsable:</p>
                                    <p>{action.chosenAgent?.firstname || "N/A"}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="font-bold">Statut:</p>
                                    <p>{action.actionDetails && action.actionDetails[0]?.status === "realized" ? "Réalisé" : action.actionDetails && action.actionDetails[0]?.status === "validated" ? "Validé" : "Non commencé"}</p>
                                </div>
                                {action.actionDetails && (action.actionDetails[0]?.status === "validated" || action.actionDetails[0]?.status === "realized") && (
                                    <div className="mb-2">
                                        <p className="font-bold">Détails:</p>
                                        <p>{action.actionDetails[0]?.activity || "N/A"}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Aucune donnée disponible</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Fermer</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
