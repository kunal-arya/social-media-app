import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { BASE_URL } from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "../../state";

const profileEditSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  confirmEmail: yup
    .string()
    .email("invalid email")
    .oneOf([yup.ref("email"), null], "Email must Match")
    .required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords much Match")
    .required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  linkedinProfile: yup.string(),
  twitterProfile: yup.string(),
});

const EditProfileWidget = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValuesProfileEdit = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    confirmEmail: user.email,
    password: "",
    confirmPassword: "",
    location: user.location,
    occupation: user.occupation,
    linkedinProfile: user.linkedinProfile || "",
    twitterProfile: user.twitterProfile || "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    const response = await fetch(`${BASE_URL}/users/${user._id}/editProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    dispatch(setUserInfo({ user: data.user }));
    onSubmitProps.resetForm();
    navigate(`/home`);
  };

  return (
    <Box
      sx={{
        backgroundColor: `${palette.background.alt}`,
        padding: "2rem",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
        Edit Profile
      </Typography>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesProfileEdit}
        validationSchema={profileEditSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Confirm Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmEmail}
                name="confirmEmail"
                error={
                  Boolean(touched.confirmEmail) && Boolean(errors.confirmEmail)
                }
                helperText={touched.confirmEmail && errors.confirmEmail}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="LinkedIn"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.linkedinProfile}
                name="linkedinProfile"
                error={
                  Boolean(touched.linkedinProfile) &&
                  Boolean(errors.linkedinProfile)
                }
                helperText={touched.linkedinProfile && errors.linkedinProfile}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Twitter"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.twitterProfile}
                name="twitterProfile"
                error={
                  Boolean(touched.twitterProfile) &&
                  Boolean(errors.twitterProfile)
                }
                helperText={touched.twitterProfile && errors.twitterProfile}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TwitterIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={
                  Boolean(touched.confirmPassword) &&
                  Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />

              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                  gridColumn: "span 4",
                }}
              >
                Update Info
              </Button>
            </Box>
            <Box></Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProfileWidget;
