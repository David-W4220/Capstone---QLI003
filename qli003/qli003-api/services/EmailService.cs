using MailKit.Net.Smtp;
using MimeKit;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Microsoft.EntityFrameworkCore;
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
                Text = "Here's the test piain text message."
            };

            var attachment = new MimePart("application", "pdf")
            {
                Content = new MimeContent(new MemoryStream(pdfBytes)),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = "InventoryReport.pdf"
            };

            var multipart = new Multipart("mixed")
            {
                body, attachment
            };
            message.Body = multipart;

            //send the email via Papercut
            try
            {
                using var client = new SmtpClient();
                var host = "localhost";
                var port = 25;
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

        private byte[] GeneratePdf(List<Audit_Log> audits, List<Transaction_Log> transactions)
        {
            using var stream = new MemoryStream();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);
                    //header line
                    page.Header().Text("Inventory Report").FontSize(24).SemiBold().AlignCenter();

                    page.Content().Column(col =>
                    {
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

                        col.Item().PaddingVertical(20).LineHorizontal(1);//seperate line
                        col.Item().Text("Transaction Log").FontSize(18).Bold();

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(1); // ID
                                c.RelativeColumn(1); // Inventory_ID
                                c.RelativeColumn(1); // Check_In
                                c.RelativeColumn(1); // Quantity_Changed 1？
                                c.RelativeColumn(4); // Optional_Notes
                                c.RelativeColumn(2); // Timestamp
                            });

                            table.Header(h =>
                            {
                                h.Cell().Text("ID").Bold();
                                h.Cell().Text("Equip ID").Bold();
                                h.Cell().Text("Chked In/out").Bold();
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
                                table.Cell().Text(t.Timestamp.ToString());//use default format for elegancy
                                //table.Cell().Text(t.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"));
                            }
                        });

                    });
                    //footer line
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