import mongoose from "mongoose"


const modelSchema = new mongoose.Schema({
    
        firstName : {
            type :String,
            required : true
        },
        lastName : {
            type :String,
            required : true,
        },
        age : number,
        email :{
            type : string,
            required : true,
            unique : true
        },
        address :{
            type :string,
            required : true
        }, 
                  
        phone : {
            type : string,
            defalt : "Not Given "
        },

        password :{
            type : string,
            required : true,
            
        },
        isBlocked : {
            type :Boolean,
            defalt : false
        },
        role:{
            type : string,
            defalt : "user"
        },
        
        isEmailVerified :{ 
            type: boolean,
            default : false
        },
        image : {
            type : string,
            default :https //www.flaticon.com/free-icon/user_456212}, 

    },
}
)

const User = mongoose.model("users", userShema)

export default User; 