// Configuration object that loads values from environment variables
const config = {
    // API Configuration
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    
    // Environment
    env: process.env.REACT_APP_ENV || 'development',
    debug: process.env.REACT_APP_DEBUG === 'true',
    
    // Application Info
    appName: process.env.REACT_APP_NAME || 'GuardianLink',
};

// Export the API URL separately for backward compatibility
export const API_URL = config.apiUrl;

// Export the full config as default
export default config;