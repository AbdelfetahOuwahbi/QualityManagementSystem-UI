import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
// import { Spinner } from "react-activity";

export default function SysNotifications() {

    //Loading Variables For Better UX
    const [isLoading, setIsLoading] = useState(false);

    const [notifId, setNotifId] = useState([]);
    const [notifSender, setNotifSender] = useState([]);
    const [notifReceiver, setNotifReceiver] = useState([]);
    const [notifMessage, setNotifMessage] = useState([]);
    const [notifDate, setNotifDate] = useState([]);
    const [isNotifRead, setIsNotifRead] = useState([]);

    //Ghat executa mra w7da mli ytmonta lcomponent
    //Executed Once when the compenent mounts :)
    useEffect(() => {
        async function GetAllSysAdminNotifications() {
            try {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                const response = await fetch("http://localhost:8080/api/v1/notification/allNotifications?receiverId=SysAdmin", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(data);
                if (data.length > 0) {
                    setIsLoading(false);
                    toast('De nouvelles notifications sont disponibles pour vous ..', {
                        icon: '🔔',
                        duration: 4000,
                    });

                    for (let i = 0; i < data.length; i++) {
                        setNotifId(prevState => [...prevState, data[i].id]);
                        setNotifSender(prevState => [...prevState, data[i].senderId]);
                        setNotifReceiver(prevState => [...prevState, data[i].receiverId]);
                        setNotifMessage(prevState => [...prevState, data[i].message]);
                        setNotifDate(prevState => [...prevState, data[i].createdDate]);
                        setIsNotifRead(prevState => [...prevState, data[i].read]);
                    }
                } else {
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
                console.log(error);
            }
        }
        GetAllSysAdminNotifications();
    }, [])
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
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
                            <div key={index} className="w-full mt-8 h-auto px-6 md:px-16 bg-sky-400 hover:bg-sky-100 cursor-pointer flex flex-col border-grey shadow-2xl md:rounded-lg">
                                <h2 className="p-2 font-p_medium">Message :</h2>
                                <p className='font-p_light py-2'>{notifMessage[index]}</p>
                                <div className='py-2 flex justify-between'>
                                    <h5 className='font-p_black text-gray-800'>date : {notifDate[index]}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                }

            </div>
        </>
    );
}
