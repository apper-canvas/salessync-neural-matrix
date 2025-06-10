import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage
let users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    emailVerified: true,
    createdAt: new Date().toISOString()
  }
];

// Mock email verification tokens
let verificationTokens = new Map();

// Current session
let currentUser = null;

const AuthService = {
  async register(userData) {
    await delay(400);
    
    const { username, email, password, confirmPassword } = userData;
    
    // Validation
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists');
    }
    
    if (users.find(u => u.username === username)) {
      throw new Error('This username is already taken');
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    verificationTokens.set(verificationToken, newUser.id);
    
    // Simulate sending verification email
    console.log(`Verification email sent to ${email} with token: ${verificationToken}`);
    
    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        emailVerified: newUser.emailVerified
      },
      verificationToken // In real app, this would be sent via email
    };
  },

  async login(credentials) {
    await delay(300);
    
    const { email, password } = credentials;
    
    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    if (!user.emailVerified) {
      throw new Error('Please verify your email address before logging in');
    }
    
    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15);
    currentUser = user;
    
    // Store session token in cookie
    Cookies.set('authToken', sessionToken, { expires: 7 }); // 7 days
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      },
      token: sessionToken
    };
  },

  async logout() {
    await delay(100);
    currentUser = null;
    Cookies.remove('authToken');
    return true;
  },

  async getCurrentUser() {
    await delay(200);
    const token = Cookies.get('authToken');
    
    if (!token || !currentUser) {
      return null;
    }
    
    return {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified
    };
  },

  async verifyEmail(token) {
    await delay(300);
    
    const userId = verificationTokens.get(token);
    if (!userId) {
      throw new Error('Invalid or expired verification token');
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.emailVerified = true;
    verificationTokens.delete(token);
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      }
    };
  },

  async resendVerification(email) {
    await delay(300);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    // Generate new verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    verificationTokens.set(verificationToken, user.id);
    
    // Simulate sending verification email
    console.log(`Verification email resent to ${email} with token: ${verificationToken}`);
    
    return { verificationToken };
  },

  isAuthenticated() {
    return !!Cookies.get('authToken') && !!currentUser;
  }
};

export default AuthService;