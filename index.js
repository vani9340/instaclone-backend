const express = require("express")
const cors = require("cors")
const port = 8080 || process.env.PORT
const app = express() 
const fileUpload = require("express-fileupload")
const {User, Post}= require("./models/Schema")
const mongoose = require("mongoose")
// const path = require("path")

const uri = `mongodb+srv://shivani:shivani@cluster0.lag4824.mongodb.net/?retryWrites=true&w=majority`

app.use(cors({origin:"http://localhost:3000"}))
app.use(express.json())
app.use(fileUpload())
//Connection to mongoDB
mongoose.set('strictQuery', true)
mongoose.connect(uri, (err) => {
    if(err) {
        console.log("Connection to mongodb failed")
    }
    else console.log("Connected to mongoDB successfully")
})
app.listen(port, () => {
    console.log(`App is listening on ${port}`);
})

app.get("/", (req, resp) => {
    resp.send(`<h1>You are in</h1>`)
})


app.post("/user", async (req, resp) => {
    const {username, password} = req.body
    const userObject = new User({
        username,
        password,
    })
    const response = await userObject.save()
    resp.json({message: response})
})

app.post("/api", (req, resp) => {
    const { username, address, description }  = req.body
    const {filename} = req.files
    filename.mv("./uploads/"+filename.name, async (err) => {
        if(err) {
            resp.json({message: err})
        }
        else {
            const post = new Post({
                ...{ username, address, description },
                filename: filename.name
            })
            try{
                const response = await post.save()
                resp.json({message: 'Everything is fine', response})
            }catch(e){
                resp.json({message: 'Something went wrong' , response: e })
            }
        }
    })
})

app.get("/all", async (req, resp) => {
    resp.json({result: await Post.find()})
})

// app.get("/images/:fileName", async (req, resp) => {
//     console.log(`./uploads/${req.params.fileName}`)
//     resp.sendFile(path.join(__dirname, `./uploads/${req.params.fileName}`))
// })
app.use('/uploads',express.static(__dirname+'/uploads'))
// app.use('/uploads', express.static(__dirname+'/uploads'));
// mongodb+srv://shivani:shivani@cluster0.lag4824.mongodb.net/?retryWrites=true&w=majority