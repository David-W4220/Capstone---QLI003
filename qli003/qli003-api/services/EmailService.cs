using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace qli003_api.Services
{
    public class EmailService
    {
        private readonly QLIDbContext _context;
        private readonly IConfiguration _config;

        public EmailService(QLIDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            //Tell QuestPDF we're using the free community license
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<bool> SendReportAsync()
        {
            //fetch data
            var audits = await _context.Audit_Log.AsNoTracking().ToListAsync();
            var transactions = await _context.Transaction_Log.AsNoTracking().ToListAsync();

            //generate PDF
            var pdfBytes = GeneratePdf(audits, transactions);

            //build email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("QLI System", "no-reply@qli003.local"));
            message.To.Add(new MailboxAddress("Test Receiver", "test@localhost"));
            message.Subject = "Inventory Report";

            var body = new TextPart("plain")
            {
                Text = "Here's the text message."
            };

            var attachment = new MimePart("application", "pdf")
            {
                Content = new MimeContent(new MemoryStream(pdfBytes)),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = "InventoryReport.pdf"
            };

            var multipart = new Multipart("mixed");
            multipart.Add(body);
            multipart.Add(attachment);
            message.Body = multipart;

            //send the email via Papercut
            try
            {
                using var client = new SmtpClient();
                var host = _config["SMTP:Host"] ?? "localhost";
                var port = int.Parse(_config["SMTP:Port"] ?? "25");
                await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.None);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private byte[] GeneratePdf(
            System.Collections.Generic.List<Audit_Log> audits,
            System.Collections.Generic.List<Transaction_Log> transactions)
        {
            using var stream = new MemoryStream();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    page.Header()
                        .Text("Inventory Report")
                        .FontSize(24)
                        .SemiBold().AlignCenter();

                    page.Content().Column(col =>
                    {
                        col.Item().Text("Audit Log").FontSize(18).Bold();
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1);
                                c.RelativeColumn(3);
                                c.RelativeColumn(2);
                            });

                            table.Header(h =>
                            {
                                h.Cell().Text("ID").Bold();
                                h.Cell().Text("Action").Bold();
                                h.Cell().Text("Timestamp").Bold();
                            });

                            foreach (var a in audits)
                            {
                                table.Cell().Text(a.ID.ToString());
                                table.Cell().Text(a.Act_Description ?? "-");
                                table.Cell().Text(a.Timestamp.ToString() ?? "-");
                            }
                        });

                        col.Item().PaddingVertical(20).LineHorizontal(1);

                        col.Item().Text("Transaction Log").FontSize(18).Bold();

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1); // ID
                                c.RelativeColumn(1); // Inventory_ID
                                c.RelativeColumn(1); // Check_In
                                c.RelativeColumn(1); // Quantity_Changed
                                c.RelativeColumn(1); // Condition
                                c.RelativeColumn(2); // Optional_Notes
                                c.RelativeColumn(2); // Timestamp
                            });

                            table.Header(h =>
                            {
                                h.Cell().Text("ID").Bold();
                                h.Cell().Text("Inventory ID").Bold();
                                h.Cell().Text("Check In").Bold();
                                h.Cell().Text("Qty Changed").Bold();
                                h.Cell().Text("Condition").Bold();
                                h.Cell().Text("Notes").Bold();
                                h.Cell().Text("Timestamp").Bold();
                            });

                            foreach (var t in transactions)
                            {
                                table.Cell().Text(t.ID.ToString());
                                table.Cell().Text(t.Inventory_ID.ToString());
                                table.Cell().Text(t.Check_In ? "Yes" : "No");
                                table.Cell().Text(t.Quantity_Changed.ToString());
                                table.Cell().Text(t.Condition.ToString());
                                table.Cell().Text(t.Optional_Notes ?? "-");
                                table.Cell().Text(t.Timestamp.ToString());  // Uses system's current culture
                                //table.Cell().Text(t.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"));
                            }
                        });

                    });

                    page.Footer()
                        .AlignCenter()
                        .Text(txt =>
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
}
