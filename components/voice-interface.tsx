"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Volume2, VolumeX, X } from "lucide-react"

interface VoiceInterfaceProps {
  onClose: () => void
}

export function VoiceInterface({ onClose }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null) // runtime constructor determined in useEffect
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the correct SpeechRecognition constructor (cross-browser)
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis

      // Bail out if the API isn't available
      if (!SpeechRecognitionAPI) {
        console.warn("SpeechRecognition is not supported in this browser.")
        return
      }

      // Create a new instance
      recognitionRef.current = new SpeechRecognitionAPI()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleVoiceInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceInput = async (input: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful hotel booking assistant. Keep responses concise and conversational for voice interaction. Help users find rooms, check availability, and make reservations.",
            },
            {
              role: "user",
              content: input,
            },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse = data.content || "I'm sorry, I didn't understand that. Could you please try again?"
        setResponse(aiResponse)
        speak(aiResponse)
      } else {
        const errorResponse = "I'm having trouble processing your request. Please try again."
        setResponse(errorResponse)
        speak(errorResponse)
      }
    } catch (error) {
      console.error("Error processing voice input:", error)
      const errorResponse = "I'm experiencing technical difficulties. Please try again later."
      setResponse(errorResponse)
      speak(errorResponse)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-blue-600" />
              <span>Voice Assistant</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voice Visualization */}
          <div className="flex justify-center">
            <div
              className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? "border-red-500 bg-red-50 animate-pulse"
                  : isSpeaking
                    ? "border-blue-500 bg-blue-50 animate-pulse"
                    : "border-gray-300 bg-gray-50"
              }`}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-red-500" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12 text-blue-500" />
              ) : (
                <Mic className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            {isListening && <p className="text-red-600 font-medium">Listening...</p>}
            {isProcessing && <p className="text-blue-600 font-medium">Processing...</p>}
            {isSpeaking && <p className="text-blue-600 font-medium">Speaking...</p>}
            {!isListening && !isProcessing && !isSpeaking && (
              <p className="text-gray-600">Tap the microphone to start</p>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">You said:</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">&quot;{transcript}&quot;</p>
              </CardContent>
            </Card>
          )}

          {/* Response */}
          {response && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assistant:</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{response}</p>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking}
              className="flex items-center space-x-2"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isListening ? "Stop" : "Start"}</span>
            </Button>

            {isSpeaking && (
              <Button
                size="lg"
                variant="outline"
                onClick={stopSpeaking}
                className="flex items-center space-x-2 bg-transparent"
              >
                <VolumeX className="w-5 h-5" />
                <span>Stop</span>
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Try saying:</p>
            <p>&quot;Show me available rooms for tonight&quot;</p>
            <p>&quot;I need a room for 2 guests&quot;</p>
            <p>&quot;What&apos;s the price for the deluxe suite?&quot;</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
