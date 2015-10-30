using System.Collections.Generic;

namespace EnergyNetwork.Web.Models
{
  // AccountController view  models
  public class ExternalLoginViewModel
  {
    public string Name { get; set; }

    public string Url { get; set; }

    public string State { get; set; }
  }

  public class ManageInfoViewModel
  {
    public string LocalLoginProvider { get; set; }

    public string UserName { get; set; }

    public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

    public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
  }

  public class UserInfoViewModel
  {
    public string UserName { get; set; }

    public bool IsEmailConfirmed { get; set; }

    public bool HasRegistered { get; set; }

    public string LoginProvider { get; set; }

    public IEnumerable<string> Roles { get; set; }

    public bool IsActivated { get; set; }
  }

  public class UserLoginInfoViewModel
  {
    public string LoginProvider { get; set; }

    public string ProviderKey { get; set; }
  }

  public class IdentityRoleViewModel
  {
    public string RoleId { get; set; }
    public string Name { get; set; }
  }

  public class UsersGroupedByRolesViewModel
  {
    public string RoleId { get; set; }
    public string Name { get; set; }

    public IEnumerable<UserProfileViewModel> Users { get; set; }
  }

  public class UserManageViewModel
  {
    public string Id { get; set; }

    public string UserName { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }
  }

  public class UserProfileViewModel
  {
    public string Id { get; set; }

    public string UserName { get; set; }


    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }

    public bool Activated { get; set; }

    public string RoleId { get; set; }

    public string CompanyId { get; set; }
  }

  public class EmployeeViewModel
  {
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }

    public string UserName { get; set; }
  }

  public class AccountNotificationModel
  {
    public string UserId { get; set; }

    public string DisplayName { get; set; }

    public string Code { get; set; }

    public string Url { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }
  }

  public class AccountConfirmNotificationModel
  {
    public string DisplayName { get; set; }

    public string Url { get; set; }
  }

  public class InvitationMessageModel
  {
    public string Url { get; set; }
  }

  public class ContactMessageNotificationModel
  {
    public string Name { get; set; }

    public string Email { get; set; }

    public string Subject { get; set; }

    public string Message { get; set; }
  }
}