export const showtimeSchedule = (() => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const baseSchedule = [
    {
      "movieId": 1,
      "locationId": 1,
      "theaterId": 1,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 2,
      "locationId": 1,
      "theaterId": 2,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 3,
      "locationId": 1,
      "theaterId": 3,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 4,
      "locationId": 1,
      "theaterId": 4,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 5,
      "locationId": 1,
      "theaterId": 5,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 6,
      "locationId": 1,
      "theaterId": 6,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 7,
      "locationId": 1,
      "theaterId": 7,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 8,
      "locationId": 1,
      "theaterId": 8,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 9,
      "locationId": 1,
      "theaterId": 1,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 10,
      "locationId": 1,
      "theaterId": 2,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 1,
      "locationId": 1,
      "theaterId": 3,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 2,
      "locationId": 1,
      "theaterId": 4,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 3,
      "locationId": 1,
      "theaterId": 5,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 4,
      "locationId": 1,
      "theaterId": 6,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 5,
      "locationId": 1,
      "theaterId": 7,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 6,
      "locationId": 1,
      "theaterId": 8,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 7,
      "locationId": 1,
      "theaterId": 1,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 8,
      "locationId": 1,
      "theaterId": 2,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 9,
      "locationId": 1,
      "theaterId": 3,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 10,
      "locationId": 1,
      "theaterId": 4,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 1,
      "locationId": 1,
      "theaterId": 5,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 2,
      "locationId": 1,
      "theaterId": 6,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 3,
      "locationId": 1,
      "theaterId": 7,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 4,
      "locationId": 1,
      "theaterId": 8,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 5,
      "locationId": 1,
      "theaterId": 1,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 6,
      "locationId": 1,
      "theaterId": 2,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 7,
      "locationId": 1,
      "theaterId": 3,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 8,
      "locationId": 1,
      "theaterId": 4,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 9,
      "locationId": 1,
      "theaterId": 5,
      "timeOfDay": "18:50:00"
    },
    {
      "movieId": 10,
      "locationId": 1,
      "theaterId": 6,
      "timeOfDay": "18:50:00"
    },
    {
      "movieId": 1,
      "locationId": 2,
      "theaterId": 1,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 2,
      "locationId": 2,
      "theaterId": 2,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 3,
      "locationId": 2,
      "theaterId": 3,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 4,
      "locationId": 2,
      "theaterId": 4,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 5,
      "locationId": 2,
      "theaterId": 5,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 6,
      "locationId": 2,
      "theaterId": 6,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 7,
      "locationId": 2,
      "theaterId": 7,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 8,
      "locationId": 2,
      "theaterId": 8,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 9,
      "locationId": 2,
      "theaterId": 1,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 10,
      "locationId": 2,
      "theaterId": 2,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 1,
      "locationId": 2,
      "theaterId": 3,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 2,
      "locationId": 2,
      "theaterId": 4,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 3,
      "locationId": 2,
      "theaterId": 5,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 4,
      "locationId": 2,
      "theaterId": 6,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 5,
      "locationId": 2,
      "theaterId": 7,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 6,
      "locationId": 2,
      "theaterId": 8,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 7,
      "locationId": 2,
      "theaterId": 1,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 8,
      "locationId": 2,
      "theaterId": 2,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 9,
      "locationId": 2,
      "theaterId": 3,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 10,
      "locationId": 2,
      "theaterId": 4,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 1,
      "locationId": 2,
      "theaterId": 5,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 2,
      "locationId": 2,
      "theaterId": 6,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 3,
      "locationId": 2,
      "theaterId": 7,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 4,
      "locationId": 2,
      "theaterId": 8,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 5,
      "locationId": 2,
      "theaterId": 1,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 6,
      "locationId": 2,
      "theaterId": 2,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 7,
      "locationId": 2,
      "theaterId": 3,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 8,
      "locationId": 2,
      "theaterId": 4,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 9,
      "locationId": 2,
      "theaterId": 5,
      "timeOfDay": "18:50:00"
    },
    {
      "movieId": 10,
      "locationId": 2,
      "theaterId": 6,
      "timeOfDay": "18:50:00"
    },
    {
      "movieId": 1,
      "locationId": 3,
      "theaterId": 1,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 2,
      "locationId": 3,
      "theaterId": 2,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 3,
      "locationId": 3,
      "theaterId": 3,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 4,
      "locationId": 3,
      "theaterId": 4,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 5,
      "locationId": 3,
      "theaterId": 5,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 6,
      "locationId": 3,
      "theaterId": 6,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 7,
      "locationId": 3,
      "theaterId": 7,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 8,
      "locationId": 3,
      "theaterId": 8,
      "timeOfDay": "11:00:00"
    },
    {
      "movieId": 9,
      "locationId": 3,
      "theaterId": 1,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 10,
      "locationId": 3,
      "theaterId": 2,
      "timeOfDay": "13:30:00"
    },
    {
      "movieId": 1,
      "locationId": 3,
      "theaterId": 3,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 2,
      "locationId": 3,
      "theaterId": 4,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 3,
      "locationId": 3,
      "theaterId": 5,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 4,
      "locationId": 3,
      "theaterId": 6,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 5,
      "locationId": 3,
      "theaterId": 7,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 6,
      "locationId": 3,
      "theaterId": 8,
      "timeOfDay": "13:40:00"
    },
    {
      "movieId": 7,
      "locationId": 3,
      "theaterId": 1,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 8,
      "locationId": 3,
      "theaterId": 2,
      "timeOfDay": "16:00:00"
    },
    {
      "movieId": 9,
      "locationId": 3,
      "theaterId": 3,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 10,
      "locationId": 3,
      "theaterId": 4,
      "timeOfDay": "16:10:00"
    },
    {
      "movieId": 1,
      "locationId": 3,
      "theaterId": 5,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 2,
      "locationId": 3,
      "theaterId": 6,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 3,
      "locationId": 3,
      "theaterId": 7,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 4,
      "locationId": 3,
      "theaterId": 8,
      "timeOfDay": "16:20:00"
    },
    {
      "movieId": 5,
      "locationId": 3,
      "theaterId": 1,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 6,
      "locationId": 3,
      "theaterId": 2,
      "timeOfDay": "18:30:00"
    },
    {
      "movieId": 7,
      "locationId": 3,
      "theaterId": 3,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 8,
      "locationId": 3,
      "theaterId": 4,
      "timeOfDay": "18:40:00"
    },
    {
      "movieId": 9,
      "locationId": 3,
      "theaterId": 5,
      "timeOfDay": "18:50:00"
    },
    {
      "movieId": 10,
      "locationId": 3,
      "theaterId": 6,
      "timeOfDay": "18:50:00"
    }
  ];
  
  return baseSchedule.map(item => ({
    movieId: item.movieId,
    locationId: item.locationId,
    theaterId: item.theaterId,
    time: `${currentDate}T${item.timeOfDay}`
  }));
})();