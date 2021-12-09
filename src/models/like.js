import { Schema, model } from "mongoose";

const LikeSchema = new Schema(
  {
    filename: { type: String }, // Nombre de la imagen
    user_email_likeIt: { type: String, default: "alguien@gmail.com"}, // Correo del usuario que da like a la imagen
  },
  {
    versionKey: false,
  }
);

LikeSchema.virtual("image")
  .set(function (image) {
    this._image = image;
  })
  .get(function () {
    return this._image;
  });

export default model("Like", LikeSchema);