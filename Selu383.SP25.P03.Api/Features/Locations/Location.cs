using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Locations
{
    public class Location
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public required string Name { get; set; }
        public required string Address { get; set; }
        public ICollection<Theater> Theaters { get; set; } = new List<Theater>();
    }
}
