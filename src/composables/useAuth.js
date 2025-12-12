import { ref, computed, onMounted } from 'vue';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

const user = ref(null);
const loading = ref(true);
const error = ref(null);

// Create a promise to track initialization
let resolveAuth;
const authInitialized = new Promise((resolve) => {
    resolveAuth = resolve;
});

// Initialize auth state listener immediately
onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
    if (resolveAuth) resolveAuth(firebaseUser);
});

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value);


    // Login with email and password
    const login = async (email, password) => {
        try {
            error.value = null;
            loading.value = true;
            const result = await signInWithEmailAndPassword(auth, email, password);
            user.value = result.user;
            return result.user;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Register with email and password
    const register = async (email, password) => {
        try {
            error.value = null;
            loading.value = true;
            const result = await createUserWithEmailAndPassword(auth, email, password);
            user.value = result.user;
            return result.user;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Login with Google
    const loginWithGoogle = async () => {
        try {
            error.value = null;
            loading.value = true;
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            user.value = result.user;
            return result.user;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Logout
    const logout = async () => {
        try {
            error.value = null;
            await signOut(auth);
            user.value = null;
        } catch (err) {
            error.value = err.message;
            throw err;
        }
    };

    // Wait for auth to initialize
    const verifyAuth = () => authInitialized;

    return {
        user,
        loading,
        error,
        isAuthenticated,
        verifyAuth,
        login,
        register,
        loginWithGoogle,
        logout
    };
}
