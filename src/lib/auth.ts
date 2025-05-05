import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';

if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || !process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET) {
  throw new Error('Missing required Cognito configuration');
}

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
});

// Function to calculate secret hash
const calculateSecretHash = (username: string): string => {
  const message = username + process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  return crypto
    .createHmac('SHA256', process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!)
    .update(message)
    .digest('base64');
};

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface CognitoUserData {
  username: string;
  attributes: Record<string, string>;
  token: string;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const secretHash = calculateSecretHash(email);
    
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await client.send(command);

    if (response.AuthenticationResult?.IdToken) {
      // Store the token in localStorage
      localStorage.setItem('token', response.AuthenticationResult.IdToken);
      
      // Set the token in a cookie
      const cookieOptions = 'path=/; secure; samesite=strict';
      document.cookie = `token=${response.AuthenticationResult.IdToken}; ${cookieOptions}`;
      
      return {
        success: true,
        message: 'Successfully logged in',
        token: response.AuthenticationResult.IdToken,
      };
    }

    return {
      success: false,
      message: 'Authentication failed',
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const signOut = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Remove token from cookies
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getCurrentUser = async (): Promise<CognitoUserData | null> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    // Here you would typically decode the JWT token to get user information
    // For now, we'll return a basic user object
    return {
      username: 'user', // You would get this from the token
      attributes: {}, // You would get this from the token
      token,
    };
  } catch {
    return null;
  }
}; 