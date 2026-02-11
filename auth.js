// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCr6pAI4GCkwnlZEBq_1M1dWeWpGtrn1a4",
    authDomain: "frameacademy-bb04a.firebaseapp.com",
    projectId: "frameacademy-bb04a",
    storageBucket: "frameacademy-bb04a.firebasestorage.app",
    messagingSenderId: "1018686855581",
    appId: "1:1018686855581:web:e4f5d6f42ee6d43ba8b774",
    measurementId: "G-SDMK2NPGBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Create reCAPTCHA for phone auth
export function createRecaptcha(containerId){
    return new RecaptchaVerifier(containerId, {
        'size': 'invisible',
        'sitekey': '6Leh0WYsAAAAAHISvriKLV94fJuWFuJRgIaXbGUb'
    }, auth);
}

// ================= EMAIL =================
export async function loginEmail(email, password){
    if(!email || !password){ alert("Please fill in all fields!"); return; }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Welcome: " + userCredential.user.email);
        window.location.href = "index.html";
    } catch(err){ alert(err.message); }
}

export async function registerEmail(email, password){
    if(!email || !password){ alert("Please fill in all fields!"); return; }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Registered: " + userCredential.user.email);
        window.location.href = "index.html"; 
    } catch(err){ alert(err.message); }
}

// ================= PHONE =================
export async function loginPhone(phoneNumber, containerId){
    try {
        const recaptchaVerifier = createRecaptcha(containerId);
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        const code = prompt("Enter SMS code:");
        if(!code) return;
        const result = await confirmationResult.confirm(code);
        alert("Welcome: " + result.user.phoneNumber);
        window.location.href = "index.html";
    } catch(err){ alert(err.message); }
}

// ================= LOGOUT =================
export async function logoutUser(){
    try {
        await signOut(auth);
        alert("Signed out");
        window.location.href = "kiru.html"; // After logout go to login
    } catch(err){
        alert(err.message);
    }
}

// ================= AUTH STATE =================
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameH3 = document.querySelector('.side-header h3');

    if(user){
        if(userNameH3) userNameH3.textContent = user.email || user.phoneNumber || "USER";
        if(loginBtn) loginBtn.style.display = 'none';
        if(registerBtn) registerBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if(userNameH3) userNameH3.textContent = "USER_NAME";
        if(loginBtn) loginBtn.style.display = 'inline-block';
        if(registerBtn) registerBtn.style.display = 'inline-block';
        if(logoutBtn) logoutBtn.style.display = 'none';
    }
});
