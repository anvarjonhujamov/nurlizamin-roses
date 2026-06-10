import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that detects when an element enters the viewport
 * @param {Object} options - Intersection Observer options
 * @returns {[React.RefObject, boolean]} - Ref to attach and visibility state
 */
export function useInView(options = {}) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Once in view, stay visible (don't re-animate on scroll up)
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% visible
                rootMargin: '50px', // Start animation slightly before fully in view
                ...options,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options]);

    return [ref, isInView];
}
