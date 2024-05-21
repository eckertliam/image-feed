import { ClientJS } from "clientjs";

async function getFingerprint(): Promise<number> {
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

export default getFingerprint;