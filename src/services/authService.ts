import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';

export class AuthService {
  async register(email: string, password: string, name: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    return user.save();
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
  }
}