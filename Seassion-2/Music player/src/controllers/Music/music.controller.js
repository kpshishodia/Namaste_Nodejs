import Music from "../../models/music.model"

const musicController = async (req , res) => {
    try {
        
    } catch (error) {
        // ----------------------------------------------------
    // Error handling
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
    }
}

export default musicController