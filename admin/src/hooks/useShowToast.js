import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";

const useShowToast = () => {
    const showToast = useCallback((title, description, status) => {
        toast[status](`${title} ${description}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
	
    }, []); 

    return showToast; 
};

export default useShowToast;
