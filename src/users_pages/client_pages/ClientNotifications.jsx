import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Spinner } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { getAllNotifications } from "../CommonApiCalls";
import { markNotificationAsRead } from "../CommonApiCalls";
import { isTokenExpired, isTokenInCookies } from "../CommonApiCalls";
import ClientMainPage from "./ClientMainPage";

export default function ClientNotifications() {

  const userID = jwtDecode(Cookies.get("JWT")).id;

  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  //Loading Variables For Better UX
  const [isLoading, setIsLoading] = useState(false);
  //To show the notification details under the notif card
  const [notifDetailsShowen, setNotifDetailsShowen] = useState([]);

  //Notification Properties
  const [notifId, setNotifId] = useState([]);
  // const [notifSender, setNotifSender] = useState([]);
  // const [notifReceiver, setNotifReceiver] = useState([]);

  const [notifMessage, setNotifMessage] = useState([]);

  const [notifDate, setNotifDate] = useState([]);
  const [isNotifRead, setIsNotifRead] = useState([]);

  //Ghat executa mra w7da mli ytmonta lcomponent
  //Executed Once when the compenent mounts :)
  useEffect(() => {
    if (!isTokenInCookies()) {
      window.location.href = "/"
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      window.location.href = "/"
    } else {
      if (notifId.length === 0) {
        const GetAllClientNotifications = async () => {
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const data = await getAllNotifications(userID, Cookies.get("JWT"));
            console.log("data-->", data.length);
            if (data.length > 0) {
              let newNotifs = 0;
              for (let i = 0; i < data.length; i++) {
                if (!data[i].read) {
                  newNotifs++;
                }
              }
              setIsLoading(false);
              console.log(newNotifs);
              if (newNotifs > 0) {
                toast('De nouvelles notifications sont disponibles pour vous ..', {
                  icon: '🔔',
                  duration: 4000,
                });
              }

              for (let i = 0; i < data.length; i++) {
                setNotifId(prevState => [...prevState, data[i].id]);
                // setNotifSender(prevState => [...prevState, data[i].senderId]);
                // setNotifReceiver(prevState => [...prevState, data[i].receiverId]);
                setNotifMessage(prevState => [...prevState, data[i].message]);
                setNotifDate(prevState => [...prevState, data[i].createdDate]);
                setIsNotifRead(prevState => [...prevState, data[i].read]);
                setNotifDetailsShowen(prevState => [...prevState, false]);
              }
            } else {
              setIsLoading(false);
              toast(`Aucune nouvelle notification n'est disponible pour le moment ..`, {
                icon: '🔔',
                duration: 4000,
              });
            }
          } catch (error) {
            setIsLoading(false);
            toast.error("Nous avons rencontré un problème. Veuillez réessayer ultérieurement !!", {
              duration: 4000,
            });
          }
        }
        GetAllClientNotifications();
      } else {
        console.log("already got Notifications");
      }
    }
  }, [])

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <div className="flex p-4 w-full justify-between">
        {/* Bars Icon That toogles the visibility of the menu */}
        <FaBars onClick={() => setIsClientMenuOpen(!isClientMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
      </div>

      <div className='border-t border-gray-300 py-4'></div>

      <div className="w-full h-auto flex flex-col">
        <div className="w-full h-10 py-7 px-4 md:px-14 flex items-center">
          <h1 className='text-4xl font-p_bold'>Notifications</h1>
          {/* Activity Indicator Goes here */}
          {isLoading &&
            <Spinner className="w-8 h-8 ml-12" aria-label="Default status example" />
          }
        </div>
        <div className='border-t border-gray-300 w-96'></div>
        {/* Notifications That we got */}
        {notifId.length > 0 &&
          <div className="flex w-full h-auto flex-col md:mt-10 justify-around md:px-14 py-2">
            {notifId.map((notif, index) => (
              <>
                <div key={index} onClick={() => {
                  !isNotifRead[index] ? markNotificationAsRead(notifId[index], Cookies.get("JWT")) : null
                  // Toogling the variable to show the notif details
                  setNotifDetailsShowen(prevState => {
                    const newState = [...prevState];
                    newState[index] = !newState[index];
                    return newState;
                  });
                  setIsNotifRead(prevState => {
                    const newState = [...prevState];
                    newState[index] = true;
                    return newState;
                  });
                }} className={`w-full mt-8 h-auto px-6 md:px-16 ${!isNotifRead[index] ? "bg-sky-400 hover:bg-sky-200" : "bg-sky-100"} cursor-pointer flex flex-col border-grey shadow-2xl md:rounded-lg`}>
                  <h2 className="p-2 font-p_medium">Message :</h2>
                  <p className='font-p_light py-2'>{notifMessage[index]}</p>
                  <div className='py-2 flex justify-between'>
                    <h5 className='font-p_black text-gray-800'>date : {notifDate[index]}</h5>
                    {
                      notifDetailsShowen[index] ? (
                        <IoIosArrowUp className="w-8 h-8" />
                      ) : (
                        <IoIosArrowDown className="w-8 h-8" />
                      )
                    }
                  </div>
                </div>
                {/* Notif Details To be showen by clicking on the Notifications itself */}
                <AnimatePresence mode="wait">
                  {notifDetailsShowen[index] && (
                    <>
                      <div className='border-t border-black w-1/2'></div>
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-auto flex flex-col py-4 md:rounded-b-lg bg-white shadow-2xl"
                      >
                        <h1 className='text-2xl font-p_medium py-5 pl-8'>Details : </h1>

                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ))}
          </div>
        }

      </div>
      {isClientMenuOpen && <ClientMainPage onClose={() => setIsClientMenuOpen(false)} />}
    </>
  );
}
