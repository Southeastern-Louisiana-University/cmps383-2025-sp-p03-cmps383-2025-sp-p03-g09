namespace Selu383.SP25.P03.Api.Features.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int LocationId { get; set; }
        public int TheaterId { get; set; }
        public int SeatId { get; set; }
        public int MovieId { get; set; }
        public string Showtime { get; set; } = string.Empty;
    }
}
