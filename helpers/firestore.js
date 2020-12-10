const socketIO = require('socket.io')
const http = require('http')
const uuid = require('uuid/v4')
const {Firestore} = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();

const eventTypes = {
  'follow_events': 'follow',
  'favorite_events': 'favorite',
  'tweet_create_events': 'create',
}


class FireDoc {
  // ..and an (optional) custom class constructor. If one is
  // not supplied, a default constructor is used instead:
  // constructor() { }
  constructor() {
    this.firestoreDoc;
  }

  getEventType(body) {
    for (const type in eventTypes) {
      if (body[type]) {
        return eventTypes[type];
      }
    }
    return 'unknown';
  } 

  async save(id, body) {
    this.firestoreDoc = firestore.doc(`twitter-events/${id}`);
    const eventType = this.getEventType(body);

    // Enter new data into the document.
    await this.firestoreDoc.set({
      title: id,
      type: eventType,
      body: body,
    })
    // .then(() => {
    //   this.list(eventType);
    // });
  }

  async list(id, body) {
    
    const eventType = this.getEventType(body);
    const collectionReference = firestore.collection('twitter-events');
    const eventDocuments = await collectionReference
      .orderBy('body.for_user_id', 'desc')
      .where('type', '==', eventType)
      .get();
    const eventDocumentData = eventDocuments.docs.map(d => d.data());
    
    // console.log(`list all docs with type = ${eventType}`);
    // eventDocumentData.forEach(doc => {
    //   console.log(doc.type, doc.title, doc.body.for_user_id);
    // });

    return eventDocumentData;
  }
}


module.exports = FireDoc