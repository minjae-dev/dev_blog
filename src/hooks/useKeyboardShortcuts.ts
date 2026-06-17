import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useKeyboardShortcuts = (isAuthenticated: boolean) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            const isEditing =
                tag === "input" ||
                tag === "textarea" ||
                (e.target as HTMLElement).isContentEditable;

            if ((e.metaKey || e.ctrlKey) && e.key === "n" && isAuthenticated) {
                e.preventDefault();
                navigate("/write");
                return;
            }

            if (!isEditing && e.key === "h") {
                navigate("/");
                return;
            }

            if (!isEditing && e.key === "p") {
                navigate("/posts");
                return;
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isAuthenticated, navigate]);
};

export default useKeyboardShortcuts;
