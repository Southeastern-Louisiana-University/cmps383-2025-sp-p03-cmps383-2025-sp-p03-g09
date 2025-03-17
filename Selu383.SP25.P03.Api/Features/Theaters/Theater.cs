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
        public required string Location { get; set; }
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
