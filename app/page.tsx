"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Wifi, Car, Coffee, Utensils, Mic, MessageCircle } from "lucide-react"
import Link from "next/link"
import { AIChat } from "@/components/ai-chat"
import { VoiceInterface } from "@/components/voice-interface"

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)
  const [showVoice, setShowVoice] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HotelAI</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/rooms" className="text-gray-700 hover:text-blue-600">
              Rooms
            </Link>
            <Link href="/reservation" className="text-gray-700 hover:text-blue-600">
              Book Now
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoice(true)}
              className="flex items-center space-x-1"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Voice</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(true)}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Book Your Perfect Stay with <span className="text-blue-600">AI Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless hotel booking with our AI-powered platform. Reserve rooms using voice commands or chat -
            it's that simple!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowVoice(true)}>
              <Mic className="w-5 h-5 mr-2" />
              Book with Voice
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowChat(true)}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat to Book
            </Button>
            <Link href="/rooms">
              <Button size="lg" variant="outline">
                Browse Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HotelAI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Mic className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Voice Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simply speak your preferences and let our AI find and book the perfect room for you.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageCircle className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Smart Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chat with our AI assistant to get personalized recommendations and instant bookings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Star className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Premium Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enjoy luxury accommodations with world-class amenities and exceptional service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Hotel Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <Wifi className="w-12 h-12 text-blue-600 mb-3" />
              <span className="font-medium">Free WiFi</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Car className="w-12 h-12 text-blue-600 mb-3" />
              <span className="font-medium">Free Parking</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Coffee className="w-12 h-12 text-blue-600 mb-3" />
              <span className="font-medium">Coffee Bar</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Utensils className="w-12 h-12 text-blue-600 mb-3" />
              <span className="font-medium">Restaurant</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8 opacity-90">Start your booking journey with our AI assistant today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => setShowVoice(true)}>
              <Mic className="w-5 h-5 mr-2" />
              Voice Booking
            </Button>
            <Link href="/reservation">
              <Button size="lg" variant="secondary">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Chat Modal */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}

      {/* Voice Interface Modal */}
      {showVoice && <VoiceInterface onClose={() => setShowVoice(false)} />}
    </div>
  )
}
