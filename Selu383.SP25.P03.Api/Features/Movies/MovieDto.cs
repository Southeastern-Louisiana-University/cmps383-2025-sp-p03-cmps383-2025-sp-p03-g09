namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class MovieDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public int Duration { get; set; }
        public required string Rating { get; set; }
        public required string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
