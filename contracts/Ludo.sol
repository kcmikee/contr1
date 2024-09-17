// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract Ludo {
    uint8 public BoardSize = 56;
    struct Player {
        address addr;
        uint8 piecesAtHome;
        uint8[4] piecePositions;
        bool hasWon;
        string color;
    }
    Player[] public players;

    string[] public playerColors;

    uint8 public turn;
    uint8 public diceResult;
    uint8 public minPlayers = 2;
    uint8 public maxPlayers = 4;

    bool public started;
    bool public ended;

    constructor() {
        turn = 0;
        started = false;
        playerColors = ["red", "blue", "green", "yellow"];
    }

    function startGame() public {
        require(!started, "Game already started");
        started = true;
    }

    function joinGame(address player) public {
        require(player != address(0), "Zero address detected");
        require(!started, "Game already started");
        require(players.length < maxPlayers, "Maximum players reached");
        players.push(
            Player(player, 4, [0, 0, 0, 0], false, playerColors[players.length])
        );

        if (players.length == minPlayers) {
            started = true;
        }
    }

    function rollDice() public {
        require(started, "Game not started");
        require(players.length > 0, "No players joined");
        require(players.length >= minPlayers, "Minimum number of players is 2");
        require(players[turn].addr != msg.sender, "Its not your turn");
        require(turn < players.length, "All players have rolled");
        diceResult = uint8(block.timestamp % 6) + 1;

        if (turn == players.length) {
            turn = 0;
        } else {
            turn++;
        }
    }

    function movePiece(uint8 pieceIndex) public {
        require(started, "Game has not started yet");
        require(msg.sender == players[turn].addr, "It's not your turn");
        require(pieceIndex < 4, "Invalid piece index");

        Player storage currentPlayer = players[turn];

        if (currentPlayer.piecesAtHome > 0 && diceResult == 6) {
            currentPlayer.piecesAtHome--;
            currentPlayer.piecePositions[pieceIndex] = 1;
        } else {
            require(
                currentPlayer.piecePositions[pieceIndex] > 0,
                "This piece is still at home"
            );
            currentPlayer.piecePositions[pieceIndex] += diceResult;
        }
    }
}
