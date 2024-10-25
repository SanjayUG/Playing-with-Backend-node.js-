import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    
    // res.status(200).json({
    //     message: "ok"
    // });

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // get user data from frontend
    // validation for notEmpty
    // check if user already exists
    // check for images, avatar 
    // upload them to Cloudinary
    // create user object
    // remove password and refresh token from response // Corrected "tocken"
    // check for user creation
    // return res

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const { username, email, fullName, password } = req.body;
    // console.log("Password: ", password);

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
    OR
    if([username, email, fullName, password].some((data) => data.trim() == "")) {
        throw new ApiError(400, "All fields are required");
    }

    // ----

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(existingUser);
    

    if(existingUser) {
        throw new ApiError(409, "User with username or email exist...");
    }

    // ----

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // OR
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


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
        new ApiResponse(201, createdUser, "User registered Successfully...")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    // bring data from req body
    // give access based on 'username or email'
    // find the user in db
    // then check the password
    // if yes then generate both access and refresh token
    // send cookies

    const {email, username, password} = req.body;

    if(!username || !email) {
        throw new ApiError(400, "username or password is required")
    }

    const user = User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "User dose not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged in Successfully.."
                )
            )
    
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined;
            }
        },
        {
            new: true;
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut."))
});


export { 
    registerUser,
    loginUser,
    logoutUser
}; // Correct export statement
