import "dotenv/config"
export const joinClub=async (req,res)=>{
    if(req.body.passcode==process.env.SECRET_PASSCODE){
        const updatedUser=await prisma.user.update({
            where:{id:req.user.id},
            data:{membership:true}
        })
    }
    else{
        res.status(500).json({
            success:false,
            message:"Incorrect Pass code"
        })
    }
    const safeUser={
        id:updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        membership: updatedUser.membership,
        isAdmin: updatedUser.isAdmin
    };
    return res.status(200).json({
        success: true,
        message: "Welcome to the club! You can now see message authors.",
        user: safeUser
    });
}