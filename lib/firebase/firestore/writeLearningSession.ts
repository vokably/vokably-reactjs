import { doc, setDoc, Timestamp, GeoPoint } from "firebase/firestore"
import { db } from '@/lib/firebase/initFirebase'
import { UserData } from '@/lib/firebase/mapUserData'
import { LearningSession } from '@/lib/contexts'

const saveLearningSession = async (user: UserData, learningSession: LearningSession) => {
  try {
    const pathSegment = `${user.id}.${learningSession.startDate.toISOString()}`
    const chapterName = learningSession.loadedChapter.map((chapter) => chapter.name)

    const userDoc = doc(db, "learningSession", pathSegment)
    
    await setDoc(userDoc, {
      startDate: Timestamp.fromDate(learningSession.startDate),
      endDate: Timestamp.fromDate(learningSession.endDate),
      nbUniqueWord: learningSession.nbUniqueWord,
      loadedChapter: JSON.stringify(chapterName),
      answers: JSON.stringify(learningSession.answers),

      // string_data: 'Benjamin Carlson',
      // number_data: 2,
      // boolean_data: true,
      // map_data: { stringInMap: 'Hi', numberInMap: 7 },
      // array_data: ['text', 4],
      // null_data: null,
      // time_stamp: Timestamp.fromDate(new Date('December 17, 1995 03:24:00')),
      // geo_point: new GeoPoint(34.714322, -131.468435)
    })
  } catch (error) {
    console.log(error)
  }
}

export default saveLearningSession