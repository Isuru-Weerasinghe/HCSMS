import User from "../model/User.js";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    if (existingUser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Send response with userId
    res.status(200).json({ userId: existingUser._id, user: existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const newUser = await User.create({ username, email, password, role });
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, phoneNumber } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCount=async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalStaff: count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching staff count" });
  }
};

export const getRoleUsers = async (req, res) =>{
  const role = req.params?.role
  try {
    const findResult = await User.find({
      role: role
    });
    res.status(200).json({result : findResult})
  } catch {
    res.send("Internal Server Error")
  }
}