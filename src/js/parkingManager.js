/**
 * Parking Management Module
 * Handles all parking-related operations including vehicle parking and spot reservations
 * Implements the Module Pattern for encapsulation
 */
export function initParkingManager(parkingData, updateUI, updateStatus) {
    /**
     * Updates all relevant displays after parking changes
     */
    function updateDisplays() {
        updateUI();
        updateStatus(parkingData);
        // Save parking data to localStorage
        localStorage.setItem('parkingData', JSON.stringify(parkingData));
    }

    /**
     * Registers a parked vehicle in a specific lot
     * @param {string} lot - The parking lot identifier
     * @param {string} departureTime - Expected departure time
     * @param {Object} user - Current user object
     * @returns {Object} - Success or error message
     */
    function parkVehicle(lot, departureTime, user) {
        if (!user) return { error: 'Please login first' };
        
        // Check lot availability
        if (parkingData[lot] && parkingData[lot].available > 0) {
            // Update lot capacity
            parkingData[lot].available--;
            
            // Find and update first available spot
            const spotIndex = parkingData[lot].spots.findIndex(spot => spot.status === 'available');
            if (spotIndex !== -1) {
                parkingData[lot].spots[spotIndex].status = 'occupied';
                parkingData[lot].spots[spotIndex].occupiedUntil = departureTime;
                parkingData[lot].spots[spotIndex].userId = user.studentId;
            }

            // Update displays
            updateDisplays();
            return { success: `Parking registered in ${lot.toUpperCase()} until ${departureTime}` };
        }
        return { error: `Sorry, lot ${lot.toUpperCase()} is currently full.` };
    }

    /**
     * Reserves a parking spot for future use
     * @param {string} lot - The parking lot identifier
     * @param {string} arrivalTime - Expected arrival time
     * @param {Object} user - Current user object
     * @returns {Object} - Success or error message
     */
    function reserveSpot(lot, arrivalTime, user) {
        if (!user) return { error: 'Please login first' };

        // Check lot availability
        if (parkingData[lot] && parkingData[lot].available > 0) {
            // Update lot capacity
            parkingData[lot].available--;
            
            // Find and update first available spot
            const spotIndex = parkingData[lot].spots.findIndex(spot => spot.status === 'available');
            if (spotIndex !== -1) {
                parkingData[lot].spots[spotIndex].status = 'reserved';
                parkingData[lot].spots[spotIndex].occupiedUntil = arrivalTime;
                parkingData[lot].spots[spotIndex].userId = user.studentId;
            }

            // Update displays
            updateDisplays();
            return { success: `Spot reserved in ${lot.toUpperCase()} for ${arrivalTime}` };
        }
        return { error: `No spots available in lot ${lot.toUpperCase()} for the requested time.` };
    }

    /**
     * Marks a parking spot as vacated
     * @param {string} lot - The parking lot identifier
     * @param {number} spotId - The spot number
     * @param {Object} user - Current user object
     * @returns {Object} - Success or error message
     */
    function vacateSpot(lot, spotId, user) {
        if (!user) return { error: 'Please login first' };

        const lotData = parkingData[lot];
        if (!lotData) return { error: 'Invalid lot selected' };

        const spot = lotData.spots[spotId];
        if (!spot) return { error: 'Invalid spot selected' };

        if (spot.userId !== user.studentId) {
            return { error: 'You can only vacate spots registered to you' };
        }

        // Update spot status
        spot.status = 'available';
        spot.occupiedUntil = null;
        spot.userId = null;
        lotData.available++;

        // Update displays
        updateDisplays();
        return { success: `Spot ${spotId + 1} in lot ${lot.toUpperCase()} has been marked as available` };
    }

    /**
     * Gets all spots registered to a user
     * @param {Object} user - Current user object
     * @returns {Array} - Array of user's spots
     */
    function getUserSpots(user) {
        if (!user) return [];

        const userSpots = [];
        Object.entries(parkingData).forEach(([lotName, lot]) => {
            lot.spots.forEach((spot, index) => {
                if (spot.userId === user.studentId) {
                    userSpots.push({
                        lot: lotName,
                        spotId: index,
                        spotNumber: index + 1,
                        status: spot.status,
                        occupiedUntil: spot.occupiedUntil
                    });
                }
            });
        });
        return userSpots;
    }

    // Load saved parking data from localStorage
    const savedData = localStorage.getItem('parkingData');
    if (savedData) {
        Object.assign(parkingData, JSON.parse(savedData));
    }

    // Public API
    return {
        parkVehicle,
        reserveSpot,
        vacateSpot,
        getUserSpots
    };
}