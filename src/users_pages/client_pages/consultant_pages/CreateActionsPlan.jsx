import React, { useState } from 'react'
import { Modal, Button, Datepicker, FileInput, Label, Textarea } from 'flowbite-react';

export default function CreateActionsPlan({ criteriaId, criteriaDesc, diagnosisId, onClose }) {

  const [openModal, setOpenModal] = useState(true);

  const [chosenRespPilId, setChosenRespPilId] = useState('');
  const [deadLine, setDeadLine] = useState(new Date());

  const responsibles = [
    {

    }
  ]

  async function submitAction() {

  }

  return (
    <>
      <Modal show={openModal} size="xl" popup onClose={onClose}>
        <Modal.Header>
          <div className='flex flex-col gap-4 p-4 justify-center'>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Plan d'actions </h3>
            <h4 className='font-p_extra_light text-sky-600'>Vous pouvez ajouter plusieur actions !</h4>
          </div>
        </Modal.Header>
        <div className="border-t-[1px] border-gray-300"></div>
        <Modal.Body>
          <div className="">
            <div className='flex py-10 flex-col'>
              <div className='mb-8 flex items-center flex-row gap-4'>
                <h1 className='font-p_semi_bold'>Critére : </h1>
                <h1 className='font-p_black text-xl text-green-500'> {criteriaDesc}</h1>
              </div>
              <div className='flex mb-6 flex-row items-center gap-4'>
                <h1 className='font-p_semi_bold'>DeadLine : </h1>
                <Datepicker
                  value={deadLine}
                  language="FR-fr"
                  onSelectedDateChanged={(date) => setDeadLine(date)}
                  className='w-1/2'
                />
              </div>
              <div>

                <div className="max-w-md mb-8">
                  <div className="mb-2 block">
                    <Label htmlFor="action" value="Action" className='font-p_semi_bold' />
                  </div>
                  <Textarea id="comment" placeholder="L'action ..." required rows={4} />
                </div>

                <div className='flex flex-col gap-2 mb-10'>
                <div>
                  <Label htmlFor="file-upload-helper-text" value="Ajouter piéce jointe .." />
                </div>
                <FileInput id="file-upload-helper-text" helperText="DOCX, PNG, JPG ou PDF (MAX. 5Mb)." />
                </div>

                {/* Section du selection de l'entreprise */}
                <div className='mb-4'>
                  <h1 className='font-p_semi_bold'>Veuillez séléctionner un reponsable sur cette action : </h1>
                </div>

                <select
                  className="rounded-lg mb-12 p-4 border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-cyan-500 dark:focus:ring-cyan-500 block w-full sm:text-sm"
                  value={chosenRespPilId}
                  onChange={(e) => {
                    setChosenRespPilId(e.target.value);
                  }}
                >
                  <option value="">Séléctionner le responsable sur l'action</option>
                  {/* {entrepriseID.map((id, index) => */}
                  {/* <option key={id} value={id}> */}
                  <option>
                    {/* {entrepriseName[index]} */}
                    Responsable ou pilote
                  </option>
                  {/* )} */}
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="border-t-[1px] border-gray-300"></div>
        <Modal.Footer>
          <div className='flex items-center gap-2 w-full'>
            <button onClick={submitAction} className={`bg-sky-400 text-white w-full py-2 px-4 font-p_medium transition-all duration-300 rounded-lg hover:translate-y-1`}>
              Ajouter une action
            </button>
            <Button onClick={() => setOpenModal(false)} color="gray" className='w-full font-p_medium transition-all duration-300 hover:translate-y-1'>Terminer et fermer</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
