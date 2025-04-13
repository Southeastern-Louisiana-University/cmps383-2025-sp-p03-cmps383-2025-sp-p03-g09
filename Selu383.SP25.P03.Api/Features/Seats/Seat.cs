using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Orders;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Seats 
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
        public string? ReservedByGuestId { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
