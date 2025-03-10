import { parkingData } from './parkingData.js';
import { showNotification } from './notifications.js';
import { showSpotDetails } from './spotViewer.js';
import { initAuth } from './auth.js';
import { initParkingManager } from './parkingManager.js';
import { initUI } from './ui.js';
import { updateParkingStatus } from './parkingStatus.js';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const parkForm = document.getElementById('parkForm');
const reserveForm = document.getElementById('reserveForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Initialize modules
const ui = initUI(parkingData);
const auth = initAuth(loginBtn, registerBtn, loginModal, registerModal, ui.updateUserInfo);
const parkingManager = initParkingManager(
    parkingData, 
    ui.updateLotSelections,
    updateParkingStatus
);

// Initialize UI
ui.updateLotSelections();
updateParkingStatus(parkingData);

// Authentication Event Listeners
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

switchToRegister.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

switchToLogin.addEventListener('click', () => {
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    
    const user = auth.login(studentId, password);
    if (user) {
        loginModal.style.display = 'none';
        showNotification(`Welcome back, ${user.name}!`);
        const logoutBtn = ui.updateUserInfo(user, loginBtn, registerBtn);
        logoutBtn.addEventListener('click', handleLogout);
    } else {
        showNotification('Invalid credentials!');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    const confirmPassword = e.target.elements[3].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!');
        return;
    }

    const result = auth.register(studentId, name, password);
    if (result.error) {
        showNotification(result.error);
    } else {
        registerModal.style.display = 'none';
        showNotification(`Welcome ${name}! Your account has been created successfully.`);
        const logoutBtn = ui.updateUserInfo(result.user, loginBtn, registerBtn);
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function handleLogout() {
    auth.logout();
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    document.getElementById('userInfo').innerHTML = '';
    document.getElementById('userInfo').appendChild(loginBtn);
    document.getElementById('userInfo').appendChild(registerBtn);
    showNotification('You have been logged out.');
}

// Parking Operations Event Listeners
document.querySelectorAll('.view-spots-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lotName = this.closest('.lot-card').querySelector('h3').textContent.split(' ')[1].toLowerCase();
        showSpotDetails(lotName, parkingData, auth.getCurrentUser(), (lot, spotId) => {
            const result = parkingManager.vacateSpot(lot, spotId, auth.getCurrentUser());
            if (result.error) {
                showNotification(result.error);
            } else {
                showNotification(result.success);
            }
        });
    });
});

parkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lot = e.target.lotSelect.value;
    const departureTime = e.target.departureTime.value;
    
    const result = parkingManager.parkVehicle(lot, departureTime, auth.getCurrentUser());
    showNotification(result.success || result.error);
});

reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lot = e.target.lotSelect.value;
    const arrivalTime = e.target.arrivalTime.value;
    
    const result = parkingManager.reserveSpot(lot, arrivalTime, auth.getCurrentUser());
    showNotification(result.success || result.error);
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});