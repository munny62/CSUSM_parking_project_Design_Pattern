export const parkingData = {
    ps1: {
        available: 45,
        total: 50,
        spots: Array.from({ length: 50 }, (_, i) => ({
            id: `PS1-${i + 1}`,
            status: i < 45 ? 'available' : 'occupied',
            occupiedUntil: null
        }))
    },
    b: {
        available: 0,
        total: 30,
        spots: Array.from({ length: 30 }, (_, i) => ({
            id: `B-${i + 1}`,
            status: 'occupied',
            occupiedUntil: null
        }))
    },
    c: {
        available: 5,
        total: 40,
        spots: Array.from({ length: 40 }, (_, i) => ({
            id: `C-${i + 1}`,
            status: i < 5 ? 'available' : 'occupied',
            occupiedUntil: null
        }))
    },
    f: {
        available: 20,
        total: 35,
        spots: Array.from({ length: 35 }, (_, i) => ({
            id: `F-${i + 1}`,
            status: i < 20 ? 'available' : 'occupied',
            occupiedUntil: null
        }))
    }
};