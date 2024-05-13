import { useState } from "react";
import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { toast } from "react-hot-toast";
import { saveEntreprise, updateEntreprise } from "../CommonApiCalls";
import { Spinner } from "flowbite-react";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import Cookies from "js-cookie";
import { serverAddress } from "../../ServerAddress";

export default function SysAddOrganism({ onClose }) {

    // organismDtls ? console.log(organismDtls) : console.log("did not provide details..");

    const [modalOpen, setModalOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [organismDetails, setOrganismDetails] = useState(
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
    async function saveOrganism(organismDetails) {
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
                    organismDetails.Category,
                    organismDetails.Pays,
                    organismDetails.Secteur,
                    organismDetails.Ville,
                    organismDetails.Phone,
                    organismDetails.Email,
                    organismDetails.Patente,
                    organismDetails.Cnss,
                    organismDetails.Identifiant_fiscale,
                    organismDetails.Registre_de_commerce,
                    organismDetails.Raison_Sociale
                );
                console.log("first, the response is -->", response)
                if (response?.status === 200 || response?.status === 201) {
                    toast.success("Cet Organisme est ajouté avec succès..");
                    setTimeout(() => {
                        setModalOpen(false);
                        setIsLoading(false);
                    }, 2000);
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
                                value={organismDetails.Category}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Category: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Raison_Sociale" value="Raison Sociale" />
                            </div>
                            <TextInput
                                id="Raison_Sociale"
                                placeholder="Raison Sociale"
                                value={organismDetails.Raison_Sociale}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Raison_Sociale: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Secteur" value="Secteur" />
                            </div>
                            <TextInput
                                id="Secteur"
                                placeholder="Secteur"
                                value={organismDetails.Secteur}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Secteur: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Pays" value="Pays" />
                            </div>
                            <TextInput
                                id="Pays"
                                placeholder="Pays"
                                value={organismDetails.Pays}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Pays: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Ville" value="Ville" />
                            </div>
                            <TextInput
                                id="Ville"
                                placeholder="Ville"
                                value={organismDetails.Ville}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Ville: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Email" value="Email" />
                            </div>
                            <TextInput
                                id="Email"
                                placeholder="Email"
                                value={organismDetails.Email}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Email: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Phone" value="Phone" />
                            </div>
                            <TextInput
                                id="Phone"
                                placeholder="Phone"
                                value={organismDetails.Phone}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Phone: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Registre_de_commerce" value="Registre de commerce" />
                            </div>
                            <TextInput
                                type="number"
                                id="Registre_de_commerce"
                                placeholder="Registre de commerce"
                                value={organismDetails.Registre_de_commerce}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Registre_de_commerce: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Identifiant_fiscale" value="Identifiant fiscale" />
                            </div>
                            <TextInput
                                type="number"
                                id="Identifiant_fiscale"
                                placeholder="Identifiant fiscale"
                                value={organismDetails.Identifiant_fiscale}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Identifiant_fiscale: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Patente" value="Patente" />
                            </div>
                            <TextInput
                                type="number"
                                id="Patente"
                                placeholder="Patente"
                                value={organismDetails.Patente}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Patente: event.target.value })}
                                required
                            />
                            <div className="mb-2 block">
                                <Label htmlFor="Cnss" value="CNSS" />
                            </div>
                            <TextInput
                                type="number"
                                id="Cnss"
                                placeholder="CNSS"
                                value={organismDetails.Cnss}
                                onChange={(event) => setOrganismDetails({ ...organismDetails, Cnss: event.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full">

                            <Button onClick={() => saveOrganism(organismDetails)}>{isLoading ? <Spinner /> : "Ajouter"}</Button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
