import { Google } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";

// --- Types ---
export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

// --- Child Component ---
interface CustomGoogleButtonProps {
  onGoogleSignIn: (user: GoogleUser) => void;
}

const CustomGoogleButton = ({ onGoogleSignIn }: CustomGoogleButtonProps) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo: GoogleUser = await response.json();
        
        // Pass the typed data up
        onGoogleSignIn(userInfo);
        
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      onClick={() => login()}
      sx={{
        width: "100%",
        bgcolor: "red",
        color: "white",
        textTransform: "none",
        borderRadius: 20,
        py: 1.5,
        "&:hover": { bgcolor: "darkred" },
      }}
    >
      Login with Google
    </Button>
  );
};

// --- Main Component ---
interface AuthWithGoogleProps {
  onLoginSuccess: (user: GoogleUser) => void;
}

export default function AuthWithGoogle({ onLoginSuccess }: AuthWithGoogleProps) {
  const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENTID;

  if (!googleClientId) return null;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Box>
        <Box>
          <Divider sx={{ width: "100%" }}>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              OR
            </Typography>
          </Divider>
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <CustomGoogleButton onGoogleSignIn={onLoginSuccess} />
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}