import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'
import * as tf from '@tensorflow/tfjs';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const projectId = '2MS8nPdgiJrklYkfg78wP5ItWvy';
const projectSecret = 'd7a2beeb681053d0d24e1dccb5a867f9';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https',apiPath: '/api/v0' ,headers: {
  authorization: auth,
},}) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadModel()
  }

  async loadModel() {
    const response = await fetch('http://localhost:3001/model');
  
    const model = await tf.loadLayersModel("http://localhost:3001/model");
    
    this.setState({ model });
    console.log("Model loaded");
    console.log(model.summary())
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Non-Ethereum browser detected. You should consider trying Metamask")
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]
    if(networkData) {
      const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address)
      this.setState({ decentragram })
      const imagesCount = await decentragram.methods.imageCount().call()
      this.setState({ imagesCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await decentragram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({loading: false})
    }
    else{
      window.alert("Contract not deployed to detected network")
    }
    
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    const reader1 = new window.FileReader()
    reader1.readAsDataURL(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }

    reader1.onloadend = () => {
      const fileContent = reader1.result;
      const img = new Image(); 
      img.onload = () => {
        
        console.log(img)
        console.log(img.width)
        const pixels = tf.browser.fromPixels(img)
        const resized = tf.image.resizeBilinear(pixels, [150, 150])
        const normalized = resized.div(255.0)
        const input = tf.expandDims(normalized, 0)
        const predict = this.state.model.predict(input)
        const probability = predict.dataSync()[0]
        console.log(probability)
        this.setState({ predicts: probability })
      // this.setState({ img: fileContent });
      // console.log('file:', this.state.img)
      // console.log("img", img)
      }
      img.src = fileContent
    }
  } 

  uploadImage =  description => {
    console.log("Submitting file to ipfs...")
    //adding file to the IPFS
    if(this.state.predicts > 0.5){
      window.alert("Sensitive img")
      return
    }
    else{
      ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.decentragram.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  }

  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.decentragram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      images: [],
      loading: true,
      model: null
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            images={this.state.images}
            tipImageOwner={this.tipImageOwner}
            />
          }
        
      </div>
    );
  }
}

export default App;