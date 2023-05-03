import React, { Component } from 'react';
import Identicon from 'identicon.js';
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { RiVideoAddFill } from "react-icons/ri";
import { GoKebabHorizontal } from "react-icons/go";
import anhtuan from '../1.jpg'
import haidang from '../2.jpg'
import mongnuong from '../3.jpg'
import letram from '../4.jpg'
import mylinh from '../5.jpg'
import { SearchSorted } from '@tensorflow/tfjs';
import { FaUserFriends, FaStore } from "react-icons/fa";
import { MdGroups, MdOndemandVideo } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { BsChevronDown } from "react-icons/bs";

const Container1 = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
  border-radius: 8px;
  width: 98%;
  &:hover {
    background-color: #0000000d;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Image1 = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Container = styled.div`
  max-width: 200px;
  width: 90%;
  margin-right: 20px;
  @media (max-width: 875px) {
    display: none;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Label = styled.label`
  color: #65676b;
  font-weight: 500;
  font-size: 17px;
`;

const HeaderIcons = styled.div`
  display: flex;
  gap: 20px;
  svg {
    width: 20px;
    height: 20px;
    color: #65676b;
    cursor: pointer;
  }
`;

const Container1_left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  border-radius: 8px;
  width: 98%;
  &:hover {
    background-color: #0000000d;
  }
  svg,
  img {
    width: 20px;
    height: 20px;
    color: ${(props) => (props.colorIcon ? props.colorIcon : "#1b74e4")};
    @media (max-width: 550px) {
      display: none;
    }
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  @media (max-width: 680px) {
    padding: 10px 0;
  }
`;

const Label1_left = styled.label`
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 680px) {
    display: none;
  }
`;

const Container_left = styled.div`
  max-width: 300px;
  width: 100%;
  @media (max-width: 680px) {
    width: auto;
    position: absolute;
    left: 10px;
  }
`;



const ShortcutItem = ({ Icon, Title, colorIcon}) => {
  return (
    <Container1_left colorIcon={colorIcon}>
      {Icon && <Icon /> }
      <Label1_left>{Title}</Label1_left>
    </Container1_left>
  );
};

const ContactItem = ({ src, name }) => {
  return (
    <Container1>
      <Image1 src={src} />
      {name}
    </Container1>
  );
};
class Main extends Component {
  render() {
    const items = [
      { src: anhtuan, name: "Anh Tuấn" },
      { src: haidang, name: "Hải Đăng"},
      { src: mongnuong, name: "Lê Nương"},
      { src: letram, name: "Ngọc Trâm"},
      { src: mylinh, name: "Mỹ Linh"}
    ];
    return (
      <div className="container-fluid mt-5">
        <div className="row">

        <div className="col-lg-4 float-left" style={{ width: '100%'}}>
        <div className='col-lg-6 float-left'>
              <Container_left>
                  <ShortcutItem Icon={FaUserFriends} Title="Friend" />
                  <ShortcutItem Icon={MdGroups} Title="Groups" />
                  <ShortcutItem Icon={FaStore} Title="Marketplace" />
                  <ShortcutItem Icon={MdOndemandVideo} Title="Watch" />
                  <ShortcutItem Icon={GiBackwardTime} Title="Memories" />
                  <ShortcutItem Icon={BsChevronDown} Title="See More" colorIcon="gray" />
              </Container_left>
              </div>
          </div>

          <main role="main" className="col-lg-8 ml-auto mr-auto" style={{ maxWidth: '520px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              
              <h2 style={{color: 'red'}}>Share Image</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>

              <p>&nbsp;</p>
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={`https://ipfs.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}

            </div>
          </main>

          <div className="col-lg-4 float-right" style={{ width: '100%'}}>
            <div className='col-lg-6 float-right'>
              <Container>
                <Header>
                  <Label>Authors</Label>
                  <HeaderIcons>
                    <RiVideoAddFill/>
                    <FiSearch />
                    <GoKebabHorizontal />
                  </HeaderIcons>
                </Header>
                {items.map((contact, index) => (
                  <ContactItem key={index} src={contact.src} name={contact.name} />
                ))}
              </Container>
              </div>
            
            </div>   

        </div>
      </div>
    );
  }
}

export default Main;