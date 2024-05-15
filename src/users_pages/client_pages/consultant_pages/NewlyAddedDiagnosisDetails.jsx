import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox } from "flowbite-react";
import Cookies from "js-cookie";
import { serverAddress } from "../../../ServerAddress";

export function NewlyAddedDiagnosises({ DiagnosisCode, chosenEntreprise, chosenNormeId, onClose }) {

  const [openModal, setOpenModal] = useState(true);
  const [normLabel, setNormLabel] = useState("");
  const [normVersion, setNormVersion] = useState(0);
  // const [chapters, setChapters] = useState([]);
  // const [criterias, setCriterias] = useState([]);
  // const [criteriaCount, setCriteriaCount] = useState(0);
  const [norms, setNorms] = useState({});

  // Function to fetch norm and its children
  useEffect(() => {
    if (normLabel !== "") {
      console.log("Already got the whole table");
    } else {
      const getNormAndChildren = async () => {
        try {
          const response = await fetch(`http://${serverAddress}:8080/api/v1/normes/${chosenNormeId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${Cookies.get("JWT")}`,
            }
          });
          const data = await response.json();
          console.log("Got the chosen norm and its children -->", data);
          setNormLabel(data.label);
          setNormVersion(data.normVersion);
          setNorms(data);
          // setChapters(data.chapitres);
          // const totalCriteriasCount = data.chapitres.reduce((total, chapter) => total + chapter.criteres.length, 0);
          // setCriteriaCount(totalCriteriasCount);
          // setCriterias(data.chapitres.map(chapter => chapter.criteres));
        } catch (error) {
          console.log("Error occurred while getting the norm and its children -->", error)
        }
      }
      getNormAndChildren();
    }
  }, []);

  return (
    <>
      <Modal show={openModal} size='xxl' onClose={onClose}>
        <Modal.Header>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-2'>
              <h1 className='font-p_medium'>Code de Diagnostic : </h1>
              <h1 className='font-p_medium text-sky-700'> {DiagnosisCode}</h1>
            </div>
            <div className='flex flex-row gap-2'>
              <h1 className='font-p_medium'>Entreprise Cliente : </h1>
              <h1 className='font-p_medium text-sky-700'> {chosenEntreprise}</h1>
            </div>
            <div className='flex flex-row gap-2'>
              <h1 className='font-p_medium'>La Norme Choisi : </h1>
              <h1 className='font-p_medium text-sky-700'> {normLabel} Version {normVersion}</h1>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Norme</th>
                <th scope="col" className="px-6 py-3">Chapitres</th>
                <th scope="col" className="px-6 py-3">Critères</th>
                <th scope="col" className="px-6 py-3">Validé / Non Validé</th>
              </tr>
            </thead>
            <tbody>
              {norms.chapitres?.map((chapitre, chapitreIndex) => (
                <React.Fragment key={chapitre.id}>
                  {chapitre.criteres.map((critere, critereIndex) => (
                    <tr key={critere.id} className="border-b">
                      <td className="px-6 py-4">
                        <span>
                          {critereIndex === 0 && chapitreIndex === 0 && (
                            <span>{norms.code}</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {critereIndex === 0 && (
                          <span>{chapitre.code}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {critere.comment}
                      </td>
                      <td className="flex gap-4 px-6 py-4">
                        <Checkbox onChange={() => console.log(critere.id)} className='h-6 w-6' />
                        <h1 className='text-red-500 font-p_medium'>Non Validé</h1>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Enregistrer</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Annuler et Faire plus tard</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
``
