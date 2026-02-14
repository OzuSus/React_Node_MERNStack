export function errorHandler(err, req, res, next){
    console.log(err.message);
    return res.status(err.statusCode || 500).json({message: err.message || "Loi server: ",err});
}