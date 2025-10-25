using Microsoft.AspNetCore.Mvc;

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
            if (await _emailService.SendReportAsync())
                return Ok(new { message = "Report sent successfully." });
            else
                return StatusCode(500, new { message = "Failed to send report." });
        }
    }