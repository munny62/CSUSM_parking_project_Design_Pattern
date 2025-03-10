/**
 * Manages the parking lot status display and updates
 */
export function updateParkingStatus(parkingData) {
    const lotCards = document.querySelectorAll('.lot-card');
    
    lotCards.forEach(card => {
        const lotName = card.querySelector('h3').textContent.split(' ')[1].toLowerCase();
        const statusDiv = card.querySelector('.status');
        const lot = parkingData[lotName];
        
        if (lot) {
            // Update status text and class
            if (lot.available === 0) {
                statusDiv.textContent = 'Full';
                statusDiv.className = 'status full';
            } else if (lot.available <= 5) {
                statusDiv.textContent = `Limited: ${lot.available}`;
                statusDiv.className = 'status limited';
            } else {
                statusDiv.textContent = `Available: ${lot.available}`;
                statusDiv.className = 'status available';
            }
        }
    });
}