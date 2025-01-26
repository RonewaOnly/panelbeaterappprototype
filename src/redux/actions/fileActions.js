import axios from "axios";

// Action to send file data to the API to be saved server-side
export const sendFileData = (fileData) => {
    return async (dispatch) => {
        try {
            const formData = new FormData();
            formData.append("file", fileData);

            const response = await axios.post("http://localhost:3000/upload", formData);
            console.log("File upload response:", response.data);
            dispatch({ type: "FILE_UPLOAD_SUCCESS", payload: response.data });
        } catch (error) {
            console.error("Error uploading file:", error);
            dispatch({ type: "FILE_UPLOAD_FAILURE", error: error.message });
        }
    };
};

// Action to fetch files from the API
export const fetchFiles = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("http://localhost:3000/files");
            dispatch({ type: "FETCH_FILES_SUCCESS", payload: response.data });
        } catch (error) {
            console.error("Error fetching files:", error);
            dispatch({ type: "FETCH_FILES_FAILURE", error: error.message });
        }
    };
};

// Action to delete a file from the API
export const deleteFile = (fileName) => {
    return async (dispatch) => {
        try {
            await axios.delete(`http://localhost:3000/files/${fileName}`);
            dispatch({ type: "DELETE_FILE_SUCCESS", payload: fileName });
        } catch (error) {
            console.error("Error deleting file:", error);
            dispatch({ type: "DELETE_FILE_FAILURE", error: error.message });
        }
    };
};

// Action to download a file from the API
export const downloadFile = (fileName) => {
    return async () => {
        try {
            const response = await axios.get(`http://localhost:3000/files/${fileName}`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
};
