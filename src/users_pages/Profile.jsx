import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MdEditNote } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { FaBars } from 'react-icons/fa6';
import { CiCamera } from "react-icons/ci";
import { FloatingLabel } from 'flowbite-react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { isTokenExpired, isTokenInCookies, extractMainRole } from './CommonApiCalls';
import toast, { Toaster } from 'react-hot-toast';
import profileImg from '../assets/profile.jpg';
import { serverAddress } from '../ServerAddress';
import SysMainPage from './sysAdmin_pages/SysMainPage';
import ClientMainPage from './client_pages/ClientMainPage';

export default function Profile() {

  const navigate = useNavigate();

  //Ill get the token from cookies
  const token = Cookies.get("JWT");
  //then Ill decode it !!
  const decoded = jwtDecode(token);
  //then Ill extact the id to send
  const userID = decoded.id;
  console.log("user id that we will send to change the informations-->", userID);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startedEditing, setStartedEditing] = useState(false);

  // The main role of a user
  const mainUserRole = extractMainRole();

  const [userDetails, setUserDetails] = useState(
      {
        id: "",
        image: "",
        accountNonLocked: "",
        createdDate: "",
        email: "",
        firstname: "",
        lastname: "",
        lastModifiedDate: "",
        phone: "",
        profileImage: null,
        organism: "",
        entreprise: "",
      } || {

      }
  )

  //I used this state to toogle the visibility of the camera icon
  const [isHovered, setIsHovered] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const GetMyData = async () => {
      let PropreEndP = "";
      switch (mainUserRole) {
        case "Sysadmin":
          PropreEndP = `http://${serverAddress}:8080/api/v1/sysadmins/${userID}`;
          break;
        case "Consultant":
          PropreEndP = `http://${serverAddress}:8080/api/v1/users/consultants/${userID}`;
          break;
        case "Admin":
          PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprise/admins/${userID}`;
          break;
        case "Responsable":
          PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprise/responsableQualites/${userID}`;
          break;
        case "Pilot":
          PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprises/pilots/${userID}`;
          break;
      }
      console.log(PropreEndP)
      try {
        const response = await fetch(PropreEndP, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ` Bearer ${Cookies.get("JWT")}`
          }
        });
        // console.log("response at profile-->", response)
        const data = await response.json();
        console.log("got user from database -->", data.id)
        setUserDetails(prev => ({ ...prev, id: data.id }));
        setUserDetails(prev => ({ ...prev, accountNonLocked: data.accountNonLocked }));
        setUserDetails(prev => ({ ...prev, createdDate: data.createdDate }));
        setUserDetails(prev => ({ ...prev, lastModifiedDate: data.lastModifiedDate }));
        setUserDetails(prev => ({ ...prev, firstname: data.firstname }));
        setUserDetails(prev => ({ ...prev, lastname: data.lastname }));
        setUserDetails(prev => ({ ...prev, email: data.email }));
        setUserDetails(prev => ({ ...prev, phone: data.phone }));
        setUserDetails(prev => ({ ...prev, profileImage: data.imagePath }));
        {
          mainUserRole === "Consultant" ? (
              setUserDetails(prev => ({ ...prev, organism: data.organismeDeCertification.id }))
          ) : mainUserRole === "Admin" ? (
              setUserDetails(prev => ({ ...prev, entreprise: data.entreprise.id }))
          ) : mainUserRole === "Responsable" ? (
              setUserDetails(prev => ({ ...prev, entreprise: data.entreprise.id }))
          ) : mainUserRole === "Pilot" ? (
              setUserDetails(prev => ({ ...prev, entreprise: data.entreprise.id }))
          ) : null
        }
      } catch (error) {
        console.log(error);
      }
    }
    GetMyData();
  }, [])

  //Function that updates a user's profile
  const updateProfile = async (userDetails) => {
    // Vérification de la validité du jeton
    if (!isTokenInCookies()) {
      navigate("/");
    } else if (isTokenExpired()) {
      Cookies.remove("JWT");
      navigate("/");
    } else {
      try {
        let PropreEndP = "";
        switch (mainUserRole) {
          case "Sysadmin":
            PropreEndP = `http://${serverAddress}:8080/api/v1/sysadmins/${userDetails.id}`;
            break;
          case "Consultant":
            PropreEndP = `http://${serverAddress}:8080/api/v1/users/consultants/${userDetails.id}?organismeId=${userDetails.organism}`;
            break;
          case "Admin":
            PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprise/admins/${userDetails.id}?entrepriseId=${userDetails.entreprise}`;
            break;
          case "Responsable":
            PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprise/responsableQualites/${userDetails.id}?entrepriseId=${userDetails.entreprise}`;
            break;
          case "Pilot":
            PropreEndP = `http://${serverAddress}:8080/api/v1/users/entreprises/pilots/${userDetails.id}?entrepriseId=${userDetails.entreprise}`;
            break;
        }
        const response = await fetch(PropreEndP, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get("JWT")}`,
          },
          body: JSON.stringify({
            "firstname": userDetails.firstname,
            "lastname": userDetails.lastname,
            "email": userDetails.email,
            "phone": userDetails.phone,
          }),
        });
        console.log("first, the response is -->", response);
        if (response.status === 200 || response.status === 201) {
          toast.success("Votre informations sont modifiées avec succès.");
        }
      } catch (error) {
        console.error(error); // Gérer les erreurs
        toast.error("Une erreur s'est produite lors de la modification de vos informations.");
      }
    }
  };

  //Function that changes the user's profile Image
  const changeProfileImage = async (event) => {

    //Appending the image to the Form data
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    console.log("image to be uploaded -->", event.target.files[0]);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/public/upload/${userID}`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        // the reader that will be filled with the image's buffer (data)
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result); // Set profileImg to the data URL of the uploaded image
        };
        reader.readAsDataURL(event.target.files[0]);
        toast.success("Votre photo de profil a été changée avec succés ..");
        console.log('Image uploaded successfully');
      } else {
        const data = await response.json();
        if (data.message === "File size exceeds the maximum limit of 5MB") {
          console.error('File size exceeds the maximum limit of 5MB');
          toast.error("La taille du fichier dépasse la limite maximale de 5 Mo !!");
        } else if (data.message === "Only PNG and JPG image uploads are allowed") {
          console.error('Only PNG and JPG image uploads are allowed');
          toast.error("Seuls les téléversements d'images PNG, JPG et JPEG sont autorisés !!");
        }
        console.error('Failed to upload image, response is not ok !!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex p-4 w-full justify-between">
          {/* Bars Icon That toogles the visibility of the menu */}
          <FaBars onClick={() => setIsMenuOpen(!isMenuOpen)} className='w-6 h-6 cursor-pointer text-neutral-600' />
        </div>

        <div className='border-t border-gray-300 py-4'></div>

        <section className="w-full h-auto">
          <div className="flex flex-col">
            {/* <!-- Profile Image --> */}
            <div className="mx-4 md:mx-32 flex flex-row items-center justify-between">
              <div className='flex items-center justify-start gap-4 relative'>
                {/* Profile Image */}
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className='hidden'
                    onChange={changeProfileImage}
                />
                <label htmlFor="fileInput">
                  <img
                      src={uploadedImage === null ? (userDetails.profileImage === null ? (`http://${serverAddress}:8080/api/v1/images/user.png`) : (`http://${serverAddress}:8080/api/v1/images/${userDetails.profileImage}`)) : (uploadedImage)}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      alt="Votre profile"
                      className="w-16 h-16 md:w-32 md:h-32 cursor-pointer rounded-full transition duration-300 hover:opacity-80 hover:scale-110 object-cover" />
                </label>
                {/* Online Indicator Icon */}
                <TbPointFilled className='absolute w-6 h-6 md:w-10 md:h-10 ml-12 mb-10 md:mb-20 md:ml-24 rounded-full text-green-400 bg-white' />
                {isHovered &&
                    <CiCamera className='absolute w-6 h-6 md:w-10 md:h-10 ml-5 mb-2 md:mb-2 md:ml-12 text-white cursor-pointer' />
                }
                {/* FullName */}
                <h1 className="text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                  {userDetails.firstname}
                </h1>
              </div>


              <div className='flex flex-row items-center gap-1'>
                {!startedEditing ? (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                      <MdEditNote onClick={() => setStartedEditing(!startedEditing)} className='w-10 h-10 cursor-pointer' />
                    </motion.div>
                ) : (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='cursor-pointer'
                        onClick={() => {
                          setStartedEditing(false);
                          updateProfile(userDetails)
                        }}
                    >
                      <FaCheck className='w-8 h-8 cursor-pointer' />
                    </motion.div>
                )}
              </div>

            </div>

            <div
                className="flex flex-col gap-4 px-2 md:px-10 py-4 md:py-14">
              {/* <!-- Description --> */}
              <p className="md:mx-10 w-fit text-gray-700 dark:text-gray-400 text-center text-md">Lorem, ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem
                veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore
                similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic
                eligendi vitae animi nam in, est earum culpa illum aliquam.</p>


              {/* <!-- Detail --> */}
              <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                <div className="mx-6 w-full flex md:flex-row flex-col gap-2 justify-center">
                  <div className="w-full">
                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Prénom</dt>
                        {startedEditing ? (
                            <FloatingLabel variant="outlined" type='text' value={userDetails.firstname} label="Prénom"
                                           onChange={(e) => setUserDetails(prev => ({ ...prev, firstname: e.target.value }))}
                            />
                        ) : (
                            <dd className="text-lg font-semibold">{userDetails.firstname}</dd>
                        )}
                      </div>
                      <div className="flex flex-col py-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Nom</dt>
                        {startedEditing ? (
                            <FloatingLabel variant="outlined" type='text' value={userDetails.lastname} label="Prénom"
                                           onChange={(e) => setUserDetails(prev => ({ ...prev, lastname: e.target.value }))}
                            />
                        ) : (
                            <dd className="text-lg font-semibold">{userDetails.lastname}</dd>
                        )}
                      </div>
                      <div className="flex flex-col py-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Compte lancé en</dt>
                        <dd className="text-lg font-semibold">{userDetails.createdDate.substring(0, 10)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="w-full">
                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">

                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">numéro de téléphone</dt>
                        {startedEditing ? (
                            <FloatingLabel variant="outlined" type='text' value={userDetails.phone} label="Prénom"
                                           onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        ) : (
                            <dd className="text-lg font-semibold">+212 {userDetails.phone}</dd>
                        )}
                      </div>
                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Email</dt>
                        <dd className="text-lg font-semibold">{userDetails.email}</dd>
                      </div>

                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 text-gray-500 md:text-lg font-p_bold dark:text-gray-400">Status actuel</dt>
                        <dd className={`text-lg font-semibold ${userDetails.accountNonLocked === true ? "text-green-500" : "text-red-500"} `}>En ligne | {userDetails.accountNonLocked === true ? "Compte Activé" : "Compte Désactivé"}</dd>
                      </div>
                    </dl>
                  </div >
                </div >
              </div >

            </div >
          </div >
        </section >
        {mainUserRole === "Sysadmin" ? (
            isMenuOpen && <SysMainPage onClose={() => setIsMenuOpen(false)} />
        ) : (
            isMenuOpen && <ClientMainPage onClose={() => setIsMenuOpen(false)} />
        )}
      </>
  )
}