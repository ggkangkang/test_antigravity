export const getZodiacSign = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Aries', icon: '♈' };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Taurus', icon: '♉' };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Gemini', icon: '♊' };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Cancer', icon: '♋' };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Leo', icon: '♌' };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Virgo', icon: '♍' };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Libra', icon: '♎' };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Scorpio', icon: '♏' };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Sagittarius', icon: '♐' };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Capricorn', icon: '♑' };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Aquarius', icon: '♒' };
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { name: 'Pisces', icon: '♓' };

    return null;
};
