import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

import * as geofirestore from 'geofirestore'
import { GeoPoint } from 'firebase/firestore'

const GeoFirestore = geofirestore.initializeApp(firebase.firestore())
const locations = GeoFirestore.collection('locations')

export const getNearbyLocations = async (
  latitude: number,
  longitude: number
) => {
  try {
    const query = locations.near({
      center: new GeoPoint(latitude, longitude),
      radius: 0.4,
    })

    const querySnapshot = await query.get()

    const locationsArray = []

    for (const doc of querySnapshot.docs) {
      locationsArray.push({
        id: doc.id,
        name: doc.data().name,
      })
    }

    return locationsArray
  } catch (error) {
    console.error(error)
  }
}

export const addLocation = async ({
  name,
  latitude,
  longitude,
}: {
  name: string
  latitude: number
  longitude: number
}) => {
  await locations.add({
    coordinates: new GeoPoint(latitude, longitude),
    name: name.trim(),
  })
}
