const validator = require("validator");

const validateRegistrationData = (req) => {
  const { email, password } = req.body;
  
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  } 
};

const validateUpdateProfileData = (req)=>{
    const allowedEditFields = [
        "firstName",
         "lastName", 
         "year",
    
         ];

    const isEditAllowed= Object.keys(req.body).every((field) => 
    allowedEditFields.includes(field));

    if(!isEditAllowed) return false;

    if(req.body.year !== undefined) {
      const year = Number(req.body.year);

      if(!Number.isInteger(year) || year <1 || year >4){
        throw new Error("Year must be between 1 and 4");
      }
    }

    return true;


};


module.exports = {
  validateRegistrationData,
  validateUpdateProfileData,
};
