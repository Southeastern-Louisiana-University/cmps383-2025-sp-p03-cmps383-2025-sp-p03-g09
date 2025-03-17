using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Payments;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly DbSet<Payment> payments;
        private readonly DataContext dataContext;

        public PaymentsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            payments = dataContext.Set<Payment>();
        }

        [HttpGet]
        public IQueryable<PaymentDto> GetAllPayments()
        {
            return GetPaymentDtos(payments);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<PaymentDto> GetPaymentById(int id)
        {
            var result = GetPaymentDtos(payments.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public ActionResult<PaymentDto> CreatePayment(PaymentDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var payment = new Payment
            {
                OrderId = dto.OrderId,
                UserId = dto.UserId,
                Price = dto.Price,
                PaymentMethod = dto.PaymentMethod
            };
            payments.Add(payment);

            dataContext.SaveChanges();

            dto.Id = payment.Id;

            return CreatedAtAction(nameof(GetPaymentById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public ActionResult<PaymentDto> UpdatePayment(int id, PaymentDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var payment = payments.FirstOrDefault(x => x.Id == id);
            if (payment == null)
            {
                return NotFound();
            }

            payment.OrderId = dto.OrderId;
            payment.UserId = dto.UserId;
            payment.Price = dto.Price;
            payment.PaymentMethod = dto.PaymentMethod;

            dataContext.SaveChanges();

            dto.Id = payment.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeletePayment(int id)
        {
            var payment = payments.FirstOrDefault(x => x.Id == id);
            if (payment == null)
            {
                return NotFound();
            }

            payments.Remove(payment);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(PaymentDto dto)
        {
            return dto.OrderId <= 0 ||
                   dto.UserId <= 0 ||
                   dto.Price <= 0 ||
                   string.IsNullOrWhiteSpace(dto.PaymentMethod);
        }

        private static IQueryable<PaymentDto> GetPaymentDtos(IQueryable<Payment> payments)
        {
            return payments
                .Select(x => new PaymentDto
                {
                    Id = x.Id,
                    OrderId = x.OrderId,
                    UserId = x.UserId,
                    Price = x.Price,
                    PaymentMethod = x.PaymentMethod
                });
        }
    }
}
