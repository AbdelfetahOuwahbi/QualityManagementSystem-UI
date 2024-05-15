import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import Cookies from "js-cookie";
import { serverAddress } from "../../../ServerAddress";

export function NewlyAddedDiagnosises({DiagnosisCode, chosenEntrepriseId, chosenNormeId, onClose }) {

  console.log("received Diagnosis Code -->", DiagnosisCode);
  console.log("received Entreprise ID -->", chosenEntrepriseId);
  console.log("received Norm ID -->", chosenNormeId);


  const [openModal, setOpenModal] = useState(true);

  const [normAndChildren, setNormAndChildren] = useState({});

  //Function that gets the norm and the chapters and the criterias
  useEffect(() => {
    if (Object.keys(normAndChildren).length > 0) {
      console.log("Already get the whole Table");
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
          console.log("Got the chosen norm and its children -->",data);
          setNormAndChildren(data)
        } catch (error) {
          console.log("error happened while getting the norm and its children -->", error)
        }
      }
      getNormAndChildren();
    }
  }, [])

  return (
    <>
      <Modal show={openModal} size='xxl' onClose={onClose}>
        <Modal.Header>
          <div className='flex flex-col gap-4'>
            <h1>Code de Diagnostic :  </h1>
            <h1>Entreprise Cliente :  {chosenEntrepriseId}</h1>
            <h1>La Norme Choisi :  {chosenNormeId}</h1>
          </div>
        </Modal.Header>
        <Modal.Body>

          <table id="consultantsTable"
            className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Norme</th>
                <th scope="col" className="px-6 py-3">Chapitre</th>
                <th scope="col" className="px-6 py-3">Critère</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td className="px-6 py-4" rowSpan="9">Category 1</td> {/* rowSpan'll be the addition of lengths of chapter & criteria*/}
                <td className="px-6 py-4" rowSpan="3">Subcategory 1.1</td> {/* rowSpan'll be the length of criteria array*/}
                <td className="px-6 py-4">Critère 1.1.1</td>
              </tr>

              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.1.2</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.1.3</td>
              </tr>

              <tr className="border-b">
                <td className="px-6 py-4" rowSpan="3">Subcategory 1.2</td>
                <td className="px-6 py-4">Critère 1.2.1</td>
              </tr>

              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.2.2</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.2.3</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4" rowSpan="3">Subcategory 1.3</td>
                <td className="px-6 py-4">Critère 1.3.1</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.3.2</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4">Critère 1.3.3</td>
              </tr>

            </tbody>
          </table>


        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
