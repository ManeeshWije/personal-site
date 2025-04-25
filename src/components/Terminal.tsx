import React, { useState, useRef, useEffect } from "react";
import me from "../assets/me.jpg";
import climb from "../assets/climb.jpg";
import { videos } from "../videoData";
import resume from "../assets/resume.pdf";

const Terminal: React.FC = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string[]>([]);
    const [modalVideo, setModalVideo] = useState<string | null>(null);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    useEffect(() => {
        document.addEventListener("click", () => inputRef.current?.focus());
        return () =>
            document.removeEventListener("click", () =>
                inputRef.current?.focus(),
            );
    }, []);

    useEffect(() => {
        // Add function to window object so it can be called from inline HTML
        window.openVideoModal = (id: string) => {
            setModalVideo(id);
        };

        // Clean up
        return () => {
            // @ts-ignore
            delete window.openVideoModal;
        };
    }, []);

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
                    "fun fact: i've done boulder problems up to V10, you can type 'climbing' to learn more",
                    `<div style="display: flex; gap: 10px; justify-content: left;">
                        <img src="${me}" alt="Maneesh portrait" class="shadow-lg mt-4 mb-4" style="width: 300px; height: 300px; object-fit: cover;" />
                        <img src="${climb}" alt="Maneesh climbing a boulder" class="shadow-lg mt-4 mb-4" style="width: 300px; height: 300px; object-fit: cover;" />
                    </div>`,
                ]);
                break;
            case "github":
                window.open("https://www.github.com/ManeeshWije", "_blank");
                break;
            case "blog":
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "nothing to see here...yet",
                ]);
                break;
            case "climbing":
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "some of my bouldering sessions, click to watch:",
                ]);

                setOutput((prevOutput) => [
                    ...prevOutput,
                    `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        ${videos
                            .map(
                                (video) => `
                            <div class="video-thumbnail py-2">
                                <p>${video.title}</p>
                                <img 
                                    src="https://img.youtube.com/vi/${video.youtubeId}/0.jpg" 
                                    alt="${video.title}" 
                                    class="cursor-pointer rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                                    onclick="window.openVideoModal('${video.youtubeId}')"
                                />
                            </div>
                        `,
                            )
                            .join("")}
                    </div>`,
                ]);
                break;
            case "resume":
                window.open(resume, "_blank");
                break;
            case "clear":
                setOutput([]);
                break;
            default:
                setOutput((prevOutput) => [
                    ...prevOutput,
                    `Command not found: ${command}`,
                ]);
        }
    };

    return (
        <div>
            <div>
                <h1 className="font-bold text-lg">
                    type 'about', 'github', 'blog', 'climbing', 'resume', or
                    clear the screen with 'clear'.
                </h1>
            </div>
            <div ref={terminalRef} className="output-container">
                {output.map((line, index) => (
                    <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: line }}
                    />
                ))}
            </div>
            <div className="flex flex-row w-full relative">
                <span>&gt;&#160;</span>
                <span
                    className="absolute"
                    style={{
                        transform: `translateX(${input.length * 9.6 + 20}px)`,
                        animation: "blink 1s infinite",
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

            {/* Video Modal */}
            {modalVideo && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    onClick={() => setModalVideo(null)}
                >
                    <div
                        className="bg-black p-4 rounded-lg"
                        style={{
                            position: "relative",
                            width: "90%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="w-full relative"
                            style={{ height: "calc(90vh - 32px)" }}
                        >
                            <iframe
                                className="rounded-lg"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: "80vh",
                                }}
                                src={`https://www.youtube.com/embed/${modalVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalVideo(null);
                                }}
                                className="absolute top-2 right-2 text-white text-2xl bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
                                style={{
                                    zIndex: 10000,
                                    background: "rgba(255, 0, 0, 0.7)",
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Need to add this to TypeScript interface
declare global {
    interface Window {
        openVideoModal: (id: string) => void;
    }
}

export default Terminal;
