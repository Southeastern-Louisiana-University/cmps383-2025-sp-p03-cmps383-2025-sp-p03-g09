using Selu383.SP25.P03.Api.Features.Locations;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class Ticket
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public int TheaterId { get; set; }
        public Theater Theater { get; set; }
        public int SeatId { get; set; }
        public Seat Seat { get; set; }
        public int MovieId { get; set; }
        public Movie Movie { get; set; }
        public string Showtime { get; set; } = string.Empty;
    }
}
