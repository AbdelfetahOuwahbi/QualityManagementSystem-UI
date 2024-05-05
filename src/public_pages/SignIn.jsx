import { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import Contact from "./Contact";

export default function SinIn({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Contact Modal visibility Controller
    const [contactVisible, setContactVisible] = useState(false);

    const handleSignIn = async (email, password) => {
        if (email === '' || password === '') {
            toast.error("Tous les champs sont obligatoires !!");
        } else {
            try {
                const response = await fetch("http://localhost:8080/api/v1/auth/signin", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'email': email,
                        'password': password
                    }),
                });
                const data = await response.json();
                console.log(data)
                switch (data.message) {
                    case "Successfully Signed In":
                        toast.success("Vous avez été authentifié avec succès ..");
                        const decoded = jwtDecode(data.token);
                        console.log("User Roles", data.user.roles);
                        console.log("User Token is", data.token);
                        console.log("User's Email from Decoded JWT is ---> ", decoded);
                        // Setting the JWT token, and User Roles in a cookie with an expiration time of 7 days
                        Cookies.set('JWT', data.token, { expires: 7 });
                        Cookies.set('userRoles', JSON.stringify(data.user.roles), { expires: 7 });
                        //Checking the type of user and redirecting accordingly 
                        if (data.user.roles.some(role => role.name === "Sysadmin")) {
                            window.location.href = "/SysAdmin";
                        } else {
                            window.location.href = "/";
                        }
                        break;
                    case "Password must be at least 8 characters long":
                        toast.error("Le mot de passe doit comporter au minimum 8 caractères !!");
                        break;
                    case "Authentication failed: Bad credentials":
                        toast.error("L'utilisateur n'existe pas !!");
                        break;
                    default:
                        toast.error("Vérifiez votre connexion Internet et réessayez !!");
                        break;
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
            <Modal className='mt-20 md:mt-0' show={contactVisible ? false : true} size="md" onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">S'authentifier</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Votre mail" />
                            </div>
                            <TextInput
                                id="email"
                                placeholder="eg: nom@company.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Votre mot de passe" />
                            </div>
                            <TextInput id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                        </div>
                        <div className="flex justify-between">
                            <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                                mot de passe oublier?
                            </a>
                        </div>
                        <div className="w-full">
                            <Button onClick={() => handleSignIn(email, password)}>S'authentifier</Button>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                            Êtes-vous un consultant SMQ ?&nbsp;
                            <a onClick={() => setContactVisible(!contactVisible)} className="cursor-pointer text-cyan-700 hover:underline dark:text-cyan-500">
                                Contacter nous
                            </a>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {contactVisible && <Contact onClose={() => setContactVisible(false)} />}
        </>
    );
}
