#include <iostream>
#include <fstream>
#include <json.hpp>
#include <vector>
#include <map>
#include <string>
#include <limits>
#include <algorithm> 
#include <cassert>
#include <stdlib.h> 
using namespace std;

using json = nlohmann::json;
using Game = map<string, map<string, vector<int>>>;

const vector<vector<int>> board = {
    {0,0}, {0,1}, {0,2},
    {1,0}, {1,1}, {1,2},
    {2,0}, {2,1}, {2,2}
};

const map<string, string> changePlayer = {
    {"player0", "player1"}, {"player1", "player0"}
};

const vector<string> names = {"player0", "player1"};

void print(const Game& data){
    string tab(4, ' ');
    for (const string& name : names){
        cout << name << ":" << endl;
        for (auto it = data.at(name).begin(); it != data.at(name).end(); ++it){
            cout << tab << it->first << ": ";
            for (auto it2 = it->second.begin(); it2 != it->second.end(); ++it2){
                if (it2 == it->second.begin()) {
                    cout << *it2;
                } else {
                    cout << ", " << *it2;
                }
            }
            cout << endl;
        }
    }
}

// Checks if piece0 can move to piece1 according to rules
bool valid(const vector<int>& piece0, const vector<int>& piece1){
    return (abs(piece0[0] - piece1[0]) + abs(piece0[1] - piece1[1]) == 1) or
           (piece0[0] == 1 and piece0[1] == 1) or // Center can move in diagonal
           (piece1[0] == 1 and piece1[1] == 1);
}

int has_in_a_row(const Game& game, const string& currPlayer, int num){
    if (game.at(currPlayer).at("x").size() < num){
        return 0;
    }

    vector<int> piece0;
    vector<int> piece1;
    vector<int> piece2;
    if (game.at(currPlayer).at("x").size() >= 2){
        piece0 = {game.at(currPlayer).at("x")[0], game.at(currPlayer).at("y")[0]};
        piece1 = {game.at(currPlayer).at("x")[1], game.at(currPlayer).at("y")[1]};
    }
    if (game.at(currPlayer).at("x").size() == 3){
        piece2 = {game.at(currPlayer).at("x")[2], game.at(currPlayer).at("y")[2]};
    }

    if (num == 3){
        vector<int> dir1 = {piece0[0]-piece1[0], piece0[1]-piece1[1]};
        vector<int> dir2 = {piece1[0]-piece2[0], piece1[1]-piece2[1]};

        int dot_sq = dir1[0] * dir2[0] + dir1[1] * dir2[1];
        dot_sq *= dot_sq;

        int norm1_sq = dir1[0] * dir1[0] + dir1[1] * dir1[1];
        int norm2_sq = dir2[0] * dir2[0] + dir2[1] * dir2[1];

        return dot_sq == (norm1_sq * norm2_sq);
    }

    if (game.at(currPlayer).at("x").size() == 2){
        return valid(piece0, piece1);
    }
    if (game.at(currPlayer).at("x").size() == 3){
        return valid(piece0, piece1) or valid(piece0, piece2)
            or valid(piece1, piece2);
    }
    return 0;
}

int score(const Game& game, const string& currPlayer){
    int three_curr = has_in_a_row(game, currPlayer, 3);
    int two_curr = has_in_a_row(game, currPlayer, 2);
    int three_other = has_in_a_row(game, changePlayer.at(currPlayer), 3);
    int two_other = has_in_a_row(game, changePlayer.at(currPlayer), 2);

    return 1e6 * three_curr - 1e4 * three_other + two_curr - 1e2 * two_other;
}

bool finished(const Game& game){
    return has_in_a_row(game, "player0", 3) or has_in_a_row(game, "player1", 3);
}

// Checks if cell has any piece on it.
bool valid_add(const vector<int>& cell, const Game& game){
    for (const string& name : names){
        // Player
        for (int i = 0; i < game.at(name).at("x").size(); i++){
            if (cell[0] == game.at(name).at("x")[i] and cell[1] == game.at(name).at("y")[i]){
                return false;
            }
        }
    }
    return true;
}

// Checks if it is ok to move piece to cell
bool valid_move(const vector<int>& piece, const vector<int>& cell, 
                const Game& game){
    if (not valid_add(cell, game)) {
        return false;
    }

    return valid(piece, cell);
}  

