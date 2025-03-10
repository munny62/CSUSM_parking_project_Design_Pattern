export function showNotification(message) {
    // Create notification popup
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="close-notification">✕</button>
        </div>
    `;

    // Add to document
    document.body.appendChild(popup);

    // Handle close button
    const closeBtn = popup.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => popup.remove());

    // Auto remove after 5 seconds
    setTimeout(() => {
        popup.style.animation = 'slideIn 0.5s ease-out reverse';
        setTimeout(() => popup.remove(), 500);
    }, 5000);

    // Also add to notification list
    const notificationList = document.querySelector('.notification-list');
    const notification = document.createElement('div');
    notification.style.padding = '1rem';
    notification.style.borderBottom = '1px solid #ddd';
    notification.textContent = message;
    notificationList.prepend(notification);
}