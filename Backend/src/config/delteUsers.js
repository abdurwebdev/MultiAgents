import userModel from "../models/user.model.js";
export const deleteMany  =async () =>{
  await userModel.deleteMany({});
  console.log("All users deleted.")
}



