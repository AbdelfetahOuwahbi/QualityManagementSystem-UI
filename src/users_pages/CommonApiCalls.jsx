//In this file we'll define the common requests , users usually throw to the server

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
//Server Address (to be changed in production)
import { serverAddress } from "../ServerAddress";
import { toast } from "react-hot-toast";

/////////////////////////////////////////// SECURITY ///////////////////////////////////////////////////////////////////////////////


//Function that checks if the token is in the cookies
export function isTokenInCookies() {
    const jwt = Cookies.get("JWT");
    console.log("isTokenInCookies --->", jwt !== undefined && jwt !== null)
    return jwt !== undefined && jwt !== null;
}
// Function to check if the token has expired
export function isTokenExpired() {
    const jwt = Cookies.get("JWT");
    const decodedToken = jwtDecode(jwt);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log("isTokenExpired --->", decodedToken.exp < currentTimestamp)
    return decodedToken.exp < currentTimestamp;
}

// To persist the Session of the user
export function persistentSession(user) {
    if (user === "Sysadmin") {
        window.location.href = "/SysDashboard";
    } else {
        window.location.href = "/ClientDashboard"
    }
}

export function extractMainRole() {
    //Checking the existance of userRoles in cookies
    const userRoles = Cookies.get("userRoles");
    if (userRoles !== undefined && userRoles !== null && userRoles !== "") {
        const userRoleArray = JSON.parse(userRoles);
        const mainRole = userRoleArray
            .filter(role => ['Sysadmin', 'Consultant', 'Admin', 'Responsable', 'Pilot'].includes(role.name))
            .map(role => role.name);
        // console.log("Main role of the user:", mainRole[0]);
        return mainRole[0];
    }
}

// Function that checks whether the user has a specific permission
export function doesHeHaveAccess(permission) { 

    const userRolesEncoded = Cookies.get("userRoles");

    if (userRolesEncoded) {
        const userRolesJSON = decodeURIComponent(userRolesEncoded);

        try {
            const userRoles = JSON.parse(userRolesJSON);

            for (const role of userRoles) {
                if (role.name.includes(permission)) {
                    return true;
                }
            }
        } catch (error) {
            console.error("Error parsing userRoles JSON:", error);
            return false;
        }
    }

    return false;
}


//Function to change the password

export async function changePassword(currentPassword, newPassword, confirmationPassword) {
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/auth/changePassword`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("JWT")}`
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmationPassword: confirmationPassword
            })
        });
        return response;
    } catch (error) {
        console.error("Error changing password:", error);
    }
}

//Function that Locks or unlocks a user's Account

export async function lockOrUnlockUser(userId) {
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/auth/lock/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("JWT")}`
            },
        });

        const data = await response.text();
        if (response.ok) {
            console.log('User locked/unlocked successfully:', data);
            return data; // Return any relevant data from the response
        } else {
            console.error('Failed to lock/unlock user:', data);
        }
    } catch (error) {
        console.error('Error locking/unlocking user:', error);
        throw error;
    }
}



//Handling the logout

export function handleLogout() {
    Cookies.remove("JWT");
    Cookies.remove("userRoles");
    window.location.href = "/";
}


/////////////////////////////////////////// NOTIFICATIONS ///////////////////////////////////////////////////////////////////////////////


//counting all new notifications for a specific user
export async function countNotifications(userId, token) {
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/notification/countNewNotifications?receiverId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error; // Re-throw the error to propagate it up
    }
};

//getting all the notifications and their infos for a specific user

export async function getAllNotifications(userId, token) {
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/notification/allNotifications?receiverId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}

//When a notification is clicked it gets marked as read , this function performs it

export async function markNotificationAsRead(notificationId, token) {
    try {

        const response = await fetch(`http://${serverAddress}:8080/api/v1/notification/markAsRead/${notificationId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log("Notification marked as read:", data);
        return data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}


/////////////////////////////////////////// ENTREPRISES ///////////////////////////////////////////////////////////////////////////////


//Function to add a new Entreprise

export async function saveEntreprise(consultantIfExists, type, Category, Pays, Secteur, Ville, Phone, Email, Patente, Cnss, Id_Fisc, RegCom, RaiSoc) {

    console.log("Saving an ", type)
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/${type === "organism" ? "organismes" : `consulantSMQ/entreprises?consulantSMQId=${consultantIfExists}`}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("JWT")}`,
            },
            body: JSON.stringify({
                "categorie": Category,
                "pays": Pays,
                "secteur": Secteur,
                "ville": Ville,
                "telephone": Phone,
                "email": Email,
                "patente": Patente,
                "cnss": Cnss,
                "identifiantFiscal": Id_Fisc,
                "registreDeCommerce": RegCom,
                "raisonSocial": RaiSoc
            }),
        });
        const data = await response.json();
        console.log("data after saving consultant is-->", data);
        if (!response.ok) {
            console.log("error message is --> ", data.message);
            if (data.errorCode === "User_email_already_exists") {
                toast.error("L'email que vous avez entrez est déjà utilisé, entrer un autre!!");
            } else if (data.errorCode === "VALIDATION_ERROR") {
                const errorMessages = data.message.split(',');
                errorMessages.forEach(message => {
                    toast.error(message.trim());
                });
            }
            else {
                toast.error('Une erreur s\'est produite lors du creation de ce consultant.');
            }
            throw new Error(`Failed to save consultant: ${response.status} ${response.statusText}`);
        }
        return response;

    } catch (error) {
        console.error('Error saving organism:', error);
    }
}

//Function to Update a new Entreprise

export async function updateEntreprise(Category, Pays, Secteur, Ville, Phone, Email, Patente, Cnss, Id_Fisc, RegCom, RaiSoc, id) {

    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/organismes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("JWT")}`,
            },
            body: JSON.stringify({
                "categorie": Category,
                "pays": Pays,
                "secteur": Secteur,
                "ville": Ville,
                "telephone": Phone,
                "email": Email,
                "patente": Patente,
                "cnss": Cnss,
                "identifiantFiscal": Id_Fisc,
                "registreDeCommerce": RegCom,
                "raisonSocial": RaiSoc
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update organism: ${response.status} ${response.statusText}`);
        }
        return response;

    } catch (error) {
        console.error('Error updating organism:', error);
    }
}

//Function that gets all entreprises
export async function getAllEntreprises(consultantId, type) {
    try {
        const response = await fetch(`http://${serverAddress}:8080/api/v1/${type === "organism" ? "organismes" : type === "entreprises" ? "consulantSMQ/entreprises" : `consulantSMQ/entreprises/all-entreprises?consultantId=${consultantId}`}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("JWT")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

