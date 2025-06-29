import { SafeString } from "aws-sdk/clients/securitylake";

export interface SignUpData {
    name: string,
    lastname: string,
    email: string, 
    password: string
}

export interface LogInData {
    identifier: string;
    password: string;
}

export interface User {
    uuid: string;
    name: string;
    lastname: string;
    email: string;
}