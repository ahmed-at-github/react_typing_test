import { useEffect, useState } from "react";
import "./style.css";
import TypingArea from "./TypingArea";

function SpeedTypingGame() {
  const paragraphs = [
    "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot.",

    "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo. Its primary function is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant",
  ];

  const [typing, setTyping] = useState("");
  const [inpField, setInpField] = useState("");
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistake, setMistake] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0); //Characters Per Minute

  //initial loading
  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length); //Generating random Paragraphs 
    const inputField = document.getElementsByClassName("input-field")[0]; //Catching input element
    // console.log(inputField);
    
    document.addEventListener("keydown", () => inputField.focus()); //

    //typing mechanism
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        style={{ color: letter !== " " ? "black" : "transparent" }}
        className={`char ${index === 0 ? "active" : ""}`} //clsname for later referrence
      >
        {letter !== " " ? letter : "_"} 
      </span>
    ));
    setTyping(content);
    setInpField("");
    setCharIndex(0);
    setMistake(0);
    setIsTyping(false);
  };

  //Logic for handling wrong/right
  const initTyping = (event) => {
    //initial Typing
    const characters = document.querySelectorAll(".char"); //from line_35, selecting all letters
    console.log(characters);
    
    let typedChar = event.target.value;

    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].innerText;
      if (currentChar === "_") currentChar = " ";
      if (!isTyping) {
        setIsTyping(true);
      }
      if (typedChar === currentChar) {
        setCharIndex(charIndex + 1);  //imp 
        if (charIndex + 1 < characters.length) {
          characters[charIndex + 1].classList.add("active");
        }
        characters[charIndex].classList.remove("active");
        characters[charIndex].classList.add("correct");
      } else {
        setCharIndex(charIndex + 1); //imp
        setMistake(mistake + 1);
        characters[charIndex].classList.remove("active");
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.add("wrong");
      }

      if (charIndex === characters.length - 1) setIsTyping(false);

      let wpm = Math.round(
        ((charIndex - mistake) / 5 / (maxTime - timeLeft)) * 60
      ); //avg 5 letters per word

      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      setWPM(wpm);

      let cpm = (charIndex - mistake) * (60 / (maxTime - timeLeft));
      cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
      setCPM(parseInt(cpm, 10));
    } else {
      setIsTyping(false);
    }
  };

   /* logic for handling backspace */
   const handleKeyDown = (event) => {
    const characters = document.querySelectorAll(".char"); //from line_35, selecting all letters

    // console.log(characters);

    if ( 
      event.key === "Backspace" &&
      charIndex > 0 &&
      charIndex < characters.length &&
      timeLeft > 0
    ) {
      if (characters[charIndex - 1].classList.contains("correct")) {
        characters[charIndex - 1].classList.remove("correct");
      }
      if (characters[charIndex - 1].classList.contains("wrong")) {
        characters[charIndex - 1].classList.remove("wrong");
        setMistake(mistake - 1);
      }
      characters[charIndex].classList.remove("active");
      characters[charIndex - 1].classList.add("active");
      setCharIndex(charIndex - 1);

      let cpm = (charIndex - mistake - 1) * (60 / (maxTime - timeLeft));
      cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
      setCPM(parseInt(cpm, 10));

      let wpm = Math.round(
        ((charIndex - mistake) / 5 / (maxTime - timeLeft)) * 60
      );
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      setWPM(wpm);
    }
  };

  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistake(0);
    setTyping("");
    setCPM(0);
    setWPM(0);

    const characters = document.querySelectorAll(".char");
    characters.forEach((span) => {
      span.classList.remove("correct");
      span.classList.remove("wrong");
      span.classList.remove("active");
    });
    characters[0].classList.add("active");
    loadParagraph();
  };

  useEffect(() => {
    loadParagraph();
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let cpm = (charIndex - mistake) * (60 / (maxTime - timeLeft));
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm, 10));

        let wpm = Math.round(
          ((charIndex - mistake) / 5 / (maxTime - timeLeft)) * 60
        );
        setWPM(wpm);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft]);

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        value={inpField}
        onChange={initTyping}
        onKeyDown={handleKeyDown}
      />
        {/* TypingArea component */}
        <TypingArea
          typingText={typing}
          inpFieldValue={inpField}
          timeLeft={timeLeft}
          mistakes={mistake}
          WPM={WPM}
          CPM={CPM}
          initTyping={initTyping}
          handleKeyDown={handleKeyDown}
          resetGame={resetGame}
        />
    </div>
  );
}

export default SpeedTypingGame;
