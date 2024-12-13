import User from "../model/User.js";
import { sendSmsStaffPassword } from "../utils/SendSMS.js";

export const staffRegister = async (req, res) => {
  const {
    username,
    email,
    phoneNumber,
    slmcNumber,
    dob,
    address,
    idNumber,
    role,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const password = await sendSmsStaffPassword(username, phoneNumber, email);

    console.log(password);

    const user = await User.create({
      username,
      email,
      phoneNumber,
      slmcNumber,
      dob,
      address,
      idNumber,
      role,
      password,
    });

    res.status(201).json({ user });
  } catch (error) {
    // Handle errors and respond with a 500 status code
    res.status(500).json({ message: error.message });
  }
};
