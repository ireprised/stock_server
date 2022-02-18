const { MongoClient } = require('mongodb');
const express = require('express')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 7000

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://business_product:cKFlF2UPuUC0ZgIy@cluster0.wu06l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() =>{
    try{
        await client.connect()
        const database = client.db("business_products");
        // const productsCollection = database.collection("products");
        const dataCollection = database.collection("data");
        const userCollection = database.collection("users");
        const messageCollection = database.collection("messages");
        console.log('connected database')

        app.post('/data',async(req,res)=>{
            const product = req.body
            const result = await dataCollection.insertOne(product)
            res.send(result)
            // console.log(result)
        })

        app.get('/data',async(req,res)=>{
            const cursor = dataCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/data/:id',async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await dataCollection.deleteOne(cursor)
            res.json(result)
        })
        app.get('/data/:id',async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await dataCollection.findOne(cursor)
            res.send(result)
        })

        app.put('/data/:id', async(req,res)=>{
            const id = req.params.id
            const updatedData = req.body
            const cursor = {_id : ObjectId(id)}
            const options = {upsert : true}
            const updatedDoc = {$set : {
                sQ : updatedData.sQ,
                sellPrice : updatedData.sellPrice,
                rQ : updatedData.rQ,
                damagePrice : updatedData.damagePrice,
                delivery : updatedData.delivery
            }}
            const result = await dataCollection.updateOne(cursor,updatedDoc,options)
            res.json(result)
        })


        // Products all methods starts here
        // app.get('/products',async(req,res)=>{
        //     const cursor = productsCollection.find({})
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })
        // admin all methods ends here

        app.post('/users',async(req,res)=>{
            const users = req.body
            const result = await userCollection.insertOne(users)
            res.json(result)
        })
        app.get('/users',async(req,res)=>{
            const cursor = userCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users/:email',async(req,res)=>{
            const email = req.params.email
            const query = {email : email}
            const user = await userCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({admin : isAdmin})
        })

        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await userCollection.deleteOne(cursor)
            res.json(result)
        })

        
        app.put('/users/:id', async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const user = await userCollection.findOne(cursor)
            let updatedDoc = {}
            if (user.role == 'admin') {
                updatedDoc = {$set : {role : 'user'}}
            } else {
                updatedDoc = {$set : {role : 'admin'}}
            }
            const result = await userCollection.updateOne(cursor,updatedDoc)
            res.json(result)
        })


        app.post('/message',async(req,res)=>{
            const message = req.body
            const result = await messageCollection.insertOne(message)
            res.send(result)
        })
        app.get('/message',async(req,res)=>{
            const cursor = messageCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })


        // app.get('/readmessage/:id',async(req,res)=>{
        //     const id = req.params.id
        //     const cursor = {_id : ObjectId(id)}
        //     const result = await messageCollection.findOne(cursor)
            
        //     res.send(result)
        //     console.log('abc')
        // })


        app.delete('/message/:id',async(req,res)=>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const result = await messageCollection.deleteOne(cursor)
            res.json(result)
        })


    }
    finally{

    }
}

run().catch(console.dir)









app.get('/',(req,res)=>{ res.send('hi')})

app.listen(port,()=>{ console.log('listening the port',port) })
// mongodb+srv://business_product:<password>@cluster0.wu06l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// business_product
// cKFlF2UPuUC0ZgIy