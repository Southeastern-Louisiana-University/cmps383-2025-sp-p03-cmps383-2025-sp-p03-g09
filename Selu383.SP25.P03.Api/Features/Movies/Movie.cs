using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Movie
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public required string Title { get; set; }
        public int Duration { get; set; } // Duration in minutes
        public required string Rating { get; set; }
        public required string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
