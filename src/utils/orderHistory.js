const STORAGE_KEY = 'orderHistory';
const UNSEEN_KEY = 'unseenOrdersCount';

/**
 * Get all orders from localStorage
 * @returns {Array} Array of orders
 */
export function getOrderHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Save a new order to localStorage
 * @param {Object} order - Order data with orderId, clientName, createdAt, fileDataUrl, filename
 */
export function saveOrderToHistory(order) {
    const history = getOrderHistory();
    // Add new order at the beginning (most recent first)
    history.unshift({
        orderId: order.orderId,
        clientName: order.clientName,
        createdAt: order.createdAt,
        fileDataUrl: order.fileDataUrl, // base64 data URL that persists
        filename: order.filename,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // Increment unseen count
    const unseen = getUnseenOrdersCount();
    setUnseenOrdersCount(unseen + 1);
}

/**
 * Delete an order from localStorage by orderId
 * @param {string} orderId - Order ID to delete
 */
export function deleteOrderFromHistory(orderId) {
    const history = getOrderHistory();
    const filtered = history.filter(order => order.orderId !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Clear all order history
 */
export function clearOrderHistory() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNSEEN_KEY);
}

/**
 * Get count of unseen orders
 * @returns {number} Number of unseen orders
 */
export function getUnseenOrdersCount() {
    try {
        const count = localStorage.getItem(UNSEEN_KEY);
        return count ? parseInt(count, 10) : 0;
    } catch {
        return 0;
    }
}

/**
 * Set unseen orders count
 * @param {number} count - New count
 */
export function setUnseenOrdersCount(count) {
    localStorage.setItem(UNSEEN_KEY, String(Math.max(0, count)));
}

/**
 * Mark all orders as seen (clear badge)
 */
export function markOrdersAsSeen() {
    localStorage.setItem(UNSEEN_KEY, '0');
}
