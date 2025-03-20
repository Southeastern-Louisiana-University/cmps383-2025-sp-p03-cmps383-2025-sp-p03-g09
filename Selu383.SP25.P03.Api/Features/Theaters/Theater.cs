using Selu383.SP25.P03.Api.Features.Users;
using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Locations;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Theater
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public required string Name { get; set; }
        public required string Address { get; set; }
        public int SeatCount { get; set; }
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
        public int? ManagerId { get; set; }
        public User? Manager { get; set; }
        // public int LocationId { get; set; }
        // public Location Location { get; set; }
    }
}
