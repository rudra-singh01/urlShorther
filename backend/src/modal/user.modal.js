import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
        default: function() {
            return getGravatarUrl(this.email);
        }
    }
}, {
    timestamps: true,
});

function getGravatarUrl(email) {
    if (!email) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
    
    const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

const User = mongoose.model("User", userSchema);

export default User;