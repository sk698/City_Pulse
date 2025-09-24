

const verifyAdmin = (req,res,next) => {
    if(req.user.role === "admin"){
        return next();
    }
    return res.status(403).json(new ApiError(403, "Access denied, admin only"));
}

export { verifyAdmin } 