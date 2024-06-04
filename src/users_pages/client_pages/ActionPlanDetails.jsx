import React, { useState, useEffect, useRef } from 'react';
import { FileInput, Textarea, Label, Datepicker, TextInput, Popover, FloatingLabel } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillDelete } from "react-icons/ai";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { extractMainRole, isTokenExpired, isTokenInCookies } from '../CommonApiCalls';
import { appUrl } from '../../Url';

export default function ActionPlanDetails({ actionProperties, onClose }) {

  console.log("Action Properties received --> ", actionProperties);

  const mainUserRole = extractMainRole();
  const userID = jwtDecode(Cookies.get("JWT")).id;
  // console.log("is it the agent --> ", userID === actionProperties.chosenAgent.id);

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
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

  const [number, unit] = actionProperties.actionDetails.length > 0 && actionProperties.actionDetails[0]?.duration
    ? actionProperties.actionDetails[0].duration.split(" ")
    : ["", ""];

  const [modifiedDetailsProperties, setModifiedDetailsProperties] = useState(
    {
      date: actionProperties.actionDetails[0]?.date,
      activity: actionProperties.actionDetails[0]?.activity,
      duration: {
        number: number,
        unit: unit
      },
      status: actionProperties.actionDetails[0]?.status,
    }
  );

  const [messageToSend, setMessageToSend] = useState("");

  //File selected by the user on update
  const [selectedFile, setSelectedFile] = useState(null);
  //Files to be selected by the user on Save
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

        //Form data that will hold both the textual properties and the files in once
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
          window.location.reload();
        } else {
          const data = await response.json();
          console.log(data.message);
          toast.error("n'a pas passer, verifier les informations ainsi que la taille des fichiers  !!")
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
      const response = await fetch(`${appUrl}/actions/details/${actionProperties.actionDetails[0]?.id}/status?newStatus=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Cookies.get("JWT")}`
        },
      });
      if (response.ok) {
        if (newStatus === "pending") {
          sendNotifToAgent(messageToSend);
        }
        console.log("Action Detail Updated Successfully ..");
        toast.success("Vous avez Validé le detail avec succés ..")
        window.location.reload();
      } else {
        const data = await response.json();
        console.log(data.message);
        toast.error("n'a pas passer, la modification a échouée  !!")
      }
    } catch (error) {
      setIsLoading(false);
      console.log("an error happened while Updating action details --> ", error);
    }
  }

  //Function that updates a detail's infos (Textual infos only)
  async function updateActionDetails(status) {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        let finalStatus = "";
        if (status) {
          finalStatus = status;
        } else {
          finalStatus = modifiedDetailsProperties.status;
        }

        console.log("the final status --> ", finalStatus);
        const response = await fetch(`${appUrl}/actions/details/${actionProperties.actionDetails[0].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          },
          body: JSON.stringify({
            "date": modifiedDetailsProperties.date,
            "activity": modifiedDetailsProperties.activity,
            "duration": modifiedDetailsProperties.duration.number + " " + modifiedDetailsProperties.duration.unit,
            "status": finalStatus,
          })
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Action Detail updated Successfully ..");
          toast.success("Vous avez modifier le detail avec succés ..")
          window.location.reload();
        } else {
          console.log(data.message);
          toast.error(`n'a pas passer, la modification a échouée a cause de ${data.message}!!`)
        }
      } catch (error) {
        console.log("Error while updating the action details --> ", error);
      }
    }
  }
  // Function that downloads all Detail associated Files
  async function downloadAllDetailFiles(detailId) {
    if (!isTokenInCookies()) {
      window.location.href = "/";
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/";
    } else {
      try {
        const response = await fetch(`${appUrl}/attach/downloadAll/${detailId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const contentDisposition = response.headers.get('Content-Disposition');
          const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : 'download.zip';
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          console.error('Failed to download files', response.statusText);
        }
      } catch (error) {
        console.log("error while downloading the files --> ", error);
      }
    }
  }


  //Function that adds a file to the detail
  async function addFile() {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      const formData = new FormData();
      formData.append("file", selectedFile)
      try {
        const response = await fetch(`${appUrl}/attach/addFile/${actionProperties.actionDetails[0].id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          console.log("File Added Successfully .. --> ", data);
          toast.success("Fichier ajouté avec succés ..");
          setSelectedFile(null);
        } else {
          console.log(data.message);
          toast.error(`n'a pas passer, le fichier n'a pas été ajouté, ressayer!!`);
          setSelectedFile(null);
        }
      } catch (error) {
        console.log("error while adding the file --> ", error);
      }
    }
  }

  //Function that deletes the file
  async function deleteFile(attachment) {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const response = await fetch(`${appUrl}/attach/deleteFile/${actionProperties.actionDetails[0].id}/${attachment}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          }
        });
        const data = await response.text();
        if (response.ok) {
          console.log("File Deleted Successfully ..");
          toast.success("Fichier supprimé avec succés ..")
        } else {
          console.log("not Okay, data is --> ", response);
          toast.error(`n'a pas passer, le fichier n'a pas été supprimé, ressayer!!`)
        }
      } catch (error) {
        console.log("error while deleting the file --> ", error);
      }
    }
  }

  //Function to send notification to the agent
  async function sendNotifToAgent(message) {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      try {
        const response = await fetch(`${appUrl}/notification/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`
          },
          body: JSON.stringify({
            'senderId': userID,
            'receiverId': actionProperties.chosenAgent.id,
            'message': `Probleme de diagnostic : ${message}`,
          })
        });
        console.log(await response.json());
      } catch (error) {
        console.log("error sending notif to agent --> ", error);
      }
    }
  }

  //The confirmation to the Operation to be executed
  const Confirmcontent = (
    <div className="w-full md:w-96 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-p_semi_bold text-gray-900 dark:text-white">Confirmation</h3>
      </div>
      <div className="flex px-3 py-2">
        <p>Verifier tous les informations avant de confirmer ..</p>
        <button onClick={() => {
          detailsProperties.status === "pending" ? saveActionDetails() :
            detailsProperties.status === "validatedForResponsable" ? saveActionDetails() :
              updateActionDetailsState("validated")
        }} className='bg-sky-400 text-white font-p_medium py-2 px-4 transition-all duration-300 rounded hover:bg-neutral-500'>
          Confirmer
        </button>
      </div>
    </div>
  );

  //The Message to Send
  const MessageContent = (
    <div className="w-full md:w-96 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-p_semi_bold text-gray-900 dark:text-white">Motif</h3>
      </div>
      <div className='flex flex-row md:flex-col gap-2 p-4'>
        <label for="motif" class="block text-sm font-medium text-gray-700">Entrer votre motif:</label>
        <textarea type="text" id="motif" name="motif" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} placeholder="Entrer votre motif ..." class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <button onClick={() => {
          updateActionDetailsState("pending");
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
          {userID === actionProperties.chosenAgent.id ? (
            <div className='flex items-center gap-2'>
              <h1 className='font-p_extra_bold md:text-xl text-white'>Vous allez entrer l'activitée que vous avez pour réaliser cette action :</h1>
              <h1 className={`font-p_extra_bold md:text-xl 
                  ${actionProperties.actionDetails[0]?.status
                  ? actionProperties.actionDetails[0].status === "pending"
                    ? "text-orange-600"
                    : actionProperties.actionDetails[0].status === "realized"
                      ? "text-orange-400"
                      : "text-green-500"
                  : ""}`
              }>
                {actionProperties.actionDetails[0]?.status ? (
                  actionProperties.actionDetails[0]?.status === "pending" ? "En cours de réalisation" :
                    actionProperties.actionDetails[0]?.status === "realized" ? "Réalisée" : "Validée"
                ) : (null)}
              </h1>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <h1 className='font-p_extra_bold md:text-xl text-white'>L'activitée efféctuée pour réaliser cette action :</h1>
              <h1 className={`font-p_extra_bold md:text-xl 
                ${actionProperties.actionDetails[0]?.status
                  ? actionProperties.actionDetails[0].status === "pending"
                    ? "text-orange-600"
                    : actionProperties.actionDetails[0].status === "realized"
                      ? "text-orange-300"
                      : "text-green-500"
                  : ""}`
              }>
                {actionProperties.actionDetails[0]?.status ? (
                  actionProperties.actionDetails[0]?.status === "pending" ? "En cours de réalisation" :
                    actionProperties.actionDetails[0]?.status === "realized" ? "Réalisée" : "Validée"
                ) : (null)}
              </h1>
            </div>
          )}

          {mainUserRole !== "Consultant" ?
            (
              <div className='flex items-center gap-2'>
                <img src={`${appUrl}/images/organism/${localStorage.getItem("EntrepriseImage")}`}
                  className='w-8 h-8 rounded-full object-cover'
                  alt={localStorage.getItem("EntrepriseName")} />
                <h1 className='font-p_medium text-white'>{localStorage.getItem("EntrepriseName")}</h1>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <img src={`${JSON.parse(localStorage.getItem("chosenEntrepriseDetails")).image}`}
                  className='w-8 h-8 rounded-full object-cover'
                  alt={JSON.parse(localStorage.getItem("chosenEntrepriseDetails")).name} />
                <h1 className='font-p_medium text-white'>{JSON.parse(localStorage.getItem("chosenEntrepriseDetails")).name}</h1>
              </div>
            )
          }

        </div>

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
                {actionProperties?.actionDetails?.length === 0 ? (
                  userID === actionProperties.chosenAgent.id ? (
                    <>
                      <h1 className='font-p_medium md:text-xl text-white'>Date </h1>
                      <Datepicker
                        value={detailsProperties.date}
                        onSelectedDateChanged={(date) => {
                          setDetailsProperties(prev => ({ ...prev, date: date }));
                        }}
                        className='w-full'
                      />
                    </>
                  ) : (
                    <>
                      <h1 className='font-p_medium md:text-xl text-white'>La Date n'est encore specifiée </h1>
                    </>
                  )
                ) : (
                  <>
                    {isModifying ? (
                      <>
                        <h1 className='font-p_medium md:text-xl text-white'>Date </h1>
                        <Datepicker
                          value={modifiedDetailsProperties.date}
                          onSelectedDateChanged={(date) => {
                            setModifiedDetailsProperties(prev => ({ ...prev, date: date }));
                          }}
                          className='w-full'
                        />
                      </>
                    ) : (
                      <>
                        <h1 className='font-p_medium md:text-xl text-white'>Date </h1>
                        <h1 className='font-p_medium md:text-xl text-gray-600'>{actionProperties.actionDetails[0]?.date.replace('T', ' a ')} </h1>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Activity Section */}
              <div className="flex flex-row md:flex-col gap-2 w-full items-center md:items-start">
                {actionProperties?.actionDetails?.length === 0 ? (
                  userID === actionProperties.chosenAgent.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <h1 className='font-p_medium md:text-xl text-white'>L'activitée n'est encore specifiée </h1>
                    </>
                  )
                ) : (
                  <>
                    {isModifying ? (
                      <>
                        <Label htmlFor="activity" value="Activitée" className='font-p_medium md:text-xl text-white' />
                        <Textarea
                          id="activity"
                          placeholder="description de l'activitée ..."
                          required
                          rows={5}
                          value={modifiedDetailsProperties.activity}
                          onChange={(e) => {
                            setModifiedDetailsProperties(prev => ({ ...prev, activity: e.target.value }));
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="activity" value="Activitée" className='font-p_medium md:text-xl text-white' />
                        <p className='font-p_regular md:text-xl text-gray-600'>{actionProperties.actionDetails[0]?.activity} </p>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Activity Duration Section */}

              <div className='flex flex-col gap-2 w-full'>
                {actionProperties?.actionDetails?.length === 0 ? (
                  userID === actionProperties.chosenAgent.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <h1 className='font-p_medium md:text-xl text-white'>La Durée n'est encore specifiée </h1>
                    </>
                  )
                ) : (
                  <>
                    {isModifying ? (
                      <>
                        <Label htmlFor="action" value="La Durée" className='font-p_medium md:text-xl text-white' />
                        <div className='flex flex-row gap-4'>
                          <TextInput
                            type="number"
                            placeholder="Combien en term d'unitée choisi"
                            className="w-full"
                            value={modifiedDetailsProperties.duration.number}
                            onChange={(e) => {
                              const newNumber = e.target.value;
                              setModifiedDetailsProperties(prev => ({
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
                            disabled={modifiedDetailsProperties.duration.number === ""}
                            value={modifiedDetailsProperties.duration.unit}
                            onChange={(e) => {
                              const newUnit = e.target.value;
                              setModifiedDetailsProperties(prev => ({
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
                      </>
                    ) : (
                      <>
                        <Label htmlFor="action" value="La Durée" className='font-p_medium md:text-xl text-white' />
                        <h1 className='font-p_medium md:text-xl text-gray-600'>{actionProperties.actionDetails[0]?.duration} </h1>
                      </>
                    )}
                  </>
                )}
              </div>


              {/* Multiple Files input  */}
              <div className='w-full flex flex-col gap-2'>
                {actionProperties?.actionDetails?.length === 0 ? (
                  userID === actionProperties.chosenAgent.id ? (
                    <>
                      <div>
                        <Label htmlFor="multiple-file-upload" value="Charger plusieurs Fichiers" className='font-p_medium md:text-xl text-white' />
                      </div>
                      <FileInput id="multiple-file-upload" multiple onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        setSelectedFiles(filesArray);
                      }} />
                    </>
                  ) : (
                    <>
                      <h1 className='font-p_medium md:text-xl text-white'>Les piéces jointes ne sont pas encore specifiées </h1>
                    </>
                  )
                ) : (
                  <>
                    {/* <DocViewer documents={
                      [
                        { data: `${appUrl}/attach/view/1_Baccalauriat.pdf`,
                      fileType : "pdf",
                      fileName : "1_Baccalauriat.pdf"
                      },
                      ]
                    } pluginRenderers={DocViewerRenderers}/> */}
                    {isModifying ? (
                      <>
                        <div className='flex flex-col gap-2 w-full'>
                          <Label value="Voici les fichiers chargés" className='font-p_medium md:text-xl text-white' />
                          <div className='flex gap-2 w-1/2'>
                            {actionProperties.actionDetails[0]?.attachments.map((attachment, index) =>
                              <div key={index} className='flex items-center justify-center gap-3'>
                                <AiFillDelete onClick={() => { deleteFile(attachment) }} className='w-5 h-5 text-red-500 cursor-pointer' />
                                <a href={`${appUrl}/attach/view/${attachment}`} target="_blank" className='font-p_light text-yellow-200'>{attachment.replace(/^\d+_/, '')}</a>
                                <div className='border-r border-black py-1 h-6'></div>
                              </div>
                            )}
                          </div>
                          <Label htmlFor="multiple-file-upload" value="Charger fichier par fichier" className='font-p_medium md:text-xl text-white' />
                          <div className='flex-1 justify-start gap-2'>
                            <FileInput id="multiple-file-upload" onChange={(e) => {
                              setSelectedFile(e.target.files[0]);
                            }} />
                            {selectedFile !== null &&
                              <a onClick={() => addFile()} className='font-p_medium text-white'>Ajouter</a>
                            }
                          </div>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => downloadAllDetailFiles(actionProperties.actionDetails[0].id)} className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none'>
                        Télécharger tous les fichiers ajoutés a ce detail
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Part */}
            <div className='flex flex-row md:flex-col gap-1 md:gap-4 w-full md:w-1/2'>

              {actionProperties?.actionDetails?.length > 0 ? (
                (actionProperties.actionDetails[0]?.status === "pending" && mainUserRole === "Pilot" ? (
                  <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
                ) : actionProperties.actionDetails[0]?.status === "realized" && mainUserRole === "Responsable" && (
                  <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
                ))
              ) : actionProperties?.actionDetails?.length === 0 && userID === actionProperties.chosenAgent.id && (
                <h1 className='font-p_medium md:text-xl text-white'>Marquer le status de ce Detail :</h1>
              )}

              {mainUserRole === "Pilot" && (
                (actionProperties.actionDetails?.length === 0 && (
                  <Popover content={Confirmcontent} placement="top">
                    <button
                      onClick={() => setDetailsProperties(prev => ({ ...prev, status: "pending" }))}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      Enregistrer
                    </button>
                  </Popover>
                ))
              )}

              {actionProperties?.actionDetails?.length > 0 &&
                mainUserRole !== "Consultant" &&
                userID === actionProperties.chosenAgent.id &&
                actionProperties.actionDetails[0]?.status === "pending" && (
                  isModifying ? (
                    <>
                      <button
                        onClick={() => { updateActionDetails() }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                      >
                        Confirmer La modification
                      </button>
                      {actionProperties.actionDetails[0]?.status !== "realized" &&

                        <button
                          onClick={() => { updateActionDetails("realized") }}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                        >
                          Marque comme réalisée
                        </button>
                      }

                      <button
                        onClick={() => setIsModifying(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsModifying(!isModifying)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      Modifier
                    </button>
                  )
                )}



              {mainUserRole === "Responsable" &&
                (
                  actionProperties?.actionDetails?.length > 0 ? (
                    (userID === actionProperties.chosenAgent.id ? (
                      (actionProperties.actionDetails[0]?.status === "pending" && (
                        <Popover content={Confirmcontent} placement="top">
                          <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "validatedForResponsable" }))} className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                            Valider
                          </button>
                        </Popover>
                      ))
                    ) : actionProperties.actionDetails[0]?.status === "realized" && (
                      <>
                        <Popover content={Confirmcontent} placement="top">
                          <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "validatedForPilot" }))} className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                            Valider
                          </button>
                        </Popover>
                        <Popover content={MessageContent} placement="top">
                          <button className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                            Marquer comme en cours de réalisation
                          </button>
                        </Popover>
                      </>
                    ))
                  ) : userID === actionProperties.chosenAgent.id && (
                    <Popover content={Confirmcontent} placement="top">
                      <button onClick={() => setDetailsProperties(prev => ({ ...prev, status: "validatedForResponsable" }))} className="bg-green-500 font-p_medium text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                        Valider
                      </button>
                    </Popover>
                  )
                )

              }
            </div>
          </motion.div>

        </AnimatePresence>
      </div>
    </div >
  );
}
