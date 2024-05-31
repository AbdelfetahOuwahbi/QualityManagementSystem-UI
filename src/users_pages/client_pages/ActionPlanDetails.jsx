import React, { useState, useEffect, useRef } from 'react';
import { FileInput, Textarea, Label, Datepicker, TextInput } from 'flowbite-react';
import { extractMainRole } from '../CommonApiCalls';
import { appUrl } from '../../Url';

export default function ActionPlanDetails({ actionProperties, onClose }) {

  console.log("Action Properties received --> ", actionProperties);

  const mainUserRole = extractMainRole();

  const [isOpen, setIsOpen] = useState(true);
  //Files to be selected by the user 
  const [selectedFiles, setSelectedFiles] = useState([]);

  const drawerRef = useRef();

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative h-auto w-full">
      {isOpen && (
        <div
          className="fixed h-[100rem] inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => onClose()}
        ></div>
      )}

      <div
        ref={drawerRef}
        className={`fixed z-40 w-full h-auto overflow-y-auto bg-gradient-to-r from-sky-400 to-gray-4  00 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform transform ${isOpen ? 'duration-300 translate-y-0' : 'duration-300 translate-y-full'
          } bottom-0 left-0 right-0`}
      >
        {/* Top */}
        <div
          className="flex items-center justify-center p-5 cursor-pointer "
          onClick={() => onClose()}
        >
          <span className="w-10 h-[5.5px] bg-white rounded-lg"></span>
        </div>

        {/* Content Goes here */}

        {/* Title and Entreprise Element Section */}
        <div className='w-full flex flex-col md:flex-row gap-2 md:items-center justify-start md:justify-between px-2 md:px-14'>
          <h1 className='font-p_extra_bold md:text-xl text-white'>Vous allez entrer l'activitée que vous avez pour réaliser cette action :</h1>
          <div className='flex items-center gap-2'>
            <img src={`${appUrl}/images/organism/${localStorage.getItem("EntrepriseImage")}`}
              className='w-8 h-8 rounded-full object-cover'
              alt={localStorage.getItem("EntrepriseName")} />
            <h1 className='font-p_medium text-white'>{localStorage.getItem("EntrepriseName")}</h1>
          </div>
        </div>

        {/* After Title Upper Content Container */}
        <div className='w-full flex flex-col md:flex-row items-center gap-4 md:gap-10 pb-8 mt-4 px-2 md:px-14'>

          {/* Left Part */}
          <div className='flex w-full md:w-1/2 h-auto flex-col gap-2'>

            {/* Date Picker to select the date */}
            <div className='flex flex-row md:flex-col gap-1 w-full items-center md:items-start'>
              <h1 className='font-p_medium md:text-xl text-white'>Date </h1>
              <Datepicker
                // value={actionsDetails[currentActionIndex].deadLine}
                // onSelectedDateChanged={(date) => {
                //   const newActionsDetails = [...actionsDetails];
                //   newActionsDetails[currentActionIndex].deadLine = date;
                //   setActionsDetails(newActionsDetails);
                // }}
                className='w-full'
              />
            </div>

            {/* Activity Section */}
            <div className="flex flex-row md:flex-col gap-2 w-full items-center md:items-start">
              <Label htmlFor="action" value="Activitée" className='font-p_medium md:text-xl text-white' />
              <Textarea
                id="comment"
                placeholder="description de l'activitée ..."
                required
                rows={5}
              // value={actionsDetails[currentActionIndex].action}
              // onChange={(e) => {
              //   const newActionsDetails = [...actionsDetails];
              //   newActionsDetails[currentActionIndex].action = e.target.value;
              //   setActionsDetails(newActionsDetails);
              // }}
              />
            </div>

            {/* Activity Duration Section */}

            <div className='flex flex-col gap-2 w-full'>
              <Label htmlFor="action" value="La Durée" className='font-p_medium md:text-xl text-white' />
              <div className='flex flex-row gap-4'>
                <TextInput
                  type="number"
                  placeholder="Combie en term d'unitée choisi"
                  className="w-full"
                />
                <select
                  className="w-full p-2 font-p_regular border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="heures" className='font-p_regular'>Heures</option>
                  <option value="jours" className='font-p_regular'>Jours</option>
                  <option value="mois" className='font-p_regular'>Mois</option>
                  <option value="ans" className='font-p_regular'>Ans</option>
                </select>
              </div>
            </div>


            {/* Multiple Files input  */}
            <div className='w-full flex flex-col gap-2'>
              <div>
                <Label htmlFor="multiple-file-upload" value="Charger plusieurs Fichiers" className='font-p_medium md:text-xl text-white' />
              </div>
              <FileInput id="multiple-file-upload" multiple onChange={(e) => {
                const filesArray = Array.from(e.target.files);
                setSelectedFiles(filesArray);
              }} />
            </div>
          </div>

          {/* Right Part */}
          <div className='flex flex-row md:flex-col gap-1 md:gap-4 w-full md:w-1/2'>
          <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
              Realiser
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
              Valider
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
