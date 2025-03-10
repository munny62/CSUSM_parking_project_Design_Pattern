// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const parkForm = document.getElementById('parkForm');
const reserveForm = document.getElementById('reserveForm');
const notificationList = document.querySelector('.notification-list');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// State
let currentUser = null;
let notifications = [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Parking data
const parkingData = {
    'ps1': { total: 50, available: 45, spots: generateSpots(50, 45) },
    'b': { total: 30, available: 0, spots: generateSpots(30, 0) },
    'c': { total: 40, available: 5, spots: generateSpots(40, 5) },
    'f': { total: 25, available: 20, spots: generateSpots(25, 20) }
};

function generateSpots(total, available) {
    const spots = [];
    for (let i = 1; i <= total; i++) {
        spots.push({
            id: i,
            status: i <= available ? 'available' : 'occupied',
            occupiedUntil: i <= available ? null : getRandomTime()
        });
    }
    return spots;
}

function getRandomTime() {
    const now = new Date();
    return new Date(now.getTime() + Math.random() * 3600000).toLocaleTimeString();
}

// Add click handlers for view spots buttons
document.querySelectorAll('.view-spots-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lotName = this.parentElement.querySelector('h3').textContent.split(' ')[1].toLowerCase();
        showSpotDetails(lotName);
    });
});

function showSpotDetails(lotName) {
    const lot = parkingData[lotName];
    if (!lot) return;

    // Create modal for spots
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.maxWidth = '800px';

    const title = document.createElement('h2');
    title.textContent = `Parking Lot ${lotName.toUpperCase()} Details`;
    
    const spotsGrid = document.createElement('div');
    spotsGrid.className = 'spots-grid';
    spotsGrid.style.display = 'grid';
    spotsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    spotsGrid.style.gap = '10px';
    spotsGrid.style.marginTop = '20px';
    spotsGrid.style.maxHeight = '400px';
    spotsGrid.style.overflowY = 'auto';

    lot.spots.forEach(spot => {
        const spotElement = document.createElement('div');
        spotElement.className = `spot-card ${spot.status}`;
        spotElement.style.padding = '10px';
        spotElement.style.borderRadius = '4px';
        spotElement.style.textAlign = 'center';
        spotElement.style.backgroundColor = spot.status === 'available' ? '#d4edda' : '#f8d7da';

        spotElement.innerHTML = `
            <div>Spot ${spot.id}</div>
            <div>${spot.status}</div>
            ${spot.occupiedUntil ? `<div>Until: ${spot.occupiedUntil}</div>` : ''}
        `;
        spotsGrid.appendChild(spotElement);
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '20px';
    closeBtn.onclick = () => modal.remove();

    content.appendChild(title);
    content.appendChild(spotsGrid);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Event Listeners
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

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target[0].value;
    const name = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (users.some(user => user.studentId === studentId)) {
        alert('Student ID already registered!');
        return;
    }

    const newUser = { studentId, name, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    updateUIForLoggedInUser(newUser);
    registerModal.style.display = 'none';
    addNotification(`Welcome ${name}! Your account has been created successfully.`);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target[0].value;
    const password = e.target[1].value;
    
    const user = users.find(u => u.studentId === studentId && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUIForLoggedInUser(user);
        loginModal.style.display = 'none';
        addNotification(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid credentials!');
    }
});

parkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const lot = e.target.lotSelect.value;
    const departureTime = e.target.departureTime.value;
    
    // Update parking data
    if (parkingData[lot] && parkingData[lot].available > 0) {
        parkingData[lot].available--;
        const spotIndex = parkingData[lot].spots.findIndex(spot => spot.status === 'available');
        if (spotIndex !== -1) {
            parkingData[lot].spots[spotIndex].status = 'occupied';
            parkingData[lot].spots[spotIndex].occupiedUntil = departureTime;
        }
        addNotification(`Parking registered in ${lot.toUpperCase()} until ${departureTime}`);
    } else {
        addNotification(`Sorry, lot ${lot.toUpperCase()} is currently full.`);
    }
});

reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const lot = e.target.lotSelect.value;
    const arrivalTime = e.target.arrivalTime.value;
    
    if (parkingData[lot] && parkingData[lot].available > 0) {
        addNotification(`Spot reserved in ${lot.toUpperCase()} for ${arrivalTime}`);
    } else {
        addNotification(`No spots available in lot ${lot.toUpperCase()} for the requested time.`);
    }
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

// Utility Functions
function updateUIForLoggedInUser(user) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    const userInfo = document.getElementById('userInfo');
    
    const welcomeText = document.createElement('span');
    welcomeText.textContent = `Welcome, ${user.name}`;
    welcomeText.style.color = 'white';
    welcomeText.style.marginRight = '1rem';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        userInfo.innerHTML = '';
        userInfo.appendChild(loginBtn);
        userInfo.appendChild(registerBtn);
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        addNotification('You have been logged out.');
    });
    
    userInfo.innerHTML = '';
    userInfo.appendChild(welcomeText);
    userInfo.appendChild(logoutBtn);
}

function addNotification(message) {
    const notification = document.createElement('div');
    notification.style.padding = '1rem';
    notification.style.borderBottom = '1px solid #ddd';
    notification.textContent = message;
    
    notificationList.prepend(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}