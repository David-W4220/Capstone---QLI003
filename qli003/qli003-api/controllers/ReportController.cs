using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

[ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly HistoryPDF _historyPdf;
        

        public ReportController(HistoryPDF historyPdf)
        {
            _historyPdf = historyPdf;
        }

        //PDF history report
        [HttpPost("send")]
        public async Task<IActionResult> SendReport()
        {
            try
            {
                if (await _historyPdf.SendReportAsync())
                    return Ok(new { message = "History PDF report mailed successfully." });
                else
                    return StatusCode(500, new { message = "Report generated, but still somehow failed to mail." });
            }
            catch (InvalidOperationException ex)
            {   //exception threw from _historyPdf. Should contain detailed error message
                return StatusCode(500, new { message = ex.Message });
            }
        }
        //Export Report PDF(Button)
        [HttpGet("export-summary")]
        public async Task<IActionResult> ExportSummaryReport()
        {
            try
            {
                using var scope = HttpContext.RequestServices.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<QLIDbContext>();

                var audits = await context.Audit_Log.AsNoTracking().ToListAsync();
                var transactions = await context.Transaction_Log.AsNoTracking().ToListAsync();
                var equipment = await context.Equipment.AsNoTracking().ToListAsync();

                //generate PDF bytes
                var pdfBytes = GenerateSummaryPdf(audits, transactions, equipment);

                return File(pdfBytes, "application/pdf", "InventorySummary.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private byte[] GenerateSummaryPdf(List<Audit_Log> audits, List<Transaction_Log> transactions, List<Equipment> equipment)
        {
            using var stream = new MemoryStream();
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Header().Text("Inventory Summary Report").FontSize(24).SemiBold().AlignCenter();
                    page.Content().Column(col =>
                    {
                        // Audit Log table
                        col.Item().Text("Audit Log").FontSize(18).Bold();
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(1);
                                c.RelativeColumn(3);
                                c.RelativeColumn(2);
                            });
                            table.Header(h =>
                            {
                                h.Cell().Text("ID").Bold();
                                h.Cell().Text("Admin ID").Bold();
                                h.Cell().Text("Action").Bold();
                                h.Cell().Text("Timestamp").Bold();
                            });
                            foreach (var a in audits)
                            {
                                table.Cell().Text(a.ID.ToString());
                                table.Cell().Text(a.Admin_ID.ToString());
                                table.Cell().Text(a.Act_Description);
                                table.Cell().Text(a.Timestamp.ToString());
                            }
                        });
                        col.Item().PaddingVertical(20).LineHorizontal(1);

                        // Transaction Log table
                        col.Item().Text("Transaction Log").FontSize(18).Bold();
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(1);
                                c.RelativeColumn(1);
                                c.RelativeColumn(1);
                                c.RelativeColumn(4);
                                c.RelativeColumn(2);
                            });
                            table.Header(h =>
                            {
                                h.Cell().Text("ID").Bold();
                                h.Cell().Text("Equip ID").Bold();
                                h.Cell().Text("Check In/Out").Bold();
                                h.Cell().Text("Qty Changed").Bold();
                                h.Cell().Text("Notes").Bold();
                                h.Cell().Text("Timestamp").Bold();
                            });
                            foreach (var t in transactions)
                            {
                                table.Cell().Text(t.ID.ToString());
                                table.Cell().Text(t.Equipment_ID.ToString());
                                table.Cell().Text(t.Check_In ? "IN" : "OUT");
                                table.Cell().Text(t.Quantity_Changed.ToString());
                                table.Cell().Text(t.Optional_Notes);
                                table.Cell().Text(t.Timestamp.ToString());
                            }
                        });
                        col.Item().PaddingVertical(20).LineHorizontal(1);

                        // Low stock table
                        col.Item().Text("Low/Out of Stock Items").FontSize(18).Bold();

                        var lowItems = equipment.Where(e => e.Item_Cnt <= e.Threshold).ToList();
                        if (lowItems.Count == 0)
                        {
                            col.Item().Text("No items have quantity below threshold for now.");
                        }
                        else
                        {
                            col.Item().Table(table =>
                            {
                                table.ColumnsDefinition(c =>
                                {
                                    c.RelativeColumn(1); // Index
                                    c.RelativeColumn(5); // Name
                                });

                                table.Header(h =>
                                {
                                    h.Cell().Text("Index").Bold();
                                    h.Cell().Text("Name").Bold();
                                });

                                int index = 1;
                                foreach (var e in lowItems)
                                {
                                    table.Cell().Text(index.ToString());
                                    table.Cell().Text(e.Name);
                                    index++;
                                }
                            });
                        }
                    });

                    page.Footer().AlignCenter().Text(txt =>
                    {
                        txt.Span("Generated by QLI System • ").FontSize(10);
                        txt.CurrentPageNumber();
                    });
                });
            });
            document.GeneratePdf(stream);
            return stream.ToArray();
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

        //Auto reorder report
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

//reset reorder link mailing's resending time interval
[ApiController]
    [Route("api/[controller]")]
    public class AutoReodrSettingController : ControllerBase
    {
        private readonly AutoReodrSetting _setDays;

        public AutoReodrSettingController(AutoReodrSetting setDays)
        {
            _setDays = setDays;
        }

        [HttpPost("set-interval")]
        public IActionResult SetInterval([FromBody] int days)
        {
            if (days < 1) return BadRequest(new {message = $"ERROR: Resend interval must be an integer thats greater than 0!"});
            _setDays.intervalDays = days;
            return Ok(new {message = $"Resend interval's successfully reset to {days} day(s)!"});
        }

        [HttpGet("get-interval")]
        public IActionResult GetInterval()
        {
            return Ok(new {intervalDays = _setDays.intervalDays});
        }
    }
