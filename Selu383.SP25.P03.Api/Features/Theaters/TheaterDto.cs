namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class TheaterDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; } // Rename Location to Address
        public int SeatCount { get; set; } // Add SeatCount property
        public int? ManagerId { get; set; } // Ensure this property exists
    }
}
