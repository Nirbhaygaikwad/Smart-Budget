const asyncHandler = require("express-async-handler");
const Category = require("../model/Category"); // Ensure correct path
const Transaction = require("../model/Transaction");

console.log("Category Model:", Category); // Debugging

const categoryController = {
    //! Add
    create: asyncHandler(async (req, res) => {
        const { name, type } = req.body;
        if (!name || !type) {
            throw new Error("Name and type are required for creating a category");
        }

        // Convert the name to lowercase
        const normalizedName = name.toLowerCase();

        // Check if the type is valid
        const validTypes = ["income", "expense"];
        if (!validTypes.includes(type.toLowerCase())) {
            throw new Error(`Invalid category type: ${type}`);
        }

        //! Check if category already exists for the user
        const categoryExist = await Category.findOne({ name: normalizedName, user: req.user });
        if (categoryExist) {
            throw new Error(`Category ${categoryExist.name} already exists in the database`);
        }

        // ! Create the category
        const category = await Category.create({
            name: normalizedName,
            user: req.user,
            type,
        });

        res.status(201).json(category);
    }),

    //! Lists
    lists: asyncHandler(async (req, res) => {
        console.log("Available Category Methods:", Object.keys(Category)); // Debugging

        const categories = await Category.find({ user: req.user }); // Fixed `.findOne` -> `.find`
        res.status(200).json(categories);
    }),

    //! Update
    update: asyncHandler(async (req, res) => {
        const categoryId = req.params.id;
        const{type,name} = req.body;
        const normalizedName = name.toLowerCase();
        const category = await Category.findById(categoryId);
        if(!category && category.user.toString( ) !== req.user.toString()) {
            throw new Error("category not found or user not authorized");

        }
        const  oldName = category.name;
        //! update category properties
        category.name= name
        category.type=type
        const updatedCategory = await category.save()
        //! update affected transaction
        if(oldName !== updatedCategory.name){
            await Transaction.updateMany({
                user:req.user,
                category: oldName,
            },
        { $set: {category: updatedCategory.name}}
    );
        }
        res.json(updatedCategory);
           
    }),

    //! Delete
    delete: asyncHandler(async (req, res) => {
        const category = await Category.findById(req.params.id);
        if(category && category.user.toString() === req.user.toString() ){
            //! update the transaction which have this category 
            const defaultCategory = "uncategorized";
            await Transaction.updateMany({ user: req.user,category: category.name},
                {$set:{category: defaultCategory}}
            );
            //! remove category
            await Category.findByIdAndDelete(req.params.id);
            res.json({message: "category removed and transaction updated" });

        }else{
            res.json({message: "category not found or user not authorized"});
        }
    }),
};

module.exports = categoryController

