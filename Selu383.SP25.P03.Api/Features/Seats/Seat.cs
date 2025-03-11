using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Seats // FIX: Namespace changed to Seats
{
    public class Seat
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public Theater Theater { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public bool IsReserved { get; set; }
        public int? ReservedByUserId { get; set; }
        public User? ReservedByUser { get; set; }
    }
}
