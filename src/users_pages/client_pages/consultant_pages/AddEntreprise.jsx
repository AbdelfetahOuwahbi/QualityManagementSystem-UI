import { useState } from "react";
import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import { saveEntreprise, updateEntreprise } from "../../CommonApiCalls";
import { isTokenExpired, isTokenInCookies } from "../../CommonApiCalls";
import Cookies from "js-cookie";

export default function AddEntreprise({ onClose }) {

    const decoded = jwtDecode(Cookies.get("JWT"));
    const userID = decoded.id;


    // organismDtls ? console.log(organismDtls) : console.log("did not provide details..");

    const [modalOpen, setModalOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [entrepriseDetails, setEntrepriseDetails] = useState(
        {
            Category: "",
            Raison_Sociale: "",
            Secteur: "",
            Pays: "",
            Ville: "",
            Email: "",
            Phone: "",
            Registre_de_commerce: "",
            Identifiant_fiscale: "",
            Patente: "",
            Cnss: "",
        }
    );

    // Function that adds a new organism
    async function saveEntrep(entrepriseDetails) {
        // Checking the validity of the token
        if (!isTokenInCookies()) {
            window.location.href = "/";
        } else if (isTokenExpired()) {
            Cookies.remove("JWT");
            window.location.href = "/";
        } else {
            try {
                setIsLoading(true);
                const response = await saveEntreprise(
                    userID,
                    "entreprise",
                    entrepriseDetails.Category,
                    entrepriseDetails.Pays,
                    entrepriseDetails.Secteur,
                    entrepriseDetails.Ville,
                    entrepriseDetails.Phone,
                    entrepriseDetails.Email,
                    entrepriseDetails.Patente,
                    entrepriseDetails.Cnss,
                    entrepriseDetails.Identifiant_fiscale,
                    entrepriseDetails.Registre_de_commerce,
                    entrepriseDetails.Raison_Sociale
                );
                console.log("first, the response is -->", response)
                if (response?.status === 200 || response?.status === 201) {
                    toast.success("Cet Entreprise est ajouté avec succès..");
                    setTimeout(() => {
                        setModalOpen(false);
                        setIsLoading(false);
                    }, 2000);
                    window.location.reload();
                }
            } catch (error) {
                setIsLoading(false);
                console.error(error); // Handle errors
                toast.error("Une erreur s'est produite lors de la création de cet organisme.");
            }
        }
    }

    return (
        <>
            <Modal show={modalOpen} size="2xl" onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Entrer les détails de cet organisme </h3>
                        {/* Organism Details Section Starts */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="Category" value="Catégorie" />
                            </div>
                            <TextInput
                                id="Category"
                                placeholder="Catégorie"
                                value={entrepriseDetails.Category}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Category: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Raison_Sociale" value="Raison Sociale" />
                            </div>
                            <TextInput
                                id="Raison_Sociale"
                                placeholder="Raison Sociale"
                                value={entrepriseDetails.Raison_Sociale}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Raison_Sociale: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Secteur" value="Secteur" />
                            </div>
                            <TextInput
                                id="Secteur"
                                placeholder="Secteur"
                                value={entrepriseDetails.Secteur}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Secteur: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Pays" value="Pays" />
                            </div>
                            <TextInput
                                id="Pays"
                                placeholder="Pays"
                                value={entrepriseDetails.Pays}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Pays: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Ville" value="Ville" />
                            </div>
                            <TextInput
                                id="Ville"
                                placeholder="Ville"
                                value={entrepriseDetails.Ville}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Ville: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Email" value="Email" />
                            </div>
                            <TextInput
                                id="Email"
                                placeholder="Email"
                                value={entrepriseDetails.Email}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Email: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Phone" value="Phone" />
                            </div>
                            <TextInput
                                id="Phone"
                                placeholder="Phone"
                                value={entrepriseDetails.Phone}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Phone: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Registre_de_commerce" value="Registre de commerce" />
                            </div>
                            <TextInput
                                type="number"
                                id="Registre_de_commerce"
                                placeholder="Registre de commerce"
                                value={entrepriseDetails.Registre_de_commerce}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Registre_de_commerce: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Identifiant_fiscale" value="Identifiant fiscale" />
                            </div>
                            <TextInput
                                type="number"
                                id="Identifiant_fiscale"
                                placeholder="Identifiant fiscale"
                                value={entrepriseDetails.Identifiant_fiscale}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Identifiant_fiscale: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Patente" value="Patente" />
                            </div>
                            <TextInput
                                type="number"
                                id="Patente"
                                placeholder="Patente"
                                value={entrepriseDetails.Patente}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Patente: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Cnss" value="CNSS" />
                            </div>
                            <TextInput
                                type="number"
                                id="Cnss"
                                placeholder="CNSS"
                                value={entrepriseDetails.Cnss}
                                onChange={(event) => setEntrepriseDetails({ ...entrepriseDetails, Cnss: event.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full">

                            <Button onClick={() => saveEntrep(entrepriseDetails)}>{isLoading ? <Spinner /> : "Ajouter"}</Button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
