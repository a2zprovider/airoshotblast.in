export function formatPhoneNumber(number: any) {
    if (!number) return '';

    // Ensure number is a string (in case it's passed as a number or another type)
    const cleanedNumber = String(number).replace(/\D/g, '');

    // Check if the number has 10 digits (standard Indian number length)
    if (cleanedNumber.length === 10) {
        // If the number doesn't start with +91, format with it
        return `+91 ${cleanedNumber.replace(/(\d{5})(\d{5})/, '$1-$2')}`;
    }

    // Check if the number starts with +91 and then format the rest of the number
    if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
        return `+91 ${cleanedNumber.slice(2).replace(/(\d{5})(\d{5})/, '$1-$2')}`;
    }

    // Return the number as is if it doesn't fit either of the conditions
    return number;
}
