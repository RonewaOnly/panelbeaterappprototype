import { useContext, createContext, useReducer } from 'react';


const initialState = {
    files: [],
    uploadStatus: null,
    error: null,
};

const fileReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FILE_UPLOAD_SUCCESS":
            return { ...state, uploadStatus: "success", error: null };

        case "FILE_UPLOAD_FAILURE":
            return { ...state, uploadStatus: "failure", error: action.error };

        case "FETCH_FILES_SUCCESS":
            return { ...state, files: action.payload, error: null };

        case "FETCH_FILES_FAILURE":
            return { ...state, error: action.error };

        case "DELETE_FILE_SUCCESS":
            return {
                ...state,
                files: state.files.filter((file) => file !== action.payload),
            };

        case "DELETE_FILE_FAILURE":
            return { ...state, error: action.error };

        default:
            return state;
    }
};

//create the provider and usecontext so to be able to use the state and dispatch in the components
const FileContext = createContext();
 const FileProvider = ({ children }) => {
    const [state, dispatch] = useReducer(fileReducer, initialState);
    return (
        <FileContext.Provider value={{ state, dispatch }}>
            {children}
        </FileContext.Provider>
    );
}

 const useFile = () => {
    return useContext(FileContext);
}


export  {FileProvider,useFile,fileReducer};
