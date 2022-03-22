//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

interface IToken {
  function transferFrom(address _from, address _to, uint256 _amount) external;
  function transfer(address _to, uint256 _amount) external;
}