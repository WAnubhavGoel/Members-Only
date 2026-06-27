import { isAdmin, isMember } from "../authMiddleware/authMiddleware.js"
import { prisma } from "../../prisma/prisma.js"
export const postMessage=async (req,res,next)=>{
    try{
        const message=await prisma.message.create({
            data:{
                title:req.body.title,
                body:req.body.body,
                authorId:req.user.id,
            }
        })
        res.status(200).json({
            success:true,
            message:"Message posted successfully",
            messages:message

        })
    }
    catch (error){
        return res.status(500).json({
            success:false,
            message:"can't post message"
        })
    }
}

export const getMessages = async (req, res, next) => {
    const messages = await prisma.message.findMany({
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    if (req.user?.isAdmin || req.user?.membership) {
        return res.status(200).json({
            success: true,
            message: "Got messages successfully",
            messages: messages
        });
    }

    const safeMessages = messages.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        createdAt: "Hidden",
        author: {
            firstName: "Anonymous",
            lastName: "Member"
        }
    }));

    return res.status(200).json({
        success: true,
        message: "Got messages successfully",
        messages: safeMessages
    });
}

export const deleteMessages=async (req,res)=>{
    try{
        const deletedMessage=await prisma.message.delete({
            where:{id:Number(req.params.id)},
        })
        return res.status(200).json({
            success:true,
            message:"Message deleted successfully",
            deletedMessage:deletedMessage
        })
    }
    catch{
        res.status(500).json({
            success:false,
            message:"Message not deleted",
        })
    }
}