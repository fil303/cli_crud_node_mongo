const readline = require('readline');
const { MongoClient } = require('mongodb');
const Db = require('mongodb').Db;
const Server = require('mongodb').Server;
// const uri = "mongodb+srv://dbUser:dbPassword@cluster0.msglc6z.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017";
const mongoClient = new MongoClient(uri);
let mongoDB = null;
let Users = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function run() {
    try {
        await mongoClient.connect();
        mongoDB = await mongoClient.db("project"); //
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
        ask();
    } catch (err) { console.log(err)  }
    
}  
run().catch((e)=> console.log(e)) ; //.then(findData);

async function ask(text = null){
    console.log('Welcome To User List\n');
    console.log('Chocse Option :\n');
    console.log('1 : User List\n');
    console.log('2 : Add User\n');
    console.log('3 : Exit\n');

    if(text != null) console.log(text+'\n');

    rl.question('Please enter an option: ', (userInput) => { 
        processOption(userInput);
    });
}
async function processOption(option){
    if(option == 3) {
        console.log('Bey Bey User');
        rl.close();
        process.exit();
    }
    if(option == 2) {
        rl.question('Please enter new user name: ', (userInput) => createNewUser(userInput));
    }
    if(option == 1) {
        await userList();
    }
    // console.clear();
    // await ask();
};

async function createNewUser(name){
    let query = { name: name };
    const mongoCollection = await mongoDB.collection('users');
    await mongoCollection.insertOne(query);
    console.clear();
    await ask("New user created successfully");
}

async function askUserAction(){
    console.log('1 : User Details\n');
    console.log('2 : Update User\n');
    console.log('3 : Delete User\n');
    console.log('4 : Return Main Menu\n');

    rl.question('Please enter an option: ', (userInput) => { 
        processUserOption(userInput);
    });
}

async function userList(){
    const mongoCollection = await mongoDB.collection('users');
    Users = [];
    users = await mongoCollection.find().forEach((element, index )=> {
        Users.push(element);
    });
    console.clear();
    console.table(Users);
    await askUserAction();
}

async function processUserOption(option){
    if(option == 1) {
        rl.question('Please enter user index: ', (userInput) => getUserDetails(userInput));
    }
    if(option == 2) {
        rl.question('Please enter user index: ', (userInput) => updateUser(userInput));    
    }
    if(option == 3) {
        rl.question('Please enter user index: ', (userInput) => deleteUser(userInput));    
    }
    if(option == 4) {
        await ask();
    }
}

async function getUserDetails(index){
    var id = Users[index]._id;
    var query = { _id: id};
    const mongoCollection = mongoDB.collection('users');
    var data = await mongoCollection.findOne(query);
    console.clear();
    console.table([data]);
    await askUserAction();
}

async function updateUser(index){
    var id = Users[index]._id;
    var name = null;
    var query = { _id: id};
    console.clear();
    console.table([Users[index]]);
    const mongoCollection = mongoDB.collection('users');
    rl.question('Please enter user name: ', (userName) => {
        mongoCollection.updateOne(query, { $set : { name: userName }});
        console.clear();
        console.table(Users);
        askUserAction(); 
    });
}

async function deleteUser(index){
    var id = Users[index]._id;
    var query = { _id: id};
    const mongoCollection = mongoDB.collection('users');
    mongoCollection.deleteOne(query);
    Users.splice(index, 1);
    console.clear();
    console.table(Users);
    askUserAction();
}


