export const signup = async (req, res) => {
  return res.status(200).json({ message: "you hit the /signup endpoint" });
};

export const login = async (req, res) => {
  return res.json({ message: "You are at the Login Page" });
};

export const logout = async (req, res) => {
  return res.json({ message: "Logout pagehit" });
};
