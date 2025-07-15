"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Bed, MessageCircle, Mic } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AIChat } from "@/components/ai-chat"
import { VoiceInterface } from "@/components/voice-interface"

const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    price: 199,
    image: "/placeholder.svg?height=200&width=300",
    capacity: 2,
    beds: "1 King Bed",
    amenities: ["Free WiFi", "Coffee Maker", "City View"],
  },
  {
    id: 2,
    name: "Executive Suite",
    price: 299,
    image: "/placeholder.svg?height=200&width=300",
    capacity: 4,
    beds: "1 King + Sofa Bed",
    amenities: ["Free WiFi", "Kitchenette", "Balcony", "Premium View"],
  },
  {
    id: 3,
    name: "Standard Double",
    price: 149,
    image: "/placeholder.svg?height=200&width=300",
    capacity: 2,
    beds: "2 Double Beds",
    amenities: ["Free WiFi", "Coffee Maker"],
  },
  {
    id: 4,
    name: "Family Room",
    price: 249,
    image: "/placeholder.svg?height=200&width=300",
    capacity: 6,
    beds: "2 Queen Beds",
    amenities: ["Free WiFi", "Microwave", "Mini Fridge", "Extra Space"],
  },
]

export default function ReservationPage() {
  const searchParams = useSearchParams()
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date())
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState("2")
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const roomId = searchParams.get("room")
    if (roomId) {
      setSelectedRoom(Number.parseInt(roomId))
    }
  }, [searchParams])

  const availableRooms = rooms.filter((room) => Number.parseInt(guests) <= room.capacity)

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const room = rooms.find((r) => r.id === selectedRoom)
    return nights * (room?.price || 0)
  }

  const handleReservation = () => {
    if (!selectedRoom || !checkIn || !checkOut || !customerInfo.name || !customerInfo.email) {
      alert("Please fill in all required fields")
      return
    }

    const room = rooms.find((r) => r.id === selectedRoom)
    alert(
      `Reservation confirmed for ${room?.name} from ${checkIn.toDateString()} to ${checkOut.toDateString()}. Total: $${calculateTotal()}`,
    )
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
            <Link href="/rooms" className="text-gray-700 hover:text-blue-600">
              Rooms
            </Link>
            <Link href="/reservation" className="text-blue-600 font-medium">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Reservation</h1>
          <p className="text-lg text-gray-600">Select your dates and choose from available rooms</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Date Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Select Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Check-in Date</Label>
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border mt-2"
                  />
                </div>
                <div>
                  <Label>Check-out Date</Label>
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || new Date())}
                    className="rounded-md border mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5 Guests</SelectItem>
                      <SelectItem value="6">6 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Rooms */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
                <CardDescription>
                  {checkIn && checkOut
                    ? `${calculateNights()} night(s) from ${checkIn.toDateString()} to ${checkOut.toDateString()}`
                    : "Select dates to see available rooms"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {availableRooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-all ${
                        selectedRoom === room.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <img
                            src={room.image || "/placeholder.svg"}
                            alt={room.name}
                            className="w-24 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{room.name}</h3>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">${room.price}</div>
                                <div className="text-sm text-gray-500">per night</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Booking Summary */}
                {selectedRoom && checkIn && checkOut && (
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Room:</span>
                          <span>{rooms.find((r) => r.id === selectedRoom)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dates:</span>
                          <span>
                            {checkIn.toDateString()} - {checkOut.toDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{guests}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-blue-600">${calculateTotal()}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleReservation}>
                        Confirm Reservation
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}

      {/* Voice Interface Modal */}
      {showVoice && <VoiceInterface onClose={() => setShowVoice(false)} />}
    </div>
  )
}
