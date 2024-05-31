import React, { useState, useEffect, useRef } from 'react';
import { FileInput, Textarea, Label, Datepicker, TextInput, Popover } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { extractMainRole, isTokenExpired, isTokenInCookies } from '../CommonApiCalls';
import { appUrl } from '../../Url';
import { jwtDecode } from 'jwt-decode';
import {motion,  AnimatePresence } from 'framer-motion';

export default function ActionPlanDetails({ actionProperties, onClose }) {

  console.log("Action Properties received --> ", actionProperties);

  const mainUserRole = extractMainRole();
  const userID = jwtDecode(Cookies.get("JWT")).id;

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  //ActionDetails Properties
  const [detailsProperties, setDetailsProperties] = useState(
    {
      date: new Date(),
      activity: "",
      duration: {
        number: "",
        unit: ""
      },
      status: "",
    }
  );
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

  //Function that Saves the details (Only if the agent is the current user himself)
  async function saveActionDetails() {
    setIsLoading(true);
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {

        const formData = new FormData();
        const isoDateString = detailsProperties.date.toISOString();
        const formattedDateString = isoDateString.slice(0, -1);
        formData.append("date", formattedDateString);
        formData.append("activity", detailsProperties.activity);
        let newStatus; // Important to help us know whose gonna be affected (respo or pilot)
        if (detailsProperties.status === "validatedForResponsable") {
          newStatus = "validated";
        } else {
          newStatus = detailsProperties.status;
        }
        formData.append("status", newStatus);
        formData.append("duration", detailsProperties.duration.number + " " + detailsProperties.duration.unit);

        selectedFiles.forEach((file, index) => {
          formData.append(`files`, file);
        });
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }
        const response = await fetch(`${appUrl}/actions/details/${actionProperties.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          },
          body: formData
        });
        if (response.ok) {
          console.log("Action Detail Inserted Successfully ..");
          toast.success("Vous avez marquer le detail avec succés ..")
        } else {
          const data = await response.json();
          console.log(data.message);
          toast.success("n'a pas passer, verifier les informations ainsi que la taille des fichiers  !!")
        }
      } catch (error) {
        setIsLoading(false);
        console.log("an error happened while saving action details --> ", error);
      }
    }
  }

  //Function that updates the status of a given ActionDetails
  async function updateActionDetailsState(newStatus) {
    try {
      const response = await fetch(`${appUrl}/actions/details/${actionProperties.id}/status?newStatus=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        },
      });
      if (response.ok) {
        console.log("Action Detail Updated Successfully ..");
        toast.success("Vous avez Validé le detail avec succés ..")
        window.location.reload();
      } else {
        const data = await response.json();
        console.log(data.message);
        toast.success("n'a pas passer, la modification a échouée  !!")
      }
    } catch (error) {
      setIsLoading(false);
      console.log("an error happened while Updating action details --> ", error);
    }
  }

  const Confirmcontent = (
    <div className="w-full md:w-96 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-p_semi_bold text-gray-900 dark:text-white">Confirmation</h3>
      </div>
      <div className="flex px-3 py-2">
        <p>Verifier tous les informations avant de confirmer ..</p>
        <button onClick={() => {
          detailsProperties.status === "realized" ? saveActionDetails() :
            detailsProperties.status === "validatedForResponsable" ? saveActionDetails() :
              updateActionDetailsState("validated")
        }} className='bg-sky-400 text-white font-p_medium py-2 px-4 transition-all duration-300 rounded hover:bg-neutral-500'>
          Confirmer
        </button>
      </div>
    </div>
  );

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

        {mainUserRole !== "Consultant" ? (

          <AnimatePresence>
            {/* After Title Upper Content Container  */}
            < motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='w-full flex flex-col md:flex-row items-center gap-4 md:gap-10 pb-8 mt-4 px-2 md:px-14'>

              {/* Left Part */}
              <div className='flex w-full md:w-1/2 h-auto flex-col gap-2'>

                {/* Date Picker to select the date */}
                <div className='flex flex-row md:flex-col gap-1 w-full items-center md:items-start'>
                  <h1 className='font-p_medium md:text-xl text-white'>Date </h1>
                  <Datepicker
                    value={detailsProperties.date}
                    onSelectedDateChanged={(date) => {
                      setDetailsProperties(prev => ({ ...prev, date: date }));
                    }}
                    className='w-full'
                  />
                </div>

                {/* Activity Section */}
                <div className="flex flex-row md:flex-col gap-2 w-full items-center md:items-start">
                  <Label htmlFor="activity" value="Activitée" className='font-p_medium md:text-xl text-white' />
                  <Textarea
                    id="activity"
                    placeholder="description de l'activitée ..."
                    required
                    rows={5}
                    value={detailsProperties.activity}
                    onChange={(e) => {
                      setDetailsProperties(prev => ({ ...prev, activity: e.target.value }));
                    }}
                  />
                </div>

                {/* Activity Duration Section */}

                <div className='flex flex-col gap-2 w-full'>
                  <Label htmlFor="action" value="La Durée" className='font-p_medium md:text-xl text-white' />
                  <div className='flex flex-row gap-4'>
                    <TextInput
                      type="number"
                      placeholder="Combien en term d'unitée choisi"
                      className="w-full"
                      value={detailsProperties.duration.number}
                      onChange={(e) => {
                        const newNumber = e.target.value;
                        setDetailsProperties(prev => ({
                          ...prev,
                          duration: {
                            number: newNumber,
                            unit: newNumber && !prev.duration.unit ? "heures" : prev.duration.unit // set default unit to "heures" if unit is empty
                          }
                        }));
                      }}
                    />
                    <select
                      className="w-full p-2 font-p_regular border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      disabled={detailsProperties.duration.number === ""}
                      value={detailsProperties.duration.unit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        setDetailsProperties(prev => ({
                          ...prev,
                          duration: {
                            ...prev.duration,
                            unit: newUnit
                          }
                        }));
                      }}
                    >
                      <option value="" disabled>Séléctionner une Unitée</option>
                      <option value=" heures" className='font-p_regular'>Heures</option>
                      <option value=" jours" className='font-p_regular'>Jours</option>
                      <option value=" mois" className='font-p_regular'>Mois</option>
                      <option value=" ans" className='font-p_regular'>Ans</option>
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
                {actionProperties?.actionDetails?.length === 0 ?
                  <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
                  : actionProperties?.actionDetails[0]?.status === "realized" ?
                    <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
                    : null}

                {mainUserRole === "Pilot" && userID === actionProperties.chosenAgent.id &&
                  <Popover content={Confirmcontent} placement="top">
                    <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "realized" }))} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
                      Realiser
                    </button>
                  </Popover>
                }
                {mainUserRole === "Responsable" &&
                  (
                    actionProperties?.actionDetails?.length === 0 ? (
                      <Popover content={Confirmcontent} placement="top">
                        <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "validatedForResponsable" }))} className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                          Valider
                        </button>
                      </Popover>
                    ) : actionProperties?.actionDetails[0]?.status !== "validated" ? (
                      <Popover content={Confirmcontent} placement="top">
                        <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "validatedForPilot" }))} className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                          Valider
                        </button>
                      </Popover>
                    ) : (null)
                  )

                }
              </div>
            </motion.div>

          </AnimatePresence>
        ) : (
          // After Title Upper Content Container 
          < div className='w-full flex flex-col md:flex-row items-center gap-4 md:gap-10 pb-8 mt-4 px-2 md:px-14'>

          </div>
        )}

      </div>
    </div >
  );
}
