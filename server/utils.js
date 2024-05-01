export const generateRandomDigits =(n) =>{
    let result = '';

    for (let i = 0; i < n; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
        result += randomDigit;
    }

    return result;
}

