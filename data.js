

let ENVELOPES = [
    {id: 1, title: 'housing', budget: 2000, remain: 2000},
    {id: 2, title: 'food', budget: 1000, remain: 1000},
    {id: 3, title: 'insurance', budget: 200, remain: 200}
];
const MAXIMUM = 10000;
let leftover = MAXIMUM;
let totalSpent = 0;

function checkExisting(title) {
    const found = ENVELOPES.find((env) => {
        return (env.title === title)
    });
    return found;
}

function checkBudget(budget) {
    const leftover = checkLeftOver();
    return(Number(budget) < leftover);
}

function checkLeftOver() {
    let currenttotal = 0;
    ENVELOPES.forEach(env => currenttotal += env.budget)
    leftover = MAXIMUM - currenttotal - totalSpent;
    return leftover;
}

function addEnvelope(title, budget) {
    //check if the title exists
    if(checkExisting(title)){
        console.log('title already existed');
        return null;
    }
    
    //check total budget
    if(!checkBudget(budget)){
        console.log('budget exceeded');
        return null;
    }
    
    //add new envelope
    const newEnvelope = {
        id: ENVELOPES.length + 1,
        title: title,
        budget: Number(budget),
        remain: Number(budget)
    };
    
    ENVELOPES.push(newEnvelope);
    return newEnvelope;
    //return ENVELOPES[ENVELOPES.length - 1];
}

function findEnvById(id){
    const found = ENVELOPES.find((env) => env.id === Number(id))
    if(!found){
        console.log('invalid id')
        return null
    } else {
        return found;
    }
}

function changeBudget(idInput, budgetInput) {
    const id = Number(idInput);
    const budget = Number(budgetInput);
    if(budget > checkLeftOver()){
        return 0;
    } else {
        const envelope = ENVELOPES.find(env => env.id === id);
        const envelopeSpent = envelope.budget - envelope.remain;
        if(budget < envelopeSpent) {
            return -1;
        } else {
            envelope.budget = budget;
            envelope.remain = budget - envelopeSpent;
            return envelope;
        }
    }   
}

function extractMoney(idInput, amountInput) {
    const id = Number(idInput);
    const amount = Number(amountInput);
    const envToChange = ENVELOPES.find((env) => env.id === id)
    if(amount > envToChange.budget){
        return null;
    }
    envToChange.remain -= amount;
    totalSpent += amount;
    return(envToChange);
}

function deleteEnvelope(id){
    const deleted = ENVELOPES.find((env) => env.id === Number(id));
    ENVELOPES.splice(Number(id)-1, 1);
    return deleted;
}

function transferBudget(idFrom, idTo, amo){
    const amount = Number(amo);
    const envFrom = findEnvById(Number(idFrom));
    const envTo = findEnvById(Number(idTo));
    if(!envFrom || !envTo){
        return 0;
    }
    if(amount > envFrom.budget || amount > envFrom.remain){
        return -1;
    } else {
        envFrom.budget -= amount;
        envFrom.remain -= amount;
        envTo.budget += amount;
        envTo.remain += amount;
        return [envFrom, envTo]
    }
}

function equallyDistribute(amountInput) {
    const amount = Number(amountInput);
    if(amount > checkLeftOver()){
        return null;
    }
    const division = Math.floor(amount/ENVELOPES.length);
    const more = amount - division * (ENVELOPES.length - 1)
    ENVELOPES[0].budget += more;
    ENVELOPES[0].remain += more;
    for(let i = 1; i < ENVELOPES.length; i++){
        ENVELOPES[i].budget += division;
        ENVELOPES[i].remain += division;
    }
    return 1;
}

module.exports = {
    ENVELOPES,
    addEnvelope,
    findEnvById,
    changeBudget,
    extractMoney,
    deleteEnvelope,
    transferBudget,
    equallyDistribute
}

//console.log(addEnvelope('housing', 2000));
//console.log(addEnvelope('social', 400));
//console.log(addEnvelope('health', 50000));
//equallyDistribute(300);
//console.log(ENVELOPES);
