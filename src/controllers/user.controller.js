import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    
    // res.status(200).json({
    //     message: "ok"
    // });

    // get user data from frontend
    // validation for notEmpty
    // check if user already exists
    // check for images, avatar 
    // upload them to Cloudinary
    // create user object
    // remove password and refresh token from response // Corrected "tocken"
    // check for user creation
    // return res


    const { username, email, fullName, password } = req.body;
    console.log("Password: ", password);

    // if (username === "") {
    //     throw new ApiError(400, "This field is required");
    // }
    // if (email === "") {
    //     throw new ApiError(400, "This field is required");
    // }
    // if (fullName === "") {
    //     throw new ApiError(400, "This field is required");
    // }
    // if (password === "") {
    //     throw new ApiError(400, "This field is required");
    // }        
    // OR
    if([username, email, fullName, password].some((data) => data.trim() == "")) {
        throw new ApiError(400, "All fields are required");
    }

    // ----

    const existingUser = User.findOne({
        $or: [{username}, {email}]
    })
    console.log(existingUser);
    

    if(existingUser) {
        throw new ApiError(409, "User with username or email exist...");
    }

    // ----

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // ----

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // ----

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully...");
    )

});

export { registerUser }; // Correct export statement
