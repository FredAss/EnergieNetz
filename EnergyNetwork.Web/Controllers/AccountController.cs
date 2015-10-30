using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Web.WebPages;
using EnergyNetwork.Data;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using EnergyNetwork.Web.Models;
using EnergyNetwork.Web.Providers;
using EnergyNetwork.Web.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;

namespace EnergyNetwork.Web.Controllers
{
  /// <summary>
  ///   Authentication controller implementing two oAuth flows
  ///   1. Resource owner password grant for users with local accounts
  ///   2. Implicit grant for authenticating with social providers
  /// </summary>
  [System.Web.Http.RoutePrefix("api/Account")]
  public class AccountController: ApiController
  {
    private const string LocalLoginProvider = "Local";

    private RoleManager<IdentityRole> _roleManager;
    private ApplicationUserManager _userManager;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    ///   ctor
    /// </summary>
    public AccountController(IUnitOfWork unitOfWork, ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
    {
      //_roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new EnergyNetworkDbContext()));
      //_roleManager = HttpContext.Current.GetOwinContext().
      //  Get<ApplicationRoleManager>();

      _unitOfWork = unitOfWork;
      AccessTokenFormat = accessTokenFormat;
    }


    public RoleManager<IdentityRole> RoleManager
    {
      get
      {
        return _roleManager ?? HttpContext.Current.GetOwinContext().
          Get<ApplicationRoleManager>();
      }
      private set
      {
        _roleManager = value;
      }
    }

    public ApplicationUserManager UserManager
    {
      get
      {
        return _userManager ?? HttpContext.Current.GetOwinContext().
          GetUserManager<ApplicationUserManager>();
      }
      private set
      {
        _userManager = value;
      }
    }


    private ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; set; }

    /// <summary>
    ///   Get user info
    ///   401 if not authenticated
    /// </summary>
    /// <returns>The user info</returns>
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [System.Web.Http.Route("UserInfo")]
    public async Task<UserInfoViewModel> GetUserInfo()
    {
      ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

      var userIdentity = User.Identity as ClaimsIdentity;

      // Get roles from the user claims
      // We are setting the claims in the AuthenticationOAuthProvider properties
      var roles = new List<string>();
      userIdentity.Claims.Where(c => c.Type == ClaimTypes.Role).
        ForEach(claim => roles.Add(claim.Value));

      //Check for Email confirmed
      bool emailConfirmed = externalLogin != null ? true : await UserManager.IsEmailConfirmedAsync(User.Identity.GetUserId());

      UserProfile user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

      return new UserInfoViewModel{
                                    UserName = User.Identity.GetUserName(),
                                    IsEmailConfirmed = emailConfirmed,
                                    HasRegistered = externalLogin == null,
                                    LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null,
                                    Roles = roles,
                                    IsActivated = user.Activated
                                  };
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("ConfirmEmail", Name = "ConfirmEmail")]
    public async Task<IHttpActionResult> ConfirmEmail(string userId, string code)
    {
      if (userId == null || code == null)
      {
        ModelState.AddModelError("error",
          "Bevor Sie sich anmelden können, müssen Sie zunächst den Bestätigungscode eingeben, den wir Ihnen per E-Mail zugeschickt haben.");
        return BadRequest(ModelState);
      }

      IdentityResult result = await UserManager.ConfirmEmailAsync(userId,
        code);
      if (result.Succeeded)
      {
        string callbackUrl = Url.Content("~/admin/usermanagement/user/" + userId);
        foreach (var user in UserManager.Users.ToList())
        {
          var roles = UserManager.GetRoles(user.Id);
          if (roles.Contains("Administrator"))
          {
            var notification = new AccountConfirmNotificationModel
            {
              Url = callbackUrl,
              DisplayName = user.UserName
            };

            string body = ViewRenderer.RenderView("~/Views/Mailer/ConfirmedAccount.cshtml",
              notification);

            await UserManager.SendEmailAsync(user.Id,
              "EnergieNetz: Neuer Benutzer",
              body);
          }
        }

        return Redirect(Url.Content("~/account/waitingForActivation"));
      }

      IHttpActionResult errorResult = GetErrorResult(result);
      return errorResult;
    }

