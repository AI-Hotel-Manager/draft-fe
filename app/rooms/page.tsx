"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Users, Bed, Star, MessageCircle, Mic } from "lucide-react"
import Link from "next/link"
import { AIChat } from "@/components/ai-chat"
import { VoiceInterface } from "@/components/voice-interface"

const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    price: 199,
    image: "/placeholder.svg?height=300&width=400",
    capacity: 2,
    beds: "1 King Bed",
    amenities: ["Free WiFi", "Coffee Maker", "City View"],
    rating: 4.8,
    description: "Spacious room with king bed and stunning city views.",
  },
  {
    id: 2,
    name: "Executive Suite",
    price: 299,
    image: "/placeholder.svg?height=300&width=400",
    capacity: 4,
    beds: "1 King + Sofa Bed",
    amenities: ["Free WiFi", "Kitchenette", "Balcony", "Premium View"],
    rating: 4.9,
    description: "Luxury suite with separate living area and premium amenities.",
  },
  {
    id: 3,
    name: "Standard Double",
    price: 149,
    image: "/placeholder.svg?height=300&width=400",
    capacity: 2,
    beds: "2 Double Beds",
    amenities: ["Free WiFi", "Coffee Maker"],
    rating: 4.6,
    description: "Comfortable room perfect for business or leisure travel.",
  },
  {
    id: 4,
    name: "Family Room",
    price: 249,
    image: "/placeholder.svg?height=300&width=400",
    capacity: 6,
    beds: "2 Queen Beds",
    amenities: ["Free WiFi", "Microwave", "Mini Fridge", "Extra Space"],
    rating: 4.7,
    description: "Spacious family room with all the comforts of home.",
  },
]

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showChat, setShowChat] = useState(false)
  const [showVoice, setShowVoice] = useState(false)

  const handleReserve = (room: (typeof rooms)[0]) => {
    // In a real app, this would handle the reservation logic
    alert(`Reservation request for ${room.name} on ${selectedDate?.toDateString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HotelAI</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/rooms" className="text-blue-600 font-medium">
              Rooms
            </Link>
            <Link href="/reservation" className="text-gray-700 hover:text-blue-600">
              Book Now
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowVoice(true)}>
              <Mic className="w-4 h-4 mr-1" />
              Voice
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowChat(true)}>
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Rooms</h1>
          <p className="text-lg text-gray-600">Choose from our selection of comfortable and luxurious accommodations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  <Star className="w-3 h-3 mr-1" />
                  {room.rating}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{room.name}</span>
                  <span className="text-blue-600 font-bold">${room.price}/night</span>
                </CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {room.capacity} guests
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {room.beds}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1" onClick={() => setSelectedRoom(room)}>
                      View Calendar
                    </Button>
                    <Link href={`/reservation?room=${room.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Room Calendar Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.name} - Available Dates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
            <div className="flex space-x-2">
              <Button
                className="flex-1"
                onClick={() => selectedRoom && handleReserve(selectedRoom)}
                disabled={!selectedDate}
              >
                Reserve for {selectedDate?.toDateString()}
              </Button>
              <Button variant="outline" onClick={() => setSelectedRoom(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chat Modal */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}

      {/* Voice Interface Modal */}
      {showVoice && <VoiceInterface onClose={() => setShowVoice(false)} />}
    </div>
  )
}
