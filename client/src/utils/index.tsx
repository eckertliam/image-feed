import { ClientJS } from "clientjs";

export async function getFingerprint(): Promise<number> {
    // cheeck if fingerprint is already stored in local storage
    const storedFingerprint: null | string = localStorage.getItem('fingerprint');
    if (storedFingerprint) {
        return parseInt(storedFingerprint);
    }
    const client = new ClientJS();
    const fingerprint: number = client.getFingerprint();
    localStorage.setItem('fingerprint', fingerprint.toString());
    return fingerprint;
}

export const BASE_URL: string = import.meta.env.VITE_BASE_URL;