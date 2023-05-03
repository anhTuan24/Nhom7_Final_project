const express = require('express');
const app = express();
const fs = require('fs');
const cors = require("cors");
app.use(cors());

// Endpoint to get model file

app.use(express.static("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model"));
app.get('/model', (req, res) => {

    res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\model.json");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard1of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard2of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard3of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard4of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard5of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shard6of7.bin");
    // res.sendFile("D:\\tai_lieu_dai_hoc\\PTDL2\\project\\decentragram\\tf_model\\group1-shardof7.bin");

});

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});