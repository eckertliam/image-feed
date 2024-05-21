import React, {useState, Dispatch, SetStateAction, createContext, useContext} from "react";
import Upload from "./Upload";
import getFingerprint from "./fingerprint";



export interface AppState {
    currentPage: JSX.Element;
}

export type SetFn<T> = Dispatch<SetStateAction<T>>;

export const SetApp = createContext<SetFn<AppState>>(() => {});

async function postFinger(setFn: SetFn<AppState>, desiredPage: JSX.Element): Promise<void> {
    const fingerprint: number = await getFingerprint();
    const response = await fetch('/api/fingerprint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fingerprint }),
    });
    if (response.status === 200) {
        setFn({currentPage: desiredPage});
    }else if (response.status === 403) {
        setFn({currentPage: <h1>You have been banned.</h1>});
    }else if (response.status === 404) {
        setFn({currentPage: <h1>Unavailable</h1>})
    }else{
        setFn({currentPage: <h1>Unknown error</h1>});
    }
}




export default function App(): JSX.Element {
    const [appState, setAppState] = useState<AppState>({currentPage: <Upload />});
    const setApp = useContext(SetApp);
    
    return (
        <React.StrictMode>
            <SetApp.Provider value={setAppState} >
                <h1>Image Feed</h1>
                {appState.currentPage}
            </SetApp.Provider>
        </React.StrictMode>
    );
}