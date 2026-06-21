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
import { useLoginMutation } from "../../redux/api/authApi";
import { addUser } from "../../redux/features/authSlice";
import { useAppDispatch } from "../../redux/hooks";
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
    <Box className="h-screen flex items-center justify-center bg-linear-to-tr from-blue-500 to-sky-300">
      <Paper elevation={12} variant="elevation" className="rounded-2xl">
        <Container
          component="main"
          className="bg-white w-[350px] md:w-[500px] pt-4"
          sx={{
            borderBottomLeftRadius: "3rem",
            borderBottomRightRadius: "3rem",
          }}
        >
          <Typography
            className="flex flex-col justify-center items-center mt-4 p-4"
            variant="h5"
          >

            <Typography className="uppercase font-bold text-pink-700 md:text-2xl text-lg text-center">
              Dr. Nahida Islam Nipa's
            </Typography>
            <Typography className="uppercase font-bold text-purple-700 md:text-xl text-lg text-center mb-3">Chamber</Typography>
            <Typography className="uppercase font-bold text-blue-500 md:text-xl text-sm text-center">
              Dermatologist, Venereologist & Dermatosurgeon
            </Typography>
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
              Login Form
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                variant="standard"
                {...register("userName")}
                error={!!errors.userName}
                helperText={errors.userName?.message}
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
                color="secondary"
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
  userName: z.string().min(3, "Invalid Username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
