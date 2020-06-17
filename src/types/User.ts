export default interface User {
    email: string;
    username: string;
    rank: number;
}

export interface Salt {
    salt: string;
}