    [System.Web.Http.HttpPost]
    [System.Web.Http.Route("ResendConfirmationEmail", Name = "ResendConfirmationEmail")]
    public async Task<IHttpActionResult> ResendConfirmationEmail()
    {
      UserProfile user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
      string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
      string callbackUrl = Url.Link("ConfirmEmail",
        new{
             userId = user.Id,
             code
           });

      var notification = new AccountNotificationModel{
                                                       Code = code,
                                                       Url = callbackUrl,
                                                       UserId = user.Id,
                                                       Email = user.Email,
                                                       DisplayName = user.UserName
                                                     };

      string body = ViewRenderer.RenderView("~/Views/Mailer/NewAccount.cshtml",
        notification);

      var msg = new IdentityMessage{
                                     Destination = notification.Email,
                                     Body = body,
                                     Subject = "EnergieNetz: Konto aktivieren"
                                   };

      await UserManager.EmailService.SendAsync(msg);

      //var bodyBuilder = new StringBuilder();
      //bodyBuilder.AppendFormat("Hallo {0}",
      //  user.UserName).
      //  AppendLine();
      //bodyBuilder.AppendFormat("Das Konto wurde erfolgreich erstellt. Nur noch ein Schritt").
      //  AppendLine();
      //bodyBuilder.AppendFormat("Klicken Sie auf den folgenden Link, um die Anmeldung zu bestätigen.").
      //  AppendLine();
      //bodyBuilder.AppendFormat("{0}",
      //  callbackUrl).
      //  AppendLine();


      //body = bodyBuilder.ToString();

      //await UserManager.SendEmailAsync(user.Id,
      //  "EnergieNetz: Konto aktivieren",
      //  body);

      return Ok();
    }

    [System.Web.Http.HttpPost]
    [System.Web.Http.Route("DeleteAccount")]
    public async Task<IHttpActionResult> DeleteAccount()
    {
      UserProfile user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

      if (user == null)
      {
        return BadRequest();
      }

      IdentityResult result = await UserManager.DeleteAsync(user);

      if (result.Succeeded)
      {
        return Ok();
      }

      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    /// <summary>
    ///   If the user forget the password this action will send him a reset password mail
    /// </summary>
    /// <param name="model">The forgot password model</param>
    /// <returns>IHttpActionResult</returns>
    [System.Web.Http.HttpPost]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("ForgotPassword")]
    public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordBindingModel model)
    {
      if (ModelState.IsValid)
      {
        UserProfile user = await UserManager.FindByEmailAsync(model.Email);
        if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
        {
          ModelState.AddModelError("",
            "Entweder existiert der Benutzer nicht oder das Konto wurde noch nicht aktiviert.");
          return BadRequest(ModelState);
        }

        string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
        string callbackUrl = Url.Content("~/account/resetpassword?email=") + HttpUtility.UrlEncode(model.Email) + "&code=" + HttpUtility.UrlEncode(code);

        var notification = new AccountNotificationModel{
                                                         Url = callbackUrl,
                                                         DisplayName = user.UserName
                                                       };



        string body = ViewRenderer.RenderView("~/Views/Mailer/PasswordReset.cshtml",
          notification);
        await UserManager.SendEmailAsync(user.Id,
          "EnergieNetz: Kennwort zurücksetzen",
          body);

        return Ok();
      }

      // If we got this far, something failed
      return BadRequest(ModelState);
    }

