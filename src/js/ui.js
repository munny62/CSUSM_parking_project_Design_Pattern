/**
 * UI Management Module
 * Handles all user interface updates and interactions
 * Implements the Module Pattern for encapsulation
 */
export function initUI(parkingData) {
    /**
     * Updates the parking lot selection dropdowns
     * Only shows lots with available spots
     */
    function updateLotSelections() {
        const selects = document.querySelectorAll('select[name="lotSelect"]');
        selects.forEach(select => {
            // Store current selection
            const currentValue = select.value;
            
            // Clear existing options except placeholder
            while (select.options.length > 1) {
                select.remove(1);
            }

            // Add options for available lots
            Object.entries(parkingData).forEach(([lot, data]) => {
                if (data.available > 0) {
                    const option = new Option(
                        `${lot.toUpperCase()} (${data.available} spots)`,
                        lot
                    );
                    select.add(option);
                }
            });

            // Restore previous selection if still available
            if ([...select.options].some(opt => opt.value === currentValue)) {
                select.value = currentValue;
            } else {
                select.selectedIndex = 0;
            }
        });
    }

    /**
     * Updates the UI for logged-in user
     * @param {Object} user - Current user object
     * @param {HTMLElement} loginBtn - Login button element
     * @param {HTMLElement} registerBtn - Register button element
     * @returns {HTMLElement} - Logout button element
     */
    function updateUserInfo(user, loginBtn, registerBtn) {
        // Hide auth buttons
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        
        const userInfo = document.getElementById('userInfo');
        
        // Create welcome message
        const welcomeText = document.createElement('span');
        welcomeText.textContent = `Welcome, ${user.name}`;
        welcomeText.style.color = 'white';
        welcomeText.style.marginRight = '1rem';
        
        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        
        // Update DOM
        userInfo.innerHTML = '';
        userInfo.appendChild(welcomeText);
        userInfo.appendChild(logoutBtn);
        
        return logoutBtn;
    }

    // Public API
    return {
        updateLotSelections,
        updateUserInfo
    };
}