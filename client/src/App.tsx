import React, {useState, Dispatch, SetStateAction, createContext} from "react";
import MakePost from "./MakePost";
import Feed from "./Feed";

export interface AppState {
    currentPage: JSX.Element;
}

export type SetFn<T> = Dispatch<SetStateAction<T>>;

export const SetApp = createContext<SetFn<AppState>>(() => {});

export default function App(): JSX.Element {
    const [appState, setAppState] = useState<AppState>({currentPage: <Feed />});
    
    return (
        <div className="app">
            <SetApp.Provider value={setAppState} >
                <h1>Image Feed</h1>
                {appState.currentPage}
            </SetApp.Provider>
        </div>
    );
}