const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
        name:{
            type:String,
            required:true,
            default:"Unacategorized",

        },
        type:{
            type:String,
            requred:true,
            enum: ["income", "expense"],
        },
    },
    {
        timestamps:true,
    }
);
module.exports = mongoose.model("category", categorySchema);