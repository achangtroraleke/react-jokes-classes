import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = () =>{
  const [jokes, setJokes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [numJokes, setNumJokes] = useState(5)

  useEffect(()=>{
    generateNewJokes();

  },[])

  const getJokes = async () =>{
    let jokesArr = []
    let seenJokes = new Set()
    try{
      while(jokesArr.length < numJokes){
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;
        if(!seenJokes.has(joke.id)){
          seenJokes.add(joke.id);
          jokesArr.push({...joke, votes:0})
        }else{
          console.log("duplicate found!");
        }
      }
      setJokes(jokesArr);
      setLoading(false);
      }catch(err){
        console.log(err)
      }
    }

  const generateNewJokes = () =>{
    setLoading(true);
    getJokes()
  }
  
  const vote = (id, delta)=>{
    const output = jokes.map((j)=>{
      return j.id === id ? { ...j, votes: j.votes + delta } : j
      })
  
    setJokes(output)
  }

  if(isLoading){
    return(
      <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  return(
    <div className="JokeList">
    <button
      className="JokeList-getmore"
      onClick={generateNewJokes}
    >
      Get New Jokes
    </button>

    {jokes.map(j => (
      <Joke
        text={j.joke}
        key={j.id}
        id={j.id}
        votes={j.votes}
        vote={vote}
      />
    ))}
  </div>
  )
}

export default JokeList;
