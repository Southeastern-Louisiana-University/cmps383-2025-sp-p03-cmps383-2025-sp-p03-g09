namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class SeatDto
    {
        public int Id { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public bool IsReserved { get; set; }
        public int? ReservedByUserId { get; set; }
    }
}
