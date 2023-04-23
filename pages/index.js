import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {

  const [userInput, setUserInput] = useState("I was 11, I was staying up all night, playing video games, when I heard something outside, in the bushes. I was paranoid and the blinds were wide open, so I looked outside and saw reddish, orange eyes. I could also barely make out a face, with a snout. I fell back in fear and heard a howl outside and then footsteps getting further away when I got back up. 2 minutes later, it was gone.");
  const [systemInput, setSystemInput] = useState("Write a story SIMILAR to SYSTEM. writing style should be straightforward and concise. It should give the information in a clear and direct manner, without using overly descriptive language or complex sentence structures. The sentences are relatively short and simple, making it easy for the reader to understand the situation being described. This style is commonly used in journalistic writing, where clarity and brevity are essential. In first person. story should be extremely long with lots of detail for every part of the story.");
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    
    console.debug("codeInput=" + codeInput);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          systemInput: systemInput,
          userInput: userInput,
          codeInput: codeInput
        }),
      });
      
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      
      console.debug("data.result=" + data.result);
      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Horror Story Generator</h3>
        <form onSubmit={onSubmit}>
          
          <textarea
            type="textarea"
            name="system"
            placeholder="Enter System"
            value={systemInput}
            rows="18"
            cols="20"
            onChange={(e) => setSystemInput(e.target.value)}
          />
          
          <textarea
            type="textarea"
            name="user"
            placeholder="User Input"
            value={userInput}
            rows="13"
            cols="20"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input
            type="text"
            name="code"
            placeholder="Enter Code"
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input type="submit" value="Generate story" />
        </form>
        
        <div className={styles.result}>
          <form>
            <textarea
              type="textarea"
              name="result"
              placeholder=""
              value={result}
              rows="18"
              cols="20"
            />
          </form>
        </div>
        </main>
    </div>
  );
}