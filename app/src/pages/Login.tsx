import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
// import {
//     //   Signin,
//     signinStart,
//     signinSuccess,
//     //   signup,
// } from "../redux/userdataSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import InitialStateProps from "../redux/initialprops";
import { Signin } from "../redux/userdataSlice";
import { useAppDispatch } from "../redux/ḥooks";

function Login() {
    const { error, isLoggedIn } = useSelector(
        (state: InitialStateProps) => state
    );
    const router = useNavigate();
    const [email, setemail] = useState("");
    const [pass, setpass] = useState("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        isLoggedIn && router("/");
    }, [isLoggedIn]);

    return (
        <Fragment>
            <Typography
                variant="h4"
                textAlign={"center"}
                textTransform={"capitalize"}
                my={4}
                color="primary"
            >
                Login
            </Typography>
            <Stack
                mx="auto"
                direction={"row"}
                justifyContent={"center"}
                spacing={2}
                alignItems={"center"}
            >
                <Button variant="text" color="primary">
                    <GoogleLogin
                        onSuccess={() => { }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                </Button>
                <Typography variant="body1" textAlign={"center"} color="primary">
                    OR
                </Typography>
            </Stack>

            <Stack
                direction={"column"}
                justifyContent={"center"}
                maxWidth={800}
                mx="auto"
                component={"form"}
                onSubmit={async (e) => {
                    e.preventDefault();
                    dispatch(Signin(email, pass));
                }}
                spacing={3}
                my={2}
            >
                <Typography
                    variant="body1"
                    textTransform={"capitalize"}
                    textAlign={"center"}
                    color="red"
                >
                    {error}
                </Typography>

                <TextField
                    fullWidth
                    id="email"
                    label="Email id"
                    InputLabelProps={{
                        style: { color: "primary", borderColor: "primary" },
                    }}
                    type="email"
                    placeholder="Email id"
                    sx={{ placeholder: { color: "primary" } }}
                    color="primary"
                    value={email}
                    onChange={(e) => {
                        setemail(e.target.value);
                    }}
                />
                <TextField
                    id="password"
                    fullWidth
                    type="password"
                    sx={{ placeholder: { color: "primary" } }}
                    placeholder="Password"
                    label="Password"
                    color="primary"
                    InputLabelProps={{ style: { color: "primary" } }}
                    value={pass}
                    onChange={(e) => {
                        setpass(e.target.value);
                    }}
                />

                <Typography
                    sx={{ textDecoration: "none" }}
                    mx="auto"
                    // onClick={() => {
                    //     setforgetpassworddialog(true);
                    // }}
                    variant="button"
                    color="primary"
                    textTransform={"capitalize"}
                >
                    forget password ?
                </Typography>

                <Box justifyContent={"center"}>
                    <Button color="success" type="submit" variant="contained">
                        sumbit
                    </Button>
                </Box>
                <Box my={2} component={Link} sx={{ textDecoration: "none" }} to={"/register"} color="initial"><Typography variant="body2" color="initial">Not Signup Yet , Login Here</Typography></Box>

            </Stack>
            {/* {
                <FormDialog
                    toggle={() => setforgetpassworddialog((prev) => !prev)}
                    open={forgetpassworddialog}
                />
            } */}
        </Fragment>
    );
}

export default Login;