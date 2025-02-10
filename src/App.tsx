"use client"

import type React from "react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

const styles = {
    container: {
        margin: "auto auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: "#eee",
        marginBottom: "2rem",
        textAlign: "center" as const,
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "1rem",
    },
    textarea: {
        width: "100%",
        height: "200px",
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    select: {
        width: "100%",
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    output: {
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#222222",
        borderRadius: "4px",
        border: "1px solid #ccc",
        color: "#ddd",
    },
}

export default function LLMPromptSPA() {
    const [prompt, setPrompt] = useState("")
    const [newPrompt, setNewPrompt] = useState("")
    const [level, setLevel] = useState("Undergraduate")
    const [output, setOutput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulating a fetch request to an LLM API
            const response = await fetch("https://flow-api.mira.network/v1/flows/flows/dvenom/promptgpt?version=1.4.0", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "miraauthorization": "sb-3431c61991c07075526bc13aa9ac4462"
                },
                body: JSON.stringify({ input: { question: prompt, res_level: level } }),
            })

            if (!response.ok) {
                throw new Error("API request failed")
            }

            // Simulating the API response
            const result = await response.json()
            console.log(result)
            setOutput(result.response_flow)
            setNewPrompt(result.prompt_generate_flow)
        } catch (error: any) {
            setOutput("An error occurred while processing your request.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Multiprompter</h1>
            <p>Ask Claude anything, we'll create the best prompt for you!</p>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label htmlFor="prompt">Your query:</label>
                <textarea
                    name={"prompt"}
                    cols={80}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    style={styles.textarea}
                />
                <label htmlFor="res_level">The intended audience:</label>
                <select value={level} name="res_level" onChange={(e) => setLevel(e.target.value)} style={styles.select}>
                    <option value="professional">Professional</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="highschooler">High schooler</option>
                    <option value="child">Child</option>
                </select>
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Submit"}
                </button>
            </form>
            {output && (
                <div>
                    <h3>Output:</h3>
                    <div style={styles.output}>
                        <ReactMarkdown>{output}</ReactMarkdown>
                    </div>
                </div>
            )}
            {newPrompt && (
                <div>
                    <h3>Generated prompt:</h3>
                    <div style={styles.output}>
                        <ReactMarkdown>{newPrompt}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    )
}

