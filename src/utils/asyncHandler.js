
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => next(error));
    }
}

export { asyncHandler };



/*

//using try...catch for asyncHandler

const asyncHandler = (fun) => async (req, res, next) => {
    try{
        await fun(req, res, next)
    } catch(error) {
        res.status(error.code || 500).json({
            success: false,
            message: err.message
        })
    }
} 

*/








/*

const asyncHandler = (fun) => {
    async () => {
        
    } 
}

OR

cosnt asyncHandler = (fun) => () => {}

OR

const asyncHandler = (fun) => async () => {
    
}

*/