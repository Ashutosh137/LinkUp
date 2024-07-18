interface InitialStateProps {
    name: string;
    email: string;
    _id: string;
    isLoggedIn: boolean;
    isSignup: boolean;
    isLoading: boolean;
    error: string;
    theme: "light" | "dark",
}

export default InitialStateProps