namespace Selu383.SP25.P03.Api.Features.Payments
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public required string PaymentMethod { get; set; }
    }
}
