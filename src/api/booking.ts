import dayjs from 'dayjs'
import type { SearchBooking } from '../views/meeting_history/MeetingHistory'
import type { CreateBooking } from '../views/meeting_room_list/CreateBookingModal'
import api from './config'

export function getBookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {
  let bookingTimeRangeStart
  let bookingTimeRangeEnd

  if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
    const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD')
    const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm')
    bookingTimeRangeStart = dayjs(`${rangeStartDateStr} ${rangeStartTimeStr}`).valueOf()
  }

  if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
    const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD')
    const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm')
    bookingTimeRangeEnd = dayjs(`${rangeEndDateStr} ${rangeEndTimeStr}`).valueOf()
  }

  return api.get('/booking/list', {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo,
      pageSize,
    },
  })
}

export async function bookingAdd(booking: CreateBooking) {
  const rangeStartDateStr = dayjs(booking.rangeStartDate).format('YYYY-MM-DD')
  const rangeStartTimeStr = dayjs(booking.rangeStartTime).format('HH:mm')
  const startTime = dayjs(`${rangeStartDateStr} ${rangeStartTimeStr}`).valueOf()

  const rangeEndDateStr = dayjs(booking.rangeEndDate).format('YYYY-MM-DD')
  const rangeEndTimeStr = dayjs(booking.rangeEndTime).format('HH:mm')
  const endTime = dayjs(`${rangeEndDateStr} ${rangeEndTimeStr}`).valueOf()

  return await api.post('/booking/add', {
    meetingRoomId: booking.meetingRoomId,
    startTime,
    endTime,
    note: booking.note,
  })
}

export async function unbind(id: number) {
  return await api.get(`/booking/unbind/${id}`)
}
