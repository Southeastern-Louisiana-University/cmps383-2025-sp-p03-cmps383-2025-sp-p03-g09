using System;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }

        public int UserId { get; set; }
        public int TheaterId { get; set; }
        public int SeatId { get; set; }

        public int TicketId { get; set; }

        public DateTime PurchaseTime { get; set; }

        public List<int> FoodItemIds { get; set; } = new();

        public string MovieTitle { get; set; }
        public string LocationName { get; set; }
        public string Showtime { get; set; }
    }
}
