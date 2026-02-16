import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateToken = (id: mongoose.Types.ObjectId, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '30d', 
    });
};

export default generateToken;
