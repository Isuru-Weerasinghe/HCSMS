import axios from "axios";
import dotenv from "dotenv";
import User from "../model/User.js";

dotenv.config();

export const sendUsernamePassword = async (
  firstName,
  lastName,
  phoneNumber,
  email
) => {
  const password = generatePassword();
  const phone = validPhoneNumber(phoneNumber);
  const username = generateUsername(firstName, lastName);

  const message = `Dear ${firstName} ${lastName}, Your username is ${email} and password is ${password} Please use these credentials to login to the system.`;

  console.log(message, phone, password);
  console.log(process.env.USER_ID);

  const url = `https://app.notify.lk/api/v1/send`;

  const params = {
    user_id: process.env.USER_ID,
    api_key: process.env.NOTFY_API_KEY,
    sender_id: process.env.SENDER_ID,
    to: phone,
    message: message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log(res.data);

    User.create({
      username,
      email,
      password,
      role: "patient",
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendSmsStaffPassword = async (username, phoneNumber, email) => {
  const password = generatePassword();
  const phone = validPhoneNumber(phoneNumber);
  const message = `Dear ${username},Your email is ${email} Your password is ${password} Please use these credentials to login to the system.`;

  const url = `https://app.notify.lk/api/v1/send`;

  const params = {
    user_id: process.env.USER_ID,
    api_key: process.env.NOTFY_API_KEY,
    sender_id: process.env.SENDER_ID,
    to: phone,
    message: message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log(res.data);

    return password;
  } catch (error) {
    console.log(error);
  }
};

export const xRayDeliveredSms = async (firstName, lastName, phoneNumber) => {
  const message = `Dear ${firstName} ${lastName}, Your Xray is ready. Please collect it from the Radiology unit ref no:67echbey.`;

  const phone = validPhoneNumber(phoneNumber);

  const url = `https://app.notify.lk/api/v1/send`;

  const params = {
    user_id: process.env.USER_ID,
    api_key: process.env.NOTFY_API_KEY,
    sender_id: process.env.SENDER_ID,
    to: phone,
    message: message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const labReportReadySms = async (firstName, lastName, phoneNumber) => {
  const message = `Dear ${firstName} ${lastName}, Your Lab Report is delivered ref no:231xrhbey.`;

  const phone = validPhoneNumber(phoneNumber);

  const url = `https://app.notify.lk/api/v1/send`;

  const params = {
    user_id: process.env.USER_ID,
    api_key: process.env.NOTFY_API_KEY,
    sender_id: process.env.SENDER_ID,
    to: phone,
    message: message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

const validPhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith("0")) {
    return phoneNumber.replace("0", "94");
  }
  return phoneNumber;
};

const generatePassword = () => {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

const generateUsername = (firstName, lastName) => {
  return `${firstName}${lastName}`.toLowerCase();
};
