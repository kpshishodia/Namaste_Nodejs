const registerUserController = async (req, res) => {
  try {
    return res.status(201).json({
      message: "okk",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

module.exports = registerUserController ;