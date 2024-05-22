import React, {useState, Dispatch, SetStateAction, createContext} from "react";
import Post from "./Post";

export interface AppState {
    currentPage: JSX.Element;
}

export type SetFn<T> = Dispatch<SetStateAction<T>>;

export const SetApp = createContext<SetFn<AppState>>(() => {});

export default function App(): JSX.Element {
    const [appState, setAppState] = useState<AppState>({currentPage: <Post />});
    
    return (
        <React.StrictMode>
            <SetApp.Provider value={setAppState} >
                <h1>Image Feed</h1>
                {appState.currentPage}
            </SetApp.Provider>
        </React.StrictMode>
    );
}