import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useLoginMutation } from "../../retux/api/authApi";
import { addUser } from "../../retux/features/authSlice";
import { useAppDispatch } from "../../retux/hooks";
import { decodeToken } from "../../utils/decodeToken";
import { getResponse } from "../../utils/getResponst";

export default function Login() {
  const [LoginUser, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onSubmit = async (data: FormData) => {
    const res = await LoginUser(data);

    const getRes = await getResponse(res);
    if (getRes?.success) {
      const decodedUser = decodeToken(getRes?.data?.accessToken);

      dispatch(
        addUser({
          user: {
            ...decodedUser,
            role: Array.isArray(decodedUser.role)
              ? decodedUser.role
              : [decodedUser.role],
          },
          token: getRes?.data?.accessToken,
        }),
      );
      navigate("/dashboard");
    }
  };

  return (
    <Box className="h-screen flex items-center justify-center bg-gradient-to-tr from-green-800 to-green-700">
      <Paper elevation={12} variant="elevation">
        <Container
          component="main"
          className="border-4 md:border-8 bg-slate-100 border-orange-600 w-[300px] md:w-[450px]"
        >
          <Typography
            className="flex flex-col justify-center items-center mt-6"
            variant="h5"
          >
            <img src="logo.png" width="100px" alt="FASTCARE LOGO" />
            <span className="uppercase font-bold text-green-700 md:text-3xl">
              FAST CARE DERMALYN
            </span>
          </Typography>

          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "white",
            }}
          >
            <Avatar sx={{ m: 1 }} className="bg-orange-600">
              <LockOutlinedIcon />
            </Avatar>
            <Typography className="text-xl text-green-700 uppercase font-bold">
              Log In Form
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Employee Id"
                variant="standard"
                {...register("employeeId")}
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
              />

              <FormControl sx={{ width: "100%", mb: 2 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 3, mb: 5, fontWeight: "bold" }}
                disabled={isLoading}
                startIcon={
                  isLoading && <CircularProgress size={20} color="warning" />
                }
              >
                {isLoading ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
}

type FormData = z.infer<typeof schema>;

const schema = z.object({
  employeeId: z.string().min(6, "Invalid Id"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
