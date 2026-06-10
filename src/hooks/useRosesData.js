import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || '/api/sheets') : '/api/sheets';

// In-memory cache
const cache = {
    data: null,
    timestamp: null,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache
};

// Global state to share data between components
let globalRoses = [];
let globalLoading = true;
let globalError = null;
let fetchPromise = null;
const listeners = new Set();

function notifyListeners() {
    listeners.forEach(listener => listener());
}

async function fetchRosesData() {
    // If already fetching, return existing promise
    if (fetchPromise) {
        return fetchPromise;
    }

    // Check cache validity
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp < cache.CACHE_DURATION)) {
        globalRoses = cache.data;
        globalLoading = false;
        globalError = null;
        notifyListeners();
        return cache.data;
    }

    globalLoading = true;
    notifyListeners();

    fetchPromise = (async () => {
        try {
            const res = await fetch(API_URL);
            const contentType = res.headers.get('content-type') || '';

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const msg = errData.details || errData.error || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            // Reject if response is not JSON (e.g. accidentally served as JS/HTML)
            if (!contentType.includes('application/json')) {
                throw new Error('API returned unexpected content type');
            }

            const data = await res.json();

            // Map API products to expected rose format
            const mapped = (data || []).map(product => ({
                id: product.id || product.number,
                number: product.number,
                slug: product.slug || product.name_en || `product-${product.id || product.number}`,
                name: product.name_ru || product.name_en || `Rose #${product.id || product.number}`,
                name_ru: product.name_ru,
                name_en: product.name_en,
                color: product.color,
                height: product.height,
                category: product.category,
                stock: product.stock ?? product.quantity ?? 0,
                images: product.images || ['1730913009-1.jpg'],
                smell: product.smell != null ? product.smell : null,
                price:
                    product.price != null && !Number.isNaN(product.price)
                        ? product.price
                        : null,
            }));

            // Update cache
            cache.data = mapped;
            cache.timestamp = Date.now();

            globalRoses = mapped;
            globalLoading = false;
            globalError = null;

            return mapped;
        } catch (err) {
            console.error('Error fetching roses:', err);
            globalError = err.message;
            globalLoading = false;
            return [];
        } finally {
            fetchPromise = null;
            notifyListeners();
        }
    })();

    return fetchPromise;
}

/**
 * Hook to get roses data with caching
 * Shares data between all components using this hook
 */
export function useRosesData() {
    const [, forceUpdate] = useState(0);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        const listener = () => {
            if (mountedRef.current) {
                forceUpdate(n => n + 1);
            }
        };

        listeners.add(listener);

        // Fetch data on mount
        fetchRosesData();

        return () => {
            mountedRef.current = false;
            listeners.delete(listener);
        };
    }, []);

    return {
        roses: globalRoses,
        loading: globalLoading,
        error: globalError,
    };
}

/**
 * Force refresh the roses data (bypasses cache)
 */
export async function refreshRosesData() {
    cache.data = null;
    cache.timestamp = null;
    return fetchRosesData();
}

/**
 * Invalidate cache (call after order to refresh stock)
 */
export function invalidateRosesCache() {
    cache.data = null;
    cache.timestamp = null;
}
