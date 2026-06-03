export interface ILogin  {
    login_id: number;
    username: string;
    role: string;
    password_hash: string;
    is_active : boolean;
}