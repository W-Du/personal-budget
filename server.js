const express = require('express');
const app = new express();
const {
    ENVELOPES,
    addEnvelope,
    findEnvById,
    changeBudget,
    extractMoney,
    deleteEnvelope,
    transferBudget,
    equallyDistribute
} = require('./data.js');

// //testing
// app.get('/', (req, res, next) => {
//     res.status(200).send('hello');
// })

app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 3000;

//find ID
app.param('id', (req, res, next, id) => {
    const env = findEnvById(id);
    if(env){
        req.envelope = env;
        req.id = id;
        next();
    } else {
        res.status(404).send('id invalid');
    }
})

//HTTP requests
//retrieve envelope
app.get('/', (req, res, next) => {
    res.send(ENVELOPES);
})

app.get('/:id', (req, res, next) => {
    res.status(200).send(req.envelope);
})

//create new envelope
app.post('/envelopes', (req, res, next) => {
    const newEnvelope = addEnvelope(req.body.title, req.body.budget);
    if(!newEnvelope){
        res.status(400).send(`envelope cannot be made`);
    } else {
        res.status(201).send(newEnvelope);
    }
})

//update budget
app.put('/:id', (req, res, next) => {
    const env = changeBudget(req.id, req.query.budget);
    if(env === 0) {
        res.status(400).send('budget exceed')
    } else if(env === -1){
        res.status(400).send('budget too low')
    }
    else {
        res.status(200).send(env);
    }
})

app.post('/envelopes/:id', (req, res, next) => {
    const env = extractMoney(req.params.id, req.query.amount);
    if (!env){
        res.status(400).send('invalid amount')
    } else {
        res.status(201).send(env)
    }
})

//delete
app.delete('/:id', (req, res, next) => {
    const deleted = deleteEnvelope(req.id);
    if(deleted){
        res.status(204).send()
    } 
})

//transfer
app.post('/envelopes/transfer/:from/:to', (req, res, next) => {
    const idFrom = req.params.from;
    const idTo = req.params.to;
    const amount = req.query.amount;
    const updated = transferBudget(idFrom, idTo, amount);
    if(updated === 0) {
        res.status(404).send('invalid id');
    } else if(updated === -1){
        res.status(400).send('invalid amount to transfer')
    } else {
        res.status(200).send(updated);
    }
})

//distribute
app.patch('/envelopes/distribute', (req, res, next) => {
    const newEnvelops = equallyDistribute(req.body.amount);
    if(!newEnvelops){
        res.status(400).send('invalid amount')
    } else {
        res.status(200).send(ENVELOPES);
    }
 })



app.listen(PORT, () => {
    console.log(`server listening to port ${PORT}`)
})