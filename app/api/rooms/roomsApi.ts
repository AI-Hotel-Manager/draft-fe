import { ROOMS_API } from "@/lib/urls"
import { Room } from "@/types/room"

export const getAllRooms = async (): Promise<Room[]> => {
    const resp = await fetch(`${ROOMS_API}all`)
    const data: Room[] = await resp.json()
    return data
}