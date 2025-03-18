import React, { useState, useRef, useEffect } from "react";
import me from "../assets/me.jpg";
import climb from "../assets/climb.jpg";
import resume from "../assets/resume.pdf";

const Terminal: React.FC = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string[]>([]);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setOutput((prevOutput) => [...prevOutput, `> ${input}`]);
            executeCommand(input.trim().toLowerCase());
            setInput("");
        }
    };

    const executeCommand = (command: string) => {
        switch (command) {
            case "about":
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "hi i'm maneesh, a computer science graduate from the University of Guelph.",
                    "i'm passionate about backend development, devtooling, infrastructure, and distributed systems.",
                    "you can reach me at <a href='mailto:m.mwije1@proton.me' target='_blank'>m.mwije1@proton.me</a> or my <a href='https://www.linkedin.com/in/maneeshwije/' target='_blank'>linkedin</a>.",
                    "you can also view my projects by typing in 'github' :)",
                    "fun fact: i've done boulder problems up to V10",
                    `<div style="display: flex; gap: 10px; justify-content: left;">
                        <img src="${me}" alt="Maneesh portrait" class="shadow-lg mt-4 mb-4" style="width: 300px; height: 300px; object-fit: cover;" />
                        <img src="${climb}" alt="Maneesh climbing a boulder" class="shadow-lg mt-4 mb-4" style="width: 300px; height: 300px; object-fit: cover;" />
                    </div>`
                ]);
                break;
            case "github":
                window.open('https://www.github.com/ManeeshWije', "_blank");
                break;
            case "blog":
                setOutput((prevOutput) => [...prevOutput, "nothing to see here...yet"]);
                break;
            case "resume":
                window.open(resume, "_blank");
                break;
            case "clear":
                setOutput([]);
                break;
            default:
                setOutput((prevOutput) => [...prevOutput, `Command not found: ${command}`]);
        }
    };

    useEffect(() => {
        document.addEventListener("click", () => inputRef.current?.focus());
        return () => document.removeEventListener("click", () => inputRef.current?.focus());
    }, []);

    return (
        <div>
            <div>
                <h1 className="font-bold text-lg">type 'about', 'github', 'blog', 'resume', or clear the screen with 'clear'.</h1>
            </div>
            <div ref={terminalRef} className="output-container">
                {output.map((line, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
            </div>
            <div className="flex flex-row w-full relative">
                <span>&gt;&#160;</span>
                <span
                    className="absolute"
                    style={{
                        transform: `translateX(${input.length * 9.6 + 20}px)`,
                        animation: "blink 1s infinite"
                    }}
                >
                    &#9611;
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleInputKeyPress}
                    autoFocus
                    className="w-full bg-transparent caret-transparent"
                />
            </div>
        </div>
    );
};

export default Terminal;
