import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';

// Configure your Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
});

export interface CognitoAuthUser {
  username: string;
  attributes?: Record<string, string>;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  groups?: string[];
}

export function authenticateUser(
  username: string,
  password: string,
): Promise<CognitoAuthUser> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        const accessToken = session.getAccessToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken();
        const idToken = session.getIdToken().getJwtToken();

        const payload = session.getIdToken().payload;
        const groups = payload['cognito:groups'] || [];
        // Get user attributes
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Error getting user attributes:', err);
          }

          const userAttributes: Record<string, string> = {};
          if (attributes) {
            attributes.forEach((attribute) => {
              userAttributes[attribute.getName()] = attribute.getValue();
            });
          }

          resolve({
            username,
            attributes: userAttributes,
            accessToken,
            refreshToken,
            idToken,
            groups,
          });
        });
      },
      onFailure: (err) => {
        reject(new Error(err));
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Handle new password required scenario
        reject(
          new Error(
            `New password required ${userAttributes} ${requiredAttributes}`,
          ),
        );
      },
    });
  });
}

export function signOutUser(): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      resolve();
    } else {
      reject(new Error('No user found'));
    }
  });
}

export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}
