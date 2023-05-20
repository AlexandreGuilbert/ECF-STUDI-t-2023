//initialisation du projet js.node//

npm init

//Création d'un serveur HTTP//

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

//Exécution de l'application//

node app.js

//Configuration de la base de données//

npm install mongoose


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });


  //Création du modèle de données (Au préalable, créer dans le projet un fichier réservation.js pour définir le modele de données de réservation)//

  const mongoose = require('mongoose');

  const reservationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
  });
  
  const Reservation = mongoose.model('Reservation', reservationSchema);
  
  module.exports = Reservation;
  
// Ajout des routes (Code à placer dans le app.js) //

const express = require('express');
const app = express();
const Reservation = require('./reservation');

app.use(express.json());

// Route pour créer une réservation
app.post('/reservations', (req, res) => {
  const { name, email, date, guests } = req.body;

  const reservation = new Reservation({
    name,
    email,
    date,
    guests,
  });

  reservation.save()
    .then(() => {
      res.status(201).json({ message: 'Reservation created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create reservation' });
    });
});

// Route pour récupérer toutes les réservations
app.get('/reservations', (req, res) => {
  Reservation.find()
    .then((reservations) => {
      res.json(reservations);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch reservations' });
    });
});

// Route pour récupérer une réservation par son ID
app.get('/reservations/:id', (req, res) => {
  const { id } = req.params;

  Reservation.findById(id)
    .then((reservation) => {
      if (reservation) {
        res.json(reservation);
      } else {
        res.status(404).json({ error: 'Reservation not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch reservation' });
    });
});

// Route pour supprimer une réservation par son ID
app.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;

  Reservation.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: 'Reservation deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to delete reservation' });
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

//Exécution de l'application//

node app.js

//Pour la sécurité : installation de jsonwebtoken//

npm install jsonwebtoken bcrypt

//Configuration des paramètres de sécurité //

module.exports = {
    jwtSecret: 'votre_clé_secrète',
    jwtExpiration: '1h', // Durée de validité des tokens (par exemple, 1 heure)
  };

  //Implémentation de l'authentification //


  const express = require('express');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const config = require('./config');
  const app = express();
  
  app.use(express.json());
  
  // Route pour l'authentification
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Vérification de l'identifiant et du mot de passe (vous pouvez utiliser votre propre logique ici)
    if (username === 'admin' && password === 'admin') {
      // Génération d'un token JWT
      const token = jwt.sign({ username }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });
  
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
  
  // Middleware pour vérifier l'authentification
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, config.jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
  }
  
  // Exemple de route protégée
  app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
  });
  
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });


//Exécution de l'application//

node app.js

//Installation des outils de test//

npm install mocha chai supertest --save-dev


//Écriture des tests unitaires//

const chai = require('chai');
const expect = chai.expect;
const Reservation = require('../reservation');

describe('Reservation', () => {
  it('should create a new reservation', () => {
    const reservationData = {
      name: 'John Doe',
      email: 'john@example.com',
      date: new Date(),
      guests: 4,
    };

    const reservation = new Reservation(reservationData);

    expect(reservation).to.be.an.instanceOf(Reservation);
    expect(reservation.name).to.equal(reservationData.name);
    expect(reservation.email).to.equal(reservationData.email);
    expect(reservation.date).to.deep.equal(reservationData.date);
    expect(reservation.guests).to.equal(reservationData.guests);
  });

  // Ajoutez d'autres cas de test pour les opérations CRUD, etc.
});


//Écriture des tests d'intégration//

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

describe('Reservation API', () => {
  it('should create a new reservation', (done) => {
    const reservationData = {
      name: 'John Doe',
      email: 'john@example.com',
      date: new Date(),
      guests: 4,
    };

    request(app)
      .post('/reservations')
      .send(reservationData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('message', 'Reservation created successfully');
        done();
      });
  });

  // Ajoutez d'autres cas de test pour les autres routes, etc.
});


//Exécution des tests//

npx Chai tests


