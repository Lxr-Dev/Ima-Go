import fs from "fs-extra";
import path from "path";
import md5 from "md5";

import sidebar from "../helpers/sidebar";
import { randomNumber } from "../helpers/libs";
import { Image, Comment } from "../models";

export const index = async (req, res, next) => {
  let viewModel = { image: {}, comments: [], delButton: 'none' };

  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  // if image does not exists
  if (!image) return next(new Error("Image does not exists"));

  // increment views
  const updatedImage = await Image.findOneAndUpdate(
    { _id: image.id },
    { $inc: { views: 1 } }
  ).lean();

  viewModel.image = updatedImage;

  // get image comments
  const comments = await Comment.find({ image_id: image._id }).sort({
    timestamp: 1,
  }).lean();

  viewModel.comments = comments;
  
  let currentUser = req.user;
  if (currentUser != null){
    const imageUser = await Image.findOne({
      filename: { $regex: req.params.image_id },
    });
    if (currentUser.email==imageUser.user_email){
      viewModel.delButton = 'block';
    }
  }
  
  viewModel = await sidebar(viewModel);
  
  //console.log(viewModel);
  res.render("image", viewModel);
};

export const create = (req, res) => {

  let currentUser = req.user;
  if (currentUser != null){

    const saveImage = async () => {
      const imgUrl = randomNumber();
      const images = await Image.find({ filename: imgUrl });
      if (images.length > 0) {
        saveImage();
      } else {
        // Image Location
        const imageTempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);
  
        // Validate Extension
        if (
          ext === ".png" ||
          ext === ".jpg" ||
          ext === ".jpeg" ||
          ext === ".gif"
        ) {
          // you wil need the public/temp path or this will throw an error
          await fs.rename(imageTempPath, targetPath);
  
          // create a new image
          const newImg = new Image({
            title: req.body.title,
            filename: imgUrl + ext,
            description: req.body.description,
            user_email: currentUser.email,
          });
  
          // save the image
          const imageSaved = await newImg.save();
  
          // redirect to the list of images
          res.redirect("/images/" + imageSaved.uniqueId);
        } else {
          await fs.unlink(imageTempPath);
          res.status(500).json({ error: "Only Images are allowed" });
        }
      }
    };
  
    saveImage();
    // }
  }else{
    //Redirect to login if the user is not logged in
    res.redirect("/auth/signin");
  }

};

export const like = async (req, res) => {

  let currentUser = req.user;
  if (currentUser != null){
    const image = await Image.findOne({
      filename: { $regex: req.params.image_id },
    });
  
    if (image) {
  
      const verify_like = await Like.findOne({
        filename: image.filename,
        user_email_likeIt: req.user.email,
      });
  
      if (verify_like){
        console.log('Usted ya le dió Like a esta imagen');
      }else{
        const newLike = new Like({
          filename: image.filename,
          user_email_likeIt: req.user.email,
        });
    
        await newLike.save();
    
        // Luego de verificar que la imágen existe, primero verificar que el usuario no haya dado like a la imágen
        // Si no le ha dado like entonces crear una nueva instancia de like, que contenga el nombre de la imágen y el usuario que le dio like
    
        image.likes = image.likes + 1;
        await image.save();
        res.json({ likes: image.likes });
      }
  
    } else {
      res.status(500).json({ error: "Internal Error" });
    }

  }else{
    //res.redirect("/auth/signin");
    res.status(300).json({ error: "No está logueado"});
  }

 
};

export const comment = async (req, res) => {

  const image = await Image.findOne({
    filename: { $regex: req.params.image_id},
  });
  if (image) {
    console.log(image.uniqueId);
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect("/images/" + image.uniqueId + "#" + newComment._id);
  } else {
    res.redirect("/");
  }
};

export const remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    await fs.unlink(path.resolve("./uploads/" + image.filename));
    await Comment.deleteMany({ image_id: image._id });
    await image.remove();
    res.json(true);
  } else {
    res.json({ response: "Bad Request." });
  }
};
