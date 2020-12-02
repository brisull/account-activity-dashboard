const socketIO = require('socket.io')
const http = require('http')
const uuid = require('uuid/v4')
const {Firestore} = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();


class FireDoc {
  // ..and an (optional) custom class constructor. If one is
  // not supplied, a default constructor is used instead:
  // constructor() { }
  constructor() {
    this.firestoreDoc;
  }

  async save(id, body) {
    this.firestoreDoc = firestore.doc(`twitter-events/${id}`);
    console.log('id', id, 'body', body);

    // Enter new data into the document.
    await this.firestoreDoc.set({
      title: id,
      body: body,
    });
  }
}

// const document = firestore.doc('posts/intro-to-firestore');


module.exports = FireDoc