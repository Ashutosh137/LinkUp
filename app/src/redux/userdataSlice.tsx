/* eslint-disable @typescript-eslint/no-explicit-any */
import { CredentialResponse } from "@react-oauth/google";
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const backend_url = import.meta.env.VITE_BACKEND_DEV || import.meta.env.VITE_BACKEND

const counterSlice = createSlice({
    name: "userdata",
    initialState: {
        name: "",
        email: "",
        _id: "",
        isLoggedIn: false,
        isSignup: false,
        isLoading: false,
        error: null,
        theme: "light",
    },
    reducers: {
        signinStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signupStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signinSuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            console.log(action.payload)
            localStorage.setItem("token", action.payload)
        },
        AutoLoginsuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state._id = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        AutoLoginfailure: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
        },
        signupSuccess: (state) => {
            state.isLoading = false;
            state.isSignup = true;
        },
        updatename: (state, action) => {
            state.name = action.payload;
        },
        signinFailure: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            state.error = action.payload;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signupfailure: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isSignup = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.name = "";
            state.email = "";
            state._id = "";
            localStorage.setItem("token", "");
        },

    },
});

export const {
    signinFailure,
    signupStart,
    signupSuccess,
    AutoLoginfailure,
    AutoLoginsuccess,
    signupfailure,
    updatename,
    logout,
    signinStart,
    signinSuccess,
} = counterSlice.actions;

export const Signin = (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(signinStart());

    try {
        const data = await fetch(`${backend_url}login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (data.ok) {
            toast.success("login successfully");
            const res = await data.json()
            dispatch(signinSuccess(res.token));
            AutoLogin()
        }
        else {
            const res = await data.json();
            dispatch(signinFailure(res.message));
            toast.error(res.message);
        }
    } catch (error) {
        dispatch(signupfailure(error));
    }
}
export function signup(email: string, password: string, name: string) {
    return async (dispatch: Dispatch) => {
        dispatch(signupStart());
        try {
            const data = await fetch(`${backend_url}register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });
            if (data.ok) {
                toast.success("signup successfully");
                const res = await data.json();
                dispatch(signupSuccess(res.data));
            }
            else {
                const res = await data.json();
                dispatch(signupfailure(res.message));
                toast.error(res.message);
            }
        } catch (error) {
            dispatch(signupfailure(error));
        }
    }
}
export function AutoLogin() {
    return async (dispatch: Dispatch) => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const data = await fetch(`${backend_url}autologin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bear ${token}`
                    },
                });
                if (data.ok) {
                    const res = await data.json();
                    dispatch(AutoLoginsuccess(res.user));
                }
                else {
                    const res = await data.json();
                    dispatch(AutoLoginfailure(res.message));
                }
            } catch (error) {
                dispatch(AutoLoginfailure());
            }
        }
    }
}
export function GoogleLogin(cradit: CredentialResponse) {
    return async (dispatch: Dispatch) => {
        try {
            const data = await fetch(`${backend_url}google/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: cradit.credential })
            });
            if (data.ok) {
                const res = await data.json();
                dispatch(signinSuccess(res.token));
            }
            else {
                const res = await data.json();
                dispatch(signinFailure(res.message));
            }
        } catch (error) {
            dispatch(AutoLoginfailure());
        }
    }
}
export function GoogleSignup(cradit: CredentialResponse) {
    return async (dispatch: Dispatch) => {
        try {
            const data = await fetch(`${backend_url}google/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: cradit.credential })
            });
            if (data.ok) {
                const res = await data.json();
                dispatch(signupSuccess(res.data));
            }
            else {
                const res = await data.json();
                dispatch(signupfailure(res.message));
            }
        } catch (error) {
            dispatch(signupfailure(error));
        }
    }
}

export default counterSlice.reducer