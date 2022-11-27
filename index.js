const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middle wares
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.19qwu6y.mongodb.net/?retryWrites=true&w=majority`;

const client =  new MongoClient(uri);

  async function run(){
    try{
        await client.connect();
        const categoriesCollection = client.db("resellingBooks").collection("categories");
        const usersCollection = client.db("resellingBooks").collection("users");
        const scienceFictionCollection = client.db("resellingBooks").collection("scienceFiction");
        const mysteryCollection = client.db("resellingBooks").collection("mystery");
        const shortStoriesCollection = client.db("resellingBooks").collection("shortStories");
        const bookingCollection =  client.db("resellingBooks").collection("bookings");
        const wishListedBooksCollection =  client.db("resellingBooks").collection("wishlist");
        const addedBooksCollection =  client.db("resellingBooks").collection("newAddedBooks");
        const allBooksCollection =  client.db("resellingBooks").collection("allBooks");
        const advertisedBooksCollection =  client.db("resellingBooks").collection("advertisedBooks");
        

        app.get('/categories', async(req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories)
        })

        app.get('/jwt', async(req, res) => {
          const email = req.query.email;
          const query = {email: email};
          const user = await usersCollection.findOne(query);
          if(user){
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN);
            return res.send({accessToken: token})
          }
          res.status(403).send({accessToken: ''});
        })
    
        app.post('/users', async(req, res) => {
          const user = req.body;
          const result = await usersCollection.insertOne(user);
          res.send(result)
        })

        app.get('/users', async(req, res) => {
          let query = {};
          if(req.query.type){
            query= {
              type: req.query.type
            }
          }
          else if (req.query.email){
            query={
              email: req.query.email
            }
          }
          const cursor = usersCollection.find(query);
          const users = await cursor.toArray();
          res.send(users);
        })

        app.get('/category/637e7e300122d590fe2ebd83', async(req, res) => {
          const query = {};
          const cursor = scienceFictionCollection.find(query);
          const users = await cursor.toArray();
          res.send(users);
        })

        app.get('/category/637e7e300122d590fe2ebd84', async(req, res) => {
          const query = {};
          const cursor = mysteryCollection.find(query);
          const books = await cursor.toArray();
          res.send(books);
        })

        app.get('/category/637e7e300122d590fe2ebd85', async(req, res) => {
          const query = {};
          const cursor = shortStoriesCollection.find(query);
          const books = await cursor.toArray();
          res.send(books);
        })

        app.post('/bookings', async(req, res) => {
          const user = req.body;
          const bookings = await bookingCollection.insertOne(user);
          res.send(bookings)
        })

        app.get('/bookings', async(req, res) => {
          let query = {};
          if(req.query.userEmail){
            query= {
              userEmail: req.query.userEmail
            }
          }
          const cursor = bookingCollection.find(query);
          const bookings = await cursor.toArray();
          res.send(bookings);
        })

        app.get('/users/seller/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email }
          const user = await usersCollection.findOne(query);
          res.send({ isSeller: user?.type === 'Seller' });
      })

        app.get('/users/buyer/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email }
          const user = await usersCollection.findOne(query);
          res.send({ isBuyer: user?.type === 'Buyer' });
      })

        app.get('/users/admin/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email }
          const user = await usersCollection.findOne(query);
          res.send({ isAdmin: user?.type === 'Admin' });
      })

      app.put('/users/sellers/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id)}
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                verified: 'true'
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    });

    app.delete('/users/buyers/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
      })

    app.delete('/users/sellers/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
      })

      app.post('/wishlist', async(req, res) => {
        const user = req.body;
        const wishListed = await wishListedBooksCollection.insertOne(user);
        res.send(wishListed)
      })

      app.get('/wishlist', async(req, res) => {
        let query =  {};
        if(req.query.email){
          query= {
            email: req.query.email
          }
        }
        const cursor = wishListedBooksCollection.find(query);
        const wishListedBook = await cursor.toArray();
        res.send(wishListedBook);
      })

      app.post('/category/637e7e300122d590fe2ebd83', async(req, res) => {
        const newBook = req.body;
        const result = await scienceFictionCollection.insertOne(newBook);
        res.send(result);
    })

      app.post('/category/637e7e300122d590fe2ebd84', async(req, res) => {
        const newBook = req.body;
        const result = await mysteryCollection.insertOne(newBook);
        res.send(result);
    })

      app.post('/category/637e7e300122d590fe2ebd85', async(req, res) => {
        const newBook = req.body;
        const result = await shortStoriesCollection.insertOne(newBook);
        res.send(result);
    })

    app.get('/category/:category', async(req, res) => {
      let query = {};
      if(req.query.category){
        query= {
          category: req.query.category
        }
      }
      const cursor = addedBooksCollection.find(query);
      const newAddedBook = await cursor.toArray();
      res.send(newAddedBook);
    })

    app.post('/allbooks', async(req, res) => {
      const newBook = req.body;
      const books = await allBooksCollection.insertOne(newBook);
      res.send(books);
  })

    app.get('/allbooks', async(req, res) => {
      let query = {};
      if(req.query.category_id){
        query = {
          category_id:  req.query.category_id
        }
      }
      else if(req.query.sellerName){
        query= {
          sellerName: req.query.sellerName
        }
      }
      const cursor = allBooksCollection.find(query);
      const allBooks = await cursor.toArray();
      res.send(allBooks)
    })

    app.post('/advertisedbooks', async(req, res) => {
      const newAdvertisedBook = req.body;
      const advertisedBooks = await advertisedBooksCollection.insertOne(newAdvertisedBook);
      res.send(advertisedBooks);
  })

  app.get('/advertisedbooks', async(req, res) => {
    const query = {};
    const cursor = advertisedBooksCollection.find(query);
    const advertisedBooks = await cursor.toArray();
    res.send(advertisedBooks)
  })


    }
    catch(error){
        console.log(error.name, error.message, error.stack);
    }
  }
  run();

app.get('/', (req, res) => {
    res.send('Hello from the other side')
})

app.listen(port, () => {
console.log('Its happening');
})