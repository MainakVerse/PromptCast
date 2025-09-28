// pages/api/auth/logout.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Processing logout request...");

    // List of possible authentication cookie names
    const authCookies = [
      'session', 
      'token', 
      'auth-token',
      'jwt',
      'access_token',
      'refresh_token',
      'user-session',
      // Add any other cookie names your app uses
    ];

    // Clear all authentication cookies
    authCookies.forEach(cookieName => {
      res.setHeader('Set-Cookie', [
        `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax`,
        `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax; Secure`,
      ]);
    });

    // If you're using a database session, clear it here
    // Example:
    // const sessionId = req.cookies.session;
    // if (sessionId) {
    //   await clearSessionFromDatabase(sessionId);
    // }

    // If you're using JWT, you might want to add it to a blacklist
    // Example:
    // const token = req.cookies.token;
    // if (token) {
    //   await addTokenToBlacklist(token);
    // }

    console.log("Logout completed successfully");
    
    res.status(200).json({ 
      message: 'Logged out successfully',
      success: true 
    });

  } catch (error) {
    console.error("Logout error:", error);
    
    // Even on error, try to clear cookies
    res.setHeader('Set-Cookie', [
      'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT',
    ]);

    res.status(500).json({ 
      message: 'Logout error, but cookies cleared',
      success: false 
    });
  }
}