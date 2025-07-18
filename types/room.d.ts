export type RoomType = {
    name: string;
    description: string;
    id: string
}

export type Room = {
    id: string;
    room_number: string;
    name: string;
    capacity: number;
    bed_type: string;
    amenities: string[];
    price_per_night: string;
    image_name: string;
    description: string;
    room_type: RoomType;
    rating: string;
}