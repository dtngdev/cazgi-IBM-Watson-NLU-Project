const express = require('express');
const dotenv = require('dotenv');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

dotenv.config();
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        url: req.query.url,
        features: {
            emotion:{
                document: true
            }
        }
    };
    sendAnalyseEmotionResponse(res,naturalLanguageUnderstanding,analyzeParams);
});

app.get("/url/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        url: req.query.url,
        features: {
            sentiment:{
                document: true
            }
        }
    };
    sendAnalyseSentimentResponse(res,naturalLanguageUnderstanding,analyzeParams);
});

app.get("/text/emotion", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        text: req.query.text,
        features: {
            emotion:{
                document: true
            }
        }
    };
    sendAnalyseEmotionResponse(res,naturalLanguageUnderstanding,analyzeParams);
});

app.get("/text/sentiment", (req,res) => {
    const naturalLanguageUnderstanding = getNLUInstance();
    const analyzeParams = {
        text: req.query.text,
        features: {
            sentiment:{
                document: true
            }
        }
    };
    sendAnalyseSentimentResponse(res,naturalLanguageUnderstanding,analyzeParams);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});

const getNLUInstance = ()=>{
    const apiKey = process.env.API_KEY;
    const apiUrl = process.env.API_URL;

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: apiKey,
        }),
        serviceUrl: apiUrl,
    });
    return naturalLanguageUnderstanding;
}

const sendAnalyseEmotionResponse = (res,nlu,params)=>{
    nlu.analyze(params)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults));
            try{
                const emotion = analysisResults.result.emotion.document.emotion;
                return res.send(emotion);
            }
            catch (err){
                return res.status(400).send({error: "result not found"});
            }
        })
        .catch(err => {
            return res.status(400).send({"error":err.message});

        });
}

const sendAnalyseSentimentResponse = (res,nlu,params)=>{
    nlu.analyze(params)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults.result));
            try{
                const label = analysisResults.result.sentiment.document.label;
                return res.send(label);
            }
            catch (err){
                return res.status(400).send({error: "result not found"});
            }
        })
        .catch(err => {
            return res.status(400).send({"error":err.message});

        });
}
