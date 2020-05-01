const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

admin.initializeApp();
app.use(helmet());
app.use(express.json());
app.use(cors());

app.post('/functions/resources', async (req, res) => {
  const { author, title, url, tags } = req.body;

  try {
    await admin.database()
      .ref('resources')
      .push('value');

    return res.status(200).json({ message: 'Resource successfully created.' });
  } catch (error) {
    console.error(`POST /functions/resources ({ author: ${author}, title: ${title}, url ${url}, tags: ${tags} }) >> ${error.stack}`);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/functions/server-decklists', async (req, res) => {
  try {
    const serverDecklists = await admin.database()
      .ref('server-decklists')
      .once('value')
      .then(snap => snap.val());

    return res.status(200).json(serverDecklists);
  } catch (error) {
    console.error(`GET /functions/server-decklists >> ${error.stack}`);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/functions/decks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deck = await admin.database()
      .ref(`decks/${id}`)
      .once('value')
      .then(snap => snap.val());

    return res.status(200).json(deck);
  } catch (error) {
    console.error(`GET /functions/decks/${id} >> ${error.stack}`);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/functions/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await admin.database()
      .ref(`users/${id}`)
      .once('value')
      .then(snap => snap.val());

    return res.status(200).json(user);
  } catch (error) {
    console.error(`GET /functions/users/${id} >> ${error.stack}`);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/functions/users/:id/emotegang', async (req, res) => {
  const { id } = req.params;

  try {
    const { isEmoteGang = false } = await admin.database()
      .ref(`users/${id}`)
      .once('value')
      .then(snap => snap.val());

    await admin.database()
      .ref(`users/${id}`)
      .set({ isEmoteGang: !isEmoteGang });

    return res.status(200).json({ isEmoteGang: !isEmoteGang });
  } catch (error) {
    console.error(`POST /functions/users/${id}/emotegang >> ${error.stack}`);
    return res.status(500).json({ error: error.message });
  }
});

exports.app = functions.https.onRequest(app);