int min_max_score(const Game& game, int depth, bool maxPlayer, const string& currPlayer){
    if (depth == 0 or finished(game)) { // Terminal node
        // print(game);
        // cout << "score: " << score(game, currPlayer) << " finished: " << finished(game) << endl;
        return score(game, currPlayer);
    }

    assert(game.at(currPlayer).at("x").size() <= 3);
    assert(game.at(changePlayer.at(currPlayer)).at("x").size() <= 3);
    if (maxPlayer) { // Maximizer
        bool move = game.at(currPlayer).at("x").size() == 3;
        int maxScore = -1 * numeric_limits<int>::max();
        if (not move){ 
            for (const vector<int>& cell : board){
                if (valid_add(cell, game)){
                    // Add piece
                    Game copy = game;
                    copy[currPlayer]["x"].push_back(cell[0]);
                    copy[currPlayer]["y"].push_back(cell[1]);
                    // Next player
                    int score_value = min_max_score(copy, depth-1, false, currPlayer);
                    maxScore = max(maxScore, score_value);
                }
            }
        } else {
            for (int i = 0; i < game.at(currPlayer).at("x").size(); i++){
                vector<int> piece = {game.at(currPlayer).at("x")[i],
                                     game.at(currPlayer).at("y")[i]};
                for (const vector<int>& cell : board){
                    if (valid_move(piece, cell, game)){
                        // Move piece
                        Game copy = game;
                        copy[currPlayer]["x"][i] = cell[0];
                        copy[currPlayer]["y"][i] = cell[1];
                        // Next player
                        int score_value = min_max_score(copy, depth-1, false, currPlayer);
                        maxScore = max(maxScore, score_value);
                    }
                }
            }
        }
        return maxScore;
    } else { // Minimizer
        bool move = game.at(changePlayer.at(currPlayer)).at("x").size() == 3;
        int minScore = numeric_limits<int>::max();
        if (not move){
            for (const vector<int>& cell : board){
                if (valid_add(cell, game)){
                    // Add piece
                    Game copy = game;
                    copy[changePlayer.at(currPlayer)]["x"].push_back(cell[0]);
                    copy[changePlayer.at(currPlayer)]["y"].push_back(cell[1]);
                    // Next player
                    int score_value = min_max_score(copy, depth-1, true, currPlayer);
                    minScore = min(minScore, score_value);
                }
            }
        } else {
            for (int i = 0; i < game.at(changePlayer.at(currPlayer)).at("x").size(); i++){
                vector<int> piece = {game.at(changePlayer.at(currPlayer)).at("x")[i],
                                     game.at(changePlayer.at(currPlayer)).at("y")[i]};
                for (const vector<int>& cell : board){
                    if (valid_move(piece, cell, game)){
                        // Move piece
                        Game copy = game;
                        copy[changePlayer.at(currPlayer)]["x"][i] = cell[0];
                        copy[changePlayer.at(currPlayer)]["y"][i] = cell[1];
                        // Next player
                        int score_value = min_max_score(copy, depth-1, true, currPlayer);
                        minScore = min(minScore, score_value);
                    }
                }
            }
        }
        return minScore;
    }
}

void min_max(Game& game, int depth, string currPlayer){
    if (depth == 0 or finished(game)) { // Terminal node
        cout << "Already finished" << endl;
        return;
    }

    assert(game[currPlayer]["x"].size() <= 3);
    bool move = game[currPlayer]["x"].size() == 3;
    int maxScore = -1 * numeric_limits<int>::max();
    vector<Game> result = {game};
    if (not move){
        for (const vector<int>& cell : board){
            // cout << "cell: " << cell[0] << ", " << cell[1] << endl;
            if (valid_add(cell, game)){
                // Add piece
                Game copy = game;
                copy[currPlayer]["x"].push_back(cell[0]);
                copy[currPlayer]["y"].push_back(cell[1]);
                // Next player
                int score_value = min_max_score(copy, depth-1, false, currPlayer);
                // cout << score_value << endl;
                if (maxScore < score_value){
                    maxScore = score_value;
                    result = {copy};
                    // cout << "updated, score: " << maxScore << endl;
                } else if (maxScore == score_value){
                    result.push_back(copy);
                }
            }
        }
    } else {
        for (int i = 0; i < game[currPlayer]["x"].size(); i++){
            vector<int> piece = {game[currPlayer]["x"][i],
                                 game[currPlayer]["y"][i]};
            for (const vector<int>& cell : board){
                if (valid_move(piece, cell, game)){
                    // Move piece
                    Game copy = game;
                    copy[currPlayer]["x"][i] = cell[0];
                    copy[currPlayer]["y"][i] = cell[1];
                    // Next player
                    int score_value = min_max_score(copy, depth-1, false, currPlayer);
                    // cout << score_value << endl;
                    if (maxScore < score_value){
                        maxScore = score_value;
                        result = {copy};
                        // cout << "updated" << endl;
                    } else if (maxScore == score_value){
                        result.push_back(copy);
                    }
                }
            }
        }
    }
    if (result.size() == 1){
        game = result[0];
    } else {
        game = result[rand() % (result.size()-1) + 1];
    }
    // cout << "maxScore: " << maxScore << endl;
}

int main(int argc, char **argv){
    /* initialize random seed: */
    srand (time(NULL));

    // Read the data
    ifstream i("../data.json");
    json j;
    i >> j;

    // Parse the data
    Game game = j;
    if (argc < 3){
        cout << "Program call: ./min_max.exe [player] [depth]" << endl;
        return 0;
    }
    string currPlayer = argv[1];
    int depth = stoi(argv[2]);

    // Run the algorithm
    min_max(game, depth, currPlayer);

    // Output the data
    print(game);
    ofstream o("../data.json");
    ofstream o2("../data2.json");
    j = game;
    o << j;
    o2 << j;
}