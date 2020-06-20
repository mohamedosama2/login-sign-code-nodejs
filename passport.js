const passport=require('passport');
const jwtStrategy=require('passport-jwt').Strategy;
const{ExtractJwt}=require('passport-jwt')
const User=require('./models/user')

passport.use(new jwtStrategy({
    jwtFromRequest:ExtractJwt.fromHeader('authenticate'),
    secretOrKey:'secret'
},async(payload,done)=>{
    try{
    const user=await User.findById(payload.sub)

    if(!user){
        return done(null,false)
    }
    done(null,user)
    }catch(err){
        throw(err,false)
    }

}))