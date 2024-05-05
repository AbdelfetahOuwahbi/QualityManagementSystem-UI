import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


//Function that checks if the token is in the cookies
export function isTokenInCookies() {
    const jwt = Cookies.get("JWT");
    return jwt !== undefined && jwt !== null;
}
// Function to check if the token has expired
export function isTokenExpired() {
    const jwt = Cookies.get("JWT")
    const decodedToken = jwtDecode(jwt);
    const currentTimestamp = Math.floor(Date.now() / 1000); 
    
    return decodedToken.exp < currentTimestamp;
}


//Handling the logout

export const handleLogout = () => {
    Cookies.remove("JWT");
    Cookies.remove("userRoles");
    window.location.href = "/"
}


//counting all new notifications for a specific user
export async function countNotifications(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/notification/countNewNotifications?receiverId=${userId}`, {
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
        const response = await fetch(`http://localhost:8080/api/v1/notification/allNotifications?receiverId=${userId}`, {
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

        const response = await fetch(`http://localhost:8080/api/v1/notification/markAsRead/${notificationId}`, {
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

// Function that handles the modification of a user

export async function editUser(userId, type){

}

// Function that deletes the user

export async function eliminateUser(userId, type){

}
