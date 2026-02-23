import express ,{NextFunction, Request,Response} from "express"; 

const router = express.Router();
export default router;


router.post("/product", (req:Request, res:Response,next:NextFunction) => {
    return res.status(201).json({
        message:"Product created successfully"
    })
});


