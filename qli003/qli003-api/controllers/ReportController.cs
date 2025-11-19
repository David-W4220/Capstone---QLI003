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

        //PDF history report
        [HttpPost("send")]
        public async Task<IActionResult> SendReport()
        {
            try
            {
                if (await _emailService.SendReportAsync())
                    return Ok(new { message = "Report sent successfully." });
                else
                    return StatusCode(500, new { message = "Report generation succeeded, but email service reported failure." });
            }
            catch (InvalidOperationException ex)
            {   //exception threw from EmailService. Should contain detailed error message
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

[ApiController]
    [Route("api/[controller]")]
    public class AutoReorderController : ControllerBase
    {
        private readonly AutoReodrLk _autoReodrLk;
        public AutoReorderController(AutoReodrLk autoReodrLk)
        {
            _autoReodrLk = autoReodrLk;
        }

        //Auto reorder reprt
        //NOTE: MANUAL TEST CAN ONLY BE USED IN ADDSCOPED SETTING! Need change AutoReordLk according to ReoderManually
        [HttpPost("manual-lowstock-scan")]
        public async Task<IActionResult> SendLowStock()
        {
            try
            {
                if (!await _autoReodrLk.SendLowStockReportAsync())
                    return Ok(new { message = "Scan complete. No items are below threshold. No email sent." });

                return Ok(new { message = "Reorder email sent successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
