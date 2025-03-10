/**
 * Authentication Module
 * Handles user authentication, registration, and session management
 * Implements the Module Pattern for encapsulation
 */
export function initAuth(loginBtn, registerBtn, loginModal, registerModal, updateUI) {
    // Internal state management
    let currentUser = null;
    let users = JSON.parse(localStorage.getItem('users')) || [];

    /**
     * Authenticates a user with their credentials
     * @param {string} studentId - The student's ID number
     * @param {string} password - The user's password
     * @returns {Object|null} - Returns user object if authenticated, null otherwise
     */
    function login(studentId, password) {
        const user = users.find(u => u.studentId === studentId && u.password === password);
        if (user) {
            currentUser = user;
            return user;
        }
        return null;
    }

    /**
     * Registers a new user in the system
     * @param {string} studentId - The student's ID number
     * @param {string} name - The user's full name
     * @param {string} password - The user's password
     * @returns {Object} - Returns object with either user data or error message
     */
    function register(studentId, name, password) {
        // Check for existing user
        if (users.some(user => user.studentId === studentId)) {
            return { error: 'Student ID already registered!' };
        }

        // Create and store new user
        const newUser = { studentId, name, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        return { user: newUser };
    }

    /**
     * Returns the currently logged-in user
     * @returns {Object|null} - Current user object or null if no user is logged in
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Logs out the current user
     */
    function logout() {
        currentUser = null;
    }

    // Public API
    return {
        login,
        register,
        getCurrentUser,
        logout
    };
}