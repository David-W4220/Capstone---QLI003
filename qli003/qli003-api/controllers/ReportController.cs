using Microsoft.AspNetCore.Mvc;
using qli003_api.Services;
using System.Threading.Tasks;

namespace qli003_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly EmailService _emailService;

        public ReportController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendReport()
        {
            var result = await _emailService.SendReportAsync();

            if (result)
                return Ok(new { message = "Report sent successfully." });
            else
                return StatusCode(500, new { message = "Failed to send report." });
        }
    }
}
