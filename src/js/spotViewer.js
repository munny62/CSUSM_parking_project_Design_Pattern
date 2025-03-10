export function showSpotDetails(lotName, parkingData, currentUser, onVacateSpot) {
    const lot = parkingData[lotName];
    if (!lot) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.maxWidth = '800px';

    const title = document.createElement('h2');
    title.textContent = `Lot ${lotName.toUpperCase()} - Spots Overview`;
    content.appendChild(title);

    const spotsGrid = document.createElement('div');
    spotsGrid.style.display = 'grid';
    spotsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    spotsGrid.style.gap = '10px';
    spotsGrid.style.marginTop = '20px';

    lot.spots.forEach((spot, index) => {
        const spotElement = document.createElement('div');
        spotElement.className = `spot-card ${spot.status}`;
        spotElement.style.padding = '10px';
        spotElement.style.borderRadius = '4px';
        spotElement.style.textAlign = 'center';
        spotElement.style.backgroundColor = spot.status === 'available' ? '#d4edda' : 
                                          spot.status === 'reserved' ? '#fff3cd' : '#f8d7da';

        let spotContent = `
            <div>${spot.id}</div>
            <div>${spot.status}</div>
            ${spot.occupiedUntil ? `<div>Until: ${spot.occupiedUntil}</div>` : ''}
        `;

        // Add vacate button if spot belongs to current user
        if (currentUser && spot.userId === currentUser.studentId) {
            spotContent += `
                <button class="vacate-btn" style="margin-top: 8px; font-size: 0.9rem;">
                    Vacate Spot
                </button>
            `;
        }

        spotElement.innerHTML = spotContent;

        // Add click handler for vacate button
        const vacateBtn = spotElement.querySelector('.vacate-btn');
        if (vacateBtn) {
            vacateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onVacateSpot(lotName, index);
                modal.remove();
            });
        }

        spotsGrid.appendChild(spotElement);
    });

    content.appendChild(spotsGrid);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '20px';
    closeBtn.onclick = () => modal.remove();
    content.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}