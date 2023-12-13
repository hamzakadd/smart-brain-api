const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();

metadata.set("authorization", "Key e2ad72adb7bf4f87b435c8766f2e6511");

const clarifai = require ('clarifai')
console.log(clarifai)

// const returnClarifaiRequestOptions = (imageUrl) => {

//   // Your PAT (Personal Access Token) can be found in the portal under Authentification
//   const PAT = 'cb4753e22a7e42439123e5b303dd2430';
//   // Specify the correct user_id/app_id pairings
//   // Since you're making inferences outside your app's scope
//   const USER_ID = 'hamzakadd';       
//   const APP_ID = 'test';
//   // Change these to whatever model and image URL you want to use
//   const MODEL_ID = 'face-detection';
//   const IMAGE_URL = imageUrl;

//   const raw = JSON.stringify({
//     "user_app_id": {
//         "user_id": USER_ID,
//         "app_id": APP_ID
//     },
//     "inputs": [
//         {
//             "data": {
//                 "image": {
//                     "url": IMAGE_URL
//                 }
//             }
//         }
//     ]
// });

// const requestOptions = {
//   method: 'POST',
//   headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//   },
//   body: raw
// };
// return requestOptions;
// }
const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: 'face-detection',
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
  );
}


// const handleApiCall = (req, res) => {
//   // fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(req.body.input))
//   // .then(data => {
//   //   res.json(data);
//   // })
//   // .catch(err => res.status(400).json('unable to work with API'))
// }

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
  }

  module.exports = {
    handleImage,
    handleApiCall
  }