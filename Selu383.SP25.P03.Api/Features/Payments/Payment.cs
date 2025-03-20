using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Users;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Payments
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public decimal Price { get; set; }
        public required string PaymentMethod { get; set; }
    }
}
