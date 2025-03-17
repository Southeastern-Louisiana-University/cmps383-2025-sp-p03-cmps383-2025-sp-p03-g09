using Selu383.SP25.P03.Api.Features.Users;
using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Theater
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public required string Name { get; set; }
        public required string Address { get; set; } // Rename Location to Address
        public int SeatCount { get; set; } // Add SeatCount property
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
        public int? ManagerId { get; set; } // Add ManagerId property
        public User? Manager { get; set; } // Optional navigation property for the manager
    }
}
