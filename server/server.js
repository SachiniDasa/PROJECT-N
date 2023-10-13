const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port =process.env.PORT||3000;
//database connection to mongodb atlas
mongoose.connect('mongodb+srv://CS304PROJECT:mOLDgAmDdCfaULYw@project.epqrf5c.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const User = require('./models/user')
app.use(express.json());
//user signup POST method
app.post('/signup', async (req, res) => {
    try {
      const {fullName,address,email,contactNumber,combination,password } = req.body;
      const user = new User({fullName,address,email,contactNumber,combination,password});
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
});

//user log in POST method
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
        res.status(200).json({ message: 'Authentication successful' });
      } else {
        res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });
  
// Protect a route by checking the user's role
function protectRouteByRole(requiredRole) {
    return (req, res, next) => {
      const user = req.user; //you have user information in the request
  
      if (user && user.role === requiredRole) {
        next();
      } else {
        res.status(403).json({ error: 'Access denied' });
      }
    };
}

//routes
app.get('/',()=>{
    
})

// Only admin users can access this route
// app.get('/admin', protectRouteByRole('admin'), (req, res) => {
//     res.status(200).json({ message: 'Admin resource accessed' });
// });


//Connection to database checking
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database!');
});


app.listen(port, () => {
    console.log('Server is running on port 3000');
});
