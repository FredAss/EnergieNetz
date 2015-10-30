using System.Configuration;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace EnergyNetwork.Web.Helpers
{
  public class EmailService : IIdentityMessageService
  {
    public Task SendAsync(IdentityMessage message)
    {
      if (ConfigurationManager.AppSettings["EmailServer"] != "{EmailServer}" &&
          ConfigurationManager.AppSettings["EmailUser"] != "{EmailUser}" &&
          ConfigurationManager.AppSettings["EmailPassword"] != "{EmailPassword}")
      {
        var mailMsg = new MailMessage();

        mailMsg.To.Add(new MailAddress(message.Destination, ""));

        mailMsg.From = new MailAddress("donotreply@xxxxx.com",
          "EnergieNetz Administrator");

        // Subject and multipart/alternative Body
        mailMsg.Subject = message.Subject;

        mailMsg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(message.Body, null, MediaTypeNames.Text.Plain));

        // Init SmtpClient and send

        var smtpClient = new SmtpClient
        {
          Host = ConfigurationManager.AppSettings["EmailServer"],
          Port = int.Parse(ConfigurationManager.AppSettings["Port"]), //587,
          EnableSsl = true,
          Credentials = new NetworkCredential(ConfigurationManager.AppSettings["EmailUser"],
            ConfigurationManager.AppSettings["EmailPassword"])
        };

        return Task.Factory.StartNew(() => smtpClient.SendAsync(mailMsg,
          "token"));
      }
      return Task.FromResult(0);
    }
  }
}