    /// <summary>
    ///   Reset the user password
    /// </summary>
    /// <param name="code">The code</param>
    /// <returns></returns>
    [System.Web.Http.HttpPost]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("ResetPassword", Name = "ResetPassword")]
    public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
    {
      if (ModelState.IsValid)
      {
        UserProfile user = await UserManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
          ModelState.AddModelError("",
            "Benutzer nicht gefunden.");
          return BadRequest(ModelState);
        }
        IdentityResult result = await UserManager.ResetPasswordAsync(user.Id,
          model.Code,
          model.Password);
        if (result.Succeeded)
        {
          return Ok();
        }
        IHttpActionResult errorResult = GetErrorResult(result);

        if (errorResult != null)
        {
          return errorResult;
        }
      }

      // If we got this far, something failed
      return BadRequest(ModelState);
    }

    /// <summary>
    ///   Logout
    /// </summary>
    /// <returns>Http 200 Result</returns>
    [System.Web.Http.Route("Logout")]
    public IHttpActionResult Logout()
    {
      Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
      return Ok();
    }

    /// <summary>
    ///   Get the info for managing user accounts
    /// </summary>
    /// <param name="returnUrl">The return url</param>
    /// <param name="generateState">generate a random state for being stored and compared on the client and avoid CSRF attacks</param>
    /// <returns>The manage info</returns>
    [System.Web.Http.Route("ManageInfo")]
    public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
    {
      if (!IsLocalUrl(returnUrl))
      {
        ModelState.AddModelError("returnUrl",
          "Can´t redirect to external urls");
        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
          ModelState));
      }

      IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

      if (user == null)
      {
        return null;
      }

      var logins = new List<UserLoginInfoViewModel>();

      foreach (IdentityUserLogin linkedAccount in user.Logins)
      {
        logins.Add(new UserLoginInfoViewModel{
                                               LoginProvider = linkedAccount.LoginProvider,
                                               ProviderKey = linkedAccount.ProviderKey
                                             });
      }

      if (user.PasswordHash != null)
      {
        logins.Add(new UserLoginInfoViewModel{
                                               LoginProvider = LocalLoginProvider,
                                               ProviderKey = user.UserName,
                                             });
      }

      return new ManageInfoViewModel{
                                      LocalLoginProvider = LocalLoginProvider,
                                      UserName = user.UserName,
                                      Logins = logins,
                                      ExternalLoginProviders = GetExternalLogins(returnUrl,
                                        generateState)
                                    };
    }

    /// <summary>
    ///   Change user password
    /// </summary>
    /// <param name="model">Change password model</param>
    /// <returns>Http 400 or 200</returns>
    [System.Web.Http.Route("ChangePassword")]
    public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(),
        model.OldPassword,
        model.NewPassword);
      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    /// <summary>
    ///   Set user password
    /// </summary>
    /// <param name="model">Set user password model</param>
    /// <returns>Http 400 or 200</returns>
    [System.Web.Http.Route("SetPassword")]
    public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(),
        model.NewPassword);
      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    /// <summary>
    ///   Add a new external login to the user account
    /// </summary>
    /// <param name="model">External login model</param>
    /// <returns>Http 400 or 200</returns>
    [System.Web.Http.Route("AddExternalLogin")]
    public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

      AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

      if (ticket == null || ticket.Identity == null || (ticket.Properties != null && ticket.Properties.ExpiresUtc.HasValue && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
      {
        return BadRequest("Der Login bei dem externen Anbieter ist fehlgeschlagen.");
      }

      ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

      if (externalData == null)
      {
        return BadRequest("Dieser externe Login ist bereits mit einem anderem Konto verkn&uuml;pft.");
      }

      IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
        new UserLoginInfo(externalData.LoginProvider,
          externalData.ProviderKey));

      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    /// <summary>
    ///   Remove login from user account
    /// </summary>
    /// <param name="model">Remove login model</param>
    /// <returns>Http 400 or 200</returns>
    [System.Web.Http.Route("RemoveLogin")]
    public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      IdentityResult result;

      if (model.LoginProvider == LocalLoginProvider)
      {
        result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
      }
      else
      {
        result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
          new UserLoginInfo(model.LoginProvider,
            model.ProviderKey));
      }

      IHttpActionResult errorResult = GetErrorResult(result);

      if (errorResult != null)
      {
        return errorResult;
      }

      return Ok();
    }

    /// <summary>
    ///   Try to create a new external login
    ///   This is the external login endpoint and will be reached when the oAuth provider system return control to this app
    /// </summary>
    /// <param name="provider">The external provider</param>
    /// <param name="error">If any error happened</param>
    /// <returns>Http 400 or 200</returns>
    [System.Web.Http.OverrideAuthentication] // Suppress Global authentication filters like bearer token host auth
    [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("ExternalLogin", Name = "ExternalLogin")]
    public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
    {
      if (error != null)
      {
        return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
      }

      if (!User.Identity.IsAuthenticated)
      {
        return new ChallengeResult(provider,
          this);
      }

      ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

      if (externalLogin == null)
      {
        return InternalServerError();
      }

      if (externalLogin.LoginProvider != provider)
      {
        Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
        return new ChallengeResult(provider,
          this);
      }

      UserProfile user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
        externalLogin.ProviderKey));

      bool hasRegistered = user != null;

      if (hasRegistered)
      {
        Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
        ClaimsIdentity oAuthIdentity = await UserManager.CreateIdentityAsync(user,
          OAuthDefaults.AuthenticationType);
        ClaimsIdentity cookieIdentity = await UserManager.CreateIdentityAsync(user,
          CookieAuthenticationDefaults.AuthenticationType);

        UserProfile justCreatedIdentity = await UserManager.FindByNameAsync(user.UserName);
        IList<string> roles = await UserManager.GetRolesAsync(justCreatedIdentity.Id);

        AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName,
          roles.ToArray(),
          true,
          user.Activated);
        Authentication.SignIn(properties,
          oAuthIdentity,
          cookieIdentity);
      }
      else
      {
        IEnumerable<Claim> claims = externalLogin.GetClaims();
        var identity = new ClaimsIdentity(claims,
          OAuthDefaults.AuthenticationType);
        Authentication.SignIn(identity);
      }

      return Ok();
    }

    /// <summary>
    ///   Get all external logins
    /// </summary>
    /// <param name="returnUrl">The return url</param>
    /// <param name="generateState">generate a random state for being stored and compared on the client and avoid CSRF attacks</param>
    /// <returns>External logins list</returns>
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("ExternalLogins")]
    public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
    {
      if (!IsLocalUrl(returnUrl))
      {
        ModelState.AddModelError("returnUrl",
          "Can´t redirect to external urls");
        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
          ModelState));
      }

      IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
      var logins = new List<ExternalLoginViewModel>();

      string state;

      if (generateState)
      {
        const int strengthInBits = 256;
        state = RandomOAuthStateGenerator.Generate(strengthInBits);
      }
      else
      {
        state = null;
      }

      foreach (AuthenticationDescription description in descriptions)
      {
        var login = new ExternalLoginViewModel{
                                                Name = description.Caption,
                                                Url = Url.Route("ExternalLogin",
                                                  new{
                                                       provider = description.AuthenticationType,
                                                       response_type = "token",
                                                       client_id = Startup.PublicClientId,
                                                       redirect_uri = new Uri(Request.RequestUri,
                                                  returnUrl).AbsoluteUri,
                                                       state
                                                     }),
                                                State = state
                                              };
        logins.Add(login);
      }

      return logins;
    }

    // POST api/Account/Register
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("Register")]
    public async Task<IHttpActionResult> Register(RegisterBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var user = new UserProfile
      {
        UserName = model.UserName,
        FirstName = model.FirstName,
        LastName = model.LastName,
        PhoneNumber = model.PhoneNumber,
        Email = model.Email,
        EmailConfirmed = false,
      };

      if (model.NetworkId != null)
      {
        Guid networkId = Guid.Parse(model.NetworkId);
        Network network = _unitOfWork.NetworkRepository.First(n => n.NetworkId == networkId, "NetworkCompanies");
        NetworkCompany nc = CreateCompany(model, network);
        network.NetworkCompanies.Add(nc);
        user.CompanyId = nc.Company.CompanyId;
      }
      else if (model.CompanyId != null)
      {
        user.CompanyId = Guid.Parse(model.CompanyId);
      }

      _unitOfWork.Commit();

      IdentityResult identityResult = await UserManager.CreateAsync(user,
        model.Password);
      
      if (identityResult.Succeeded && (model.NetworkId != null || model.CompanyId != null))
      {
        UserManager.AddToRole(user.Id,
          "User");
      }

      IHttpActionResult createResult = GetErrorResult(identityResult);

      if (createResult != null)
      {
        return createResult;
      }

      UserProfile justCreatedUser = await UserManager.FindByNameAsync(model.UserName);

      string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

      string callbackUrl = Url.Link("ConfirmEmail",
        new{
             userId = user.Id,
             code
           });

      var notification = new AccountNotificationModel{
                                                       Code = code,
                                                       Url = callbackUrl,
                                                       UserId = justCreatedUser.Id,
                                                       Email = justCreatedUser.Email,
                                                       DisplayName = justCreatedUser.UserName
                                                     };

      string body = ViewRenderer.RenderView("~/Views/Mailer/NewAccount.cshtml",
        notification);

      await UserManager.SendEmailAsync(user.Id,
        "EnergieNetz: Konto aktivieren",
        body);

      DeleteInvitation(model);

      return Ok();
    }

    private void DeleteInvitation(RegisterBindingModel model)
    {
      Guid invitationId = Guid.Parse(model.InvitationId);

      Invitation invitation = _unitOfWork.InvitationRepository.Get(i => i.InvitationId == invitationId).
        First();
      _unitOfWork.InvitationRepository.Delete(invitation);

    }

    private NetworkCompany CreateCompany(RegisterBindingModel model, Network network)
    {
      ICollection<Survey> surveys = CreateSurveys(network);

      var address = new Address{
                                 AddressId = Guid.NewGuid(),
                                 Street = model.Street,
                                 PostalCode = model.PostalCode,
                                 City = model.City,
                                 Website = model.Website,
                                 Lat = model.Lat,
                                 Lon = model.Lon
                               };

      var company = new Company{
                                 CompanyId = Guid.NewGuid(),
                                 Name = model.CompanyName,
                                 Address = address
                               };
      
      return new NetworkCompany{
                                                                   NetworkCompanyId = Guid.NewGuid(),
                                                                   Company = company,
                                                                   Surveys = surveys,
                                                                   Network = network
                                                                 };
    }

      private ICollection<Survey> CreateSurveys(Network network)
      {
          ICollection<Survey> surveys = new Collection<Survey>();
          Survey survey;
          
          int year = DateTime.Now.Year;
          for (int i = year - 1; i <= network.EndDate.Year; i++)
          {
              survey = new Survey{
                                     SurveyId = Guid.NewGuid(),
                                     Title = i.ToString(),
                                     Date = new DateTime(i, 1, 1)
                                 };
              surveys.Add(survey);
          }

          return surveys;
    }

    // POST api/Account/RegisterExternal
    [System.Web.Http.OverrideAuthentication]
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [System.Web.Http.Route("RegisterExternal")]
    public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

      if (externalLogin == null)
      {
        return InternalServerError();
      }

      var user = new UserProfile{
                                  UserName = model.UserName,
                                  Email = model.Email,
                                  EmailConfirmed = true
                                };

      user.Logins.Add(new IdentityUserLogin{
                                             LoginProvider = externalLogin.LoginProvider,
                                             ProviderKey = externalLogin.ProviderKey,
                                             UserId = user.Id
                                           });

      IdentityResult identityResult = await UserManager.CreateAsync(user);

      IHttpActionResult createResult = GetErrorResult(identityResult);

      if (createResult != null)
      {
        return createResult;
      }

      UserProfile justCreatedUser = await UserManager.FindByNameAsync(model.UserName);

      IdentityResult roleResult = await UserManager.AddToRoleAsync(justCreatedUser.Id,
        "User");

      IHttpActionResult addRoleResult = GetErrorResult(roleResult);

      if (addRoleResult != null)
      {
        return addRoleResult;
      }

      return Ok();
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator, User")]
    [System.Web.Http.Route("HasPermission")]
    public async Task<HttpStatusCodeResult> HasPermission(string id)
    {
      Guid companyId;
      if (!Guid.TryParse(id,
        out companyId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
      }

      var company = _unitOfWork.CompanyRepository.First(c => c.CompanyId == companyId);

      if (company == null)
      {
        return new HttpStatusCodeResult(HttpStatusCode.NotFound);
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());
      if (!UserManager.HasPermission(userProfile,
        company.CompanyId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
      }
      return new HttpStatusCodeResult(HttpStatusCode.OK);
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("isUsernameInUse")]
    public Boolean IsUsernameInUse(string username)
    {
      UserProfile profile = UserManager.FindByName(username);

      return profile != null; 
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("isEmailInUse")]
    public Boolean IsEmailInUse(string email)
    {
      UserProfile profile = UserManager.FindByEmail(email);

      return profile != null;
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator")]
    [System.Web.Http.Route("Users")]
    public IEnumerable<UserProfileViewModel> Users()
    {
      IQueryable<UserProfile> users = _unitOfWork.UserProfileRepository.All();

      return users.Select(user => new UserProfileViewModel{
                                                            Id = user.Id,
                                                            UserName = user.UserName,
                                                            FirstName = user.FirstName,
                                                            LastName = user.LastName,
                                                            PhoneNumber = user.PhoneNumber,
                                                            Email = user.Email,
                                                            RoleId = user.Roles.FirstOrDefault().
                                                              RoleId,
                                                            Activated = user.Activated,
                                                            CompanyId = user.CompanyId != null ? user.CompanyId.ToString() : null
                                                          });
    }

    [System.Web.Http.ActionName("UpdateUser")]
    [System.Web.Http.HttpPost]
    [System.Web.Http.Authorize(Roles = "Administrator")]
    public async Task<IHttpActionResult> UpdateUser(UserProfileViewModel userProfileViewModel)
    {
      if (ModelState.IsValid)
      {
        UserProfile user = await UserManager.FindByIdAsync(userProfileViewModel.Id);

        if (user == null)
        {
          return BadRequest();
        }

        if (user.Roles.Any())
        {
          IdentityUserRole role = user.Roles.FirstOrDefault();

          if ((!userProfileViewModel.RoleId.IsEmpty() && role != null && !role.RoleId.Equals(userProfileViewModel.RoleId)))
          {
            IdentityResult removeFromRoleResult = UserManager.RemoveFromRole(user.Id,
              RoleManager.FindById(role.RoleId).
                Name);

            IHttpActionResult removeFromRoleErrorResult = GetErrorResult(removeFromRoleResult);

            if (removeFromRoleErrorResult != null)
            {
              return removeFromRoleErrorResult;
            }
            IdentityResult addToRoleResult = await UserManager.AddToRoleAsync(user.Id,
              RoleManager.FindById(userProfileViewModel.RoleId).
                Name);

            IHttpActionResult addToRoleErrorResult = GetErrorResult(addToRoleResult);

            if (addToRoleErrorResult != null)
            {
              return addToRoleErrorResult;
            }
          }
          else if (userProfileViewModel.RoleId.IsEmpty())
          {
            IdentityResult removeFromRoleResult = UserManager.RemoveFromRole(user.Id,
              RoleManager.FindById(role.RoleId).
                Name);

            IHttpActionResult removeFromRoleErrorResult = GetErrorResult(removeFromRoleResult);

            if (removeFromRoleErrorResult != null)
            {
              return removeFromRoleErrorResult;
            }
          }
        }
        else if (!userProfileViewModel.RoleId.IsEmpty())
        {
          IdentityResult addToRoleResult = await UserManager.AddToRoleAsync(user.Id,
            RoleManager.FindById(userProfileViewModel.RoleId).
              Name);

          IHttpActionResult addToRoleErrorResult = GetErrorResult(addToRoleResult);

          if (addToRoleErrorResult != null)
          {
            return addToRoleErrorResult;
          }
        }

        if (!user.Activated && userProfileViewModel.Activated)
        {
          string authority = HttpContext.Current.Request.Url.Authority;

          var url = string.Format("http://{0}/account/login",
            authority);

          var notification = new AccountNotificationModel{
                                                           DisplayName = user.UserName,
                                                           Url = url
                                                         };

          string body = ViewRenderer.RenderView("~/Views/Mailer/accountActivated.cshtml",
            notification);

          await UserManager.SendEmailAsync(user.Id,
            "EnergieNetz: Ihr Konto wurde freigeschaltet",
            body);
        }

        user.Update(userProfileViewModel);

        IdentityResult updateUserResult = await UserManager.UpdateAsync(user);

        if (updateUserResult.Succeeded)
        {
          //var logger = UserManager.AuditLogger;
          //var log = logger.LastLog;
          //log.Username = UserManager.FindById(User.Identity.GetUserId()).UserName;
          //log.ToXml(XmlWriter.Create("../../temp/auditLog.xml"));

          return Ok();
        }

        IHttpActionResult updateUserErrorResult = GetErrorResult(updateUserResult);
        return updateUserErrorResult;
      }
      string errors = ModelState.Values.SelectMany(modelState => modelState.Errors).
        Aggregate(string.Empty,
          (current, error) => current + (error.ErrorMessage + Environment.NewLine));
      throw new Exception(errors);
    }


    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator")]
    [System.Web.Http.Route("UsersGroupedByRoles")]
    public IEnumerable<UsersGroupedByRolesViewModel> UsersGroupedByRoles()
    {
      IOrderedQueryable<UsersGroupedByRolesViewModel> query = (from user in UserManager.Users
        orderby user.UserName
        group user by user.Roles.FirstOrDefault().
          RoleId
        into groupedUsers
        select new UsersGroupedByRolesViewModel{
                                                 RoleId = string.IsNullOrEmpty(groupedUsers.Key) ? Guid.NewGuid().
                                                   ToString() : groupedUsers.Key,
                                                 Name = string.IsNullOrEmpty(RoleManager.Roles.FirstOrDefault(e => e.Id == groupedUsers.Key).
                                                   Name) ? "Unassigned" : RoleManager.Roles.FirstOrDefault(e => e.Id == groupedUsers.Key).
                                                   Name,
                                                 Users = from user in groupedUsers
                                                   select new UserProfileViewModel{
                                                                                    Id = user.Id,
                                                                                    UserName = user.UserName,
                                                                                    FirstName = user.FirstName,
                                                                                    LastName = user.LastName,
                                                                                    Email = user.Email,
                                                                                    PhoneNumber = user.PhoneNumber,
                                                                                    CompanyId = user.CompanyId.ToString(),
                                                                                    RoleId = user.Roles.FirstOrDefault().
                                                                                      RoleId,
                                                                                    Activated = user.Activated
                                                                                  }
                                               }).OrderBy(x => x.Name);

      return query;
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator")]
    [System.Web.Http.Route("Roles")]
    public IEnumerable<IdentityRoleViewModel> Roles()
    {
      return RoleManager.Roles.Select(role => new IdentityRoleViewModel{
                                                                         RoleId = role.Id,
                                                                         Name = role.Name
                                                                       });
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize]
    [System.Web.Http.Route("UsersManage")]
    public UserManageViewModel UsersManage()
    {
      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      return new UserManageViewModel{
                                      Email = userProfile.Email,
                                      FirstName = userProfile.FirstName,
                                      LastName = userProfile.LastName,
                                      PhoneNumber = userProfile.PhoneNumber,
                                      UserName = userProfile.UserName
                                    };
    }

    [System.Web.Http.HttpPost]
    [System.Web.Http.Authorize]
    [System.Web.Http.Route("ChangeUserData")]
    public async Task<IHttpActionResult> ChangeUserData(UserManageViewModel userManageViewModel)
    {
      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      userProfile.Update(userManageViewModel);

      IdentityResult updateUserResult = await UserManager.UpdateAsync(userProfile);

      if (updateUserResult.Succeeded)
      {
        return Ok();
      }

      IHttpActionResult updateUserErrorResult = GetErrorResult(updateUserResult);
      return updateUserErrorResult;
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator")]
    [System.Web.Http.Route("UsersByCompanyId")]
    public IEnumerable<EmployeeViewModel> UsersByCompanyId(string id)
    {
      Guid companyId = Guid.Parse(id);
      ICollection<UserProfile> users = _unitOfWork.CompanyRepository.Get(c => c.CompanyId == companyId,
        null,
        "Employees").
        First().
        Employees;
      //var users = _unitOfwork.EmployeeRepository.Find(e => e.CompanyId == companyId);

      return users.Select(user => new EmployeeViewModel{
                                                         UserName = user.UserName,
                                                         Email = user.Email,
                                                         PhoneNumber = user.PhoneNumber,
                                                         FirstName = user.FirstName,
                                                         LastName = user.LastName
                                                       }).
        ToList();
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("SendContactMessage")]
    public async Task<IHttpActionResult> SendContactMessage(string name, string email, string subject, string message)
    {
      var notification = new ContactMessageNotificationModel{
                                                              Name = name,
                                                              Email = email,
                                                              Subject = subject,
                                                              Message = message
                                                            };

      string body = ViewRenderer.RenderView("~/Views/Mailer/ContactMessage.cshtml",
        notification);

      var msg = new IdentityMessage{
                                     Destination = "xxxxx@xxxxx.com",
                                     Body = body,
                                     Subject = "EnergieNetz: Neue Nachricht von EnergyNetze"
                                   };

      await UserManager.EmailService.SendAsync(msg);

      return Ok();
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.Authorize(Roles = "Administrator, User")]
    [System.Web.Http.Route("SendInvitation")]
    public async Task<string> SendInvitation(string id, string email, string message)
    {
      string authority = HttpContext.Current.Request.Url.Authority;

      var url = string.Format("http://{0}/account/register/{1}",
        authority,
        id);

      var invitationMessage = new InvitationMessageModel{
                                                          Url = url,
                                                        };

      string body = ViewRenderer.RenderView("~/Views/Mailer/InvitationMessage.cshtml",
        invitationMessage);

      var msg = new IdentityMessage{
                                     Destination = email,
                                     Body = body,
                                     Subject = "EnergieNetz: Sie wurden zu einem Netzwerk eingeladen"
                                   };

      await UserManager.EmailService.SendAsync(msg);

      return email;
    }

    [System.Web.Http.HttpGet]
    [System.Web.Http.AllowAnonymous]
    [System.Web.Http.Route("GetInvitationById")]
    public Object GetInvitationById(string id)
    {
      Guid invitationId = Guid.Parse(id);

      Invitation invitation = _unitOfWork.InvitationRepository.Get(i => i.InvitationId == invitationId).
        FirstOrDefault();

      if (invitation != null)
      {
        return new{
                    invitationId = invitation.InvitationId,
                    networkId = invitation.NetworkId,
                    companyId = invitation.CompanyId
                  };
      }
      return false;
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        if (UserManager != null)
        {
          UserManager.Dispose();
        }
      }

      base.Dispose(disposing);
    }

    #region Aplicaciones auxiliares

    private IAuthenticationManager Authentication
    {
      get
      {
        return Request.GetOwinContext().
          Authentication;
      }
    }

    private IHttpActionResult GetErrorResult(IdentityResult result)
    {
      if (result == null)
      {
        return InternalServerError();
      }

      if (!result.Succeeded)
      {
        if (result.Errors != null)
        {
          foreach (string error in result.Errors)
          {
            ModelState.AddModelError("",
              error);
          }
        }

        if (ModelState.IsValid)
        {
          // No errors in ModelState, return empty BadRequest
          return BadRequest();
        }

        return BadRequest(ModelState);
      }

      return null;
    }

    private bool IsLocalUrl(string url)
    {
      if (string.IsNullOrEmpty(url))
      {
        return false;
      }

      Uri absoluteUri;
      if (Uri.TryCreate(url,
        UriKind.Absolute,
        out absoluteUri))
      {
        return String.Equals(Request.RequestUri.Host,
          absoluteUri.Host,
          StringComparison.OrdinalIgnoreCase);
      }
      bool isLocal = !url.StartsWith("http:",
        StringComparison.OrdinalIgnoreCase) && !url.StartsWith("https:",
          StringComparison.OrdinalIgnoreCase) && Uri.IsWellFormedUriString(url,
            UriKind.Relative);
      return isLocal;
    }

    private class ExternalLoginData
    {
      public string LoginProvider { get; set; }
      public string ProviderKey { get; set; }
      public string UserName { get; set; }

      public IList<Claim> GetClaims()
      {
        IList<Claim> claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.NameIdentifier,
          ProviderKey,
          null,
          LoginProvider));

        if (UserName != null)
        {
          claims.Add(new Claim(ClaimTypes.Name,
            UserName,
            null,
            LoginProvider));
        }

        return claims;
      }

      public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
      {
        if (identity == null)
        {
          return null;
        }

        Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

        if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer) || String.IsNullOrEmpty(providerKeyClaim.Value))
        {
          return null;
        }

        if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
        {
          return null;
        }

        return new ExternalLoginData{
                                      LoginProvider = providerKeyClaim.Issuer,
                                      ProviderKey = providerKeyClaim.Value,
                                      UserName = identity.FindFirstValue(ClaimTypes.Name)
                                    };
      }
    }

    private static class RandomOAuthStateGenerator
    {
      private static readonly RandomNumberGenerator _random = new RNGCryptoServiceProvider();

      public static string Generate(int strengthInBits)
      {
        const int bitsPerByte = 8;

        if (strengthInBits % bitsPerByte != 0)
        {
          throw new ArgumentException("strengthInBits should be divisible by 8.",
            "strengthInBits");
        }

        int strengthInBytes = strengthInBits / bitsPerByte;

        var data = new byte[strengthInBytes];
        _random.GetBytes(data);
        return HttpServerUtility.UrlTokenEncode(data);
      }
    }

    #endregion
  }
}