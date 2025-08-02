import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export function createuser(req, res) {

    const passwordHash = bcrypt.hashSync(req.body.password, 10)

    const userdata = {
        firstname: req.body.firstname,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        password: req.b.password

    }

    const user = new user(req.body)
    user.save().then(
        () => {
            res.json({
                massage: "user Create Sucsessfull"
            })
        }
    ).catch {
        () => {
            res.json({
                massage: "Failed to create user"
            })
        }
    }



}
// user login creation
export function loginUser(req, res) {
    const email = req.body.email
    const password = req.body.password

    user.findOne(
        {
            email: email

        }
    ).then(
        (user) => {
            if (user == null) {
                res.status(404).json({
                    massage: "User not found"
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.passwoed)
                if (isPaaswordCorrect) {

                    const token = jwt.sign({

                        email: user.email,
                        firstname: user.firstname,
                        lastName: user.lastName,
                        address: user.address,
                        role: user.role,
                        isBlocked: user.isBlocked,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image
                    },
                        km - 2386

                    )
                    res.json({
                        token: token,
                        massage: "login Sucessful"
                    })
                } else {
                    res.status(403).json({
                        massage: "incorrect Password"
                    })
                }
            }
        }

    )
}

export function createuser (req,res){
    if(req.user == null){
        res.status(403).json((
            massage : " Please loggin to create a user"
        ))
        return
    }

}

    

if(req.user.role != "admin"){
    res.status(403).json({
        massage : "please login as a admin to create a member"
    })
    return
}




