declare global {
    interface Window {
        grecaptcha: typeof grecaptcha;
    }
}

// This is needed to ensure the file is treated as a module.
export { };
