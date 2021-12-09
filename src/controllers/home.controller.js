import sidebar from "../helpers/sidebar";
import { Image } from "../models";


export const index = async (req, res, next) => {
  try {
    const images = await Image.find()
      .sort({ timestamp: -1 })
      .lean({ virtuals: true });

    let viewModel = { images: [] };
    // Reemplazar el valor de likes por el valor calculado
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    
    let currentUser = req.user;
    if (currentUser != null){
        console.log(currentUser.email);
    }else{
        console.error('User not logged in');
    }

    res.render("index", viewModel);
  } catch (error) {
    next(error);
  }
};

