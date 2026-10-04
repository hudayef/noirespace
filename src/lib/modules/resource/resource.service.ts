import { db } from "@/lib/db"
import { locations, rooms, resources, instructors } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import type { LocationInput, RoomInput, ResourceInput, InstructorInput } from "@/lib/validators/resource"

export async function getLocations(onlyActive = true) {
  if (onlyActive) {
    return db.query.locations.findMany({ where: eq(locations.status, "active") })
  }
  return db.query.locations.findMany({ orderBy: [desc(locations.createdAt)] })
}

export async function getLocationById(id: string) {
  return db.query.locations.findFirst({ where: eq(locations.id, id) })
}

export async function createLocation(data: LocationInput) {
  const [created] = await db.insert(locations).values(data).returning()
  return created
}

export async function updateLocation(id: string, data: Partial<LocationInput>) {
  const [updated] = await db
    .update(locations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(locations.id, id))
    .returning()
  return updated
}

export async function getRooms(locationId?: string, onlyActive = true) {
  if (locationId) {
    return db.query.rooms.findMany({
      where: eq(rooms.locationId, locationId),
      orderBy: [rooms.name],
    })
  }
  if (onlyActive) {
    return db.query.rooms.findMany({
      where: eq(rooms.status, "active"),
      orderBy: [rooms.name],
    })
  }
  return db.query.rooms.findMany({ orderBy: [desc(rooms.createdAt)] })
}

export async function getRoomById(id: string) {
  return db.query.rooms.findFirst({ where: eq(rooms.id, id) })
}

export async function getRoomBySlug(slug: string) {
  return db.query.rooms.findFirst({ where: eq(rooms.slug, slug) })
}

export async function createRoom(data: RoomInput) {
  const [created] = await db.insert(rooms).values(data).returning()
  return created
}

export async function updateRoom(id: string, data: Partial<RoomInput>) {
  const [updated] = await db
    .update(rooms)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .returning()
  return updated
}

export async function getResources(locationId?: string, onlyActive = true) {
  if (locationId) {
    return db.query.resources.findMany({
      where: eq(resources.locationId, locationId),
      orderBy: [resources.name],
    })
  }
  if (onlyActive) {
    return db.query.resources.findMany({
      where: eq(resources.status, "active"),
      orderBy: [resources.name],
    })
  }
  return db.query.resources.findMany({ orderBy: [desc(resources.createdAt)] })
}

export async function getResourceById(id: string) {
  return db.query.resources.findFirst({ where: eq(resources.id, id) })
}

export async function createResource(data: ResourceInput) {
  const [created] = await db.insert(resources).values(data).returning()
  return created
}

export async function updateResource(id: string, data: Partial<ResourceInput>) {
  const [updated] = await db
    .update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning()
  return updated
}

export async function getInstructors(onlyActive = true) {
  if (onlyActive) {
    return db.query.instructors.findMany({
      where: eq(instructors.status, "active"),
      orderBy: [instructors.name],
    })
  }
  return db.query.instructors.findMany({ orderBy: [desc(instructors.createdAt)] })
}

export async function getInstructorById(id: string) {
  return db.query.instructors.findFirst({ where: eq(instructors.id, id) })
}

export async function getInstructorBySlug(slug: string) {
  return db.query.instructors.findFirst({ where: eq(instructors.slug, slug) })
}

export async function createInstructor(data: InstructorInput) {
  const [created] = await db.insert(instructors).values(data).returning()
  return created
}

export async function updateInstructor(id: string, data: Partial<InstructorInput>) {
  const [updated] = await db
    .update(instructors)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(instructors.id, id))
    .returning()
  return updated
}
