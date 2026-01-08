const bcrypt= require("bcrypt");
const User = require("../models/User");

const createAdminIfNotExists = async () => {
    try{
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const adminExists= await User.findOne({email : adminEmail});

        if(adminExists) {
            console.log("Admin already exists");
            return;
        }

        const passwordHash= await bcrypt.hash(adminPassword,10);

        const adminUser = new User({
            email: adminEmail,
            password: passwordHash,
            role:"admin",
        });

        await adminUser.save();
        console.log("Admin account created automatically");
    }catch(error){
        console.error("error creating admin: ", error.message);
    }
    
};

module.exports = createAdminIfNotExists;