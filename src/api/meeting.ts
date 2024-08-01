import api from './config'

export async function getMeetingList(name: string, capacity: number, location: string, pageNo: number, pageSize: number) {
  return await api.get('/meeting-room/list', {
    params: {
      pageNo,
      pageSize,
      name,
      capacity,
      location,
    },
  })
}

export async function findMeeting(id: number) {
  return await api.get(`/meeting-room/${id}`)
}

export async function deleteMeetingRoom(id: number) {
  return await api.delete(`/meeting-room/${id}`)
}
