import { useEffect, useState } from "react";
import { Datepicker, Modal } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { serverAddress } from "../../../ServerAddress";
import { NewlyAddedDiagnosises } from "./NewlyAddedDiagnosisDetails";

export function DiagnosisModal({ onClose }) {

    const [openModal, setOpenModal] = useState(true);
    const [areDiagnosisDetailsShown, setAreDiagnosisDetailsShowen] = useState(false);

    const [diagnosisDate, setDiagnosisDate] = useState(new Date());
    const [chosenNormeId, setChosenNormeId] = useState('');
    const [chosenEntrepriseId, setChosenEntrepriseId] = useState('');

    const [entrepriseID, setEntrepriseID] = useState([]);
    const [entrepriseName, setEntrepriseName] = useState([]);

    const [normID, setNormID] = useState([]);
    const [normName, setNormName] = useState([]);

    const decoded = jwtDecode(Cookies.get("JWT"));
    //then Ill extact the id to send
    const userID = decoded.id;

    // Function to generate a random alphanumeric code
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 12; // Adjust the length of the generated code as needed
        let code = '';
        for (let i = 0; i < length; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    //The unique auto generated code
    const [code, setCode] = useState("");

    //Function that gets all the entreprises managed by the current Consultant 
    const getAllManagedEntreprises = async () => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/consulantSMQ/entreprises/all-entreprises?consultantId=${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`
                }
            });
            const data = await response.json();
            console.log("got Entreprises -->", data);
            for (let i = 0; i < data.length; i++) {
                setEntrepriseID(prev => [...prev, data[i].id]);
                setEntrepriseName(prev => [...prev, data[i].raisonSocial]);
            }
        } catch (error) {
            console.log("error fetching all Managed Entreprises", error);
        }
    }

    //Function that gets all Existing Norms For this QMS_APP Organisation
    const getAllNorms = async () => {
        try {
            const response = await fetch(`http://${serverAddress}:8080/api/v1/normes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get("JWT")}`
                }
            });
            const data = await response.json();
            console.log("got Norms -->", data);
            for (let i = 0; i < data.length; i++) {
                setNormID(prev => [...prev, data[i].id]);
                setNormName(prev => [...prev, data[i].label]);
            }
        } catch (error) {
            console.log("error fetching all Norms", error);
        }
    }

    useEffect(() => {
        if (entrepriseID.length !== 0) {
            console.log("Already got all managed entreprises");
        } else {
            getAllManagedEntreprises();
        }
        if (normID.length !== 0) {
            console.log("Already got all Norms");
        } else {
            getAllNorms();
        }
        //Setting up the unique Code
        setCode(generateRandomCode());
    }, []);

    return (
        <>
            <Modal show={openModal} size="xl" popup onClose={onClose}>
                <Modal.Header>
                    <div className='flex items-center p-4 justify-center'>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Marquer un nouveau diagnostic </h3>
                    </div>
                </Modal.Header>
                <div className="border-t-[1px] border-gray-300"></div>
                <Modal.Body>
                    <div className="">
                        <div className='flex py-10 flex-col'>
                            <div className='mb-8 flex items-center flex-row gap-4'>
                                <h1 className='font-p_medium'>Code :</h1>
                                <h1 className='font-p_black text-xl text-green-500'> {code}</h1>
                            </div>
                            <div className='flex mb-12 flex-row items-center gap-4'>
                                <h1 className='font-p_medium'>Date du diagnostic: </h1>
                                <Datepicker
                                    value={diagnosisDate}
                                    language="FR-fr"
                                    onSelectedDateChanged={(date) => setDiagnosisDate(date)}
                                    className='w-1/2'
                                />
                            </div>
                            <div>
                                {/* Section du selection de l'entreprise */}
                                <div className='mb-4'>
                                    <h1 className='font-p_medium'>Veuillez selectionner une entreprise Cliente : </h1>
                                </div>
                                <select
                                    className="rounded-lg mb-12 p-4 border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                                    value={chosenEntrepriseId}
                                    onChange={(e) => {
                                        setChosenEntrepriseId(e.target.value);
                                    }}
                                >
                                    <option value="">Sélectionner une Entreprise Cliente</option>
                                    {entrepriseID.map((id, index) =>
                                        <option key={id} value={id}>
                                            {entrepriseName[index]}
                                        </option>
                                    )}
                                </select>

                                {/* Section du selection de la norme */}
                                <div className='mb-4'>
                                    <h1 className='font-p_medium'>Veuillez selectionner une Norme : </h1>
                                </div>
                                <select
                                    className="rounded-lg p-4 border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                                    value={chosenNormeId}
                                    onChange={(e) => {
                                        setChosenNormeId(e.target.value);
                                    }}
                                >
                                    <option value="">Sélectionner une Norme</option>
                                    {normID.map((id, index) =>
                                        <option key={id} value={id}>
                                            {normName[index]}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className="border-t-[1px] border-gray-300"></div>
                <Modal.Footer>
                    <div className='flex items-center justify-center'>
                        <button onClick={() => setAreDiagnosisDetailsShowen(true)} className={`bg-sky-400 text-white w-full py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-x-1`}>
                            Charger le plan
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
            {areDiagnosisDetailsShown && <NewlyAddedDiagnosises chosenNormeId={chosenNormeId} chosenEntrepriseId={chosenEntrepriseId} onClose={() => setAreDiagnosisDetailsShowen(false)} />}
        </>
    );
}
