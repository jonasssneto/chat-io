
export interface User {
    id: string;
    username: string;
    room: string;
}

export interface Message {
    user: string;
    text: string;
    room: string;
}