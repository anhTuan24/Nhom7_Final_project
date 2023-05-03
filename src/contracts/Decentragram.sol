// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Decentragram {
  // Code goes here...
  string public name = "Decentragram";
  uint public imageCount = 0;
  //Store image: lưu trữ hình ảnh
  mapping (uint => Image) public images;
  //cấu trúc
  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  //create image 
  function uploadImage(string memory _imghash, string memory _descripiton) public{

    //kiểm tra description img exits
    require(bytes(_descripiton).length > 0);
    //kiểm tra địa chỉ người gửi có tồn tại
    require(msg.sender != address(0x0));
    //kiểm tra img hash exit
    require(bytes(_imghash).length > 0);
    imageCount++;

    //thêm hình ảnh vào hợp đồng
    images[imageCount] = Image(imageCount, _imghash, _descripiton, 0, msg.sender);
    //trigger an event
    emit ImageCreated(imageCount, _imghash, _descripiton, 0, msg.sender);
  }

  //tip image
  function tipImageOwner(uint _id) public payable {
    //kiểm tra chắc rằng id tồn tại
      require(_id > 0 && _id <= imageCount);
      Image memory _image = images[_id];
      //nạp vào tác giả
      address payable _author = _image.author;
      //trả tiền cho tác giả bằng cách gửi cho họ Ether
      address(_author).transfer(msg.value);
      //tăng số tiền tip
      _image.tipAmount = _image.tipAmount + msg.value;
      //cập nhật hình ảnh
      images[_id] = _image;
      //phát sinh sự kiện
      emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }
}