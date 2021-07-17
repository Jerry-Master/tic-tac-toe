#include <iostream>
#include <fstream>
#include <json.hpp>
#include <vector>
#include <map>
#include <string>
#include <limits>
#include <algorithm> 
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

int score(const Game& game){

}

bool valid_add(const vector<int>& cell, const Game& game, const string& currPlayer){

}

bool valid_move(const vector<int>& piece, const vector<int>& cell, 
                const Game& game, const string& currPlayer){

}

int min_max_score(Game& game, int depth, bool maxPlayer, const string& currPlayer){
    if (depth == 0) { // Terminal node
        return score(game);
    }

    bool move = game[currPlayer]["x"].size() >= 3;
    if (maxPlayer) {
        int maxScore = -1 * numeric_limits<int>::infinity();
        if (not move){ // Maximizer
            for (const vector<int>& cell : board){
                if (valid_add(cell, game, currPlayer)){
                    // Add piece
                    Game copy = game;
                    copy[currPlayer]["x"].push_back(cell[0]);
                    copy[currPlayer]["y"].push_back(cell[1]);
                    // Next player
                    int score_value = min_max_score(copy, depth-1, false, 
                                changePlayer.at(currPlayer));
                    maxScore = max(maxScore, score_value);
                }
            }
        } else {
            for (int i = 0; i < game[currPlayer]["x"].size(); i++){
                vector<int> piece = {game[currPlayer]["x"][i],
                                     game[currPlayer]["y"][i]};
                for (const vector<int>& cell : board){
                    if (valid_move(piece, cell, game, currPlayer)){
                        // Move piece
                        Game copy = game;
                        copy[currPlayer]["x"][i] = cell[0];
                        copy[currPlayer]["y"][i] = cell[1];
                        // Next player
                        int score_value = min_max_score(copy, depth-1, false, 
                                    changePlayer.at(currPlayer));
                        maxScore = max(maxScore, score_value);
                    }
                }
            }
        }
        return maxScore;
    } else { // Minimizer
        int minScore = numeric_limits<int>::infinity();
        if (not move){
            for (const vector<int>& cell : board){
                if (valid_add(cell, game, currPlayer)){
                    // Add piece
                    Game copy = game;
                    copy[currPlayer]["x"].push_back(cell[0]);
                    copy[currPlayer]["y"].push_back(cell[1]);
                    // Next player
                    int score_value = min_max_score(copy, depth-1, true, 
                                changePlayer.at(currPlayer));
                    minScore = min(minScore, score_value);
                }
            }
        } else {
            for (int i = 0; i < game[currPlayer]["x"].size(); i++){
                vector<int> piece = {game[currPlayer]["x"][i],
                                     game[currPlayer]["y"][i]};
                for (const vector<int>& cell : board){
                    if (valid_move(piece, cell, game, currPlayer)){
                        // Move piece
                        Game copy = game;
                        copy[currPlayer]["x"][i] = cell[0];
                        copy[currPlayer]["y"][i] = cell[1];
                        // Next player
                        int score_value = min_max_score(copy, depth-1, true, 
                                    changePlayer.at(currPlayer));
                        minScore = min(minScore, score_value);
                    }
                }
            }
        }
        return minScore;
    }
    return;
}

void min_max(Game& game, int depth, bool maxPlayer, string currPlayer, bool move){
    
}

void print(const Game& data){
    vector<string> names = {"player0", "player1"};
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

int main(){
    // Read the data
    ifstream i("../data.json");
    json j;
    i >> j;

    // Parse the data
    Game game = j;
    string currPlayer = "player0";
    if (game["player0"]["x"].size() > game["player1"]["x"].size()){
        currPlayer = "player1";
    }

    // Run the algorithm
    //min_max(game, 7, true, currPlayer, move);

    // Output the data
    print(game);
    ofstream o("../data.json");
    j = game;
    o << j;
}